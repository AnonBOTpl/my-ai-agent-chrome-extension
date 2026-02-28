// ============================================================
// WŁASNY PROSTY SYNTAX HIGHLIGHTER
// Obsługuje: JS/TS, Python, HTML, CSS, JSON, SQL, Bash
// Zero zewnętrznych zależności — tylko regex + DOM API
// ============================================================

const SH = (() => {

  // Klasy CSS do kolorowania
  const C = {
    keyword:  'sh-kw',
    string:   'sh-str',
    comment:  'sh-cmt',
    number:   'sh-num',
    func:     'sh-fn',
    tag:      'sh-tag',
    attr:     'sh-attr',
    operator: 'sh-op',
    builtin:  'sh-bi',
  };

  // Słowa kluczowe per język
  const KEYWORDS = {
    js: ['const','let','var','function','return','if','else','for','while','do',
         'switch','case','break','continue','new','delete','typeof','instanceof',
         'class','extends','import','export','default','from','async','await',
         'try','catch','finally','throw','null','undefined','true','false','this',
         'super','static','get','set','of','in','yield','void'],
    py: ['def','class','return','if','elif','else','for','while','in','not','and',
         'or','import','from','as','with','try','except','finally','raise','pass',
         'break','continue','lambda','yield','global','nonlocal','del','assert',
         'True','False','None','is','async','await'],
    sql: ['SELECT','FROM','WHERE','INSERT','INTO','UPDATE','SET','DELETE','CREATE',
          'TABLE','DROP','ALTER','ADD','INDEX','JOIN','LEFT','RIGHT','INNER','OUTER',
          'ON','AND','OR','NOT','NULL','AS','ORDER','BY','GROUP','HAVING','LIMIT',
          'OFFSET','DISTINCT','UNION','ALL','VALUES','PRIMARY','KEY','FOREIGN',
          'REFERENCES','DEFAULT','AUTO_INCREMENT','VARCHAR','INT','TEXT','BOOLEAN',
          'DATE','TIMESTAMP','COUNT','SUM','AVG','MAX','MIN'],
    bash: ['echo','cd','ls','mkdir','rm','cp','mv','cat','grep','find','sed','awk',
           'chmod','chown','sudo','apt','pip','npm','git','curl','wget','export',
           'source','if','then','else','fi','for','do','done','while','case','esac',
           'function','return','exit','set','unset','read','local'],
  };

  const BUILTINS_JS = ['console','document','window','Math','Array','Object',
    'String','Number','Boolean','Promise','fetch','JSON','Date','RegExp',
    'Error','Map','Set','Symbol','Proxy','Reflect','parseInt','parseFloat',
    'setTimeout','setInterval','clearTimeout','clearInterval','alert','confirm'];

  const BUILTINS_PY = ['print','len','range','type','int','str','float','list',
    'dict','tuple','set','bool','input','open','enumerate','zip','map','filter',
    'sorted','reversed','sum','min','max','abs','round','isinstance','hasattr',
    'getattr','setattr','super','property','staticmethod','classmethod'];

  // Escape HTML (bezpieczne wstawianie)
  function esc(s) {
    return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  // Owinięcie fragmentu w span
  function span(cls, content) {
    return `<span class="${cls}">${content}</span>`;
  }

  // Główna funkcja highlight dla danego języka
  function highlight(code, lang) {
    const l = (lang || '').toLowerCase();

    if (l === 'html' || l === 'xml' || l === 'svg') return highlightHTML(code);
    if (l === 'css' || l === 'scss') return highlightCSS(code);
    if (l === 'json') return highlightJSON(code);
    if (l === 'py' || l === 'python') return highlightGeneric(code, KEYWORDS.py, BUILTINS_PY, '#');
    if (l === 'sql') return highlightSQL(code);
    if (l === 'sh' || l === 'bash' || l === 'shell' || l === 'zsh') return highlightGeneric(code, KEYWORDS.bash, [], '#');
    if (l === 'js' || l === 'javascript' || l === 'ts' || l === 'typescript' || l === 'jsx' || l === 'tsx')
      return highlightGeneric(code, KEYWORDS.js, BUILTINS_JS, '//');

    // Nieznany język — tylko escape
    return esc(code);
  }

  // ── Generic (JS/TS/Py/Bash) ────────────────────────────
  function highlightGeneric(code, keywords, builtins, lineComment) {
    // Tokenizer: kolejność ma znaczenie!
    const tokens = [];
    let i = 0;
    const src = code;

    while (i < src.length) {
      // Komentarz liniowy
      if (src.slice(i, i + lineComment.length) === lineComment) {
        const end = src.indexOf('\n', i);
        const chunk = end === -1 ? src.slice(i) : src.slice(i, end);
        tokens.push(span(C.comment, esc(chunk)));
        i += chunk.length;
        continue;
      }
      // Komentarz blokowy JS /* */
      if (lineComment === '//' && src.slice(i, i+2) === '/*') {
        const end = src.indexOf('*/', i+2);
        const chunk = end === -1 ? src.slice(i) : src.slice(i, end+2);
        tokens.push(span(C.comment, esc(chunk)));
        i += chunk.length;
        continue;
      }
      // Stringi ``, "", ''
      if (src[i] === '`' || src[i] === '"' || src[i] === "'") {
        const q = src[i];
        let j = i+1;
        while (j < src.length) {
          if (src[j] === '\\') { j+=2; continue; }
          if (src[j] === q) { j++; break; }
          j++;
        }
        tokens.push(span(C.string, esc(src.slice(i, j))));
        i = j;
        continue;
      }
      // Liczby
      const numMatch = src.slice(i).match(/^-?(?:0x[\da-fA-F]+|\d+\.?\d*(?:[eE][+-]?\d+)?)/);
      if (numMatch && (i === 0 || /[\s\(,=+\-*\/[{:<>!&|^~%?]/.test(src[i-1]))) {
        tokens.push(span(C.number, esc(numMatch[0])));
        i += numMatch[0].length;
        continue;
      }
      // Identyfikatory / słowa kluczowe
      const wordMatch = src.slice(i).match(/^[a-zA-Z_$][a-zA-Z0-9_$]*/);
      if (wordMatch) {
        const w = wordMatch[0];
        if (keywords.includes(w)) tokens.push(span(C.keyword, esc(w)));
        else if (builtins.includes(w)) tokens.push(span(C.builtin, esc(w)));
        else if (src[i + w.length] === '(') tokens.push(span(C.func, esc(w)));
        else tokens.push(esc(w));
        i += w.length;
        continue;
      }
      // Operatory
      const opMatch = src.slice(i).match(/^[+\-*/%=<>!&|^~?:]+/);
      if (opMatch) {
        tokens.push(span(C.operator, esc(opMatch[0])));
        i += opMatch[0].length;
        continue;
      }
      // Reszta (nawiasy, przecinki, whitespace)
      tokens.push(esc(src[i]));
      i++;
    }
    return tokens.join('');
  }

  // ── HTML ───────────────────────────────────────────────
  function highlightHTML(code) {
    return esc(code)
      // tagi
      .replace(/&lt;(\/?)([a-zA-Z][a-zA-Z0-9-]*)/g, (_, slash, tag) =>
        `&lt;${slash}<span class="${C.tag}">${tag}</span>`)
      // atrybuty
      .replace(/\b([a-zA-Z-]+)(?==)/g, `<span class="${C.attr}">$1</span>`)
      // wartości atrybutów
      .replace(/(=)(&quot;[^&]*&quot;|&#39;[^&]*&#39;)/g, `$1<span class="${C.string}">$2</span>`)
      // komentarze
      .replace(/(&lt;!--[\s\S]*?--&gt;)/g, `<span class="${C.comment}">$1</span>`);
  }

  // ── CSS ────────────────────────────────────────────────
  function highlightCSS(code) {
    return esc(code)
      // komentarze
      .replace(/(\/\*[\s\S]*?\*\/)/g, `<span class="${C.comment}">$1</span>`)
      // selektory (przed {)
      .replace(/([^{};,\n]+)(?=\s*\{)/g, `<span class="${C.tag}">$1</span>`)
      // właściwości CSS
      .replace(/([a-z-]+)(?=\s*:)/g, `<span class="${C.attr}">$1</span>`)
      // wartości (po :, przed ;)
      .replace(/:\s*([^;{}\n]+)/g, (m, val) => `: <span class="${C.string}">${val}</span>`)
      // liczby z jednostkami
      .replace(/<span class="${C.string}">([\s\S]*?)<\/span>/g, (m, inner) =>
        `<span class="${C.string}">${inner.replace(/(\d+\.?\d*)(px|em|rem|%|vh|vw|pt|deg|s|ms)?/g,
          (_, n, u) => `<span class="${C.number}">${n}</span>${u||''}`)}</span>`);
  }

  // ── JSON ───────────────────────────────────────────────
  function highlightJSON(code) {
    return esc(code)
      .replace(/(&quot;[^&]*&quot;)\s*:/g, `<span class="${C.attr}">$1</span>:`)
      .replace(/:\s*(&quot;[^&]*&quot;)/g, `: <span class="${C.string}">$1</span>`)
      .replace(/\b(true|false|null)\b/g, `<span class="${C.keyword}">$1</span>`)
      .replace(/\b(-?\d+\.?\d*(?:[eE][+-]?\d+)?)\b/g, `<span class="${C.number}">$1</span>`);
  }

  // ── SQL ────────────────────────────────────────────────
  function highlightSQL(code) {
    let result = esc(code);
    // Stringi
    result = result.replace(/'[^']*'/g, m => span(C.string, m));
    // Komentarze
    result = result.replace(/--.*/g, m => span(C.comment, m));
    // Słowa kluczowe (case-insensitive)
    const kwRe = new RegExp(`\\b(${KEYWORDS.sql.join('|')})\\b`, 'gi');
    result = result.replace(kwRe, m => span(C.keyword, m));
    // Liczby
    result = result.replace(/\b(\d+)\b/g, span(C.number, '$1'));
    return result;
  }

  return { highlight };
})();
