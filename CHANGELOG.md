# Changelog

All notable changes to **My AI Agent** are documented here.

---

## [5.8] - 2025-02-28

### Added
- **Model Quick Switch** – new dropdown in the header bar to switch between AI models instantly without opening Settings. Active model is highlighted with a provider color (blue = Gemini, green = OpenAI, orange = Anthropic). Selection is saved immediately.
- **System Prompts per provider** – new section in Settings with separate textarea for Gemini, OpenAI, and Anthropic. Lets you define a custom personality or behavior for each AI independently (e.g. "concise coding assistant" for Gemini, "creative writer" for Claude). Falls back to default behavior when left empty.

---

## [5.7] - 2025-02-28

### Added
- **PDF Chat Export** – new "Export PDF" button in the chat toolbar. Opens a formatted print-ready page with styled message bubbles and triggers the browser's print/save dialog.
- **Token counters in Text and Image Analyze** – each request now displays token usage next to the Copy/Read buttons, consistent with the existing chat counter.
- **Send edited image to Analyze** – after image editing, a "🔍 Send to Analyze" button sends the result directly to the Image → Analyze tab.
- **Re-edit button** – after image editing, a "🔄 Re-edit" button loads the result as new input for another round of editing, enabling iterative editing loops.

### Fixed
- Code block **Copy** and **Download** buttons now work correctly. Root cause: `renderMarkdown()` was serializing the DOM to `innerHTML`, which stripped all event listeners. Refactored to return a `DocumentFragment` and replaced all `innerHTML = renderMarkdown(...)` calls with `replaceChildren()`.
- Manually copied code no longer has formatting artifacts caused by HTML serialization.

---

## [5.6] - 2025-02-27

### Added
- **Image Edit Model selector** in Settings – separate from the Image Generation model. Includes a "🔍 Scan edit models" button that fetches available Gemini image-capable models from the API.
- **Nano Banana support** – image editing now uses `generateContent` with Gemini image models (`gemini-2.5-flash-image`, `gemini-3-pro-image-preview`, `gemini-3.1-flash-image-preview`) instead of the Imagen `:predict` endpoint.
- Default edit models pre-populated based on official Google documentation – no scan required to get started.

### Fixed
- Image editing no longer fails with "Image in input is not supported". Root cause: incorrect API endpoint and payload format. Switched from Imagen `:predict` with `referenceImages` to Gemini `generateContent` with `inlineData`.
- Removed `responseModalities` from the edit request body – the model returns an image automatically when given an image input.
- Improved error messages: if the model returns only text, the response is shown to help diagnose issues.

---

## [5.5] - 2025-02-26

### Added
- **Code block download UI** – every fenced code block now renders with a header containing: language badge, editable filename input (auto-detected from code comments like `// filename.js` or `<!-- file.html -->`), Copy (📋) and Download (⬇️) buttons.
- **Clickable links in chat** – URLs in AI responses are automatically converted to `<a>` tags opening in a new tab.
- **Resizable chat textarea** – minimum height increased to 48px, maximum to 200px, with a manual resize handle via CSS `resize: vertical`.
- **Image Edit tab** – new ✏️ Edit sub-tab in the Image section with drag & drop, file picker, and Ctrl+V clipboard paste support for the input image.
- **Clipboard paste** (Ctrl+V) support in all image sections: Chat, Analyze, and Edit.
- **File picker button** (📎 Select file) added to the Analyze sub-tab.

---

## [5.4] - 2025-02-25

### Added
- **Custom Prompt Snippets** – create, name, edit, and delete reusable prompt templates accessible from the chat toolbar.
- **Edit & Regenerate** – pencil icon on sent messages allows editing and resending; AI response is regenerated in place.
- **Font size control** in Settings (Small / Medium / Large).
- **Anthropic Claude** support added (Claude Sonnet 4, Opus 4, Haiku 3.5) with streaming via the Messages API.

### Changed
- Chat model list reorganized into provider groups (Google / OpenAI / Anthropic) with `<optgroup>` labels.

---

## [5.3] - 2025-02-20

### Added
- Initial public release.
- Multi-provider streaming chat: Google Gemini, OpenAI GPT.
- Image Generation: Google Imagen 4, DALL-E 3 with optional prompt enhancement.
- Image Analysis (Vision) with screen crop tool and drag & drop.
- Text Tools: Explain, Summarize, Translate, Rewrite – operating on selected webpage text.
- Gemini model scanner in Settings – detects available models from your API key.
- Light / Dark / System theme support.
- English and Polish UI with auto-detection from browser language.
- Context menu integration: right-click an image → "Send to AI Agent".
- Floating action button on web pages.
- Chat history persistence via `chrome.storage.local`.
- Token counter in chat.
- Markdown rendering with custom parser and syntax highlighter (zero external dependencies).
