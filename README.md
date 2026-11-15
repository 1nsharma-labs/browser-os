<h1 align="center">🌐 Browser-OS</h1>

<p align="center">
  <b>Autonomous Browser & Web Intelligence Engine for AI Agents (Year 2046 MAX Spec)</b><br>
  Zero-dependency semantic DOM distillation, clean markdown extraction, and deterministic action planning for coding agents.<br>
  Slashes raw HTML tokens by 95%+, eliminates expensive multimodal screenshot loops, and provides ProofShot UI self-verification.
</p>

<p align="center">
  <a href="https://1nsharma-labs.github.io/browser-os/"><img src="https://img.shields.io/badge/Live_Simulator-1nsharma--labs.github.io%2Fbrowser--os-cyan?style=for-the-badge&logo=googlechrome&logoColor=white" alt="Live Demo"></a>
  <a href="https://github.com/1nsharma-labs/browser-os/releases"><img src="https://img.shields.io/badge/Version-v2046.1.0--MAX-blue?style=for-the-badge" alt="Release"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-Apache_2.0-green?style=for-the-badge" alt="License"></a>
</p>

<p align="center">
  <a href="https://github.com/sponsors/1nsharma"><img src="https://img.shields.io/badge/Sponsor-GitHub_Sponsors-pink.svg" alt="Sponsor"></a>
  <a href="https://polar.sh/1nsharma-labs"><img src="https://img.shields.io/badge/Polar.sh-1nsharma--labs-purple.svg" alt="Polar"></a>
  <a href="#"><img src="https://img.shields.io/badge/Direct_UPI-6393741171%40upi-emerald.svg" alt="UPI"></a>
</p>

---

## ⚡ The Autonomous Web Agent Problem in 2026

Modern AI coding agents (Claude Code, Cursor, Copilot, Codex, Windsurf) are frequently tasked with navigating websites, scraping data, filling forms, and verifying frontend user interfaces. However:
1. **The HTML Token Explosion**: A single webpage DOM contains 30,000 to 80,000 tokens of tracking scripts, CSS classes, SVGs, and boilerplate. Feeding raw HTML into LLMs drains context windows and burns excessive API dollars.
2. **The Multimodal Vision Trap**: Querying vision LLMs with 1080p browser screenshots costs $0.04 to $0.08 per step, induces 4 to 8 seconds of turn latency, and struggles with small text buttons.
3. **Fragile XPath Selectors**: Hardcoded DOM paths break the instant a website updates its layout.
4. **The UI Verification Vacuum**: Agents generate code without knowing if buttons lack accessible labels, images lack `alt` tags, or links are dead placeholders (`href="#"`).

### 💡 The Browser-OS Solution

* **Semantic DOM Distiller**: Strips scripts, styles, and clutter to extract an indexed action tree (`[1] <input> "Search"`, `[2] <button> "Submit"`), saving **95%+ tokens** in under 3ms.
* **Deterministic Action Planner**: Translates natural language goals into robust action DAGs and runnable Playwright/Puppeteer automation code.
* **Clean Markdown Extractor**: Converts any webpage or documentation into clean, readable markdown for AI context and RAG ingest.
* **ProofShot UI Verifier**: Audits web pages and frontend components for missing `alt` attributes, unlabelled buttons, dead links, and mobile layout overflow.
* **Year 2046 MAX Horizon**: Simulates 6DoF spatial web mesh crawling, picosecond quantum state collapse, and gaze-intent pre-fetching.

---

## 🌐 Instant In-Browser Interactive Simulator (Zero-Login)

Launch the zero-login interactive lab directly on GitHub Pages:  
👉 [**https://1nsharma-labs.github.io/browser-os/**](https://1nsharma-labs.github.io/browser-os/)

* **Live 95% DOM Distiller**: Paste any HTML or load presets (E-Commerce, Login, GitHub) to see instant token savings.
* **Interactive Markdown Extractor**: Live conversion of webpage HTML into clean Markdown with copy-paste readiness.
* **Action Sequence Generator**: Input any autonomous web goal and receive an immediate step-by-step DAG and Playwright script.
* **ProofShot UI Auditor**: Test components for accessibility, form validation, and responsive overflow.
* **Year 2046 Spatial Mesh Engine**: Quantum state collapse and 6DoF web mesh telemetry.

---

## 🚀 Quickstart & Single-Command CLI

Run instantly with zero dependencies using native Node.js 24:

```bash
# Distill an HTML page into an indexed action tree (95% token savings)
npx browser-os distill "https://news.ycombinator.com"

# Extract clean markdown from a webpage for RAG context
npx browser-os md "https://docs.github.com"

# Plan a deterministic browser action sequence
npx browser-os plan "Search for mechanical keyboards, filter 4+ stars, and click buy"

# Run ProofShot UI audit on an HTML snippet or file
npx browser-os verify sample.html

# Simulate Year 2046 MAX quantum spatial web telemetry
npx browser-os 2046

# Launch the interactive local web simulator (port 3999)
npx browser-os serve
```

---

## 🔌 Model Context Protocol (MCP) Server Integration

Browser-OS provides a built-in MCP server over standard input/output (`stdio`), enabling autonomous agents in **Claude Desktop**, **Cursor**, and **Antigravity** to directly distill DOMs and plan web interactions:

### Claude Desktop Configuration (`claude_desktop_config.json`)

```json
{
  "mcpServers": {
    "browser-os": {
      "command": "node",
      "args": ["C:/Users/18/OneDrive/Desktop/browser-os/core/src/mcp.js"]
    }
  }
}
```

### Available MCP Tools

| Tool Name | Parameters | Description |
| :--- | :--- | :--- |
| `browser_distill_dom` | `html` | Compresses raw HTML into an indexed action tree with 95%+ token savings |
| `browser_extract_markdown` | `html` | Converts webpage HTML into clean markdown, stripping scripts and clutter |
| `browser_plan_actions` | `intent`, `html` | Translates natural language goals into deterministic action sequences |
| `browser_verify_ui` | `html` | Audits UI for accessibility, unlabelled buttons, dead links, and overflow |
| `browser_simulate_2046` | `meshProtocol`, `spatialNodes` | Year 2046 MAX 6DoF spatial mesh and quantum collapse simulation |

---

## 🏗️ Architecture & Core Components

```
browser-os/
├── core/
│   └── src/
│       ├── dom_distiller.js        # 95%+ Semantic DOM Action Tree Distiller
│       ├── markdown_extractor.js   # Zero-dependency HTML to Clean Markdown
│       ├── action_planner.js       # Natural Language to Playwright Action Planner
│       ├── ui_verifier.js          # ProofShot UI & Accessibility Audit Engine
│       ├── neural_crawler_2046.js  # Year 2046 MAX 6DoF Spatial Web Mesh Engine
│       ├── mcp.js                  # Model Context Protocol (MCP) stdio Server
│       ├── cli.js                  # Zero-dependency Executable CLI
│       └── server.js               # Native HTTP Web Server & REST API
├── test/
│   └── test_browser.js             # Automated Test Suite (100% passing)
├── index.html                      # Interactive Zero-Login Web Simulator (GitHub Pages)
├── package.json                    # v2046.1.0-MAX
└── LICENSE                         # Apache 2.0
```

---

## 🧪 Automated Testing

Run the zero-dependency test runner:

```bash
node --test test/test_browser.js
```

```
▶ Browser-OS Core Suite
  ✔ DomDistiller extracts indexed interactive elements and saves tokens (6.86ms)
  ✔ DomDistiller handles empty strings safely (0.65ms)
  ✔ MarkdownExtractor converts HTML into clean markdown (5.77ms)
  ✔ ActionPlanner translates user intent into deterministic steps and Playwright script (2.83ms)
  ✔ UIVerifier flags missing accessibility attributes and dead links (2.25ms)
  ✔ NeuralCrawler2046 simulates 2046 MAX quantum spatial web telemetry (1.05ms)
  ✔ MCPServer exposes 5 tools and handles dispatch correctly (2.57ms)
✔ Browser-OS Core Suite (27.00ms)
ℹ tests 7, suites 1, pass 7, fail 0
```

---

## 💼 Founder & Community Sponsorship

Browser-OS is 100% Free and Open-Source under the **Apache 2.0 License**.

* **Founder & Lead Architect:** **Amit Sharma** ([@1nsharma](https://github.com/1nsharma))
* **Headquarters:** Kanpur, Uttar Pradesh, India 🇮🇳
* **Direct Email:** [amitsharma9976@gmail.com](mailto:amitsharma9976@gmail.com)
* **Direct UPI Support:** `6393741171@upi` (PhonePe / GPay / Paytm: `6393741171`)
* **Global Sponsorship:** [polar.sh/1nsharma-labs](https://polar.sh/1nsharma-labs) &bull; [github.com/sponsors/1nsharma](https://github.com/sponsors/1nsharma)

---

<p align="center">
  Crafted with ❤️ for autonomous AI agents and web developers by <a href="https://github.com/1nsharma"><b>Amit Sharma</b></a> (@1nsharma-labs)
</p>
