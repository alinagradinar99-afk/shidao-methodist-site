// Прототип кабинета методиста Shidao: программы курсов, конструктор урока и ДЗ.
// Без сборки: состояние в localStorage, маршрутизация по hash.

(() => {
  const KEY = 'shidao-methodist-v4';
  const clone = (o) => JSON.parse(JSON.stringify(o));

  let S = null;
  try { S = JSON.parse(localStorage.getItem(KEY)); } catch (e) { S = null; }
  if (!S || !S.methods || !S.scenarios) S = clone(window.SEED);

  let idx = {};
  function reindex() {
    idx = {};
    (function walk(o) {
      if (Array.isArray(o)) o.forEach(walk);
      else if (o && typeof o === 'object') {
        if (typeof o.id === 'string') idx[o.id] = o;
        Object.values(o).forEach(walk);
      }
    })(S);
  }
  reindex();

  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* приватный режим */ } }

  let seq = 0;
  const uid = (p) => `${p}${Date.now().toString(36).slice(-4)}${(seq++).toString(36)}${Math.random().toString(36).slice(2, 5)}`;
  function renew(o) {
    if (Array.isArray(o)) o.forEach(renew);
    else if (o && typeof o === 'object') {
      if (typeof o.id === 'string') o.id = uid(o.id[0] || 'x');
      Object.values(o).forEach(renew);
    }
    return o;
  }

  const esc = (s) => (s == null ? '' : String(s)).replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));

  // ---------------------------------------------------------------- Иконки
  const P = {
    plus: 'M12 5v14M5 12h14', trash: 'M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6', up: 'M18 15l-6-6-6 6', down: 'M6 9l6 6 6-6',
    grip: 'M9 6h.01M15 6h.01M9 12h.01M15 12h.01M9 18h.01M15 18h.01', play: 'M7 4l13 8-13 8z',
    eye: 'M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z', copy: 'M8 8h12v12H8zM4 16V4h12',
    clock: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 6v6l4 2', check: 'M20 6L9 17l-5-5', x: 'M18 6L6 18M6 6l12 12',
    mic: 'M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3zM19 10v2a7 7 0 0 1-14 0v-2M12 19v3',
    image: 'M3 3h18v18H3zM8.5 10a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM21 15l-5-5L5 21', upload: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12',
    send: 'M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z', layers: 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5',
    home: 'M3 10l9-7 9 7v10a1 1 0 0 1-1 1h-5v-7h-6v7H4a1 1 0 0 1-1-1z', book: 'M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5zM4 19.5A2.5 2.5 0 0 0 6.5 22H20v-5',
    film: 'M3 3h18v18H3zM7 3v18M17 3v18M3 12h18M3 7h4M3 17h4M17 7h4M17 17h4', music: 'M9 18V5l12-2v13M6 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM18 19a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
    text: 'M4 7V4h16v3M9 20h6M12 4v16', reveal: 'M17.9 17.9A10 10 0 0 1 12 20c-6 0-10-8-10-8a18 18 0 0 1 5-6M9.9 4.2A9 9 0 0 1 12 4c6 0 10 8 10 8a18 18 0 0 1-2.2 3.2M1 1l22 22',
    move: 'M5 9l-3 3 3 3M9 5l3-3 3 3M15 19l-3 3-3-3M19 9l3 3-3 3M2 12h20M12 2v20', printer: 'M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2M6 14h12v8H6z',
    users: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8',
    list: 'M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01', sliders: 'M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6',
    back: 'M19 12H5M12 19l-7-7 7-7', chev: 'M9 18l6-6-6-6', sparkle: 'M12 3l1.9 5.8L20 11l-6.1 2.2L12 19l-1.9-5.8L4 11l6.1-2.2z',
    file: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6', folder: 'M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z',
    target: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12zM12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z',
    headphones: 'M3 18v-6a9 9 0 0 1 18 0v6M21 19a2 2 0 0 1-2 2h-1v-6h3zM3 19a2 2 0 0 0 2 2h1v-6H3z', pen: 'M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z',
    video: 'M23 7l-7 5 7 5zM1 5h15v14H1z', heart: 'M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z',
    game: 'M6 12h4M8 10v4M15 13h.01M18 11h.01M17.3 5H6.7a4 4 0 0 0-4 3.6L2 15a3 3 0 0 0 5.2 2l1.8-2h6l1.8 2A3 3 0 0 0 22 15l-.7-6.4A4 4 0 0 0 17.3 5z',
    cards: 'M2 6h14v14H2zM6 2h16v16', pause: 'M6 4h4v16H6zM14 4h4v16h-4z', monitor: 'M2 3h20v14H2zM8 21h8M12 17v4',
    bot: 'M12 8V4H8M4 8h16v12H4zM2 14h2M20 14h2M15 13v2M9 13v2', order: 'M3 6h18M3 12h12M3 18h6', save: 'M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2zM17 21v-8H7v8M7 3v5h8',
    history: 'M3 3v5h5M3.05 13A9 9 0 1 0 6 5.3L3 8M12 7v5l4 2', assign: 'M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M8.5 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM20 8v6M23 11h-6',
    refresh: 'M23 4v6h-6M1 20v-6h6M3.5 9a9 9 0 0 1 14.9-3.4L23 10M1 14l4.6 4.4A9 9 0 0 0 20.5 15', tablet: 'M5 2h14a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zM12 18h.01',
    flag: 'M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1zM4 22v-7',
  };
  const icon = (n, s = 16, extra = '') => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="${n === 'play' ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="${n === 'grip' ? 3 : 2}" stroke-linecap="round" stroke-linejoin="round" ${extra}><path d="${P[n] || ''}"/></svg>`;

  // ---------------------------------------------------------------- Справочники
  const COMP = {
    text: { label: 'Текст с переводом', desc: 'Китайский текст, пиньинь и перевод; перевод выводит преподаватель', color: '#70b7ff38', icon: 'text', mvp: true },
    media: { label: 'Аудио и видео', desc: 'Видео, аудио, песня; управление с экрана преподавателя', color: '#14141412', icon: 'film', mvp: true },
    cards: { label: 'Набор карточек', desc: 'Карточки урока: сетка, карусель или «нажми карточку, которую назвал учитель»', color: '#c9ff4f66', icon: 'cards', mvp: true },
    slides: { label: 'Презентация', desc: 'Слайды презентации урока; PPTX и PDF для скачивания', color: '#ffe58a80', icon: 'monitor', mvp: true },
    choice: { label: 'Выбор ответа', desc: 'Простое упражнение: вопрос и варианты ответа', color: '#70b7ff38', icon: 'list', mvp: true },
    drag: { label: 'Сопоставление', desc: 'Составление пар, перетаскивание к цели, сортировка', color: '#ffb6e859', icon: 'move', mvp: true },
    scene: { label: 'Сцена с персонажами', desc: 'Сцена с 小龙 и 小妹, реплики с аудио (Rive / Lottie)', color: '#c9ff4f66', icon: 'users' },
    reveal: { label: 'Скрыть / показать', desc: 'Элементы открываются по одному по команде преподавателя', color: '#c9b4ff59', icon: 'reveal' },
    static: { label: 'Статичная сцена', desc: 'Изображение или композиция без интерактива', color: '#ffe58a80', icon: 'image' },
    print: { label: 'Карточка для печати', desc: 'Материалы для печати и работы с физическими карточками', color: '#1414140d', icon: 'printer' },
  };
  const CTX = { lesson: 'Урок', review: 'Повторение', hw: 'ДЗ' };

  const TT = {
    choice: { label: 'Выбор варианта', check: 'auto', icon: 'list', desc: 'Перевод, иероглиф, пиньинь или конструкция', mvp: true },
    match: { label: 'Сопоставление', check: 'auto', icon: 'move', desc: 'Слово ↔ картинка, иероглиф ↔ пиньинь', mvp: true },
    cards: { label: 'Карточки', check: 'auto', icon: 'cards', desc: 'Повторение слов урока (SRS)', mvp: true },
    audio: { label: 'Аудирование', check: 'auto', icon: 'headphones', desc: 'Слушает аудио и выбирает ответ', mvp: true },
    order: { label: 'Расстановка слов', check: 'auto', icon: 'order', desc: 'Составить предложение по порядку' },
    gap: { label: 'Пропуск в предложении', check: 'auto', icon: 'text', desc: 'Подставить слово или конструкцию' },
    hanzi: { label: 'Написание иероглифа', check: 'auto', icon: 'pen', desc: 'Обводка с проверкой порядка черт' },
    game: { label: 'Игровое упражнение', check: 'auto', icon: 'game', desc: 'Из библиотеки интерактивных компонентов' },
    presentation: { label: 'Задание по презентации', check: 'auto', icon: 'monitor', desc: 'Вопросы к слайдам урока' },
    pron: { label: 'Аудиоответ', check: 'manual', icon: 'mic', desc: 'Ученик записывает произношение, проверяет преподаватель', mvp: true },
    text: { label: 'Текстовый ответ', check: 'manual', icon: 'pen', desc: 'Ученик вписывает ответ', mvp: true },
    photo: { label: 'Фото работы', check: 'manual', icon: 'image', desc: 'Рисунок, поделка, пропись', mvp: true },
    draw: { label: 'Рисование на экране', check: 'manual', icon: 'pen', desc: 'Рисует пальцем или мышью' },
    video: { label: 'Видеоответ', check: 'manual', icon: 'video', desc: 'Короткое видео ученика' },
    file: { label: 'Загрузка файла', check: 'manual', icon: 'upload', desc: 'PDF, DOC, изображение' },
    parent: { label: 'Задание с родителем', check: 'manual', icon: 'heart', desc: 'Выполняется вместе дома' },
    ai: { label: 'Задание от ИИ-ассистента', check: 'ai', icon: 'bot', desc: 'В рамках утверждённой программы · Этап 2', stage2: true },
  };
  const CHECK = { auto: 'Автопроверка', manual: 'Проверяет преподаватель', hybrid: 'Авто + преподаватель', ai: 'Этап 2' };
  const STATUS = { published: 'Опубликован', draft: 'Черновик', review: 'На проверке', archived: 'Архив' };
  const SEGMENTS = ['Детские сады', 'Частные школы · начальная', 'Средняя и старшая школа', 'Репетиторы · индивидуально', 'Дополнительные курсы'];
  const AGES = ['4–6 лет', '5–6 лет', '7–10 лет', '11–14 лет', '15–18 лет', '4–18 лет'];
  const DIFF = ['Стартовый', 'Базовый', 'Средний', 'Продвинутый', 'HSK 1', 'HSK 2', 'HSK 3'];
  const ACT = {
    greet: ['Приветствие', '#c9ff4f66'], video: ['Видео', '#70b7ff38'], story: ['История', '#c9b4ff59'], words: ['Лексика', '#ffe58a80'],
    activity: ['Активность', '#c9ff4f66'], game: ['Игра', '#ffb6e859'], count: ['Счёт', '#70b7ff38'], song: ['Песня', '#c9b4ff59'],
    book: ['Тетрадь', '#1414140d'], dialog: ['Диалог', '#ffb6e859'], review: ['Повторение', '#ffe58a80'],
  };
  const actOf = (a) => ACT[a] || ACT.activity;
  const actChip = (a) => `<span class="chip" style="background:${actOf(a)[1]}">${actOf(a)[0]}</span>`;
  const FORMATS = { offline: 'Офлайн в группе', online: 'Онлайн по ссылке', hybrid: 'Гибридное', individual: 'Индивидуальное', home: 'Повторение дома', mini: 'Мини-урок ученика' };

  const ui = {
    stepId: null, stepView: 'student', blockId: null, taskId: null, kid: {},
    duoStep: 0, liveStep: 0, paused: false, trOn: false, revealN: 1, pv: 'teacher', tvTab: 'plan', tvStep: 0, methodsFilter: 'all', mKind: 'all', mAud: 'all', mQ: '',
  };

  // ---------------------------------------------------------------- Хелперы модели
  const methodLessons = (m) => m.levels.flatMap((v) => v.modules.flatMap((d) => d.lessons)).map((id) => S.lessons[id]).filter(Boolean);
  const methodOf = (lid) => S.methods.find((m) => m.levels.some((v) => v.modules.some((d) => d.lessons.includes(lid))));
  const moduleOf = (lid) => { for (const m of S.methods) for (const v of m.levels) for (const d of v.modules) if (d.lessons.includes(lid)) return d; return null; };
  const numOf = (L) => { const m = methodOf(L.id); return m ? methodLessons(m).indexOf(L) + 1 : L.num; };
  const stepMin = (L) => L.steps.reduce((a, s) => a + (+s.duration || 0), 0);
  const plural = (n, a, b, c) => { const x = Math.abs(n) % 100, y = x % 10; return x > 10 && x < 20 ? c : y > 1 && y < 5 ? b : y === 1 ? a : c; };
  const nextVersion = (v) => { const [a, b] = String(v).split('.').map(Number); return `${a || 0}.${(b || 0) + 1}`; };
  const vocabFor = (L, zh) => L.vocab.find((w) => w.zh === zh);
  const swatchOrEmoji = (v, size = 40) => (String(v).startsWith('#') ? `<span class="swatch" style="width:${size}px;height:${size}px;background:${esc(v)}"></span>` : `<span style="font-size:${Math.round(size * 0.7)}px">${esc(v)}</span>`);

  function parentArray(id, o = S) {
    if (Array.isArray(o)) {
      if (o.some((x) => x && x.id === id)) return o;
      for (const x of o) { const r = parentArray(id, x); if (r) return r; }
    } else if (o && typeof o === 'object') {
      for (const v of Object.values(o)) { const r = parentArray(id, v); if (r) return r; }
    }
    return null;
  }
  function removeById(id) { const arr = parentArray(id); if (arr) arr.splice(arr.findIndex((x) => x.id === id), 1); reindex(); }
  function moveBefore(arr, itemId, beforeId) {
    const key = (x) => (x && x.id) || x;
    const i = arr.findIndex((x) => key(x) === itemId);
    if (i < 0) return;
    const [it] = arr.splice(i, 1);
    let j = beforeId ? arr.findIndex((x) => key(x) === beforeId) : arr.length;
    if (j < 0) j = arr.length;
    arr.splice(j, 0, it);
  }

  function newBlock(type) {
    const b = { id: uid('b'), type, ctx: ['lesson', 'review'] };
    if (type === 'scene') Object.assign(b, { title: 'Новая сцена', lines: [{ id: uid('l'), who: '小龙', zh: '你好！', py: 'nǐ hǎo!', ru: 'Привет!' }] });
    if (type === 'media') Object.assign(b, { kind: 'video', title: 'Новое видео', duration: '1:00' });
    if (type === 'text') Object.assign(b, { items: [{ id: uid('i'), zh: '', py: '', ru: '', color: '' }], showTranslation: false });
    if (type === 'reveal') Object.assign(b, { items: [{ id: uid('i'), zh: '', py: '', ru: '', color: '#ffd23f' }] });
    if (type === 'drag') Object.assign(b, { mode: 'pairs', task: 'Соедини пары', pairs: [{ id: uid('i'), left: '', right: '🎈', color: '#4f8dff' }], ctx: ['lesson', 'review', 'hw'] });
    if (type === 'static') Object.assign(b, { title: 'Сцена', caption: '', swatches: [], ctx: ['lesson'] });
    if (type === 'print') Object.assign(b, { title: 'Материал для печати', note: 'A4', ctx: ['lesson'] });
    if (type === 'cards') { const L = curLesson(); Object.assign(b, { mode: 'grid', task: 'Карточки', cards: L && L.materials ? L.materials.cards.slice(0, 4).map((c) => c.zh) : [] }); }
    if (type === 'slides') Object.assign(b, { from: 1, to: 1, note: '' });
    if (type === 'choice') Object.assign(b, { question: 'Вопрос', options: [{ id: uid('i'), text: '', correct: true }, { id: uid('i'), text: '', correct: false }], ctx: ['lesson', 'review', 'hw'] });
    return b;
  }

  function newTask(type) {
    const t = { id: uid('t'), type, title: TT[type].label, instruction: '', points: TT[type].check === 'auto' ? 1 : 2, hint: '' };
    if (type === 'choice') Object.assign(t, { instruction: 'Выбери правильный ответ', options: [{ id: uid('o'), text: '', correct: true }, { id: uid('o'), text: '', correct: false }] });
    if (type === 'audio') Object.assign(t, { instruction: 'Послушай и выбери ответ', phrase: '', options: [{ id: uid('o'), text: '', correct: true }, { id: uid('o'), text: '', correct: false }] });
    if (type === 'match') Object.assign(t, { instruction: 'Соедини пары', pairs: [{ id: uid('o'), word: '', pic: '🍎' }, { id: uid('o'), word: '', pic: '🍌' }] });
    if (type === 'order') Object.assign(t, { instruction: 'Расставь слова по порядку', words: [{ id: uid('o'), text: '我' }, { id: uid('o'), text: '是' }], ru: '' });
    if (type === 'gap') Object.assign(t, { instruction: 'Вставь пропущенное слово', sentence: '我 ___ 小龙。', answer: '是', ru: '' });
    if (type === 'pron') Object.assign(t, { instruction: 'Повтори за диктором', zh: '你好', py: 'nǐ hǎo' });
    if (type === 'hanzi') Object.assign(t, { instruction: 'Обведи иероглиф по контуру', zh: '人' });
    if (type === 'cards') Object.assign(t, { instruction: 'Повтори слова урока', words: [] });
    if (type === 'text') Object.assign(t, { instruction: 'Напиши ответ', answer: '' });
    if (['photo', 'draw', 'video', 'file', 'parent', 'game', 'presentation'].includes(type)) Object.assign(t, { instruction: TT[type].desc, criteria: '' });
    return t;
  }

  // ---------------------------------------------------------------- Маршрутизация
  const app = document.getElementById('app');
  const route = () => (location.hash.replace(/^#\/?/, '') || 'home').split('/');

  function render() {
    const [page, a, b] = route();
    let view = '';
    if (page === 'home') view = vHome();
    else if (page === 'methods') view = vMethods();
    else if (page === 'method') view = vMethod(a);
    else if (page === 'lesson') view = vLesson(a, b || 'steps');
    else if (page === 'library') view = vLibrary();
    else if (page === 'media') view = vMedia();
    else if (page === 'scenarios') view = vScenarios(a);
    else if (page === 'templates') view = vTemplates();
    else view = notFound();
    const active = { home: 'home', methods: 'methods', method: 'methods', lesson: 'methods', library: 'library', media: 'media', scenarios: 'scenarios', templates: 'templates' }[page];
    app.innerHTML = header(active) + `<main class="page">${view}</main>`;
  }

  function go(hash) { if (location.hash === hash) render(); else location.hash = hash; }
  window.addEventListener('hashchange', () => { render(); window.scrollTo(0, 0); });

  function header(active) {
    const item = (k, href, label, ic) => `<a class="pill ${active === k ? 'active' : ''}" href="${href}">${icon(ic, 15)}${label}</a>`;
    return `<div class="header-wrap"><header class="header">
      <a class="logo" href="#home"><span>Shidao<sup>™</sup></span><span class="role-badge">Кабинет методиста</span></a>
      <nav class="nav">
        ${item('home', '#home', 'Главная', 'home')}
        ${item('methods', '#methods', 'Программы', 'book')}
        ${item('scenarios', '#scenarios', 'Сценарии', 'users')}
        ${item('media', '#media', 'Материалы', 'folder')}
        ${item('templates', '#templates', 'Шаблоны заданий', 'cards')}
        ${item('library', '#library', 'Компоненты', 'layers')}
      </nav>
      <div class="header-right">
        <button class="btn icon ghost" data-act="reset" title="Сбросить демо-данные">${icon('refresh', 15)}</button>
        <div class="avatar" title="Елена Ли · методист">ЕЛ</div>
      </div>
    </header></div>`;
  }

  const crumbs = (items) => `<div class="crumbs">${items.map(([t, h]) => (h ? `<a href="${h}">${esc(t)}</a>` : `<span>${esc(t)}</span>`)).join('<span class="sep">/</span>')}</div>`;
  const statusChip = (s) => `<span class="chip status-${s}">${STATUS[s] || s}</span>`;
  const notFound = () => `<div class="card"><h2>Страница не найдена</h2><p class="muted">Вернитесь к <a href="#methods"><u>списку методик</u></a>.</p></div>`;

  // ---------------------------------------------------------------- Главная
  function vHome() {
    const all = Object.values(S.lessons);
    const ref = all.find((l) => l.reference);
    const pub = all.filter((l) => l.status === 'published').length;
    const steps = all.reduce((a, l) => a + l.steps.length, 0);
    const tasks = all.reduce((a, l) => a + l.hw.tasks.length, 0);
    const nolic = S.media.filter((x) => /Не указана/.test(x.license)).length;
    const recent = [ref, ...all.filter((l) => l !== ref)].filter(Boolean).slice(0, 4);
    const zones = [
      ['book', '#c9ff4f66', 'Программы', `${S.methods.length} ${plural(S.methods.length, 'программа', 'программы', 'программ')}`, '#methods'],
      ['list', '#c9b4ff59', 'Уроки', `${all.length} ${plural(all.length, 'урок', 'урока', 'уроков')} · ${steps} шагов`, ref ? `#lesson/${ref.id}/steps` : '#methods'],
      ['users', '#70b7ff38', 'Возрастные сценарии', `${S.scenarios.length} ${plural(S.scenarios.length, 'сценарий', 'сценария', 'сценариев')}`, '#scenarios'],
      ['folder', '#ffb6e859', 'Материалы', `${S.media.length} файлов`, '#media'],
      ['cards', '#ffe58a80', 'Шаблоны заданий', `${S.templates.length} шаблонов`, '#templates'],
    ];
    const stat = (ic, label, n, sub) => `<div class="stat-row"><span class="block-ico" style="background:#14141409">${icon(ic, 15)}</span><div><div class="small" style="font-weight:700">${label}</div>${sub ? `<div class="xs muted">${sub}</div>` : ''}</div><b class="n">${n}</b></div>`;
    return `
    <div class="home-grid">
      <div class="stack" style="--gap:16px">
        ${ref && ref.status !== 'published' ? `<a class="card flat pending-card" href="#lesson/${ref.id}/steps">
          <div class="grow" style="min-width:0">
            <div class="row wrap" style="gap:8px"><span class="chip status-review">${ref.status === 'review' ? 'Ждёт публикации' : 'Черновик'}</span><span class="xs muted">${esc(methodOf(ref.id) ? methodOf(ref.id).title : '')} · v${esc(ref.version)}</span></div>
            <b style="display:block;margin-top:6px">Урок ${numOf(ref)} «${esc(ref.title)}»</b>
            <div class="row wrap xs muted" style="gap:12px;margin-top:4px"><span class="row" style="gap:4px">${icon('list', 12)}${ref.steps.length} шагов</span><span class="row" style="gap:4px">${icon('send', 12)}ДЗ: ${ref.hw.tasks.length}</span><span class="row" style="gap:4px">${icon('clock', 12)}${ref.duration} мин</span></div>
          </div>
          <span class="btn sm">Открыть урок ${icon('chev', 14)}</span>
        </a>` : ''}
        <div class="grid g5">${zones.map(([ic, bg, t, d, h]) => `<a class="card flat zone" href="${h}"><span class="block-ico" style="background:${bg}">${icon(ic, 18)}</span><b>${t}</b><span class="xs muted">${d}</span></a>`).join('')}</div>
        <div class="card">
          <div class="card-h"><h3>Что нужно сделать</h3><span class="chip">3</span></div>
          ${todo('send', '#70b7ff38', 'Запрос преподавателя', 'Анна К. просит доп. карточки к уроку 3 «Фрукты»', '#media')}
          ${todo('book', '#c9b4ff59', 'Черновик программы для 7–10 лет', '2 урока, нужно заполнить шаги и ДЗ', `#method/${S.methods[1] ? S.methods[1].id : ''}`)}
          ${todo('folder', '#c9ff4f66', 'Перенос медиа из Google Drive', `${nolic} ${plural(nolic, 'файл', 'файла', 'файлов')} без сведений о лицензии`, '#media')}
        </div>
        <div>
          <div class="row between" style="margin:12px 0 14px"><h2>Недавние уроки</h2><a class="btn sm" href="#methods">Все программы ${icon('chev', 14)}</a></div>
          <div class="grid g2">${recent.map(lessonCard).join('')}</div>
        </div>
      </div>
      <aside class="sticky stack">
        <button class="btn dark lg" style="width:100%" data-act="newMethod">${icon('plus', 17)}Создать курс</button>
        <div class="card">
          <div class="card-h"><h3>Статистика</h3><span class="xs muted">на сегодня</span></div>
          ${stat('book', 'Программы', S.methods.length, `${S.methods.filter((m) => m.status === 'published').length} опубликована`)}
          ${stat('list', 'Уроки', all.length, `${pub} опубликовано · ${all.length - pub} в работе`)}
          ${stat('layers', 'Шаги уроков', steps, 'из компонентов библиотеки')}
          ${stat('send', 'Задания ДЗ', tasks, `${S.templates.length} шаблонов`)}
          ${stat('folder', 'Материалы', S.media.length, nolic ? `${nolic} без лицензии` : 'лицензии заполнены')}
          ${stat('users', 'Возрастные сценарии', S.scenarios.length, S.scenarios.map((a) => a.age).join(' · '))}
          <div style="margin-top:14px"><div class="row between xs" style="margin-bottom:6px"><b>Готовность уроков</b><span class="muted">${Math.round((100 * pub) / Math.max(all.length, 1))}%</span></div><div class="meter"><i style="width:${(100 * pub) / Math.max(all.length, 1)}%"></i></div></div>
        </div>
      </aside>
    </div>`;
  }
  const todo = (ic, bg, t, d, href) => `<a class="todo" href="${href}"><span class="ico" style="background:${bg}">${icon(ic, 16)}</span><span class="grow"><b class="small">${esc(t)}</b><div class="xs muted">${esc(d)}</div></span><span class="muted">${icon('chev', 16)}</span></a>`;
  function lessonCard(L) {
    const m = methodOf(L.id);
    return `<a class="card flat method-card" href="#lesson/${L.id}/steps" style="padding:18px">
      <div class="row between"><span class="chip">Урок ${numOf(L)}</span>${statusChip(L.status)}</div>
      <div><h3>${esc(L.title)}</h3><div class="xs muted" style="margin-top:4px">${esc(m ? m.title : '')}</div></div>
      <div class="row xs muted" style="gap:12px"><span class="row" style="gap:4px">${icon('list', 13)}${L.steps.length} шагов</span><span class="row" style="gap:4px">${icon('send', 13)}${L.hw.tasks.length} в ДЗ</span><span class="row" style="gap:4px">${icon('clock', 13)}${L.duration} мин</span></div>
    </a>`;
  }

  // ---------------------------------------------------------------- Методики
  function vMethods() {
    const f = ui.methodsFilter;
    const list = S.methods.filter((m) => f === 'all' || (f === 'published' ? m.status === 'published' : m.status !== 'published'));
    return `
    <h1 style="margin:0 0 16px">Программы и методики</h1>
    <div class="row between wrap" style="margin-bottom:20px;gap:14px">
      <div class="seg">${[['all', 'Все'], ['published', 'Опубликованы'], ['draft', 'В работе']].map(([k, t]) => `<button class="${f === k ? 'on' : ''}" data-act="filterMethods" data-v="${k}">${t}</button>`).join('')}</div>
      <button class="btn dark" data-act="newMethod">${icon('plus', 15)}Создать курс</button>
    </div>
    <div class="grid g3">
      ${list.map(methodCard).join('')}
    </div>`;
  }
  function methodCard(m) {
    const ls = methodLessons(m);
    const glyph = { green: '世', purple: '学', blue: '考', pink: '新' }[m.accent] || '中';
    return `<a class="card method-card" href="#method/${m.id}">
      <div class="method-cover cover-${m.accent || 'green'}"><span class="glyph zh">${glyph}</span></div>
      <div><div class="row between"><span class="xs muted">${esc(m.age)}</span>${statusChip(m.status)}</div><h3 style="font-size:19px;margin-top:6px">${esc(m.title)}</h3><p class="small muted" style="margin:6px 0 0">${esc(m.description)}</p></div>
      <dl class="kv"><dt>Обновлена</dt><dd>${esc(m.updated)}</dd><dt>Версия</dt><dd>v${esc(m.version)}</dd><dt>Структура</dt><dd>${m.levels.length} ${plural(m.levels.length, 'уровень', 'уровня', 'уровней')}, ${ls.length} ${plural(ls.length, 'урок', 'урока', 'уроков')}</dd><dt>Назначена</dt><dd>${m.assigned.length ? `${m.assigned.length} ${plural(m.assigned.length, 'группа', 'группы', 'групп')}` : '—'}</dd></dl>
    </a>`;
  }

  // ---------------------------------------------------------------- Программа курса
  function vMethod(mid) {
    const m = S.methods.find((x) => x.id === mid);
    if (!m) return notFound();
    const ls = methodLessons(m);
    const modules = m.levels.reduce((a, v) => a + v.modules.length, 0);
    const steps = ls.reduce((a, l) => a + l.steps.length, 0);
    const tasks = ls.reduce((a, l) => a + l.hw.tasks.length, 0);
    let n = 0;
    return `
    ${crumbs([['Программы', '#methods'], [m.title]])}
    <div class="row between wrap" style="gap:16px;align-items:flex-start">
      <div class="grow" style="min-width:280px">
        <div class="row wrap" style="gap:6px;margin-bottom:8px"><span class="chip ${m.accent || 'green'}">${esc(m.segment)}</span><span class="chip">${esc(m.age)}</span>${statusChip(m.status)}<span class="chip">v${esc(m.version)}</span></div>
        <input class="input bare title" style="font-size:36px;font-weight:900;letter-spacing:-.03em" data-id="${m.id}" data-k="title" value="${esc(m.title)}">
      </div>
      <div class="row wrap">
        <button class="btn" data-act="teacherProgram" data-id="${m.id}">${icon('eye', 15)}Как видит преподаватель</button>
        <button class="btn" data-act="versions" data-id="${m.id}">${icon('history', 15)}Версии</button>
        <button class="btn" data-act="assign" data-id="${m.id}">${icon('assign', 15)}Назначить</button>
        <button class="btn dark" data-act="publish" data-id="${m.id}">${icon('send', 15)}Опубликовать v${nextVersion(m.version)}</button>
      </div>
    </div>
    <div class="grid g6" style="margin:18px 0 20px">
      ${[[m.levels.length, 'уровней'], [modules, 'модулей'], [ls.length, 'уроков'], [steps, 'шагов'], [tasks, 'заданий ДЗ'], [`${Math.round(ls.reduce((a, l) => a + (+l.duration || 0), 0) / 6) / 10} ч`, 'учебного времени']].map(([v, t]) => `<div class="stat" style="background:#ffffffb3"><b>${v}</b><span class="xs muted">${t}</span></div>`).join('')}
    </div>
    <div class="program">
      <div>
        <div class="row between" style="margin-bottom:12px"><h2>Программа курса</h2><span class="xs muted">${icon('grip', 12)} Перетаскивайте уроки между модулями</span></div>
        ${m.levels.map((v, vi) => `
          <div class="card level">
            <div class="level-h"><span class="level-num">${vi + 1}</span><input class="input bare grow" style="font-weight:800;font-size:17px" data-id="${v.id}" data-k="title" value="${esc(v.title)}">
              <button class="btn icon ghost" data-act="move" data-id="${v.id}" data-dir="-1" title="Выше">${icon('up', 15)}</button><button class="btn icon ghost" data-act="move" data-id="${v.id}" data-dir="1" title="Ниже">${icon('down', 15)}</button><button class="btn icon ghost danger" data-act="confirmDel" data-id="${v.id}" data-what="уровень" title="Удалить">${icon('trash', 15)}</button></div>
            ${v.modules.map((d) => `
              <div class="module">
                <div class="module-h">${icon('folder', 15)}<input class="input bare grow" style="font-weight:700" data-id="${d.id}" data-k="title" value="${esc(d.title)}"><span class="xs muted">${d.lessons.length} ${plural(d.lessons.length, 'урок', 'урока', 'уроков')}</span><button class="btn icon ghost danger" data-act="confirmDel" data-id="${d.id}" data-what="модуль" title="Удалить модуль">${icon('trash', 14)}</button></div>
                ${d.lessons.map((lid) => { const L = S.lessons[lid]; if (!L) return ''; n += 1; return lessonRow(L, n, d.id); }).join('')}
                <div class="drop-zone" data-drop="lesson" data-mod="${d.id}" data-before="">${d.lessons.length ? '' : '<div class="empty">Перетащите урок сюда или создайте новый</div>'}</div>
                <div class="add-line"><button class="btn sm" data-act="newLesson" data-mod="${d.id}">${icon('plus', 14)}Урок</button></div>
              </div>`).join('')}
            <div class="add-line"><button class="btn sm ghost" data-act="addModule" data-id="${v.id}">${icon('plus', 14)}Модуль</button></div>
          </div>`).join('')}
        <button class="btn" style="margin-top:16px" data-act="addLevel" data-id="${m.id}">${icon('plus', 15)}Добавить уровень</button>
      </div>
      <aside class="side sticky">
        <div class="card">
          <div class="card-h"><h3>Паспорт программы</h3>${icon('sliders', 16)}</div>
          <div class="stack">
            <div class="cover-pick cover-${m.accent || 'green'}"><span class="zh">${esc(m.zh || '世')}</span><button class="btn xs" data-act="fakeUpload" data-what="обложку программы">${icon('image', 12)}Обложка</button></div>
            <label class="field"><span>Название на китайском</span><input class="input zh" data-id="${m.id}" data-k="zh" value="${esc(m.zh || '')}" placeholder="我周围的世界"></label>
            <label class="field"><span>Цели обучения · планируемый результат</span><textarea class="textarea" style="min-height:70px" data-id="${m.id}" data-k="goals">${esc(m.goals || '')}</textarea></label>
            <div class="grid g2"><label class="field"><span>Длительность урока, мин</span><input class="input" type="number" min="10" data-type="num" data-id="${m.id}" data-k="lessonMin" value="${m.lessonMin || 45}"></label><label class="field"><span>Размер группы</span><input class="input" data-id="${m.id}" data-k="group" value="${esc(m.group || '')}" placeholder="4–6 детей, до 8"></label></div>
            ${sel(m, 'segment', 'Сегмент', SEGMENTS)}
            <label class="field"><span>Возрастной сценарий</span><select class="select" data-id="${m.id}" data-k="scenario" data-rerender="1">${S.scenarios.map((a) => `<option value="${a.id}" ${m.scenario === a.id ? 'selected' : ''}>${esc(a.title)} · ${esc(a.age)}</option>`).join('')}</select></label>
            <a class="xs" href="#scenarios/${m.scenario || ''}"><u>Открыть настройки сценария</u></a>
            <label class="field"><span>Формат</span><input class="input" data-id="${m.id}" data-k="format" value="${esc(m.format)}"></label>
            <label class="field"><span>Описание</span><textarea class="textarea" data-id="${m.id}" data-k="description">${esc(m.description)}</textarea></label>
            <div class="hint-box">${icon('sparkle', 16)}<span>Возрастной сценарий определяет интерфейс ученика, модель прогресса (мягкая / оценки) и режим ИИ.</span></div>
          </div>
        </div>
        <div class="card">
          <div class="card-h"><h3>Описание для преподавателя</h3><button class="btn xs" data-act="teacherProgram" data-id="${m.id}">${icon('eye', 12)}Как видит</button></div>
          <div class="stack-s">${TEACHER_INFO.map(([k, t]) => `<details class="tv-acc"><summary>${t}</summary><textarea class="textarea" style="min-height:70px;margin-top:8px" data-ti="${m.id}" data-k="${k}">${esc((m.teacherInfo || {})[k] || '')}</textarea></details>`).join('')}</div>
        </div>
        <div class="card">
          <div class="card-h"><h3>Назначена</h3><button class="btn xs" data-act="assign" data-id="${m.id}">Изменить</button></div>
          ${m.assigned.length ? `<div class="stack-s">${S.orgs.map((o) => { const gs = o.groups.filter((g) => m.assigned.includes(g.id)); if (!gs.length && !m.assigned.includes(o.id)) return ''; return `<div class="small"><b>${esc(o.title)}</b><div class="xs muted">${gs.map((g) => esc(g.title)).join(' · ') || 'вся организация'}</div></div>`; }).join('')}</div>` : '<div class="empty">Не назначена. Опубликуйте и назначьте организациям или группам.</div>'}
        </div>
        <div class="card">
          <div class="card-h"><h3>История версий</h3><button class="btn xs" data-act="versions" data-id="${m.id}">Все</button></div>
          ${m.history.slice(0, 3).map((h) => `<div class="history-item"><span class="ver">v${esc(h.v)}</span><div><div>${esc(h.note)}</div><div class="xs muted">${esc(h.date)} · ${esc(h.who)} · ${STATUS[h.status]}</div></div></div>`).join('')}
        </div>
      </aside>
    </div>`;
  }
  const TEACHER_INFO = [['approach', 'Подход к обучению'], ['structure', 'Устройство занятия'], ['prep', 'Подготовка учителя'], ['principles', 'Педагогические принципы'], ['results', 'Ожидаемые результаты'], ['safety', 'Требования безопасности']];
  const sel = (o, k, label, opts, extra = '') => `<label class="field"><span>${label}</span><select class="select" data-id="${o.id}" data-k="${k}" ${extra}>${opts.map((x) => `<option ${o[k] === x ? 'selected' : ''}>${esc(x)}</option>`).join('')}</select></label>`;

  function lessonRow(L, n, mod) {
    const mins = stepMin(L);
    return `<div class="lesson-row" draggable="true" data-drag="lesson" data-drag-id="${L.id}" data-drop="lesson" data-mod="${mod}" data-before="${L.id}" data-act="openLesson" data-id="${L.id}">
      <span class="handle">${icon('grip', 14)}</span>
      <span class="num ${L.reference ? 'cover-green' : ''}">${n}</span>
      <div style="min-width:0"><div class="row" style="gap:8px"><b style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(L.title)}</b>${L.reference ? '<span class="chip green xs">эталон</span>' : ''}</div>
        <div class="meta"><span>${icon('list', 12)}${L.steps.length} ${plural(L.steps.length, 'шаг', 'шага', 'шагов')}</span><span>${icon('send', 12)}ДЗ: ${L.hw.tasks.length}</span><span>${icon('clock', 12)}${mins}/${L.duration} мин</span><span>${icon('book', 12)}${L.vocab.filter((w) => w.kind !== 'phrase').length} слов · ${L.vocab.filter((w) => w.kind === 'phrase').length} фраз</span></div></div>
      ${statusChip(L.status)}
      <div class="row row-actions" style="gap:2px"><button class="btn icon ghost" data-act="dupLesson" data-id="${L.id}" title="Дублировать">${icon('copy', 14)}</button><button class="btn icon ghost danger" data-act="confirmDel" data-id="${L.id}" data-what="урок" title="Удалить">${icon('trash', 14)}</button></div>
    </div>`;
  }

  // ---------------------------------------------------------------- Урок
  function vLesson(lid, tab) {
    const L = S.lessons[lid];
    if (!L) return notFound();
    ui.lid = lid;
    const m = methodOf(lid);
    const n = numOf(L);
    if (!L.steps.some((s) => s.id === ui.stepId)) { ui.stepId = L.steps[0] ? L.steps[0].id : null; ui.blockId = null; }
    if (ui.taskId !== 'settings' && !L.hw.tasks.some((t) => t.id === ui.taskId)) ui.taskId = L.hw.tasks[0] ? L.hw.tasks[0].id : 'settings';
    if (ui.duoLesson !== lid) { ui.duoLesson = lid; ui.duoStep = 0; ui.liveStep = 0; ui.paused = false; ui.revealN = 1; ui.kid = {}; }
    if (!L.materials) L.materials = { presentation: { title: `Презентация урока ${n}`, slides: 0, formats: 'PPTX, PDF' }, cards: [], files: [] };
    if (tab === 'show') { ui.pv = 'duo'; tab = 'preview'; }
    const tabs = [['passport', 'Паспорт урока', 'sliders'], ['steps', 'Шаги урока', 'list', L.steps.length], ['materials', 'Материалы урока', 'folder', L.materials.cards.length + L.materials.files.length + (L.materials.presentation.slides ? 1 : 0)], ['hw', 'Домашнее задание', 'send', L.hw.tasks.length], ['parent', 'Для родителя', 'heart'], ['preview', 'Предпросмотр', 'eye']];
    const body = { passport: tPassport, steps: tSteps, materials: tMaterials, hw: tHomework, parent: tParent, preview: tPreview }[tab] || tSteps;
    return `
    ${crumbs([['Программы', '#methods'], m ? [m.title, `#method/${m.id}`] : ['—'], [`Урок ${n}`]])}
    <div class="lesson-head">
      <div class="row" style="gap:16px;align-items:flex-start;min-width:0;flex:1">
        <span class="num-big">${n}</span>
        <div class="grow">
          <div class="row wrap" style="gap:6px">${statusChip(L.status)}<span class="chip">v${esc(L.version)}</span><span class="chip blue">${esc(L.age)}</span><span class="chip">${icon('clock', 12)}${L.duration} мин</span>${L.reference ? '<span class="chip green">Эталонный урок</span>' : ''}</div>
          <input class="input bare title" style="font-size:32px;margin-top:6px" data-id="${L.id}" data-k="title" value="${esc(L.title)}">
          <div class="small muted" style="margin-top:2px">${esc(moduleOf(lid) ? moduleOf(lid).title : '')}</div>
        </div>
      </div>
      <div class="row wrap">
        <a class="btn" href="#lesson/${L.id}/preview">${icon('eye', 15)}Предпросмотр</a>
        <button class="btn" data-act="saveVersion" data-id="${L.id}">${icon('save', 15)}Сохранить версию</button>
        ${L.status === 'published' ? `<button class="btn lime" data-act="toReview" data-id="${L.id}">${icon('check', 15)}Опубликован</button>` : `<button class="btn dark" data-act="toReview" data-id="${L.id}">${icon('send', 15)}${L.status === 'review' ? 'Опубликовать урок' : 'Отправить на проверку'}</button>`}
      </div>
    </div>
    ${L.reference ? `<div class="ref-banner">${icon('flag', 18)}<span><b>Эталон приёмки конструктора.</b> Урок № ${n} «${esc(L.title)}»: ${L.steps.length} шагов собраны только из компонентов библиотеки, без вёрстки. Проверьте его в предпросмотре: кабинет преподавателя и двухэкранный режим.</span></div>` : ''}
    <div class="tabs">${tabs.map(([k, t, ic, c]) => `<a class="tab ${tab === k ? 'on' : ''}" href="#lesson/${L.id}/${k}">${icon(ic, 15)}${t}${c != null ? `<span class="count">${c}</span>` : ''}</a>`).join('')}</div>
    ${body(L)}`;
  }

  // --- Паспорт урока
  function tPassport(L) {
    return `<div class="grid g2" style="align-items:start">
      <div class="card stack">
        <h3>Основное</h3>
        <div class="grid" style="grid-template-columns:90px 1fr 1fr"><label class="field"><span>Номер</span><input class="input" value="${numOf(L)}" disabled title="Порядок задаётся в программе курса"></label><label class="field"><span>Название</span><input class="input" data-id="${L.id}" data-k="title" value="${esc(L.title)}"></label><label class="field"><span>Тема</span><input class="input" data-id="${L.id}" data-k="topic" value="${esc(L.topic || '')}"></label></div>
        <label class="field"><span>Образовательная цель</span><textarea class="textarea" style="min-height:60px" data-id="${L.id}" data-k="goal">${esc(L.goal)}</textarea></label>
        <label class="field"><span>Планируемый результат занятия</span><textarea class="textarea" style="min-height:60px" data-id="${L.id}" data-k="result">${esc(L.result || '')}</textarea></label>
        <label class="field"><span>Об уроке <span class="muted" style="font-weight:500">— видит преподаватель в начале плана</span></span><textarea class="textarea" style="min-height:70px" data-id="${L.id}" data-k="about">${esc(L.about || '')}</textarea></label>
        <label class="field"><span>Подготовка преподавателя</span><textarea class="textarea" style="min-height:60px" data-id="${L.id}" data-k="prep" placeholder="Что распечатать, проверить и подготовить до занятия">${esc(L.prep || '')}</textarea></label>
        <div class="grid g3">
          ${sel(L, 'age', 'Возраст', AGES)}
          ${sel(L, 'difficulty', 'Сложность', DIFF)}
          <label class="field"><span>Длительность, мин</span><input class="input" type="number" min="5" data-type="num" data-id="${L.id}" data-k="duration" value="${L.duration}"></label>
        </div>
        <div class="field"><span>Форматы проведения</span><div class="props">${Object.entries(FORMATS).map(([k, t]) => `<span class="prop ${L.formats.includes(k) ? 'on' : ''}" data-act="toggleFormat" data-k="${k}">${t}</span>`).join('')}</div></div>
        <div class="field"><span>Модель прогресса</span><div class="seg">${[['soft', 'Мягкая (4–6 лет)'], ['grades', 'Оценки учителя']].map(([k, t]) => `<button class="${L.assessment === k ? 'on' : ''}" data-act="setField" data-id="${L.id}" data-k="assessment" data-v="${k}">${t}</button>`).join('')}</div>
          <div class="xs muted" style="margin-top:6px">${L.assessment === 'soft' ? '«Знакомимся с темой» · «Получается» · «Уверенно используем» · «Стоит немного повторить»' : 'Преподаватель выставляет оценки по заданиям и уроку'}</div></div>
      </div>
      <div class="stack">
        <div class="card">
          <div class="card-h"><h3>Новые слова и фразы</h3><span class="xs muted">${L.vocab.filter((w) => w.kind !== 'phrase').length} слов · ${L.vocab.filter((w) => w.kind === 'phrase').length} фраз</span></div>
          <div class="vocab-row xs muted" style="font-weight:700;margin-bottom:6px"><span>Китайский</span><span>Пиньинь</span><span class="vr-ru">Перевод</span><span>Тип</span><span>Аудио</span><span></span></div>
          ${L.vocab.map((w) => `<div class="vocab-row"><input class="input zh" style="font-size:16px;font-weight:700" data-id="${w.id}" data-k="zh" value="${esc(w.zh)}"><input class="input" data-id="${w.id}" data-k="py" value="${esc(w.py)}"><input class="input vr-ru" data-id="${w.id}" data-k="ru" value="${esc(w.ru)}"><button class="chip ${w.kind === 'phrase' ? 'purple' : ''}" style="border:0;cursor:pointer" data-act="toggleKind" data-id="${w.id}" title="Переключить: слово / фраза">${w.kind === 'phrase' ? 'фраза' : 'слово'}</button><button class="audio-dot" data-act="fakeUpload" data-what="аудио носителя" title="Аудио носителя">${icon(w.audio ? 'headphones' : 'upload', 14)}</button><button class="btn icon ghost danger" data-act="del" data-id="${w.id}">${icon('trash', 14)}</button></div>`).join('')}
          <div class="row" style="margin-top:10px"><button class="btn sm" data-act="addVocab" data-k="word">${icon('plus', 14)}Слово</button><button class="btn sm" data-act="addVocab" data-k="phrase">${icon('plus', 14)}Фраза</button><button class="btn sm ghost" data-act="fakeUpload" data-what="CSV/XLSX со словами">${icon('upload', 14)}Импорт CSV / XLSX</button></div>
        </div>
        <div class="card">
          <div class="card-h"><h3>Реквизит</h3><span class="xs muted">чек-лист для преподавателя</span></div>
          <div class="props">${L.props.map((p, i) => `<span class="prop">${esc(p)} <span data-act="delProp" data-i="${i}" style="opacity:.5;margin-left:4px">✕</span></span>`).join('')}</div>
          <div class="row" style="margin-top:10px"><input class="input" id="newProp" placeholder="Например: мягкие игрушки, приложение 3"><button class="btn sm" data-act="addProp">${icon('plus', 14)}</button></div>
        </div>
        <div class="card">
          <div class="card-h"><h3>Правила оценки и ИИ</h3><span class="chip purple">ИИ · Этап 2</span></div>
          <label class="field"><span>Правила оценки урока</span><textarea class="textarea" data-id="${L.id}" data-k="rules" placeholder="Например: урок засчитан, если ребёнок назвал 4 из 6 цветов">${esc(L.rules || '')}</textarea></label>
          <label class="field" style="margin-top:10px"><span>Сценарий ИИ-помощи (подсказки для преподавателя)</span><textarea class="textarea" data-id="${L.id}" data-k="ai" placeholder="Что ИИ-ассистент может предложить преподавателю после урока">${esc(L.ai || '')}</textarea></label>
        </div>
      </div>
    </div>`;
  }

  // --- Шаги урока
  function tSteps(L) {
    const s = idx[ui.stepId];
    return `<div class="builder">
      <div class="card sticky" style="padding:16px">
        <div data-region="steps">${stepsListInner(L)}</div>
        <button class="btn sm" style="width:100%;margin-top:10px" data-act="addStep">${icon('plus', 14)}Добавить шаг</button>
        <div class="hint-box" style="margin-top:12px">${icon('sparkle', 16)}<span>Нумерация шагов одинакова для преподавателя и ученика. Перетаскивайте, чтобы поменять порядок.</span></div>
      </div>
      <div>${s ? stepEditor(L, s) : `<div class="card"><div class="empty">В уроке пока нет шагов. Нажмите «Добавить шаг».</div></div>`}</div>
      <div class="preview-col sticky">
        <div class="row between" style="margin-bottom:10px"><span class="eyebrow">Экран ученика</span><a class="btn xs" href="#lesson/${L.id}/preview">${icon('eye', 13)}Предпросмотр</a></div>
        <div data-region="student">${previewInner(L)}</div>
      </div>
    </div>`;
  }
  function stepsListInner(L) {
    const total = stepMin(L);
    const over = total > L.duration;
    const colors = ['#c9ff4f', '#c9b4ff', '#70b7ff', '#ffb6e8', '#ffd23f'];
    return `<div class="row between" style="margin-bottom:8px"><h3>Шаги урока</h3><span class="xs ${over ? '' : 'muted'}" style="${over ? 'color:var(--danger);font-weight:700' : ''}">${total} / ${L.duration} мин</span></div>
      <div class="time-bar" style="margin-bottom:12px">${L.steps.map((s, i) => `<i style="width:${(100 * (+s.duration || 0)) / Math.max(total, L.duration)}%;background:${colors[i % colors.length]}" title="${esc(s.title)}"></i>`).join('')}</div>
      <div class="steps-list">
        ${L.steps.map((s, i) => `<div class="step-item ${s.id === ui.stepId ? 'on' : ''}" draggable="true" data-drag="step" data-drag-id="${s.id}" data-drop="step" data-before="${s.id}" data-act="selStep" data-id="${s.id}">
          <span class="step-n">${i + 1}</span>
          <div style="min-width:0"><div class="step-title">${esc(s.title) || '<span class="muted">Без названия</span>'}</div><div class="step-sub"><span>${s.duration || 0} мин</span><span>·</span><span>${actOf(s.activity)[0]} · ${s.blocks.length} ${plural(s.blocks.length, 'блок', 'блока', 'блоков')}</span></div></div>
          <span class="handle">${icon('grip', 13)}</span>
        </div>`).join('')}
        <div class="drop-zone" data-drop="step" data-before=""></div>
      </div>`;
  }
  function stepEditor(L, s) {
    const n = L.steps.indexOf(s) + 1;
    return `<div class="card">
      <div class="row" style="gap:8px"><span class="chip dark">Шаг ${n}</span><input class="input bare title grow" data-id="${s.id}" data-k="title" data-live="steps,student" value="${esc(s.title)}" placeholder="Название шага">
        <button class="btn icon ghost" data-act="move" data-id="${s.id}" data-dir="-1" title="Выше">${icon('up', 15)}</button><button class="btn icon ghost" data-act="move" data-id="${s.id}" data-dir="1" title="Ниже">${icon('down', 15)}</button><button class="btn icon ghost" data-act="dupStep" data-id="${s.id}" title="Дублировать">${icon('copy', 15)}</button><button class="btn icon ghost danger" data-act="confirmDel" data-id="${s.id}" data-what="шаг" title="Удалить">${icon('trash', 15)}</button></div>
      <div class="grid step-meta" style="margin-top:12px">
        <label class="field"><span>Цель шага</span><input class="input" data-id="${s.id}" data-k="goal" value="${esc(s.goal)}"></label>
        <label class="field"><span>Тип активности</span><select class="select" data-id="${s.id}" data-k="activity" data-live="steps">${Object.entries(ACT).map(([k, [t]]) => `<option value="${k}" ${s.activity === k ? 'selected' : ''}>${t}</option>`).join('')}</select></label>
        <label class="field"><span>Длительность, мин</span><input class="input" type="number" min="1" data-type="num" data-id="${s.id}" data-k="duration" data-live="steps" value="${s.duration}"></label>
      </div>
      <div class="panel-switch"><div class="seg">
        <button class="${ui.stepView === 'teacher' ? 'on' : ''}" data-act="stepView" data-v="teacher">${icon('tablet', 14)}Инструкция учителю</button>
        <button class="${ui.stepView === 'student' ? 'on' : ''}" data-act="stepView" data-v="student">${icon('monitor', 14)}Содержание для учеников · ${s.blocks.length}</button>
      </div></div>
      ${ui.stepView === 'teacher' ? teacherEditor(L, s) : studentEditor(s)}
    </div>`;
  }
  function teacherEditor(L, s) {
    return `<div class="view-card teacher stack">
      <div class="row between"><span class="eyebrow">Видит только преподаватель</span><span class="chip yellow">${icon('eye', 12)}не выводится ученику</span></div>
      <label class="field"><span>Инструкция учителю</span><textarea class="textarea" style="min-height:110px" data-id="${s.id}" data-k="script" placeholder="Что объяснить и какие действия выполнить">${esc(s.script)}</textarea></label>
      <div class="field"><span>Слова и фразы шага <span class="muted" style="font-weight:500">— из паспорта урока</span></span><div class="props">${L.vocab.map((w) => `<span class="prop zh ${(s.words || []).includes(w.zh) ? 'on' : ''}" data-act="toggleStepWord" data-w="${esc(w.zh)}">${esc(w.zh)}</span>`).join('') || '<span class="xs muted">Добавьте слова в паспорте урока</span>'}</div></div>
      <div class="field"><span>Материалы шага</span><div class="props">${matNames(L).map((x) => `<span class="prop ${(s.mats || []).includes(x) ? 'on' : ''}" data-act="toggleStepMat" data-m="${esc(x)}">${esc(x)}</span>`).join('')}</div></div>
      <div class="field"><span>Методический блок <span class="muted" style="font-weight:500">— например «Механика игры», «Действие», «Два прохода с карточками»</span></span>
        <div class="tbox-edit"><input class="input" placeholder="Заголовок блока" data-tb="${s.id}" data-f="title" value="${esc((s.tbox || {}).title || '')}"><textarea class="textarea" style="min-height:70px" placeholder="Каждый пункт с новой строки" data-tb="${s.id}" data-f="items">${esc((s.tbox || {}).items || '')}</textarea></div></div>
      <div class="field"><span>Фразы преподавателя</span>
        ${s.phrases.map((f) => `<div class="phrase-row"><input class="input zh" placeholder="汉字" data-id="${f.id}" data-k="zh" value="${esc(f.zh)}"><input class="input" placeholder="pīnyīn" data-id="${f.id}" data-k="py" value="${esc(f.py)}"><input class="input" placeholder="перевод" data-id="${f.id}" data-k="ru" value="${esc(f.ru)}"><button class="btn icon ghost danger" data-act="del" data-id="${f.id}">${icon('trash', 14)}</button></div>`).join('')}
        <button class="btn sm" style="margin-top:8px" data-act="addPhrase" data-id="${s.id}">${icon('plus', 14)}Фраза</button></div>
      <label class="field"><span>Ожидаемые ответы детей</span><textarea class="textarea" style="min-height:60px" data-id="${s.id}" data-k="answers">${esc(s.answers)}</textarea></label>
      <div class="field"><span>Реквизит шага <span class="muted" style="font-weight:500">— из паспорта урока</span></span><div class="props">${L.props.map((p) => `<span class="prop ${s.props.includes(p) ? 'on' : ''}" data-act="toggleStepProp" data-p="${esc(p)}">${esc(p)}</span>`).join('')}</div></div>
      <label class="field"><span>Заметки преподавателю</span><textarea class="textarea" style="min-height:60px" data-id="${s.id}" data-k="notes">${esc(s.notes)}</textarea></label>
    </div>`;
  }
  function studentEditor(s) {
    return `<div class="view-card student">
      <div class="row between" style="margin-bottom:12px"><span class="eyebrow">Что будет показано детям</span><span class="xs muted">Каждый блок работает в уроке, повторении и ДЗ</span></div>
      ${s.blocks.length ? s.blocks.map((b) => blockEditor(b)).join('') : '<div class="empty">Добавьте компонент из библиотеки ниже</div>'}
      <div class="divider"></div>
      ${[[true, 'Базовые блоки'], [false, 'Расширенные блоки · после MVP']].map(([mvp, title]) => `<div class="eyebrow" style="margin:10px 0">${title}</div>
      <div class="palette">${Object.entries(COMP).filter(([, c]) => !!c.mvp === mvp).map(([k, c]) => `<button class="pal-item" data-act="addBlock" data-type="${k}"><span class="block-ico" style="background:${c.color}">${icon(c.icon, 15)}</span><b>${c.label}</b><small>${c.desc}</small></button>`).join('')}</div>`).join('')}
    </div>`;
  }
  function blockEditor(b) {
    const c = COMP[b.type];
    return `<div class="block ${ui.blockId === b.id ? 'sel' : ''}">
      <div class="block-h" data-act="selBlock" data-id="${b.id}"><span class="block-ico" style="background:${c.color}">${icon(c.icon, 15)}</span><div class="grow"><b class="small">${c.label}</b></div>
        <button class="btn icon ghost" data-act="move" data-id="${b.id}" data-dir="-1">${icon('up', 14)}</button><button class="btn icon ghost" data-act="move" data-id="${b.id}" data-dir="1">${icon('down', 14)}</button><button class="btn icon ghost danger" data-act="del" data-id="${b.id}">${icon('trash', 14)}</button></div>
      <div class="block-b">${blockFields(b)}
        <div class="row between wrap" style="margin-top:12px;gap:8px"><span class="xs muted">Где показывать:</span><div class="ctx">${Object.entries(CTX).map(([k, t]) => `<span class="ctxb chip ${b.ctx.includes(k) ? 'blue' : ''}" style="cursor:pointer" data-act="toggleCtx" data-id="${b.id}" data-c="${k}">${b.ctx.includes(k) ? icon('check', 11) : ''}${t}</span>`).join('')}</div></div>
      </div>
    </div>`;
  }
  const inp = (o, k, ph, live = 'student', cls = '') => `<input class="input ${cls}" placeholder="${esc(ph)}" data-id="${o.id}" data-k="${k}" data-live="${live}" value="${esc(o[k])}">`;
  function rows(b, arr, cols) {
    return `<table class="mini-table">${b[arr].map((it) => `<tr>${cols.map((c) => {
      if (c.type === 'color') return `<td style="width:42px"><input type="color" style="width:38px;height:34px;border:0;background:none;padding:0;cursor:pointer" data-id="${it.id}" data-k="${c.k}" data-live="student" value="${esc(it[c.k] || '#ffffff')}"></td>`;
      if (c.type === 'who') return `<td style="width:84px"><select class="select zh" data-id="${it.id}" data-k="who" data-live="student">${['小龙', '小妹'].map((x) => `<option ${it.who === x ? 'selected' : ''}>${x}</option>`).join('')}</select></td>`;
      return `<td style="${c.w ? `width:${c.w}` : ''}">${inp(it, c.k, c.ph, 'student', c.zh ? 'zh' : '')}</td>`;
    }).join('')}<td style="width:34px"><button class="btn icon ghost danger" data-act="del" data-id="${it.id}" data-live="student">${icon('trash', 13)}</button></td></tr>`).join('')}</table>
      <button class="btn xs" data-act="addItem" data-id="${b.id}" data-arr="${arr}">${icon('plus', 12)}Добавить</button>`;
  }
  function blockFields(b) {
    if (b.type === 'cards') {
      const L = curLesson(); const all = L && L.materials ? L.materials.cards : [];
      return `<div class="row wrap" style="margin-bottom:10px;gap:10px"><div class="seg">${[['grid', 'Сетка'], ['carousel', 'Карусель'], ['pick', 'Нажми карточку']].map(([k, t]) => `<button class="${b.mode === k ? 'on' : ''}" data-act="setField" data-id="${b.id}" data-k="mode" data-v="${k}">${t}</button>`).join('')}</div></div>
        <label class="field"><span>Подпись / задание</span>${inp(b, 'task', 'Например: нажми животное, которое назвал учитель')}</label>
        <div class="field" style="margin-top:10px"><span>Карточки из набора урока <span class="muted" style="font-weight:500">— набор редактируется во вкладке «Материалы урока»</span></span><div class="props">${all.map((c) => `<span class="prop ${b.cards.includes(c.zh) ? 'on' : ''}" data-act="toggleBlockCard" data-id="${b.id}" data-z="${esc(c.zh)}">${esc(c.pic && !String(c.pic).startsWith('#') ? c.pic : '■')} <span class="zh">${esc(c.zh)}</span></span>`).join('') || '<span class="xs muted">В уроке ещё нет карточек</span>'}</div></div>`;
    }
    if (b.type === 'slides') {
      const L = curLesson(); const pr = L && L.materials ? L.materials.presentation : { slides: 0 };
      return `<div class="grid" style="grid-template-columns:100px 100px 1fr"><label class="field"><span>Слайд с</span><input class="input" type="number" min="1" data-type="num" data-id="${b.id}" data-k="from" data-live="student" value="${b.from}"></label><label class="field"><span>по</span><input class="input" type="number" min="1" data-type="num" data-id="${b.id}" data-k="to" data-live="student" value="${b.to}"></label><label class="field"><span>Подпись</span>${inp(b, 'note', 'Что на слайдах')}</label></div><div class="xs muted" style="margin-top:6px">Из «${esc(pr.title || 'Презентация урока')}» · ${pr.slides} слайдов</div>`;
    }
    if (b.type === 'choice') {
      return `<label class="field"><span>Вопрос</span>${inp(b, 'question', 'Вопрос')}</label><div class="field" style="margin-top:10px"><span>Варианты — отметьте правильный (виден только преподавателю)</span>${b.options.map((o) => `<div class="opt-row"><span class="radio-dot ${o.correct ? 'on' : ''}" data-act="setBlockCorrect" data-b="${b.id}" data-id="${o.id}">${o.correct ? icon('check', 12) : ''}</span>${inp(o, 'text', 'Вариант', 'student', 'zh')}<button class="btn icon ghost danger" data-act="del" data-id="${o.id}">${icon('trash', 13)}</button></div>`).join('')}<button class="btn xs" style="margin-top:6px" data-act="addBlockOpt" data-id="${b.id}">${icon('plus', 12)}Вариант</button></div>`;
    }
    const W = [{ k: 'zh', ph: '汉字', zh: true }, { k: 'py', ph: 'pīnyīn' }, { k: 'ru', ph: 'перевод' }, { k: 'color', type: 'color' }];
    if (b.type === 'scene') return `<label class="field"><span>Название сцены</span>${inp(b, 'title', 'Сцена')}</label><div class="field" style="margin-top:10px"><span>Реплики героев (с аудио)</span>${rows(b, 'lines', [{ k: 'who', type: 'who' }, { k: 'zh', ph: '汉字', zh: true }, { k: 'py', ph: 'pīnyīn' }, { k: 'ru', ph: 'перевод' }])}</div><button class="btn xs ghost" style="margin-top:6px" data-act="fakeUpload" data-what="анимацию Rive / Lottie">${icon('upload', 12)}Анимация Rive / Lottie</button>`;
    if (b.type === 'media') return `<div class="row wrap" style="margin-bottom:10px"><div class="seg">${[['video', 'Видео'], ['audio', 'Аудио'], ['song', 'Песня']].map(([k, t]) => `<button class="${b.kind === k ? 'on' : ''}" data-act="setField" data-id="${b.id}" data-k="kind" data-v="${k}">${t}</button>`).join('')}</div></div>
      <div class="grid" style="grid-template-columns:1fr 100px"><label class="field"><span>Название</span>${inp(b, 'title', 'Название')}</label><label class="field"><span>Длительность</span>${inp(b, 'duration', '0:00')}</label></div>
      <div class="row" style="margin-top:10px"><button class="btn sm" data-act="fakeUpload" data-what="медиафайл">${icon('upload', 14)}Загрузить файл</button><button class="btn sm ghost" data-act="pickMedia">${icon('folder', 14)}Из медиатеки</button></div>`;
    if (b.type === 'text') return `${rows(b, 'items', W)}<label class="check" style="margin-top:10px"><span class="switch"><input type="checkbox" data-id="${b.id}" data-k="showTranslation" data-live="student" ${b.showTranslation ? 'checked' : ''}><i></i></span><span class="small">Перевод виден ученику сразу <span class="muted">(иначе выводит преподаватель)</span></span></label>`;
    if (b.type === 'reveal') return `<div class="xs muted" style="margin-bottom:6px">Элементы открываются по одному кнопкой «Показать следующий» на планшете преподавателя</div>${rows(b, 'items', W)}`;
    if (b.type === 'drag') return `<div class="grid" style="grid-template-columns:170px 1fr;margin-bottom:10px"><label class="field"><span>Режим</span><select class="select" data-id="${b.id}" data-k="mode" data-live="student">${[['pairs', 'Составление пар'], ['target', 'К цели'], ['sort', 'Сортировка']].map(([k, t]) => `<option value="${k}" ${b.mode === k ? 'selected' : ''}>${t}</option>`).join('')}</select></label><label class="field"><span>Задание</span>${inp(b, 'task', 'Что сделать')}</label></div>
      ${rows(b, 'pairs', [{ k: 'left', ph: 'Элемент', zh: true }, { k: 'right', ph: 'Цель / эмодзи', w: '90px' }, { k: 'color', type: 'color' }])}`;
    if (b.type === 'static') return `<div class="grid g2"><label class="field"><span>Заголовок</span>${inp(b, 'title', 'Заголовок')}</label><label class="field"><span>Подпись</span>${inp(b, 'caption', 'Подпись')}</label></div>
      <div class="field" style="margin-top:10px"><span>Цветовые плашки</span><div class="row wrap">${b.swatches.map((c, i) => `<span class="row" style="gap:2px"><input type="color" style="width:34px;height:34px;border:0;padding:0;background:none" data-sw="${b.id}" data-i="${i}" value="${esc(c)}"><button class="btn icon ghost" style="width:22px" data-act="delSwatch" data-id="${b.id}" data-i="${i}">${icon('x', 12)}</button></span>`).join('')}<button class="btn xs" data-act="addSwatch" data-id="${b.id}">${icon('plus', 12)}</button></div></div>
      <button class="btn sm" style="margin-top:10px" data-act="fakeUpload" data-what="изображение сцены">${icon('image', 14)}Загрузить изображение</button>`;
    if (b.type === 'print') return `<div class="grid g2"><label class="field"><span>Название</span>${inp(b, 'title', 'Название')}</label><label class="field"><span>Формат печати</span>${inp(b, 'note', 'A4')}</label></div><button class="btn sm" style="margin-top:10px" data-act="fakeUpload" data-what="PDF для печати">${icon('upload', 14)}Загрузить PDF</button>`;
    return '';
  }

  function previewInner(L) {
    const s = idx[ui.stepId];
    if (!s) return '<div class="empty">Нет шага</div>';
    return `<div class="screen-frame"><div class="bezel-top"><span>Проектор · 16:10</span><span>● трансляция</span></div>${studentScreen(L, s, {})}</div>
      <div class="screen-note">${icon('eye', 14)}<span>Сценарий, ответы, переводы и заметки преподавателя на экран ученика не выводятся.</span></div>
      <div class="card soft" style="margin-top:12px;padding:14px">
        <div class="eyebrow" style="margin-bottom:8px">План преподавателя · кратко</div>
        <div class="small" style="white-space:pre-wrap">${esc(s.script) || '<span class="muted">Сценарий не заполнен</span>'}</div>
        ${s.props.length ? `<div class="props" style="margin-top:8px">${s.props.map((p) => `<span class="prop">${esc(p)}</span>`).join('')}</div>` : ''}
      </div>`;
  }

  function studentScreen(L, s, o) {
    const n = L.steps.indexOf(s) + 1;
    const blocks = s.blocks.filter((b) => !o.ctx || b.ctx.includes(o.ctx));
    return `<div class="screen ${o.phone ? 'phone' : ''}"><div class="screen-head"><span>Урок ${numOf(L)} · Шаг ${n}</span><span>${esc(s.title)}</span></div>
      <div class="screen-body">${blocks.map((b) => sBlock(b, o)).join('') || '<div class="empty" style="margin:auto">Компоненты не добавлены</div>'}</div></div>`;
  }
  function sBlock(b, o) {
    const tr = (show) => o.tr || show;
    if (b.type === 'cards') {
      const L = curLesson();
      const cardOf = (z) => (L && L.materials && L.materials.cards.find((c) => c.zh === z)) || { zh: z, py: '', ru: '', pic: '⭐' };
      const list = b.cards.map(cardOf);
      if (b.mode === 'carousel') { const c = list[0] || { zh: '—', pic: '⭐' }; return `<div class="s-block"><div class="s-title">${esc(b.task)}</div><div class="row" style="justify-content:space-between;gap:8px"><span class="btn icon">${icon('back', 13)}</span><div class="s-word" style="flex:1;padding:14px">${cardPic(c, 56)}<div class="hz zh">${esc(c.zh)}</div>${tr(false) ? `<div class="ru">${esc(c.ru)}</div>` : ''}</div><span class="btn icon">${icon('chev', 13)}</span></div><div class="xs" style="text-align:center;color:#6a7590;margin-top:4px">1 / ${list.length}</div></div>`; }
      return `<div class="s-block"><div class="s-title">${b.mode === 'pick' ? '👆 ' : ''}${esc(b.task)}</div><div class="s-words">${list.map((c) => `<div class="s-word">${cardPic(c, 34)}<div class="hz zh" style="font-size:17px">${esc(c.zh)}</div>${tr(false) ? `<div class="ru">${esc(c.ru)}</div>` : ''}</div>`).join('')}</div></div>`;
    }
    if (b.type === 'slides') {
      const L = curLesson(); const pr = L && L.materials ? L.materials.presentation : { title: 'Презентация', slides: 0 };
      return `<div class="s-block"><div class="slide-frame"><div class="slide-in">${icon('monitor', 26)}<b class="small">${esc(pr.title)}</b><span class="xs" style="color:#6a7590">Слайды ${b.from}–${b.to}${pr.slides ? ` из ${pr.slides}` : ''}${b.note ? ` · ${esc(b.note)}` : ''}</span></div></div></div>`;
    }
    if (b.type === 'choice') return `<div class="s-block"><div class="s-title">${esc(b.question)}</div><div class="s-words">${b.options.map((x) => `<div class="s-word"><div class="hz zh" style="font-size:18px">${esc(x.text) || '—'}</div></div>`).join('')}</div></div>`;
    if (b.type === 'scene') return `<div class="s-block"><div class="s-title">${esc(b.title)}</div><div class="s-scene" style="flex-direction:column;align-items:stretch">${b.lines.map((l) => `<div class="row" style="align-items:flex-end;gap:8px;${l.who === '小妹' ? 'flex-direction:row-reverse' : ''}"><span class="hero-char ${l.who === '小龙' ? 'long' : 'mei'} zh">${l.who === '小龙' ? '龙' : '妹'}</span><div class="bubble zh">${esc(l.zh)}<small>${esc(l.py)}${tr(false) ? ` · ${esc(l.ru)}` : ''}</small></div></div>`).join('')}</div></div>`;
    if (b.type === 'media') return `<div class="s-media"><span class="play">${icon('play', 14)}</span><div class="grow"><div class="small" style="font-weight:800">${esc(b.title)}</div><div class="bar" style="margin-top:8px"></div></div><span class="xs" style="opacity:.7">${{ video: 'видео', audio: 'аудио', song: 'песня' }[b.kind]} · ${esc(b.duration)}</span></div>`;
    if (b.type === 'text' || b.type === 'reveal') {
      const limit = b.type === 'reveal' && o.reveal != null ? o.reveal : Infinity;
      return `<div class="s-block">${b.type === 'reveal' ? '<div class="s-title">Что спрятано?</div>' : ''}<div class="s-words">${b.items.map((it, i) => {
        const hidden = i >= limit;
        return `<div class="s-word ${hidden ? 's-hidden' : ''}">${it.color ? `<div class="sw" style="background:${hidden ? 'transparent' : esc(it.color)}"></div>` : ''}<div class="hz zh">${hidden ? '?' : esc(it.zh) || '—'}</div><div class="py">${hidden ? '' : esc(it.py)}</div>${!hidden && tr(b.showTranslation) ? `<div class="ru">${esc(it.ru)}</div>` : ''}</div>`;
      }).join('')}</div></div>`;
    }
    if (b.type === 'drag') return `<div class="s-block"><div class="s-title">${esc(b.task)}</div><div class="drag-wrap"><div class="drag-col">${b.pairs.map((p) => `<div class="drag-chip zh">${esc(p.left) || '—'}</div>`).join('')}</div><div class="drag-col">${b.pairs.slice().reverse().map((p) => `<div class="drag-target" style="background:${esc(p.color || '#fff')}22;border-color:${esc(p.color || '#ddd')}">${esc(p.right)}</div>`).join('')}</div></div></div>`;
    if (b.type === 'static') return `<div class="s-block" style="text-align:center"><div class="s-title" style="font-size:15px">${esc(b.title)}</div>${b.swatches.length ? `<div class="swatches">${b.swatches.map((c) => `<span class="swatch" style="background:${esc(c)}"></span>`).join('')}</div>` : `<div style="height:70px;border-radius:12px;background:linear-gradient(135deg,#d9ecff,#f3fbe9);display:grid;place-items:center;color:#7a8aa8">${icon('image', 26)}</div>`}<div class="xs zh" style="color:#4f5b75;margin-top:4px">${esc(b.caption)}</div></div>`;
    if (b.type === 'print') return `<div class="print-card">${icon('printer', 22)}<div><b>${esc(b.title)}</b><div class="muted">${esc(b.note)} · работа с физическими карточками</div></div></div>`;
    return '';
  }

  // --- Домашнее задание
  function tHomework(L) {
    const hw = L.hw;
    const t = ui.taskId === 'settings' ? null : idx[ui.taskId];
    return `<div class="builder hw">
      <div class="card sticky" style="padding:16px">
        <div class="task-item ${ui.taskId === 'settings' ? 'on' : ''}" style="grid-template-columns:32px 1fr" data-act="selTask" data-id="settings"><span class="block-ico" style="background:#c9ff4f66">${icon('sliders', 15)}</span><div><b class="small">Настройки ДЗ</b><div class="xs muted">${CHECK[hw.check]} · ${hw.estimate} мин · срок ${hw.dueDays} дн.</div></div></div>
        <div class="divider" style="margin:10px 0"></div>
        <div class="row between" style="margin-bottom:6px"><h3>Задания</h3><span class="xs muted">${hw.tasks.length} · ${hw.tasks.reduce((a, x) => a + (+x.points || 0), 0)} баллов</span></div>
        <div data-region="hwlist">${hwListInner(L)}</div>
        <button class="btn sm dark" style="width:100%;margin-top:10px" data-act="addTaskModal">${icon('plus', 14)}Добавить задание</button>
      </div>
      <div>${t ? taskEditor(L, t) : hwSettings(L)}</div>
      <div class="preview-col sticky">
        <div class="row between" style="margin-bottom:10px"><span class="eyebrow">Как увидит ученик</span><button class="btn xs" data-act="kidReset">${icon('refresh', 12)}Сбросить ответы</button></div>
        <div data-region="kid">${kidInner(L)}</div>
      </div>
    </div>`;
  }
  function hwListInner(L) {
    return `${L.hw.tasks.map((t, i) => `<div class="task-item ${t.id === ui.taskId ? 'on' : ''}" draggable="true" data-drag="task" data-drag-id="${t.id}" data-drop="task" data-before="${t.id}" data-act="selTask" data-id="${t.id}">
      <span class="handle">${icon('grip', 13)}</span><span class="block-ico" style="background:#14141409">${icon(TT[t.type].icon, 14)}</span>
      <div style="min-width:0"><div class="step-title" style="-webkit-line-clamp:1">${i + 1}. ${esc(t.title)}</div><div class="xs muted">${TT[t.type].label}</div></div>
      <span class="check-badge check-${TT[t.type].check}">${{ auto: 'авто', manual: 'ручная', hybrid: 'гибрид', ai: 'ИИ' }[TT[t.type].check]}</span>
    </div>`).join('')}<div class="drop-zone" data-drop="task" data-before=""></div>`;
  }
  function hwSettings(L) {
    const hw = L.hw;
    return `<div class="card stack">
      <div class="row between"><h2>Настройки домашнего задания</h2><span class="chip">${icon('clock', 12)}~${hw.estimate} мин</span></div>
      <label class="field"><span>Название</span><input class="input" data-id="${hw.id}" data-k="title" value="${esc(hw.title)}"></label>
      <label class="field"><span>Инструкция</span><textarea class="textarea" style="min-height:60px" data-id="${hw.id}" data-k="about" placeholder="Что сделать дома">${esc(hw.about || '')}</textarea></label>
      <label class="field"><span>Как ребёнок проходит ДЗ <span class="muted" style="font-weight:500">— каждый шаг с новой строки</span></span><textarea class="textarea" style="min-height:70px" data-id="${hw.id}" data-k="flow">${esc(hw.flow || '')}</textarea></label>
      <div class="field"><span>Материалы для повторения</span><div class="props">${[...new Set([...matNames(L), ...(hw.materials || [])])].map((x) => `<span class="prop ${(hw.materials || []).includes(x) ? 'on' : ''}" data-act="toggleHwMat" data-m="${esc(x)}">${esc(x)}</span>`).join('')}</div></div>
      <label class="field"><span>Формат ответа</span><input class="input" data-id="${hw.id}" data-k="format" value="${esc(hw.format || '')}" placeholder="Например: интерактивная практика + квиз из 5 вопросов"></label>
      <div class="grid g2">
        <label class="field"><span>Срок по умолчанию, дней</span><input class="input" type="number" min="1" data-type="num" data-id="${hw.id}" data-k="dueDays" value="${hw.dueDays}"></label>
        <label class="field"><span>Время выполнения, мин</span><input class="input" type="number" min="1" data-type="num" data-id="${hw.id}" data-k="estimate" value="${hw.estimate}"></label>
      </div>
      <div class="field"><span>Проверка</span><div class="seg">${[['auto', 'Автопроверка'], ['hybrid', 'Авто + преподаватель'], ['manual', 'Проверяет преподаватель']].map(([k, t]) => `<button class="${hw.check === k ? 'on' : ''}" data-act="setField" data-id="${hw.id}" data-k="check" data-v="${k}">${t}</button>`).join('')}</div></div>
      <div class="field"><span>Оценивание</span><div class="seg">${[['soft', 'Мягкая модель'], ['grades', 'Баллы и оценка']].map(([k, t]) => `<button class="${hw.grading === k ? 'on' : ''}" data-act="setField" data-id="${hw.id}" data-k="grading" data-v="${k}">${t}</button>`).join('')}</div></div>
      <label class="check"><span class="switch"><input type="checkbox" data-id="${hw.id}" data-k="withParent" ${hw.withParent ? 'checked' : ''}><i></i></span>Выполняется вместе с родителем</label>
      <label class="field"><span>Подсказка родителю</span><textarea class="textarea" data-id="${hw.id}" data-k="parentNote">${esc(hw.parentNote)}</textarea></label>
      <div class="divider"></div>
      <div><div class="eyebrow" style="margin-bottom:8px">Что дальше делает преподаватель</div>
        <div class="grid g2 small">
          <div class="card soft" style="padding:14px"><b>Назначает</b><div class="muted xs">группе или отдельным ученикам, ставит срок, добавляет комментарий, выбирает, нужна ли проверка</div></div>
          <div class="card soft" style="padding:14px"><b>Проверяет</b><div class="muted xs">возвращает на доработку, даёт текстовую или голосовую обратную связь, ставит оценку</div></div>
        </div>
        <div class="status-flow" style="margin-top:12px">${['Черновик', 'Назначено', 'Открыто', 'Выполняется', 'Сдано'].map((x) => `<span>${x}</span>`).join('<i>→</i>')}<i>→</i><span style="background:#c9ff4f66">Проверено</span><span style="background:#ffe58a80">На доработку</span><span style="background:#ffb6e859">Просрочено</span></div>
      </div>
    </div>`;
  }
  function taskEditor(L, t) {
    const meta = TT[t.type];
    const i = L.hw.tasks.indexOf(t);
    return `<div class="card stack">
      <div class="row" style="gap:10px"><span class="block-ico" style="background:#c9b4ff59;width:38px;height:38px">${icon(meta.icon, 18)}</span><div class="grow"><div class="xs muted">Задание ${i + 1} · ${meta.label}</div><input class="input bare" style="font-weight:900;font-size:20px" data-id="${t.id}" data-k="title" data-live="hwlist,kid" value="${esc(t.title)}"></div>
        <span class="check-badge check-${meta.check}">${CHECK[meta.check]}</span>
        ${ui.lid === '__tpl' ? `<button class="btn sm" data-act="useTplModal" data-id="${t.id}">${icon('plus', 13)}В урок</button>` : `<button class="btn sm ghost" data-act="saveTpl" data-id="${t.id}" title="Сохранить как шаблон">${icon('cards', 13)}В шаблоны</button>`}<button class="btn icon ghost" data-act="dupTask" data-id="${t.id}" title="Дублировать">${icon('copy', 15)}</button><button class="btn icon ghost danger" data-act="del" data-id="${t.id}" title="Удалить">${icon('trash', 15)}</button></div>
      <label class="field"><span>Инструкция для ученика</span><textarea class="textarea" style="min-height:60px" data-id="${t.id}" data-k="instruction" data-live="kid">${esc(t.instruction)}</textarea></label>
      ${taskFields(L, t)}
      <div class="grid" style="grid-template-columns:120px 1fr">
        <label class="field"><span>Баллы</span><input class="input" type="number" min="0" data-type="num" data-id="${t.id}" data-k="points" value="${t.points}"></label>
        <label class="field"><span>Подсказка (открытие фиксируется)</span><input class="input" data-id="${t.id}" data-k="hint" data-live="kid" value="${esc(t.hint)}" placeholder="Показывается по кнопке «Подсказка»"></label>
      </div>
      <div class="hint-box">${icon('sparkle', 16)}<span>${meta.check === 'auto' ? 'Мгновенная обратная связь: при ошибке ученик видит правильный ответ. Ошибочные слова попадают в блок «Ошибки и повторение».' : 'Работа уходит преподавателю на проверку. На Этапе 2 ИИ подготовит предварительный анализ, итог утверждает преподаватель.'} События (старт, подсказка, ошибка, пропуск) пишутся в диагностический профиль.</span></div>
    </div>`;
  }
  function optRows(t) {
    return `<div class="field"><span>Варианты ответа <span class="muted" style="font-weight:500">— отметьте правильный</span></span>
      ${t.options.map((o) => `<div class="opt-row"><span class="radio-dot ${o.correct ? 'on' : ''}" data-act="setCorrect" data-t="${t.id}" data-id="${o.id}">${o.correct ? icon('check', 12) : ''}</span><input class="input zh" data-id="${o.id}" data-k="text" data-live="kid" value="${esc(o.text)}" placeholder="Вариант"><button class="btn icon ghost danger" data-act="del" data-id="${o.id}">${icon('trash', 13)}</button></div>`).join('')}
      <button class="btn xs" style="margin-top:8px" data-act="addOpt" data-id="${t.id}">${icon('plus', 12)}Вариант</button></div>`;
  }
  function taskFields(L, t) {
    switch (t.type) {
      case 'choice': return optRows(t);
      case 'audio': return `<div class="grid" style="grid-template-columns:1fr auto;align-items:end"><label class="field"><span>Фраза в аудио (транскрипция)</span><input class="input zh" data-id="${t.id}" data-k="phrase" data-live="kid" value="${esc(t.phrase)}"></label><button class="btn" data-act="fakeUpload" data-what="аудиозапись">${icon('upload', 14)}Аудио</button></div>${optRows(t)}`;
      case 'match': return `<div class="field"><span>Пары: слово ↔ картинка (эмодзи, изображение или цвет #hex)</span>${t.pairs.map((p) => `<div class="opt-row" style="grid-template-columns:1fr 1fr 32px"><input class="input zh" data-id="${p.id}" data-k="word" data-live="kid" value="${esc(p.word)}" placeholder="Слово"><input class="input" data-id="${p.id}" data-k="pic" data-live="kid" value="${esc(p.pic)}" placeholder="🍎 или #ff5a5a"><button class="btn icon ghost danger" data-act="del" data-id="${p.id}">${icon('trash', 13)}</button></div>`).join('')}<button class="btn xs" style="margin-top:8px" data-act="addPair" data-id="${t.id}">${icon('plus', 12)}Пара</button></div>`;
      case 'order': return `<div class="field"><span>Слова в правильном порядке <span class="muted" style="font-weight:500">— ученик увидит их перемешанными</span></span>${t.words.map((w) => `<div class="opt-row" style="grid-template-columns:1fr 32px 32px 32px"><input class="input zh" data-id="${w.id}" data-k="text" data-live="kid" value="${esc(w.text)}"><button class="btn icon ghost" data-act="move" data-id="${w.id}" data-dir="-1">${icon('up', 13)}</button><button class="btn icon ghost" data-act="move" data-id="${w.id}" data-dir="1">${icon('down', 13)}</button><button class="btn icon ghost danger" data-act="del" data-id="${w.id}">${icon('trash', 13)}</button></div>`).join('')}<button class="btn xs" style="margin-top:8px" data-act="addWord" data-id="${t.id}">${icon('plus', 12)}Слово</button></div><label class="field"><span>Перевод фразы</span><input class="input" data-id="${t.id}" data-k="ru" value="${esc(t.ru)}"></label>`;
      case 'gap': return `<div class="grid g2"><label class="field"><span>Предложение (пропуск — ___)</span><input class="input zh" data-id="${t.id}" data-k="sentence" data-live="kid" value="${esc(t.sentence)}"></label><label class="field"><span>Правильный ответ</span><input class="input zh" data-id="${t.id}" data-k="answer" value="${esc(t.answer)}"></label></div><label class="field"><span>Перевод</span><input class="input" data-id="${t.id}" data-k="ru" data-live="kid" value="${esc(t.ru)}"></label>`;
      case 'pron': return `<div class="grid g2"><label class="field"><span>Эталонная фраза</span><input class="input zh" data-id="${t.id}" data-k="zh" data-live="kid" value="${esc(t.zh)}"></label><label class="field"><span>Пиньинь (тоны)</span><input class="input" data-id="${t.id}" data-k="py" data-live="kid" value="${esc(t.py)}"></label></div>
        <div class="row wrap"><button class="btn sm" data-act="fakeUpload" data-what="эталонное аудио">${icon('upload', 14)}Эталонное аудио</button><span class="chip">Проверяет преподаватель</span><span class="chip yellow">Автооценка тонов — после MVP</span></div>`;
      case 'hanzi': return `<label class="field"><span>Иероглиф</span><input class="input zh" style="font-size:28px;width:90px;text-align:center" data-id="${t.id}" data-k="zh" data-live="kid" value="${esc(t.zh)}"></label><div class="row wrap"><span class="chip">Режим: обводка по контуру</span><span class="chip">Проверка порядка и направления черт</span></div>`;
      case 'cards': return `<div class="field"><span>Слова из лексики урока</span><div class="props">${L.vocab.map((w) => `<span class="prop ${t.words.includes(w.zh) ? 'on' : ''}" data-act="toggleCardWord" data-id="${t.id}" data-w="${esc(w.zh)}"><span class="zh">${esc(w.zh)}</span> · ${esc(w.ru)}</span>`).join('')}</div><div class="xs muted" style="margin-top:6px">Форматы карточек: иероглиф → перевод, аудио → слово. Слова попадут в SRS ученика.</div></div>`;
      case 'text': return `<label class="field"><span>Эталонный ответ (для преподавателя)</span><input class="input" data-id="${t.id}" data-k="answer" value="${esc(t.answer)}"></label>`;
      case 'ai': return '<div class="empty">Задание будет сформировано ИИ-ассистентом в рамках утверждённой программы (Этап 2).</div>';
      default: return `<label class="field"><span>Критерии проверки для преподавателя</span><textarea class="textarea" style="min-height:60px" data-id="${t.id}" data-k="criteria">${esc(t.criteria)}</textarea></label>${['photo', 'file', 'video', 'presentation'].includes(t.type) ? `<button class="btn sm" data-act="fakeUpload" data-what="пример / материал">${icon('upload', 14)}Пример выполнения</button>` : ''}`;
    }
  }

  // Интерактивное превью ДЗ (экран ученика на телефоне/планшете)
  function kidInner(L) {
    const tasks = L.hw.tasks;
    const t = ui.taskId === 'settings' ? tasks[0] : idx[ui.taskId];
    if (!t) return '<div class="empty">Добавьте задания</div>';
    const i = tasks.indexOf(t);
    return `<div class="screen-frame" style="max-width:340px;margin:0 auto;border-radius:30px;padding:10px"><div class="screen phone">
      <div class="screen-head"><span>Домашнее задание</span><span>${i + 1} / ${tasks.length}</span></div>
      <div class="screen-body kid">
        <div class="progress-dots">${tasks.map((x, j) => `<i class="${ui.kid[x.id] && ui.kid[x.id].ok ? 'ok' : j === i ? 'on' : ''}"></i>`).join('')}</div>
        ${L.assessment === 'soft' ? `<div class="row" style="gap:8px"><span class="hero-char mei zh" style="width:34px;height:34px;font-size:15px">妹</span><span class="xs" style="color:#4f5b75">Сяо Мей: «Давай поиграем!»</span></div>` : ''}
        <div><div class="kid-task-title">${esc(t.title)}</div><div class="kid-ins">${esc(t.instruction)}</div></div>
        ${kidTask(L, t)}
        ${t.hint ? `<details class="xs" style="color:#4f5b75"><summary style="cursor:pointer;font-weight:700">Подсказка</summary>${esc(t.hint)}</details>` : ''}
        <div class="row" style="margin-top:auto;gap:6px"><button class="btn sm" ${i === 0 ? 'disabled' : ''} data-act="selTask" data-id="${tasks[i - 1] ? tasks[i - 1].id : ''}">${icon('back', 13)}</button><button class="btn sm grow" data-act="kidSkip" data-t="${t.id}">Пропустить</button><button class="btn sm dark grow" ${i === tasks.length - 1 ? 'disabled' : ''} data-act="selTask" data-id="${tasks[i + 1] ? tasks[i + 1].id : ''}">Дальше</button></div>
      </div></div></div>`;
  }
  function kidTask(L, t) {
    const st = ui.kid[t.id] || (ui.kid[t.id] = {});
    const fb = (ok, text) => `<div class="kid-feedback ${ok ? 'ok' : 'no'}">${text}</div>`;
    if (st.skipped) return fb(false, 'Задание пропущено — статус «не пройдено», слово уйдёт в повторение.');
    switch (t.type) {
      case 'choice':
      case 'audio': {
        const right = t.options.find((o) => o.correct);
        const picked = t.options.find((o) => o.id === st.picked);
        return `${t.type === 'audio' ? `<button class="kid-btn lime" data-act="kidPlay">${icon('play', 13)} Послушать</button><div class="xs muted" style="text-align:center">в аудио: <span class="zh">${esc(t.phrase)}</span></div>` : ''}
          <div class="grid" style="grid-template-columns:1fr;gap:8px">${t.options.map((o) => `<button class="kid-opt zh ${st.picked === o.id ? (o.correct ? 'right' : 'wrong') : ''} ${st.ok ? 'done' : ''}" data-act="kidPick" data-t="${t.id}" data-o="${o.id}">${esc(o.text) || '—'}</button>`).join('')}</div>
          ${picked ? (picked.correct ? fb(true, '太棒了！ Верно!') : fb(false, `Правильный ответ: <span class="zh">${esc(right ? right.text : '')}</span>. ${esc(t.hint)}`)) : ''}`;
      }
      case 'match': {
        st.done = st.done || [];
        const pics = t.pairs.slice().reverse();
        return `<div class="drag-wrap"><div class="drag-col">${t.pairs.map((p) => `<button class="kid-opt zh ${st.done.includes(p.id) ? 'right done' : st.sel === p.id ? 'picked' : ''}" style="font-size:18px;padding:8px" data-act="kidMatchWord" data-t="${t.id}" data-id="${p.id}">${esc(p.word) || '—'}</button>`).join('')}</div>
          <div class="drag-col">${pics.map((p) => `<button class="kid-opt ${st.done.includes(p.id) ? 'right done' : st.wrong === p.id ? 'wrong' : ''}" style="padding:6px;display:grid;place-items:center" data-act="kidMatchPic" data-t="${t.id}" data-id="${p.id}">${swatchOrEmoji(p.pic, 30)}</button>`).join('')}</div></div>
          ${st.ok ? fb(true, 'Все пары найдены!') : st.wrong ? fb(false, 'Не та пара — попробуй ещё') : ''}`;
      }
      case 'order': {
        st.ans = st.ans || [];
        const pool = t.words.slice().sort((a, b) => (a.text > b.text ? -1 : 1)).filter((w) => !st.ans.includes(w.id));
        const correct = st.checked && st.ans.join() === t.words.map((w) => w.id).join();
        return `<div style="min-height:52px;border-radius:14px;border:2px dashed #c3cfe6;padding:6px;display:flex;flex-wrap:wrap;gap:6px;background:#fff">${st.ans.map((id) => { const w = idx[id]; return w ? `<button class="kid-opt zh" style="width:auto;font-size:18px;padding:6px 12px" data-act="kidUnorder" data-t="${t.id}" data-id="${id}">${esc(w.text)}</button>` : ''; }).join('')}</div>
          <div class="row wrap" style="gap:6px">${pool.map((w) => `<button class="kid-opt zh" style="width:auto;font-size:18px;padding:6px 12px" data-act="kidOrder" data-t="${t.id}" data-id="${w.id}">${esc(w.text)}</button>`).join('')}</div>
          ${st.checked ? (correct ? fb(true, `Верно! ${esc(t.ru)}`) : fb(false, `Правильно: <span class="zh">${t.words.map((w) => esc(w.text)).join(' ')}</span>`)) : `<button class="kid-btn" data-act="kidCheck" data-t="${t.id}" ${st.ans.length ? '' : 'disabled'}>Проверить</button>`}`;
      }
      case 'gap': {
        const ok = st.checked && (st.val || '').trim() === String(t.answer).trim();
        const parts = String(t.sentence).split('___');
        return `<div class="s-block zh" style="font-size:22px;font-weight:800;text-align:center">${esc(parts[0])}<input class="input zh" style="width:70px;display:inline-block;text-align:center;font-size:20px" data-kidgap="${t.id}" value="${esc(st.val || '')}">${esc(parts[1] || '')}</div>
          ${t.ru ? `<div class="xs muted" style="text-align:center">${esc(t.ru)}</div>` : ''}
          ${st.checked ? (ok ? fb(true, 'Верно!') : fb(false, `Правильный ответ: <span class="zh">${esc(t.answer)}</span>`)) : `<button class="kid-btn" data-act="kidCheck" data-t="${t.id}">Проверить</button>`}`;
      }
      case 'cards': {
        const words = t.words.length ? t.words : L.vocab.slice(0, 3).map((w) => w.zh);
        const k = (st.i || 0) % words.length;
        const w = vocabFor(L, words[k]) || { zh: words[k], py: '', ru: '' };
        return `<div class="flip ${st.flip ? 'on' : ''}" data-act="kidFlip" data-t="${t.id}"><div class="flip-in"><div class="flip-f"><div><div class="zh" style="font-size:40px;font-weight:900">${esc(w.zh)}</div><div class="xs muted">нажми, чтобы перевернуть</div></div></div><div class="flip-b"><div><div style="font-weight:800">${esc(w.py)}</div><div>${esc(w.ru)}</div></div></div></div></div>
          <div class="row" style="gap:6px"><button class="btn sm grow" data-act="kidNextCard" data-t="${t.id}" data-ok="0">Ещё повторить</button><button class="btn sm lime grow" data-act="kidNextCard" data-t="${t.id}" data-ok="1">Знаю</button></div><div class="xs muted" style="text-align:center">${k + 1} / ${words.length}</div>`;
      }
      case 'pron':
        return `<div class="s-block" style="text-align:center"><div class="zh" style="font-size:26px;font-weight:900">${esc(t.zh)}</div><div class="xs" style="color:#4f5b75">${esc(t.py)}</div><button class="btn xs" style="margin-top:6px" data-act="kidPlay">${icon('play', 11)} эталон</button></div>
          <button class="mic ${st.rec ? 'rec' : ''}" data-act="kidMic" data-t="${t.id}">${icon(st.rec ? 'pause' : 'mic', 26)}</button>
          <div class="xs muted" style="text-align:center">${st.rec ? 'Идёт запись… нажми, чтобы остановить' : st.ok ? 'Попытка 1 сохранена' : 'Нажми и скажи фразу'}</div>
          ${st.ok ? fb(true, 'Запись отправлена учителю — он послушает и оставит комментарий.') : ''}`;
      case 'hanzi':
        return `<div style="aspect-ratio:1;max-width:180px;margin:0 auto;border-radius:16px;background:#fff;border:2px solid #e4eaf5;display:grid;place-items:center;position:relative;background-image:linear-gradient(#eef2f9 1px,transparent 1px),linear-gradient(90deg,#eef2f9 1px,transparent 1px);background-size:50% 50%"><span class="zh" style="font-size:110px;color:${st.ok ? '#141414' : '#dfe5ef'};font-weight:400;line-height:1">${esc(t.zh)}</span></div>
          ${st.ok ? fb(true, 'Порядок черт верный!') : `<button class="kid-btn" data-act="kidDone" data-t="${t.id}">Обвести</button>`}`;
      case 'ai': return '<div class="empty">Этап 2</div>';
      default: {
        const label = { photo: 'Сфотографировать работу', draw: 'Открыть холст', video: 'Записать видео', file: 'Прикрепить файл', parent: 'Загрузить фото с родителем', text: '', game: 'Начать игру', presentation: 'Открыть презентацию' }[t.type];
        if (t.type === 'text') return st.ok ? fb(true, 'Ответ отправлен преподавателю') : `<textarea class="textarea" placeholder="Твой ответ"></textarea><button class="kid-btn" data-act="kidDone" data-t="${t.id}">Отправить</button>`;
        return st.ok ? fb(true, ['game', 'presentation'].includes(t.type) ? 'Готово! Результат засчитан.' : 'Отправлено! Преподаватель проверит и оставит комментарий.') : `<div class="upload" data-act="kidDone" data-t="${t.id}">${icon(TT[t.type].icon, 26)}<div style="margin-top:6px;font-weight:800">${label}</div>${t.type === 'parent' ? '<div class="xs">Задание для мамы или папы вместе с ребёнком</div>' : ''}</div>`;
      }
    }
  }

  // --- Материалы урока (презентация, карточки, файлы для скачивания)
  const matNames = (L) => {
    const M = L.materials || { cards: [], files: [] };
    const media = L.steps.flatMap((s) => s.blocks.filter((b) => b.type === 'media').map((b) => `${b.kind === 'video' ? 'Видео' : b.kind === 'song' ? 'Песня' : 'Аудио'} «${b.title}»`));
    return [...new Set(['Презентация урока', 'Карточки урока', ...M.files.map((f) => f.title), ...media])];
  };
  const cardPic = (c, size) => (String(c.pic || '').startsWith('#') ? `<span class="swatch" style="width:${size}px;height:${size}px;background:${esc(c.pic)};display:inline-block"></span>` : `<span style="font-size:${Math.round(size * 0.8)}px;line-height:1.1;display:inline-block">${esc(c.pic || '⭐')}</span>`);
  const wchip = (w) => `<span class="chip" style="background:#f1f1f4"><b class="zh">${esc(w.zh)}</b><span class="muted" style="font-weight:500">${esc(w.py)} · ${esc(w.ru)}</span></span>`;

  function tMaterials(L) {
    const M = L.materials;
    const pr = M.presentation;
    return `<div class="grid g2" style="align-items:start">
      <div class="stack">
        <div class="card stack">
          <div class="card-h" style="margin:0"><h3>Презентация</h3><span class="chip">${pr.slides || 0} слайдов</span></div>
          <div class="slide-frame big"><div class="slide-in">${icon('monitor', 34)}<b>${esc(pr.title)}</b><span class="xs muted">${esc(pr.formats || 'PPTX, PDF')}</span></div></div>
          <div class="grid" style="grid-template-columns:1fr 120px"><label class="field"><span>Название</span><input class="input" data-pres="title" value="${esc(pr.title)}"></label><label class="field"><span>Слайдов</span><input class="input" type="number" min="0" data-pres="slides" value="${pr.slides || 0}"></label></div>
          <div class="row wrap"><button class="btn sm" data-act="fakeUpload" data-what="презентацию PPTX">${icon('upload', 14)}Загрузить PPTX</button><button class="btn sm" data-act="fakeUpload" data-what="презентацию PDF">${icon('upload', 14)}Загрузить PDF</button></div>
          <div class="hint-box">${icon('sparkle', 16)}<span>Преподаватель листает слайды, открывает показ на весь экран и скачивает PPTX или PDF. Отдельные слайды выводятся в шаги блоком «Презентация».</span></div>
        </div>
        <div class="card">
          <div class="card-h"><h3>Файлы для скачивания</h3><span class="xs muted">рабочая тетрадь, приложения</span></div>
          ${M.files.map((f) => `<div class="opt-row" style="grid-template-columns:30px 1fr 1fr 32px"><span class="block-ico" style="background:#14141409;width:30px;height:30px">${icon('file', 14)}</span><input class="input" data-id="${f.id}" data-k="title" value="${esc(f.title)}"><input class="input" data-id="${f.id}" data-k="note" value="${esc(f.note)}" placeholder="страницы, формат"><button class="btn icon ghost danger" data-act="del" data-id="${f.id}">${icon('trash', 13)}</button></div>`).join('') || '<div class="empty">Файлов пока нет</div>'}
          <div class="row" style="margin-top:10px"><button class="btn sm" data-act="addFile">${icon('plus', 14)}Файл</button><button class="btn sm ghost" data-act="fakeUpload" data-what="файл">${icon('upload', 14)}Загрузить</button></div>
        </div>
      </div>
      <div class="card">
        <div class="card-h"><h3>Набор карточек</h3><span class="xs muted">${M.cards.length} карточек · изображение, слово, перевод, аудио</span></div>
        <div class="cards-grid">${M.cards.map((c) => `<div class="mcard">
          <div class="mcard-pic">${cardPic(c, 44)}</div>
          <input class="input zh" style="font-weight:800;text-align:center" data-id="${c.id}" data-k="zh" value="${esc(c.zh)}" placeholder="汉字">
          <input class="input" style="text-align:center" data-id="${c.id}" data-k="py" value="${esc(c.py)}" placeholder="pīnyīn">
          <input class="input" style="text-align:center" data-id="${c.id}" data-k="ru" value="${esc(c.ru)}" placeholder="перевод">
          <div class="row" style="gap:4px"><input class="input" style="text-align:center;padding:6px" data-id="${c.id}" data-k="pic" value="${esc(c.pic)}" title="Эмодзи или цвет #hex"><button class="btn icon ghost" data-act="fakeUpload" data-what="изображение карточки" title="Изображение">${icon('image', 14)}</button><button class="btn icon ghost" data-act="fakeUpload" data-what="аудио карточки" title="Аудио">${icon('headphones', 14)}</button><button class="btn icon ghost danger" data-act="del" data-id="${c.id}">${icon('trash', 13)}</button></div>
        </div>`).join('')}</div>
        <div class="row wrap" style="margin-top:12px"><button class="btn sm" data-act="addCard">${icon('plus', 14)}Карточка</button><button class="btn sm" data-act="cardsFromVocab">${icon('book', 14)}Из слов урока</button><button class="btn sm ghost" data-act="fakeUpload" data-what="PDF карточек для печати">${icon('printer', 14)}PDF для печати</button></div>
      </div>
    </div>`;
  }

  // --- Предпросмотр: кабинет преподавателя, двухэкранный режим, ДЗ глазами ученика
  function tPreview(L) {
    const seg = `<div class="seg">${[['teacher', 'Кабинет преподавателя', 'tablet'], ['duo', 'Двухэкранный режим', 'monitor'], ['kid', 'ДЗ глазами ученика', 'send']].map(([k, t, ic]) => `<button class="${ui.pv === k ? 'on' : ''}" data-act="setPv" data-v="${k}">${icon(ic, 14)}${t}</button>`).join('')}</div>`;
    let body;
    if (ui.pv === 'duo') body = tShow(L);
    else if (ui.pv === 'kid') body = `<div class="grid parent-grid" style="align-items:start"><div class="card"><h3 style="margin-bottom:10px">${esc(L.hw.title)}</h3><p class="small muted" style="margin:0 0 12px">${esc(L.hw.about || '')}</p>${L.hw.tasks.map((t, i) => `<div class="task-item ${t.id === ui.taskId ? 'on' : ''}" style="grid-template-columns:32px 1fr auto" data-act="selTask" data-id="${t.id}"><span class="block-ico" style="background:#14141409">${icon(TT[t.type].icon, 14)}</span><div><b class="small">${i + 1}. ${esc(t.title)}</b><div class="xs muted">${TT[t.type].label}</div></div><span class="check-badge check-${TT[t.type].check}">${TT[t.type].check === 'auto' ? 'авто' : 'учитель'}</span></div>`).join('')}<div class="hint-box" style="margin-top:12px">${icon('sparkle', 16)}<span>Предпросмотр: ответы не сохраняются и не влияют на задания учеников.</span></div></div><div data-region="kid">${kidInner(L)}</div></div>`;
    else body = teacherView(L);
    return `<div class="row between wrap" style="gap:10px;margin-bottom:16px">${seg}<span class="xs muted">Урок собирается один раз — представления для преподавателя и ученика формируются автоматически</span></div>${body}`;
  }

  function teacherView(L) {
    const m = methodOf(L.id);
    const M = L.materials;
    const words = L.vocab.filter((w) => w.kind !== 'phrase');
    const phrases = L.vocab.filter((w) => w.kind === 'phrase');
    const acc = (ic, t, body, open) => `<details class="tv-acc" ${open ? 'open' : ''}><summary>${icon(ic, 15)}<span>${t}</span></summary><div class="tv-acc-b">${body}</div></details>`;
    const list = (txt) => `<ul>${String(txt || '').split('\n').filter(Boolean).map((x) => `<li>${esc(x)}</li>`).join('')}</ul>`;
    const tab = ui.tvTab;
    let inner = '';
    if (tab === 'screen') {
      const k = Math.min(ui.tvStep, L.steps.length - 1);
      const st = L.steps[k];
      inner = `<div class="row between wrap" style="margin-bottom:10px;gap:8px"><div class="tablet-steps">${L.steps.map((x, i) => `<button class="${i === k ? 'on' : ''}" data-act="tvStep" data-i="${i}">${i + 1}</button>`).join('')}</div><span class="btn sm">${icon('monitor', 13)}На весь экран</span></div>
        <div class="projector">${st ? studentScreen(L, st, {}) : ''}</div>
        <div class="row between" style="margin-top:12px"><button class="btn sm" data-act="tvStep" data-i="${k - 1}" ${k === 0 ? 'disabled' : ''}>${icon('back', 13)}Назад</button><button class="btn sm dark" data-act="tvStep" data-i="${k + 1}" ${k >= L.steps.length - 1 ? 'disabled' : ''}>Далее ${icon('chev', 13)}</button></div>`;
    } else if (tab === 'hw') {
      const hw = L.hw;
      inner = `<div class="tv-hw"><div class="row" style="gap:6px"><span class="chip purple">${hw.tasks.some((t) => TT[t.type].check === 'auto') ? 'Квиз' : 'Задание'}</span><span class="chip">~${hw.estimate} мин</span></div><b style="display:block;margin-top:8px;font-size:17px">${esc(hw.title)}</b><p class="small muted" style="margin:4px 0 0">${esc(hw.about || '')}</p></div>
        ${hw.flow ? `<div class="tv-box"><div class="eyebrow">Как ребёнок проходит ДЗ</div>${list(hw.flow)}</div>` : ''}
        ${(hw.materials || []).length ? `<div class="tv-box"><div class="eyebrow">Материалы</div>${list(hw.materials.join('\n'))}</div>` : ''}
        <p class="small"><b>Формат ответа:</b> ${esc(hw.format || '—')} · ${hw.tasks.length} ${plural(hw.tasks.length, 'задание', 'задания', 'заданий')}</p>
        <div class="hint-box">${icon('sparkle', 16)}<span>Это каноническое домашнее задание из методики. Оно становится реальным назначением только после выдачи урока группе.</span></div>
        <button class="btn dark" style="margin-top:12px" data-act="setPv" data-v="kid">${icon('eye', 14)}Предпросмотр</button>`;
    } else {
      inner = `${acc('book', 'Об уроке', `<p class="small" style="margin:0">${esc(L.about || L.goal)}</p>`, true)}
        ${acc('monitor', 'Презентация', `<div class="row wrap" style="gap:12px;align-items:flex-start"><div class="slide-frame" style="width:240px"><div class="slide-in">${icon('monitor', 24)}<b class="small">${esc(M.presentation.title)}</b><span class="xs muted">1 / ${M.presentation.slides || 0}</span></div></div><div class="stack-s"><span class="btn sm">На весь экран</span><span class="btn sm">Открыть PDF</span><span class="btn sm">Скачать PPTX</span></div></div>`)}
        ${acc('cards', `Карточки · ${M.cards.length}`, `<div class="tv-cards">${M.cards.map((c) => `<div class="mcard view">${cardPic(c, 38)}<b class="zh">${esc(c.zh)}</b><span class="xs muted">${esc(c.ru)}</span></div>`).join('')}</div><div class="row" style="margin-top:8px"><span class="btn sm">Открыть PDF</span><span class="btn sm">Скачать PDF</span></div>`)}
        ${acc('text', 'Новые слова и фразы', `<div class="xs muted" style="margin-bottom:6px">Слова · ${words.length}</div><div class="row wrap" style="gap:6px">${words.map(wchip).join('')}</div><div class="xs muted" style="margin:12px 0 6px">Фразы · ${phrases.length}</div><div class="row wrap" style="gap:6px">${phrases.map(wchip).join('')}</div>`)}
        ${acc('check', 'Реквизит', `<div class="grid g2" style="gap:6px">${L.props.map((p) => `<label class="check small"><input type="checkbox">${esc(p)}</label>`).join('')}</div>`)}
        ${M.files.length ? acc('file', 'Файлы для скачивания', `<div class="stack-s">${M.files.map((f) => `<div class="row small" style="gap:8px">${icon('file', 14)}<b>${esc(f.title)}</b><span class="muted">${esc(f.note)}</span><span class="btn xs" style="margin-left:auto">Скачать</span></div>`).join('')}</div>`) : ''}
        <div class="row wrap" style="gap:8px;margin:18px 0 10px"><b>Структура урока</b><span class="chip blue">${icon('clock', 12)}${stepMin(L)} минут</span><span class="chip">${L.steps.length} ${plural(L.steps.length, 'шаг', 'шага', 'шагов')}</span></div>
        ${L.steps.map((st, i) => `<div class="tv-step">
          <div class="row between"><div class="row wrap" style="gap:6px"><span class="chip dark">Шаг ${i + 1}</span>${actChip(st.activity)}<span class="chip">${icon('clock', 11)}${st.duration} мин</span></div><button class="btn xs" data-act="tvToScreen" data-i="${i}">${icon('monitor', 12)}На экран</button></div>
          <b style="display:block;margin-top:8px">${esc(st.title)}</b>
          <p class="small muted" style="margin:4px 0 0;white-space:pre-wrap">${esc(st.script)}</p>
          ${(st.words || []).length ? `<div class="row wrap" style="gap:4px;margin-top:8px">${st.words.map((z) => `<span class="chip purple zh" style="font-size:11.5px">${esc(z)}</span>`).join('')}</div>` : ''}
          ${st.tbox && st.tbox.title ? `<div class="tv-box"><div class="eyebrow">${esc(st.tbox.title)}</div>${list(st.tbox.items)}</div>` : ''}
          ${st.answers ? `<div class="teacher-only" style="margin-top:8px"><b class="xs">Ожидаемые ответы:</b> ${esc(st.answers)}</div>` : ''}
          ${(st.mats || []).length ? `<div class="row wrap xs muted" style="gap:6px;margin-top:8px">${icon('folder', 12)}${st.mats.map(esc).join(' · ')}</div>` : ''}
          <div class="tv-student">${st.blocks.filter((b) => b.ctx.includes('lesson')).map((b) => sBlock(b, {})).join('')}</div>
        </div>`).join('')}`;
    }
    return `<div class="tv-wrap">
      <div class="tv-nav"><span class="logo" style="font-size:16px">Shidao<sup>™</sup></span><div class="row" style="gap:2px">${['Расписание', 'Группы', 'Методики', 'Школа'].map((x) => `<span class="pill ${x === 'Методики' ? 'active' : ''}" style="height:30px;font-size:12px;padding:0 10px">${x}</span>`).join('')}</div><span class="avatar" style="width:28px;height:28px;font-size:11px">В</span></div>
      <div class="xs muted" style="margin-top:16px">← ${esc(m ? m.title : '')}${m && m.zh ? ` – <span class="zh">${esc(m.zh)}</span>` : ''}</div>
      <h2 style="font-size:28px;margin:4px 0 10px">Урок ${numOf(L)}. ${esc(L.title)}</h2>
      <span class="btn sm">${icon('clock', 13)}Запланировать урок</span>
      <div class="card" style="margin-top:14px">
        <div class="seg" style="margin-bottom:14px">${[['plan', 'План урока', 'list'], ['screen', 'Экран ученика', 'monitor'], ['hw', 'Домашнее задание', 'send']].map(([k, t, ic]) => `<button class="${tab === k ? 'on' : ''}" data-act="tvTab" data-v="${k}">${icon(ic, 13)}${t}</button>`).join('')}</div>
        ${inner}
      </div>
    </div>`;
  }

  // --- Для родителя
  function tParent(L) {
    const review = L.steps.filter((s) => s.blocks.some((b) => b.ctx.includes('review')));
    return `<div class="grid parent-grid" style="align-items:start">
      <div class="stack">
        <div class="card stack">
          <h3>Материалы для домашнего повторения</h3>
          <label class="field"><span>Рекомендация родителю</span><textarea class="textarea" data-id="${L.id}" data-k="parentNote" placeholder="Как повторить урок дома">${esc(L.parent.note)}</textarea></label>
          <div class="hint-box">${icon('sparkle', 16)}<span>После урока ученик повторяет шаги в свободной последовательности. В повторение попадают компоненты с отметкой «Повторение».</span></div>
        </div>
        <div class="card">
          <div class="card-h"><h3>Шаги в повторении</h3><span class="xs muted">${review.length} из ${L.steps.length}</span></div>
          ${L.steps.map((s, i) => { const on = review.includes(s); return `<div class="todo"><span class="step-n" style="${on ? 'background:#c9ff4f' : ''}">${i + 1}</span><div class="grow"><b class="small">${esc(s.title)}</b><div class="xs muted">${s.blocks.map((b) => COMP[b.type].label).join(', ')}</div></div><span class="chip ${on ? 'green' : ''}">${on ? 'в повторении' : 'только урок'}</span></div>`; }).join('')}
        </div>
      </div>
      <div class="sticky">
        <div class="eyebrow" style="margin-bottom:10px">Кабинет родителя · предпросмотр</div>
        <div class="screen-frame" style="border-radius:30px;padding:10px"><div class="screen phone" style="background:linear-gradient(180deg,#fff,#f6f6f9)">
          <div class="screen-head"><span>Миша · группа «Панды»</span><span>${icon('heart', 12)}</span></div>
          <div class="screen-body">
            <div class="s-block"><div class="xs muted">Урок ${numOf(L)} пройден</div><b>${esc(L.title)}</b><div class="xs" style="margin-top:4px;color:#4f5b75">${esc(L.goal)}</div></div>
            <div class="s-block"><div class="s-title">Слова урока</div><div class="row wrap" style="gap:6px">${L.vocab.slice(0, 6).map((w) => `<span class="chip zh" style="background:#f1f4fa">${esc(w.zh)} · ${esc(w.ru)}</span>`).join('')}</div></div>
            <div class="s-block"><div class="row between"><b class="small">Домашнее задание</b><span class="chip yellow">Назначено</span></div><div class="xs muted">${L.hw.tasks.length} заданий · ~${L.hw.estimate} мин · ${L.hw.withParent ? 'вместе с родителем' : 'самостоятельно'}</div>${L.hw.parentNote ? `<div class="xs" style="margin-top:6px">${esc(L.hw.parentNote)}</div>` : ''}</div>
            <div class="s-block"><div class="s-title">Как повторить дома</div><div class="xs">${esc(L.parent.note)}</div></div>
            <div class="s-block"><div class="s-title">Прогресс</div><span class="chip green">Получается</span></div>
          </div></div></div>
      </div>
    </div>`;
  }

  // --- Двухэкранный режим
  function tShow(L) {
    if (!L.steps.length) return '<div class="card"><div class="empty">Добавьте шаги, чтобы провести урок</div></div>';
    ui.duoStep = Math.min(ui.duoStep, L.steps.length - 1);
    ui.liveStep = Math.min(ui.liveStep, L.steps.length - 1);
    const s = L.steps[ui.duoStep];
    const live = L.steps[ui.liveStep];
    const hasReveal = live.blocks.some((b) => b.type === 'reveal');
    return `<div class="duo">
      <div>
        <div class="row between" style="margin-bottom:10px"><span class="eyebrow">Планшет преподавателя</span><span class="chip green">${icon('check', 11)}Урок загружен для офлайна</span></div>
        <div class="tablet"><div class="tablet-in">
          <div class="tablet-steps">${L.steps.map((x, i) => `<button class="${i === ui.duoStep ? 'on' : ''} ${i === ui.liveStep ? 'live' : ''}" data-act="duoPick" data-i="${i}" title="${esc(x.title)}">${i + 1}</button>`).join('')}</div>
          <div class="row between" style="align-items:flex-start"><div><div class="xs muted">Шаг ${ui.duoStep + 1} из ${L.steps.length} · ${s.duration} мин</div><h2 style="font-size:22px;margin-top:2px">${esc(s.title)}</h2><div class="small muted">${esc(s.goal)}</div></div><span class="chip ${ui.duoStep === ui.liveStep ? 'green' : ''}">${ui.duoStep === ui.liveStep ? '● на экране' : 'не показан'}</span></div>
          <div class="small" style="white-space:pre-wrap">${esc(s.script)}</div>
          ${s.phrases.length ? `<div class="stack-s">${s.phrases.map((f) => `<div class="row" style="gap:10px"><b class="zh" style="font-size:17px">${esc(f.zh)}</b><span class="xs muted">${esc(f.py)} · ${esc(f.ru)}</span></div>`).join('')}</div>` : ''}
          ${s.answers ? `<div class="teacher-only"><b class="xs">Ожидаемые ответы:</b> ${esc(s.answers)}</div>` : ''}
          ${s.notes ? `<div class="teacher-only"><b class="xs">Заметка:</b> ${esc(s.notes)}</div>` : ''}
          ${s.props.length ? `<div class="props">${s.props.map((p) => `<span class="prop">${esc(p)}</span>`).join('')}</div>` : ''}
          <div class="row wrap" style="margin-top:auto;gap:8px;padding-top:8px;border-top:1px solid var(--line)">
            <button class="btn dark" data-act="duoLive">${icon('monitor', 15)}Вывести на экран</button>
            ${hasReveal ? `<button class="btn" data-act="duoReveal">${icon('eye', 15)}Показать следующий</button>` : ''}
            <button class="btn ${ui.paused ? 'lime' : ''}" data-act="duoPause">${icon('pause', 15)}${ui.paused ? 'Снять паузу' : 'Пауза'}</button>
            <label class="check small"><span class="switch"><input type="checkbox" data-act-change="duoTr" ${ui.trOn ? 'checked' : ''}><i></i></span>Перевод ученикам</label>
          </div>
          <div class="row between"><button class="btn sm" data-act="duoNav" data-d="-1" ${ui.duoStep === 0 ? 'disabled' : ''}>${icon('back', 14)}Назад</button><button class="btn sm" data-act="duoNav" data-d="1" ${ui.duoStep === L.steps.length - 1 ? 'disabled' : ''}>Следующий шаг ${icon('chev', 14)}</button></div>
        </div></div>
      </div>
      <div class="sticky">
        <div class="row between" style="margin-bottom:10px"><span class="eyebrow">Экран ученика · проектор</span><span class="xs muted">задержка &lt; 500 мс в локальной сети</span></div>
        <div class="projector"><div style="position:relative">${studentScreen(L, live, { tr: ui.trOn, reveal: ui.revealN })}${ui.paused ? '<div class="pause-screen"><div><div class="zh" style="font-size:40px">休息一下</div><div style="font-size:15px">Небольшая пауза</div></div></div>' : ''}</div></div>
        <div class="card soft" style="margin-top:14px;padding:14px">
          <div class="stack-s small">
            <div class="row" style="gap:8px">${icon('check', 14)}Экран ученика пассивен: показывает только то, что вывел преподаватель</div>
            <div class="row" style="gap:8px">${icon('check', 14)}Ответы, переводы и заметки не выводятся — даже при обрыве связи</div>
            <div class="row" style="gap:8px">${icon('check', 14)}При обрыве сохраняется последний кадр</div>
          </div>
        </div>
      </div>
    </div>`;
  }

  // ---------------------------------------------------------------- Библиотека
  function vLibrary() {
    const all = Object.values(S.lessons);
    const usage = (type) => all.reduce((a, l) => a + l.steps.reduce((x, s) => x + s.blocks.filter((b) => b.type === type).length, 0), 0);
    const tusage = (type) => all.reduce((a, l) => a + l.hw.tasks.filter((t) => t.type === type).length, 0);
    const group = (check, title) => `<div class="card"><div class="card-h"><h3>${title}</h3><span class="check-badge check-${check === 'ai' ? 'hybrid' : check}">${CHECK[check]}</span></div><div class="stack-s">${Object.entries(TT).filter(([, v]) => v.check === check).map(([k, v]) => `<div class="row" style="gap:10px"><span class="block-ico" style="background:#14141409">${icon(v.icon, 14)}</span><div class="grow"><b class="small">${v.label}</b><div class="xs muted">${v.desc}</div></div><span class="xs muted">${tusage(k)}</span></div>`).join('')}</div></div>`;
    return `<div style="margin-bottom:20px"><h1>Библиотека компонентов</h1><p class="muted" style="max-width:640px">Уроки собираются только из переиспользуемых компонентов. Каждый работает в трёх контекстах: проведение урока, самостоятельное повторение, домашнее задание.</p></div>
      <h2 style="margin-bottom:14px">Компоненты урока</h2>
      <div class="grid g4">${Object.entries(COMP).map(([k, c]) => `<div class="card flat"><span class="block-ico" style="background:${c.color};width:42px;height:42px">${icon(c.icon, 20)}</span><h3 style="margin-top:12px">${c.label}</h3><p class="small muted" style="margin:6px 0 12px">${c.desc}</p><div class="row between"><span class="xs muted">в ${usage(k)} шагах</span><span class="row" style="gap:4px">${Object.values(CTX).map((t) => `<span class="chip" style="font-size:10.5px;padding:2px 7px">${t}</span>`).join('')}</span></div></div>`).join('')}
        <div class="card new-card" style="min-height:0" data-act="toast" data-msg="Новые компоненты подключаются без изменения ранее созданных уроков"><div><h3>+ Новый компонент</h3><p class="xs muted">Расширение библиотеки</p></div></div></div>
      <h2 style="margin:32px 0 14px">Типы заданий ДЗ</h2>
      <div class="grid g3" style="align-items:start">${group('auto', 'Автопроверка')}${group('manual', 'Ручная проверка')}${group('ai', 'ИИ-задания')}</div>`;
  }

  // ---------------------------------------------------------------- Материалы
  const MKIND = { video: ['Видео', 'film'], song: ['Песня', 'music'], audio: ['Аудио', 'headphones'], image: ['Изображение', 'image'], pdf: ['PDF / печать', 'printer'], pres: ['Презентация', 'monitor'], cards: ['Карточки', 'cards'] };
  function mediaListInner() {
    const q = (ui.mQ || '').toLowerCase();
    const list = S.media.filter((x) => (ui.mKind === 'all' || x.kind === ui.mKind) && (ui.mAud === 'all' || (x.audience || []).includes(ui.mAud)) && (!q || `${x.title} ${x.lesson}`.toLowerCase().includes(q)));
    if (!list.length) return '<div class="empty">Ничего не найдено</div>';
    return `<div class="grid g4">${list.map((x) => {
      const k = MKIND[x.kind] || MKIND.pdf;
      const nolic = /Не указана/.test(x.license);
      return `<div class="card flat" style="padding:14px">
        <div class="media-thumb thumb-${x.kind}">${icon(k[1], 30)}<span class="chip" style="background:#ffffffcc">${k[0]}</span>${x.offline ? `<span class="chip green" title="Доступен офлайн">${icon('check', 11)}офлайн</span>` : ''}</div>
        <b class="small" style="display:block;margin-top:10px">${esc(x.title)}</b>
        <div class="xs muted">${esc(x.lesson)} · ${esc(x.size)} · ${esc(x.source)}</div>
        <div class="row wrap" style="gap:4px;margin-top:8px">${(x.audience || []).map((a) => `<span class="chip" style="font-size:11px">${a}</span>`).join('')}</div>
        <div class="row between" style="margin-top:10px;gap:6px"><span class="chip ${nolic ? 'pink' : /до/.test(x.license) ? 'yellow' : 'green'}" style="font-size:11px;white-space:normal">${nolic ? 'Лицензия не указана' : esc(x.license)}</span><span class="row" style="gap:2px"><button class="btn icon ghost" data-act="editMedia" data-id="${x.id}" title="Изменить">${icon('pen', 14)}</button><button class="btn icon ghost danger" data-act="confirmDel" data-id="${x.id}" data-what="материал" title="Удалить">${icon('trash', 14)}</button></span></div>
      </div>`;
    }).join('')}</div>`;
  }
  function vMedia() {
    const nolic = S.media.filter((x) => /Не указана/.test(x.license)).length;
    const segBtn = (f, v, t) => `<button class="${ui[f] === v ? 'on' : ''}" data-act="mediaFilter" data-f="${f}" data-v="${v}">${t}</button>`;
    return `<div class="row between wrap" style="margin-bottom:18px;gap:12px;align-items:flex-end"><div><h1>Материалы</h1><p class="muted" style="margin:8px 0 0;max-width:640px">Аудио, видео, изображения, PDF, презентации и карточки для преподавателя, ученика и родителя. Для каждого файла хранятся источник и лицензия.</p></div><button class="btn dark lg" data-act="editMedia">${icon('upload', 16)}Загрузить материал</button></div>
      <div class="grid g4" style="margin-bottom:16px">
        <div class="stat" style="background:#ffffffb3"><b>${S.media.length}</b><span class="xs muted">файлов в хранилище</span></div>
        <div class="stat" style="background:#ffffffb3"><b>${S.media.filter((x) => x.offline).length}</b><span class="xs muted">доступны офлайн</span></div>
        <div class="stat" style="background:#ffffffb3"><b>${S.media.filter((x) => (x.audience || []).includes('родитель')).length}</b><span class="xs muted">для родителей</span></div>
        <div class="stat" style="background:${nolic ? '#ffb6e840' : '#ffffffb3'}"><b>${nolic}</b><span class="xs muted">без лицензии</span></div>
      </div>
      <div class="card" style="padding:12px;margin-bottom:16px"><div class="row wrap" style="gap:10px">
        <input class="input" id="mq" placeholder="Поиск по названию или уроку" style="max-width:260px" value="${esc(ui.mQ)}">
        <div class="seg">${segBtn('mKind', 'all', 'Все')}${Object.entries(MKIND).map(([k, v]) => segBtn('mKind', k, v[0])).join('')}</div>
        <div class="seg">${segBtn('mAud', 'all', 'Для всех')}${segBtn('mAud', 'преподаватель', 'Преподавателю')}${segBtn('mAud', 'ученик', 'Ученику')}${segBtn('mAud', 'родитель', 'Родителю')}</div>
      </div></div>
      <div data-region="mlist">${mediaListInner()}</div>`;
  }

  // ---------------------------------------------------------------- Возрастные сценарии
  const MODS = {
    twoScreen: ['Двухэкранный режим', 'Планшет преподавателя + проектор'], offline: ['Офлайн-режим', 'Урок загружается заранее'],
    parent: ['Кабинет и задания родителя', 'Повторение дома вместе'], gamification: ['Геймификация', 'XP, серии, достижения, значки'],
    pron: ['Модуль произношения', 'Запись голоса, оценка тонов'], hanzi: ['Тренажёр иероглифов', 'Порядок черт, обводка'],
    srs: ['Словарь и SRS', 'Интервальное повторение'], dialog: ['Диалоговый тренажёр', 'Реплики в моделируемом диалоге'],
    analytics: ['Расширенная аналитика', 'Прогресс по навыкам и темам'], hsk: ['Подготовка к HSK', 'Задания по разделам экзамена'],
    plan: ['Персональный учебный план', 'Индивидуальная траектория'],
  };
  const UIMODE = { game: ['Игровой', 'Крупные элементы, минимум текста, аудио и картинки'], school: ['Школьный', 'Уроки, задания, тесты, расписание, прогресс'], teen: ['Продвинутый', 'Аналитика, HSK, словарь, диалоги, личный план'] };
  const AIMODE = { safe: ['Child Safety Mode', 'Только разрешённые учебные сценарии, без свободного чата, без запроса личных данных и внешних ссылок'], helper: ['Учебный помощник', 'Объяснить слово или задание, повторение, мини-викторины'], extended: ['Расширенный', 'Тематические диалоги, разбор ошибок, персональный план'] };
  const READING = { none: 'Без самостоятельного чтения', pinyin: 'Иероглифы + пиньинь', full: 'Иероглифы, пиньинь по запросу' };

  function vScenarios(sid) {
    const list = S.scenarios;
    const a = list.find((x) => x.id === sid) || list[0];
    if (!a) return '<div class="card"><div class="empty">Нет сценариев</div></div>';
    ui.scId = a.id;
    const used = S.methods.filter((m) => m.scenario === a.id);
    const seg = (k, map) => `<div class="seg">${Object.entries(map).map(([v, t]) => `<button class="${a[k] === v ? 'on' : ''}" data-act="setField" data-id="${a.id}" data-k="${k}" data-v="${v}">${Array.isArray(t) ? t[0] : t}</button>`).join('')}</div>`;
    return `<div class="row between wrap" style="margin-bottom:18px;gap:12px;align-items:flex-end"><div><h1>Возрастные сценарии</h1><p class="muted" style="margin:8px 0 0;max-width:660px">Сценарий определяет интерфейс ученика, набор модулей, форму прогресса, допустимые типы заданий и режим ИИ.</p></div><button class="btn dark lg" data-act="newScenario">${icon('plus', 16)}Новый сценарий</button></div>
      <div class="grid g3" style="margin-bottom:18px">${list.map((x) => `<a class="card flat zone ${x.id === a.id ? 'sel-card' : ''}" href="#scenarios/${x.id}"><div class="row between"><span class="chip ${x.accent}">${esc(x.age)}</span><span class="xs muted">${S.methods.filter((m) => m.scenario === x.id).length} прогр.</span></div><b style="font-size:17px">${esc(x.title)}</b><span class="xs muted">${esc(x.segment)} · ${UIMODE[x.ui][0].toLowerCase()} интерфейс · ${x.progress === 'soft' ? 'мягкий прогресс' : 'оценки'}</span></a>`).join('')}</div>
      <div class="scen-grid">
        <div class="stack">
          <div class="card stack">
            <div class="row" style="gap:10px"><input class="input bare title grow" data-id="${a.id}" data-k="title" value="${esc(a.title)}">${used.length ? '' : `<button class="btn icon ghost danger" data-act="confirmDel" data-id="${a.id}" data-what="сценарий">${icon('trash', 15)}</button>`}</div>
            <div class="grid g2">
              <label class="field"><span>Возраст</span><input class="input" data-id="${a.id}" data-k="age" value="${esc(a.age)}"></label>
              ${sel(a, 'segment', 'Сегмент', SEGMENTS)}
            </div>
            <div class="field"><span>Интерфейс ученика</span>${seg('ui', UIMODE)}<div class="xs muted" style="margin-top:6px">${UIMODE[a.ui][1]}</div></div>
            <div class="grid g2">
              <label class="field"><span>Чтение</span><select class="select" data-id="${a.id}" data-k="reading" data-rerender="1">${Object.entries(READING).map(([k, t]) => `<option value="${k}" ${a.reading === k ? 'selected' : ''}>${t}</option>`).join('')}</select></label>
              <div class="field"><span>Размер иероглифов</span>${seg('font', { M: 'M', L: 'L', XL: 'XL' })}</div>
            </div>
          </div>
          <div class="card stack">
            <div class="card-h" style="margin:0"><h3>Прогресс</h3>${seg('progress', { soft: 'Мягкая модель', grades: 'Оценки учителя' })}</div>
            ${a.progress === 'soft' ? `<div class="grid g2">${a.softLabels.map((t, i) => `<input class="input" data-sl="${a.id}" data-i="${i}" value="${esc(t)}">`).join('')}</div><div class="xs muted">Для младших детей прогресс показывается не оценками, а мягкими статусами.</div>` : '<div class="xs muted">Ученик и родитель видят реальные оценки преподавателя по заданиям и урокам.</div>'}
          </div>
          <div class="card">
            <div class="card-h"><h3>Модули платформы</h3><span class="xs muted">${Object.values(a.modules).filter(Boolean).length} из ${Object.keys(MODS).length}</span></div>
            <div class="grid g2" style="gap:8px">${Object.entries(MODS).map(([k, [t, d]]) => `<label class="mod-row"><span class="switch"><input type="checkbox" data-modk="${a.id}" data-m="${k}" ${a.modules[k] ? 'checked' : ''}><i></i></span><span><b class="small">${t}</b><span class="xs muted" style="display:block">${d}</span></span></label>`).join('')}</div>
          </div>
          <div class="card stack">
            <div class="card-h" style="margin:0"><h3>Домашние задания</h3><label class="row small" style="gap:8px">не дольше<input class="input" type="number" min="1" style="width:70px" data-type="num" data-id="${a.id}" data-k="hwMax" value="${a.hwMax}">мин</label></div>
            <div class="field"><span>Допустимые типы заданий <span class="muted" style="font-weight:500">— остальные в конструкторе ДЗ помечаются «вне сценария»</span></span>
              <div class="props">${Object.entries(TT).filter(([, v]) => !v.stage2).map(([k, v]) => `<span class="prop ${a.tasks.includes(k) ? 'on' : ''}" data-act="toggleScTask" data-id="${a.id}" data-k="${k}">${v.label}</span>`).join('')}</div></div>
          </div>
          <div class="card stack">
            <div class="card-h" style="margin:0"><h3>Режим ИИ-ассистента</h3><span class="chip purple">Этап 2</span></div>
            ${seg('ai', AIMODE)}
            <div class="hint-box">${icon('sparkle', 16)}<span>${AIMODE[a.ai][1]}</span></div>
          </div>
        </div>
        <aside class="sticky">
          <div class="eyebrow" style="margin-bottom:10px">Кабинет ученика · предпросмотр</div>
          <div data-region="scprev">${scenarioPreview(a)}</div>
          <div class="card" style="margin-top:14px;padding:16px"><h3 style="margin-bottom:8px">Используется в программах</h3>${used.length ? used.map((m) => `<a class="todo" href="#method/${m.id}"><span class="grow small"><b>${esc(m.title)}</b></span>${statusChip(m.status)}</a>`).join('') : '<div class="empty">Пока не назначен программам</div>'}</div>
        </aside>
      </div>`;
  }

  function scenarioPreview(a) {
    if (!a) return '';
    const on = (k) => a.modules[k];
    const hz = { M: 20, L: 28, XL: 38 }[a.font] || 28;
    const tile = (ic, t, sub) => `<div class="s-block" style="padding:10px"><div class="row" style="gap:8px">${icon(ic, 18)}<b class="xs">${t}</b></div>${sub ? `<div class="xs muted" style="margin-top:4px">${sub}</div>` : ''}</div>`;
    const progress = a.progress === 'soft'
      ? `<div class="s-block"><div class="s-title">Как у меня получается</div><div class="row wrap" style="gap:4px">${a.softLabels.map((t, i) => `<span class="chip ${i === 1 ? 'green' : ''}" style="font-size:10.5px">${esc(t)}</span>`).join('')}</div></div>`
      : `<div class="s-block"><div class="s-title">Оценки</div><div class="row" style="gap:6px">${['5', '5', '4', '5'].map((x) => `<span class="chip" style="background:#eef5ff">${x}</span>`).join('')}</div></div>`;
    let body = '';
    if (a.ui === 'game') {
      body = `<div class="s-scene" style="min-height:110px;justify-content:space-between;align-items:center"><span class="hero-char long zh" style="width:54px;height:54px;font-size:24px">龙</span><div class="bubble zh" style="font-size:${hz * 0.6}px">你好！</div><span class="hero-char mei zh" style="width:54px;height:54px;font-size:24px">妹</span></div>
        <button class="kid-btn lime" style="font-size:18px;padding:16px">${icon('play', 16)} Урок 4</button>
        <div class="grid" style="grid-template-columns:repeat(3,1fr);gap:8px">${[['music', 'Песни'], ['film', 'Мультики'], ['game', 'Игры']].map(([i, t]) => `<div class="s-block" style="text-align:center;padding:12px 4px">${icon(i, 26)}<div class="xs" style="font-weight:800;margin-top:4px">${t}</div></div>`).join('')}</div>
        ${on('parent') ? tile('heart', 'Задание с мамой или папой') : ''}
        ${on('gamification') ? `<div class="row" style="justify-content:center;gap:4px;font-size:22px">⭐⭐⭐<span style="opacity:.25">⭐⭐</span></div>` : ''}${progress}`;
    } else if (a.ui === 'school') {
      body = `<div><b>Привет, Миша!</b><div class="xs muted">Сегодня урок в 16:00</div></div>
        <div class="s-block" style="background:#141414;color:#fff"><div class="xs" style="opacity:.7">Следующий урок</div><b>Приветствие и знакомство</b><div class="zh" style="font-size:${hz}px;font-weight:900">你好</div></div>
        ${tile('send', 'Домашнее задание', '2 задания · до пятницы')}
        <div class="grid g2" style="gap:8px">${on('hanzi') ? tile('pen', 'Иероглифы') : ''}${on('pron') ? tile('mic', 'Произношение') : ''}${on('srs') ? tile('cards', 'Карточки') : ''}${on('dialog') ? tile('users', 'Диалоги') : ''}</div>
        ${on('gamification') ? `<div class="s-block"><div class="row between xs"><b>Уровень 3 · 240 XP</b><span>🔥 5 дней</span></div><div class="meter" style="margin-top:6px"><i style="width:60%;background:#c9ff4f"></i></div></div>` : ''}${progress}`;
    } else {
      body = `<div><b>Привет, Аня!</b><div class="xs muted">План на неделю: 4 из 6 целей</div></div>
        ${on('hsk') ? `<div class="s-block"><div class="s-title">Готовность к HSK 2</div>${[['Аудирование', 72], ['Чтение', 58], ['Лексика', 81]].map(([t, v]) => `<div class="xs" style="margin-top:6px">${t} · ${v}%</div><div class="meter"><i style="width:${v}%"></i></div>`).join('')}</div>` : ''}
        <div class="grid g2" style="gap:8px">${on('srs') ? tile('cards', 'Словарь', '214 слов · 30 на сегодня') : ''}${on('dialog') ? tile('users', 'Диалоги', 'В кафе · 6 реплик') : ''}${on('pron') ? tile('mic', 'Произношение', 'тоны 86%') : ''}${on('plan') ? tile('flag', 'Мой план', '3 темы') : ''}</div>
        ${on('analytics') ? tile('layers', 'Аналитика', 'Сложнее всего: 3-й тон, 把') : ''}${progress}`;
    }
    return `<div class="screen-frame" style="max-width:340px;margin:0 auto;border-radius:30px;padding:10px"><div class="screen phone">
      <div class="screen-head"><span>${esc(a.title)} · ${esc(a.age)}</span><span>${UIMODE[a.ui][0]}</span></div>
      <div class="screen-body" style="font-size:${a.font === 'XL' ? 15 : 13}px">${body}
        <div class="row" style="gap:6px;margin-top:auto"><span class="block-ico" style="background:#c9b4ff59;width:26px;height:26px">${icon('bot', 13)}</span><span class="xs muted">ИИ: ${AIMODE[a.ai][0]}</span></div>
      </div></div></div>`;
  }

  // ---------------------------------------------------------------- Шаблоны заданий
  function tplLesson() {
    const vocab = [];
    Object.values(S.lessons).forEach((l) => l.vocab.forEach((w) => { if (!vocab.some((x) => x.zh === w.zh)) vocab.push(w); }));
    return { id: '__tpl', hw: { id: '__tplhw', tasks: S.templates, check: 'auto', estimate: 0, dueDays: 0 }, vocab, assessment: 'soft', steps: [], parent: { note: '' } };
  }
  function vTemplates() {
    ui.lid = '__tpl';
    if (!S.templates.some((t) => t.id === ui.taskId)) ui.taskId = S.templates[0] ? S.templates[0].id : null;
    const L = tplLesson();
    const t = idx[ui.taskId];
    return `<div class="row between wrap" style="margin-bottom:18px;gap:12px;align-items:flex-end"><div><h1>Шаблоны заданий</h1><p class="muted" style="margin:8px 0 0;max-width:660px">Шаблон создаётся один раз и вставляется в ДЗ любого урока. Задание из урока можно сохранить в шаблоны кнопкой «В шаблоны».</p></div><button class="btn dark lg" data-act="addTaskModal">${icon('plus', 16)}Новый шаблон</button></div>
      <div class="builder hw">
        <div class="card sticky" style="padding:16px"><div class="row between" style="margin-bottom:6px"><h3>Шаблоны</h3><span class="xs muted">${S.templates.length} · вставлены ${S.templates.reduce((a, x) => a + (x.uses || 0), 0)} раз</span></div><div data-region="hwlist">${hwListInner(L)}</div></div>
        <div>${t ? taskEditor(L, t) : '<div class="card"><div class="empty">Создайте первый шаблон</div></div>'}</div>
        <div class="preview-col sticky"><div class="row between" style="margin-bottom:10px"><span class="eyebrow">Как увидит ученик</span><button class="btn xs" data-act="kidReset">${icon('refresh', 12)}Сбросить ответы</button></div><div data-region="kid">${t ? kidInner(L) : ''}</div></div>
      </div>
      <div class="row between" style="margin:32px 0 14px"><h2>Шаблоны обратной связи</h2><button class="btn sm" data-act="addFeedback">${icon('plus', 14)}Шаблон</button></div>
      <div class="grid g4">${S.feedback.map((f) => `<div class="card flat stack-s"><div class="row"><input class="input bare grow" style="font-weight:800" data-id="${f.id}" data-k="t" value="${esc(f.t)}"><button class="btn icon ghost danger" data-act="del" data-id="${f.id}">${icon('trash', 13)}</button></div><textarea class="textarea" style="min-height:90px" data-id="${f.id}" data-k="x">${esc(f.x)}</textarea></div>`).join('')}</div>`;
  }

  // ---------------------------------------------------------------- Модальные окна и тосты
  const modalRoot = document.getElementById('modal');
  function modal(html, wide) { modalRoot.innerHTML = `<div class="modal-bg" data-act="closeModalBg"><div class="modal ${wide ? 'wide' : ''}">${html}</div></div>`; }
  function closeModal() { modalRoot.innerHTML = ''; }
  const mh = (title, sub) => `<div class="modal-h"><div><h2>${title}</h2>${sub ? `<div class="small muted" style="margin-top:4px">${sub}</div>` : ''}</div><button class="btn icon ghost" data-act="closeModal">${icon('x', 16)}</button></div>`;
  let toastT;
  function toast(msg) {
    let el = document.querySelector('.toast');
    if (!el) { el = document.createElement('div'); el.className = 'toast'; document.body.appendChild(el); }
    el.innerHTML = `<i>✓</i>${esc(msg)}`;
    clearTimeout(toastT);
    toastT = setTimeout(() => el.remove(), 2600);
  }

  const curLesson = () => (ui.lid === '__tpl' ? tplLesson() : S.lessons[ui.lid]);
  const curStep = () => idx[ui.stepId];
  function refresh(names) { names.forEach((r) => document.querySelectorAll(`[data-region="${r}"]`).forEach((n) => { n.innerHTML = REG[r](); })); }
  const REG = {
    steps: () => stepsListInner(curLesson()),
    student: () => previewInner(curLesson()),
    hwlist: () => hwListInner(curLesson()),
    kid: () => kidInner(curLesson()),
    scprev: () => scenarioPreview(idx[ui.scId]),
    mlist: () => mediaListInner(),
  };

  // ---------------------------------------------------------------- Действия
  const A = {
    reset() { modal(`${mh('Сбросить демо-данные?', 'Все изменения в этом браузере будут заменены исходными методиками.')}<div class="modal-f"><button class="btn" data-act="closeModal">Отмена</button><button class="btn dark" data-act="doReset">Сбросить</button></div>`); },
    doReset() { S = clone(window.SEED); reindex(); save(); closeModal(); ui.stepId = null; ui.taskId = null; ui.kid = {}; go('#home'); toast('Демо-данные восстановлены'); },
    closeModal, closeModalBg(d, el, e) { if (e.target === el) closeModal(); },
    toast(d) { toast(d.msg); },
    filterMethods(d) { ui.methodsFilter = d.v; render(); },

    newMethod() {
      modal(`${mh('Создать курс', 'Стандартизированный шаблон методики Shidao')}
        <div class="stack">
          <label class="field"><span>Название</span><input class="input" id="nmTitle" placeholder="Например: Китайский для дошкольников, 2-й год"></label>
          <div class="grid g2"><label class="field"><span>Сегмент</span><select class="select" id="nmSeg">${SEGMENTS.map((x) => `<option>${x}</option>`).join('')}</select></label><label class="field"><span>Возрастной сценарий</span><select class="select" id="nmAge">${S.scenarios.map((a) => `<option value="${a.id}">${esc(a.title)} · ${esc(a.age)}</option>`).join('')}</select></label></div>
          <label class="field"><span>Формат</span><input class="input" id="nmFormat" value="Группа 4–8 детей, 45 мин"></label>
          <label class="field"><span>Структура</span><select class="select" id="nmTpl"><option value="1">1 уровень · 1 модуль (пустая)</option><option value="3">3 уровня · по 2 модуля</option></select></label>
        </div>
        <div class="modal-f"><button class="btn" data-act="closeModal">Отмена</button><button class="btn dark" data-act="createMethod">Создать курс</button></div>`);
      setTimeout(() => document.getElementById('nmTitle').focus(), 30);
    },
    createMethod() {
      const v = (id) => document.getElementById(id).value.trim();
      const levels = +v('nmTpl') === 3 ? [1, 2, 3].map((i) => ({ id: uid('v'), title: `Уровень ${i}`, modules: [1, 2].map((j) => ({ id: uid('d'), title: `Модуль ${(i - 1) * 2 + j}`, lessons: [] })) })) : [{ id: uid('v'), title: 'Уровень 1', modules: [{ id: uid('d'), title: 'Модуль 1', lessons: [] }] }];
      const m = { id: uid('m'), title: v('nmTitle') || 'Новый курс', direction: 'Китайский язык', segment: v('nmSeg'), age: idx[v('nmAge')] ? idx[v('nmAge')].age : '', scenario: v('nmAge'), format: v('nmFormat'), description: '', status: 'draft', version: '0.1', updated: 'сегодня', accent: ['pink', 'blue', 'purple', 'green'][S.methods.length % 4], assigned: [], history: [{ v: '0.1', date: '03 ноя 2026', who: 'Е. Ли', note: 'Создана методика', status: 'draft' }], levels };
      S.methods.push(m); reindex(); save(); closeModal(); go(`#method/${m.id}`); toast('Курс создан');
    },
    addLevel(d) { const m = idx[d.id]; m.levels.push({ id: uid('v'), title: `Уровень ${m.levels.length + 1}`, modules: [{ id: uid('d'), title: 'Новый модуль', lessons: [] }] }); reindex(); save(); render(); },
    addModule(d) { const v = idx[d.id]; v.modules.push({ id: uid('d'), title: 'Новый модуль', lessons: [] }); reindex(); save(); render(); },
    openLesson(d) { go(`#lesson/${d.id}/steps`); },
    newLesson(d) {
      modal(`${mh('Новый урок', 'Урок появится в модуле в статусе «Черновик»')}
        <div class="stack">
          <label class="field"><span>Тема урока</span><input class="input" id="nlTitle" placeholder="Например: Цвета"></label>
          <label class="field"><span>Образовательная цель</span><textarea class="textarea" id="nlGoal" placeholder="Что ребёнок сможет после урока"></textarea></label>
          <div class="field"><span>Основа</span><div class="stack-s">
            <label class="check"><input type="radio" name="nlTpl" value="blank" checked>Пустой урок · 1 шаг</label>
            <label class="check"><input type="radio" name="nlTpl" value="std">Стандартный сценарий Shidao · приветствие, лексика, игра, движение, песня, прощание</label>
            <label class="check"><input type="radio" name="nlTpl" value="ref">Копия структуры эталонного урока 4 «Цвета» · 16 шагов</label>
          </div></div>
        </div>
        <div class="modal-f"><button class="btn" data-act="closeModal">Отмена</button><button class="btn dark" data-act="createLesson" data-mod="${d.mod}">Создать урок</button></div>`);
      setTimeout(() => document.getElementById('nlTitle').focus(), 30);
    },
    createLesson(d) {
      const mod = idx[d.mod];
      const tpl = (document.querySelector('input[name="nlTpl"]:checked') || {}).value;
      const m = S.methods.find((x) => x.levels.some((v) => v.modules.includes(mod)));
      const mk = (title, duration, script, blocks, activity = 'activity') => ({ id: uid('s'), title, duration, goal: '', script, phrases: [], answers: '', props: [], notes: '', activity, words: [], mats: [], tbox: { title: '', items: '' }, blocks });
      let steps = [mk('Приветствие', 3, 'Поздоровайтесь с группой.', [newBlock('media')])];
      if (tpl === 'std') steps = [mk('Приветствие и песня', 3, 'Песня-разминка, приветствие.', [newBlock('media')]), mk('Сцена с героями', 3, 'Введите тему через историю Сяо Лон и Сяо Мей.', [newBlock('scene')]), mk('Новые слова', 5, 'Покажите карточки, хоровое повторение.', [newBlock('text')]), mk('Игра', 5, 'Игра на закрепление.', [newBlock('drag')]), mk('Движение', 3, 'Активная пауза.', [newBlock('static')]), mk('Песня', 3, 'Финальная песня.', [newBlock('media')]), mk('Прощание и ДЗ', 2, 'Объясните домашнее задание.', [newBlock('scene')])];
      const ref = Object.values(S.lessons).find((l) => l.reference);
      if (tpl === 'ref' && ref) steps = renew(clone(ref.steps));
      const L = { id: uid('L'), num: 0, title: document.getElementById('nlTitle').value.trim() || 'Новый урок', goal: document.getElementById('nlGoal').value.trim(), age: m ? m.age : '5–6 лет', difficulty: 'Стартовый', duration: 45, formats: ['offline'], status: 'draft', version: '0.1', vocab: [], props: tpl === 'ref' && ref ? ref.props.slice() : ['персонажи курса', 'карточки'], steps, hw: { id: uid('h'), title: 'Домашнее задание', dueDays: 7, check: 'auto', grading: 'soft', withParent: false, estimate: 7, parentNote: '', tasks: [] }, parent: { note: '' }, assessment: 'soft' };
      Object.assign(L, { topic: L.title, result: '', prep: '', about: '', materials: tpl === 'ref' && ref ? renew(clone(ref.materials)) : { presentation: { title: 'Презентация урока', slides: 0, formats: 'PPTX, PDF' }, cards: [], files: [] } });
      Object.assign(L.hw, { about: '', flow: '', materials: [], format: '' });
      S.lessons[L.id] = L; mod.lessons.push(L.id); reindex(); save(); closeModal(); ui.stepId = null; go(`#lesson/${L.id}/passport`); toast('Урок создан');
    },
    dupLesson(d) {
      const L = S.lessons[d.id]; const copy = renew(clone(L)); copy.title = `${L.title} (копия)`; copy.status = 'draft'; copy.reference = false; copy.version = '0.1';
      S.lessons[copy.id] = copy; const mod = moduleOf(L.id); mod.lessons.splice(mod.lessons.indexOf(L.id) + 1, 0, copy.id); reindex(); save(); render(); toast('Урок продублирован');
    },
    confirmDel(d) {
      modal(`${mh(`Удалить ${d.what}?`, 'Опубликованные версии методики у преподавателей не изменятся — удаление попадёт в следующую версию.')}<div class="modal-f"><button class="btn" data-act="closeModal">Отмена</button><button class="btn dark" data-act="doDel" data-id="${d.id}">Удалить</button></div>`);
    },
    doDel(d) {
      if (S.lessons[d.id]) { const mod = moduleOf(d.id); if (mod) mod.lessons.splice(mod.lessons.indexOf(d.id), 1); delete S.lessons[d.id]; reindex(); }
      else {
        const o = idx[d.id];
        if (o && o.modules) o.modules.forEach((md) => md.lessons.forEach((l) => delete S.lessons[l]));
        if (o && o.lessons) o.lessons.forEach((l) => delete S.lessons[l]);
        removeById(d.id);
      }
      save(); closeModal(); render(); toast('Удалено');
    },
    del(d, el) {
      removeById(d.id); save();
      if (d.id === ui.taskId) ui.taskId = null;
      render();
    },
    move(d) {
      const arr = parentArray(d.id); if (!arr) return;
      const i = arr.findIndex((x) => x.id === d.id); const j = i + (+d.dir);
      if (j < 0 || j >= arr.length) return;
      [arr[i], arr[j]] = [arr[j], arr[i]]; save(); render();
    },
    setField(d) { const o = idx[d.id]; o[d.k] = d.v; save(); render(); },

    versions(d) {
      const m = idx[d.id];
      modal(`${mh(`Версии · ${esc(m.title)}`, 'Методика хранится как эталон. Проведённые занятия и результаты ссылаются на версию и не меняются.')}
        ${m.history.map((h, i) => `<div class="history-item" style="grid-template-columns:60px 1fr auto;align-items:center"><span class="ver">v${esc(h.v)}</span><div><div>${esc(h.note)}</div><div class="xs muted">${esc(h.date)} · ${esc(h.who)}</div></div><div class="row">${statusChip(h.status)}${i > 0 ? `<button class="btn xs" data-act="toast" data-msg="Версия v${esc(h.v)} открыта только для чтения">Открыть</button>` : ''}</div></div>`).join('')}
        <div class="modal-f"><button class="btn" data-act="closeModal">Закрыть</button></div>`);
    },
    assign(d) {
      const m = idx[d.id];
      modal(`${mh('Назначить методику', esc(m.title))}
        <div class="stack">${S.orgs.map((o) => `<div class="card soft" style="padding:14px"><label class="check"><input type="checkbox" data-org="${o.id}" ${m.assigned.includes(o.id) ? 'checked' : ''}><b>${esc(o.title)}</b><span class="chip">${esc(o.type)}</span></label>
          <div class="stack-s" style="margin:10px 0 0 28px">${o.groups.map((g) => `<label class="check small"><input type="checkbox" data-grp="${g.id}" ${m.assigned.includes(g.id) ? 'checked' : ''}>${esc(g.title)}</label>`).join('')}</div></div>`).join('')}</div>
        <div class="modal-f"><button class="btn" data-act="closeModal">Отмена</button><button class="btn dark" data-act="doAssign" data-id="${m.id}">Сохранить назначение</button></div>`);
    },
    doAssign(d) {
      const m = idx[d.id];
      m.assigned = [...modalRoot.querySelectorAll('input[data-org]:checked')].map((x) => x.dataset.org).concat([...modalRoot.querySelectorAll('input[data-grp]:checked')].map((x) => x.dataset.grp));
      save(); closeModal(); render(); toast(`Назначено: ${m.assigned.length}`);
    },
    publish(d) {
      const m = idx[d.id]; const ls = methodLessons(m);
      const checks = [
        [ls.length > 0, `В программе ${ls.length} ${plural(ls.length, 'урок', 'урока', 'уроков')}`],
        [ls.every((l) => l.steps.length), 'У каждого урока есть шаги'],
        [ls.every((l) => l.hw.tasks.length), `ДЗ заполнено ${ls.filter((l) => l.hw.tasks.length).length} из ${ls.length}`],
        [ls.every((l) => stepMin(l) <= l.duration), `Длительность шагов укладывается в урок${ls.filter((l) => stepMin(l) > l.duration).map((l) => ` · превышение: «${l.title}»`).join('')}`],
        [true, 'У медиафайлов указаны источник и лицензия'],
      ];
      modal(`${mh(`Публикация v${nextVersion(m.version)}`, esc(m.title))}
        <div class="stack">
          <div class="card soft" style="padding:14px">${checks.map(([ok, t]) => `<div class="row small" style="padding:4px 0"><span class="radio-dot ${ok ? 'on' : ''}" style="${ok ? '' : 'border-color:#c77700;color:#c77700'}">${ok ? icon('check', 12) : '!'}</span>${esc(t)}</div>`).join('')}</div>
          <label class="field"><span>Что изменилось</span><textarea class="textarea" id="pubNote" placeholder="Например: добавлен урок 4 «Цвета», обновлено ДЗ к уроку 3"></textarea></label>
          <div class="hint-box">${icon('sparkle', 16)}<span>Преподаватели получат новую версию при следующем подключении. Уже выданные домашние задания и сохранённые результаты учеников задним числом не меняются. Уроки, загруженные для офлайна, во время занятия не меняются.</span></div>
        </div>
        <div class="modal-f"><button class="btn" data-act="closeModal">Отмена</button><button class="btn dark" data-act="doPublish" data-id="${m.id}">${icon('send', 15)}Опубликовать</button></div>`);
    },
    doPublish(d) {
      const m = idx[d.id]; const v = nextVersion(m.version);
      m.history.forEach((h) => { if (h.status === 'published') h.status = 'archived'; });
      m.history.unshift({ v, date: '03 ноя 2026', who: 'Е. Ли', note: document.getElementById('pubNote').value.trim() || 'Обновление программы', status: 'published' });
      m.version = v; m.status = 'published'; m.updated = 'сегодня';
      methodLessons(m).forEach((l) => { l.status = 'published'; l.version = v; });
      save(); closeModal(); render(); toast(`Опубликована версия ${v}`);
    },

    // --- урок
    saveVersion(d) { const L = S.lessons[d.id]; L.version = nextVersion(L.version); save(); render(); toast(`Сохранена версия урока ${L.version}`); },
    toReview(d) {
      const L = S.lessons[d.id];
      if (L.status === 'published') { toast('Урок опубликован в составе методики'); return; }
      L.status = L.status === 'review' ? 'published' : 'review'; save(); render();
      toast(L.status === 'review' ? 'Урок отправлен на проверку' : 'Урок опубликован');
    },
    toggleFormat(d) { const L = curLesson(); const i = L.formats.indexOf(d.k); if (i < 0) L.formats.push(d.k); else L.formats.splice(i, 1); save(); render(); },
    addVocab() { curLesson().vocab.push({ id: uid('w'), zh: '', py: '', ru: '', audio: false }); reindex(); save(); render(); },
    addProp() { const el = document.getElementById('newProp'); const v = el.value.trim(); if (!v) return; curLesson().props.push(v); save(); render(); },
    delProp(d) { curLesson().props.splice(+d.i, 1); save(); render(); },
    fakeUpload(d) { toast(`Загрузка: ${d.what} — в прототипе не сохраняется`); },
    pickMedia() {
      modal(`${mh('Выбрать из медиатеки')}<div class="stack-s">${S.media.filter((x) => ['video', 'song', 'audio'].includes(x.kind)).map((x) => `<button class="pal-item" style="flex-direction:row;align-items:center;width:100%" data-act="useMedia" data-t="${esc(x.title)}" data-k="${x.kind}">${icon(x.kind === 'video' ? 'film' : 'music', 16)}<b class="grow">${esc(x.title)}</b><small>${esc(x.lesson)}</small></button>`).join('')}</div>`);
    },
    useMedia(d) { const b = idx[ui.blockId] && idx[ui.blockId].type === 'media' ? idx[ui.blockId] : curStep().blocks.find((x) => x.type === 'media'); if (b) { b.title = d.t; b.kind = d.k === 'audio' ? 'audio' : d.k; } save(); closeModal(); render(); },

    // --- шаги
    selStep(d) { ui.stepId = d.id; ui.blockId = null; refresh(['steps', 'student']); const c = document.querySelector('.builder > div:nth-child(2)'); if (c) c.innerHTML = stepEditor(curLesson(), idx[d.id]); },
    stepView(d) { ui.stepView = d.v; render(); },
    addStep() { const L = curLesson(); const s = { id: uid('s'), title: 'Новый шаг', duration: 3, goal: '', script: '', phrases: [], answers: '', props: [], notes: '', activity: 'activity', words: [], mats: [], tbox: { title: '', items: '' }, blocks: [] }; const i = L.steps.findIndex((x) => x.id === ui.stepId); L.steps.splice(i + 1, 0, s); ui.stepId = s.id; ui.stepView = 'student'; reindex(); save(); render(); },
    dupStep(d) { const L = curLesson(); const s = idx[d.id]; const c = renew(clone(s)); c.title = `${s.title} (копия)`; L.steps.splice(L.steps.indexOf(s) + 1, 0, c); ui.stepId = c.id; reindex(); save(); render(); },
    addPhrase(d) { idx[d.id].phrases.push({ id: uid('f'), zh: '', py: '', ru: '' }); reindex(); save(); render(); },
    toggleStepProp(d) { const s = curStep(); const i = s.props.indexOf(d.p); if (i < 0) s.props.push(d.p); else s.props.splice(i, 1); save(); render(); },
    addBlock(d) { const b = newBlock(d.type); curStep().blocks.push(b); ui.blockId = b.id; reindex(); save(); render(); toast(`Добавлен компонент «${COMP[d.type].label}»`); },
    selBlock(d) { ui.blockId = d.id; document.querySelectorAll('.block').forEach((x) => x.classList.toggle('sel', x.querySelector(`[data-id="${d.id}"]`) && x.querySelector('.block-h').dataset.id === d.id)); },
    toggleCtx(d) { const b = idx[d.id]; const i = b.ctx.indexOf(d.c); if (i < 0) b.ctx.push(d.c); else b.ctx.splice(i, 1); save(); render(); },
    addItem(d) {
      const b = idx[d.id];
      const tpl = { items: { zh: '', py: '', ru: '', color: '#70b7ff' }, lines: { who: '小妹', zh: '', py: '', ru: '' }, pairs: { left: '', right: '🎈', color: '#ffd23f' } }[d.arr];
      b[d.arr].push({ id: uid('i'), ...tpl }); reindex(); save(); render();
    },
    addSwatch(d) { idx[d.id].swatches.push('#70b7ff'); save(); render(); },
    delSwatch(d) { idx[d.id].swatches.splice(+d.i, 1); save(); render(); },

    // --- ДЗ
    selTask(d) { if (!d.id) return; ui.taskId = d.id; render(); },
    addTaskModal() {
      const inTpl = ui.lid === '__tpl';
      const m = inTpl ? null : methodOf(ui.lid);
      const sc = m && S.scenarios.find((x) => x.id === m.scenario);
      const grp = (f, title) => `<div class="eyebrow" style="margin:16px 0 8px">${title}</div><div class="palette">${Object.entries(TT).filter(([, v]) => f(v)).map(([k, v]) => `<button class="pal-item ${v.stage2 ? 'disabled' : ''}" ${v.stage2 ? '' : `data-act="addTask" data-type="${k}"`}><span class="block-ico" style="background:#14141409">${icon(v.icon, 15)}</span><b>${v.label}</b><small>${v.desc}</small>${sc && !v.stage2 && !sc.tasks.includes(k) ? `<span class="chip yellow" style="font-size:10.5px;align-self:flex-start">вне сценария</span>` : ''}</button>`).join('')}</div>`;
      const tpls = inTpl ? '' : `<div class="eyebrow" style="margin:4px 0 8px">Из шаблонов заданий</div><div class="palette">${S.templates.map((t) => `<button class="pal-item" data-act="insertTpl" data-t="${t.id}" data-l="${ui.lid}"><span class="block-ico" style="background:#c9ff4f66">${icon(TT[t.type].icon, 15)}</span><b>${esc(t.title)}</b><small>${TT[t.type].label}</small></button>`).join('')}</div>`;
      modal(`${mh(inTpl ? 'Новый шаблон задания' : 'Добавить задание', inTpl ? 'Выберите тип задания' : sc ? `Возрастной сценарий программы: ${esc(sc.title)} · ${esc(sc.age)}` : '')}${tpls}${grp((v) => v.mvp && v.check === 'auto', 'Автопроверка')}${grp((v) => v.mvp && v.check !== 'auto', 'Проверяет преподаватель')}${grp((v) => !v.mvp, 'Расширенные задания · после MVP')}`, true);
    },
    addTask(d) { const t = newTask(d.type); curLesson().hw.tasks.push(t); ui.taskId = t.id; reindex(); save(); closeModal(); render(); toast(`Добавлено: ${TT[d.type].label}`); },
    dupTask(d) { const L = curLesson(); const t = idx[d.id]; const c = renew(clone(t)); c.title = `${t.title} (копия)`; L.hw.tasks.splice(L.hw.tasks.indexOf(t) + 1, 0, c); ui.taskId = c.id; reindex(); save(); render(); },
    setCorrect(d) { idx[d.t].options.forEach((o) => { o.correct = o.id === d.id; }); delete ui.kid[d.t]; save(); render(); },
    addOpt(d) { idx[d.id].options.push({ id: uid('o'), text: '', correct: false }); reindex(); save(); render(); },
    addPair(d) { idx[d.id].pairs.push({ id: uid('o'), word: '', pic: '⭐' }); reindex(); save(); render(); },
    addWord(d) { idx[d.id].words.push({ id: uid('o'), text: '' }); reindex(); save(); render(); },
    toggleCardWord(d) { const t = idx[d.id]; const i = t.words.indexOf(d.w); if (i < 0) t.words.push(d.w); else t.words.splice(i, 1); save(); render(); },

    // --- интерактив ученика
    kidReset() { ui.kid = {}; refresh(['kid']); },
    kidPlay() { toast('▶ Воспроизведение аудио'); },
    kidSkip(d) { ui.kid[d.t] = { skipped: true }; refresh(['kid']); },
    kidPick(d) { const st = ui.kid[d.t]; const o = idx[d.o]; st.picked = d.o; st.ok = !!o.correct; refresh(['kid']); },
    kidMatchWord(d) { ui.kid[d.t].sel = d.id; ui.kid[d.t].wrong = null; refresh(['kid']); },
    kidMatchPic(d) {
      const st = ui.kid[d.t];
      if (!st.sel) return;
      if (st.sel === d.id) { st.done.push(d.id); st.sel = null; st.wrong = null; } else st.wrong = d.id;
      st.ok = st.done.length === idx[d.t].pairs.length; refresh(['kid']);
    },
    kidOrder(d) { ui.kid[d.t].ans.push(d.id); refresh(['kid']); },
    kidUnorder(d) { const st = ui.kid[d.t]; st.ans.splice(st.ans.indexOf(d.id), 1); st.checked = false; refresh(['kid']); },
    kidCheck(d) {
      const st = ui.kid[d.t]; const t = idx[d.t]; st.checked = true;
      st.ok = t.type === 'order' ? st.ans.join() === t.words.map((w) => w.id).join() : (st.val || '').trim() === String(t.answer).trim();
      refresh(['kid']);
    },
    kidFlip(d) { ui.kid[d.t].flip = !ui.kid[d.t].flip; refresh(['kid']); },
    kidNextCard(d) { const st = ui.kid[d.t]; st.i = (st.i || 0) + 1; st.flip = false; if (d.ok === '1') st.known = (st.known || 0) + 1; st.ok = st.i >= (idx[d.t].words.length || 3); refresh(['kid']); },
    kidMic(d) { const st = ui.kid[d.t]; if (st.rec) { st.rec = false; st.ok = true; } else st.rec = true; refresh(['kid']); },
    kidDone(d) { ui.kid[d.t].ok = true; refresh(['kid']); },

    // --- MVP: материалы, шаги, предпросмотр
    toggleKind(d) { const w = idx[d.id]; w.kind = w.kind === 'phrase' ? 'word' : 'phrase'; save(); render(); },
    toggleStepWord(d) { const s = curStep(); s.words = s.words || []; const i = s.words.indexOf(d.w); if (i < 0) s.words.push(d.w); else s.words.splice(i, 1); save(); render(); },
    toggleStepMat(d) { const s = curStep(); s.mats = s.mats || []; const i = s.mats.indexOf(d.m); if (i < 0) s.mats.push(d.m); else s.mats.splice(i, 1); save(); render(); },
    toggleHwMat(d) { const hw = curLesson().hw; hw.materials = hw.materials || []; const i = hw.materials.indexOf(d.m); if (i < 0) hw.materials.push(d.m); else hw.materials.splice(i, 1); save(); render(); },
    toggleBlockCard(d) { const b = idx[d.id]; const i = b.cards.indexOf(d.z); if (i < 0) b.cards.push(d.z); else b.cards.splice(i, 1); save(); render(); },
    setBlockCorrect(d) { idx[d.b].options.forEach((o) => { o.correct = o.id === d.id; }); save(); render(); },
    addBlockOpt(d) { idx[d.id].options.push({ id: uid('i'), text: '', correct: false }); reindex(); save(); render(); },
    addCard() { curLesson().materials.cards.push({ id: uid('c'), zh: '', py: '', ru: '', pic: '⭐', audio: false }); reindex(); save(); render(); },
    cardsFromVocab() { const L = curLesson(); let n = 0; L.vocab.filter((w) => w.kind !== 'phrase').forEach((w) => { if (!L.materials.cards.some((c) => c.zh === w.zh)) { L.materials.cards.push({ id: uid('c'), zh: w.zh, py: w.py, ru: w.ru, pic: '⭐', audio: true }); n += 1; } }); reindex(); save(); render(); toast(n ? `Добавлено карточек: ${n}` : 'Все слова урока уже есть в наборе'); },
    addFile() { curLesson().materials.files.push({ id: uid('fl'), title: 'Новый файл', note: '' }); reindex(); save(); render(); },
    setPv(d) { ui.pv = d.v; render(); },
    tvTab(d) { ui.tvTab = d.v; render(); },
    tvStep(d) { ui.tvStep = Math.max(0, +d.i); render(); },
    tvToScreen(d) { ui.pv = 'duo'; ui.duoStep = +d.i; ui.liveStep = +d.i; ui.revealN = 1; ui.paused = false; render(); window.scrollTo(0, 0); },
    teacherProgram(d) {
      const m = idx[d.id]; const ls = methodLessons(m); const ti = m.teacherInfo || {};
      const matCount = (L) => { const M = L.materials || { cards: [], files: [] }; const vids = L.steps.reduce((a, s) => a + s.blocks.filter((b) => b.type === 'media' && b.kind === 'video').length, 0); const aud = L.steps.reduce((a, s) => a + s.blocks.filter((b) => b.type === 'media' && b.kind !== 'video').length, 0); return `${icon('film', 12)} ${vids} ${icon('music', 12)} ${aud} ${icon('cards', 12)} ${M.cards.length} ${icon('file', 12)} ${M.files.length}`; };
      modal(`${mh('Как видит преподаватель', 'Кабинет преподавателя → Методики → ' + esc(m.title))}
        <div class="tv-wrap">
          <div class="xs muted">← Методики</div>
          <h2 style="font-size:28px;margin:4px 0 6px">${esc(m.title)}${m.zh ? ` – <span class="zh">${esc(m.zh)}</span>` : ''}</h2>
          <p class="small muted" style="margin:0 0 10px">${esc(m.description)}</p>
          <div class="row wrap" style="gap:6px"><span class="chip purple">${icon('book', 12)}Уроков: ${ls.length}</span><span class="chip yellow">${icon('clock', 12)}Урок: ${m.lessonMin || 45} минут</span><span class="chip blue">Возраст: ${esc(m.age)}</span><span class="chip">${icon('users', 12)}Группа: ${esc(m.group || '')}</span></div>
          <div class="card" style="margin-top:14px;padding:16px">
            <div class="eyebrow" style="margin-bottom:8px">Описание</div>
            ${m.goals ? `<p class="small"><b>Цели обучения.</b> ${esc(m.goals)}</p>` : ''}
            ${TEACHER_INFO.filter(([k]) => ti[k]).map(([k, t]) => `<p class="small"><b>${t}.</b> ${esc(ti[k])}</p>`).join('')}
            <div class="eyebrow" style="margin:16px 0 8px">Уроки</div>
            <div style="overflow-x:auto"><table class="table"><thead><tr><th>Урок</th><th>Длительность</th><th>Шаги</th><th>Новые слова</th><th>Новые фразы</th><th>Материалы</th></tr></thead><tbody>
              ${ls.map((L) => `<tr><td class="small">Урок ${numOf(L)}. ${esc(L.title)}</td><td class="small">${L.duration} мин</td><td class="small">${L.steps.length}</td><td class="small">${L.vocab.filter((w) => w.kind !== 'phrase').length}</td><td class="small">${L.vocab.filter((w) => w.kind === 'phrase').length}</td><td class="xs muted" style="white-space:nowrap">${matCount(L)}</td></tr>`).join('')}
            </tbody></table></div>
          </div>
        </div>`, true);
    },

    // --- шаблоны
    insertTpl(d) {
      const src = idx[d.t]; const L = S.lessons[d.l]; const c = renew(clone(src)); delete c.uses;
      L.hw.tasks.push(c); src.uses = (src.uses || 0) + 1; if (ui.lid === d.l) ui.taskId = c.id;
      reindex(); save(); closeModal(); render(); toast(`Шаблон добавлен в ДЗ урока ${numOf(L)} «${L.title}»`);
    },
    useTplModal(d) {
      modal(`${mh('Добавить шаблон в урок', esc(idx[d.id].title))}${S.methods.map((m) => { const ls = methodLessons(m); return ls.length ? `<div class="eyebrow" style="margin:14px 0 8px">${esc(m.title)}</div><div class="stack-s">${ls.map((L) => `<button class="pal-item" style="flex-direction:row;align-items:center;width:100%" data-act="insertTpl" data-t="${d.id}" data-l="${L.id}"><span class="step-n">${numOf(L)}</span><b class="grow">${esc(L.title)}</b><small>ДЗ: ${L.hw.tasks.length}</small></button>`).join('')}</div>` : ''; }).join('')}`);
    },
    saveTpl(d) { const c = renew(clone(idx[d.id])); c.uses = 0; S.templates.push(c); reindex(); save(); toast('Сохранено в «Шаблоны заданий»'); },
    addFeedback() { S.feedback.push({ id: uid('fb'), t: 'Новый шаблон', x: '' }); reindex(); save(); render(); },

    // --- сценарии
    newScenario() { const a = renew(clone(S.scenarios[1] || S.scenarios[0])); a.title = 'Новый сценарий'; a.accent = 'pink'; S.scenarios.push(a); reindex(); save(); go(`#scenarios/${a.id}`); toast('Сценарий создан'); },
    toggleScTask(d) { const a = idx[d.id]; const i = a.tasks.indexOf(d.k); if (i < 0) a.tasks.push(d.k); else a.tasks.splice(i, 1); save(); render(); },

    // --- материалы
    mediaFilter(d) { ui[d.f] = d.v; render(); },
    editMedia(d) {
      const x = d.id ? idx[d.id] : { title: '', kind: 'video', lesson: '', audience: ['ученик'], source: '', license: 'Собственный контент Shidao', offline: true };
      modal(`${mh(d.id ? 'Материал' : 'Загрузить материал', 'Файл попадает в хранилище платформы и доступен для офлайн-загрузки урока')}
        <div class="stack">
          ${d.id ? '' : `<div class="upload" data-act="toast" data-msg="В прототипе файл не загружается">${icon('upload', 26)}<div style="margin-top:6px;font-weight:800">Перетащите файл или нажмите</div><div class="xs">Аудио, видео, изображения, PDF, презентации, карточки</div></div>`}
          <label class="field"><span>Название</span><input class="input" id="mdTitle" value="${esc(x.title)}"></label>
          <div class="grid g2"><label class="field"><span>Тип</span><select class="select" id="mdKind">${Object.entries(MKIND).map(([k, v]) => `<option value="${k}" ${x.kind === k ? 'selected' : ''}>${v[0]}</option>`).join('')}</select></label>
          <label class="field"><span>Уроки</span><input class="input" id="mdLesson" value="${esc(x.lesson)}" placeholder="Например: Урок 4"></label></div>
          <div class="field"><span>Для кого</span><div class="row wrap">${['преподаватель', 'ученик', 'родитель'].map((a) => `<label class="check small"><input type="checkbox" data-aud="${a}" ${x.audience.includes(a) ? 'checked' : ''}>${a}</label>`).join('')}</div></div>
          <div class="grid g2"><label class="field"><span>Источник</span><input class="input" id="mdSource" value="${esc(x.source)}"></label>
          <label class="field"><span>Лицензия</span><input class="input" id="mdLicense" value="${esc(x.license)}" list="licList"><datalist id="licList"><option>Собственный контент Shidao</option><option>Лицензия CC BY 4.0</option><option>Лицензия до 12.2027</option><option>Не указана</option></datalist></label></div>
          <label class="check small"><input type="checkbox" id="mdOffline" ${x.offline ? 'checked' : ''}>Загружать на устройство преподавателя для офлайн-урока</label>
        </div>
        <div class="modal-f"><button class="btn" data-act="closeModal">Отмена</button><button class="btn dark" data-act="saveMedia" data-id="${d.id || ''}">Сохранить</button></div>`);
    },
    saveMedia(d) {
      const g = (id) => document.getElementById(id).value.trim();
      const data = { title: g('mdTitle') || 'Новый материал', kind: g('mdKind'), lesson: g('mdLesson') || '—', source: g('mdSource') || '—', license: g('mdLicense') || 'Не указана', offline: document.getElementById('mdOffline').checked, audience: [...modalRoot.querySelectorAll('input[data-aud]:checked')].map((x) => x.dataset.aud) };
      if (d.id) Object.assign(idx[d.id], data); else S.media.unshift({ id: uid('x'), size: '—', ...data });
      reindex(); save(); closeModal(); render(); toast(d.id ? 'Материал обновлён' : 'Материал добавлен');
    },

    // --- двухэкранный режим
    duoPick(d) { ui.duoStep = +d.i; render(); },
    duoNav(d) { ui.duoStep += +d.d; render(); },
    duoLive() { ui.liveStep = ui.duoStep; ui.revealN = 1; ui.paused = false; render(); },
    duoReveal() { ui.revealN += 1; render(); },
    duoPause() { ui.paused = !ui.paused; render(); },
  };

  document.addEventListener('click', (e) => {
    const el = e.target.closest('[data-act]');
    if (!el) return;
    const fn = A[el.dataset.act];
    if (!fn) return;
    if (el.tagName === 'A' || el.tagName === 'BUTTON') e.preventDefault();
    fn(el.dataset, el, e);
  });

  function onField(e) {
    const el = e.target;
    if (el.dataset.actChange === 'duoTr') { if (e.type === 'change') { ui.trOn = el.checked; render(); } return; }
    if (el.dataset.sw) { idx[el.dataset.sw].swatches[+el.dataset.i] = el.value; save(); refresh(['student']); return; }
    if (el.dataset.kidgap) { ui.kid[el.dataset.kidgap].val = el.value; return; }
    if (el.dataset.tb) { const st = idx[el.dataset.tb]; st.tbox = st.tbox || { title: '', items: '' }; st.tbox[el.dataset.f] = el.value; save(); return; }
    if (el.dataset.ti) { const m = idx[el.dataset.ti]; m.teacherInfo = m.teacherInfo || {}; m.teacherInfo[el.dataset.k] = el.value; save(); return; }
    if (el.dataset.pres) { const pr = curLesson().materials.presentation; pr[el.dataset.pres] = el.dataset.pres === 'slides' ? Number(el.value) || 0 : el.value; save(); return; }
    if (el.dataset.sl) { idx[el.dataset.sl].softLabels[+el.dataset.i] = el.value; save(); refresh(['scprev']); return; }
    if (el.dataset.modk) { idx[el.dataset.modk].modules[el.dataset.m] = el.checked; save(); refresh(['scprev']); return; }
    if (el.id === 'mq') { ui.mQ = el.value; refresh(['mlist']); return; }
    const { id, k } = el.dataset;
    if (!id || !k || !idx[id]) return;
    let v = el.type === 'checkbox' ? el.checked : el.value;
    if (el.dataset.type === 'num') v = Number(v) || 0;
    if (k === 'parentNote' && idx[id].parent) idx[id].parent.note = v;
    else idx[id][k] = v;
    if (k === 'scenario' && idx[v]) idx[id].age = idx[v].age;
    save();
    if (el.dataset.live) refresh(el.dataset.live.split(','));
    if (e.type === 'change' && ((el.type === 'checkbox' && !el.dataset.live) || el.dataset.rerender)) render();
  }
  document.addEventListener('input', onField);
  document.addEventListener('change', onField);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
    if (e.key === 'Enter' && e.target.id === 'newProp') A.addProp();
  });

  // ---------------------------------------------------------------- Drag & drop (уроки, шаги, задания)
  let dragging = null;
  const clearDrop = () => document.querySelectorAll('.over,.drop-before').forEach((x) => x.classList.remove('over', 'drop-before'));
  document.addEventListener('dragstart', (e) => {
    const el = e.target.closest && e.target.closest('[data-drag]');
    if (!el) return;
    dragging = { kind: el.dataset.drag, id: el.dataset.dragId };
    el.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    try { e.dataTransfer.setData('text/plain', dragging.id); } catch (err) { /* noop */ }
  });
  document.addEventListener('dragover', (e) => {
    if (!dragging) return;
    const t = e.target.closest && e.target.closest(`[data-drop="${dragging.kind}"]`);
    if (!t) return;
    e.preventDefault();
    clearDrop();
    t.classList.add(t.dataset.before ? 'drop-before' : 'over');
  });
  document.addEventListener('drop', (e) => {
    if (!dragging) return;
    const t = e.target.closest && e.target.closest(`[data-drop="${dragging.kind}"]`);
    if (!t) return;
    e.preventDefault();
    const before = t.dataset.before || null;
    if (before !== dragging.id) {
      if (dragging.kind === 'step') moveBefore(curLesson().steps, dragging.id, before);
      if (dragging.kind === 'task') moveBefore(curLesson().hw.tasks, dragging.id, before);
      if (dragging.kind === 'lesson') {
        const from = moduleOf(dragging.id); const to = idx[t.dataset.mod];
        if (from && to) { from.lessons.splice(from.lessons.indexOf(dragging.id), 1); const j = before ? to.lessons.indexOf(before) : -1; to.lessons.splice(j < 0 ? to.lessons.length : j, 0, dragging.id); }
      }
      save();
    }
    dragging = null; clearDrop(); render();
  });
  document.addEventListener('dragend', () => { dragging = null; clearDrop(); document.querySelectorAll('.dragging').forEach((x) => x.classList.remove('dragging')); });

  render();
})();
