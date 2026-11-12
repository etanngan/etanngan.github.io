/* Maple Bridge Learning Centre 楓橋教育中心: every word on the site, in English, Traditional Chinese (Hong Kong wording)
   and Simplified Chinese (mainland wording, written separately, not converted). */
(function () {
  'use strict';
  var d = {};
  function D(k, en, hant, hans) { d[k] = { en: en, 'zh-Hant': hant, 'zh-Hans': hans }; }
  var RING = function (n) { return '<span class="ring">' + n + '</span>'; };

  /* ---------- every page ---------- */
  D('a11y.skip', 'Skip to content', '跳到主要內容', '跳到正文');
  D('brand.name', 'Maple Bridge Learning Centre', '楓橋教育中心', '枫桥教育中心');
  D('brand.aria', 'Maple Bridge Learning Centre, home page', '楓橋教育中心主頁', '枫桥教育中心首页');
  D('og.title', 'Maple Bridge Learning Centre, Markham', '楓橋教育中心（萬錦補習社）', '枫桥教育中心（万锦补习班）');
  D('og.desc', 'After-school tutoring for Grades 1 to 12 near Kennedy Rd and Bur Oak Ave. Six students or fewer per class. Free trial class.',
    '萬錦 Kennedy 及 Bur Oak 交界的課後補習社，一至十二年級，每班最多 6 人，免費試堂。',
    '万锦 Kennedy 和 Bur Oak 交界附近的课后补习班，1–12年级，每班最多6人，免费试听课。');
  D('nav.aria', 'Main', '主選單', '主菜单');
  D('nav.open', 'Open menu', '打開選單', '打开菜单');
  D('nav.close', 'Close menu', '關閉選單', '关闭菜单');
  D('nav.home', 'Home', '主頁', '首页');
  D('nav.fees', 'Classes and fees', '課程及學費', '课程和学费');
  D('nav.schedule', 'Timetable', '時間表', '课程表');
  D('nav.teachers', 'Teachers', '導師', '老师');
  D('nav.parents', 'For parents', '家長須知', '家长须知');
  D('nav.contact', 'Find us', '地址及聯絡', '地址和联系方式');
  D('cta', 'Book a free trial class', '預約免費試堂', '预约免费试听课');
  D('lang.aria', 'Language', '語言', '语言');
  D('call', 'Call (905) 555-0162', '致電 (905) 555-0162', '打电话 (905) 555-0162');
  D('dock.call', 'Call', '致電', '打电话');

  D('d.weekdays', 'Monday to Friday', '星期一至五', '周一至周五');
  D('d.sat', 'Saturday', '星期六', '周六');
  D('d.sun', 'Sunday', '星期日', '周日');
  D('h.weekdays', '3:30 – 8:30 pm', '下午3:30 – 晚上8:30', '15:30–20:30');
  D('h.sat', '9:00 am – 3:30 pm', '上午9:00 – 下午3:30', '9:00–15:30');
  D('h.closed', 'Closed', '休息', '休息');
  D('h.today', 'Today', '今日', '今天');

  /* hero "today" line: built in site.js from Toronto time */
  D('today.static', 'Mon to Fri 3:30 – 8:30 pm, Sat 9 am – 3:30 pm', '星期一至五 下午3:30 – 晚上8:30，星期六 上午9:00 – 下午3:30', '周一至周五 15:30–20:30，周六 9:00–15:30');
  D('today.before', '<b>Open today</b> {t}', '<b>今日營業</b>：{t}', '<b>今天营业</b>：{t}');
  D('today.now', '<b>Open now</b> until {end}', '<b>現正營業</b>，{end}關門', '<b>正在营业</b>，{end} 关门');
  D('today.after', '<b>Closed now.</b> Open {when} {t}', '<b>已關門</b>，{when}{t}營業', '<b>已关门</b>，{when} {t} 营业');
  D('today.closed', '<b>Closed today.</b> Open {when} {t}', '<b>今日休息</b>，{when}{t}營業', '<b>今天休息</b>，{when} {t} 营业');
  D('today.holiday', '<b>Closed today</b> ({why}). Open {when} {t}', '<b>今日休息</b>（{why}），{when}{t}營業', '<b>今天休息</b>（{why}），{when} {t} 营业');
  D('today.camp', '<b>March Break camp today</b>, {t}', '<b>今日三月假日營</b>：{t}', '<b>今天春假日营</b>：{t}');
  D('today.tomorrow', 'tomorrow', '明日', '明天');
  D('why.winter', 'winter break', '聖誕新年假', '圣诞新年假期');
  D('why.family', 'Family Day', '家庭日', '家庭日');
  D('why.good', 'Good Friday', '耶穌受難日', '耶稣受难日');

  D('foot.cover', 'Exercise book', '練習簿', '练习本');
  D('foot.l.name', 'Name', '名稱', '名称');
  D('foot.l.subj', 'Subjects', '科目', '科目');
  D('foot.l.phone', 'Phone', '電話', '电话');
  D('foot.l.addr', 'Address', '地址', '地址');
  D('foot.l.hours', 'Hours', '開放時間', '开放时间');
  D('foot.subj', 'Math, English, science, French, Mandarin, Grades 1 to 12', '數學、英文、科學、法文、中文（一至十二年級）', '数学、英语、科学、法语、中文（1–12年级）');
  D('foot.hours.p', 'Mon to Fri 3:30 – 8:30 pm<br>Sat 9:00 am – 3:30 pm, Sun closed', '星期一至五 下午3:30 – 晚上8:30<br>星期六 上午9:00 – 下午3:30，星期日休息', '周一至周五 15:30–20:30<br>周六 9:00–15:30，周日休息');
  D('foot.pages', 'Pages', '網頁', '页面');
  D('foot.email', 'Email', '電郵', '邮箱');
  D('foot.copy', '© 2026 Maple Bridge Learning Centre, Markham', '© 2026 楓橋教育中心（萬錦）', '© 2026 枫桥教育中心（万锦）');
  D('foot.demo', 'This is a demo website. The tutoring centre is made up.', '此為示範網站，補習社純屬虛構。', '这是示范网站，补习班纯属虚构。');

  /* ---------- home ---------- */
  D('home.title', 'Maple Bridge Learning Centre | After-school tutoring in Markham, Grades 1 to 12', '楓橋教育中心｜萬錦課後補習社（一至十二年級）', '枫桥教育中心｜万锦课后补习班（1–12年级）');
  D('home.desc', 'After-school tutoring in Markham for Grades 1 to 12: math, English, science, French and Mandarin. Six students or fewer per class, Ontario curriculum, free trial class. Near Kennedy Rd and Bur Oak Ave.',
    '萬錦課後補習社，一至十二年級數學、英文、科學、法文及中文。每班最多 6 人，配合安省課程，免費試堂。近 Kennedy 及 Bur Oak 交界。',
    '万锦课后补习班，1–12年级数学、英语、科学、法语和中文。每班最多6人，按安省课程大纲教学，免费试听课。位于 Kennedy 和 Bur Oak 交界附近。');
  D('hero.what', 'After-school math, English and science tutoring for <span class="nw">Grades 1 to 12</span>', '<span class="nw">一至十二年級課後補習：</span><span class="nw">數學、英文、科學</span>', '<span class="nw">1–12年级课后补习：</span><span class="nw">数学、英语、科学</span>');
  D('hero.t1', RING(6) + ' students or fewer per class', '每班最多 ' + RING(6) + ' 個學生', '每班最多 ' + RING(6) + ' 名学生');
  D('hero.t2', 'Follows the Ontario curriculum', '配合安省課程', '按安省课程大纲教学');
  D('hero.t3', 'From $30 a class, books included', '每堂 $30 起，已包教材', '每节课 $30 起，含教材');
  D('hero.where', '88 Fernbrook Gate, near Kennedy and Bur Oak. Free parking.', '88 Fernbrook Gate，近 Kennedy 及 Bur Oak 交界，免費泊車。', '88 Fernbrook Gate，Kennedy 和 Bur Oak 交界附近，免费停车。');
  D('hero.more', 'See the timetable', '查看時間表', '查看课程表');
  D('hero.alt', 'A young student writing in her exercise book during class', '小學生在課堂上寫練習簿', '小学生在课堂上写练习本');
  D('hero.facts', 'Key facts', '重點', '重点');

  D('fees.h', 'Classes and fees', '課程及學費', '课程和学费');
  D('fees.p', 'Winter term: January 4 to March 27, 2027. 11 weeks, one class a week. Pay by term; Homework Club is paid by the month.',
    '冬季學期：2027 年 1 月 4 日至 3 月 27 日，共 11 星期，每星期一堂。學費按學期繳交，功課班按月收費。',
    '冬季学期：2027年1月4日至3月27日，共11周，每周一节课。学费按学期交，作业辅导班按月收费。');
  D('fees.c.prog', 'Program', '課程', '课程');
  D('fees.c.grades', 'Grades', '年級', '年级');
  D('fees.c.len', 'Each class', '每堂', '每节课');
  D('fees.c.fee', 'Fee', '學費', '学费');
  D('fees.r1', 'Math, English, science or French', '數學、英文、科學或法文', '数学、英语、科学或法语');
  D('fees.r1g', '1 to 6', '一至六年級', '1–6年级');
  D('fees.r2', 'Math, English, science or French', '數學、英文、科學或法文', '数学、英语、科学或法语');
  D('fees.r2g', '7 and 8', '七至八年級', '7–8年级');
  D('fees.r3', 'High school math (MTH1W to MCV4U), English, science, chemistry', '中學數學（MTH1W 至 MCV4U）、英文、科學、化學', '高中数学（MTH1W 到 MCV4U）、英语、科学、化学');
  D('fees.r3g', '9 to 12', '九至十二年級', '9–12年级');
  D('fees.r4', 'OSSLT prep, 8 weeks', 'OSSLT 備試班（8 星期）', 'OSSLT 备考班（8周）');
  D('fees.r4g', '10', '十年級', '10年级');
  D('fees.r5', 'Mandarin, Saturdays', '中文班（星期六）', '中文班（周六）');
  D('fees.r5g', '1 to 8', '一至八年級', '1–8年级');
  D('fees.r6', 'Homework Club', '功課班', '作业辅导班');
  D('fees.r6g', '1 to 8', '一至八年級', '1–8年级');
  D('len.60', '60 min', '60 分鐘', '60分钟');
  D('len.90', '90 min', '90 分鐘', '90分钟');
  D('len.club', 'Weekdays 3:30 to 6:30 pm', '星期一至五 下午3:30 – 6:30', '周一至周五 15:30–18:30');
  D('fee.440', '$440 a term<small>$40 a class</small>', '每學期 $440<small>每堂 $40</small>', '每学期 $440<small>每节 $40</small>');
  D('fee.550', '$550 a term<small>$50 a class</small>', '每學期 $550<small>每堂 $50</small>', '每学期 $550<small>每节 $50</small>');
  D('fee.660', '$660 a term<small>$60 a class</small>', '每學期 $660<small>每堂 $60</small>', '每学期 $660<small>每节 $60</small>');
  D('fee.400', '$400<small>$50 a class</small>', '$400<small>每堂 $50</small>', '$400<small>每节 $50</small>');
  D('fee.330', '$330 a term<small>$30 a class</small>', '每學期 $330<small>每堂 $30</small>', '每学期 $330<small>每节 $30</small>');
  D('fee.club', '$420 a month<small>5 days a week</small><small>3 days: $280</small>', '每月 $420<small>每星期 5 天</small><small>3 天：$280</small>', '每月 $420<small>每周5天</small><small>3天：$280</small>');
  D('fees.pen', 'Books and worksheets included. No extra charges.', '書簿、練習全包，不另收費。', '教材和练习全包，不另收费。');
  D('fees.curr', 'Every class follows the Ontario curriculum for that grade. High school classes go by course code (MTH1W, MCR3U, SCH3U and so on), the same codes as on the report card.',
    '每班都按安省該年級課程教授。中學課程以課程編號分班（例如 MTH1W、MCR3U、SCH3U），和成績表上的編號一樣。',
    '每个班都按安省该年级的课程大纲教学。高中课程按课程代码分班（比如 MTH1W、MCR3U、SCH3U），和成绩单上的代码一致。');
  D('fees.notes', 'Registration is $40 per family each school year. A second child in the same family gets 10% off.',
    '每個家庭每學年報名費 $40。同一家庭第二個孩子學費九折。', '每个家庭每学年报名费 $40。同一家庭第二个孩子学费九折。');
  D('fees.link', 'See the days and times for each class', '查看各班上課時間', '查看每个班的上课时间');

  D('trial.h', 'How the free trial class works', '免費試堂安排', '免费试听课流程');
  D('trial.1h', 'Tell us the grade and the subject', '告訴我們年級和科目', '告诉我们年级和科目');
  D('trial.1p', 'Send the form or call (905) 555-0162. We reply within one business day, in English, Cantonese or Mandarin.',
    '填表或致電 (905) 555-0162，我們會在一個工作天內以英語、廣東話或普通話回覆。',
    '在线填表或打电话 (905) 555-0162，我们会在一个工作日内用英语、粤语或普通话回复。');
  D('trial.2h', 'Your child joins a real class, free', '孩子免費試上一堂', '孩子免费试听一节课');
  D('trial.2p', 'Same class, same teacher, same worksheet as everyone else. The teacher spends the first 15 minutes seeing where your child is.',
    '和其他同學同一班、同一位老師、做同一份練習。老師會先用 15 分鐘了解孩子程度。',
    '和其他同学同一个班、同一位老师、做同一份练习。老师会先花15分钟了解孩子的水平。');
  D('trial.3h', 'You see the marked work', '家長看批改好的功課', '家长看批改好的作业');
  D('trial.3p', 'At pickup, the teacher shows you the marked page and suggests a class. Register only if it fits.',
    '接放學時，老師會給你看批改好的練習，並建議合適的班別。覺得合適才報名。',
    '接孩子的时候，老师会给您看批改好的练习，并推荐合适的班。觉得合适再报名。');
  D('trial.alt', 'A teacher and a student working through a problem together', '老師和學生一起做題', '老师和学生一起做题');

  D('teach.h', 'Our teachers', '導師', '老师介绍');
  D('teach.p', 'Each class keeps the same teacher all term. Three of our four class teachers are Ontario Certified Teachers.',
    '每班整個學期由同一位老師任教。四位任課老師之中，三位是安省註冊教師。',
    '每个班整个学期都由同一位老师上课。四位任课老师中有三位是安省注册教师。');
  D('teach.speaks', 'Speaks', '語言', '语言');
  D('teach.alt', 'A teacher points to a line in a student’s exercise book while another student writes', '老師指著學生練習簿上的一行，旁邊另一位同學在寫字', '老师指着学生练习本上的一行，旁边另一个同学在写字');
  D('t.lau.n', 'Ms. Lau', '劉老師', '刘老师');
  D('t.lau.r', 'Math, Grades 7 to 12', '數學（七至十二年級）', '数学（7–12年级）');
  D('t.lau.p', 'Ontario Certified Teacher. Taught high school math for 11 years.', '安省註冊教師，曾任中學數學老師 11 年。', '安省注册教师，在中学教了11年数学。');
  D('t.lau.l', 'Speaks English and Cantonese', '會講英語、廣東話', '会说英语、粤语');
  D('t.oka.n', 'Mr. Okafor', 'Okafor 老師', 'Okafor 老师');
  D('t.oka.r', 'English, OSSLT and French, Grades 7 to 12', '英文、OSSLT 及法文（七至十二年級）', '英语、OSSLT 和法语（7–12年级）');
  D('t.oka.p', 'Ontario Certified Teacher in English and French. Marks practice OSSLT tests the way the real test is marked.', '安省註冊教師（英文及法文）。OSSLT 模擬試卷按正式評分標準批改。', '安省注册教师（英语和法语）。OSSLT 模拟卷按正式评分标准批改。');
  D('t.oka.l', 'Speaks English and French', '會講英語、法語', '会说英语、法语');
  D('t.zhao.n', 'Ms. Zhao', '趙老師', '赵老师');
  D('t.zhao.r', 'Science, Grade 4 to 6 math, Mandarin', '科學、四至六年級數學、中文班', '科学、4–6年级数学、中文班');
  D('t.zhao.p', 'Chemistry degree and 8 years of tutoring.', '化學系畢業，有 8 年補習經驗。', '化学专业毕业，有8年辅导经验。');
  D('t.zhao.l', 'Speaks English and Mandarin', '會講英語、普通話', '会说英语、普通话');
  D('t.wong.n', 'Ms. Wong', '黃老師', '黄老师');
  D('t.wong.r', 'Reading, writing and math, Grades 1 to 6', '英文讀寫及數學（一至六年級）', '英语读写和数学（1–6年级）');
  D('t.wong.p', 'Ontario Certified Teacher for the primary grades.', '安省註冊教師（小學）。', '安省注册教师（小学）。');
  D('t.wong.l', 'Speaks English, Cantonese and Mandarin', '會講英語、廣東話、普通話', '会说英语、粤语、普通话');
  D('t.ip.n', 'Mr. Ip', '葉 Sir', '叶老师');
  D('t.ip.r', 'Director, Homework Club', '中心主任、功課班', '中心主任、作业辅导班');
  D('t.ip.p', 'Opened Maple Bridge in 2012. Runs the Homework Club and the school pickups.', '2012 年創辦楓橋，負責功課班和接放學。', '2012年创办枫桥，负责作业辅导班和放学接送。');
  D('t.ip.l', 'Speaks English and Cantonese', '會講英語、廣東話', '会说英语、粤语');

  D('par.h', 'For parents', '家長須知', '家长须知');
  D('par.p', 'Pickup, parking, missed classes and the other things parents ask us about most.', '接放學、泊車、缺課補堂，以及家長最常問的問題。', '接送、停车、缺课补课，还有家长最常问的问题。');
  D('par.alt', 'A student doing her homework at a table', '學生在桌前做功課', '学生在桌前写作业');
  D('par.pick.h', 'Drop-off and pickup', '接送', '接送孩子');
  D('par.pick.p', 'Pull into the six 10-minute spots by the main door, not the fire lane. Grades 1 to 3 wait inside until an adult signs them out at the front desk. Grade 4 and up can walk out to your car once you have told us in writing.',
    '請駛入正門旁的 6 個 10 分鐘泊車位，切勿停在消防通道。一至三年級學生會留在中心內，等家長到前枱簽名接走；四年級或以上，家長書面同意後可自行出來上車。',
    '请停在正门旁的6个10分钟临时车位，不要停在消防通道。1–3年级的孩子在中心里等，由大人到前台签字接走；4年级以上，家长书面同意后可以自己出来上车。');
  D('par.school.h', 'School pickup for Homework Club', '功課班接放學', '作业辅导班放学接送');
  D('par.school.p', 'Our staff walk students over from three nearby elementary schools at 3:20 pm. Call us to check if your child’s school is one of them.',
    '職員下午 3:20 到附近三間小學接學生，步行回中心。請致電查詢是否包括你孩子的學校。',
    '我们的老师下午3:20到附近三所小学接学生，步行回中心。请打电话确认是否包括您孩子的学校。');
  D('par.missed.h', 'Missed classes', '缺課及補堂', '缺课和补课');
  D('par.missed.p', 'Tell us by noon on the day. Your child can join another section of the same course that week. Missed classes are not refunded.',
    '請於上課當日中午前通知，孩子可在同一星期到同一課程的另一班補堂。缺課不設退款。',
    '请在上课当天中午前告诉我们，孩子可以在同一周去同一课程的另一个班补课。缺课不退费。');
  D('par.sick.h', 'Sick days', '生病請假', '生病请假');
  D('par.sick.p', 'If your child is sick but well enough to learn, they can join their class by video call. Ask the front desk for the link.',
    '孩子不舒服但仍可上課的話，可以視像上課，請向前枱索取連結。',
    '孩子不舒服但还能上课的话，可以视频上课，请向前台要链接。');
  D('par.pay.h', 'Payment', '付款方式', '付款方式');
  D('par.pay.p', 'Interac e-Transfer, debit, Visa, Mastercard or cheque. Term fees are due before the first class. Homework Club is paid monthly.',
    '可用 Interac e-Transfer、Debit 卡、Visa、Mastercard 或支票。學期學費須於開課前繳交，功課班按月繳費。',
    '可以用 Interac 电子转账、借记卡、Visa、Mastercard 或支票付款。学期学费需在开课前交清，作业辅导班按月交费。');
  D('par.food.h', 'Snacks and allergies', '小食及過敏', '零食和过敏');
  D('par.food.p', 'We are a nut-free centre. Homework Club students can bring a snack. Please tell us about allergies when you register.',
    '本中心不准帶果仁食物。功課班學生可自備小食。如有過敏，請在報名時告知。',
    '本中心禁止带坚果类食物。作业辅导班学生可以自带零食。如有过敏，请在报名时告诉我们。');
  D('par.report.h', 'Progress updates', '學習進度', '学习进度');
  D('par.report.p', 'The marked work comes home every week. You also get a short written note every month and a 15-minute meeting with the teacher each term.',
    '批改好的功課每星期帶回家；另外每月有一份簡短書面報告，每學期可與老師面談 15 分鐘。',
    '批改好的作业每周带回家；另外每月有一份简短的书面反馈，每学期可以和老师面谈15分钟。');

  D('dates.h', 'Term dates, PA days and March Break', '學期日期、PA Day 及三月假', '学期日期、PA Day 和春假');
  D('dates.p', 'We follow the York Region school calendar for PA days.', 'PA Day 跟約克區教育局校曆。', 'PA Day 按约克区教育局校历安排。');
  D('dt.break.d', 'December 24 to January 3', '12 月 24 日至 1 月 3 日', '12月24日至1月3日');
  D('dt.break', 'Winter break, closed', '聖誕新年假，休息', '圣诞新年假期，休息');
  D('dt.start.d', 'Monday, January 4', '1 月 4 日（星期一）', '1月4日（周一）');
  D('dt.start', 'First day of winter term', '冬季學期開課', '冬季学期开课');
  D('dt.family.d', 'Monday, February 15', '2 月 15 日（星期一）', '2月15日（周一）');
  D('dt.family', 'Family Day, closed', '家庭日，休息', '家庭日，休息');
  D('dt.march.d', 'March 15 to 19', '3 月 15 日至 19 日', '3月15日至19日');
  D('dt.march', 'March Break: no regular classes. Day camp 9:00 am to 4:00 pm, $300 for the week or $70 a day.', '三月假：常規課堂暫停，設日營（上午9:00 – 下午4:00），全星期 $300，或每日 $70。', '春假：常规课程暂停，开设日营（9:00–16:00），一周 $300，或每天 $70。');
  D('dt.good.d', 'Friday, March 26', '3 月 26 日（星期五）', '3月26日（周五）');
  D('dt.good', 'Good Friday, closed', '耶穌受難日，休息', '耶稣受难日，休息');
  D('dt.end.d', 'Saturday, March 27', '3 月 27 日（星期六）', '3月27日（周六）');
  D('dt.end', 'Last day of winter term', '冬季學期最後一天', '冬季学期最后一天');
  D('dt.pa.d', 'PA days', 'PA Day', 'PA Day');
  D('dt.pa', 'Day camp 8:30 am to 5:30 pm, $75. Book by the Friday before.', '日營 上午8:30 – 下午5:30，$75，請於前一個星期五或之前報名。', '日营 8:30–17:30，$75，请在前一个周五之前报名。');

  D('visit.h', 'Find us', '地址及交通', '地址和交通');
  D('visit.hours', 'Hours', '開放時間', '开放时间');
  D('visit.holiday', 'Closed on statutory holidays and over winter break. See the term dates above.', '公眾假期及聖誕新年假休息，詳見上面的學期日期。', '法定假日和圣诞新年假期休息，详见上面的学期日期。');
  D('visit.office', 'The front desk answers the phone from 1:00 pm on weekdays, in English, Cantonese and Mandarin.', '平日下午 1 時起有職員接聽電話，可講英語、廣東話或普通話。', '工作日下午1点起有人接电话，可以说英语、粤语或普通话。');
  D('visit.near', 'Second floor, near Kennedy Rd and Bur Oak Ave. There is an elevator in the lobby.', '二樓，近 Kennedy 及 Bur Oak 交界，大堂有升降機。', '二楼，靠近 Kennedy 和 Bur Oak 交界，大堂有电梯。');
  D('map.drive', 'By car: from Kennedy Road, go east on Bur Oak Avenue and turn left onto Fernbrook Gate. We are in the two-storey brick building on the right.',
    '駕車：由 Kennedy 路轉入 Bur Oak 大道向東行，左轉入 Fernbrook Gate，右邊兩層高紅磚大樓。',
    '开车：从 Kennedy 路上 Bur Oak 大道往东，左转进 Fernbrook Gate，右手边两层红砖楼就是。');
  D('map.bus', 'By bus: the stop at Kennedy Rd and Bur Oak Ave is a 4-minute walk.', '乘巴士：在 Kennedy 及 Bur Oak 站落車，步行約 4 分鐘。', '坐公交：在 Kennedy 和 Bur Oak 站下车，步行约4分钟。');
  D('map.park', 'Free parking in front of the building. For pickup, use the six 10-minute spots by the main door.', '大樓前免費泊車。接送可用正門旁的 6 個 10 分鐘泊車位。', '楼前免费停车。接送孩子可以用正门旁的6个10分钟临时车位。');
  D('map.open', 'Open in Google Maps', '在 Google 地圖開啟', '在 Google 地图中打开');
  D('map.title', 'Map of the area around Kennedy Rd and Bur Oak Ave, Markham', '地圖：萬錦 Kennedy 及 Bur Oak 一帶', '地图：万锦 Kennedy 和 Bur Oak 一带');
  D('visit.getting', 'Getting here', '交通', '怎么过来');
  D('visit.phone', 'Phone and email', '電話及電郵', '电话和邮箱');
  D('end.h', 'Want to see a class first?', '想先試一堂？', '想先试听一节课？');
  D('end.p', 'The trial class is free and there is nothing to sign. We reply within one business day.', '試堂免費，不用簽任何文件。我們會在一個工作天內回覆。', '试听课免费，不用签任何协议。我们会在一个工作日内回复。');

  /* ---------- home: work out your fees (the worked sum) ---------- */
  D('cost.h', 'Work out your fees', '計一計學費', '算一算学费');
  D('cost.p', 'Pick a grade and the classes. We add it up the same way the front desk does.',
    '選好年級和課程，即時計出一個學期的學費，計法和前台一樣。',
    '选好年级和课程，马上算出一个学期的学费，算法和前台一样。');
  D('cost.kid1', 'First child', '第一個孩子', '第一个孩子');
  D('cost.kid2', 'Second child', '第二個孩子', '第二个孩子');
  D('cost.grade', 'Grade', '年級', '年级');
  D('cost.classes', 'Classes, one a week', '課程（每星期一堂）', '课程（每周一节）');
  D('cost.club', 'Homework Club', '功課班', '作业辅导班');
  D('cost.club.0', 'No', '不用', '不需要');
  D('cost.club.3', '3 days a week', '每星期 3 天', '每周3天');
  D('cost.club.5', '5 days a week', '每星期 5 天', '每周5天');
  D('cost.add', 'Add a second child (10% off)', '加第二個孩子（九折）', '添加第二个孩子（九折）');
  D('cost.rm', 'Remove', '移除', '删除');
  D('cost.nogr', 'Pick a grade to see the classes.', '請先選擇年級。', '请先选择年级。');
  D('cost.line', '{s}, {g}', '{g}{s}', '{g}{s}');
  D('cost.reg', 'Registration, once a school year', '報名費（每學年一次）', '报名费（每学年一次）');
  D('cost.sib', 'Second child, 10% off', '第二個孩子九折', '第二个孩子九折');
  D('cost.total', 'Winter term total', '冬季學期合共', '冬季学期合计');
  D('cost.clubm', 'Homework Club, paid monthly: {m} a month', '功課班按月繳交：每月 {m}', '作业辅导班按月支付：每月 {m}');
  D('cost.empty', 'Tick a class to see the fee.', '選好課程，就會計出學費。', '选好课程，就会算出学费。');
  D('cost.fine', 'Books and worksheets included. The $40 registration is paid once per family each school year.',
    '已包書簿及練習。報名費 $40，每個家庭每學年交一次。', '含教材和练习。报名费 $40，每个家庭每学年交一次。');
  D('cost.link', 'See these classes in the timetable', '在時間表查看這些課程', '在课程表里查看这些课程');

  /* ---------- home: the trial-class worksheet (decorative, the steps carry the words) ---------- */
  D('ws.grade', 'Grade', '年級', '年级');
  D('ws.subj', 'Subject', '科目', '科目');
  D('ws.math', 'Math', '數學', '数学');
  D('ws.area', 'Area: 7 cm × 4 cm =', '面積：7 cm × 4 cm =', '面积：7 cm × 4 cm =');
  D('ws.note', 'Try Junior Math, <span class="nw">Mon 4:00 pm</span>', '建議：高小數學，<span class="nw">星期一下午4:00</span>', '建议：高年级数学，<span class="nw">周一16:00</span>');

  /* ---------- timetable ---------- */
  D('sch.title', 'Winter 2027 timetable | Maple Bridge Learning Centre', '2027 年冬季學期時間表｜楓橋教育中心', '2027年冬季学期课程表｜枫桥教育中心');
  D('sch.desc', 'Every class in the Winter 2027 term (January 4 to March 27), with grade, time, teacher, room and seats left. Filter by grade, subject and day.',
    '2027 年冬季學期（1 月 4 日至 3 月 27 日）所有班別，列明年級、時間、老師、課室及餘位，可按年級、科目及日子篩選。',
    '2027年冬季学期（1月4日至3月27日）所有班级，列出年级、时间、老师、教室和剩余名额，可以按年级、科目和日期筛选。');
  D('sch.h1', 'Winter 2027 timetable', '2027 年冬季學期時間表', '2027年冬季学期课程表');
  D('sch.lead', 'Classes run January 4 to March 27. No regular classes in March Break (March 15 to 19) or on Family Day.', '1 月 4 日至 3 月 27 日上課。三月假（3 月 15 至 19 日）及家庭日不設常規課堂。', '1月4日至3月27日上课。春假（3月15–19日）和家庭日没有常规课。');
  D('sch.updated', 'Seats last updated Monday, November 9, 2026. Please call to confirm before you register.', '餘位於 2026 年 11 月 9 日（星期一）更新，報名前請先致電確認。', '名额更新于2026年11月9日（周一），报名前请先打电话确认。');
  D('sch.f.label', 'Filter classes', '篩選班別', '筛选班级');
  D('sch.f.grade', 'Your child’s grade', '孩子年級', '孩子年级');
  D('sch.f.subject', 'Subject', '科目', '科目');
  D('sch.f.day', 'Day', '日子', '星期');
  D('sch.f.all', 'All', '全部', '全部');
  D('sch.f.allgrades', 'All grades', '全部年級', '全部年级');
  D('sch.f.clear', 'Clear filters', '清除篩選', '清除筛选');
  D('sch.view.label', 'View', '顯示方式', '显示方式');
  D('sch.view.grid', 'Week', '一週總覽', '周课表');
  D('sch.view.list', 'List', '列表', '列表');
  D('sch.count', '{n} of {t} classes match', '共 {t} 班，符合 {n} 班', '共 {t} 个班，符合条件的有 {n} 个');
  D('sch.count1', '1 of {t} classes matches', '共 {t} 班，符合 1 班', '共 {t} 个班，符合条件的有 1 个');
  D('sch.count.all', 'Showing all {t} classes', '顯示全部 {t} 班', '显示全部 {t} 个班');
  D('sch.empty.h', 'No classes match', '沒有符合的班別', '没有符合条件的班');
  D('sch.empty.p', 'We don’t run that combination this term. Clear the filters, or tell us what you need. We plan next term from these requests.',
    '本學期沒有這個組合。可清除篩選，或告訴我們你的需要，我們會按家長要求安排下學期課程。',
    '本学期没有这个组合。可以清除筛选，或者告诉我们您的需求，我们会根据家长的需求安排下学期的课程。');
  D('sch.empty.b', 'Tell us what you need', '告訴我們你的需要', '告诉我们您的需求');
  D('sch.wait', 'Ask about the waitlist', '查詢候補', '咨询候补');
  D('sch.seats', RING('{n}') + ' seats left', '餘 ' + RING('{n}') + ' 位', '剩 ' + RING('{n}') + ' 个名额');
  D('sch.seats1', RING('1') + ' seat left', '餘 ' + RING('1') + ' 位', '剩 ' + RING('1') + ' 个名额');
  D('sch.seats.aria', '{n} of 6 seats left', '6 個位剩 {n} 個', '6个名额剩 {n} 个');
  D('sch.full', 'Full', '已滿', '已满');
  D('sch.club', 'Space available', '有位', '有名额');
  D('sch.grade', 'Grade {g}', '{g}年級', '{g}年级');
  D('sch.grades', 'Grades {g}', '{g}年級', '{g}年级');
  D('sch.daycount', '{n} classes', '{n} 班', '{n} 个班');
  D('sch.daycount1', '1 class', '1 班', '1 个班');
  D('sch.time', 'Time', '時間', '时间');
  D('sch.nofri', 'No evening classes on Fridays', '星期五晚不設課堂', '周五晚上不排课');
  D('sch.grid.aria', 'Weekly timetable, days as columns and time slots as rows', '每週時間表：直行為星期，橫行為時段', '每周课程表：列为星期，行为时段');
  D('sch.legend.h', 'Reading the timetable', '時間表說明', '课程表说明');
  D('sch.legend.seats', 'The circled number is how many seats are left. Every class has 6 seats.', '圈住的數字是餘下的位，每班共 6 個位。', '圈出来的数字是剩余名额，每个班一共6个名额。');
  D('sch.legend.full', 'A full class takes a waitlist. We call you as soon as a seat opens.', '已滿的班可以排候補，有位會立即致電通知。', '满员的班可以排候补，有空位会马上打电话通知您。');
  D('sch.legend.time', 'Times on the left are the start and end of each class.', '左邊是每堂的開始及結束時間。', '左边是每节课的开始和结束时间。');
  D('sch.help.h', 'Not sure which class fits?', '不肯定哪一班合適？', '不确定哪个班合适？');
  D('sch.help.p', 'Book a free trial class. After the class, the teacher tells you which level fits your child.', '先預約免費試堂，上完之後老師會建議合適的程度和班別。', '先预约免费试听课，上完以后老师会推荐适合孩子的班。');
  D('sch.fees', 'See the fees', '查看學費', '查看学费');

  /* ---------- inquiry ---------- */
  D('inq.title', 'Book a free trial class | Maple Bridge Learning Centre', '預約免費試堂｜楓橋教育中心', '预约免费试听课｜枫桥教育中心');
  D('inq.desc', 'Book a free trial class or ask about a class. We reply within one business day in English, Cantonese or Mandarin.',
    '預約免費試堂或查詢課程，一個工作天內以英語、廣東話或普通話回覆。', '预约免费试听课或咨询课程，一个工作日内用英语、粤语或普通话回复。');
  D('inq.h1', 'Book a free trial class', '預約免費試堂', '预约免费试听课');
  D('inq.lead', 'Or ask us anything about classes. We reply within one business day, in English, Cantonese or Mandarin.', '亦可查詢任何課程問題。我們會在一個工作天內以英語、廣東話或普通話回覆。', '也可以咨询任何课程问题。我们会在一个工作日内用英语、粤语或普通话回复。');
  D('inq.form.aria', 'Trial class and inquiry form', '試堂及查詢表格', '试听课和咨询表');
  D('inq.topic', 'What would you like?', '查詢事項', '咨询事项');
  D('inq.topic.trial', 'Book a free trial class', '預約免費試堂', '预约免费试听课');
  D('inq.topic.class', 'Ask about a class', '查詢課程', '咨询课程');
  D('inq.topic.other', 'Ask something else', '其他查詢', '其他问题');
  D('inq.topic.wait', 'Ask about the waitlist', '查詢候補', '咨询候补');
  D('inq.submit.ask', 'Send my question', '提交查詢', '提交咨询');
  D('inq.side.park', 'Parking and pickup', '泊車及接放學', '停车和接送');
  D('inq.ok.l.topic', 'Request', '查詢事項', '咨询事项');
  D('inq.s1', 'About you', '家長資料', '家长信息');
  D('inq.s2', 'About your child', '孩子情況', '孩子情况');
  D('inq.s3', 'Anything else', '其他', '其他');
  D('inq.req', 'required', '必填', '必填');
  D('inq.opt', 'optional', '可不填', '选填');
  D('inq.name', 'Your name', '家長姓名', '家长姓名');
  D('inq.name.ph', 'e.g. Mrs. Chan', '例：陳太', '例如：陈女士');
  D('inq.phone', 'Phone', '電話', '电话');
  D('inq.email', 'Email', '電郵', '邮箱');
  D('inq.contact.hint', 'A phone number or an email is enough.', '電話或電郵，填一項即可。', '电话或邮箱，填一项就行。');
  D('inq.lang', 'Reply to me in', '回覆語言', '回复语言');
  D('inq.lang.en', 'English', '英語', '英语');
  D('inq.lang.yue', 'Cantonese', '廣東話', '粤语');
  D('inq.lang.cmn', 'Mandarin', '普通話', '普通话');
  D('inq.grade', 'Your child’s grade', '孩子年級', '孩子年级');
  D('inq.grade.hint', 'The grade they are in now (2026–27 school year).', '現時就讀的年級（2026–27 學年）。', '现在读的年级（2026–27学年）。');
  D('inq.grade.ph', 'Choose a grade', '請選擇年級', '请选择年级');
  D('inq.subjects', 'Subjects', '科目', '科目');
  D('inq.class', 'Class from the timetable', '時間表上的班別', '课程表上的班级');
  D('inq.class.none', 'No particular class yet', '暫時未有指定', '暂时没有指定');
  D('inq.class.picked', 'Filled in from the timetable. You can change it.', '已從時間表帶入，可以更改。', '已从课程表带入，可以修改。');
  D('inq.days', 'Days that suit you', '方便上課的日子', '方便上课的日子');
  D('inq.msg', 'Anything else we should know?', '有其他想讓我們知道的嗎？', '还有什么想告诉我们的？');
  D('inq.msg.ph', 'e.g. finds fractions hard, writing the OSSLT this spring, needs pickup by 6:00', '例如：分數較弱、今年春季考 OSSLT、6 點前要接走', '例如：分数比较弱、今年春天考 OSSLT、6点前要接走');
  D('inq.submit', 'Send request', '提交', '提交');
  D('inq.privacy', 'We use these details only to reply to you. We don’t ask for your child’s name, school or report card.', '資料只用於回覆你的查詢。我們不會問孩子的姓名、學校或成績表。', '信息只用于回复您的咨询。我们不会问孩子的姓名、学校或成绩单。');
  D('inq.demo', 'This is a demo form. Nothing is sent or saved.', '此為示範表格，資料不會傳送或儲存。', '这是演示表单，信息不会发送或保存。');
  D('inq.e.summary1', RING(1) + ' thing to fix before sending', '還有 ' + RING(1) + ' 處要改', '还有 ' + RING(1) + ' 处需要修改');
  D('inq.e.summaryn', RING('{n}') + ' things to fix before sending', '還有 ' + RING('{n}') + ' 處要改', '还有 ' + RING('{n}') + ' 处需要修改');
  D('inq.e.summary.sr1', 'One thing to fix before sending.', '還有 1 處要改。', '还有1处需要修改。');
  D('inq.e.summary.srn', '{n} things to fix before sending.', '還有 {n} 處要改。', '还有 {n} 处需要修改。');
  D('inq.e.name', 'Please add your name.', '請填寫你的姓名。', '请填写您的姓名。');
  D('inq.e.contact', 'Add a phone number or an email.', '請留電話或電郵。', '请留下电话或邮箱。');
  D('inq.e.phone', 'Phone needs 10 digits, e.g. 905 555 0199.', '電話要有 10 位數字，例如 905 555 0199。', '电话需要10位数字，例如 905 555 0199。');
  D('inq.e.email', 'Check the email: it needs an @ and a dot.', '電郵地址好像不對，請檢查「@」和「.」。', '邮箱格式不对，请检查“@”和“.”。');
  D('inq.e.grade', 'Please choose a grade.', '請選擇年級。', '请选择年级。');
  D('inq.ok.h', 'Thanks, {name}.', '多謝，{name}。', '谢谢，{name}。');
  D('inq.ok.real.phone', 'On a real site, we would call or text you within one business day, in {lang}.', '如果是正式網站，我們會在一個工作天內以{lang}致電或發短訊給你。', '如果是正式网站，我们会在一个工作日内用{lang}给您打电话或发短信。');
  D('inq.ok.real.email', 'On a real site, we would email you within one business day, in {lang}.', '如果是正式網站，我們會在一個工作天內以{lang}電郵回覆你。', '如果是正式网站，我们会在一个工作日内用{lang}给您发邮件。');
  D('inq.ok.demo', 'This is a demo site, so nothing was sent or saved. Here is what you filled in:', '這是示範網站，資料並沒有傳送或儲存。以下是你填寫的內容：', '这是示范网站，信息没有发送或保存。以下是您填写的内容：');
  D('inq.ok.none', 'Not given', '未有填寫', '未填写');
  D('inq.ok.again', 'Fill in another', '再填一份', '再填一份');
  D('inq.ok.back', 'Back to the timetable', '返回時間表', '返回课程表');
  D('inq.ok.l.contact', 'Phone or email', '電話或電郵', '电话或邮箱');
  D('inq.ok.pen', 'Received', '收到', '收到');
  D('inq.side.h', 'Prefer to call?', '想直接致電？', '想直接打电话？');
  D('inq.priv.h', 'What we don’t ask for', '我們不會問的資料', '我们不会问的信息');
  D('inq.priv.p', 'No child’s name, school, date of birth or report card. The grade is enough for us to suggest a class.', '不會問孩子姓名、學校、出生日期或成績表。知道年級已足夠安排班別。', '不会问孩子的姓名、学校、出生日期或成绩单。知道年级就足够安排班级了。');
  D('inq.next.h', 'After you send this', '提交之後', '提交之后');
  D('inq.next.p', 'We call or email within one business day to set a trial date. The trial class is free and there is nothing to sign.', '我們會在一個工作天內致電或電郵，約定試堂日子。試堂免費，不用簽任何文件。', '我们会在一个工作日内打电话或发邮件，约定试听时间。试听课免费，不用签任何协议。');

  /* ---------- grades and days ---------- */
  var gHant = ['', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'];
  for (var g = 1; g <= 12; g++) D('grade.' + g, 'Grade ' + g, gHant[g] + '年級', g + '年级');
  D('day.mon', 'Monday', '星期一', '周一');
  D('day.tue', 'Tuesday', '星期二', '周二');
  D('day.wed', 'Wednesday', '星期三', '周三');
  D('day.thu', 'Thursday', '星期四', '周四');
  D('day.fri', 'Friday', '星期五', '周五');
  D('day.sat', 'Saturday', '星期六', '周六');
  D('day.sun', 'Sunday', '星期日', '周日');
  D('day.mon.s', 'Mon', '星期一', '周一');
  D('day.tue.s', 'Tue', '星期二', '周二');
  D('day.wed.s', 'Wed', '星期三', '周三');
  D('day.thu.s', 'Thu', '星期四', '周四');
  D('day.fri.s', 'Fri', '星期五', '周五');
  D('day.sat.s', 'Sat', '星期六', '周六');

  window.MPi18n.init(d);
})();
