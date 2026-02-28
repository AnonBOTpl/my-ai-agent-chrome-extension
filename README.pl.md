# 🤖 My AI Agent - Wszechstronne Rozszerzenie Chrome

![Wersja](https://img.shields.io/badge/version-5.3-blue.svg)
![Manifest](https://img.shields.io/badge/Chrome_Manifest-V3-green.svg)
![Brak Zależności](https://img.shields.io/badge/dependencies-0-success.svg)

**My AI Agent** to potężne, lekkie i wszechstronne rozszerzenie przeglądarki Chrome, które integruje najpotężniejsze modele językowe (LLM) bezpośrednio w panelu bocznym (Side Panel) Twojej przeglądarki. Zbudowane w **czystym JavaScript (Vanilla JS)** bez żadnych zewnętrznych bibliotek, oferuje błyskawiczne działanie, skrajną dbałość o prywatność oraz bogaty zestaw narzędzi do pracy z tekstem i obrazem.

*[Read this README in English](README.md)*

## ✨ Główne Funkcjonalności

### 💬 Czat wspierający wielu dostawców AI
- Płynne przełączanie między topowymi modelami od **Google** (Gemini 2.5/2.0), **OpenAI** (GPT-4o, o3-mini) oraz **Anthropic** (Claude 3.5/3.7).
- Dynamiczne przesyłanie strumieniowe odpowiedzi (streaming), wsparcie dla Markdown oraz kolorowania składni kodu.
- Wbudowany licznik tokenów pomagający kontrolować zużycie API.
- Możliwość eksportu czatu do formatów **Markdown (.md)** oraz **PDF**.
- Możliwość tworzenia i zarządzania **własnymi szablonami promptów** (Snippety).

### 📄 Kontekstowe Narzędzia Tekstowe
- Zaznacz dowolny tekst na stronie i błyskawicznie wywołaj akcję: **Wyjaśnij, Streszcz, Przetłumacz lub Popraw styl**.
- Wbudowany syntezator mowy (TTS) umożliwiający czytanie na głos odpowiedzi AI.

### 🖼️ Zaawansowana Praca z Obrazem
- **Wycinanie na ekranie (Crop):** Zaznacz dowolny obszar ekranu, zrób zrzut (screenshot) i wyślij bezpośrednio do AI w celu analizy.
- **Przeciągnij i Upuść / Wklej:** Wygodnie przeciągaj obrazy do panelu lub wklejaj je wprost ze schowka (Ctrl+V).
- **Analiza Obrazu (Vision):** Zadawaj pytania dotyczące zawartości obrazków (Gemini Vision).
- **Generowanie Obrazów:** Twórz niesamowite grafiki za pomocą **Google Imagen 4** lub **DALL-E 3**.
- **Natywna Edycja Obrazów:** Edytuj grafiki z użyciem promptów i dedykowanych modeli sprzętowych (np. `gemini-2.5-flash-image`).

### 🔒 Bezpieczeństwo i Lekkość
- **Zero zewnętrznych zależności:** Zbudowano własny, ultra-lekki parser Markdown oraz mechanizm podświetlania składni (Syntax Highlighter).
- **Lokalne Przechowywanie Danych:** Twoje klucze API oraz historia czatów są zapisywane *wyłącznie lokalnie* (w `chrome.storage.local`). Nigdy nie trafiają na zewnętrzne serwery ani do chmury profilu.

### 🎨 Piękny Interfejs i UX
- Obsługa motywów: Jasny / Ciemny / Automatyczny (systemowy).
- Interfejs w pełni dostępny po polsku (auto-detekcja języka przeglądarki).
- Pływająca ikona szybkiego wywołania i integracja z menu kontekstowym przeglądarki (Prawy przycisk myszy na obrazku -> "Wyślij obraz do Agenta AI").

---

## 🚀 Instalacja 

Ponieważ to rozszerzenie wykorzystuje Twoje własne klucze API, powinno być instalowane lokalnie w Trybie Programisty.

1. **Pobierz lub sklonuj** to repozytorium na swój komputer:
   ```bash
   git clone https://github.com/twoja-nazwa/my-ai-agent-extension.git
   ```
2. Otwórz przeglądarkę Google Chrome i przejdź pod adres `chrome://extensions/`.
3. Włącz **Tryb programisty** (przełącznik w prawym górnym rogu).
4. Kliknij przycisk **Załaduj rozpakowane**.
5. Wskaż folder pobranego/sklonowanego rozszerzenia.
6. Rozszerzenie zostało zainstalowane! Kliknij ikonę puzzla 🧩 w Chrome, przypnij "My AI Agent" obok paska adresu i otwórz Panel Boczny (Side Panel).

---

## ⚙️ Konfiguracja i Klucze API

Do korzystania z AI potrzebujesz samodzielnie wygenerowanych kluczy API.
1. Otwórz panel boczny rozszerzenia.
2. Kliknij ikonę zębatki (⚙️ - Ustawienia) w prawym górnym rogu.
3. Wklej swoje klucze w odpowiednie pola:
   - **Klucz Google Gemini:** (Wymagany do czatu, analizy zdjęć, generatora Imagen i edycji obrazów). Skonfiguruj na [Google AI Studio](https://aistudio.google.com/).
   - **Klucz OpenAI:** (Wymagany do modeli GPT i DALL-E). Wygeneruj na [OpenAI Platform](https://platform.openai.com/).
   - **Klucz Anthropic:** (Wymagany do modeli Claude). Wygeneruj na [Anthropic Console](https://console.anthropic.com/).
4. Kliknij **Zapisz i Zamknij**.

---

## 🛠️ Stack Technologiczny
- **HTML5, CSS3, Vanilla JavaScript (ES6+)**
- Zgodność z Chrome Extension Manifest V3: Wykorzystanie `chrome.sidePanel`, `chrome.contextMenus`, `chrome.storage`, `chrome.scripting`.
- **Integracje API:** Google Generative Language API (Gemini/Imagen), REST API OpenAI, REST API Anthropic.

## 📄 Licencja
Projekt ma charakter open-source i jest dostępny na licencji [MIT](LICENSE).
