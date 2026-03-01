const DEFAULT_SETTINGS = {
  cardDetails: [],
  extensionEnabled: !0,
  hittedSites: [],
  sendSiteToGroup: !1,
  botToken: "",
  telegramId: "",
  isVerified: !1,
  telegramUsername: "",
  telegramName: "",
  telegramPhotoUrl: "",
  useCustomBilling: !1,
  userName: "",
  userEmail: "",
  userAddress: "",
  userCity: "",
  userZip: "",
  customCountry: "US",
  proxyEnabled: !1,
  proxyList: [],
};

let state = {
  settings: { ...DEFAULT_SETTINGS },
  otpDatabase: {},
  logs: [],
  totalHits: 0,
};
let cachedIp = "Checking...";

const updateIp = async () => {
  try {
    const e = await fetch("https://api64.ipify.org?format=json");
    const t = await e.json();
    cachedIp = t.ip;
  } catch (e) {
    cachedIp = "Unknown";
  }
};
setInterval(updateIp, 6e4);
updateIp();

const injectLogStyles = () => {
  if (document.getElementById("binary-log-styles")) return;
  const e = document.createElement("style");
  e.id = "binary-log-styles";
  e.textContent = `
      #consoleOutput {
          background: rgba(0, 0, 0, 0.4) !important;
          padding: 15px !important; display: flex !important; flex-direction: column !important;
          gap: 8px !important; border: 1px solid rgba(255,255,255,0.08) !important;
          box-shadow: inset 0 2px 10px rgba(0,0,0,0.5); overflow-y: auto !important;
      }
      .log-card-design {
          background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 8px; padding: 12px; position: relative; flex-shrink: 0; 
          transition: all 0.2s ease; animation: slideIn 0.3s ease-out;
      }
      @keyframes slideIn { from { opacity: 0; transform: translateX(-10px); } to { opacity: 1; transform: translateX(0); } }
      .log-card-design.compact {
          padding: 8px 12px; display: flex; align-items: center; justify-content: space-between;
          border-left: 3px solid #ef4444; height: 45px;
      }
      .compact-left { display: flex; align-items: center; gap: 10px; overflow: hidden; }
      .compact-right { display: flex; align-items: center; gap: 10px; flex-shrink: 0; }
      .compact-time { font-family: monospace; font-size: 10px; color: #a1a1aa; }
      .compact-msg { font-size: 11px; color: #a1a1aa; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 250px; }
      .compact-msg i { margin-right: 6px; color: #ef4444; }
      .compact-card { font-family: 'JetBrains Mono', monospace; font-size: 10px; color: #a1a1aa; background: rgba(0,0,0,0.3); padding: 2px 6px; border-radius: 4px; }
      .log-card-design.full {
          border-left: 3px solid #10b981; background: linear-gradient(90deg, rgba(16, 185, 129, 0.05) 0%, transparent 100%);
      }
      .log-header-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; font-family: 'JetBrains Mono', monospace; font-size: 10px; color: #a1a1aa; }
      .log-badges { display: flex; gap: 8px; }
      .log-pill { background: rgba(0,0,0,0.3); padding: 4px 8px; border-radius: 4px; border: 1px solid rgba(255,255,255,0.05); display: flex; align-items: center; gap: 6px; }
      .log-pill.status.success { color: #10b981; border-color: rgba(16, 185, 129, 0.2); }
      .log-cc-container { display: flex; align-items: center; gap: 12px; background: rgba(0, 0, 0, 0.25); padding: 10px; border-radius: 8px; border: 1px solid rgba(255, 255, 255, 0.03); margin-bottom: 8px; }
      .cc-icon { font-size: 24px; color: #10b981; }
      .cc-details { display: flex; flex-direction: column; gap: 2px; }
      .cc-number { font-family: 'JetBrains Mono', monospace; font-size: 13px; color: #fff; letter-spacing: 1px; font-weight: 600; }
      .cc-extra { display: flex; gap: 10px; font-size: 10px; color: #a1a1aa; }
      .cc-cvv { color: var(--primary); }
      .log-footer-msg { display: flex; align-items: center; gap: 8px; font-size: 11px; color: #10b981; font-weight: 600; }
      .toast-container { position: fixed; bottom: 20px; right: 20px; z-index: 9999; display: flex; flex-direction: column; gap: 12px; pointer-events: none; }
      @media screen and (max-width: 600px) { .toast-container { top: 80px; bottom: auto; left: 50%; transform: translateX(-50%); right: auto; width: 95%; max-width: 400px; } }
  `;
  document.head.appendChild(e);
};

const showToast = (e, t = "success") => {
  let s = document.querySelector(".toast-container");
  if (!s) return;
  const n = {
      success: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />',
      error: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />',
      info: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />',
  };
  const a = t === "error" ? "danger" : t;
  const o = t.toUpperCase();
  const l = document.createElement("div");

  l.style.cssText = `
      pointer-events: auto; position: relative; width: 100%; min-width: 300px; background: rgba(15, 23, 42, 0.95);
      backdrop-filter: blur(24px); border-radius: 8px; border: 1px solid var(--${a === "danger" ? "danger" : "primary"});
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5); overflow: hidden; animation: slideInToast 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  `;
  l.innerHTML = `
      <div style="position: absolute; inset: 0; opacity: 0.1; pointer-events: none; background: var(--${a === "danger" ? "danger" : "primary"});"></div>
      <div style="position: relative; display: flex; align-items: flex-start; gap: 1rem; padding: 1rem;">
          <div style="display: flex; align-items: center; justify-content: center; width: 2rem; height: 2rem; border-radius: 6px; background: var(--${a === "danger" ? "danger" : "primary"}); color: #000; flex-shrink: 0;">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" style="width: 1rem; height: 1rem;">
                  ${n[t] || n.info}
              </svg>
          </div>
          <div style="flex: 1; display: flex; flex-direction: column; gap: 2px;">
              <h3 style="margin: 0; font-size: 14px; font-weight: 600; color: white;">${o}</h3>
              <p style="margin: 0; font-size: 12px; color: rgba(255, 255, 255, 0.8);">${e}</p>
          </div>
      </div>
  `;

  if (!document.getElementById("toast-anim")) {
      const style = document.createElement("style");
      style.id = "toast-anim";
      style.textContent = "@keyframes slideInToast { from { opacity: 0; transform: translateY(20px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }";
      document.head.appendChild(style);
  }

  s.appendChild(l);
  setTimeout(() => {
      l.style.opacity = "0";
      l.style.transform = "translateY(-10px)";
      l.style.transition = "all 0.3s";
      setTimeout(() => l.remove(), 300);
  }, 3500);
};

const elements = {
  navItems: document.querySelectorAll(".nav-item"),
  sections: document.querySelectorAll(".section"),
  activeTitleEl: document.getElementById("active-title"),
  binList: document.getElementById("binList"),
  binCount: document.getElementById("binCount"),
  binModeToggle: document.getElementById("binModeToggle"),
  binInputsArea: document.getElementById("binInputsArea"),
  modeBadge: document.getElementById("modeBadge"),
  modeDesc: document.getElementById("modeDesc"),
  extensionToggle: document.getElementById("extensionToggle"),
  cardDetails: document.getElementById("cardDetails"),
  telegramLoginView: document.getElementById("telegram-login-view"),
  telegramProfileView: document.getElementById("telegram-profile-view"),
  telegramId: document.getElementById("telegramId"),
  otpCode: document.getElementById("otpCode"),
  sendOtpBtn: document.getElementById("sendOtpBtn"),
  verifyOtpBtn: document.getElementById("verifyOtpBtn"),
  unlinkBtns: document.querySelectorAll(".btn-unlink-action"),
  tgAvatar: document.getElementById("tg-avatar"),
  tgName: document.getElementById("tg-name"),
  tgUsername: document.getElementById("tg-username"),
  botToken: document.getElementById("botToken"),
  clearBtn: document.getElementById("clearBtn"),
  clearLogsBtn: document.getElementById("clearLogsBtn"),
  consoleOutput: document.getElementById("consoleOutput"),
  useCustomBilling: document.getElementById("useCustomBilling"),
  userName: document.getElementById("userName"),
  userEmail: document.getElementById("userEmail"),
  userAddress: document.getElementById("userAddress"),
  userCity: document.getElementById("userCity"),
  userZip: document.getElementById("userZip"),
  customCountry: document.getElementById("customCountry"),
  sendSiteToggle: document.getElementById("sendSiteToggle"),
  hittedSitesList: document.getElementById("hittedSitesList"),
  clearHitsBtn: document.getElementById("clearHitsBtn"),
  cleanCardsBtn: document.getElementById("cleanCardsBtn"),
  proxyToggle: document.getElementById("proxyToggle"),
  proxyList: document.getElementById("proxyList"),
  proxyCount: document.getElementById("proxyCount"),
  dashStatusVal: document.getElementById("dash-status-val"),
  dashModeVal: document.getElementById("dash-mode-val"),
  dashHitsVal: document.getElementById("dash-hits-val"),
};

const sectionTitles = {
  telegram: "Overview",
  settings: "System Configuration",
  cards: "Card Database",
  userDetails: "Identity Spoofing",
  console: "System Kernel",
  hittedSites: "Successful Hits",
};

const addLog = (e) => {
  if (!elements.consoleOutput) return;
  const t = document.createElement("div");
  t.innerHTML = e;
  const s = t.firstElementChild;
  if (s) {
      elements.consoleOutput.prepend(s);
      state.logs.unshift(s.outerHTML);
      if (state.logs.length > 50) state.logs.pop();
      chrome.storage.local.set({ dashboardLogs: state.logs });
  }
};

const luhnCheck = (e) => {
  let t = 0, s = 1;
  for (let n = e.length - 1; n >= 0; n--) {
      let a = Number(e.charAt(n)) * s;
      if (a > 9) { t += 1; a -= 10; }
      t += a;
      s = s === 1 ? 2 : 1;
  }
  return t % 10 === 0;
};

const isNotExpired = (e, t) => {
  const s = new Date(), n = s.getFullYear(), a = s.getMonth() + 1;
  let o = parseInt(t);
  if (o < 100) o += 2000;
  return !(o < n || (o === n && parseInt(e) < a));
};

const updateDashboardStats = () => {
  if (elements.dashStatusVal) {
      const e = elements.extensionToggle ? elements.extensionToggle.checked : state.settings.extensionEnabled;
      elements.dashStatusVal.textContent = e ? "Active" : "Disabled";
      elements.dashStatusVal.style.color = e ? "var(--success)" : "var(--danger)";
  }
  if (elements.dashModeVal) {
      const e = elements.binModeToggle ? elements.binModeToggle.checked : state.settings.binMode;
      elements.dashModeVal.textContent = "BOTH CC AND BIN";
      elements.dashModeVal.style.color = e ? "var(--text-main)" : "var(--danger)";
  }
  if (elements.dashHitsVal) {
      elements.dashHitsVal.textContent = state.totalHits;
  }
};

const updateModeUI = (e) => {
  if (elements.modeBadge && elements.binInputsArea) {
      if (e) {
          elements.modeBadge.textContent = "BIN MODE";
          elements.modeBadge.style.color = "var(--text-main)";
          if (elements.modeDesc) elements.modeDesc.textContent = "Generate cards automatically from your BIN list.";
          elements.binInputsArea.style.opacity = "1";
          elements.binInputsArea.style.pointerEvents = "auto";
          elements.binList.disabled = false;
      } else {
          elements.modeBadge.textContent = "BOTH CC AND BIN";
          elements.modeBadge.style.color = "var(--danger)";
          if (elements.modeDesc) elements.modeDesc.textContent = "BINs disabled. Using exact cards from the Cards tab.";
          elements.binInputsArea.style.opacity = "0.3";
          elements.binInputsArea.style.pointerEvents = "none";
          elements.binList.disabled = true;
      }
      updateDashboardStats();
  }
};

const updateCounts = () => {
  if (elements.proxyList && elements.proxyCount) {
      const e = elements.proxyList.value.split("\n").map(e => e.trim()).filter(Boolean).length;
      elements.proxyCount.textContent = e + " proxies";
  }
  if (elements.binList && elements.binCount) {
      const e = elements.binList.value.split("\n").map(e => e.trim()).filter(Boolean).length;
      elements.binCount.textContent = e + " BINs";
  }
};

const renderHittedSites = (e) => {
  if (!elements.hittedSitesList) return;
  if (e && e.length > 0) {
      elements.hittedSitesList.innerHTML = e.map((e, t) => `
          <div class="log-card-design full" style="margin-bottom: 8px; width: 100%;">
              <div class="log-header-row">
                  <span class="log-pill"><i class="far fa-clock"></i> ${e.date ? e.date.split(",")[0] : ""}</span>
                  <span class="log-pill status success">HIT 🎯</span>
              </div>
              <div style="font-weight:bold; color:#fff; font-size:14px; margin-bottom:4px;">${e.name || "Unknown"}</div>
              <div style="font-size:11px; color:var(--text-dim); font-family:monospace; margin-bottom:12px;">${e.url || "Unknown URL"}</div>
              <div class="log-cc-container" style="background: rgba(0,0,0,0.3); border-color: rgba(16, 185, 129, 0.2); margin-bottom: 12px;">
                  <div class="cc-icon"><i class="fab fa-cc-visa"></i></div>
                  <div class="cc-details">
                      <div class="cc-number">${e.card || "Unknown"}</div>
                      <div class="cc-extra">
                          <span>EXP: ${e.exp || "??/??"}</span>
                          <span class="cc-cvv">CVV: ${e.cvv || "???"}</span>
                      </div>
                  </div>
              </div>
              <div style="display:flex; justify-content:flex-end; align-items:center;">
                  <button class="delete-hit-btn" data-index="${t}" style="background:transparent; border:none; color:var(--danger); cursor:pointer; font-size: 14px; display:flex; gap:6px; align-items:center;">
                      <i class="fas fa-trash-alt"></i> <span style="font-size:12px; font-weight:600;">Remove</span>
                  </button>
              </div>
          </div>`).join("");
      document.querySelectorAll(".delete-hit-btn").forEach((e) => {
          e.addEventListener("click", (evt) => {
              const t = parseInt(evt.currentTarget.dataset.index);
              if (confirm("Remove this hit from history?")) {
                  const data = state.settings.hittedSites || [];
                  data.splice(t, 1);
                  chrome.storage.local.set({ hittedSites: data }, () => {
                      state.settings.hittedSites = data;
                      renderHittedSites(data);
                      showToast("Hit removed", "success");
                  });
              }
          });
      });
  } else {
      elements.hittedSitesList.innerHTML = '<div style="text-align:center; color:var(--text-dim); padding-top: 50px;">No hits yet.</div>';
  }
};

const updateTelegramUI = (e) => {
  const manualLoginBtn = document.getElementById("manualLoginBtn");
  const unlinkBtn = document.querySelector(".btn-unlink-action");
  const tgBadge = document.getElementById("tg-badge") || document.querySelector(".user-card-badge");
  const a = document.getElementById("telegramWarningMsg");

  if (elements.telegramProfileView) elements.telegramProfileView.style.display = "flex";
  if (elements.telegramLoginView) elements.telegramLoginView.style.display = "none";

  if (e) {
      if (elements.tgName) elements.tgName.textContent = state.settings.telegramName || "Operator";
      if (elements.tgUsername) elements.tgUsername.textContent = "@" + (state.settings.telegramUsername || "hidden");
      if (elements.tgAvatar) elements.tgAvatar.src = state.settings.telegramPhotoUrl || `https://ui-avatars.com/api/?name=${state.settings.telegramName}&background=6366f1&color=fff`;
      if (tgBadge) {
          tgBadge.textContent = "Verified & Active";
          tgBadge.style.color = "var(--success)";
          tgBadge.style.background = "rgba(16, 185, 129, 0.1)";
          tgBadge.style.borderColor = "rgba(16, 185, 129, 0.2)";
      }
      if (manualLoginBtn) manualLoginBtn.style.display = "none";
      if (unlinkBtn) unlinkBtn.style.display = "block";
      if (a) a.style.display = "none";
  } else {
      if (elements.tgName) elements.tgName.textContent = "Guest User";
      if (elements.tgUsername) elements.tgUsername.textContent = "Local Mode";
      if (elements.tgAvatar) elements.tgAvatar.src = "https://ui-avatars.com/api/?name=Guest&background=18181b&color=a1a1aa";
      if (tgBadge) {
          tgBadge.textContent = "Not Linked";
          tgBadge.style.color = "var(--text-dim)";
          tgBadge.style.background = "rgba(255, 255, 255, 0.05)";
          tgBadge.style.borderColor = "var(--border-color)";
      }
      if (manualLoginBtn) manualLoginBtn.style.display = "flex";
      if (unlinkBtn) unlinkBtn.style.display = "none";
      if (a) a.style.display = "flex";
  }
};

const loadSettings = () => {
  chrome.storage.sync.get(DEFAULT_SETTINGS, (e) => {
      chrome.storage.local.get(["cardDetails", "hittedSites", "dashboardLogs", "proxyList", "totalHits"], (t) => {
          const s = { ...e, ...t };
          state.settings = s;
          state.totalHits = t.totalHits || 0;

          if (elements.binList) elements.binList.value = Array.isArray(s.binList) ? s.binList.join("\n") : "";
          if (elements.proxyList) elements.proxyList.value = Array.isArray(s.proxyList) ? s.proxyList.join("\n") : "";
          if (elements.cardDetails) elements.cardDetails.value = (s.cardDetails || []).join("\n");
          if (elements.extensionToggle) elements.extensionToggle.checked = s.extensionEnabled;
          if (elements.binModeToggle) elements.binModeToggle.checked = s.binMode;
          if (elements.useCustomBilling) elements.useCustomBilling.checked = s.useCustomBilling;
          if (elements.sendSiteToggle) elements.sendSiteToggle.checked = s.sendSiteToGroup;

          updateModeUI(s.binMode);
          updateCounts();
          updateDashboardStats();

          if (elements.telegramId) elements.telegramId.value = s.telegramId || "";
          if (elements.botToken) elements.botToken.value = s.botToken || "";
          if (elements.userName) elements.userName.value = s.userName || "";
          if (elements.userEmail) elements.userEmail.value = s.userEmail || "";
          if (elements.userAddress) elements.userAddress.value = s.userAddress || "";
          if (elements.userCity) elements.userCity.value = s.userCity || "";
          if (elements.userZip) elements.userZip.value = s.userZip || "";
          if (elements.customCountry) elements.customCountry.value = s.customCountry || "US";

          state.logs = t.dashboardLogs || [];
          if (elements.consoleOutput) elements.consoleOutput.innerHTML = state.logs.length > 0 ? state.logs.join("") : '<div class="log-entry">System initialized. Waiting...</div>';
          
          renderHittedSites(s.hittedSites);
          updateTelegramUI(s.isVerified);
      });
  });
};

const saveSettings = (e = false) => {
  const t = elements.proxyList ? elements.proxyList.value.split("\n").map(e => e.trim()).filter(Boolean) : [];
  const s = {
      binList: elements.binList ? elements.binList.value.split("\n").map(e => e.trim()).filter(Boolean) : [],
      extensionEnabled: !elements.extensionToggle || elements.extensionToggle.checked,
      binMode: !elements.binModeToggle || elements.binModeToggle.checked,
      useCustomBilling: !!elements.useCustomBilling && elements.useCustomBilling.checked,
      userName: elements.userName ? elements.userName.value.trim() : "",
      userEmail: elements.userEmail ? elements.userEmail.value.trim() : "",
      userAddress: elements.userAddress ? elements.userAddress.value.trim() : "",
      userCity: elements.userCity ? elements.userCity.value.trim() : "",
      userZip: elements.userZip ? elements.userZip.value.trim() : "",
      customCountry: elements.customCountry ? elements.customCountry.value : "US",
      sendSiteToGroup: !!elements.sendSiteToggle && elements.sendSiteToggle.checked,
      telegramId: elements.telegramId && elements.telegramId.value.trim() !== "" ? elements.telegramId.value.trim() : state.settings.telegramId,
      isVerified: state.settings.isVerified,
      telegramName: state.settings.telegramName,
      telegramUsername: state.settings.telegramUsername,
      telegramPhotoUrl: state.settings.telegramPhotoUrl,
      botToken: elements.botToken ? elements.botToken.value.trim() : "",
      proxyEnabled: !!elements.proxyToggle && elements.proxyToggle.checked,
  };
  const n = {
      cardDetails: elements.cardDetails ? elements.cardDetails.value.split("\n").map(e => e.trim()).filter(Boolean) : [],
      hittedSites: state.settings.hittedSites,
      proxyList: t,
      totalHits: state.totalHits,
  };

  chrome.storage.sync.set(s, () => {
      chrome.storage.local.set(n, () => {
          state.settings = { ...s, ...n };
          updateDashboardStats();
          if (e) showToast("Config Saved", "success");
          chrome.tabs.query({}, (tabs) => {
              tabs.forEach((tab) => chrome.tabs.sendMessage(tab.id, { action: "updateSettings", settings: state.settings }).catch(() => {}));
          });
      });
  });
};

// INITIALIZATION LOGIC
document.addEventListener("DOMContentLoaded", () => {
  injectLogStyles();
  loadSettings(); // Cleanly loads everything via the refactored loadSettings above

  // Events for Navigation Tabs
  if (elements.navItems) {
      elements.navItems.forEach((e) => {
          e.addEventListener("click", () => {
              elements.navItems.forEach((btn) => btn.classList.remove("active"));
              elements.sections.forEach((sec) => sec.classList.remove("active"));
              e.classList.add("active");
              const target = document.getElementById(e.dataset.section + "-section");
              if (target) target.classList.add("active");
              if (elements.activeTitleEl) elements.activeTitleEl.textContent = sectionTitles[e.dataset.section] || "Dashboard";
          });
      });
  }

  // Auto-Save listeners
  [elements.extensionToggle, elements.proxyToggle, elements.useCustomBilling, elements.sendSiteToggle, elements.customCountry].forEach((e) => {
      if (e) e.addEventListener("change", () => saveSettings(true));
  });

  [elements.binList, elements.proxyList, elements.cardDetails, elements.botToken, elements.telegramId, elements.userName, elements.userEmail, elements.userAddress, elements.userCity, elements.userZip].forEach((e) => {
      if (e) e.addEventListener("blur", () => saveSettings(false));
  });

  if (elements.proxyList) elements.proxyList.addEventListener("input", updateCounts);
  if (elements.binList) elements.binList.addEventListener("input", updateCounts);
  
  if (elements.binModeToggle) {
      elements.binModeToggle.addEventListener("change", (e) => {
          updateModeUI(e.target.checked);
          saveSettings(true);
      });
  }

  // Check Proxies Logic
  const checkProxiesBtn = document.getElementById("checkProxiesBtn");
  if (checkProxiesBtn && elements.proxyList) {
      checkProxiesBtn.addEventListener("click", () => {
          const list = elements.proxyList.value.split("\n").map((p) => p.trim()).filter(Boolean);
          if (list.length === 0) return showToast("No proxies to check", "info");
          
          const originalHTML = checkProxiesBtn.innerHTML;
          checkProxiesBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Checking...';
          checkProxiesBtn.disabled = true;
          checkProxiesBtn.style.opacity = "0.7";
          
          chrome.runtime.sendMessage({ action: "checkProxies", proxies: list }, (res) => {
              checkProxiesBtn.innerHTML = originalHTML;
              checkProxiesBtn.disabled = false;
              checkProxiesBtn.style.opacity = "1";
              if (res && res.live) {
                  elements.proxyList.value = res.live.join("\n");
                  saveSettings(true);
                  updateCounts();
                  if (res.dead.length > 0 && res.live.length > 0) {
                      showToast(`Purged ${res.dead.length} dead proxies. ${res.live.length} live.`, "success");
                  } else if (res.dead.length > 0 && res.live.length === 0) {
                      showToast("All proxies were dead.", "error");
                  } else {
                      showToast("All proxies are live and healthy!", "success");
                  }
              } else {
                  showToast("Proxy check failed.", "error");
              }
          });
      });
  }

  // Clean Cards Logic
  if (elements.cleanCardsBtn) {
      elements.cleanCardsBtn.addEventListener("click", () => {
          const raw = elements.cardDetails.value;
          if (!raw.trim()) return showToast("Database is empty", "info");
          const lines = raw.split("\n"), unique = new Set();
          let invalid = 0, expired = 0, duplicates = 0;
          const cleaned = [];
          
          lines.forEach((line) => {
              const t = line.trim();
              if (!t) return;
              const parts = t.split("|");
              if (parts.length >= 4) {
                  const cardNum = parts[0].replace(/\D/g, "");
                  let month = parts[1].replace(/\D/g, ""), year = parts[2].replace(/\D/g, "");
                  const cvv = parts[3].replace(/\D/g, "");
                  if (!cardNum || cardNum.length < 13 || cardNum.length > 19 || !luhnCheck(cardNum)) return void invalid++;
                  if (month.length === 1) month = "0" + month;
                  if (year.length === 2) year = "20" + year;
                  if (!isNotExpired(month, year)) return void expired++;
                  if (cvv.length < 3) return void invalid++;
                  const formatted = `${cardNum}|${month}|${year}|${cvv}`;
                  unique.has(formatted) ? duplicates++ : (unique.add(formatted), cleaned.push(formatted));
              } else {
                  if (parts[0].replace(/\D/g, "").length < 6) return void invalid++;
                  unique.has(t) ? duplicates++ : (unique.add(t), cleaned.push(t));
              }
          });
          elements.cardDetails.value = cleaned.join("\n");
          saveSettings(true);
          showToast(invalid > 0 || expired > 0 || duplicates > 0 ? `Cleaned: ${invalid} Invalid, ${expired} Expired` : "List is perfect!", "success");
      });
  }

  // System Clear Buttons
  if (elements.clearLogsBtn) {
      elements.clearLogsBtn.addEventListener("click", () => {
          if (elements.consoleOutput) elements.consoleOutput.innerHTML = "";
          state.logs = [];
          chrome.storage.local.set({ dashboardLogs: [] });
          showToast("Logs Cleared", "info");
      });
  }

  if (elements.clearBtn) {
      elements.clearBtn.addEventListener("click", () => {
          if (confirm("Reset System? This clears all logs, hits, and counters.")) {
              if (elements.consoleOutput) elements.consoleOutput.innerHTML = "";
              state.logs = [];
              state.settings.hittedSites = [];
              state.totalHits = 0;
              chrome.storage.local.set({ dashboardLogs: [], totalHits: 0, hittedSites: [] });
              renderHittedSites([]);
              updateDashboardStats();
              showToast("System Reset", "info");
          }
      });
  }

  if (elements.clearHitsBtn) {
      elements.clearHitsBtn.addEventListener("click", () => {
          if (confirm("Purge all hit history?")) {
              state.settings.hittedSites = [];
              chrome.storage.local.set({ hittedSites: [] }, () => {
                  renderHittedSites([]);
                  showToast("History Purged", "success");
              });
          }
      });
  }

  // Telegram OTP System
  if (elements.sendOtpBtn) {
      elements.sendOtpBtn.addEventListener("click", async () => {
          const token = elements.botToken.value.trim(), id = elements.telegramId.value.trim();
          if (!token || !id) return showToast("Enter Bot Token and User ID", "error");
          const otp = Math.floor(1e5 + 9e5 * Math.random()).toString();
          state.otpDatabase[id] = otp;
          const origText = elements.sendOtpBtn.innerHTML;
          elements.sendOtpBtn.innerHTML = "Sending...";
          try {
              const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
                  method: "POST", headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ chat_id: id, text: `🛡️ *BINARY OS VERIFICATION*\n\nYour OTP is: \`${otp}\``, parse_mode: "Markdown" })
              });
              if ((await res.json()).ok) {
                  showToast("OTP Sent to Telegram!", "success");
                  if (elements.otpCode) elements.otpCode.focus();
              } else {
                  showToast("API Error: Check credentials", "error");
              }
          } catch (e) {
              showToast("Network Error", "error");
          } finally {
              elements.sendOtpBtn.innerHTML = origText;
          }
      });
  }

  if (elements.verifyOtpBtn) {
      elements.verifyOtpBtn.addEventListener("click", async () => {
          const code = elements.otpCode.value.trim(), id = elements.telegramId.value.trim(), token = elements.botToken.value.trim();
          if (!state.otpDatabase[id]) return showToast("Send OTP first", "info");
          if (state.otpDatabase[id] !== code) return showToast("Invalid OTP Code", "error");
          
          const origText = elements.verifyOtpBtn.innerHTML;
          elements.verifyOtpBtn.innerHTML = "Verifying...";
          try {
              let pfp = "";
              try {
                  const pfpRes = await fetch(`https://api.telegram.org/bot${token}/getUserProfilePhotos?user_id=${id}&limit=1`);
                  const pfpData = await pfpRes.json();
                  if (pfpData.ok && pfpData.result.total_count > 0) {
                      const fileId = pfpData.result.photos[0][0].file_id;
                      const fileRes = await fetch(`https://api.telegram.org/bot${token}/getFile?file_id=${fileId}`);
                      const fileData = await fileRes.json();
                      if (fileData.ok) pfp = `https://api.telegram.org/file/bot${token}/${fileData.result.file_path}`;
                  }
              } catch (e) {}
              
              const infoRes = await fetch(`https://api.telegram.org/bot${token}/getChat?chat_id=${id}`);
              const infoData = await infoRes.json();
              if (infoData.ok) {
                  state.settings.isVerified = true;
                  state.settings.telegramId = id;
                  state.settings.botToken = token;
                  state.settings.telegramName = (infoData.result.first_name + " " + (infoData.result.last_name || "")).trim();
                  state.settings.telegramUsername = infoData.result.username || "unknown";
                  state.settings.telegramPhotoUrl = pfp;
                  saveSettings(false);
                  updateTelegramUI(true);
                  showToast("System Verified!", "success");
              }
          } catch (e) {
              state.settings.isVerified = true;
              saveSettings(true);
              updateTelegramUI(true);
              showToast("Verified (Profile fetch failed)", "info");
          } finally {
              elements.verifyOtpBtn.innerHTML = origText;
          }
      });
  }

  if (elements.unlinkBtns) {
      elements.unlinkBtns.forEach((btn) => {
          btn.addEventListener("click", () => {
              if (confirm("Unlink Telegram? Automation will be disabled and counters reset.")) {
                  state.settings.isVerified = false;
                  state.settings.telegramId = "";
                  state.settings.botToken = "";
                  state.settings.telegramName = "";
                  state.settings.telegramUsername = "";
                  state.settings.telegramPhotoUrl = "";
                  state.totalHits = 0;
                  if (elements.telegramId) elements.telegramId.value = "";
                  if (elements.botToken) elements.botToken.value = "";
                  if (elements.otpCode) elements.otpCode.value = "";
                  chrome.storage.local.set({ totalHits: 0 });
                  saveSettings(false);
                  updateTelegramUI(false);
                  updateDashboardStats();
                  showToast("Account Unlinked", "info");
              }
          });
      });
  }

  // --- UI EVENT LISTENERS FIX (MOVED OUT OF BACKGROUND LISTENER) ---
  
  // 1. Connect Telegram Button (Both desktop & mobile sidebars)
  const manualLoginBtns = document.querySelectorAll("#manualLoginBtn");
  manualLoginBtns.forEach(btn => {
      btn.addEventListener("click", () => {
          if (elements.telegramLoginView) elements.telegramLoginView.style.display = "block";
      });
  });

  // 2. Click background to close login modal
  if (elements.telegramLoginView) {
      elements.telegramLoginView.addEventListener("click", (evt) => {
          if (evt.target === elements.telegramLoginView) {
              elements.telegramLoginView.style.display = "none";
          }
      });
  }

  // 3. Mobile Hamburger Menu Logic
  const menuBtn = document.getElementById('mobileMenuBtn');
  const sidebar = document.getElementById('mobileSidebar');
  const overlay = document.getElementById('sidebarOverlay');

  function toggleMenu() {
      if (sidebar && sidebar.classList.contains('open')) {
          sidebar.classList.remove('open');
          if (overlay) overlay.classList.remove('active');
      } else {
          if (sidebar) sidebar.classList.add('open');
          if (overlay) overlay.classList.add('active');
      }
  }

  if (menuBtn && sidebar && overlay) {
      menuBtn.addEventListener('click', toggleMenu);
      overlay.addEventListener('click', toggleMenu);
      
      if (elements.navItems) {
          elements.navItems.forEach(item => {
              item.addEventListener('click', () => {
                  if (window.innerWidth <= 768) toggleMenu();
              });
          });
      }
  }

  // --- BACKGROUND MESSAGE LISTENER ---
  chrome.runtime.onMessage.addListener((e) => {
      if (!e) return;
      if (e.action === "logResponse") {
          const { card: t, response: s, url: n } = e.data;
          const isSuccess = s.type === "success";
          const time = new Date().toLocaleTimeString("en-US", { hour12: false });
          
          if (isSuccess) {
              state.totalHits++;
              chrome.storage.local.set({ totalHits: state.totalHits });
              updateDashboardStats();
              const logHtml = `
                  <div class="log-card-design full">
                      <div class="log-header-row">
                          <div class="log-badges">
                              <span class="log-pill"><i class="far fa-clock"></i> ${time}</span>
                              <span class="log-pill"><i class="fas fa-network-wired"></i> ${cachedIp}</span>
                          </div>
                          <span class="log-pill status success">APPROVED</span>
                      </div>
                      <div class="log-cc-container">
                          <div class="cc-icon"><i class="fab fa-cc-visa"></i></div>
                          <div class="cc-details">
                              <div class="cc-number">${t?.cardNumber || "Unknown"}</div>
                              <div class="cc-extra">
                                  <span>EXP: ${t?.expirationDate || "??"}</span>
                                  <span class="cc-cvv">CVV: ${t?.cvv || "???"}</span>
                              </div>
                          </div>
                      </div>
                      <div class="log-footer-msg">
                          <i class="fas fa-check-circle"></i>
                          <span>${s.message || "Payment Successful"}</span>
                      </div>
                  </div>`;
              addLog(logHtml);
          } else {
              const logHtml = `
                  <div class="log-card-design compact">
                      <div class="compact-left">
                          <span class="compact-time">${time}</span>
                          <div class="compact-msg">
                              <i class="fas fa-times-circle"></i>
                              ${s.message || "Declined"}
                          </div>
                      </div>
                      <div class="compact-right">
                          <span class="compact-card">${t?.cardNumber || "????"}</span>
                          <span class="log-pill ip" style="font-size:9px">${cachedIp}</span>
                      </div>
                  </div>`;
              addLog(logHtml);
          }
      }
      
      if (e.action === "updateHittedSites") {
          state.settings.hittedSites = e.hittedSites;
          renderHittedSites(e.hittedSites);
      }
      
      if (e.action === "updateDashboard" && e.cardDetails !== undefined && elements.cardDetails) {
          elements.cardDetails.value = e.cardDetails.join("\n");
      }
  });

});