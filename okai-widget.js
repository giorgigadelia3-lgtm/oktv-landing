(function () {
  const LANGUAGE_KEY = "oktv_lang";
  const OKAI_SESSION_KEY = "oktv_okai_session";
  const OKAI_HISTORY_KEY = "oktv_okai_history";
  const config = window.OKTV_CONFIG || {};
  const BACKEND_URL = config.okaiWebhookUrl || "";

  const translations = {
    ka: {
      "okai.title": "OK AI ასისტენტი",
      "okai.subtitle": "სანდო ციფრული ასისტენტი OK TV-სთვის",
      "okai.placeholder": "დაწერე კითხვა...",
      "okai.send": "გაგზავნა",
      "okai.gate":
        "OK AI მუშაობს მხოლოდ რეგისტრირებული მომხმარებლებისთვის. გთხოვ, დარეგისტრირდი გასაგრძელებლად.",
      "okai.gateCta": "რეგისტრაცია / შესვლა",
      "okai.error":
        "⛅ ამ წუთას ვერ ვუკავშირდები OK AI სერვერს. სცადე ცოტა ხანში თავიდან.",
    },
    en: {
      "okai.title": "OK AI Assistant",
      "okai.subtitle": "Trusted digital assistant for OK TV",
      "okai.placeholder": "Type your question...",
      "okai.send": "Send",
      "okai.gate":
        "OK AI is available only to registered users. Please register to continue.",
      "okai.gateCta": "Register / Sign in",
      "okai.error":
        "⛅ I can't reach the OK AI server right now. Please try again later.",
    },
    ru: {
      "okai.title": "Ассистент OK AI",
      "okai.subtitle": "Надёжный цифровой ассистент OK TV",
      "okai.placeholder": "Введите вопрос...",
      "okai.send": "Отправить",
      "okai.gate":
        "OK AI доступен только зарегистрированным пользователям. Пожалуйста, войдите.",
      "okai.gateCta": "Регистрация / Вход",
      "okai.error":
        "⛅ Сейчас не удается подключиться к серверу OK AI. Попробуйте позже.",
    },
  };

  let currentLang = localStorage.getItem(LANGUAGE_KEY) || "ka";
  let okaiWidget;
  let okaiMessages;
  let okaiInput;
  let okaiSendBtn;
  let okaiGate;
  let okaiGateBtn;
  let okaiLauncher;
  let okaiHistory = [];

  function t(key) {
    const pack = translations[currentLang] || translations.ka;
    return pack[key] || key;
  }

  function applyLanguage(lang) {
    currentLang = lang || "ka";
    document.querySelectorAll("[data-okai-i18n]").forEach((el) => {
      const key = el.getAttribute("data-okai-i18n");
      if (key) el.textContent = t(key);
    });
    document.querySelectorAll("[data-okai-i18n-placeholder]").forEach((el) => {
      const key = el.getAttribute("data-okai-i18n-placeholder");
      if (key) el.setAttribute("placeholder", t(key));
    });
  }

  document.addEventListener("oktv:languageChange", (event) => {
    if (event.detail && event.detail.lang) {
      applyLanguage(event.detail.lang);
    }
  });

  function setOkAiVisibility(isVisible) {
    if (!okaiLauncher) return;
    okaiLauncher.classList.toggle("okai-hidden", !isVisible);
  }

  function observeContactMenu() {
    const contactMenu = document.getElementById("contactMenu");
    if (!contactMenu) return;
    const observer = new MutationObserver(() => {
      const isOpen = contactMenu.classList.contains("open");
      setOkAiVisibility(!isOpen);
    });
    observer.observe(contactMenu, { attributes: true, attributeFilter: ["class"] });
    setOkAiVisibility(!contactMenu.classList.contains("open"));
  }

  function loadHistory() {
    try {
      const raw = localStorage.getItem(OKAI_HISTORY_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      return [];
    }
  }

  function saveHistory() {
    localStorage.setItem(OKAI_HISTORY_KEY, JSON.stringify(okaiHistory));
  }

  function appendMessage({ from, text }, persist = true) {
    if (!okaiMessages) return;
    const msg = document.createElement("div");
    msg.className = `okai-msg ${from}`;
    msg.innerHTML = text;
    okaiMessages.appendChild(msg);
    okaiMessages.scrollTop = okaiMessages.scrollHeight;
    if (persist) {
      okaiHistory.push({ from, text });
      saveHistory();
    }
  }

  function initHistory() {
    okaiHistory = loadHistory();
    okaiMessages.innerHTML = "";
    if (okaiHistory.length) {
      okaiHistory.forEach((item) => appendMessage(item, false));
    }
  }

  function ensureSessionId() {
    let sessionId = localStorage.getItem(OKAI_SESSION_KEY);
    if (!sessionId) {
      sessionId =
        typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
          ? crypto.randomUUID()
          : String(Date.now());
      localStorage.setItem(OKAI_SESSION_KEY, sessionId);
    }
    return sessionId;
  }

  async function sendMessage(text) {
    if (!BACKEND_URL) {
      appendMessage({ from: "bot", text: t("okai.error") });
      return;
    }
    const sessionId = ensureSessionId();
    try {
      okaiSendBtn.disabled = true;
      const response = await fetch(BACKEND_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          sessionId,
          language: currentLang,
          source: "oktv-landing",
          page: "site-widget",
          consent: localStorage.getItem("oktv_cookieConsent") || "unknown",
        }),
      });
      const rawText = await response.text();
      let data = null;
      try {
        data = rawText ? JSON.parse(rawText) : null;
      } catch (error) {
        data = null;
      }
      const reply =
        (data && typeof data.reply === "string" && data.reply.trim()) ||
        (data && typeof data.message === "string" && data.message.trim()) ||
        (data && typeof data.text === "string" && data.text.trim()) ||
        (data && typeof data.output === "string" && data.output.trim());
      const cleaned = reply ? reply.replace(/\[?Used tools:\]?[\s\S]*$/i, "").trim() : "";
      if (!response.ok || !cleaned) {
        appendMessage({ from: "bot", text: t("okai.error") });
        return;
      }
      appendMessage({ from: "bot", text: cleaned });
    } catch (error) {
      appendMessage({ from: "bot", text: t("okai.error") });
    } finally {
      if (okaiSendBtn) okaiSendBtn.disabled = false;
    }
  }

  function isAuthenticated() {
    return window.OKTV_AUTH && window.OKTV_AUTH.isAuthenticated();
  }

  function updateGate() {
    const locked = !isAuthenticated();
    if (okaiGate) okaiGate.classList.toggle("auth-hidden", !locked);
    if (okaiSendBtn) okaiSendBtn.disabled = locked;
    if (okaiInput) okaiInput.disabled = locked;
  }

  function toggleWidget(forceOpen) {
    if (!okaiWidget) return;
    const isOpen = okaiWidget.classList.contains("open");
    const next = typeof forceOpen === "boolean" ? forceOpen : !isOpen;
    okaiWidget.classList.toggle("open", next);
    okaiWidget.setAttribute("aria-hidden", next ? "false" : "true");
    if (next) {
      initHistory();
      updateGate();
      if (okaiInput) okaiInput.focus();
    }
  }

  function buildWidget() {
    let root = document.getElementById("okaiRoot");
    if (!root) {
      root = document.createElement("div");
      root.id = "okaiRoot";
      document.body.appendChild(root);
    }

    root.innerHTML = `
      <div class="okai-widget" id="okaiWidget" aria-hidden="true">
        <div class="okai-panel" role="dialog" aria-modal="false" aria-label="OK AI">
          <div class="okai-header">
            <div>
              <div class="okai-title" data-okai-i18n="okai.title"></div>
              <div class="okai-subtitle" data-okai-i18n="okai.subtitle"></div>
            </div>
            <button class="okai-close" type="button" aria-label="Close">×</button>
          </div>
          <div class="okai-gate auth-hidden" id="okaiGate">
            <div data-okai-i18n="okai.gate"></div>
            <button type="button" id="okaiGateBtn" data-okai-i18n="okai.gateCta"></button>
          </div>
          <div class="okai-messages" id="okaiMessages"></div>
          <form class="okai-form" id="okaiForm">
            <input class="okai-input" id="okaiInput" type="text" data-okai-i18n-placeholder="okai.placeholder" />
            <button class="okai-send" id="okaiSendBtn" type="submit" data-okai-i18n="okai.send"></button>
          </form>
        </div>
      </div>
    `;

    okaiWidget = document.getElementById("okaiWidget");
    okaiMessages = document.getElementById("okaiMessages");
    okaiInput = document.getElementById("okaiInput");
    okaiSendBtn = document.getElementById("okaiSendBtn");
    okaiGate = document.getElementById("okaiGate");
    okaiGateBtn = document.getElementById("okaiGateBtn");

    const okaiForm = document.getElementById("okaiForm");
    const okaiClose = root.querySelector(".okai-close");

    if (okaiClose) {
      okaiClose.addEventListener("click", () => toggleWidget(false));
    }

    if (okaiForm) {
      okaiForm.addEventListener("submit", (event) => {
        event.preventDefault();
        if (!isAuthenticated()) {
          updateGate();
          if (window.OKTV_AUTH && window.OKTV_AUTH.openAuthModal) {
            window.OKTV_AUTH.openAuthModal();
          }
          return;
        }
        const value = okaiInput.value.trim();
        if (!value) return;
        appendMessage({ from: "user", text: value });
        okaiInput.value = "";
        sendMessage(value);
      });
    }

    if (okaiGateBtn) {
      okaiGateBtn.addEventListener("click", () => {
        if (window.OKTV_AUTH && window.OKTV_AUTH.openAuthModal) {
          window.OKTV_AUTH.openAuthModal();
        }
      });
    }

    applyLanguage(currentLang);
  }

  document.addEventListener("oktv:authChange", updateGate);

  document.addEventListener("DOMContentLoaded", () => {
    okaiLauncher = document.getElementById("okAiChatToggle");
    buildWidget();
    observeContactMenu();
    updateGate();

    if (okaiLauncher) {
      okaiLauncher.addEventListener("click", (event) => {
        event.preventDefault();
        toggleWidget();
      });
    }

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && okaiWidget?.classList.contains("open")) {
        toggleWidget(false);
      }
    });
  });
})();
