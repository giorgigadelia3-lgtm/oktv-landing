(function () {
  const LANGUAGE_KEY = "oktv_lang";
  const OKAI_SESSION_KEY = "oktv_okai_session";
  const OKAI_HISTORY_KEY = "oktv_okai_history";
  const CHAT_ENDPOINT = window.OKAI_CHAT_ENDPOINT;
  if (!CHAT_ENDPOINT) {
    console.error("OKAI_CHAT_ENDPOINT missing");
  }
  const QUICK_PROMPT_LABEL = "არხების ჩამონათვალი";
  const FIXED_CHANNEL_LIST = `არხების ჩამონათვალი:								 
	გადახვევის 				
				პერიოდი /TimeShift/				
				3დღე	
	
	! საბაზისო		0 ლარი
		
	საქართველოს საზოგადოებრივი მაუწებლობა	-		https://app.oktv.ge/channels/2/416				 
	პარლამენტი	-	https://app.oktv.ge/channels/2/425					 
	Music Box	-		https://app.oktv.ge/channels/2/3473				 
	TV 4		-				https://app.oktv.ge/channels/2/tv-4	 
	ერთსულოვნება		-	https://app.oktv.ge/channels/2/8460				 
								
!	ეკონომი		9 ლარი/თვე					 
								
	იმედი - https://app.oktv.ge/channels/2/421							 
	ტვ პირველი	- https://app.oktv.ge/channels/2/423						 
	ფორმულა	- 		https://app.oktv.ge/channels/2/1476			 
	რუსთავი 2	- https://app.oktv.ge/channels/2/420						 
	პოსტ ტვ		- https://app.oktv.ge/channels/2/7358					 
	GDS		- 		https://app.oktv.ge/channels/2/417			 
	Euronews GE	- https://app.oktv.ge/channels/2/7335						 
	პალიტრა ტვ	- 	https://app.oktv.ge/channels/2/7359					 
	მაესტრო -		https://app.oktv.ge/channels/2/418					 
	აჭარა ტვ	- https://app.oktv.ge/channels/2/ajara						 
	კავკასია	- https://app.oktv.ge/channels/2/kavkasia						 
	ობიექტივი	- https://app.oktv.ge/channels/2/obieqtivi-tv						 
	Georgian Times	- https://app.oktv.ge/channels/2/georgia-times						 
	ქართული არხი	- https://app.oktv.ge/channels/2/qartuli-arxi						 
	რაგბი ტვ			- https://app.oktv.ge/channels/2/ragbi-tv				 
	მარაო			- https://app.oktv.ge/channels/2/marao				 
	კომედი არხი	- https://app.oktv.ge/channels/2/komedi-arxi						 
	ენკი-ბენკი		- https://app.oktv.ge/channels/2/enki-benki					 
	ახალი ფორმულა - https://app.oktv.ge/channels/2/axali-formula					 
	TVC ახალი კომედი		- https://app.oktv.ge/channels/2/axali-komedi					 
	ალტ-ინფო		- https://app.oktv.ge/channels/2/axali-komedi					 
	პულსი			- https://app.oktv.ge/channels/2/pulsi				 
	1 TV Sport		- https://app.oktv.ge/channels/2/8288					 
	Silk universal		- https://app.oktv.ge/channels/2/8441					 
	Euronews			- https://app.oktv.ge/channels/2/7335				 
	BBC World News		- https://app.oktv.ge/channels/2/105					 
	CNN		- 				https://app.oktv.ge/channels/2/2703	 
	DW		- https://app.oktv.ge/channels/2/212					 
	France 24		- https://app.oktv.ge/channels/2/3911					 
	Настоящее Время		- https://app.oktv.ge/channels/2/4262					 
	Рен ТВ			- https://app.oktv.ge/channels/2/7				 
	ТВ Центр		- https://app.oktv.ge/channels/2/38					 
	 FREDOM (UA TV)	- 						 
	C1	- https://app.oktv.ge/channels/2/7360						 
	Ictimai TV		- https://app.oktv.ge/channels/2/436					 
	RAI UNO			- https://app.oktv.ge/channels/2/rai-1				 
	Bridge tv			- https://app.oktv.ge/channels/2/69				 
	Mezzo				- https://app.oktv.ge/channels/2/55			 
	Муз тв				- https://app.oktv.ge/channels/2/10			 
	RU TV				- 			 
	жара				- https://app.oktv.ge/channels/2/357			 
	Cartoоn Network	- 	https://app.oktv.ge/channels/2/52					 
	Jim-Jam		- https://app.oktv.ge/channels/2/166					 
	CTC Kids		- https://app.oktv.ge/channels/2/4332					 
	Da Vinci Learning	- https://app.oktv.ge/channels/2/da-vinci						 
	Уникум				- https://app.oktv.ge/channels/2/98			 
	Мульт				- 	https://app.oktv.ge/channels/2/200		 
	viju tv 1000		- https://app.oktv.ge/channels/2/82					 
	viju tv 1000 русское кино		- https://app.oktv.ge/channels/2/83					 
	Terra		-	https://app.oktv.ge/channels/2/5886				 
	Иллюзион +	- https://app.oktv.ge/channels/2/russkij-illjuzion						 
	Еврокино		- https://app.oktv.ge/channels/2/96					 
	Сапфир		- 	https://app.oktv.ge/channels/2/117				 
	Драйв			- https://app.oktv.ge/channels/2/drajv				 
	Кухня			- https://app.oktv.ge/channels/2/38				 
	viju History	- 	https://app.oktv.ge/channels/2/491					 
	Пятница		- 	https://app.oktv.ge/channels/2/pjatnitsa				 
	CNBC English	- https://app.oktv.ge/channels/2/cnbc-english						 
	Al Arabia Arabic		- 	https://app.oktv.ge/channels/2/8509				 
	CNN Turk		- https://app.oktv.ge/channels/2/cnn-turk					 
	1+1		- https://app.oktv.ge/channels/2/8791					 
	Silk Way TV			- https://app.oktv.ge/channels/2/silk-way-tv				 
								
!	გასართობი		4 ლარი/თვე					 
								
	ТНТ 4 - https://app.oktv.ge/channels/2/tv-4							 
	СТС		- https://app.oktv.ge/channels/2/8					 
	ТНТ Comedy		- https://app.oktv.ge/channels/2/194					 
	Перец		- https://app.oktv.ge/channels/2/484					 
	Сарафан		- https://app.oktv.ge/channels/2/117					 
	Food Network		- https://app.oktv.ge/channels/2/339					 
	Fashion one		- https://app.oktv.ge/channels/2/226					 
	Усадьба		- https://app.oktv.ge/channels/2/80					 
	Домашний		- https://app.oktv.ge/channels/2/115					 
	Охота и Рыбалка		- https://app.oktv.ge/channels/2/88					 
	Домашние животные	- https://app.oktv.ge/channels/2/121						 
	Авто Плюс				- https://app.oktv.ge/channels/2/29			 
	ТВ 3						- https://app.oktv.ge/channels/2/207	 
	POWER TV		- https://app.oktv.ge/channels/2/1988					 
								
!	დოკუმენტური და შემეცნებითი		4 ლარი/თვე					 
								
	viju Explorer	- https://app.oktv.ge/channels/2/997						 
	viju Nature		- https://app.oktv.ge/channels/2/119					 
	Discovery Channel	- https://app.oktv.ge/channels/2/147						 
	Animal Planet			- https://app.oktv.ge/channels/2/175				 
	Оружие		- https://app.oktv.ge/channels/2/366					 
	Психология 21		- https://app.oktv.ge/channels/2/122					 
	English Club	- https://app.oktv.ge/channels/2/157						 
	Зоопарк		- https://app.oktv.ge/contents/2017-zoo-1160444631389765549					 
	Здоровое тв	- https://app.oktv.ge/channels/2/99						 
	Доктор		- https://app.oktv.ge/channels/2/58					 
	24 техно	- https://app.oktv.ge/channels/2/256						 
								
								
!	სპორტი		4 ლარი/თვე					 
								
	Eurosport		- https://app.oktv.ge/channels/2/145					 
	Eurosport 2		- https://app.oktv.ge/channels/2/361 					 
	Бокс ТВ		- 	https://app.oktv.ge/channels/2/482				 
    viju+sport 	- https://app.oktv.ge/channels/2/77					 
	KXL			-  https://app.oktv.ge/channels/2/khl				 
	Extreme Sport	- https://app.oktv.ge/channels/2/extreme-sports						 
	Авто 24		- https://app.oktv.ge/channels/2/256					 
	Sky Sports 1		- https://app.oktv.ge/channels/2/sky-sports-1					 
								
!	სპორტი ექსკლუზივი		4 ლარი/თვე					 
								
	Setanta Sports 1	- https://app.oktv.ge/channels/2/setanta-sports						 
	Setanta Sports 2	- https://app.oktv.ge/channels/2/4301						 
	Setanta Sports 3	- https://app.oktv.ge/channels/2/4301					 
								
!	კინო		4 ლარი/თვე					 
								
	.red		- https://app.oktv.ge/channels/2/5596					 
	.black	- https://app.oktv.ge/channels/2/235						 
	Кинохит	- https://app.oktv.ge/channels/2/33						 
	Мужское Кино	- https://app.oktv.ge/channels/2/209						 
	Киносемья		- 	https://app.oktv.ge/channels/2/13				 
	Киносвидание	- https://app.oktv.ge/channels/2/11						 
	Киномикс			- https://app.oktv.ge/channels/2/167				 
	CINEMA				- 	https://app.oktv.ge/channels/2/223		 
	Киносерия			- https://app.oktv.ge/channels/2/208				 
	Наше Новое Кино	- 	https://app.oktv.ge/channels/2/35					 
	TV XXI			- https://app.oktv.ge/channels/2/84				 
	Русский Иллюзион	- https://app.oktv.ge/channels/2/russkij-illjuzion						 
	Феникс Плюс Кино	- https://app.oktv.ge/channels/2/29						 
	Кинокомедия		- https://app.oktv.ge/channels/2/26					 
	НСТ					- https://app.oktv.ge/channels/2/93		 
	Индийское Кино	- https://app.oktv.ge/channels/2/62						 
	Индиа		- https://app.oktv.ge/channels/2/245					 
	365 Дней ТВ		- https://app.oktv.ge/channels/2/207					 
	Ретро		- https://app.oktv.ge/channels/2/87					 
								
!	პრემიუმ კინო		4 ლარი/თვე					 
								
	Кинеко	- https://app.oktv.ge/channels/2/204						 
	sci-fi	- https://app.oktv.ge/channels/2/102						 
	viju Tv 1000 Action	- https://app.oktv.ge/channels/2/83						 
	viju+ Megahit		- https://app.oktv.ge/channels/2/195					 
	viju+Comedy	- 		https://app.oktv.ge/channels/2/194				 
	viju+Premier	- https://app.oktv.ge/channels/2/196						 
	A 1		- https://app.oktv.ge/channels/2/629					 
	A 2		- https://app.oktv.ge/channels/2/228					 
	Amedia Premium HD	- https://app.oktv.ge/channels/2/187						 
	Amedia Hit		- https://app.oktv.ge/channels/2/632					 
	HBO			- https://app.oktv.ge/channels/2/hbo				 
								
!	ზოგადი საერთაშორისო		4 ლარი/თვე					 
								
	Первый Канал	- https://app.oktv.ge/channels/2/1						 
 	РТР Планета - https://app.oktv.ge/contents/1981-tajna-tretej-planety-911795124375286485						 
	НТВ	- https://app.oktv.ge/channels/2/4						 
	ЦТВ  - https://app.oktv.ge/channels/2/3950							 
	Россия Культура	   -  https://app.oktv.ge/channels/2/59						 
	RTVI		-  https://app.oktv.ge/channels/2/365				 
	MAX	- 	https://app.oktv.ge/channels/2/7361					 
	TRT cocuk	- https://app.oktv.ge/channels/2/2529						 
	TRT 1	- 		https://app.oktv.ge/channels/2/2529				 
	TRT Turkey		- 	https://app.oktv.ge/channels/2/2534				 
	 KAN 11 - ისრაელი - https://app.oktv.ge/channels/2/kan-11							 
	 Makan 33 	- https://app.oktv.ge/channels/2/makan-33						 
	 Keshen 12	- https://app.oktv.ge/channels/2/keshnet-12-470						 
	 Reshnet 13		- https://app.oktv.ge/channels/2/reshnet-13-471					 
	ZDF				- 		https://app.oktv.ge/channels/2/811	 
	Bloomberg English			- https://app.oktv.ge/channels/2/356				 
								
!	18+		4 ლარი/თვე					 
								
	Blue Hustler		- https://app.oktv.ge/channels/2/blue-hustler					 
	Русская Ночь		- https://app.oktv.ge/channels/2/russkaja-noch					 
	PRIVAT			- https://app.oktv.ge/channels/2/private-tv				 
								
	Info Channel				გათიშულია დროებით			
`;
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
  let okaiLauncher;
  let okaiChannelToggle;
  let okaiChannelPanel;
  let okaiHistory = [];
  let isChannelPanelOpen = false;
  let expandedChannelIndex = null;
  let channelItemsCache = null;

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

  function ensureChannelStyles() {
    if (document.getElementById("okaiChannelStyles")) return;
    const style = document.createElement("style");
    style.id = "okaiChannelStyles";
    style.textContent = `
      .okai-header-row {
        display: flex;
        align-items: center;
        gap: 8px;
        flex-wrap: wrap;
        row-gap: 6px;
      }
      .okai-header-text {
        display: flex;
        flex-direction: column;
        gap: 2px;
        min-width: 0;
      }
      .okai-channel-toggle {
        border: 1px solid #f59e0b;
        background: linear-gradient(135deg, #fcd34d, #f59e0b);
        color: #1f2937;
        border-radius: 999px;
        padding: 4px 10px;
        font-size: 0.72rem;
        font-weight: 600;
        cursor: pointer;
        box-shadow: 0 6px 16px rgba(245, 158, 11, 0.35);
        transition: transform 0.15s ease, box-shadow 0.15s ease, filter 0.15s ease;
      }
      .okai-channel-toggle:hover {
        filter: brightness(1.05);
        box-shadow: 0 8px 18px rgba(245, 158, 11, 0.45);
      }
      .okai-channel-toggle:active {
        transform: translateY(1px);
        box-shadow: 0 4px 12px rgba(245, 158, 11, 0.35);
      }
      .okai-channel-panel {
        border-top: 1px solid var(--okai-panel-border);
        background: var(--okai-body-bg);
        padding: 10px 12px;
        max-height: 50vh;
        overflow-y: auto;
      }
      .okai-channel-hint {
        font-size: 0.72rem;
        color: var(--okai-subtitle);
        line-height: 1.5;
        margin-bottom: 8px;
      }
      .okai-channel-section {
        font-size: 0.72rem;
        font-weight: 700;
        color: var(--okai-subtitle);
        padding: 8px 0 4px;
      }
      .okai-channel-item {
        display: flex;
        flex-direction: column;
        gap: 6px;
        padding: 6px 0;
        border-bottom: 1px solid var(--okai-panel-border);
      }
      .okai-channel-item:last-child {
        border-bottom: none;
      }
      .okai-channel-btn {
        width: 100%;
        text-align: left;
        border-radius: 12px;
        border: 1px solid var(--okai-panel-border);
        background: var(--okai-input-bg);
        color: var(--okai-header-text);
        padding: 8px 10px;
        font-size: 0.82rem;
        font-weight: 600;
        cursor: pointer;
      }
      .okai-channel-btn:hover {
        border-color: rgba(59, 130, 246, 0.7);
        box-shadow: 0 6px 12px rgba(15, 23, 42, 0.08);
      }
      .okai-channel-url {
        font-size: 0.72rem;
        color: var(--okai-subtitle);
        padding-left: 6px;
        word-break: break-all;
      }
      .okai-channel-url a {
        color: var(--okai-header-text);
        text-decoration: none;
      }
      .okai-channel-url a:hover {
        text-decoration: underline;
      }
    `;
    document.head.appendChild(style);
  }

  function parseChannelList(text) {
    const items = [];
    const urlRegex = /https?:\/\/\S+/i;
    text.split("\n").forEach((line) => {
      const trimmed = line.replace(/\r/g, "").trim();
      if (!trimmed) return;
      const match = trimmed.match(urlRegex);
      if (match) {
        const url = match[0];
        const beforeUrl = trimmed.slice(0, match.index).trimEnd();
        let name = beforeUrl.replace(/[-–—]+$/, "").trim();
        if (!name) name = beforeUrl.trim();
        items.push({ type: "channel", name, url });
      } else {
        items.push({ type: "section", name: trimmed });
      }
    });
    return items;
  }

  function getChannelItems() {
    if (!channelItemsCache) {
      channelItemsCache = parseChannelList(FIXED_CHANNEL_LIST);
    }
    return channelItemsCache;
  }

  function renderChannelPanel() {
    if (!okaiChannelPanel) return;
    const scrollTop = okaiChannelPanel.scrollTop;
    const list = document.createElement("div");
    list.className = "okai-channel-list";
    const items = getChannelItems();
    items.forEach((item, index) => {
      if (item.type === "channel") {
        const row = document.createElement("div");
        row.className = "okai-channel-item";
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "okai-channel-btn";
        btn.textContent = item.name;
        btn.setAttribute(
          "aria-expanded",
          expandedChannelIndex === index ? "true" : "false"
        );
        btn.addEventListener("click", () => {
          expandedChannelIndex = expandedChannelIndex === index ? null : index;
          renderChannelPanel();
        });
        row.appendChild(btn);
        const urlWrap = document.createElement("div");
        urlWrap.className = "okai-channel-url";
        if (expandedChannelIndex !== index) {
          urlWrap.hidden = true;
        }
        const link = document.createElement("a");
        link.href = item.url;
        link.target = "_blank";
        link.rel = "noopener";
        link.textContent = item.url;
        urlWrap.appendChild(link);
        row.appendChild(urlWrap);
        list.appendChild(row);
      } else {
        const section = document.createElement("div");
        section.className = "okai-channel-section";
        section.textContent = item.name;
        list.appendChild(section);
      }
    });
    const hint = document.createElement("div");
    hint.className = "okai-channel-hint";
    hint.textContent =
      "არხის სახელზე დაჭერისას ქვემოთ გამოჩნდება LIVE ლინკი; ლინკზე დაჭერით გადახვალთ არხის ლაივზე.";
    okaiChannelPanel.innerHTML = "";
    okaiChannelPanel.appendChild(hint);
    okaiChannelPanel.appendChild(list);
    okaiChannelPanel.scrollTop = scrollTop;
  }

  function openChannelPanel() {
    if (!okaiChannelPanel) return;
    ensureChannelStyles();
    isChannelPanelOpen = true;
    okaiChannelPanel.hidden = false;
    renderChannelPanel();
  }

  function closeChannelPanel() {
    if (!okaiChannelPanel) return;
    isChannelPanelOpen = false;
    expandedChannelIndex = null;
    okaiChannelPanel.hidden = true;
  }

  function toggleChannelPanel() {
    if (isChannelPanelOpen) {
      closeChannelPanel();
    } else {
      openChannelPanel();
    }
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

  function isQuickPrompt(text) {
    return text.trim() === QUICK_PROMPT_LABEL;
  }

  async function sendMessage(text) {
    if (!CHAT_ENDPOINT) {
      appendMessage({ from: "bot", text: t("okai.error") });
      return;
    }
    try {
      okaiSendBtn.disabled = true;
      const response = await fetch(CHAT_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          lang: currentLang,
          source: "oktv-landing",
        }),
      });
      const rawText = await response.text();
      let data = null;
      try {
        data = rawText ? JSON.parse(rawText) : null;
      } catch (error) {
        data = null;
      }
      let reply = "";
      if (data && typeof data === "object") {
        reply =
          (typeof data.reply === "string" && data.reply.trim()) ||
          (typeof data.text === "string" && data.text.trim()) ||
          (typeof data.output === "string" && data.output.trim());
      } else if (typeof data === "string") {
        reply = data.trim();
      }
      if (!reply && rawText) {
        reply = rawText.trim();
      }
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

  function toggleWidget(forceOpen) {
    if (!okaiWidget) return;
    const isOpen = okaiWidget.classList.contains("open");
    const next = typeof forceOpen === "boolean" ? forceOpen : !isOpen;
    okaiWidget.classList.toggle("open", next);
    okaiWidget.setAttribute("aria-hidden", next ? "false" : "true");
    if (next) {
      initHistory();
      if (okaiInput) okaiInput.focus();
    } else {
      closeChannelPanel();
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
            <div class="okai-header-text">
              <div class="okai-header-row">
                <div class="okai-title" data-okai-i18n="okai.title"></div>
                <button class="okai-channel-toggle" id="okaiChannelToggle" type="button"></button>
              </div>
              <div class="okai-subtitle" data-okai-i18n="okai.subtitle"></div>
            </div>
            <button class="okai-close" type="button" aria-label="Close">×</button>
          </div>
          <div class="okai-channel-panel" id="okaiChannelPanel" hidden></div>
          <div class="okai-messages" id="okaiMessages"></div>
          <form class="okai-form" id="okaiForm">
            <input class="okai-input" id="okaiInput" type="text" data-okai-i18n-placeholder="okai.placeholder" />
            <button class="okai-send" id="okaiSendBtn" type="submit" data-okai-i18n="okai.send"></button>
          </form>
        </div>
      </div>
    `;

    ensureChannelStyles();

    okaiWidget = document.getElementById("okaiWidget");
    okaiMessages = document.getElementById("okaiMessages");
    okaiInput = document.getElementById("okaiInput");
    okaiSendBtn = document.getElementById("okaiSendBtn");
    okaiChannelToggle = document.getElementById("okaiChannelToggle");
    okaiChannelPanel = document.getElementById("okaiChannelPanel");

    const okaiForm = document.getElementById("okaiForm");
    const okaiClose = root.querySelector(".okai-close");

    if (okaiChannelToggle) {
      okaiChannelToggle.textContent = QUICK_PROMPT_LABEL;
      okaiChannelToggle.addEventListener("click", () => {
        toggleChannelPanel();
      });
    }

    if (okaiClose) {
      okaiClose.addEventListener("click", () => toggleWidget(false));
    }

    if (okaiForm) {
      okaiForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const value = okaiInput.value.trim();
        if (!value) {
          closeChannelPanel();
          return;
        }
        if (isQuickPrompt(value)) {
          okaiInput.value = "";
          openChannelPanel();
          return;
        }
        closeChannelPanel();
        appendMessage({ from: "user", text: value });
        okaiInput.value = "";
        sendMessage(value);
      });
    }

    if (okaiInput) {
      okaiInput.addEventListener("focus", () => {
        closeChannelPanel();
      });
      okaiInput.addEventListener("input", () => {
        closeChannelPanel();
      });
    }

    applyLanguage(currentLang);
  }

  document.addEventListener("DOMContentLoaded", () => {
    okaiLauncher = document.getElementById("okAiChatToggle");
    const okaiIntroCta = document.getElementById("okAiIntroCta");
    buildWidget();
    observeContactMenu();

    if (okaiLauncher) {
      okaiLauncher.addEventListener("click", (event) => {
        event.preventDefault();
        toggleWidget();
      });
    }

    if (okaiIntroCta) {
      okaiIntroCta.addEventListener("click", (event) => {
        event.preventDefault();
        toggleWidget(true);
      });
    }

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && okaiWidget?.classList.contains("open")) {
        toggleWidget(false);
      }
    });
  });
})();
