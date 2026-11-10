/* Maple Bridge Learning Centre — Winter Term 2027 schedule (single source of truth).
   Used by schedule.html (timetable) and inquiry.html (class picker). */
(function () {
  'use strict';
  function T(en, hant, hans) { return { en: en, 'zh-Hant': hant, 'zh-Hans': hans }; }

  var bands = [
    { id: 'P', label: T('Primary 1–3', '初小 1–3年級', '低年级 1–3年级') },
    { id: 'J', label: T('Junior 4–6', '高小 4–6年級', '高年级 4–6年级') },
    { id: 'I', label: T('Intermediate 7–8', '初中 7–8年級', '初中 7–8年级') },
    { id: 'H', label: T('High school 9–12', '高中 9–12年級', '高中 9–12年级') }
  ];

  var subjects = [
    { id: 'math', label: T('Math', '數學', '数学') },
    { id: 'english', label: T('English', '英文', '英语'), long: T('English reading & writing', '英文閱讀及寫作', '英语阅读与写作') },
    { id: 'science', label: T('Science', '科學', '科学') },
    { id: 'osslt', label: T('OSSLT prep', 'OSSLT備試', 'OSSLT备考'), long: T('OSSLT prep (Gr 10 literacy test)', 'OSSLT備試（十年級讀寫測試）', 'OSSLT备考（十年级读写测试）') },
    { id: 'french', label: T('French', '法文', '法语'), long: T('French basics', '法文基礎', '法语基础') },
    { id: 'mandarin', label: T('Mandarin', '中文班', '中文班'), long: T('Mandarin / Chinese class', '中文班（普通話）', '中文班') },
    { id: 'club', label: T('Homework club', '功課輔導班', '作业辅导班') }
  ];

  var days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

  var teachers = {
    KL: T('Ms. Lau', '劉老師', '刘老师'),
    DO: T('Mr. Okafor', 'Okafor老師', 'Okafor老师'),
    XZ: T('Ms. Zhao', '趙老師', '赵老师'),
    EW: T('Ms. Wong', '黃老師', '黄老师'),
    JI: T('Mr. Ip', '葉Sir', '叶老师')
  };

  var rooms = {
    A: T('Room A', 'A室', 'A教室'),
    B: T('Room B', 'B室', 'B教室'),
    C: T('Room C', 'C室', 'C教室'),
    S: T('Study Hall', '自修室', '自习室')
  };

  /* weekday rows of the timetable grid, and the Saturday rows that sit beside them */
  var slots = [
    { id: 0, wk: '3:30–6:30', sat: '' },
    { id: 1, wk: '4:00–5:00', sat: '9:30–11:00' },
    { id: 2, wk: '5:15–6:45', sat: '11:15–12:45' },
    { id: 3, wk: '7:00–8:30', sat: '1:30–3:00' }
  ];

  var N = {
    jm: T('Junior Math', '高小數學', '高年级数学'),
    pm: T('Primary Math', '初小數學', '低年级数学'),
    prw: T('Primary Reading & Writing', '初小英文讀寫', '低年级英语读写'),
    jrw: T('Junior Reading & Writing', '高小英文讀寫', '高年级英语读写'),
    im: T('Grade 7–8 Math', '初中數學', '初中数学'),
    ieEssay: T('Grade 7–8 English: Essay Writing', '初中英文：議論文寫作', '初中英语：议论文写作'),
    ieRead: T('Grade 7–8 English: Reading & Response', '初中英文：閱讀與回應', '初中英语：阅读与回应'),
    is: T('Grade 7–8 Science', '初中科學', '初中科学'),
    g9: T('Grade 9 Math, de-streamed (MTH1W)', '九年級不分流數學（MTH1W）', '九年级不分流数学（MTH1W）'),
    g10: T('Grade 10 Math (MPM2D)', '十年級數學（MPM2D）', '十年级数学（MPM2D）'),
    mcr: T('Functions (MCR3U)', '函數（MCR3U）', '函数（MCR3U）'),
    mhf: T('Advanced Functions (MHF4U)', '高等函數（MHF4U）', '高等函数（MHF4U）'),
    mcv: T('Calculus & Vectors (MCV4U)', '微積分與向量（MCV4U）', '微积分与向量（MCV4U）'),
    e910: T('Grade 9–10 English', '九至十年級英文', '9–10年级英语'),
    e1112: T('Grade 11–12 English (ENG3U / ENG4U)', '十一至十二年級英文（ENG3U／ENG4U）', '11–12年级英语（ENG3U/ENG4U）'),
    s910: T('Grade 9–10 Science (SNC1W / SNC2D)', '九至十年級科學（SNC1W／SNC2D）', '9–10年级科学（SNC1W/SNC2D）'),
    chem: T('Grade 11 Chemistry (SCH3U)', '十一年級化學（SCH3U）', '十一年级化学（SCH3U）'),
    jsl: T('Junior Science Lab', '高小科學實驗班', '高年级科学实验课'),
    fr46: T('French Basics', '法文基礎', '法语基础'),
    fr78: T('French Basics', '法文基礎', '法语基础'),
    ossl: T('OSSLT Prep', 'OSSLT備試班', 'OSSLT备考班'),
    mand1: T('Mandarin for Beginners', '中文班（初級）', '中文班（初级）'),
    mand2: T('Mandarin: Reading & Speaking', '中文班（進階）', '中文班（进阶）'),
    club: T('Homework Club', '功課輔導班', '作业辅导班')
  };

  var noteOssltWed = T('8-week block, Jan 6 – Feb 24', '一期八週：1月6日至2月24日', '一期8周：1月6日–2月24日');
  var noteOssltSat = T('8-week block, Jan 9 – Feb 27', '一期八週：1月9日至2月27日', '一期8周：1月9日–2月27日');
  var noteClub = T('Pick-up 5:30–6:30 pm', '下午5:30–6:30接回', '17:30–18:30接孩子');

  /* id, day, slot, time, subject, name, grades, bands, teacher, room, seats left (of cap) */
  function C(id, day, slot, time, subject, name, grades, bandIds, teacher, room, left, extra) {
    var c = { id: id, day: day, slot: slot, time: time, subject: subject, name: name, grades: grades,
      bands: bandIds, teacher: teacher, room: room, left: left, cap: 6 };
    if (extra) for (var k in extra) c[k] = extra[k];
    c.status = left === 0 ? 'wait' : (left <= 2 ? 'few' : 'open');
    return c;
  }
  function club(day) {
    return C(day + '-club', day, 0, '3:30–6:30', 'club', N.club, '1–8', ['P', 'J', 'I'], 'JI', 'S', 5, { cap: 18, note: noteClub, status: 'open', hideSeats: true });
  }

  var classes = [
    club('mon'),
    C('mon-jm', 'mon', 1, '4:00–5:00', 'math', N.jm, '4–6', ['J'], 'XZ', 'A', 3),
    C('mon-prw', 'mon', 1, '4:00–5:00', 'english', N.prw, '1–3', ['P'], 'EW', 'B', 2),
    C('mon-im', 'mon', 2, '5:15–6:45', 'math', N.im, '7–8', ['I'], 'KL', 'A', 4),
    C('mon-ie', 'mon', 2, '5:15–6:45', 'english', N.ieEssay, '7–8', ['I'], 'DO', 'B', 3),
    C('mon-mhf', 'mon', 3, '7:00–8:30', 'math', N.mhf, '12', ['H'], 'KL', 'A', 1),

    club('tue'),
    C('tue-pm', 'tue', 1, '4:00–5:00', 'math', N.pm, '1–3', ['P'], 'EW', 'B', 4),
    C('tue-fr', 'tue', 1, '4:00–5:00', 'french', N.fr46, '4–6', ['J'], 'DO', 'C', 5),
    C('tue-g9', 'tue', 2, '5:15–6:45', 'math', N.g9, '9', ['H'], 'KL', 'A', 0),
    C('tue-is', 'tue', 2, '5:15–6:45', 'science', N.is, '7–8', ['I'], 'XZ', 'C', 3),
    C('tue-g10', 'tue', 3, '7:00–8:30', 'math', N.g10, '10', ['H'], 'KL', 'A', 3),
    C('tue-e910', 'tue', 3, '7:00–8:30', 'english', N.e910, '9–10', ['H'], 'DO', 'B', 4),

    club('wed'),
    C('wed-jrw', 'wed', 1, '4:00–5:00', 'english', N.jrw, '4–6', ['J'], 'EW', 'B', 1),
    C('wed-ossl', 'wed', 2, '5:15–6:45', 'osslt', N.ossl, '10', ['H'], 'DO', 'B', 4, { note: noteOssltWed }),
    C('wed-mcv', 'wed', 3, '7:00–8:30', 'math', N.mcv, '12', ['H'], 'KL', 'A', 3),
    C('wed-s910', 'wed', 3, '7:00–8:30', 'science', N.s910, '9–10', ['H'], 'XZ', 'C', 5),

    club('thu'),
    C('thu-jm', 'thu', 1, '4:00–5:00', 'math', N.jm, '4–6', ['J'], 'XZ', 'A', 0),
    C('thu-prw', 'thu', 1, '4:00–5:00', 'english', N.prw, '1–3', ['P'], 'EW', 'B', 3),
    C('thu-g9', 'thu', 2, '5:15–6:45', 'math', N.g9, '9', ['H'], 'KL', 'A', 2),
    C('thu-fr', 'thu', 2, '5:15–6:45', 'french', N.fr78, '7–8', ['I'], 'DO', 'C', 4),
    C('thu-mcr', 'thu', 3, '7:00–8:30', 'math', N.mcr, '11', ['H'], 'KL', 'A', 3),
    C('thu-e1112', 'thu', 3, '7:00–8:30', 'english', N.e1112, '11–12', ['H'], 'DO', 'B', 2),

    club('fri'),
    C('fri-jsl', 'fri', 1, '4:00–5:00', 'science', N.jsl, '4–6', ['J'], 'XZ', 'C', 3),
    C('fri-ie', 'fri', 2, '5:15–6:45', 'english', N.ieRead, '7–8', ['I'], 'DO', 'B', 4),

    C('sat-g9', 'sat', 1, '9:30–11:00', 'math', N.g9, '9', ['H'], 'KL', 'A', 4),
    C('sat-pm', 'sat', 1, '9:30–10:30', 'math', N.pm, '1–3', ['P'], 'EW', 'B', 2),
    C('sat-mand1', 'sat', 1, '9:30–10:30', 'mandarin', N.mand1, '1–3', ['P'], 'XZ', 'C', 3),
    C('sat-mhf', 'sat', 2, '11:15–12:45', 'math', N.mhf, '12', ['H'], 'KL', 'A', 0),
    C('sat-jrw', 'sat', 2, '11:15–12:15', 'english', N.jrw, '4–6', ['J'], 'EW', 'B', 4),
    C('sat-mand2', 'sat', 2, '11:15–12:15', 'mandarin', N.mand2, '4–8', ['J', 'I'], 'XZ', 'C', 1),
    C('sat-ossl', 'sat', 3, '1:30–3:00', 'osslt', N.ossl, '10', ['H'], 'DO', 'B', 2, { note: noteOssltSat }),
    C('sat-chem', 'sat', 3, '1:30–3:00', 'science', N.chem, '11', ['H'], 'XZ', 'C', 4)
  ];

  /* ---------- time formatting: one convention per language ----------
     en: 12-hour with am/pm · zh-Hant: 12-hour with 上午/下午/晚上 (HK usage) · zh-Hans: 24-hour.
     Source times are written 12-hour without am/pm; anything before 9:00 is afternoon/evening. */
  function parse(t) { var p = t.split(':'); var h = Number(p[0]); if (h < 9) h += 12; return { h: h, m: p[1] }; }
  function clock(o, lang) { return (lang === 'zh-Hans' ? o.h : (o.h > 12 ? o.h - 12 : o.h)) + ':' + o.m; }
  function period(o, lang) {
    if (lang === 'zh-Hans') return '';
    if (lang === 'zh-Hant') return o.h < 12 ? '上午' : (o.h < 18 ? '下午' : '晚上');
    return o.h < 12 ? 'am' : 'pm';
  }
  function fmtRange(range, lang) {
    var p = range.split('–'), a = parse(p[0]), b = parse(p[1]);
    var cross = (a.h < 12) !== (b.h < 12);
    if (lang === 'zh-Hans') return clock(a, lang) + '–' + clock(b, lang);
    if (lang === 'zh-Hant') return period(a, lang) + clock(a, lang) + '–' + (cross ? period(b, lang) : '') + clock(b, lang);
    return cross ? clock(a, lang) + ' ' + period(a, lang) + '–' + clock(b, lang) + ' ' + period(b, lang)
      : clock(a, lang) + '–' + clock(b, lang) + ' ' + period(b, lang);
  }
  function rowLabel(range, lang) {
    var p = range.split('–'), a = parse(p[0]), b = parse(p[1]);
    return { period: period(a, lang), start: clock(a, lang), end: clock(b, lang) + ((a.h < 12) !== (b.h < 12) && lang === 'en' ? ' pm' : '') };
  }

  window.MB_SCHEDULE = {
    fmtRange: fmtRange, rowLabel: rowLabel,
    term: T('Winter Term 2027', '2027年冬季學期', '2027年冬季学期'),
    bands: bands, subjects: subjects, days: days, teachers: teachers, rooms: rooms, slots: slots, classes: classes
  };
})();
