require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const config = require("./config");
const { findUserByPhone, appendUser } = require("./sheets");
const { sendOtpSms } = require("./smsProvider");

const app = express();

app.use(helmet());
app.use(express.json({ limit: "200kb" }));
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || config.corsOrigin.length === 0) {
        return callback(null, true);
      }
      if (config.corsOrigin.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
  })
);

const startLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 20,
  message: { code: "RATE_LIMITED", message: "Too many requests." },
});

const verifyLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 30,
  message: { code: "RATE_LIMITED", message: "Too many requests." },
});

const otpStore = new Map();

function now() {
  return Date.now();
}

function normalizePhone(raw) {
  return (raw || "").replace(/\s+/g, "");
}

function isValidPhone(phone) {
  return /^\+[1-9]\d{7,14}$/.test(phone);
}

function maskPhone(phone) {
  if (!phone) return "";
  return `${phone.slice(0, 4)}***${phone.slice(-2)}`;
}

function hashOtp(phone, otp) {
  const secret = config.otpHashSecret || config.jwtSecret;
  return crypto.createHmac("sha256", secret).update(`${phone}:${otp}`).digest("hex");
}

function generateOtp() {
  const length = Math.min(Math.max(config.otpLength, 4), 6);
  let otp = "";
  for (let i = 0; i < length; i += 1) {
    otp += crypto.randomInt(0, 10).toString();
  }
  return otp;
}

function getOtpState(phone) {
  return otpStore.get(phone);
}

function setOtpState(phone, state) {
  otpStore.set(phone, state);
}

function clearOtpState(phone) {
  otpStore.delete(phone);
}

function isLocked(state) {
  return state && state.lockedUntil && state.lockedUntil > now();
}

function remainingLockSeconds(state) {
  if (!state || !state.lockedUntil) return 0;
  return Math.max(0, Math.ceil((state.lockedUntil - now()) / 1000));
}

function canSendOtp(state) {
  if (!state) return true;
  if (state.lastSentAt && now() - state.lastSentAt < config.otpResendSeconds * 1000) {
    return false;
  }
  if (state.sendHistory) {
    const cutoff = now() - 60 * 60 * 1000;
    const recent = state.sendHistory.filter((ts) => ts > cutoff);
    return recent.length < config.otpMaxSendsPerHour;
  }
  return true;
}

function recordSend(state) {
  const history = state.sendHistory || [];
  history.push(now());
  state.sendHistory = history.slice(-20);
  state.lastSentAt = now();
}

function getRetryAfter(state) {
  if (!state) return config.otpResendSeconds;
  const since = now() - state.lastSentAt;
  return Math.max(0, config.otpResendSeconds - Math.floor(since / 1000));
}

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

app.post("/api/auth/start", startLimiter, async (req, res) => {
  const phone = normalizePhone(req.body && req.body.phone);
  if (!isValidPhone(phone)) {
    return res.status(400).json({ code: "INVALID_PHONE", message: "Invalid phone." });
  }
  if (!config.jwtSecret) {
    return res.status(500).json({ code: "CONFIG_ERROR", message: "JWT secret missing." });
  }

  let state = getOtpState(phone);
  if (state && isLocked(state)) {
    return res.status(429).json({
      code: "LOCKED",
      message: "Too many invalid attempts.",
      retryAfter: remainingLockSeconds(state),
    });
  }

  if (!canSendOtp(state)) {
    return res.status(429).json({
      code: "RATE_LIMITED",
      message: "Please wait before requesting another code.",
      retryAfter: getRetryAfter(state),
    });
  }

  try {
    const result = await findUserByPhone(phone);
    const otp = generateOtp();
    const hashed = hashOtp(phone, otp);
    const expiresAt = now() + config.otpTtlSeconds * 1000;
    state = {
      hash: hashed,
      expiresAt,
      attempts: 0,
      lockedUntil: null,
      sendHistory: (state && state.sendHistory) || [],
    };
    recordSend(state);
    setOtpState(phone, state);

    await sendOtpSms({ phone, message: `OK TV OTP: ${otp}` });
    console.info("[auth] OTP sent", maskPhone(phone));
    return res.json({ exists: result.exists, otpSent: true });
  } catch (error) {
    console.error("[auth] start failed", error.message);
    const code = error.code || "START_FAILED";
    return res.status(500).json({
      code,
      message: "Failed to send OTP. Please try again later.",
    });
  }
});

app.post("/api/auth/verify", verifyLimiter, async (req, res) => {
  const phone = normalizePhone(req.body && req.body.phone);
  const otp = String(req.body && req.body.otp || "").trim();
  if (!isValidPhone(phone)) {
    return res.status(400).json({ code: "INVALID_PHONE", message: "Invalid phone." });
  }
  if (!config.jwtSecret) {
    return res.status(500).json({ code: "CONFIG_ERROR", message: "JWT secret missing." });
  }
  if (!otp) {
    return res.status(400).json({ code: "OTP_REQUIRED", message: "OTP required." });
  }

  const state = getOtpState(phone);
  if (!state) {
    return res.status(400).json({ code: "OTP_MISSING", message: "OTP not found." });
  }
  if (isLocked(state)) {
    return res.status(429).json({
      code: "LOCKED",
      message: "Too many invalid attempts.",
      retryAfter: remainingLockSeconds(state),
    });
  }
  if (state.expiresAt < now()) {
    clearOtpState(phone);
    return res.status(400).json({ code: "OTP_EXPIRED", message: "OTP expired." });
  }

  const hashed = hashOtp(phone, otp);
  if (hashed !== state.hash) {
    state.attempts += 1;
    if (state.attempts >= config.otpMaxAttempts) {
      state.lockedUntil = now() + config.otpLockMinutes * 60 * 1000;
    }
    setOtpState(phone, state);
    return res.status(400).json({
      code: "OTP_INVALID",
      message: "Invalid OTP.",
      attemptsRemaining: Math.max(0, config.otpMaxAttempts - state.attempts),
    });
  }

  clearOtpState(phone);

  try {
    const existing = await findUserByPhone(phone);
    let user = existing.user;
    if (!existing.exists) {
      const firstName = (req.body && req.body.firstName || "").trim();
      const lastName = (req.body && req.body.lastName || "").trim();
      const city = (req.body && req.body.city || "").trim();
      if (!firstName || !lastName || !city) {
        return res.status(400).json({
          code: "MISSING_FIELDS",
          message: "Missing profile fields.",
        });
      }
      await appendUser({ phone, city, firstName, lastName });
      user = { phone, city, firstName, lastName };
    }

    const token = jwt.sign(
      {
        sub: phone,
        phone: user.phone,
        firstName: user.firstName,
        lastName: user.lastName,
        city: user.city,
      },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn }
    );

    console.info("[auth] verified", maskPhone(phone));
    return res.json({ token, user });
  } catch (error) {
    console.error("[auth] verify failed", error.message);
    return res.status(500).json({
      code: "VERIFY_FAILED",
      message: "Verification failed. Please try again later.",
    });
  }
});

app.get("/api/user/me", (req, res) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.replace("Bearer ", "");
  if (!token) {
    return res.status(401).json({ code: "UNAUTHORIZED", message: "Missing token." });
  }
  try {
    const payload = jwt.verify(token, config.jwtSecret);
    return res.json({
      user: {
        phone: payload.phone,
        firstName: payload.firstName,
        lastName: payload.lastName,
        city: payload.city,
      },
    });
  } catch (error) {
    return res.status(401).json({ code: "UNAUTHORIZED", message: "Invalid token." });
  }
});

app.use((err, req, res, next) => {
  console.error("[server] error", err.message);
  res.status(500).json({ code: "SERVER_ERROR", message: "Unexpected server error." });
});

app.listen(config.port, () => {
  console.log(`[server] running on port ${config.port}`);
});
