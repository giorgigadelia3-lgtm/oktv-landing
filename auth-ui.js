(function () {
  const AUTH_TOKEN_KEY = "oktv_auth_token";
  const LANGUAGE_KEY = "oktv_lang";
  const config = window.OKTV_CONFIG || {};
  const AUTH_BASE = config.authApiBaseUrl || "";
  const OTP_RESEND_SECONDS =
    typeof config.authOtpResendSeconds === "number"
      ? config.authOtpResendSeconds
      : 60;

  const translations = {
    ka: {
      "auth.profile": "პროფილი",
      "auth.signin": "რეგისტრაცია / შესვლა",
      "auth.title": "რეგისტრაცია / შესვლა",
      "auth.subtitle": "შესვლა ხდება მობილური ნომრით და ერთჯერადი კოდით.",
      "auth.phone.label": "მობილური ნომერი",
      "auth.phone.placeholder": "+9955XXXXXXXX",
      "auth.firstName.label": "სახელი",
      "auth.lastName.label": "გვარი",
      "auth.city.label": "ქალაქი",
      "auth.sendCode": "კოდის გაგზავნა",
      "auth.verifyCode": "კოდის დადასტურება",
      "auth.otp.label": "OTP კოდი",
      "auth.otp.placeholder": "4-6 ციფრი",
      "auth.resend": "კოდის გამეორება",
      "auth.cancel": "გაუქმება",
      "auth.back": "უკან",
      "auth.timerPrefix": "დარჩა",
      "auth.existingNumber":
        "ეს ნომერი უკვე რეგისტრირებულია. გთხოვ, დაადასტურე OTP და შედი.",
      "auth.invalidPhone": "შეიყვანე ნომერი სწორი ფორმატით (+9955XXXXXXXX).",
      "auth.missingFields": "გთხოვ შეავსე ყველა სავალდებულო ველი.",
      "auth.otpInvalid": "კოდი არასწორია. სცადე თავიდან.",
      "auth.otpExpired": "კოდის ვადა ამოიწურა. გამოითხოვე ახალი კოდი.",
      "auth.rateLimited": "ძალიან ბევრი მცდელობაა. სცადე ცოტა ხანში.",
      "auth.sessionExpired": "სესია დასრულდა. გთხოვ ხელახლა შეხვიდე.",
      "auth.logout": "გასვლა",
      "auth.profileTitle": "პროფილი",
      "auth.profileSubtitle": "შენი მონაცემები",
      "auth.otpSent": "ერთჯერადი კოდი გაგზავნილია.",
    },
    en: {
      "auth.profile": "Profile",
      "auth.signin": "Register / Sign in",
      "auth.title": "Register / Sign in",
      "auth.subtitle": "Sign in with your phone number and one-time code.",
      "auth.phone.label": "Mobile number",
      "auth.phone.placeholder": "+9955XXXXXXXX",
      "auth.firstName.label": "First name",
      "auth.lastName.label": "Last name",
      "auth.city.label": "City",
      "auth.sendCode": "Send code",
      "auth.verifyCode": "Verify code",
      "auth.otp.label": "OTP code",
      "auth.otp.placeholder": "4-6 digits",
      "auth.resend": "Resend code",
      "auth.cancel": "Cancel",
      "auth.back": "Back",
      "auth.timerPrefix": "Time left",
      "auth.existingNumber":
        "This number is already registered. Please verify OTP to sign in.",
      "auth.invalidPhone": "Enter a valid number in international format.",
      "auth.missingFields": "Please fill in all required fields.",
      "auth.otpInvalid": "Incorrect code. Please try again.",
      "auth.otpExpired": "OTP expired. Request a new code.",
      "auth.rateLimited": "Too many attempts. Please try later.",
      "auth.sessionExpired": "Session expired. Please sign in again.",
      "auth.logout": "Log out",
      "auth.profileTitle": "Profile",
      "auth.profileSubtitle": "Your details",
      "auth.otpSent": "OTP has been sent.",
    },
    ru: {
      "auth.profile": "Профиль",
      "auth.signin": "Регистрация / Вход",
      "auth.title": "Регистрация / Вход",
      "auth.subtitle": "Вход по номеру телефона и одноразовому коду.",
      "auth.phone.label": "Номер телефона",
      "auth.phone.placeholder": "+9955XXXXXXXX",
      "auth.firstName.label": "Имя",
      "auth.lastName.label": "Фамилия",
      "auth.city.label": "Город",
      "auth.sendCode": "Отправить код",
      "auth.verifyCode": "Подтвердить код",
      "auth.otp.label": "OTP код",
      "auth.otp.placeholder": "4-6 цифр",
      "auth.resend": "Отправить снова",
      "auth.cancel": "Отмена",
      "auth.back": "Назад",
      "auth.timerPrefix": "Осталось",
      "auth.existingNumber":
        "Этот номер уже зарегистрирован. Подтвердите OTP для входа.",
      "auth.invalidPhone": "Введите номер в международном формате.",
      "auth.missingFields": "Заполните все обязательные поля.",
      "auth.otpInvalid": "Неверный код. Попробуйте снова.",
      "auth.otpExpired": "Срок действия кода истёк.",
      "auth.rateLimited": "Слишком много попыток. Попробуйте позже.",
      "auth.sessionExpired": "Сессия истекла. Войдите снова.",
      "auth.logout": "Выйти",
      "auth.profileTitle": "Профиль",
      "auth.profileSubtitle": "Ваши данные",
      "auth.otpSent": "OTP отправлен.",
    },
  };

  let currentLang = localStorage.getItem(LANGUAGE_KEY) || "ka";

  function t(key) {
    const pack = translations[currentLang] || translations.ka;
    return pack[key] || key;
  }

  function applyAuthLanguage(lang) {
    currentLang = lang || "ka";
    document.querySelectorAll("[data-auth-i18n]").forEach((el) => {
      const key = el.getAttribute("data-auth-i18n");
      if (key) el.textContent = t(key);
    });
    document.querySelectorAll("[data-auth-i18n-placeholder]").forEach((el) => {
      const key = el.getAttribute("data-auth-i18n-placeholder");
      if (key) el.setAttribute("placeholder", t(key));
    });
    if (profileButtonLabel) {
      profileButtonLabel.textContent = authState.user ? t("auth.profile") : t("auth.signin");
    }
  }

  document.addEventListener("oktv:languageChange", (event) => {
    if (event.detail && event.detail.lang) {
      applyAuthLanguage(event.detail.lang);
    }
  });

  function sanitizePhone(raw) {
    if (!raw) return "";
    return raw.replace(/\s+/g, "");
  }

  function isValidPhone(phone) {
    return /^\+[1-9]\d{7,14}$/.test(phone);
  }

  function apiUrl(path) {
    return `${AUTH_BASE}${path}`;
  }

  async function apiRequest(path, options = {}) {
    const url = apiUrl(path);
    const opts = {
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      ...options,
    };
    const response = await fetch(url, opts);
    const contentType = response.headers.get("content-type") || "";
    const data = contentType.includes("application/json")
      ? await response.json()
      : {};
    if (!response.ok) {
      const error = new Error(data.message || "Request failed");
      error.status = response.status;
      error.payload = data;
      throw error;
    }
    return data;
  }

  const authState = {
    token: null,
    user: null,
  };

  let authModalBackdrop;
  let authStatus;
  let authExistingMessage;
  let authDetailsStep;
  let authOtpStep;
  let authPhoneInput;
  let authFirstNameInput;
  let authLastNameInput;
  let authCityInput;
  let authOtpInput;
  let authSendBtn;
  let authVerifyBtn;
  let authResendBtn;
  let authResendTimer;
  let profileButton;
  let profileButtonLabel;
  let profileModalBackdrop;
  let profileName;
  let profilePhone;
  let profileCity;
  let profileLogoutBtn;

  let resendInterval;
  let resendRemaining = 0;
  let currentPhone = "";
  let isExistingUser = false;

  function setStatus(type, message) {
    if (!authStatus) return;
    authStatus.textContent = message || "";
    authStatus.classList.remove("error", "success");
    if (type) authStatus.classList.add(type);
  }

  function resetResendTimer(seconds) {
    resendRemaining = seconds;
    if (authResendBtn) authResendBtn.disabled = resendRemaining > 0;
    if (authResendTimer) {
      authResendTimer.textContent =
        resendRemaining > 0 ? `${t("auth.timerPrefix")}: ${resendRemaining}s` : "";
    }
    if (resendInterval) {
      clearInterval(resendInterval);
    }
    if (resendRemaining > 0) {
      resendInterval = setInterval(() => {
        resendRemaining -= 1;
        if (resendRemaining <= 0) {
          clearInterval(resendInterval);
          resendRemaining = 0;
          if (authResendBtn) authResendBtn.disabled = false;
          if (authResendTimer) authResendTimer.textContent = "";
          return;
        }
        if (authResendTimer) {
          authResendTimer.textContent = `${t("auth.timerPrefix")}: ${resendRemaining}s`;
        }
      }, 1000);
    }
  }

  function showDetailsStep() {
    if (authDetailsStep) authDetailsStep.classList.remove("auth-hidden");
    if (authOtpStep) authOtpStep.classList.add("auth-hidden");
  }

  function showOtpStep() {
    if (authDetailsStep) authDetailsStep.classList.add("auth-hidden");
    if (authOtpStep) authOtpStep.classList.remove("auth-hidden");
  }

  function updateProfileFieldsVisibility() {
    const shouldHide = isExistingUser;
    document.querySelectorAll("[data-auth-profile-field]").forEach((el) => {
      if (shouldHide) {
        el.classList.add("auth-hidden");
      } else {
        el.classList.remove("auth-hidden");
      }
    });
  }

  function openAuthModal() {
    if (!authModalBackdrop) return;
    isExistingUser = false;
    authModalBackdrop.classList.add("open");
    authModalBackdrop.setAttribute("aria-hidden", "false");
    setStatus("", "");
    if (authExistingMessage) authExistingMessage.textContent = "";
    if (authOtpInput) authOtpInput.value = "";
    showDetailsStep();
    updateProfileFieldsVisibility();
  }

  function closeAuthModal() {
    if (!authModalBackdrop) return;
    authModalBackdrop.classList.remove("open");
    authModalBackdrop.setAttribute("aria-hidden", "true");
  }

  function openProfileModal() {
    if (!profileModalBackdrop || !authState.user) return;
    profileName.textContent = `${authState.user.firstName || ""} ${authState.user.lastName || ""}`.trim();
    profilePhone.textContent = authState.user.phone || "";
    profileCity.textContent = authState.user.city || "";
    profileModalBackdrop.classList.add("open");
    profileModalBackdrop.setAttribute("aria-hidden", "false");
  }

  function closeProfileModal() {
    if (!profileModalBackdrop) return;
    profileModalBackdrop.classList.remove("open");
    profileModalBackdrop.setAttribute("aria-hidden", "true");
  }

  function updateProfileButton() {
    if (!profileButtonLabel) return;
    profileButtonLabel.textContent = authState.user ? t("auth.profile") : t("auth.signin");
  }

  function setUser(user, token) {
    authState.user = user || null;
    authState.token = token || null;
    if (token) {
      localStorage.setItem(AUTH_TOKEN_KEY, token);
    } else {
      localStorage.removeItem(AUTH_TOKEN_KEY);
    }
    updateProfileButton();
    document.dispatchEvent(
      new CustomEvent("oktv:authChange", { detail: { user: authState.user } })
    );
  }

  async function loadSession() {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (!token) return;
    try {
      const data = await apiRequest("/api/user/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (data && data.user) {
        setUser(data.user, token);
      }
    } catch (error) {
      console.warn("[auth] session invalid", error);
      setUser(null, null);
    }
  }

  async function startAuth() {
    if (!authPhoneInput) return;
    const phone = sanitizePhone(authPhoneInput.value);
    if (!isValidPhone(phone)) {
      setStatus("error", t("auth.invalidPhone"));
      return;
    }

    authSendBtn.disabled = true;
    setStatus("", "");

    try {
      const data = await apiRequest("/api/auth/start", {
        method: "POST",
        body: JSON.stringify({ phone }),
      });
      isExistingUser = Boolean(data.exists);
      updateProfileFieldsVisibility();
      if (authExistingMessage) {
        authExistingMessage.textContent = data.exists ? t("auth.existingNumber") : "";
      }
      currentPhone = phone;
      showOtpStep();
      resetResendTimer(OTP_RESEND_SECONDS);
      setStatus("success", t("auth.otpSent"));
    } catch (error) {
      const code = (error.payload && error.payload.code) || "";
      if (code === "RATE_LIMITED") {
        const retryAfter = error.payload.retryAfter || 0;
        resetResendTimer(retryAfter || OTP_RESEND_SECONDS);
        setStatus("error", t("auth.rateLimited"));
      } else {
        setStatus("error", error.payload?.message || t("auth.rateLimited"));
      }
    } finally {
      authSendBtn.disabled = false;
    }
  }

  async function verifyAuth() {
    if (!authOtpInput) return;
    const otp = authOtpInput.value.trim();
    if (!otp) {
      setStatus("error", t("auth.otpInvalid"));
      return;
    }

    if (!isExistingUser) {
      if (
        !authFirstNameInput.value.trim() ||
        !authLastNameInput.value.trim() ||
        !authCityInput.value.trim()
      ) {
        setStatus("error", t("auth.missingFields"));
        showDetailsStep();
        return;
      }
    }

    authVerifyBtn.disabled = true;
    setStatus("", "");
    try {
      const payload = {
        phone: currentPhone,
        otp,
      };
      if (!isExistingUser) {
        payload.firstName = authFirstNameInput.value.trim();
        payload.lastName = authLastNameInput.value.trim();
        payload.city = authCityInput.value.trim();
      }
      const data = await apiRequest("/api/auth/verify", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      if (data && data.user && data.token) {
        setUser(data.user, data.token);
        closeAuthModal();
        authOtpInput.value = "";
      }
    } catch (error) {
      const code = (error.payload && error.payload.code) || "";
      if (code === "OTP_EXPIRED") {
        setStatus("error", t("auth.otpExpired"));
      } else if (code === "OTP_INVALID") {
        const attempts = error.payload.attemptsRemaining;
        const message = attempts
          ? `${t("auth.otpInvalid")} (${attempts})`
          : t("auth.otpInvalid");
        setStatus("error", message);
      } else if (code === "RATE_LIMITED") {
        setStatus("error", t("auth.rateLimited"));
      } else {
        setStatus("error", error.payload?.message || t("auth.rateLimited"));
      }
    } finally {
      authVerifyBtn.disabled = false;
    }
  }

  async function resendOtp() {
    if (!currentPhone || resendRemaining > 0) return;
    authSendBtn.disabled = true;
    try {
      await apiRequest("/api/auth/start", {
        method: "POST",
        body: JSON.stringify({ phone: currentPhone }),
      });
      resetResendTimer(OTP_RESEND_SECONDS);
      setStatus("success", t("auth.otpSent"));
    } catch (error) {
      setStatus("error", error.payload?.message || t("auth.rateLimited"));
    } finally {
      authSendBtn.disabled = false;
    }
  }

  function logout() {
    setUser(null, null);
    closeProfileModal();
  }

  function buildAuthUi() {
    let root = document.getElementById("authRoot");
    if (!root) {
      root = document.createElement("div");
      root.id = "authRoot";
      document.body.appendChild(root);
    }

    root.innerHTML = `
      <div class="auth-modal-backdrop" id="authModalBackdrop" aria-hidden="true">
        <div class="auth-modal" role="dialog" aria-modal="true" aria-label="Auth">
          <div class="auth-modal-header">
            <div class="auth-modal-title" data-auth-i18n="auth.title"></div>
            <button class="auth-modal-close" type="button" aria-label="Close">&times;</button>
          </div>
          <div class="auth-modal-subtitle" data-auth-i18n="auth.subtitle"></div>
          <div class="auth-helper" id="authExistingMessage"></div>
          <div class="auth-status" id="authStatus"></div>
          <div class="auth-form" id="authDetailsStep">
            <div class="auth-field">
              <label data-auth-i18n="auth.phone.label"></label>
              <input id="authPhoneInput" type="tel" inputmode="tel" data-auth-i18n-placeholder="auth.phone.placeholder" />
            </div>
            <div class="auth-field" data-auth-profile-field>
              <label data-auth-i18n="auth.firstName.label"></label>
              <input id="authFirstNameInput" type="text" />
            </div>
            <div class="auth-field" data-auth-profile-field>
              <label data-auth-i18n="auth.lastName.label"></label>
              <input id="authLastNameInput" type="text" />
            </div>
            <div class="auth-field" data-auth-profile-field>
              <label data-auth-i18n="auth.city.label"></label>
              <input id="authCityInput" type="text" />
            </div>
            <div class="auth-actions">
              <button class="auth-btn" id="authSendBtn" type="button" data-auth-i18n="auth.sendCode"></button>
              <button class="auth-btn auth-btn-secondary" id="authCancelBtn" type="button" data-auth-i18n="auth.cancel"></button>
            </div>
          </div>
          <div class="auth-form auth-hidden" id="authOtpStep">
            <div class="auth-field">
              <label data-auth-i18n="auth.otp.label"></label>
              <input id="authOtpInput" type="text" inputmode="numeric" data-auth-i18n-placeholder="auth.otp.placeholder" />
            </div>
            <div class="auth-resend auth-helper">
              <button class="auth-resend-btn" id="authResendBtn" type="button" data-auth-i18n="auth.resend"></button>
              <span id="authResendTimer"></span>
            </div>
            <div class="auth-actions">
              <button class="auth-btn" id="authVerifyBtn" type="button" data-auth-i18n="auth.verifyCode"></button>
              <button class="auth-btn auth-btn-secondary" id="authBackBtn" type="button" data-auth-i18n="auth.back"></button>
            </div>
          </div>
        </div>
      </div>
      <div class="auth-modal-backdrop" id="profileModalBackdrop" aria-hidden="true">
        <div class="auth-modal auth-profile-modal" role="dialog" aria-modal="true" aria-label="Profile">
          <div class="auth-modal-header">
            <div class="auth-modal-title" data-auth-i18n="auth.profileTitle"></div>
            <button class="auth-modal-close" type="button" aria-label="Close">&times;</button>
          </div>
          <div class="auth-modal-subtitle" data-auth-i18n="auth.profileSubtitle"></div>
          <div class="auth-profile-details">
            <div class="auth-profile-name" id="profileName"></div>
            <div class="auth-profile-phone" id="profilePhone"></div>
            <div class="auth-profile-meta" id="profileCity"></div>
          </div>
          <div class="auth-actions" style="margin-top: 16px;">
            <button class="auth-btn auth-btn-secondary" id="authLogoutBtn" type="button" data-auth-i18n="auth.logout"></button>
          </div>
        </div>
      </div>
    `;

    authModalBackdrop = document.getElementById("authModalBackdrop");
    profileModalBackdrop = document.getElementById("profileModalBackdrop");
    authStatus = document.getElementById("authStatus");
    authExistingMessage = document.getElementById("authExistingMessage");
    authDetailsStep = document.getElementById("authDetailsStep");
    authOtpStep = document.getElementById("authOtpStep");
    authPhoneInput = document.getElementById("authPhoneInput");
    authFirstNameInput = document.getElementById("authFirstNameInput");
    authLastNameInput = document.getElementById("authLastNameInput");
    authCityInput = document.getElementById("authCityInput");
    authOtpInput = document.getElementById("authOtpInput");
    authSendBtn = document.getElementById("authSendBtn");
    authVerifyBtn = document.getElementById("authVerifyBtn");
    authResendBtn = document.getElementById("authResendBtn");
    authResendTimer = document.getElementById("authResendTimer");
    profileName = document.getElementById("profileName");
    profilePhone = document.getElementById("profilePhone");
    profileCity = document.getElementById("profileCity");
    profileLogoutBtn = document.getElementById("authLogoutBtn");

    root.querySelectorAll(".auth-modal-close").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (authModalBackdrop.classList.contains("open")) closeAuthModal();
        if (profileModalBackdrop.classList.contains("open")) closeProfileModal();
      });
    });

    authModalBackdrop.addEventListener("click", (event) => {
      if (event.target === authModalBackdrop) closeAuthModal();
    });
    profileModalBackdrop.addEventListener("click", (event) => {
      if (event.target === profileModalBackdrop) closeProfileModal();
    });

    document.getElementById("authCancelBtn").addEventListener("click", closeAuthModal);
    document.getElementById("authBackBtn").addEventListener("click", showDetailsStep);

    authSendBtn.addEventListener("click", startAuth);
    authVerifyBtn.addEventListener("click", verifyAuth);
    authResendBtn.addEventListener("click", resendOtp);
    profileLogoutBtn.addEventListener("click", logout);
  }

  function mountProfileButton() {
    const header = document.querySelector(".header-cta");
    if (!header) return;
    profileButton = document.createElement("button");
    profileButton.type = "button";
    profileButton.className = "auth-profile-btn";
    profileButton.innerHTML = `
      <span class="auth-profile-pill">OK</span>
      <span id="authProfileLabel"></span>
    `;
    header.insertBefore(profileButton, header.firstChild);
    profileButtonLabel = document.getElementById("authProfileLabel");
    profileButton.addEventListener("click", () => {
      if (authState.user) {
        openProfileModal();
      } else {
        isExistingUser = false;
        updateProfileFieldsVisibility();
        openAuthModal();
      }
    });
    updateProfileButton();
  }

  document.addEventListener("DOMContentLoaded", () => {
    buildAuthUi();
    mountProfileButton();
    applyAuthLanguage(currentLang);
    loadSession();
  });

  window.OKTV_AUTH = {
    getToken: () => authState.token,
    getUser: () => authState.user,
    isAuthenticated: () => Boolean(authState.user && authState.token),
    openAuthModal,
  };
})();
