function parseNumber(value, fallback) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function parseJson(value) {
  if (!value) return null;
  try {
    return JSON.parse(value);
  } catch (error) {
    return null;
  }
}

const config = {
  port: parseNumber(process.env.PORT, 4000),
  jwtSecret: process.env.JWT_SECRET || "",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "30d",
  otpHashSecret: process.env.OTP_HASH_SECRET || "",
  otpLength: parseNumber(process.env.OTP_LENGTH, 6),
  otpTtlSeconds: parseNumber(process.env.OTP_TTL_SECONDS, 300),
  otpMaxAttempts: parseNumber(process.env.OTP_MAX_ATTEMPTS, 5),
  otpLockMinutes: parseNumber(process.env.OTP_LOCK_MINUTES, 15),
  otpResendSeconds: parseNumber(process.env.OTP_RESEND_SECONDS, 60),
  otpMaxSendsPerHour: parseNumber(process.env.OTP_MAX_SENDS_PER_HOUR, 5),
  corsOrigin: (process.env.CORS_ORIGIN || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean),
  sheetId: process.env.GOOGLE_SHEETS_SPREADSHEET_ID || "",
  sheetName: process.env.GOOGLE_SHEETS_SHEET_NAME || "Sheet1",
  serviceAccountJson: process.env.GOOGLE_SERVICE_ACCOUNT_JSON || "",
  smsProviderUrl: process.env.SMS_PROVIDER_URL || "",
  smsProviderApiKey: process.env.SMS_PROVIDER_API_KEY || "",
  smsProviderHeaders: parseJson(process.env.SMS_PROVIDER_HEADERS_JSON),
  smsProviderBodyTemplate: parseJson(process.env.SMS_PROVIDER_BODY_TEMPLATE_JSON),
};

module.exports = config;
