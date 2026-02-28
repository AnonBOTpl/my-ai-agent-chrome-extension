// ============================================================
// INTERNACJONALIZACJA (i18n)
// PL — przeglądarka po polsku
// EN — wszystkie inne języki
// ============================================================

const TRANSLATIONS = {
  pl: {
    appName: "Agent AI",
    stopTTS: "Zatrzymaj czytanie",
    settings: "Ustawienia",
    tokensTip: "Tokeny użyte w tej sesji",

    tabChat: "💬 Chat",
    tabText: "📄 Tekst",
    tabImage: "🖼️ Obraz",

    exportMd: "⬇️ Eksport .md",
    clearChat: "🗑️ Wyczyść",

    // Snippets
    snippetExplain: "💡 Wyjaśnij",
    snippetSummarize: "📝 Streszcz",
    snippetCode: "🔧 Kod",
    snippetTranslate: "🌍 Tłumacz",
    snippetAddCustom: "+ Własny",
    snippetExplainPrefix: "Wyjaśnij krótko: ",
    snippetSummarizePrefix: "Streszcz w 3 zdaniach: ",
    snippetCodePrefix: "Popraw błędy w tym kodzie:\n\n",
    snippetTranslatePrefix: "Przetłumacz na polski: ",

    // Custom snippets modal
    customSnippetsTitle: "📌 Własne szablony",
    snippetName: "Nazwa (wyświetlana na przycisku):",
    snippetNamePlaceholder: "np. Napisz e-mail",
    snippetPrefix: "Prefiks (dopisywany przed wiadomością):",
    snippetPrefixPlaceholder: "np. Napisz profesjonalny e-mail: ",
    addSnippet: "➕ Dodaj szablon",
    noCustomSnippets: "Brak własnych szablonów. Dodaj pierwszy!",
    deleteSnippet: "✖",
    closeModal: "✖ Zamknij",

    // Chat
    chatPlaceholder: "Napisz coś... lub przeciągnij obraz (Enter = wyślij, Shift+Enter = nowa linia)",
    attachImage: "Dołącz obraz do wiadomości",
    sendMessage: "Wyślij",
    greeting: "Cześć! W czym mogę pomóc?",
    noApiKey: "⚠️ Ustaw klucz API w ustawieniach.",
    errorPrefix: "Błąd: ",

    // Potwierdzenie wyczyszczenia
    confirmClearTitle: "Wyczyścić historię?",
    confirmClearMsg: "Tej operacji nie można cofnąć. Cała historia rozmowy zostanie usunięta.",
    confirmClearOk: "🗑️ Wyczyść",
    confirmClearCancel: "Anuluj",

    // Edycja wiadomości
    editMessage: "Edytuj wiadomość",
    editSave: "✅ Zapisz i wyślij ponownie",
    editCancel: "Anuluj",

    // Regeneruj odpowiedź
    regenerate: "🔄 Regeneruj",

    // Tekst
    textHint: "Zaznacz tekst na stronie i wybierz akcję:",
    toolExplain: "🔍 Wyjaśnij",
    toolSummarize: "📝 Streszcz",
    toolTranslate: "🇵🇱 Tłumacz na PL",
    toolRewrite: "✏️ Popraw styl",
    toolRead: "🗣️ Czytaj na głos",
    textResultPlaceholder: "Wynik pojawi się tutaj...",
    copyResult: "📋 Kopiuj",
    readResult: "🗣️ Czytaj",
    noTextSelected: "⚠️ Zaznacz tekst na stronie!",
    noTabAvailable: "Brak dostępnej karty.",
    processing: "⏳ Przetwarzam...",
    reading: "🗣️ Czytam...",

    // Obraz
    subAnalyze: "🔍 Analiza",
    subGenerate: "🎨 Generuj",
    subEdit: "✏️ Edytuj",
    dropZoneText: "Przeciągnij tu obrazek",
    dropZoneOr: "lub:",
    selectArea: "📸 Zaznacz fragment ekranu",
    analyzeImg: "👀 Co jest na zdjęciu?",
    sdPrompt: "🎨 Prompt Stable Diffusion",
    sendToChat: "💬 Wyślij do chatu z pytaniem",
    imageResultPlaceholder: "...",
    removeImage: "✖ Usuń",
    imageTooBig: "⚠️ Obraz za duży (max 10 MB).",
    imageTypeError: "⚠️ Obsługiwane są tylko pliki graficzne.",
    fetchingImage: "⏳ Pobieram obraz...",
    imageReady: "Gotowe. Wybierz akcję.",
    imageRestored: "Przywrócono ostatni obrazek.",
    analyzingImage: "⏳ Analizuję...",
    cropProcessing: "📸 Przetwarzam zrzut...",
    cropReady: "✅ Wycięto fragment. Możesz teraz analizować.",
    sendSignal: "⏳ Wysyłam sygnał...",
    refreshPage: "❌ Odśwież stronę (F5)!",
    areaReady: "✅ Zaznacz obszar na ekranie.",
    tabError: "❌ Błąd karty.",
    cropError: "Błąd zrzutu: ",
    tabNotFound: "Błąd: nie znaleziono karty.",

    // Generowanie
    generateHint: "Opisz co chcesz wygenerować (PL lub EN):",
    generatePlaceholder: "Np. Cyberpunkowy kot na motocyklu...",
    enhancePrompt: "✨ Ulepsz prompt przez AI (zalecane)",
    generateBtn: "🎨 Generuj Obraz",
    enhancingPrompt: "🚀 Ulepszam prompt...",
    generatingImage: "🎨 Generuję obraz...",
    generatedOk: "✅ Wygenerowano!",
    downloadImage: "⬇️ Pobierz obraz",
    imageLoadError: "❌ Nie udało się załadować obrazu.",
    noApiKeyGen: "⚠️ Brak klucza API do generowania!",
    imagenUnavailable: "❌ Google Imagen niedostępny: ",

    // Ustawienia
    settingsTitle: "⚙️ Ustawienia",
    sectionProviders: "🔑 Klucze API",
    geminiKeyLabel: "Klucz API — Google Gemini:",
    geminiKeyHint: "Wymagany do czatu Gemini, analizy obrazów i generowania grafiki.",
    openaiKeyLabel: "Klucz API — OpenAI:",
    openaiKeyHint: "Wymagany do modeli GPT i DALL-E.",
    anthropicKeyLabel: "Klucz API — Anthropic (Claude):",
    anthropicKeyHint: "Wymagany do modeli Claude.",
    keysStoredLocally: "Klucze przechowywane lokalnie, nie synchronizowane.",

    // Walidacja kluczy
    keyValidating: "⏳ Weryfikuję...",
    keyValid: "✅ Klucz poprawny",
    keyInvalid: "❌ Klucz nieprawidłowy",
    keyValidateBtn: "Sprawdź",

    sectionChatModel: "🤖 Model do czatu",
    chatModelLabel: "Wybierz model:",
    sectionImageModel: "🖼️ Model do generowania obrazów",
    imageModelLabel: "Dostawca / model:",
    imageModelNote: "Generowanie obrazów wymaga klucza Gemini (Imagen) lub OpenAI (DALL-E).",
    sectionAppearance: "🎨 Wygląd",
    themeLabel: "Motyw:",
    themeLight: "☀️ Jasny",
    themeDark: "🌙 Ciemny",
    themeSystem: "🖥️ Systemowy (Auto)",
    languageLabel: "Język interfejsu:",
    langAuto: "🌐 Automatyczny",
    langPl: "🇵🇱 Polski",
    langEn: "🇬🇧 English",
    fontSizeLabel: "Rozmiar czcionki:",
    fontSizeSmall: "Mały",
    fontSizeMedium: "Średni",
    fontSizeLarge: "Duży",
    sectionTTS: "🗣️ Czytanie na głos",
    voiceLabel: "Głos lektora:",
    autoReadLabel: "Czytaj odpowiedzi automatycznie",
    saveSettings: "💾 Zapisz i Zamknij",

    // Skaner modeli
    scanBtn: "🔍 Skanuj dostępne modele Gemini",
    scanRunning: "⏳ Skanuję...",
    scanFound: (n) => `✅ Znaleziono ${n} model(i)`,
    scanNone: "⚠️ Brak modeli obsługujących generowanie obrazów",
    scanNoKey: "⚠️ Najpierw wpisz klucz API Gemini",
    scanError: (msg) => `❌ Błąd: ${msg}`,

    // Błędy API
    apiError: "Błąd API: ",
    noResponse: "Brak odpowiedzi od modelu",
    noResponseFilter: "Brak odpowiedzi (możliwy filtr bezpieczeństwa)",

    // Eksport
    exportTitle: "# Historia chatu — Agent AI\n",
    exportYou: "**Ty**",
    exportAgent: "**Agent AI**",
    exportImageAttached: "\n\n*[obraz dołączony]*",

    // Prompty AI
    promptExplain: "Wyjaśnij poniższy tekst prosto i zrozumiale:\n",
    promptSummarize: "Streszcz poniższy tekst w kilku zdaniach:\n",
    promptTranslate: "Przetłumacz poniższy tekst na język polski:\n",
    promptRewrite: "Popraw styl i gramatykę poniższego tekstu, zachowując jego sens:\n",
    promptAnalyzeImage: "Opisz szczegółowo co widzisz na tym obrazie. Odpowiedz po polsku.",
    promptSDPrompt: "Act as a prompt engineer. Create a detailed Stable Diffusion / Imagen prompt for this image. Return ONLY the raw prompt in English.",
    promptEnhance: `Rewrite this description into a detailed English prompt for an AI image generator (Imagen style). Description: "`,
    promptEnhanceSuffix: `". Return ONLY the raw prompt, no explanations.`,
  },

  en: {
    appName: "AI Agent",
    stopTTS: "Stop reading",
    settings: "Settings",
    tokensTip: "Tokens used in this session",

    tabChat: "💬 Chat",
    tabText: "📄 Text",
    tabImage: "🖼️ Image",

    exportMd: "⬇️ Export .md",
    clearChat: "🗑️ Clear",

    snippetExplain: "💡 Explain",
    snippetSummarize: "📝 Summarize",
    snippetCode: "🔧 Code",
    snippetTranslate: "🌍 Translate",
    snippetAddCustom: "+ Custom",
    snippetExplainPrefix: "Explain briefly: ",
    snippetSummarizePrefix: "Summarize in 3 sentences: ",
    snippetCodePrefix: "Fix errors in this code:\n\n",
    snippetTranslatePrefix: "Translate to English: ",

    customSnippetsTitle: "📌 Custom Templates",
    snippetName: "Name (shown on button):",
    snippetNamePlaceholder: "e.g. Write an email",
    snippetPrefix: "Prefix (prepended to message):",
    snippetPrefixPlaceholder: "e.g. Write a professional email: ",
    addSnippet: "➕ Add template",
    noCustomSnippets: "No custom templates yet. Add your first!",
    deleteSnippet: "✖",
    closeModal: "✖ Close",

    chatPlaceholder: "Type something... or drag an image (Enter = send, Shift+Enter = new line)",
    attachImage: "Attach image to message",
    sendMessage: "Send",
    greeting: "Hi! How can I help you?",
    noApiKey: "⚠️ Set an API key in Settings.",
    errorPrefix: "Error: ",

    confirmClearTitle: "Clear chat history?",
    confirmClearMsg: "This action cannot be undone. The entire conversation will be deleted.",
    confirmClearOk: "🗑️ Clear",
    confirmClearCancel: "Cancel",

    editMessage: "Edit message",
    editSave: "✅ Save & resend",
    editCancel: "Cancel",

    regenerate: "🔄 Regenerate",

    textHint: "Select text on the page and choose an action:",
    toolExplain: "🔍 Explain",
    toolSummarize: "📝 Summarize",
    toolTranslate: "🇬🇧 Translate to EN",
    toolRewrite: "✏️ Improve style",
    toolRead: "🗣️ Read aloud",
    textResultPlaceholder: "Result will appear here...",
    copyResult: "📋 Copy",
    readResult: "🗣️ Read",
    noTextSelected: "⚠️ Select text on the page first!",
    noTabAvailable: "No available tab.",
    processing: "⏳ Processing...",
    reading: "🗣️ Reading...",

    subAnalyze: "🔍 Analyze",
    subGenerate: "🎨 Generate",
    subEdit: "✏️ Edit",
    dropZoneText: "Drag an image here",
    dropZoneOr: "or:",
    selectArea: "📸 Select screen area",
    analyzeImg: "👀 What's in the image?",
    sdPrompt: "🎨 Stable Diffusion Prompt",
    sendToChat: "💬 Send to chat with question",
    imageResultPlaceholder: "...",
    removeImage: "✖ Remove",
    imageTooBig: "⚠️ Image too large (max 10 MB).",
    imageTypeError: "⚠️ Only image files are supported.",
    fetchingImage: "⏳ Fetching image...",
    imageReady: "Ready. Choose an action.",
    imageRestored: "Last image restored.",
    analyzingImage: "⏳ Analyzing...",
    cropProcessing: "📸 Processing screenshot...",
    cropReady: "✅ Area cropped. You can now analyze it.",
    sendSignal: "⏳ Sending signal...",
    refreshPage: "❌ Refresh the page (F5)!",
    areaReady: "✅ Select an area on the screen.",
    tabError: "❌ Tab error.",
    cropError: "Screenshot error: ",
    tabNotFound: "Error: tab not found.",

    generateHint: "Describe what you want to generate:",
    generatePlaceholder: "E.g. Cyberpunk cat on a motorcycle...",
    enhancePrompt: "✨ Enhance prompt with AI (recommended)",
    generateBtn: "🎨 Generate Image",
    enhancingPrompt: "🚀 Enhancing prompt...",
    generatingImage: "🎨 Generating image...",
    generatedOk: "✅ Generated!",
    downloadImage: "⬇️ Download image",
    imageLoadError: "❌ Failed to load image.",
    noApiKeyGen: "⚠️ API key required for image generation!",
    imagenUnavailable: "❌ Google Imagen unavailable: ",

    settingsTitle: "⚙️ Settings",
    sectionProviders: "🔑 API Keys",
    geminiKeyLabel: "API Key — Google Gemini:",
    geminiKeyHint: "Required for Gemini chat, image analysis and image generation.",
    openaiKeyLabel: "API Key — OpenAI:",
    openaiKeyHint: "Required for GPT models and DALL-E.",
    anthropicKeyLabel: "API Key — Anthropic (Claude):",
    anthropicKeyHint: "Required for Claude models.",
    keysStoredLocally: "Keys stored locally, never synced to the cloud.",

    keyValidating: "⏳ Validating...",
    keyValid: "✅ Key valid",
    keyInvalid: "❌ Invalid key",
    keyValidateBtn: "Check",

    sectionChatModel: "🤖 Chat Model",
    chatModelLabel: "Select model:",
    sectionImageModel: "🖼️ Image Generation Model",
    imageModelLabel: "Provider / model:",
    imageModelNote: "Image generation requires a Gemini key (Imagen) or OpenAI key (DALL-E).",
    sectionAppearance: "🎨 Appearance",
    themeLabel: "Theme:",
    themeLight: "☀️ Light",
    themeDark: "🌙 Dark",
    themeSystem: "🖥️ System (Auto)",
    languageLabel: "Interface language:",
    langAuto: "🌐 Automatic",
    langPl: "🇵🇱 Polski",
    langEn: "🇬🇧 English",
    fontSizeLabel: "Font size:",
    fontSizeSmall: "Small",
    fontSizeMedium: "Medium",
    fontSizeLarge: "Large",
    sectionTTS: "🗣️ Text-to-Speech",
    voiceLabel: "Voice:",
    autoReadLabel: "Read responses automatically",
    saveSettings: "💾 Save & Close",

    scanBtn: "🔍 Scan available Gemini image models",
    scanRunning: "⏳ Scanning...",
    scanFound: (n) => `✅ Found ${n} model(s)`,
    scanNone: "⚠️ No models supporting image generation found",
    scanNoKey: "⚠️ Enter your Gemini API key above first",
    scanError: (msg) => `❌ Error: ${msg}`,

    apiError: "API Error: ",
    noResponse: "No response from model",
    noResponseFilter: "No response (possible safety filter)",

    exportTitle: "# Chat History — AI Agent\n",
    exportYou: "**You**",
    exportAgent: "**AI Agent**",
    exportImageAttached: "\n\n*[image attached]*",

    promptExplain: "Explain the following text simply and clearly:\n",
    promptSummarize: "Summarize the following text in a few sentences:\n",
    promptTranslate: "Translate the following text to English:\n",
    promptRewrite: "Improve the style and grammar of the following text, preserving its meaning:\n",
    promptAnalyzeImage: "Describe in detail what you see in this image.",
    promptSDPrompt: "Act as a prompt engineer. Create a detailed Stable Diffusion / Imagen prompt for this image. Return ONLY the raw prompt in English.",
    promptEnhance: `Rewrite this description into a detailed English prompt for an AI image generator (Imagen style). Description: "`,
    promptEnhanceSuffix: `". Return ONLY the raw prompt, no explanations.`,
  }
};

function detectLang() {
  const nav = (navigator.language || navigator.userLanguage || 'en').toLowerCase();
  return nav.startsWith('pl') ? 'pl' : 'en';
}

function getT(langOverride) {
  const lang = langOverride || detectLang();
  return TRANSLATIONS[lang] || TRANSLATIONS.en;
}
