// Seed-данные прототипа: методики, программы, уроки, шаги и ДЗ.
// Структура по ТЗ п. 4.1: Направление → Методика → Уровень → Модуль → Урок → Шаг → Компонент.

(function () {
  let n = 0;
  const id = (p) => `${p}${(++n).toString(36)}`;

  const w = (zh, py, ru) => ({ id: id('w'), zh, py, ru, audio: true });
  const t = (text) => ({ id: id('p'), text });

  // --- Компоненты экрана ученика (библиотека п. 4.12)
  const B = {
    scene: (title, lines) => ({ id: id('b'), type: 'scene', title, lines: lines.map(([who, zh, py, ru]) => ({ id: id('l'), who, zh, py, ru })), ctx: ['lesson', 'review'] }),
    media: (kind, title, duration) => ({ id: id('b'), type: 'media', kind, title, duration, ctx: ['lesson', 'review'] }),
    text: (items, showTranslation = false) => ({ id: id('b'), type: 'text', items: items.map(([zh, py, ru, color]) => ({ id: id('i'), zh, py, ru, color })), showTranslation, ctx: ['lesson', 'review'] }),
    reveal: (items) => ({ id: id('b'), type: 'reveal', items: items.map(([zh, py, ru, color]) => ({ id: id('i'), zh, py, ru, color })), ctx: ['lesson', 'review'] }),
    drag: (mode, task, pairs) => ({ id: id('b'), type: 'drag', mode, task, pairs: pairs.map(([left, right, color]) => ({ id: id('i'), left, right, color })), ctx: ['lesson', 'review', 'hw'] }),
    stat: (title, caption, swatches) => ({ id: id('b'), type: 'static', title, caption, swatches: swatches || [], ctx: ['lesson'] }),
    print: (title, note) => ({ id: id('b'), type: 'print', title, note, ctx: ['lesson'] }),
  };

  const step = (title, duration, goal, script, blocks, extra = {}) => ({
    id: id('s'), title, duration, goal, script,
    phrases: (extra.phrases || []).map(([zh, py, ru]) => ({ id: id('f'), zh, py, ru })),
    answers: extra.answers || '',
    props: extra.props || [],
    notes: extra.notes || '',
    blocks,
  });

  const C = {
    red: '#ff5a5a', yellow: '#ffd23f', blue: '#4f8dff', green: '#3fcf6e', white: '#ffffff', black: '#1d1d1f', orange: '#ff9f43', pink: '#ffb6e8',
  };

  // --- Задания ДЗ (типы п. 4.3 и 4.7)
  const T = {
    choice: (title, question, options, correct) => ({ id: id('t'), type: 'choice', title, instruction: question, options: options.map((o, i) => ({ id: id('o'), text: o, correct: i === correct })), points: 1, hint: '' }),
    match: (title, instruction, pairs) => ({ id: id('t'), type: 'match', title, instruction, pairs: pairs.map(([word, pic]) => ({ id: id('o'), word, pic })), points: 2, hint: '' }),
    audio: (title, instruction, phrase, options, correct) => ({ id: id('t'), type: 'audio', title, instruction, phrase, options: options.map((o, i) => ({ id: id('o'), text: o, correct: i === correct })), points: 1, hint: 'Послушай ещё раз — слово звучит в конце фразы' }),
    order: (title, instruction, words, ru) => ({ id: id('t'), type: 'order', title, instruction, words: words.map((x) => ({ id: id('o'), text: x })), ru, points: 2, hint: '' }),
    voice: (title, instruction, zh, py) => ({ id: id('t'), type: 'pron', title, instruction, zh, py, attempts: 0, points: 2, hint: '' }),
    photo: (title, instruction, criteria) => ({ id: id('t'), type: 'photo', title, instruction, criteria, points: 3, hint: '' }),
    parent: (title, instruction, criteria) => ({ id: id('t'), type: 'parent', title, instruction, criteria, points: 0, hint: '' }),
    cards: (title, instruction, words) => ({ id: id('t'), type: 'cards', title, instruction, words, points: 1, hint: '' }),
    gap: (title, instruction, sentence, answer, ru) => ({ id: id('t'), type: 'gap', title, instruction, sentence, answer, ru, points: 1, hint: '' }),
  };

  // ---------------------------------------------------------------- Урок 4 «Цвета» (эталонный, 16 шагов)
  const colorsVocab = [
    w('红色', 'hóngsè', 'красный'), w('黄色', 'huángsè', 'жёлтый'), w('蓝色', 'lánsè', 'синий'),
    w('绿色', 'lǜsè', 'зелёный'), w('白色', 'báisè', 'белый'), w('黑色', 'hēisè', 'чёрный'),
    w('颜色', 'yánsè', 'цвет'), w('什么颜色？', 'shénme yánsè?', 'какого цвета?'),
  ];
  const colorsProps = ['персонажи курса', 'карточки цветов (6 шт.)', 'цветные мячи', 'обручи 4 цветов', 'приложение 2 «Раскраска»', 'рабочая тетрадь', 'цветная бумага', 'колонка'];

  const colorsSteps = [
    step('Приветствие и песня-разминка', 2, 'Настроить группу, повторить 你好', 'Встаньте в круг. Поздоровайтесь с каждым ребёнком: 你好, 小朋友! Включите песню-разминку и показывайте движения.',
      [B.media('song', 'Песня «你好歌»', '1:40')], { phrases: [['你好，小朋友！', 'nǐ hǎo, xiǎopéngyǒu!', 'Здравствуйте, ребята!']], answers: 'Дети отвечают: 你好，老师！', props: ['колонка'] }),
    step('Сяо Лон и Сяо Мей видят радугу', 3, 'Ввести тему «Цвета» через историю', 'Покажите сцену. Озвучьте реплики героев или включите аудио. Спросите детей по-русски: что увидели герои?',
      [B.scene('Радуга после дождя', [['小龙', '看！彩虹！', 'kàn! cǎihóng!', 'Смотри! Радуга!'], ['小妹', '好漂亮的颜色！', 'hǎo piàoliang de yánsè!', 'Какие красивые цвета!']])],
      { props: ['персонажи курса'], notes: 'Если дети стесняются — дайте Сяо Мей «поздороваться» с каждым.' }),
    step('Новые слова: красный, жёлтый, синий', 3, 'Ввести 红色, 黄色, 蓝色', 'Показывайте карточку, называйте цвет 3 раза: медленно, нормально, шёпотом. Дети повторяют хором.',
      [B.text([['红色', 'hóngsè', 'красный', C.red], ['黄色', 'huángsè', 'жёлтый', C.yellow], ['蓝色', 'lánsè', 'синий', C.blue]])],
      { phrases: [['这是红色。', 'zhè shì hóngsè.', 'Это красный.']], answers: 'Хоровое повторение каждого цвета', props: ['карточки цветов (6 шт.)'] }),
    step('Новые слова: зелёный, белый, чёрный', 3, 'Ввести 绿色, 白色, 黑色', 'Открывайте карточки по одной кнопкой «Показать следующий». После каждой — дети показывают предмет этого цвета в классе.',
      [B.reveal([['绿色', 'lǜsè', 'зелёный', C.green], ['白色', 'báisè', 'белый', C.white], ['黑色', 'hēisè', 'чёрный', C.black]])],
      { answers: 'Дети называют цвет и показывают предмет', props: ['карточки цветов (6 шт.)'] }),
    step('Игра «Покажи цвет»', 3, 'Закрепить 6 цветов на слух', 'Называйте цвет — дети поднимают карточку нужного цвета. Ускоряйте темп.',
      [B.stat('Покажи цвет!', 'Подними карточку, которую назвал учитель', [C.red, C.yellow, C.blue, C.green, C.white, C.black])],
      { phrases: [['红色在哪儿？', 'hóngsè zài nǎr?', 'Где красный?']], props: ['карточки цветов (6 шт.)'] }),
    step('Вопрос 什么颜色？', 3, 'Ввести вопрос «Какого цвета?»', 'Покажите предмет, спросите 这是什么颜色？ Выведите перевод на экран ученика только после 2–3 попыток.',
      [B.text([['这是什么颜色？', 'zhè shì shénme yánsè?', 'Какого это цвета?']])],
      { phrases: [['这是什么颜色？', 'zhè shì shénme yánsè?', 'Какого это цвета?']], answers: '这是红色 / 这是蓝色 …', notes: 'Перевод скрыт на экране ученика по умолчанию.' }),
    step('Движение «Беги к цвету»', 3, 'Активная пауза, узнавание цвета', 'Разложите обручи 4 цветов. Команда: 跑到红色！ — дети бегут к красному обручу.',
      [B.stat('Беги к цвету!', '跑到…！', [C.red, C.yellow, C.blue, C.green])],
      { phrases: [['跑到红色！', 'pǎo dào hóngsè!', 'Беги к красному!']], props: ['обручи 4 цветов'] }),
    step('Раскрась шарики', 3, 'Соотнести иероглиф и цвет', 'Вызовите ребёнка к доске: перетащите иероглиф к шарику нужного цвета. Остальные проверяют: 对！/ 不对！',
      [B.drag('target', 'Перетащи слово к шарику нужного цвета', [['红色', '🎈', C.red], ['黄色', '🎈', C.yellow], ['蓝色', '🎈', C.blue], ['绿色', '🎈', C.green]])],
      { answers: '红色 → красный, 黄色 → жёлтый, 蓝色 → синий, 绿色 → зелёный' }),
    step('Видео «Colors song»', 3, 'Закрепить цвета через песню', 'Включите видео. Во втором проигрывании дети поднимают карточки на каждый цвет.',
      [B.media('video', 'Colors song · 颜色歌', '2:15')], { props: ['колонка'] }),
    step('Какой цвет спрятался?', 3, 'Тренировка памяти', 'Покажите все карточки, затем скройте одну. Дети угадывают: 蓝色！',
      [B.reveal([['红色', 'hóngsè', 'красный', C.red], ['蓝色', 'lánsè', 'синий', C.blue], ['?', '', 'спрятался', '#e6e6ea'], ['白色', 'báisè', 'белый', C.white]])]),
    step('Работа с карточками за столом', 3, 'Индивидуальная отработка', 'Раздайте приложение 2. Дети раскладывают карточки по цветам и называют их соседу.',
      [B.print('Приложение 2 · Карточки цветов', 'Печать A4, 6 карточек на листе')], { props: ['приложение 2 «Раскраска»'] }),
    step('Диалог героев', 3, 'Отработать вопрос-ответ', 'Разыграйте диалог по ролям: сначала учитель + Сяо Лон, затем пары детей.',
      [B.scene('Что за цвет?', [['小妹', '这是什么颜色？', 'zhè shì shénme yánsè?', 'Какого это цвета?'], ['小龙', '这是绿色。', 'zhè shì lǜsè.', 'Это зелёный.']])],
      { phrases: [['这是绿色。', 'zhè shì lǜsè.', 'Это зелёный.']], answers: 'Пары задают вопрос и отвечают целой фразой' }),
    step('Игра «Светофор»', 2, 'Цвета в бытовом контексте', 'Красный — стоим, жёлтый — хлопаем, зелёный — шагаем на месте.',
      [B.stat('Светофор', '红色 · 黄色 · 绿色', [C.red, C.yellow, C.green])]),
    step('Рабочая тетрадь', 3, 'Мелкая моторика + цвет', 'Страница 8: раскрасить шарики по иероглифу. Помогайте только жестом.',
      [B.print('Рабочая тетрадь, стр. 8', 'Раскрась по иероглифу')], { props: ['рабочая тетрадь'] }),
    step('Повторение: составь пары', 3, 'Итоговая проверка 6 цветов', 'Ребята по очереди соединяют иероглиф и цвет на доске.',
      [B.drag('pairs', 'Соедини слово и цвет', [['红色', '●', C.red], ['黄色', '●', C.yellow], ['蓝色', '●', C.blue], ['绿色', '●', C.green], ['白色', '●', C.white], ['黑色', '●', C.black]])]),
    step('Прощание и домашнее задание', 2, 'Подвести итог, объяснить ДЗ', 'Похвалите группу. Покажите, что дома ждёт задание от Сяо Мей. 再见！',
      [B.scene('До встречи!', [['小妹', '再见，小朋友！', 'zàijiàn, xiǎopéngyǒu!', 'До свидания, ребята!']])],
      { phrases: [['再见！', 'zàijiàn!', 'До свидания!']] }),
  ];

  const colorsHW = {
    id: id('h'), title: 'ДЗ к уроку 4 «Цвета»', dueDays: 7, check: 'hybrid', grading: 'soft', withParent: true, estimate: 10,
    parentNote: 'Повторите с ребёнком 6 цветов: называйте предметы дома по-китайски. Запишите, как ребёнок произносит 红色 и 蓝色.',
    tasks: [
      T.audio('Аудирование: какой цвет?', 'Послушай и выбери цвет, который назвала Сяо Мей', '我喜欢蓝色。', ['红色', '蓝色', '绿色'], 1),
      T.match('Найди пару', 'Соедини слово и цвет', [['红色', C.red], ['黄色', C.yellow], ['蓝色', C.blue], ['绿色', C.green]]),
      T.choice('Какого цвета листик?', '这是什么颜色？ 🍃', ['红色', '绿色', '白色'], 1),
      T.order('Собери фразу', 'Расставь слова по порядку: «Это красный»', ['这', '是', '红色'], 'Это красный.'),
      T.voice('Скажи как Сяо Лон', 'Нажми на микрофон и повтори за героем', '这是红色。', 'zhè shì hóngsè.'),
      T.photo('Радуга дома', 'Нарисуй радугу и сфотографируй рисунок. Покажи родителю 3 цвета и назови их по-китайски.', 'На рисунке минимум 4 цвета; ребёнок называет 3 цвета'),
      T.parent('Цветная охота', 'Вместе с ребёнком найдите дома 5 предметов разных цветов и назовите их по-китайски.', 'Родитель отмечает, какие цвета ребёнок назвал сам'),
    ],
  };

  // ---------------------------------------------------------------- Урок 1 «Животные на ферме» (с лендинга)
  const farmVocab = [w('狗', 'gǒu', 'собака'), w('猫', 'māo', 'кошка'), w('兔子', 'tùzi', 'кролик'), w('马', 'mǎ', 'лошадь'), w('农场', 'nóngchǎng', 'ферма'), w('我是…', 'wǒ shì…', 'я…'), w('这是…', 'zhè shì…', 'это…'), w('跑', 'pǎo', 'бежать')];
  const farmProps = ['персонажи курса', 'карточки 狗, 猫, 兔子, 马', 'карточка 农场', 'малярная лента', 'мяч', 'счётные палочки', 'приложение 1', 'указка', 'мягкие игрушки: dog/cat/rabbit/horse', 'рабочая тетрадь', 'игрушечная ферма'];
  const farmSteps = [
    step('Видео «Farm animals»', 3, 'Обозначить тему урока', 'Посмотреть видео «Farm animals» и обозначить тему урока.', [B.media('video', 'Farm animals', '2:05')]),
    step('Круг-знакомство', 4, 'Отработать 我是…', 'Круг-знакомство: отработать 我是… с именами детей. Передавайте мяч.', [B.text([['我是…', 'wǒ shì…', 'я…']])], { phrases: [['我是小龙。', 'wǒ shì Xiǎolóng.', 'Я Сяо Лон.']], props: ['мяч'] }),
    step('Карточки животных', 4, 'Ввести 狗, 猫, 兔子, 马', 'Карточки животных: показать слово, затем фразу 这是… .', [B.text([['狗', 'gǒu', 'собака'], ['猫', 'māo', 'кошка'], ['兔子', 'tùzi', 'кролик'], ['马', 'mǎ', 'лошадь']])], { props: ['карточки 狗, 猫, 兔子, 马'], answers: 'Задание шага: нажми карточку, которую назвал преподаватель.' }),
    step('Движение по командам', 3, 'Активная пауза', 'Движение по командам: 我们跑吧 / 我们跳吧 с темпом урока.', [B.stat('我们跑吧！', 'Бежим!', [])], { phrases: [['我们跑吧！', 'wǒmen pǎo ba!', 'Давайте бежать!']] }),
    step('Игрушечная ферма', 5, 'Закрепить 农场 и 在…里', 'Игрушечная ферма: закрепить 农场 и 在…里, затем финальная песня.', [B.drag('target', 'Посели животных на ферму', [['狗', '🏡', C.orange], ['猫', '🏡', C.orange], ['兔子', '🏡', C.orange], ['马', '🏡', C.orange]])], { props: ['игрушечная ферма'] }),
  ];
  const farmHW = {
    id: id('h'), title: 'ДЗ к уроку 1 «Животные на ферме»', dueDays: 7, check: 'auto', grading: 'soft', withParent: false, estimate: 7,
    parentNote: 'Спросите ребёнка: «这是什么？» показывая игрушки животных.',
    tasks: [T.match('Сопоставь картинку и иероглиф', 'Соедини животное и слово', [['狗', '🐶'], ['猫', '🐱'], ['兔子', '🐰'], ['马', '🐴']]), T.audio('Кого назвали?', 'Послушай и выбери животное', '这是猫。', ['狗', '猫', '马'], 1)],
  };

  const lightLesson = (num, title, goal, vocab, status) => ({
    id: id('L'), num, title, goal, age: '5–6 лет', difficulty: 'Стартовый', duration: 45, formats: ['offline', 'hybrid'], status, version: status === 'published' ? '1.2' : '0.3',
    vocab: vocab.map(([a, b, c]) => w(a, b, c)), props: ['персонажи курса', 'карточки'],
    steps: [
      step('Приветствие', 3, 'Настроить группу', 'Поздоровайтесь, песня-разминка.', [B.media('song', 'Песня «你好歌»', '1:40')]),
      step('Новые слова', 5, 'Ввести лексику урока', 'Показывайте карточки, дети повторяют.', [B.text(vocab.slice(0, 4).map(([a, b, c]) => [a, b, c]))]),
      step('Игра', 5, 'Закрепление', 'Игра с карточками.', [B.stat('Найди карточку', '', [])]),
    ],
    hw: { id: id('h'), title: `ДЗ к уроку ${num} «${title}»`, dueDays: 7, check: 'auto', grading: 'soft', withParent: false, estimate: 5, parentNote: '', tasks: [T.cards('Карточки урока', 'Повтори слова урока', vocab.slice(0, 4).map(([a]) => a))] },
    parent: { note: 'Повторите слова урока вместе с ребёнком.' }, assessment: 'soft',
  });

  const L1 = { id: id('L'), num: 1, title: 'Животные на ферме', goal: 'Ребёнок называет 4 животных и представляется фразой 我是…', age: '5–6 лет', difficulty: 'Стартовый', duration: 45, formats: ['offline', 'online', 'hybrid'], status: 'published', version: '1.2', vocab: farmVocab, props: farmProps, steps: farmSteps, hw: farmHW, parent: { note: 'Дома повторите животных с мягкими игрушками.' }, assessment: 'soft' };
  const L2 = lightLesson(2, 'Моя семья', 'Ребёнок называет членов семьи', [['爸爸', 'bàba', 'папа'], ['妈妈', 'māma', 'мама'], ['哥哥', 'gēge', 'старший брат'], ['姐姐', 'jiějie', 'старшая сестра'], ['家', 'jiā', 'семья, дом']], 'published');
  const L3 = lightLesson(3, 'Фрукты', 'Ребёнок называет 5 фруктов и говорит 我喜欢…', [['苹果', 'píngguǒ', 'яблоко'], ['香蕉', 'xiāngjiāo', 'банан'], ['橙子', 'chéngzi', 'апельсин'], ['西瓜', 'xīguā', 'арбуз'], ['我喜欢…', 'wǒ xǐhuan…', 'я люблю…']], 'published');
  const L4 = { id: id('L'), num: 4, title: 'Цвета', goal: 'Ребёнок узнаёт и называет 6 цветов, задаёт вопрос 什么颜色？ и отвечает целой фразой', age: '5–6 лет', difficulty: 'Стартовый', duration: 45, formats: ['offline', 'online', 'hybrid'], status: 'review', version: '1.0', reference: true, vocab: colorsVocab, props: colorsProps, steps: colorsSteps, hw: colorsHW, parent: { note: 'Повторите цвета на прогулке: 红色 — машина, 绿色 — дерево. Песня «颜色歌» доступна в кабинете ребёнка.' }, assessment: 'soft' };
  const L5 = lightLesson(5, 'Игрушки', 'Ребёнок называет игрушки и говорит 我有…', [['球', 'qiú', 'мяч'], ['娃娃', 'wáwa', 'кукла'], ['汽车', 'qìchē', 'машинка'], ['熊', 'xióng', 'мишка'], ['我有…', 'wǒ yǒu…', 'у меня есть…']], 'draft');
  const L6 = lightLesson(6, 'Погода', 'Ребёнок описывает погоду', [['太阳', 'tàiyáng', 'солнце'], ['下雨', 'xià yǔ', 'идёт дождь'], ['冷', 'lěng', 'холодно'], ['热', 'rè', 'жарко']], 'draft');
  const L7 = lightLesson(7, 'Одежда', 'Ребёнок называет предметы одежды', [['衣服', 'yīfu', 'одежда'], ['帽子', 'màozi', 'шапка'], ['鞋', 'xié', 'обувь'], ['裤子', 'kùzi', 'брюки']], 'draft');

  const S1 = { ...lightLesson(1, 'Приветствие и знакомство', 'Ученик умеет представиться и спросить имя собеседника', [['你好', 'nǐ hǎo', 'привет'], ['您好', 'nín hǎo', 'здравствуйте'], ['我', 'wǒ', 'я'], ['你', 'nǐ', 'ты'], ['叫', 'jiào', 'звать'], ['名字', 'míngzi', 'имя'], ['是', 'shì', 'быть, являться']], 'draft'), age: '7–10 лет', duration: 40, assessment: 'grades' };
  S1.hw.grading = 'grades';
  S1.hw.tasks.push(T.gap('Пропуск в предложении', 'Вставь пропущенное слово', '我 ___ 小龙。', '叫', 'Меня зовут Сяо Лон.'));
  const S2 = { ...lightLesson(2, 'Числа 1–10', 'Ученик считает до 10', [['一', 'yī', 'один'], ['二', 'èr', 'два'], ['三', 'sān', 'три'], ['十', 'shí', 'десять']], 'draft'), age: '7–10 лет', duration: 40, assessment: 'grades' };

  const lessons = {};
  [L1, L2, L3, L4, L5, L6, L7, S1, S2].forEach((l) => { lessons[l.id] = l; });

  const methods = [
    {
      id: id('m'), title: 'Мир вокруг меня', direction: 'Китайский язык', segment: 'Детские сады', age: '5–6 лет', format: 'Группа 4–8 детей, 45 мин',
      description: 'Курс построен вокруг героев Сяо Лон и Сяо Мей: песни, видео и игровые активности в предсказуемом сценарии для преподавателя.',
      status: 'published', version: '1.2', updated: '28 октября', accent: 'green', assigned: ['o1', 'o2', 'g1', 'g2'],
      history: [
        { v: '1.2', date: '28 окт 2026', who: 'Е. Ли', note: 'Урок 3: добавлена песня, обновлено ДЗ', status: 'published' },
        { v: '1.1', date: '12 окт 2026', who: 'Е. Ли', note: 'Уроки 1–3 перенесены из Google Drive', status: 'archived' },
        { v: '1.0', date: '01 сен 2026', who: 'М. Перфилова', note: 'Первая публикация', status: 'archived' },
      ],
      levels: [
        { id: id('v'), title: 'Уровень 1 · Знакомство', modules: [
          { id: id('d'), title: 'Модуль 1 · Я и мой мир', lessons: [L1.id, L2.id, L3.id, L4.id, L5.id] },
          { id: id('d'), title: 'Модуль 2 · Вокруг меня', lessons: [L6.id, L7.id] },
        ] },
        { id: id('v'), title: 'Уровень 2 · Первые фразы', modules: [{ id: id('d'), title: 'Модуль 3 · Мой день', lessons: [] }] },
      ],
    },
    {
      id: id('m'), title: 'Китайский для младших школьников', direction: 'Китайский язык', segment: 'Частные школы · начальная', age: '7–10 лет', format: 'Класс до 12 учеников, 40 мин',
      description: 'Первые иероглифы, аудирование, произношение и игровые задания с автопроверкой.',
      status: 'draft', version: '0.3', updated: '2 ноября', accent: 'purple', assigned: [],
      history: [{ v: '0.3', date: '02 ноя 2026', who: 'Е. Ли', note: 'Черновик программы', status: 'draft' }],
      levels: [{ id: id('v'), title: 'Уровень 1 · Старт', modules: [{ id: id('d'), title: 'Модуль 1 · Приветствие и знакомство', lessons: [S1.id, S2.id] }] }],
    },
    {
      id: id('m'), title: 'Подготовка к HSK 2', direction: 'Китайский язык', segment: 'Средняя и старшая школа', age: '11–18 лет', format: 'Индивидуально или группа, 60 мин',
      description: 'Системная подготовка к экзамену: задания привязаны к разделам HSK (аудирование, чтение).',
      status: 'draft', version: '0.1', updated: '20 октября', accent: 'blue', assigned: [],
      history: [{ v: '0.1', date: '20 окт 2026', who: 'Е. Ли', note: 'Создана структура', status: 'draft' }],
      levels: [{ id: id('v'), title: 'Раздел · Аудирование', modules: [] }, { id: id('v'), title: 'Раздел · Чтение', modules: [] }],
    },
  ];

  const orgs = [
    { id: 'o1', title: 'Детский сад «Радуга»', type: 'Детский сад', groups: [{ id: 'g1', title: 'Группа «Панды» · 5–6 лет' }, { id: 'g2', title: 'Группа «Дракончики» · 5–6 лет' }] },
    { id: 'o2', title: 'Школа «Лингва Кидс»', type: 'Частная школа', groups: [{ id: 'g3', title: '1 «А» класс' }, { id: 'g4', title: '2 «Б» класс' }] },
    { id: 'o3', title: 'Частные преподаватели', type: 'Личный контур', groups: [{ id: 'g5', title: 'Индивидуальные ученики' }] },
  ];

  const media = [
    { id: id('x'), kind: 'video', title: 'Colors song · 颜色歌', size: '48 МБ', lesson: 'Урок 4', license: 'Собственный контент Shidao', source: 'Студия Shidao' },
    { id: id('x'), kind: 'song', title: 'Песня «你好歌»', size: '3,1 МБ', lesson: 'Уроки 1–7', license: 'Лицензия CC BY 4.0', source: 'Музыка: К. Ван' },
    { id: id('x'), kind: 'video', title: 'Farm animals', size: '36 МБ', lesson: 'Урок 1', license: 'Лицензия до 12.2027', source: 'KidsLearn Ltd.' },
    { id: id('x'), kind: 'image', title: 'Сцена «Радуга»', size: '1,2 МБ', lesson: 'Урок 4', license: 'Собственный контент Shidao', source: 'Иллюстратор А. Ким' },
    { id: id('x'), kind: 'pdf', title: 'Приложение 2 · Карточки цветов', size: '820 КБ', lesson: 'Урок 4', license: 'Собственный контент Shidao', source: 'Методический отдел' },
    { id: id('x'), kind: 'audio', title: 'Озвучка: 红色 / 黄色 / 蓝色…', size: '640 КБ', lesson: 'Урок 4', license: 'Собственный контент Shidao', source: 'Диктор: Л. Чжан' },
    { id: id('x'), kind: 'pdf', title: 'Рабочая тетрадь, стр. 1–12', size: '4,4 МБ', lesson: 'Уроки 1–5', license: 'Собственный контент Shidao', source: 'Методический отдел' },
  ];

  window.SEED = { methods, lessons, orgs, media };
})();
