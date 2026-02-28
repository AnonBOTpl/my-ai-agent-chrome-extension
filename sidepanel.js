// ============================================================
// KONFIGURACJA MODELI
// ============================================================
const CHAT_MODELS = [
  { id:"gemini-2.5-flash",      label:"Gemini 2.5 Flash (recommended)", provider:"gemini" },
  { id:"gemini-2.5-pro",        label:"Gemini 2.5 Pro (best quality)",   provider:"gemini" },
  { id:"gemini-2.5-flash-lite", label:"Gemini 2.5 Flash Lite (fastest)", provider:"gemini" },
  { id:"gemini-2.0-flash",      label:"Gemini 2.0 Flash",                provider:"gemini" },
  { id:"gpt-4o",                label:"GPT-4o",                          provider:"openai" },
  { id:"gpt-4o-mini",           label:"GPT-4o mini",                     provider:"openai" },
  { id:"gpt-4.1",               label:"GPT-4.1",                         provider:"openai" },
  { id:"o3-mini",               label:"o3-mini",                         provider:"openai" },
  { id:"claude-opus-4-5",       label:"Claude Opus 4",                   provider:"anthropic" },
  { id:"claude-sonnet-4-5",     label:"Claude Sonnet 4",                 provider:"anthropic" },
  { id:"claude-haiku-4-5",      label:"Claude Haiku 3.5",                provider:"anthropic" },
  { id:"claude-sonnet-3-7",     label:"Claude Sonnet 3.7",               provider:"anthropic" },
];

const IMAGE_GEN_MODELS = [
  { id:"imagen-4.0-generate-preview-06-06", label:"Google Imagen 4 (Gemini key)", provider:"gemini" },
  { id:"dall-e-3", label:"DALL-E 3 (OpenAI key)", provider:"openai" },
  { id:"dall-e-2", label:"DALL-E 2 (OpenAI key)", provider:"openai" },
];

// Domyślne modele Gemini do edycji obrazów (obsługują natywną edycję)
// Źródło: https://ai.google.dev/gemini-api/docs/image-generation
const IMAGE_EDIT_MODELS_DEFAULT = [
  { id:"gemini-2.5-flash-image",         label:"Gemini 2.5 Flash Image (Nano Banana)" },
  { id:"gemini-3-pro-image-preview",     label:"Gemini 3 Pro Image Preview (Nano Banana Pro)" },
  { id:"gemini-3.1-flash-image-preview", label:"Gemini 3.1 Flash Image Preview" },
];

const PROVIDER_LABELS = { gemini:"Google Gemini", openai:"OpenAI", anthropic:"Anthropic" };
const SYSTEM_PROMPT_PL = "Jesteś pomocnym asystentem wbudowanym w przeglądarkę Chrome. Odpowiadaj zwięźle i na temat. Używaj języka polskiego chyba że użytkownik pisze w innym języku.";
const SYSTEM_PROMPT_EN = "You are a helpful assistant embedded in Chrome. Be concise and on-topic. Respond in the user's language.";

// ============================================================
// STAN
// ============================================================
let apiKeys          = { gemini:"", openai:"", anthropic:"" };
let currentChatModelId  = "gemini-2.5-flash";
let currentImageModelId = "imagen-4.0-generate-preview-06-06";
let currentImageEditModelId = "gemini-2.5-flash-image";

let systemPrompts = { gemini: '', openai: '', anthropic: '' };
let currentVoice     = null;
let autoRead         = false;
let enhancePrompt    = true;
let selectedImageBase64 = null;
let selectedImageMime   = "image/jpeg";
let chatAttachBase64 = null;
let chatAttachMime   = "image/jpeg";
let currentTheme     = "light";
let currentLang      = "auto";
let currentFontSize  = "medium";
let T                = null;
let chatHistory      = [];
let isStreaming      = false;
let totalTokens      = 0;
let customSnippets   = [];  // [{name, prefix}]
// Indeks ostatniej wiadomości AI — do regeneracji
let lastAiMsgEl      = null;
let lastAiMsgIndex   = -1; // indeks w chatHistory (wiadomość model)

// ============================================================
// DOM
// ============================================================
const $ = id => document.getElementById(id);

const chatContainer    = $('chat-container');
const chatInput        = $('chatInput');
const btnChatSend      = $('btnChatSend');
const btnClearChat     = $('btnClearChat');
const btnExportChat    = $('btnExportChat');
const btnExportPdf     = $('btnExportPdf');
const chatDropTarget   = $('chatDropTarget');
const chatImgWrap      = $('chat-image-preview-wrap');
const chatImgPreview   = $('chatImagePreview');
const btnRemoveChatImg = $('btnRemoveChatImage');
const btnAttachImage   = $('btnAttachImage');
const chatFileInput    = $('chatFileInput');
const tokenCounter     = $('token-counter');
const tokenCountEl     = $('tokenCount');

const textOutput       = $('text-output');
const textActions      = $('text-actions');
const btnCopyText      = $('btnCopyTextResult');
const btnReadText      = $('btnReadTextResult');
const textTokenCounter = $('text-token-counter');
const textTokenCountEl = $('textTokenCount');
const imageTokenCounter= $('image-token-counter');
const imageTokenCountEl= $('imageTokenCount');

const dropZone           = $('drop-zone');
const btnSelectArea      = $('btnSelectArea');
const imagePreviewCont   = $('image-preview-container');
const imagePreview       = $('image-preview');
const imageActions       = $('image-actions');
const btnClearImage      = $('btnClearImage');
const btnAnalyzeImg      = $('btnAnalyzeImg');
const btnSDPrompt        = $('btnStableDiffusion');
const btnSendImgToChat   = $('btnSendImgToChat');
const imageOutput        = $('image-output');
const imageResultActions = $('image-result-actions');
const btnCopyImage       = $('btnCopyImageResult');
const btnReadImage       = $('btnReadImageResult');

const genPromptInput   = $('genPromptInput');
const enhanceCheck     = $('enhancePromptCheck');
const btnGenerateImage = $('btnGenerateImage');
const genNoGemini      = $('gen-no-gemini');
const genResultCont    = $('gen-result-container');
const genSkeleton      = $('gen-skeleton');
const genStatus        = $('gen-status');
const generatedImage   = $('generated-image');
const btnDownloadImg   = $('btnDownloadImg');

const settingsModal    = $('settings-modal');
const btnSettings      = $('btnSettings');
const btnModelSwitch   = $('btnModelSwitch');
const modelSwitchLabel = $('modelSwitchLabel');
const modelSwitchDropdown = $('modelSwitchDropdown');
const systemPromptGemini   = $('systemPromptGemini');
const systemPromptOpenAI   = $('systemPromptOpenAI');
const systemPromptAnthropic= $('systemPromptAnthropic');
const btnSaveSettings  = $('btnSaveSettings');
const apiKeyInput      = $('apiKeyInput');
const openaiKeyInput   = $('openaiKeyInput');
const anthropicKeyInput= $('anthropicKeyInput');
const modelSelect      = $('modelSelect');
const imageModelSelect = $('imageModelSelect');
const imageEditModelSelect = $('imageEditModelSelect');
const voiceSelect      = $('voiceSelect');
const autoReadCheck    = $('autoReadCheck');
const btnStopTTS       = $('btnStopTTS');
const themeSelect      = $('themeSelect');
const langSelect       = $('langSelect');

// Modals
const customSnippetsModal = $('custom-snippets-modal');
const btnOpenCustomSnippets = $('btnOpenCustomSnippets');
const btnCloseCustomSnippets = $('btnCloseCustomSnippets');
const customSnippetsList = $('custom-snippets-list');
const snippetNameInput   = $('snippetNameInput');
const snippetPrefixInput = $('snippetPrefixInput');
const btnAddSnippet      = $('btnAddSnippet');

const confirmModal     = $('confirm-modal');
const confirmTitle     = $('confirmTitle');
const confirmMsg       = $('confirmMsg');
const btnConfirmOk     = $('btnConfirmOk');
const btnConfirmCancel = $('btnConfirmCancel');

const editModal        = $('edit-modal');
const editMsgInput     = $('editMsgInput');
const btnEditSave      = $('btnEditSave');
const btnEditCancel    = $('btnEditCancel');
const btnCloseEdit     = $('btnCloseEdit');

// ============================================================
// 1. INIT
// ============================================================
(async () => {
  await loadSettings();
  applyLang();
  populateModelSelects();
  populateVoices();
  if (window.speechSynthesis.onvoiceschanged !== undefined)
    window.speechSynthesis.onvoiceschanged = populateVoices;
  checkPendingImage();
})();

async function checkPendingImage() {
  const data = await chrome.storage.session.get('pendingImageUrl');
  if (data.pendingImageUrl) {
    await chrome.storage.session.remove('pendingImageUrl');
    document.querySelector('[data-target="view-image"]').click();
    handleSelectedImage(data.pendingImageUrl);
  }
}

chrome.runtime.onMessage.addListener(req => {
  if (req.action === "area_selected") processCrop(req.area);
});

// ============================================================
// 2. JĘZYK
// ============================================================
function resolvedLang() { return currentLang === 'auto' ? detectLang() : currentLang; }
function applyLang() { T = getT(resolvedLang()); applyTranslations(); }

function applyTranslations() {
  const set = (id, val) => { const el=$(id); if(el && val!==undefined) el.textContent=val; };
  const attr = (id, a, v) => { const el=$(id); if(el) el.setAttribute(a,v); };

  set('appName', T.appName);
  attr('btnStopTTS','title',T.stopTTS);
  attr('btnSettings','title',T.settings);
  set('tabChat', T.tabChat); set('tabText', T.tabText); set('tabImage', T.tabImage);
  set('btnExportChat', T.exportMd); set('btnClearChat', T.clearChat);
  set('snipExplain', T.snippetExplain); set('snipSummarize', T.snippetSummarize);
  set('snipCode', T.snippetCode); set('snipTranslate', T.snippetTranslate);
  set('btnOpenCustomSnippets', T.snippetAddCustom);
  attr('chatInput','placeholder',T.chatPlaceholder);
  attr('btnAttachImage','title',T.attachImage);
  attr('btnChatSend','title',T.sendMessage);
  const greet=$('greetingMsg'); if(greet) greet.textContent=T.greeting;
  set('textHint',T.textHint); set('toolExplain',T.toolExplain);
  set('toolSummarize',T.toolSummarize); set('toolTranslate',T.toolTranslate);
  set('toolRewrite',T.toolRewrite); set('toolRead',T.toolRead);
  set('btnCopyTextResult',T.copyResult); set('btnReadTextResult',T.readResult);
  set('subAnalyzeBtn',T.subAnalyze); set('subGenerateBtn',T.subGenerate);
  if(T.subEdit) set('subEditBtn',T.subEdit);
  set('dropZoneText',T.dropZoneText); set('dropZoneOr',T.dropZoneOr);
  set('btnSelectArea',T.selectArea); set('btnAnalyzeImg',T.analyzeImg);
  set('btnStableDiffusion',T.sdPrompt); set('btnSendImgToChat',T.sendToChat);
  set('btnCopyImageResult',T.copyResult); set('btnReadImageResult',T.readResult);
  set('generateHint',T.generateHint); attr('genPromptInput','placeholder',T.generatePlaceholder);
  set('enhanceLabel',T.enhancePrompt); set('btnGenerateImage',T.generateBtn);
  set('btnDownloadImg',T.downloadImage);
  set('settingsTitle',T.settingsTitle); set('sectionProviders',T.sectionProviders);
  set('geminiKeyLabel',T.geminiKeyLabel); set('geminiKeyHint',T.geminiKeyHint);
  set('openaiKeyLabel',T.openaiKeyLabel); set('openaiKeyHint',T.openaiKeyHint);
  set('anthropicKeyLabel',T.anthropicKeyLabel); set('anthropicKeyHint',T.anthropicKeyHint);
  set('keysStoredLocally',T.keysStoredLocally);
  set('btnValidateGemini',T.keyValidateBtn);
  set('btnValidateOpenAI',T.keyValidateBtn);
  set('btnValidateAnthropic',T.keyValidateBtn);
  set('sectionChatModel',T.sectionChatModel); set('chatModelLabel',T.chatModelLabel);
  set('sectionImageModel',T.sectionImageModel); set('imageModelLabel',T.imageModelLabel);
  set('imageModelNote',T.imageModelNote);
  set('sectionAppearance',T.sectionAppearance); set('themeLabel',T.themeLabel);
  set('optLight',T.themeLight); set('optDark',T.themeDark); set('optSystem',T.themeSystem);
  set('languageLabel',T.languageLabel);
  set('optLangAuto',T.langAuto); set('optLangPl',T.langPl); set('optLangEn',T.langEn);
  set('fontSizeLabel',T.fontSizeLabel);
  set('fsBtnSmall',T.fontSizeSmall); set('fsBtnMedium',T.fontSizeMedium); set('fsBtnLarge',T.fontSizeLarge);
  set('sectionTTS',T.sectionTTS); set('voiceLabel',T.voiceLabel);
  set('autoReadLabel',T.autoReadLabel); set('btnSaveSettings',T.saveSettings);
  set('btnScanImageModels',T.scanBtn);
  set('customSnippetsTitle',T.customSnippetsTitle);
  set('snippetNameLbl',T.snippetName); set('snippetPrefixLbl',T.snippetPrefix);
  attr('snippetNameInput','placeholder',T.snippetNamePlaceholder);
  attr('snippetPrefixInput','placeholder',T.snippetPrefixPlaceholder);
  set('btnAddSnippet',T.addSnippet); set('btnCloseCustomSnippets',T.closeModal);
  set('editMsgTitle',T.editMessage);
  set('btnEditSave',T.editSave); set('btnEditCancel',T.editCancel);

  $('snipExplain').dataset.prefix   = T.snippetExplainPrefix;
  $('snipSummarize').dataset.prefix = T.snippetSummarizePrefix;
  $('snipCode').dataset.prefix      = T.snippetCodePrefix;
  $('snipTranslate').dataset.prefix = T.snippetTranslatePrefix;

  const tOut=$('text-output');
  if(tOut && (tOut.textContent==='Result will appear here...' || tOut.textContent==='Wynik pojawi się tutaj...'))
    tOut.textContent=T.textResultPlaceholder;

  renderCustomSnippetBtns();
  updateGenerateModelWarning();
}

// ============================================================
// 3. MOTYW + FONT SIZE
// ============================================================
function applyTheme(theme) {
  document.body.classList.remove('dark-theme');
  const isDark = theme==='dark' || (theme==='system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  if(isDark) document.body.classList.add('dark-theme');
}
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
  if(currentTheme==='system') applyTheme('system');
});

function applyFontSize(size) {
  document.body.classList.remove('font-small','font-medium','font-large');
  document.body.classList.add('font-' + (size||'medium'));
  // Zaktualizuj active na przyciskach
  document.querySelectorAll('.font-size-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.size === size);
  });
}

document.querySelectorAll('.font-size-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    currentFontSize = btn.dataset.size;
    applyFontSize(currentFontSize);
  });
});

// ============================================================
// 4. ZAKŁADKI
// ============================================================
document.querySelectorAll('.tab-btn').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(t=>t.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c=>c.classList.remove('active'));
    tab.classList.add('active');
    $(tab.dataset.target).classList.add('active');
  });
});
document.querySelectorAll('.sub-tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.sub-tab-btn').forEach(b=>b.classList.remove('active'));
    document.querySelectorAll('.sub-content').forEach(c=>c.classList.remove('active'));
    btn.classList.add('active');
    $(btn.dataset.subtarget).classList.add('active');
    if(btn.dataset.subtarget==='sub-edit') updateEditBanner();
  });
});

function updateEditBanner() {
  const banner = $('edit-img-info-banner');
  if (!banner) return;
  const hasKey = !!apiKeys.gemini;
  const hasModel = !!currentImageEditModelId;
  if (!hasKey) {
    banner.style.display = '';
    banner.innerHTML = '⚠️ <strong>Gemini API key required.</strong> Please add it in Settings (⚙️).';
  } else if (!hasModel) {
    banner.style.display = '';
    banner.innerHTML = '⚠️ Please select an <strong>Image Edit Model</strong> in Settings.';
  } else {
    banner.style.display = 'none';
  }
}

// ============================================================
// 5. WŁASNE SNIPPETY
// ============================================================
btnOpenCustomSnippets.addEventListener('click', () => {
  renderCustomSnippetsList();
  customSnippetsModal.classList.remove('hidden');
});
btnCloseCustomSnippets.addEventListener('click', () => customSnippetsModal.classList.add('hidden'));
customSnippetsModal.addEventListener('click', e => { if(e.target===customSnippetsModal) customSnippetsModal.classList.add('hidden'); });

btnAddSnippet.addEventListener('click', () => {
  const name   = snippetNameInput.value.trim();
  const prefix = snippetPrefixInput.value;
  if(!name) { snippetNameInput.focus(); return; }
  customSnippets.push({ name, prefix });
  saveCustomSnippets();
  renderCustomSnippetsList();
  renderCustomSnippetBtns();
  snippetNameInput.value = '';
  snippetPrefixInput.value = '';
});

function renderCustomSnippetsList() {
  customSnippetsList.innerHTML = '';
  if(!customSnippets.length) {
    const p = document.createElement('p');
    p.className='no-snippets-msg';
    p.textContent = T.noCustomSnippets;
    customSnippetsList.appendChild(p);
    return;
  }
  customSnippets.forEach((s, i) => {
    const row = document.createElement('div');
    row.className = 'custom-snippet-item';
    const nameEl = document.createElement('span'); nameEl.className='custom-snippet-name'; nameEl.textContent=s.name;
    const prefEl = document.createElement('span'); prefEl.className='custom-snippet-prefix'; prefEl.textContent=s.prefix || '—';
    const del    = document.createElement('button'); del.className='custom-snippet-del'; del.textContent=T.deleteSnippet;
    del.addEventListener('click', () => {
      customSnippets.splice(i, 1);
      saveCustomSnippets();
      renderCustomSnippetsList();
      renderCustomSnippetBtns();
    });
    row.append(nameEl, prefEl, del);
    customSnippetsList.appendChild(row);
  });
}

function renderCustomSnippetBtns() {
  // Usuń stare custom snippety z paska
  document.querySelectorAll('.snippet-custom').forEach(b => b.remove());
  const addBtn = $('btnOpenCustomSnippets');
  customSnippets.forEach(s => {
    const btn = document.createElement('button');
    btn.className = 'snippet-btn snippet-custom';
    btn.textContent = s.name;
    btn.addEventListener('click', () => {
      const prefix = (s.prefix||'').replace(/\\n/g,'\n');
      chatInput.value = prefix + chatInput.value;
      chatInput.focus();
      chatInput.dispatchEvent(new Event('input'));
    });
    $('prompt-snippets').insertBefore(btn, addBtn);
  });
}

async function saveCustomSnippets() {
  await chrome.storage.local.set({ customSnippets });
}

// ============================================================
// 6. CHAT
// ============================================================
btnChatSend.addEventListener('click', handleChatMessage);
chatInput.addEventListener('keydown', e => {
  if(e.key==='Enter' && !e.shiftKey) { e.preventDefault(); handleChatMessage(); }
});
chatInput.addEventListener('input', () => {
  chatInput.style.height='auto';
  chatInput.style.height=Math.min(chatInput.scrollHeight,200)+'px';
});
// Ustaw minimalną wysokość przy starcie
chatInput.style.minHeight='64px';

// Wyczyść — z potwierdzeniem
btnClearChat.addEventListener('click', () => {
  showConfirm(T.confirmClearTitle, T.confirmClearMsg, T.confirmClearOk, T.confirmClearCancel, () => {
    chatHistory=[]; totalTokens=0;
    tokenCounter.classList.add('hidden'); tokenCountEl.textContent='0';
    chatContainer.innerHTML=`<div class="message ai-msg" id="greetingMsg">${T.greeting}</div>`;
    lastAiMsgEl=null; lastAiMsgIndex=-1;
    saveChatHistory();
  });
});

// Export MD
btnExportChat.addEventListener('click', () => {
  if(!chatHistory.length) return;
  const lines=[T.exportTitle];
  chatHistory.forEach(msg => {
    const role=msg.role==='user'?T.exportYou:T.exportAgent;
    const text=msg.parts.filter(p=>p.text).map(p=>p.text).join('');
    const hasImg=msg.parts.some(p=>p.inline_data||p.image_url);
    lines.push(`${role}: ${text}${hasImg?T.exportImageAttached:''}\n`);
  });
  const blob=new Blob([lines.join('\n')],{type:'text/markdown;charset=utf-8'});
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a'); a.href=url;
  a.download=`chat-${new Date().toISOString().slice(0,10)}.md`; a.click();
  URL.revokeObjectURL(url);
});

// Export PDF
btnExportPdf.addEventListener('click', () => {
  if(!chatHistory.length) return;
  const date = new Date().toLocaleDateString(resolvedLang()==='pl'?'pl-PL':'en-US',{year:'numeric',month:'long',day:'numeric'});

  // Konwertuj markdown do HTML dla PDF (prosta wersja bez EventListenerów)
  function mdToHtml(text) {
    // Bloki kodu
    text = text.replace(/```(\w*)\n?([\s\S]*?)```/g, (_,lang,code) =>
      `<pre class="code-block"><code>${code.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}</code></pre>`
    );
    // Inline code
    text = text.replace(/`([^`\n]+)`/g, (_,c) =>
      `<code>${c.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}</code>`
    );
    // Nagłówki
    text = text.replace(/^### (.+)$/gm, '<h3>$1</h3>');
    text = text.replace(/^## (.+)$/gm,  '<h2>$1</h2>');
    text = text.replace(/^# (.+)$/gm,   '<h1>$1</h1>');
    // Bold / italic
    text = text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    text = text.replace(/\*([^*]+)\*/g,     '<em>$1</em>');
    // Linki
    text = text.replace(/(https?:\/\/[^\s<>"')\]]+)/g, '<a href="$1">$1</a>');
    // Listy
    text = text.replace(/^[-*•] (.+)$/gm, '<li>$1</li>');
    text = text.replace(/(<li>[\s\S]*?<\/li>)/g, m => `<ul>${m}</ul>`);
    text = text.replace(/^\d+\. (.+)$/gm, '<li>$1</li>');
    // Paragrafy (linie bez tagów)
    text = text.split('\n').map(line => {
      if(!line.trim()) return '';
      if(/^<[huplo]/.test(line.trim())) return line;
      return `<p>${line}</p>`;
    }).join('');
    return text;
  }

  const msgHtml = chatHistory.map(msg => {
    const role = msg.role==='user' ? (T.exportYou||'You') : (T.exportAgent||'Agent');
    const text = msg.parts.filter(p=>p.text).map(p=>p.text).join('');
    const hasImg = msg.parts.some(p=>p.inline_data||p.image_url);
    const isUser = msg.role==='user';
    const content = isUser
      ? text.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\n/g,'<br>')
      : mdToHtml(text);
    return `<div class="msg ${isUser?'user':'ai'}">
      <div class="role">${role}</div>
      <div class="bubble">${content}${hasImg?'<em class="img-note"> [📎 image]</em>':''}</div>
    </div>`;
  }).join('');

  const modelLabel = CHAT_MODELS.find(m=>m.id===currentChatModelId)?.label || currentChatModelId;
  const msgCount = chatHistory.length;

  const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Chat export – ${date}</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Segoe UI', Arial, sans-serif; font-size: 13px;
         background: #fff; color: #222; padding: 32px; max-width: 820px; margin: 0 auto; }
  h1.title { font-size: 20px; color: #4285f4; border-bottom: 2px solid #4285f4;
       padding-bottom: 10px; margin-bottom: 6px; }
  .meta { font-size: 11px; color: #888; margin-bottom: 28px; }
  .msg { margin-bottom: 16px; display: flex; flex-direction: column; }
  .msg.user { align-items: flex-end; }
  .msg.ai   { align-items: flex-start; }
  .role { font-size: 10px; font-weight: 700; color: #888; text-transform: uppercase;
          margin-bottom: 3px; letter-spacing: 0.5px; }
  .bubble { max-width: 88%; padding: 10px 14px; border-radius: 12px;
            line-height: 1.6; word-break: break-word; }
  .msg.user .bubble { background: #e8f0fe; border-radius: 12px 12px 4px 12px; }
  .msg.ai   .bubble { background: #f8f9fa; border: 1px solid #e0e0e0;
                      border-radius: 4px 12px 12px 12px; }
  .bubble p { margin: 4px 0; }
  .bubble h1,.bubble h2,.bubble h3 { margin: 8px 0 4px; color: #4285f4; font-size: 14px; }
  .bubble h2 { font-size: 13px; } .bubble h3 { font-size: 12px; }
  .bubble ul,.bubble ol { padding-left: 18px; margin: 4px 0; }
  .bubble li { margin: 2px 0; }
  .bubble code { background: #eee; padding: 1px 4px; border-radius: 3px;
                 font-family: 'Consolas','Courier New',monospace; font-size: 11px; }
  .bubble pre.code-block { background: #f0f0f0; border-radius: 6px; padding: 10px 12px;
                           margin: 6px 0; overflow-x: auto; }
  .bubble pre.code-block code { background: none; padding: 0; font-size: 11px;
                                line-height: 1.5; display: block; }
  .bubble a { color: #4285f4; }
  .img-note { font-size: 11px; color: #888; font-style: italic; }
  @media print {
    body { padding: 16px; }
    h1.title { color: #000; border-color: #000; }
    .msg.user .bubble { background: #eee; }
    .msg.ai   .bubble { background: #f5f5f5; }
    .bubble h1,.bubble h2,.bubble h3 { color: #000; }
    .bubble a { color: #000; }
  }
</style>
</head>
<body>
<h1 class="title">💬 Chat export</h1>
<div class="meta">${date} &nbsp;·&nbsp; ${msgCount} messages &nbsp;·&nbsp; ${modelLabel}</div>
${msgHtml}
</body>
</html>`;

  const w = window.open('','_blank','width=880,height=720');
  if(!w) { alert('Pop-up blocked. Allow pop-ups for this extension.'); return; }
  w.document.write(html);
  w.document.close();
  w.focus();
  setTimeout(() => { w.print(); }, 500);
});

// Wbudowane snippety
document.querySelectorAll('.snippet-btn[data-key]').forEach(btn => {
  btn.addEventListener('click', () => {
    const prefix=btn.dataset.prefix.replace(/\\n/g,'\n');
    chatInput.value=prefix+chatInput.value;
    chatInput.focus(); chatInput.dispatchEvent(new Event('input'));
  });
});

// Attach image
btnAttachImage.addEventListener('click', ()=>chatFileInput.click());
chatFileInput.addEventListener('change', e=>{const f=e.target.files[0];if(f)loadChatAttachment(f);chatFileInput.value='';});
chatDropTarget.addEventListener('dragover', e=>{e.preventDefault();chatDropTarget.classList.add('drag-active');});
chatDropTarget.addEventListener('dragleave', ()=>chatDropTarget.classList.remove('drag-active'));
chatDropTarget.addEventListener('drop', e=>{
  e.preventDefault();chatDropTarget.classList.remove('drag-active');
  const f=e.dataTransfer.files?.[0];
  if(f&&f.type.startsWith('image/')) loadChatAttachment(f);
});

// ── Wklejanie ze schowka – CHAT ─────────────────────────────
document.addEventListener('paste', e => {
  const activeTab = document.querySelector('.tab-content.active');
  const items = e.clipboardData?.items;
  if (!items) return;
  for (const item of items) {
    if (item.type.startsWith('image/')) {
      const file = item.getAsFile();
      if (!file) continue;
      if (activeTab?.id === 'view-chat') {
        loadChatAttachment(file);
      } else if (activeTab?.id === 'view-image') {
        const activeSub = activeTab.querySelector('.sub-content.active');
        if (activeSub?.id === 'sub-analyze') {
          loadAnalyzeAttachment(file);
        } else if (activeSub?.id === 'sub-edit') {
          loadEditAttachment(file);
        }
      }
      e.preventDefault();
      break;
    }
  }
});

// ── Załącznik + drop dla ANALYZE ────────────────────────────
const analyzeFileInput = $('analyzeFileInput');
analyzeFileInput.addEventListener('change', e => {
  const f = e.target.files[0];
  if (f) loadAnalyzeAttachment(f);
  analyzeFileInput.value = '';
});

function loadAnalyzeAttachment(file) {
  if (!file.type.startsWith('image/')) return;
  if (file.size > MAX_IMAGE_SIZE_BYTES) { alert(T.imageTooBig); return; }
  const reader = new FileReader();
  reader.onload = evt => setupImagePreview(evt.target.result, file.type);
  reader.readAsDataURL(file);
}

// ============================================================
// EDYTUJ OBRAZ
// ============================================================
let editImageBase64 = null;
let editImageMime = 'image/jpeg';

const editDropZone      = $('edit-drop-zone');
const editPreviewCont   = $('edit-preview-container');
const editImagePreview  = $('editImagePreview');
const btnClearEditImage = $('btnClearEditImage');
const editFileInput     = $('editFileInput');
const editPromptInput   = $('editPromptInput');
const btnEditImage      = $('btnEditImage');
const editResultCont    = $('edit-result-container');
const editSkeleton      = $('edit-skeleton');
const editStatus        = $('edit-status');
const editedImage       = $('edited-image');
const btnDownloadEditImg= $('btnDownloadEditImg');

editFileInput.addEventListener('change', e => {
  const f = e.target.files[0];
  if (f) loadEditAttachment(f);
  editFileInput.value = '';
});

editDropZone.addEventListener('dragover', e => { e.preventDefault(); editDropZone.classList.add('drag-over'); });
editDropZone.addEventListener('dragleave', () => editDropZone.classList.remove('drag-over'));
editDropZone.addEventListener('drop', e => {
  e.preventDefault(); editDropZone.classList.remove('drag-over');
  const f = e.dataTransfer.files?.[0];
  if (f && f.type.startsWith('image/')) loadEditAttachment(f);
});

function loadEditAttachment(file) {
  if (!file.type.startsWith('image/')) return;
  if (file.size > MAX_IMAGE_SIZE_BYTES) { alert(T.imageTooBig); return; }
  const reader = new FileReader();
  reader.onload = evt => setupEditPreview(evt.target.result, file.type);
  reader.readAsDataURL(file);
}

function setupEditPreview(dataUrl, mimeType='image/jpeg') {
  editImageBase64 = dataUrl.split(',')[1];
  editImageMime = mimeType;
  editImagePreview.src = dataUrl;
  editDropZone.classList.add('hidden');
  editPreviewCont.classList.remove('hidden');
  // Reset result
  editResultCont.classList.add('hidden');
  editedImage.style.display = 'none';
  btnDownloadEditImg.classList.add('hidden');
  editStatus.textContent = '';
}

btnClearEditImage.addEventListener('click', () => {
  editImageBase64 = null; editImageMime = 'image/jpeg';
  editImagePreview.src = '';
  editPreviewCont.classList.add('hidden');
  editDropZone.classList.remove('hidden');
  editResultCont.classList.add('hidden');
  $('edit-result-actions').classList.add('hidden');
});

// Wyślij edytowany obraz do zakładki Analyze
$('btnEditResultToAnalyze').addEventListener('click', () => {
  if(!editedImage.src || editedImage.style.display==='none') return;
  setupImagePreview(editedImage.src, 'image/png');
  // Przełącz na zakładkę Image → sub-analyze
  document.querySelector('[data-target="view-image"]').click();
  setTimeout(() => {
    document.querySelector('[data-subtarget="sub-analyze"]').click();
  }, 50);
});

// Użyj edytowanego obrazu jako nowego wejścia do edycji
$('btnEditResultReedit').addEventListener('click', () => {
  if(!editedImage.src || editedImage.style.display==='none') return;
  const newB64 = editedImage.src.split(',')[1];
  setupEditPreview(editedImage.src, 'image/png');
  editImageBase64 = newB64;
  editImageMime = 'image/png';
  editPromptInput.value = '';
  editPromptInput.focus();
});

btnEditImage.addEventListener('click', async () => {
  const prompt = editPromptInput.value.trim();
  if (!editImageBase64) return;
  if (!prompt) { editPromptInput.focus(); return; }
  if (!apiKeys.gemini) {
    editStatus.textContent = '⚠️ Gemini API key required. Please add it in Settings.';
    editStatus.style.color = '#e57373';
    editResultCont.classList.remove('hidden');
    return;
  }

  editResultCont.classList.remove('hidden');
  editedImage.style.display = 'none';
  btnDownloadEditImg.classList.add('hidden');
  editSkeleton.classList.remove('hidden');
  editStatus.textContent = 'Editing image...';
  editStatus.style.color = '';
  btnEditImage.disabled = true;

  try {
    const b64 = await callGeminiImageEdit(apiKeys.gemini, editImageBase64, editImageMime, prompt);
    editedImage.src = `data:image/png;base64,${b64}`;
    editedImage.onload = () => {
      editSkeleton.classList.add('hidden');
      editedImage.style.display = 'block';
      $('edit-result-actions').classList.remove('hidden');
      $('btnDownloadEditImg').href = editedImage.src;
      editStatus.textContent = '✅ Done!';
      editStatus.style.color = 'var(--success)';
    };
    editedImage.onerror = () => {
      editSkeleton.classList.add('hidden');
      editStatus.textContent = '❌ Failed to load result image.';
      editStatus.style.color = '#e57373';
    };
  } catch(e) {
    editSkeleton.classList.add('hidden');
    editStatus.textContent = '❌ ' + e.message;
    editStatus.style.color = '#e57373';
  } finally {
    btnEditImage.disabled = false;
  }
});

// ── Wyślij wynik edycji do Analyze ─────────────────────────
$('btnEditResultToAnalyze').addEventListener('click', () => {
  if(!editedImage.src || editedImage.style.display==='none') return;
  // Wyciągnij base64 z data URL obrazu
  const dataUrl = editedImage.src;
  const mime = dataUrl.split(';')[0].replace('data:','') || 'image/png';
  setupImagePreview(dataUrl, mime);
  // Przełącz na zakładkę Analyze
  document.querySelectorAll('.sub-tab-btn').forEach(b=>b.classList.remove('active'));
  document.querySelectorAll('.sub-content').forEach(c=>c.classList.remove('active'));
  $('subAnalyzeBtn').classList.add('active');
  $('sub-analyze').classList.add('active');
});

// ── Wyślij wynik edycji z powrotem do Edytuj (re-edit) ─────
$('btnEditResultReedit').addEventListener('click', () => {
  if(!editedImage.src || editedImage.style.display==='none') return;
  const dataUrl = editedImage.src;
  const mime = dataUrl.split(';')[0].replace('data:','') || 'image/png';
  // Załaduj wynik edycji jako nowy obraz wejściowy
  setupEditPreview(dataUrl, mime);
  // Wyczyść pole promptu i skup na nim
  editPromptInput.value = '';
  editPromptInput.focus();
});

async function callGeminiImageEdit(key, imageB64, mime, prompt) {
  // Gemini Nano Banana image editing – docs: https://ai.google.dev/gemini-api/docs/image-generation
  // Format identyczny jak w JS SDK przykładzie z dokumentacji:
  // contents z text + inlineData, BEZ responseModalities (model sam zwraca obraz)
  const modelId = currentImageEditModelId || 'gemini-2.5-flash-image';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelId}:generateContent`;

  const body = {
    contents: [{
      parts: [
        { text: prompt },
        { inlineData: { mimeType: mime, data: imageB64 } }
      ]
    }]
  };

  const r = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
    body: JSON.stringify(body)
  });

  const j = await r.json();

  if (!r.ok) {
    throw new Error(`[${modelId}] ${j?.error?.message || 'HTTP ' + r.status}`);
  }

  const parts = j.candidates?.[0]?.content?.parts || [];

  // Szukaj obrazu – klucz to "inlineData" (camelCase) lub "inline_data" (snake_case)
  const imgPart = parts.find(p =>
    (p.inlineData?.mimeType || p.inline_data?.mime_type || '').startsWith('image/')
  );
  if (imgPart) {
    return imgPart.inlineData?.data || imgPart.inline_data?.data;
  }

  const textPart = parts.find(p => p.text);
  const reason = j.candidates?.[0]?.finishReason;

  if (reason && reason !== 'STOP') {
    throw new Error(`Blocked (${reason}). Try rephrasing the instruction.`);
  }
  if (textPart) {
    throw new Error(`Model zwrócił tekst zamiast obrazu: "${textPart.text.slice(0, 200)}"\n\nSpróbuj innego modelu edycji w Ustawieniach.`);
  }
  throw new Error(`Brak obrazu w odpowiedzi (${modelId}). Sprawdź czy model obsługuje generowanie obrazów.`);
}

function loadChatAttachment(file) {
  if(!file.type.startsWith('image/')) return;
  if(file.size>MAX_IMAGE_SIZE_BYTES){alert(T.imageTooBig);return;}
  const reader=new FileReader();
  reader.onload=evt=>{
    chatAttachBase64=evt.target.result.split(',')[1]; chatAttachMime=file.type;
    chatImgPreview.src=evt.target.result; chatImgWrap.classList.remove('hidden');
  };
  reader.readAsDataURL(file);
}
btnRemoveChatImg.addEventListener('click', clearChatAttachment);
function clearChatAttachment() {
  chatAttachBase64=null; chatAttachMime='image/jpeg';
  chatImgPreview.src=''; chatImgWrap.classList.add('hidden');
}

// ── WYŚLIJ ─────────────────────────────────────────────────
async function handleChatMessage(overrideText) {
  if(isStreaming) return;
  const text = (typeof overrideText==='string') ? overrideText : chatInput.value.trim();
  if(!text && !chatAttachBase64) return;

  const model=CHAT_MODELS.find(m=>m.id===currentChatModelId);
  if(!model){addChatMessage(T.noApiKey,'ai-msg');return;}
  const key=apiKeys[model.provider];
  if(!key){addChatMessage(T.noApiKey,'ai-msg');return;}

  const userParts=[];
  if(text) userParts.push({text});
  if(chatAttachBase64){
    if(model.provider==='openai') userParts.push({image_url:{url:`data:${chatAttachMime};base64,${chatAttachBase64}`}});
    else userParts.push({inline_data:{mime_type:chatAttachMime,data:chatAttachBase64}});
  }

  addChatMessageWithImage(text, chatAttachBase64?`data:${chatAttachMime};base64,${chatAttachBase64}`:null);
  chatInput.value=''; chatInput.style.height='auto';
  clearChatAttachment();

  chatHistory.push({role:'user',parts:userParts});
  if(chatHistory.length>20) chatHistory=chatHistory.slice(chatHistory.length-20);

  const aiMsgEl=createStreamingMessage();
  isStreaming=true; btnChatSend.disabled=true;

  try {
    let result;
    if(model.provider==='gemini')    result=await streamGemini(key,chatHistory,aiMsgEl);
    else if(model.provider==='openai')    result=await streamOpenAI(key,chatHistory,aiMsgEl);
    else if(model.provider==='anthropic') result=await streamAnthropic(key,chatHistory,aiMsgEl);

    chatHistory.push({role:'model',parts:[{text:result.text}]});
    lastAiMsgIndex=chatHistory.length-1;
    lastAiMsgEl=aiMsgEl;
    saveChatHistory();
    addCopyButton(aiMsgEl, result.text);
    addRegenerateButton(aiMsgEl);
    if(result.tokens) updateTokenCounter(result.tokens);
    if(autoRead) speakText(result.text);
  } catch(e) {
    const span=document.createElement('span');
    span.style.color='#e57373'; span.textContent=T.errorPrefix+e.message;
    aiMsgEl.innerHTML=''; aiMsgEl.appendChild(span);
    chatHistory.pop();
  } finally { isStreaming=false; btnChatSend.disabled=false; }
}

// ── EDYCJA WIADOMOŚCI ──────────────────────────────────────
let editingMsgIndex = -1;

function openEditModal(userMsgIndex, currentText) {
  editingMsgIndex = userMsgIndex;
  editMsgInput.value = currentText;
  set('editMsgTitle', T.editMessage);
  editModal.classList.remove('hidden');
  setTimeout(()=>editMsgInput.focus(),50);
}

btnEditSave.addEventListener('click', async () => {
  const newText = editMsgInput.value.trim();
  if(!newText) return;
  editModal.classList.add('hidden');

  // Obetnij historię do punktu edycji (usuń wiadomość user i wszystkie późniejsze)
  chatHistory = chatHistory.slice(0, editingMsgIndex);

  // Usuń z UI wszystkie dymki od edytowanej wiadomości wzwyż
  const allMsgs = [...chatContainer.querySelectorAll('.message')];
  // Policz ile wiadomości user jest w historii (edytowana i późniejsze)
  // Prostsze: usuń wszystkie dymki od edytowanej pozycji
  const historyUserCount = chatHistory.filter(m=>m.role==='user').length;
  let userMsgsSeen=0;
  let startRemove=false;
  allMsgs.forEach(el=>{
    if(el.classList.contains('user-msg')) userMsgsSeen++;
    if(userMsgsSeen>historyUserCount) startRemove=true;
    if(startRemove) el.remove();
  });
  // Usuń też wrap przycisków regeneruj które mogły zostać
  chatContainer.querySelectorAll('.regenerate-btn-wrap').forEach(el=>el.remove());

  lastAiMsgEl=null; lastAiMsgIndex=-1;
  await handleChatMessage(newText);
});
btnEditCancel.addEventListener('click', ()=>editModal.classList.add('hidden'));
btnCloseEdit.addEventListener('click', ()=>editModal.classList.add('hidden'));
editModal.addEventListener('click', e=>{if(e.target===editModal)editModal.classList.add('hidden');});

// ── REGENERUJ ODPOWIEDŹ ─────────────────────────────────────
function addRegenerateButton(aiMsgEl) {
  const wrap = document.createElement('div');
  wrap.className='regenerate-btn-wrap';
  const btn = document.createElement('button');
  btn.className='regenerate-btn';
  btn.innerHTML='🔄 ' + T.regenerate.replace('🔄 ','');
  btn.addEventListener('click', async () => {
    if(isStreaming) return;
    // Usuń ostatnią odpowiedź AI z historii
    if(chatHistory.length>0 && chatHistory[chatHistory.length-1].role==='model') {
      chatHistory.pop();
    }
    // Usuń dymek AI i wrap z UI
    aiMsgEl.remove(); wrap.remove();
    lastAiMsgEl=null; lastAiMsgIndex=-1;
    // Ponów request (historia ma jeszcze wiadomość user)
    const model=CHAT_MODELS.find(m=>m.id===currentChatModelId);
    const key=model?apiKeys[model.provider]:'';
    if(!key){addChatMessage(T.noApiKey,'ai-msg');return;}
    const newAiEl=createStreamingMessage();
    isStreaming=true; btnChatSend.disabled=true;
    try {
      let result;
      if(model.provider==='gemini')    result=await streamGemini(key,chatHistory,newAiEl);
      else if(model.provider==='openai')    result=await streamOpenAI(key,chatHistory,newAiEl);
      else if(model.provider==='anthropic') result=await streamAnthropic(key,chatHistory,newAiEl);
      chatHistory.push({role:'model',parts:[{text:result.text}]});
      lastAiMsgIndex=chatHistory.length-1; lastAiMsgEl=newAiEl;
      saveChatHistory();
      addCopyButton(newAiEl,result.text); addRegenerateButton(newAiEl);
      if(result.tokens) updateTokenCounter(result.tokens);
      if(autoRead) speakText(result.text);
    } catch(e) {
      const span=document.createElement('span');
      span.style.color='#e57373'; span.textContent=T.errorPrefix+e.message;
      newAiEl.innerHTML=''; newAiEl.appendChild(span);
    } finally { isStreaming=false; btnChatSend.disabled=false; }
  });
  wrap.appendChild(btn);
  chatContainer.appendChild(wrap);
}

// ── DOM helpers ─────────────────────────────────────────────
function addChatMessageWithImage(text, imgDataUrl, userHistoryIndex) {
  const d=document.createElement('div');
  d.className='message user-msg';
  d.dataset.histIdx = userHistoryIndex !== undefined ? userHistoryIndex : chatHistory.length;
  if(imgDataUrl){
    const img=document.createElement('img');
    img.src=imgDataUrl;
    img.style.cssText='max-height:80px;max-width:120px;border-radius:6px;display:block;margin-bottom:6px;';
    d.appendChild(img);
  }
  if(text){const s=document.createElement('span');s.textContent=text;d.appendChild(s);}

  // Przycisk edycji
  const actions=document.createElement('div'); actions.className='msg-actions';
  const editBtn=document.createElement('button'); editBtn.className='msg-action-btn'; editBtn.textContent='✏️';
  editBtn.title=T.editMessage;
  editBtn.addEventListener('click', ()=>{
    const idx=parseInt(d.dataset.histIdx);
    const msgText=(chatHistory[idx]?.parts||[]).filter(p=>p.text).map(p=>p.text).join('');
    openEditModal(idx, msgText);
  });
  actions.appendChild(editBtn); d.appendChild(actions);

  chatContainer.appendChild(d);
  chatContainer.scrollTop=chatContainer.scrollHeight;
  return d;
}

function addChatMessage(t,cssClass){
  const d=document.createElement('div'); d.className=`message ${cssClass}`; d.textContent=t;
  chatContainer.appendChild(d); chatContainer.scrollTop=chatContainer.scrollHeight;
}

function createStreamingMessage(){
  const d=document.createElement('div'); d.className='message ai-msg';
  const c=document.createElement('span'); c.className='cursor'; c.textContent='▋';
  d.appendChild(c); chatContainer.appendChild(d); chatContainer.scrollTop=chatContainer.scrollHeight;
  return d;
}

function copyToClipboard(text, btn) {
  const doSuccess = () => {
    if(btn){const orig=btn.textContent;btn.textContent='✅';setTimeout(()=>btn.textContent=orig,1500);}
  };
  if(navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(doSuccess).catch(() => {
      execCopy(text); doSuccess();
    });
  } else {
    execCopy(text); doSuccess();
  }
}
function execCopy(text) {
  const ta=document.createElement('textarea');
  ta.value=text; ta.style.cssText='position:fixed;top:-9999px;left:-9999px;opacity:0;';
  document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove();
}

function addCopyButton(el,text){
  const btn=document.createElement('button'); btn.className='copy-btn'; btn.textContent='📋';
  btn.addEventListener('click',()=>copyToClipboard(text, btn));
  el.appendChild(btn);
}

function updateTokenCounter(tokens){
  if(!tokens)return; totalTokens+=tokens;
  tokenCountEl.textContent=totalTokens.toLocaleString(); tokenCounter.classList.remove('hidden');
}

function updateSectionTokenCounter(section, tokens){
  if(!tokens)return;
  if(section==='text'){
    textTokenCountEl.textContent=tokens.toLocaleString();
    textTokenCounter.classList.remove('hidden');
  } else if(section==='image'){
    imageTokenCountEl.textContent=tokens.toLocaleString();
    imageTokenCounter.classList.remove('hidden');
  }
}

// ============================================================
// 7. STREAMING
// ============================================================
async function streamGemini(key,history,targetEl){
  const url=`https://generativelanguage.googleapis.com/v1beta/models/${currentChatModelId}:streamGenerateContent?alt=sse`;
  const defaultSysPr=resolvedLang()==='pl'?SYSTEM_PROMPT_PL:SYSTEM_PROMPT_EN;
  const sysPr=systemPrompts.gemini ? systemPrompts.gemini+'\n\n'+defaultSysPr : defaultSysPr;
  const r=await fetch(url,{
    method:'POST',
    headers:{'Content-Type':'application/json','x-goog-api-key':key},
    body:JSON.stringify({system_instruction:{parts:[{text:sysPr}]},contents:[...history]})
  });
  if(!r.ok){const e=await r.json().catch(()=>({}));throw new Error(e?.error?.message||'HTTP '+r.status);}
  return readSSEStream(r,targetEl,parsed=>{
    const token=parsed.candidates?.[0]?.content?.parts?.[0]?.text||'';
    const tokens=parsed.usageMetadata?.totalTokenCount||0;
    return {token,tokens};
  });
}

async function streamOpenAI(key,history,targetEl){
  const defaultSysPr=resolvedLang()==='pl'?SYSTEM_PROMPT_PL:SYSTEM_PROMPT_EN;
  const sysPr=systemPrompts.openai ? systemPrompts.openai+'\n\n'+defaultSysPr : defaultSysPr;
  const messages=[
    {role:'system',content:sysPr},
    ...history.map(msg=>{
      const role=msg.role==='model'?'assistant':'user';
      if(msg.parts.length===1&&msg.parts[0].text) return {role,content:msg.parts[0].text};
      const content=msg.parts.map(p=>{
        if(p.text) return {type:'text',text:p.text};
        if(p.image_url) return {type:'image_url',image_url:p.image_url};
        if(p.inline_data) return {type:'image_url',image_url:{url:`data:${p.inline_data.mime_type};base64,${p.inline_data.data}`}};
        return null;
      }).filter(Boolean);
      return {role,content};
    })
  ];
  const r=await fetch('https://api.openai.com/v1/chat/completions',{
    method:'POST',
    headers:{'Content-Type':'application/json','Authorization':`Bearer ${key}`},
    body:JSON.stringify({model:currentChatModelId,messages,stream:true})
  });
  if(!r.ok){const e=await r.json().catch(()=>({}));throw new Error(e?.error?.message||'HTTP '+r.status);}
  return readSSEStream(r,targetEl,parsed=>{
    const token=parsed.choices?.[0]?.delta?.content||'';
    const tokens=parsed.usage?.total_tokens||0;
    return {token,tokens};
  });
}

async function streamAnthropic(key,history,targetEl){
  const messages=history.map(msg=>{
    const role=msg.role==='model'?'assistant':'user';
    if(msg.parts.length===1&&msg.parts[0].text) return {role,content:msg.parts[0].text};
    const content=msg.parts.map(p=>{
      if(p.text) return {type:'text',text:p.text};
      if(p.inline_data) return {type:'image',source:{type:'base64',media_type:p.inline_data.mime_type,data:p.inline_data.data}};
      return null;
    }).filter(Boolean);
    return {role,content};
  });
  const defaultSysPr=resolvedLang()==='pl'?SYSTEM_PROMPT_PL:SYSTEM_PROMPT_EN;
  const sysPr=systemPrompts.anthropic ? systemPrompts.anthropic+'\n\n'+defaultSysPr : defaultSysPr;
  const r=await fetch('https://api.anthropic.com/v1/messages',{
    method:'POST',
    headers:{'Content-Type':'application/json','x-api-key':key,'anthropic-version':'2023-06-01','anthropic-dangerous-direct-browser-access':'true'},
    body:JSON.stringify({model:currentChatModelId,max_tokens:4096,system:sysPr,messages,stream:true})
  });
  if(!r.ok){const e=await r.json().catch(()=>({}));throw new Error(e?.error?.message||'HTTP '+r.status);}
  return readSSEStream(r,targetEl,parsed=>{
    let token='';
    if(parsed.type==='content_block_delta'&&parsed.delta?.type==='text_delta') token=parsed.delta.text||'';
    const tokens=parsed.usage?.output_tokens||0;
    return {token,tokens};
  });
}

async function readSSEStream(response,targetEl,parser){
  const reader=response.body.getReader(); const decoder=new TextDecoder();
  let fullText=''; let lastTokens=0; let rafPending=false; let cursorEl=targetEl.querySelector('.cursor');

  function scheduleRender(){
    if(rafPending)return; rafPending=true;
    requestAnimationFrame(()=>{
      targetEl.replaceChildren(renderMarkdown(fullText));
      const c=document.createElement('span'); c.className='cursor'; c.textContent='▋';
      targetEl.appendChild(c); cursorEl=c;
      chatContainer.scrollTop=99999; rafPending=false;
    });
  }

  while(true){
    const{done,value}=await reader.read(); if(done)break;
    const chunk=decoder.decode(value,{stream:true});
    for(const line of chunk.split('\n')){
      if(!line.startsWith('data: '))continue;
      const jsonStr=line.slice(6).trim();
      if(!jsonStr||jsonStr==='[DONE]')continue;
      try{
        const parsed=JSON.parse(jsonStr);
        const{token,tokens}=parser(parsed);
        if(token){fullText+=token;scheduleRender();}
        if(tokens)lastTokens=tokens;
      }catch{/* ignoruj */}
    }
  }
  if(cursorEl){cursorEl.className='cursor-fadeout';await new Promise(res=>setTimeout(res,420));}
  targetEl.replaceChildren(renderMarkdown(fullText));
  highlightAll(targetEl);
  if(!fullText)throw new Error(T.noResponse);
  return{text:fullText,tokens:lastTokens};
}

// ── MARKDOWN ────────────────────────────────────────────────
function renderMarkdown(text){
  const CB='\x00CB\x00'; const IC='\x00IC\x00';
  const codeBlocks=[]; const inlineCodes=[];
  text=text.replace(/```(\w*)\n?([\s\S]*?)```/g,(_,lang,code)=>{
    codeBlocks.push({lang:lang||'',code}); return CB+(codeBlocks.length-1)+'\x00';
  });
  text=text.replace(/`([^`\n]+)`/g,(_,code)=>{
    inlineCodes.push(code); return IC+(inlineCodes.length-1)+'\x00';
  });
  const fragment=document.createDocumentFragment();
  const lines=text.split('\n'); let ulBuf=[]; let olBuf=[];
  const CB_RE=new RegExp(CB.replace(/\x00/g,'\\x00')+'(\\d+)\\x00');
  function flushLists(){
    if(ulBuf.length){const ul=document.createElement('ul');ulBuf.forEach(item=>{const li=document.createElement('li');appendInline(li,item,inlineCodes);ul.appendChild(li);});fragment.appendChild(ul);ulBuf=[];}
    if(olBuf.length){const ol=document.createElement('ol');olBuf.forEach(item=>{const li=document.createElement('li');appendInline(li,item,inlineCodes);ol.appendChild(li);});fragment.appendChild(ol);olBuf=[];}
  }
  lines.forEach(line=>{
    const hm=line.match(/^(#{1,3}) (.+)$/);
    const ulm=line.match(/^[-*•] (.+)$/);
    const olm=line.match(/^\d+\. (.+)$/);
    const cbm=line.match(CB_RE);
    if(hm){flushLists();const el=document.createElement('h'+hm[1].length);appendInline(el,hm[2],inlineCodes);fragment.appendChild(el);return;}
    if(ulm){olBuf.length&&flushLists();ulBuf.push(ulm[1]);return;}
    if(olm){ulBuf.length&&flushLists();olBuf.push(olm[1]);return;}
    if(cbm){
      flushLists();
      const idx=parseInt(cbm[1]);
      const lang=codeBlocks[idx].lang;
      const codeText=codeBlocks[idx].code;

      // Spróbuj wyciągnąć nazwę pliku z komentarza (np. // index.js, <!-- index.html -->, # script.py)
      let filename=inferFilename(codeText, lang);

      const wrapper=document.createElement('div'); wrapper.className='code-block-wrapper';

      // Nagłówek bloku kodu
      const header=document.createElement('div'); header.className='code-block-header';
      const langBadge=document.createElement('span'); langBadge.className='code-lang-badge';
      langBadge.textContent=lang||'code';
      header.appendChild(langBadge);

      // Pole z nazwą pliku
      const filenameInput=document.createElement('input');
      filenameInput.type='text'; filenameInput.className='code-filename-input';
      filenameInput.value=filename; filenameInput.title='Edit filename';
      header.appendChild(filenameInput);

      // Przyciski
      const actions=document.createElement('div'); actions.className='code-block-actions';

      const pre=document.createElement('pre'); const codeEl=document.createElement('code');
      if(lang)codeEl.className=`language-${lang}`;
      codeEl.textContent=codeText;
      pre.dataset.rawCode=codeText;  // przechowuj oryginalny tekst nawet po highlight
      pre.appendChild(codeEl);

      const cpBtn=document.createElement('button'); cpBtn.className='code-action-btn'; cpBtn.title='Copy'; cpBtn.textContent='📋';
      cpBtn.addEventListener('click', e => {
        e.stopPropagation();
        const raw=pre.dataset.rawCode||codeText;
        copyToClipboard(raw, cpBtn);
      });

      const dlBtn=document.createElement('button'); dlBtn.className='code-action-btn'; dlBtn.title='Download'; dlBtn.textContent='⬇️';
      dlBtn.addEventListener('click', e => {
        e.stopPropagation();
        const fname=filenameInput.value.trim()||filename;
        const raw=pre.dataset.rawCode||codeText;
        const blob=new Blob([raw],{type:'text/plain'});
        const url=URL.createObjectURL(blob);
        const a=document.createElement('a'); a.href=url; a.download=fname; a.click();
        URL.revokeObjectURL(url);
      });

      actions.appendChild(cpBtn); actions.appendChild(dlBtn);
      header.appendChild(actions);

      wrapper.appendChild(header); wrapper.appendChild(pre);
      fragment.appendChild(wrapper); return;
    }
    flushLists();
    if(line.trim()===''){fragment.appendChild(document.createElement('br'));return;}
    const p=document.createElement('p'); appendInlineFull(p,line,inlineCodes); fragment.appendChild(p);
  });
  flushLists();
  return fragment;
}

function inferFilename(code, lang) {
  // Szukaj komentarza z nazwą pliku w pierwszych 3 liniach
  const firstLines=code.split('\n').slice(0,3).join('\n');
  // HTML: <!-- filename.html -->
  let m=firstLines.match(/<!--\s*([\w.\-]+\.\w+)\s*-->/);
  if(m) return m[1];
  // JS/TS/CSS: // filename.js lub /* filename.js */
  m=firstLines.match(/\/\/\s*([\w.\-]+\.\w+)/);
  if(m) return m[1];
  m=firstLines.match(/\/\*\s*([\w.\-]+\.\w+)\s*\*\//);
  if(m) return m[1];
  // Python/Shell: # filename.py
  m=firstLines.match(/#\s*([\w.\-]+\.\w+)/);
  if(m) return m[1];
  // Domyślna nazwa na podstawie języka
  const extMap={html:'index.html',css:'style.css',javascript:'script.js',js:'script.js',
    typescript:'script.ts',ts:'script.ts',python:'script.py',py:'script.py',
    java:'Main.java',php:'index.php',sql:'query.sql',bash:'script.sh',sh:'script.sh',
    json:'data.json',xml:'data.xml',yaml:'config.yaml',yml:'config.yml',
    markdown:'readme.md',md:'readme.md',rust:'main.rs',go:'main.go',
    cpp:'main.cpp',c:'main.c',cs:'Program.cs',swift:'main.swift',kotlin:'Main.kt'};
  return extMap[lang]||extMap[lang?.toLowerCase()]||'code.txt';
}

function appendInlineFull(parent,text,inlineCodes){
  const URL_RE=/https?:\/\/[^\s<>"')\]]+/g;
  let last=0, m;
  while((m=URL_RE.exec(text))!==null){
    if(m.index>last) appendInline(parent,text.slice(last,m.index),inlineCodes);
    const a=document.createElement('a');
    a.href=m[0]; a.textContent=m[0]; a.target='_blank'; a.rel='noopener noreferrer';
    a.style.color='var(--accent)';
    parent.appendChild(a);
    last=m.index+m[0].length;
  }
  if(last<text.length) appendInline(parent,text.slice(last),inlineCodes);
}

function appendInline(parent,text,inlineCodes){
  const IC_ESC='\x00IC\x00';
  const pattern=new RegExp(`(\\*\\*([^*]+)\\*\\*)|(\\*([^*]+)\\*)|(${IC_ESC.replace(/\x00/g,'\\x00')}(\\d+)\\x00)`,'g');
  let last=0,m;
  while((m=pattern.exec(text))!==null){
    if(m.index>last)parent.appendChild(document.createTextNode(text.slice(last,m.index)));
    if(m[1]){const el=document.createElement('strong');el.textContent=m[2];parent.appendChild(el);}
    else if(m[3]){const el=document.createElement('em');el.textContent=m[4];parent.appendChild(el);}
    else if(m[5]){const el=document.createElement('code');el.textContent=inlineCodes[parseInt(m[6])];parent.appendChild(el);}
    last=m.index+m[0].length;
  }
  if(last<text.length)parent.appendChild(document.createTextNode(text.slice(last)));
}

function highlightAll(el){
  el.querySelectorAll('pre code').forEach(block=>{
    const lang=(block.className.match(/language-(\w+)/)||[])[1]||'';
    if(!lang)return;
    // Zapisz surowy tekst przed zamianą na HTML ze spanami
    const raw=block.textContent;
    const pre=block.parentElement;
    if(pre && pre.tagName==='PRE') pre.dataset.rawCode=raw;
    block.innerHTML=SH.highlight(raw,lang);
  });
}

// ── Historia chatu ─────────────────────────────────────────
async function saveChatHistory(){
  try{
    const toSave=chatHistory.map(msg=>({role:msg.role,parts:msg.parts.filter(p=>p.text)})).filter(m=>m.parts.length);
    await chrome.storage.local.set({chatHistory:toSave});
  }catch{/*pełne*/}
}

async function loadChatHistory(){
  try{
    const data=await chrome.storage.local.get('chatHistory');
    if(!data.chatHistory?.length)return;
    chatHistory=data.chatHistory;
    chatContainer.innerHTML='';
    let userIdx=0;
    chatHistory.forEach((msg,i)=>{
      if(msg.role==='user'){
        const txt=msg.parts.map(p=>p.text||'').join('');
        addChatMessageWithImage(txt,null,i);
        userIdx++;
      }else{
        const d=document.createElement('div'); d.className='message ai-msg';
        const txt=msg.parts.map(p=>p.text||'').join('');
        d.replaceChildren(renderMarkdown(txt)); highlightAll(d);
        addCopyButton(d,txt);
        chatContainer.appendChild(d);
        lastAiMsgEl=d; lastAiMsgIndex=i;
        addRegenerateButton(d);
      }
    });
    chatContainer.scrollTop=chatContainer.scrollHeight;
  }catch{/*ignoruj*/}
}

// ============================================================
// 8. TEKST
// ============================================================
document.querySelectorAll('.tool-btn[data-cmd]').forEach(btn=>btn.addEventListener('click',()=>runTextTool(btn.dataset.cmd)));
btnCopyText.addEventListener('click',()=>copyToClipboard(textOutput.innerText, btnCopyText));
btnReadText.addEventListener('click',()=>speakText(textOutput.innerText));

async function runTextTool(cmd){
  const tab=await getActiveTab(); if(!tab)return(textOutput.innerText=T.noTabAvailable);
  try{
    const res=await chrome.scripting.executeScript({target:{tabId:tab.id},function:()=>window.getSelection().toString()});
    const sel=res?.[0]?.result;
    if(cmd==='read'){
      if(!sel)return(textOutput.innerText=T.noTextSelected);
      textOutput.innerText=T.reading; speakText(sel);
      textActions.classList.remove('hidden'); return;
    }
    if(!sel)return(textOutput.innerText=T.noTextSelected);
    const model=CHAT_MODELS.find(m=>m.id===currentChatModelId);
    if(!model||!apiKeys[model.provider])return(textOutput.innerText=T.noApiKey);
    textOutput.innerText=T.processing; textActions.classList.add('hidden');
    const prompts={
      explain:T.promptExplain+`"${sel}"`, summarize:T.promptSummarize+`"${sel}"`,
      translate:T.promptTranslate+`"${sel}"`, rewrite:T.promptRewrite+`"${sel}"`,
    };
    const result=await callTextAPI(prompts[cmd]);
    textOutput.innerText=result.text; textActions.classList.remove('hidden');
    updateSectionTokenCounter('text', result.tokens);
    if(autoRead)speakText(result.text);
  }catch(e){textOutput.innerText=T.errorPrefix+e.message;textActions.classList.add('hidden');}
}

async function callTextAPI(prompt){
  const model=CHAT_MODELS.find(m=>m.id===currentChatModelId);
  if(!model)throw new Error('No model selected');
  const key=apiKeys[model.provider]; if(!key)throw new Error('No API key');
  if(model.provider==='gemini')    return callGeminiText(key,prompt);
  if(model.provider==='openai')    return callOpenAIText(key,prompt);
  if(model.provider==='anthropic') return callAnthropicText(key,prompt);
}

// ============================================================
// 9. OBRAZ
// ============================================================
btnSelectArea.addEventListener('click',async()=>{
  imageOutput.innerText=T.sendSignal;
  const tab=await getActiveTab(); if(!tab)return(imageOutput.innerText=T.tabError);
  chrome.tabs.sendMessage(tab.id,{action:'start_area_selection'},resp=>{
    if(chrome.runtime.lastError)imageOutput.innerText=T.refreshPage;
    else if(resp?.status==='started')imageOutput.innerText=T.areaReady;
  });
});

async function processCrop(area){
  imageOutput.innerText=T.cropProcessing;
  const[tab]=await chrome.tabs.query({active:true,lastFocusedWindow:true});
  if(!tab)return(imageOutput.innerText=T.tabNotFound);
  chrome.tabs.captureVisibleTab(tab.windowId,{format:'png'},dataUrl=>{
    if(chrome.runtime.lastError)return(imageOutput.innerText=T.cropError+chrome.runtime.lastError.message);
    cropImage(dataUrl,area);
  });
}

function cropImage(srcUrl,area){
  const canvas=document.createElement('canvas');const ctx=canvas.getContext('2d');const img=new Image();
  img.onload=()=>{
    const r=area.devicePixelRatio||1;
    canvas.width=area.width*r;canvas.height=area.height*r;
    ctx.drawImage(img,area.x*r,area.y*r,area.width*r,area.height*r,0,0,area.width*r,area.height*r);
    setupImagePreview(canvas.toDataURL('image/jpeg'),'image/jpeg');
    imageOutput.innerText=T.cropReady;
  };
  img.src=srcUrl;
}

async function cacheImageInSession(dataUrl,mimeType){
  try{await chrome.storage.session.set({cachedImage:{dataUrl,mimeType}});}catch{/*full*/}
}

dropZone.addEventListener('dragover',e=>{e.preventDefault();dropZone.classList.add('drag-over');});
dropZone.addEventListener('dragleave',()=>dropZone.classList.remove('drag-over'));
dropZone.addEventListener('drop',async e=>{
  e.preventDefault();dropZone.classList.remove('drag-over');
  if(e.dataTransfer.files.length){
    const f=e.dataTransfer.files[0];
    if(!f.type.startsWith('image/')){imageOutput.innerText=T.imageTypeError;return;}
    if(f.size>MAX_IMAGE_SIZE_BYTES){imageOutput.innerText=T.imageTooBig;return;}
    const reader=new FileReader();reader.onload=evt=>setupImagePreview(evt.target.result,f.type);reader.readAsDataURL(f);return;
  }
  const url=e.dataTransfer.getData('text/uri-list');
  if(url){handleSelectedImage(url);return;}
  const html=e.dataTransfer.getData('text/html');
  const div=document.createElement('div');div.innerHTML=html;
  const imgEl=div.querySelector('img');if(imgEl)handleSelectedImage(imgEl.src);
});

async function handleSelectedImage(url){
  try{
    imageOutput.innerText=T.fetchingImage;
    const{base64,mimeType}=await urlToBase64WithMime(url);
    setupImagePreview(`data:${mimeType};base64,${base64}`,mimeType);
    imageOutput.innerText=T.imageReady;
  }catch(e){imageOutput.innerText=T.errorPrefix+e.message;}
}

function setupImagePreview(dataUrl,mimeType='image/jpeg'){
  imagePreview.src=dataUrl; selectedImageBase64=dataUrl.split(',')[1]; selectedImageMime=mimeType;
  dropZone.classList.add('hidden'); imagePreviewCont.classList.remove('hidden');
  imageActions.classList.remove('hidden'); cacheImageInSession(dataUrl,mimeType);
}

btnClearImage.addEventListener('click',()=>{
  selectedImageBase64=null;selectedImageMime='image/jpeg';imagePreview.src='';
  imagePreviewCont.classList.add('hidden');imageActions.classList.add('hidden');
  imageResultActions.classList.add('hidden');dropZone.classList.remove('hidden');
  imageOutput.innerText='...'; chrome.storage.session.remove('cachedImage');
});

btnAnalyzeImg.addEventListener('click',()=>processImage('analyze'));
btnSDPrompt.addEventListener('click',()=>processImage('sd_prompt'));

btnSendImgToChat.addEventListener('click',()=>{
  if(!selectedImageBase64)return;
  chatAttachBase64=selectedImageBase64;chatAttachMime=selectedImageMime;
  chatImgPreview.src=`data:${selectedImageMime};base64,${selectedImageBase64}`;
  chatImgWrap.classList.remove('hidden');
  document.querySelector('[data-target="view-chat"]').click();
  chatInput.focus();
});

async function processImage(mode){
  if(!selectedImageBase64)return;
  const geminiKey=apiKeys.gemini; if(!geminiKey)return(imageOutput.innerText=T.noApiKey);
  imageOutput.innerText=T.analyzingImage;imageResultActions.classList.add('hidden');
  const prompt=mode==='analyze'?T.promptAnalyzeImage:T.promptSDPrompt;
  try{
    const result=await callGeminiVision(geminiKey,selectedImageBase64,selectedImageMime,prompt);
    imageOutput.innerText=result.text;imageResultActions.classList.remove('hidden');
    updateSectionTokenCounter('image', result.tokens);
    if(autoRead&&mode==='analyze')speakText(result.text);
  }catch(e){imageOutput.innerText=T.apiError+e.message;}
}

btnCopyImage.addEventListener('click',()=>copyToClipboard(imageOutput.innerText, btnCopyImage));
btnReadImage.addEventListener('click',()=>speakText(imageOutput.innerText));

// ============================================================
// 10. GENEROWANIE OBRAZÓW
// ============================================================
enhanceCheck.addEventListener('change',()=>{enhancePrompt=enhanceCheck.checked;});

btnGenerateImage.addEventListener('click',async()=>{
  const userPrompt=genPromptInput.value.trim(); if(!userPrompt)return;
  const isOpenAI=currentImageModelId.startsWith('dall-e');
  const provider=isOpenAI?'openai':'gemini';
  const key=apiKeys[provider];
  if(!key){genStatus.textContent=T.noApiKeyGen;genStatus.style.color='#e57373';return;}
  genResultCont.classList.remove('hidden');generatedImage.style.display='none';
  btnDownloadImg.classList.add('hidden');genSkeleton.classList.remove('hidden');
  genStatus.textContent='';genStatus.style.color='';btnGenerateImage.disabled=true;
  try{
    let finalPrompt=userPrompt;
    if(enhancePrompt&&apiKeys.gemini){
      genStatus.textContent=T.enhancingPrompt;
      finalPrompt=(await callGeminiText(apiKeys.gemini,T.promptEnhance+userPrompt+T.promptEnhanceSuffix)).text;
    }
    genStatus.textContent=T.generatingImage;
    const b64=isOpenAI?await callDallE(key,finalPrompt,currentImageModelId):await callGoogleImagen(key,finalPrompt,currentImageModelId);
    generatedImage.src=`data:image/png;base64,${b64}`;
    generatedImage.onload=()=>{
      genSkeleton.classList.add('hidden');generatedImage.style.display='block';
      btnDownloadImg.href=generatedImage.src;btnDownloadImg.classList.remove('hidden');
      genStatus.textContent=T.generatedOk;
    };
    generatedImage.onerror=()=>{genSkeleton.classList.add('hidden');genStatus.textContent=T.imageLoadError;genStatus.style.color='#e57373';};
  }catch(e){genSkeleton.classList.add('hidden');genStatus.textContent='❌ '+e.message;genStatus.style.color='#e57373';}
  finally{btnGenerateImage.disabled=false;}
});

function updateGenerateModelWarning(){
  if(!T)return;
  const isOpenAI=currentImageModelId.startsWith('dall-e');
  const hasKey=!!(isOpenAI?apiKeys.openai:apiKeys.gemini);
  genNoGemini.textContent=hasKey?'':T.imageModelNote;
  genNoGemini.classList.toggle('hidden',hasKey);
}

// ============================================================
// 11. USTAWIENIA
// ============================================================
btnStopTTS.addEventListener('click',()=>window.speechSynthesis.cancel());

// ── MODEL QUICKSWITCH ─────────────────────────────────────────
function updateModelSwitchLabel(){
  const model = CHAT_MODELS.find(m=>m.id===currentChatModelId);
  if(!model){ modelSwitchLabel.textContent='Model'; return; }
  // Skróć label jeśli za długi
  const short = model.label.replace(/\s*\(.*?\)/g,'').trim();
  modelSwitchLabel.textContent = short.length>22 ? short.slice(0,21)+'…' : short;
  // Kolor providera
  const colors = { gemini:'#4285f4', openai:'#34a853', anthropic:'#e8762b' };
  btnModelSwitch.style.borderColor = colors[model.provider]||'var(--border)';
  btnModelSwitch.style.color = colors[model.provider]||'var(--text-main)';
}

function buildModelSwitchDropdown(){
  modelSwitchDropdown.innerHTML='';
  const groups={};
  CHAT_MODELS.forEach(m=>{if(!groups[m.provider])groups[m.provider]=[];groups[m.provider].push(m);});
  const providerLabels={ gemini:'Google Gemini', openai:'OpenAI', anthropic:'Anthropic' };
  const providerColors={ gemini:'#4285f4', openai:'#34a853', anthropic:'#e8762b' };
  Object.entries(groups).forEach(([prov,models])=>{
    const grpLabel=document.createElement('div');
    grpLabel.className='qs-group-label';
    grpLabel.textContent=providerLabels[prov]||prov;
    grpLabel.style.color=providerColors[prov]||'var(--text-secondary)';
    modelSwitchDropdown.appendChild(grpLabel);
    models.forEach(m=>{
      const item=document.createElement('button');
      item.className='qs-item'+(m.id===currentChatModelId?' qs-item-active':'');
      item.textContent=m.label.replace(/\s*\(.*?\)/g,'').trim();
      item.title=m.label;
      item.addEventListener('click',()=>{
        currentChatModelId=m.id;
        modelSelect.value=m.id;
        updateModelSwitchLabel();
        buildModelSwitchDropdown();
        modelSwitchDropdown.classList.add('hidden');
        // Zapisz wybór
        chrome.storage.local.set({chatModel:currentChatModelId});
      });
      modelSwitchDropdown.appendChild(item);
    });
  });
}

btnModelSwitch.addEventListener('click', e=>{
  e.stopPropagation();
  buildModelSwitchDropdown();
  modelSwitchDropdown.classList.toggle('hidden');
});
document.addEventListener('click', ()=>modelSwitchDropdown.classList.add('hidden'));

btnSettings.addEventListener('click',()=>{
  apiKeyInput.value=apiKeys.gemini;
  openaiKeyInput.value=apiKeys.openai;
  anthropicKeyInput.value=apiKeys.anthropic;
  autoReadCheck.checked=autoRead;
  themeSelect.value=currentTheme;
  langSelect.value=currentLang;
  modelSelect.value=currentChatModelId;
  imageModelSelect.value=currentImageModelId;
  if([...imageEditModelSelect.options].some(o=>o.value===currentImageEditModelId))
    imageEditModelSelect.value=currentImageEditModelId;
  systemPromptGemini.value=systemPrompts.gemini||'';
  systemPromptOpenAI.value=systemPrompts.openai||'';
  systemPromptAnthropic.value=systemPrompts.anthropic||'';
  ['statusGemini','statusOpenAI','statusAnthropic'].forEach(id=>{
    const el=$(id); if(el){el.textContent='';el.className='key-status';}
  });
  settingsModal.classList.remove('hidden');
});

btnSaveSettings.addEventListener('click',async()=>{
  apiKeys.gemini=apiKeyInput.value.trim();
  apiKeys.openai=openaiKeyInput.value.trim();
  apiKeys.anthropic=anthropicKeyInput.value.trim();
  const voice=voiceSelect.value; autoRead=autoReadCheck.checked;
  currentTheme=themeSelect.value; currentLang=langSelect.value;
  currentChatModelId=modelSelect.value; currentImageModelId=imageModelSelect.value;
  currentImageEditModelId=imageEditModelSelect.value;
  systemPrompts.gemini=systemPromptGemini.value.trim();
  systemPrompts.openai=systemPromptOpenAI.value.trim();
  systemPrompts.anthropic=systemPromptAnthropic.value.trim();
  await chrome.storage.local.set({apiKeys,preferredVoice:voice,autoRead,theme:currentTheme,lang:currentLang,chatModel:currentChatModelId,imageModel:currentImageModelId,imageEditModel:currentImageEditModelId,fontSize:currentFontSize,systemPrompts});
  applyTheme(currentTheme); applyLang();
  currentVoice=window.speechSynthesis.getVoices().find(v=>v.name===voice)||null;
  updateGenerateModelWarning(); updateEditBanner(); updateModelSwitchLabel();
  settingsModal.classList.add('hidden');
});

settingsModal.addEventListener('click',e=>{if(e.target===settingsModal)settingsModal.classList.add('hidden');});

// Pokaż/ukryj klucz
document.querySelectorAll('.key-toggle').forEach(btn=>{
  btn.addEventListener('click',()=>{
    const input=$(btn.dataset.target);
    input.type=input.type==='password'?'text':'password';
    btn.textContent=input.type==='password'?'👁':'🙈';
  });
});

// ── WALIDACJA KLUCZY ─────────────────────────────────────────
document.querySelectorAll('.key-validate-btn').forEach(btn=>{
  btn.addEventListener('click',()=>validateApiKey(btn.dataset.provider));
});

async function validateApiKey(provider){
  const inputMap={gemini:'apiKeyInput',openai:'openaiKeyInput',anthropic:'anthropicKeyInput'};
  const statusMap={gemini:'statusGemini',openai:'statusOpenAI',anthropic:'statusAnthropic'};
  const key=$(inputMap[provider]).value.trim();
  const statusEl=$(statusMap[provider]);
  const validateBtn=document.querySelector(`.key-validate-btn[data-provider="${provider}"]`);
  if(!key){statusEl.textContent=T.scanNoKey;statusEl.className='key-status invalid';return;}
  statusEl.textContent=T.keyValidating;statusEl.className='key-status checking';
  validateBtn.disabled=true;
  try{
    if(provider==='gemini'){
      const r=await fetch(`https://generativelanguage.googleapis.com/v1beta/models?pageSize=1`,{headers:{'x-goog-api-key':key}});
      if(r.ok){statusEl.textContent=T.keyValid;statusEl.className='key-status valid';}
      else{const e=await r.json().catch(()=>({}));throw new Error(e?.error?.message||'HTTP '+r.status);}
    }else if(provider==='openai'){
      const r=await fetch('https://api.openai.com/v1/models?limit=1',{headers:{'Authorization':`Bearer ${key}`}});
      if(r.ok){statusEl.textContent=T.keyValid;statusEl.className='key-status valid';}
      else{const e=await r.json().catch(()=>({}));throw new Error(e?.error?.message||'HTTP '+r.status);}
    }else if(provider==='anthropic'){
      // Anthropic nie ma endpoint do listowania — robimy minimalny request
      const r=await fetch('https://api.anthropic.com/v1/messages',{
        method:'POST',
        headers:{'Content-Type':'application/json','x-api-key':key,'anthropic-version':'2023-06-01','anthropic-dangerous-direct-browser-access':'true'},
        body:JSON.stringify({model:'claude-haiku-4-5',max_tokens:1,messages:[{role:'user',content:'hi'}]})
      });
      // 200 lub 529 (overloaded) = klucz OK; 401 = zły klucz
      if(r.status===401){const e=await r.json().catch(()=>({}));throw new Error(e?.error?.message||'Unauthorized');}
      statusEl.textContent=T.keyValid;statusEl.className='key-status valid';
    }
  }catch(e){
    statusEl.textContent=T.keyInvalid+' — '+e.message.slice(0,60);
    statusEl.className='key-status invalid';
  }finally{validateBtn.disabled=false;}
}

// ── MODAL POTWIERDZENIA ─────────────────────────────────────
let confirmCallback=null;
function showConfirm(title,msg,okLabel,cancelLabel,onOk){
  confirmTitle.textContent=title; confirmMsg.textContent=msg;
  btnConfirmOk.textContent=okLabel; btnConfirmCancel.textContent=cancelLabel;
  confirmCallback=onOk; confirmModal.classList.remove('hidden');
}
btnConfirmOk.addEventListener('click',()=>{confirmModal.classList.add('hidden');if(confirmCallback)confirmCallback();confirmCallback=null;});
btnConfirmCancel.addEventListener('click',()=>{confirmModal.classList.add('hidden');confirmCallback=null;});
confirmModal.addEventListener('click',e=>{if(e.target===confirmModal){confirmModal.classList.add('hidden');confirmCallback=null;}});

// ── WCZYTYWANIE USTAWIEŃ ────────────────────────────────────
async function loadSettings(){
  const data=await chrome.storage.local.get(['apiKeys','preferredVoice','autoRead','theme','lang','chatModel','imageModel','imageEditModel','fontSize','scannedGeminiImageModels','scannedGeminiEditModels','customSnippets','systemPrompts']);
  if(data.apiKeys)apiKeys={...apiKeys,...data.apiKeys};
  else{const old=await chrome.storage.local.get('geminiApiKey');if(old.geminiApiKey)apiKeys.gemini=old.geminiApiKey;}
  if(data.autoRead)   autoRead=data.autoRead;
  if(data.chatModel)  currentChatModelId=data.chatModel;
  if(data.theme)    {currentTheme=data.theme;applyTheme(data.theme);}
  if(data.lang)       currentLang=data.lang;
  if(data.fontSize) {currentFontSize=data.fontSize;applyFontSize(data.fontSize);}
  if(data.customSnippets)customSnippets=data.customSnippets;
  if(data.systemPrompts)systemPrompts={...systemPrompts,...data.systemPrompts};
  if(data.preferredVoice){
    const try_=()=>{const v=window.speechSynthesis.getVoices().find(v=>v.name===data.preferredVoice);if(v)currentVoice=v;};
    try_(); window.speechSynthesis.onvoiceschanged=()=>{try_();populateVoices();};
  }
  populateModelSelects();
  if(data.scannedGeminiImageModels?.length)rebuildImageModelSelect(data.scannedGeminiImageModels);
  if(data.imageModel){
    currentImageModelId=data.imageModel;
    if([...imageModelSelect.options].some(o=>o.value===data.imageModel))imageModelSelect.value=data.imageModel;
  }
  if(data.scannedGeminiEditModels?.length)rebuildImageEditModelSelect(data.scannedGeminiEditModels);
  if(data.imageEditModel){
    currentImageEditModelId=data.imageEditModel;
    if([...imageEditModelSelect.options].some(o=>o.value===data.imageEditModel))imageEditModelSelect.value=data.imageEditModel;
  }
  updateModelSwitchLabel();
  await loadChatHistory();
  const session=await chrome.storage.session.get('cachedImage');
  if(session.cachedImage){setupImagePreview(session.cachedImage.dataUrl,session.cachedImage.mimeType);imageOutput.innerText=T?T.imageRestored:'Image restored.';}
}

// ============================================================
// 12. MODELE
// ============================================================
function populateModelSelects(){
  modelSelect.innerHTML='';
  const groups={};
  CHAT_MODELS.forEach(m=>{if(!groups[m.provider])groups[m.provider]=[];groups[m.provider].push(m);});
  Object.entries(groups).forEach(([prov,models])=>{
    const og=document.createElement('optgroup');og.label=PROVIDER_LABELS[prov]||prov;
    models.forEach(m=>{const o=document.createElement('option');o.value=m.id;o.textContent=m.label;og.appendChild(o);});
    modelSelect.appendChild(og);
  });
  modelSelect.value=currentChatModelId;
  rebuildImageModelSelect();
  rebuildImageEditModelSelect();
}

function rebuildImageModelSelect(scannedGeminiModels){
  const prev=imageModelSelect.value||currentImageModelId;
  imageModelSelect.innerHTML='';
  const ogOAI=document.createElement('optgroup');ogOAI.label='OpenAI';
  [{id:'dall-e-3',label:'DALL-E 3'},{id:'dall-e-2',label:'DALL-E 2'}].forEach(m=>{
    const o=document.createElement('option');o.value=m.id;o.textContent=m.label;ogOAI.appendChild(o);
  });
  imageModelSelect.appendChild(ogOAI);
  const geminiModels=scannedGeminiModels||IMAGE_GEN_MODELS.filter(m=>m.provider==='gemini');
  if(geminiModels.length){
    const ogGem=document.createElement('optgroup');ogGem.label='Google Gemini';
    geminiModels.forEach(m=>{const o=document.createElement('option');o.value=m.id;o.textContent=m.label||m.id;ogGem.appendChild(o);});
    imageModelSelect.appendChild(ogGem);
  }
  if(prev&&[...imageModelSelect.options].some(o=>o.value===prev))imageModelSelect.value=prev;
  else imageModelSelect.selectedIndex=0;
  currentImageModelId=imageModelSelect.value;
}

function rebuildImageEditModelSelect(scannedModels){
  const prev=imageEditModelSelect.value||currentImageEditModelId;
  imageEditModelSelect.innerHTML='';
  const models=scannedModels||IMAGE_EDIT_MODELS_DEFAULT;
  models.forEach(m=>{
    const o=document.createElement('option');o.value=m.id;o.textContent=m.label||m.id;
    imageEditModelSelect.appendChild(o);
  });
  if(prev&&[...imageEditModelSelect.options].some(o=>o.value===prev))imageEditModelSelect.value=prev;
  else imageEditModelSelect.selectedIndex=0;
  currentImageEditModelId=imageEditModelSelect.value;
}

const btnScanImageModels=$('btnScanImageModels');
const scanStatus=$('scanStatus');
btnScanImageModels.addEventListener('click',scanGeminiImageModels);

async function scanGeminiImageModels(){
  const key=apiKeyInput.value.trim()||apiKeys.gemini;
  if(!key){scanStatus.textContent=T.scanNoKey;scanStatus.style.color='#e57373';return;}
  btnScanImageModels.disabled=true;scanStatus.textContent=T.scanRunning;scanStatus.style.color='var(--text-secondary)';
  try{
    const models=await fetchGeminiImageModels(key);
    if(!models.length){scanStatus.textContent=T.scanNone;scanStatus.style.color='#e57373';return;}
    await chrome.storage.local.set({scannedGeminiImageModels:models});
    rebuildImageModelSelect(models);
    scanStatus.textContent=T.scanFound(models.length);scanStatus.style.color='#34a853';
  }catch(e){scanStatus.textContent=T.scanError(e.message);scanStatus.style.color='#e57373';}
  finally{btnScanImageModels.disabled=false;}
}

async function fetchGeminiImageModels(key){
  let allModels=[]; let pageToken=null;
  do{
    const params=new URLSearchParams({pageSize:'200'});
    if(pageToken)params.set('pageToken',pageToken);
    const r=await fetch(`https://generativelanguage.googleapis.com/v1beta/models?${params}`,{headers:{'x-goog-api-key':key}});
    if(!r.ok){const e=await r.json().catch(()=>({}));throw new Error(e?.error?.message||'HTTP '+r.status);}
    const j=await r.json(); allModels=allModels.concat(j.models||[]); pageToken=j.nextPageToken||null;
  }while(pageToken);
  return allModels
    .filter(m=>Array.isArray(m.supportedGenerationMethods)&&m.supportedGenerationMethods.includes('predict'))
    .map(m=>({id:m.name.replace('models/',''),label:m.displayName||m.name.replace('models/',''),provider:'gemini'}))
    .sort((a,b)=>a.label.localeCompare(b.label));
}

// ── Skaner modeli edycji obrazów ──────────────────────────────
const btnScanImageEditModels=$('btnScanImageEditModels');
const scanEditStatus=$('scanEditStatus');
btnScanImageEditModels.addEventListener('click',scanGeminiEditModels);

async function scanGeminiEditModels(){
  const key=apiKeyInput.value.trim()||apiKeys.gemini;
  if(!key){scanEditStatus.textContent=T.scanNoKey||'No API key.';scanEditStatus.style.color='#e57373';return;}
  btnScanImageEditModels.disabled=true;
  scanEditStatus.textContent=T.scanRunning||'Scanning...';
  scanEditStatus.style.color='var(--text-secondary)';
  try{
    const models=await fetchGeminiEditModels(key);
    if(!models.length){scanEditStatus.textContent=T.scanNone||'No models found.';scanEditStatus.style.color='#e57373';return;}
    await chrome.storage.local.set({scannedGeminiEditModels:models});
    rebuildImageEditModelSelect(models);
    const n=models.length;
    scanEditStatus.textContent=(T.scanFound?T.scanFound(n):`Found ${n} model(s).`);
    scanEditStatus.style.color='#34a853';
  }catch(e){
    scanEditStatus.textContent=(T.scanError?T.scanError(e.message):'Error: '+e.message);
    scanEditStatus.style.color='#e57373';
  }
  finally{btnScanImageEditModels.disabled=false;}
}

async function fetchGeminiEditModels(key){
  let allModels=[]; let pageToken=null;
  do{
    const params=new URLSearchParams({pageSize:'200'});
    if(pageToken)params.set('pageToken',pageToken);
    const r=await fetch(`https://generativelanguage.googleapis.com/v1beta/models?${params}`,{headers:{'x-goog-api-key':key}});
    if(!r.ok){const e=await r.json().catch(()=>({}));throw new Error(e?.error?.message||'HTTP '+r.status);}
    const j=await r.json(); allModels=allModels.concat(j.models||[]); pageToken=j.nextPageToken||null;
  }while(pageToken);

  // Filtruj modele Gemini które obsługują generateContent
  // i mają "image" w nazwie – to są modele Nano Banana (edycja/generowanie obrazów)
  const found = allModels
    .filter(m=>{
      const methods=m.supportedGenerationMethods||[];
      const name=(m.name||'').toLowerCase();
      return methods.includes('generateContent') &&
        (name.includes('-image') || name.includes('flash-image') || name.includes('pro-image'));
    })
    .map(m=>({id:m.name.replace('models/',''),label:m.displayName||m.name.replace('models/','')}))
    .sort((a,b)=>a.label.localeCompare(b.label));

  // Zawsze dołącz znane modele z dokumentacji (mogą nie być widoczne przez API)
  const knownIds = found.map(m=>m.id);
  const alwaysInclude = IMAGE_EDIT_MODELS_DEFAULT.filter(m=>!knownIds.includes(m.id));
  return [...found, ...alwaysInclude];
}

// ============================================================
// UTILS & API
// ============================================================
const BLOCKED=["chrome://","chrome-extension://","about:","edge://","brave://","file://"];
async function getActiveTab(){
  let[tab]=await chrome.tabs.query({active:true,lastFocusedWindow:true});
  if(!tab)[tab]=await chrome.tabs.query({active:true,currentWindow:true});
  if(!tab||BLOCKED.some(p=>tab.url.startsWith(p)))return null;
  return tab;
}

function populateVoices(){
  const voices=window.speechSynthesis.getVoices();const cur=voiceSelect.value;voiceSelect.innerHTML='';
  voices.sort((a,b)=>{const aG=a.name.includes('Google')?0:1;const bG=b.name.includes('Google')?0:1;return aG!==bG?aG-bG:a.name.localeCompare(b.name);})
    .forEach(v=>{const o=document.createElement('option');o.value=v.name;o.textContent=v.name;voiceSelect.appendChild(o);});
  if(cur)voiceSelect.value=cur;
}

function speakText(text){
  window.speechSynthesis.cancel();const ut=new SpeechSynthesisUtterance(text);
  if(currentVoice)ut.voice=currentVoice;ut.rate=1.1;window.speechSynthesis.speak(ut);
}

async function callGeminiText(key,prompt){
  const url=`https://generativelanguage.googleapis.com/v1beta/models/${currentChatModelId}:generateContent`;
  const r=await fetch(url,{method:'POST',headers:{'Content-Type':'application/json','x-goog-api-key':key},body:JSON.stringify({contents:[{parts:[{text:prompt}]}]})});
  if(!r.ok){const e=await r.json().catch(()=>{});throw new Error(e?.error?.message||'HTTP '+r.status);}
  const j=await r.json();const t=j.candidates?.[0]?.content?.parts?.[0]?.text;
  if(!t)throw new Error(T.noResponseFilter);
  return {text:t, tokens:j.usageMetadata?.totalTokenCount||0};
}

async function callGeminiVision(key,b64,mime,prompt){
  const modelId=CHAT_MODELS.find(m=>m.id===currentChatModelId&&m.provider==='gemini')?.id||'gemini-2.5-flash';
  const url=`https://generativelanguage.googleapis.com/v1beta/models/${modelId}:generateContent`;
  const r=await fetch(url,{method:'POST',headers:{'Content-Type':'application/json','x-goog-api-key':key},body:JSON.stringify({contents:[{parts:[{text:prompt},{inline_data:{mime_type:mime,data:b64}}]}]})});
  if(!r.ok){const e=await r.json().catch(()=>{});throw new Error(e?.error?.message||'HTTP '+r.status);}
  const j=await r.json();const t=j.candidates?.[0]?.content?.parts?.[0]?.text;if(!t)throw new Error(T.noResponse);
  return {text:t, tokens:j.usageMetadata?.totalTokenCount||0};
}

async function callOpenAIText(key,prompt){
  const r=await fetch('https://api.openai.com/v1/chat/completions',{method:'POST',headers:{'Content-Type':'application/json','Authorization':`Bearer ${key}`},body:JSON.stringify({model:currentChatModelId,messages:[{role:'user',content:prompt}]})});
  if(!r.ok){const e=await r.json().catch(()=>{});throw new Error(e?.error?.message||'HTTP '+r.status);}
  const j=await r.json();
  return {text:j.choices?.[0]?.message?.content||'', tokens:j.usage?.total_tokens||0};
}

async function callAnthropicText(key,prompt){
  const r=await fetch('https://api.anthropic.com/v1/messages',{method:'POST',headers:{'Content-Type':'application/json','x-api-key':key,'anthropic-version':'2023-06-01','anthropic-dangerous-direct-browser-access':'true'},body:JSON.stringify({model:currentChatModelId,max_tokens:2048,messages:[{role:'user',content:prompt}]})});
  if(!r.ok){const e=await r.json().catch(()=>{});throw new Error(e?.error?.message||'HTTP '+r.status);}
  const j=await r.json();
  return {text:j.content?.[0]?.text||'', tokens:(j.usage?.input_tokens||0)+(j.usage?.output_tokens||0)};
}

async function callGoogleImagen(key,prompt,modelId){
  const url=`https://generativelanguage.googleapis.com/v1beta/models/${modelId}:predict`;
  const r=await fetch(url,{method:'POST',headers:{'Content-Type':'application/json','x-goog-api-key':key},body:JSON.stringify({instances:[{prompt}],parameters:{sampleCount:1}})});
  if(!r.ok){const e=await r.json().catch(()=>{});throw new Error(e?.error?.message||'HTTP '+r.status);}
  const j=await r.json();const b64=j.predictions?.[0]?.bytesBase64Encoded;if(!b64)throw new Error('No image in Imagen response');return b64;
}

async function callDallE(key,prompt,modelId){
  const r=await fetch('https://api.openai.com/v1/images/generations',{method:'POST',headers:{'Content-Type':'application/json','Authorization':`Bearer ${key}`},body:JSON.stringify({model:modelId,prompt,n:1,size:'1024x1024',response_format:'b64_json'})});
  if(!r.ok){const e=await r.json().catch(()=>{});throw new Error(e?.error?.message||'HTTP '+r.status);}
  const j=await r.json();const b64=j.data?.[0]?.b64_json;if(!b64)throw new Error('No image in DALL-E response');return b64;
}

const ALLOWED_IMG_PREFIXES=['https://','data:image/'];
const MAX_IMAGE_SIZE_BYTES=10*1024*1024;

async function urlToBase64WithMime(url){
  if(!ALLOWED_IMG_PREFIXES.some(p=>url.startsWith(p)))throw new Error('Disallowed image source.');
  if(url.startsWith('data:image/')){const[h,b64]=url.split(',');return{base64:b64,mimeType:h.replace('data:','').replace(';base64','')};}
  const r=await fetch(url);if(!r.ok)throw new Error('Cannot fetch image (HTTP '+r.status+')');
  const ct=r.headers.get('Content-Type')||'';if(!ct.startsWith('image/'))throw new Error('Not an image.');
  const blob=await r.blob();if(blob.size>MAX_IMAGE_SIZE_BYTES)throw new Error(T.imageTooBig);
  const mime=blob.type||'image/jpeg';
  return new Promise((res,rej)=>{const fr=new FileReader();fr.onloadend=()=>res({base64:fr.result.split(',')[1],mimeType:mime});fr.onerror=()=>rej(new Error('FileReader error'));fr.readAsDataURL(blob);});
}

// helper set (używany w applyTranslations)
function set(id,val){const el=$(id);if(el&&val!==undefined)el.textContent=val;}
