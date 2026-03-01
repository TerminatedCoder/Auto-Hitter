<div align="center">

# 🚀 BINARY OS 

**The Ultimate Decentralized Payment Testing & Automation Extension For **
<p align="center>
  This extension is "only for checkout.stipe.com"
</p>

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Version](https://img.shields.io/badge/Version-3.0%20(Open%20Source)-blue.svg)](https://github.com/TerminatedCoder/Binary-OS)
[![Platform](https://img.shields.io/badge/Platform-Chrome%20Extension-4285F4.svg?logo=googlechrome&logoColor=white)](https://github.com/TerminatedCoder/Binary-OS)
[![Developer](https://img.shields.io/badge/Developer-TerminatedCoder-red.svg)](https://github.com/TerminatedCoder)

<p align="center">
  Binary OS is an open-source, fully unlocked Chrome extension designed for automated penetration testing and load-testing of payment gateways. It features a completely local, decentralized architecture with built-in proxy management, a unified target database, and optional private Telegram integration.
</p>

---

</div>

## ⚠️ Disclaimer
> **For Educational and Authorized Testing Purposes Only.** > This tool is designed for developers, penetration testers, and security researchers to test their own systems or systems they have explicit permission to test. The developers assume no liability and are not responsible for any misuse or damage caused by this program.

---

## 🔥 Core Features

### 🔓 Decentralized "Local Mode"
The central server and forced login walls have been entirely removed.
* **Guest Access:** Install and use the extension instantly in Local Mode without creating an account.
* **Completely Private:** All logs, hits, and databases are stored locally in your browser (`chrome.storage`).

### 🧠 Unified Target Database (Smart Auto-Routing)
No more toggle switches for BINs vs. CCs. Paste everything into one box and let the engine handle it.
* **Mix & Match:** Paste raw BINs (e.g., `414720`) and full CCs (`411111|12|25|123`) into the exact same database.
* **Intelligent Handling:** The engine auto-detects the format. It tries full CCs once and drops them. It generates fresh cards from BINs and loops them to the back of the queue (Round-Robin).
* **Auto-Purge Bad BINs:** If a BIN hits a fatal `incorrect_number` decline, the system permanently deletes that BIN from the queue so you don't waste time on dead loops.
* **🧹 1-Click Data Sanitizer:** Click "Format Data" to instantly scrub messy lists, fix bad spacing, validate the Luhn algorithm, drop expired dates, and remove duplicates.

### ⚡ Live Native Proxy Checker
A built-in network engine that natively tests your proxy list directly through Chrome's network stack.
* **All-Rounder Format Support:** Paste proxies in standard `IP:Port`, `IP:Port:User:Pass`, HTTP, or SOCKS formats.
* **Auto-Bypass Auth:** Automatically handles proxy credentials without crashing the browser.
* **Instant Purge:** Pings IPs with a strict 5-second timeout and immediately deletes dead proxies from your list, saving only the live ones.

### 🤖 Auto-Hitter & Silent Operations
* **Automated Injection:** Automatically detects payment gateways (like Stripe), fills forms, bypasses captchas/bloatware, and submits the transaction.
* **Scamalytics Bypass:** Built-in protection against Scamalytics API rate limits and HTML crashes.
* **Silent Declines:** Massive red error boxes are gone. Declines fail silently in the background, showing only a sleek, tiny 3-second popup with the exact technical `code` and `decline_code`.

### 📩 Private Telegram Bot Integration (Optional)
Take your hits with you on the go.
* **Connect Your Own Bot:** Click "Connect Telegram" to securely link your own private Telegram bot using your Bot Token and Chat ID.
* **Live Notifications:** Receive instant messages for successful operations containing the Card, Expiry, CVV, Site URL, and Server Response.
* **Privacy Blur:** One-click blur mode hides sensitive site details on your screen while keeping the transaction amount visible for safe screenshots.

### 📱 Responsive "Glassmorphism" UI
* **Dark Hacker Aesthetic:** A sleek, minimal `zinc-950` dark mode interface with neon accents.
* **Mobile Ready:** Fully responsive design with an off-canvas slide-out hamburger menu, perfect for users running Chrome extensions on mobile browsers (like Kiwi Browser or Lemur).
* **System Kernel Console:** Live, detailed logs of every action, decline, and hit rendered in a beautiful terminal-style UI.

---

## 🛠️ Installation

Because this is a developer tool, it is not hosted on the Chrome Web Store. You must install it manually.

1. **Download the Source Code:** Clone this repository or download it as a `.zip` file and extract it.
   ```bash
   git clone https://github.com/TerminatedCoder/Auto-Hitter.git
   ```
3. **Open Extension Settings:** Open Google Chrome and navigate to `chrome://extensions/`.
4. **Enable Developer Mode:** Toggle the **"Developer mode"** switch in the top right corner.
5. **Load Unpacked:** Click the **"Load unpacked"** button in the top left corner.
6. **Select Folder:** Select the folder where you extracted the Binary OS files.
7. **Pin & Launch:** Pin the Binary OS extension to your toolbar and click the icon to open the Dashboard!

---

## ⚙️ How to Setup Telegram (Optional)

If you want to receive live hits to your phone:

1. Go to Telegram and search for **[@BotFather](https://t.me/botfather)**.
2. Send `/newbot` and follow the steps to get your **HTTP API Token**.
3. Search for **[@userinfobot](https://t.me/userinfobot)** and copy your numerical **User ID**.
4. Start a conversation with your newly created bot and send `/start`.
5. Open the Binary OS Dashboard, open the sidebar, and click **Connect Telegram**.
6. Enter your User ID and Bot Token, then click **Send Code** to verify the connection.

---

## 🤝 Contributing

This project is Open Source! We welcome contributions, bug reports, and feature requests. 

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📞 Contact & Support

**Developer:** TerminatedCoder  
**Email:** terminatedcoder@gmail.com  
**GitHub:** [github.com/TerminatedCoder](https://github.com/TerminatedCoder)

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

<div align="center">
  <i>Developed with 💻 & ☕ by TerminatedCoder.</i>
</div>
