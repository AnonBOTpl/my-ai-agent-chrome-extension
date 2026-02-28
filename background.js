// 1. Pozwala otwierać panel kliknięciem w ikonę na pasku
chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error(error));

// 2. Obsługa wiadomości z content script (Pływający przycisk)
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "open_side_panel") {
    if (sender.tab && sender.tab.id) {
      chrome.sidePanel.open({ tabId: sender.tab.id });
    }
  }
  return true; // FIX: potrzebne dla asynchronicznych sendResponse
});

// 3. Menu kontekstowe (Prawy przycisk myszy)
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "analyze-image-panel",
    title: "🎨 Wyślij obraz do Agenta AI",
    contexts: ["image"]
  });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "analyze-image-panel") {
    // FIX: Zamiast setTimeout, zapisujemy URL do storage.session.
    // Sidepanel odczyta go sam po otwarciu i przy każdym focus evencie.
    await chrome.storage.session.set({ pendingImageUrl: info.srcUrl });
    chrome.sidePanel.open({ tabId: tab.id });
  }
});