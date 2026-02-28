# 🤖 My AI Agent - Ultimate Chrome Extension

![Version](https://img.shields.io/badge/version-5.7-blue.svg)
![Manifest](https://img.shields.io/badge/Chrome_Manifest-V3-green.svg)
![Zero Dependencies](https://img.shields.io/badge/dependencies-0-success.svg)

**My AI Agent** is a powerful, lightweight, and versatile Chrome Extension that integrates the world's most advanced Large Language Models (LLMs) directly into your browser's Side Panel. Built with **vanilla JavaScript** and zero external dependencies, it offers lightning-fast performance, extreme privacy, and a rich set of features for dealing with text and images on the fly.

*[Przeczytaj to README po polsku](README.pl.md)*

## ✨ Key Features

### 💬 Multi-Provider AI Chat
- Switch seamlessly between top-tier models from **Google** (Gemini 2.5 Flash/Pro, 2.0 Flash), **OpenAI** (GPT-4o, GPT-4.1, o3-mini), and **Anthropic** (Claude Sonnet 4, Opus 4, Haiku 3.5).
- Context-aware streaming responses with markdown support, syntax highlighting, and **clickable links**.
- Code blocks include a **filename field** with one-click **Copy** and **Download** buttons — filename is auto-detected from code comments.
- Built-in token counter to track your API usage.
- Export chat history to **Markdown (.md)** or a beautifully formatted **PDF**.
- Create and manage your own **Custom Prompt Snippets**.
- **Edit** any sent message and regenerate the response.

### 📄 Contextual Text Tools
- Select any text on a webpage and quickly run commands: **Explain, Summarize, Translate, or Improve style**.
- Built-in Text-To-Speech (TTS) to read AI responses aloud.
- **Token counter** shows API usage per request.

### 🖼️ Advanced Image Capabilities
- **Screen Cropping:** Select any area on your screen to crop and send directly to the AI for analysis.
- **Drag & Drop / Paste:** Easily drag images into the drop-zone or paste them from your clipboard (Ctrl+V) in any image section.
- **Image Analysis (Vision):** Ask questions about images using Gemini Vision models. Includes a **token counter** per request.
- **Image Generation:** Generate stunning images using **Google Imagen 4** or **DALL-E 3**.
- **Native Image Editing:** Use dedicated Gemini models (e.g. `gemini-2.5-flash-image`, `gemini-3-pro-image-preview`) to edit images via text prompts. After editing you can **Download**, **Send to Analyze**, or **Re-edit** the result as a new input — enabling iterative editing loops.
- Separate **Image Edit Model** selector in Settings with a built-in scanner to detect all available models from your API key.

### 🔒 Privacy First & Lightweight
- **Zero external dependencies**: Custom built Markdown parser and syntax highlighter.
- **Local Storage:** Your API keys and chat history are saved *locally* in your browser. They are never sent to external servers or synced to the cloud.

### 🎨 Beautiful & Customizable UI
- Automatic Light/Dark/System theme support.
- Fully translated UI (English & Polish) based on your browser settings.
- Floating action button on web pages and context menu integration (Right-click an image -> "Send to AI Agent").

---

## 📸 Screenshots

### Chat Interface

![Chat Interface](https://raw.githubusercontent.com/AnonBOTpl/my-ai-agent-chrome-extension/refs/heads/main/chat.png)

### Image Tools

![Image Tools](https://raw.githubusercontent.com/AnonBOTpl/my-ai-agent-chrome-extension/refs/heads/main/image.png)

### Text Tools

![Text Tools](https://raw.githubusercontent.com/AnonBOTpl/my-ai-agent-chrome-extension/refs/heads/main/text.png)

---

## 🚀 Installation (Unpacked Extension)

Since this extension requires your own API keys, it's designed to be run locally in Developer Mode.

1. **Clone or download** this repository to your local machine:
   ```bash
   git clone https://github.com/your-username/my-ai-agent-extension.git
   ```
2. Open Google Chrome and navigate to `chrome://extensions/`.
3. Enable **Developer mode** using the toggle switch in the top right corner.
4. Click on the **Load unpacked** button in the top left.
5. Select the folder where you cloned/extracted the extension files.
6. The extension is now installed! Click the puzzle icon 🧩 in Chrome, pin the "My AI Agent" icon, and click it to open the Side Panel.

---

## ⚙️ Configuration & API Keys

To use the AI features, you need to provide your own API keys. 
1. Open the extension Side Panel.
2. Click the Settings gear icon (⚙️) in the top right corner.
3. Paste your API keys into the respective fields:
   - **Google Gemini API Key:** (Required for Gemini chat, Vision, Imagen generation, and image editing). Get it at [Google AI Studio](https://aistudio.google.com/).
   - **OpenAI API Key:** (Required for GPT models and DALL-E). Get it at [OpenAI Platform](https://platform.openai.com/).
   - **Anthropic API Key:** (Required for Claude models). Get it at [Anthropic Console](https://console.anthropic.com/).
4. Click **Save & Close**.

---

## 🛠️ Tech Stack
- **HTML5, CSS3, Vanilla JavaScript (ES6+)**
- Feature integrations: `chrome.sidePanel`, `chrome.contextMenus`, `chrome.storage.local`, `chrome.storage.session`, `chrome.scripting`.
- **APIs:** Google Generative Language API (Gemini/Imagen), OpenAI API, Anthropic API.

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
