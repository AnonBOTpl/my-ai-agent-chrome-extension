// --- 1. IKONA PŁYWAJĄCA ---
function initFloatingIcon() {
  // FIX: guard na document.body (może być null w SPA podczas ładowania)
  if (!document.body) {
    document.addEventListener('DOMContentLoaded', initFloatingIcon);
    return;
  }
  if (document.getElementById('ai-agent-trigger')) return;

  const btn = document.createElement('div');
  btn.id = 'ai-agent-trigger';
  btn.title = "Otwórz Agenta AI";
  const iconUrl = chrome.runtime.getURL("icon.png");
  btn.innerHTML = `<img src="${iconUrl}" alt="AI" style="width:100%; height:100%; object-fit:contain;">`;
  document.body.appendChild(btn);

  btn.addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: "open_side_panel" });
  });
}
initFloatingIcon();

// --- 2. NASŁUCHIWANIE WIADOMOŚCI ---
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "start_area_selection") {
    startAreaSelection();
    sendResponse({ status: "started" });
  }
  return true;
});

// --- 3. FUNKCJA ZAZNACZANIA (CROP) ---
function startAreaSelection() {
  if (document.getElementById('ai-crop-overlay')) return;

  const overlay = document.createElement('div');
  overlay.id = 'ai-crop-overlay';

  overlay.style.cssText = `
    position: fixed !important; top: 0 !important; left: 0 !important;
    width: 100vw !important; height: 100vh !important;
    z-index: 2147483647 !important; cursor: crosshair !important;
    background: rgba(0, 0, 0, 0.1) !important; pointer-events: auto !important;
  `;

  const selectionBox = document.createElement('div');
  selectionBox.style.cssText = `
    border: 2px dashed #ff0000 !important; background: rgba(255, 0, 0, 0.1) !important;
    position: absolute !important; display: none !important; pointer-events: none !important;
  `;

  overlay.appendChild(selectionBox);
  document.body.appendChild(overlay);

  let startX, startY;
  let isDrawing = false;
  let isCleanedUp = false; // FIX: flaga zapobiegająca race condition

  const onMouseDown = (e) => {
    isDrawing = true;
    startX = e.clientX;
    startY = e.clientY;
    selectionBox.style.display = 'block';
    selectionBox.style.left = startX + 'px';
    selectionBox.style.top = startY + 'px';
    selectionBox.style.width = '0px';
    selectionBox.style.height = '0px';
    e.preventDefault(); e.stopPropagation();
  };

  const onMouseMove = (e) => {
    if (!isDrawing) return;
    const currentX = e.clientX;
    const currentY = e.clientY;
    const width = Math.abs(currentX - startX);
    const height = Math.abs(currentY - startY);
    const left = Math.min(currentX, startX);
    const top = Math.min(currentY, startY);
    selectionBox.style.width = width + 'px';
    selectionBox.style.height = height + 'px';
    selectionBox.style.left = left + 'px';
    selectionBox.style.top = top + 'px';
  };

  const onMouseUp = (e) => {
    if (!isDrawing) return;
    isDrawing = false;

    // FIX: Zapamiętujemy wymiary PRZED cleanup, żeby nie odczytywać z usuniętego elementu
    const rect = selectionBox.getBoundingClientRect();
    const area = {
      x: rect.x,
      y: rect.y,
      width: rect.width,
      height: rect.height,
      devicePixelRatio: window.devicePixelRatio
    };

    cleanup();

    if (area.width < 5 || area.height < 5) return;

    // Czekamy 100ms żeby ramka zniknęła z ekranu przed screenshotem
    setTimeout(() => {
      chrome.runtime.sendMessage({ action: "area_selected", area });
    }, 100);
  };

  const onKeyDown = (e) => { if (e.key === 'Escape') cleanup(); };

  function cleanup() {
    if (isCleanedUp) return; // FIX: zapobiegamy podwójnemu cleanup
    isCleanedUp = true;
    if (document.body.contains(overlay)) document.body.removeChild(overlay);
    document.removeEventListener('keydown', onKeyDown);
  }

  overlay.addEventListener('mousedown', onMouseDown);
  overlay.addEventListener('mousemove', onMouseMove);
  overlay.addEventListener('mouseup', onMouseUp);
  document.addEventListener('keydown', onKeyDown);
}
