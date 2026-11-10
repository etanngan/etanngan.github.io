/* Jade Basket Dim Sum House — single source of truth for the menu.
   Used by menu.html, qr.html and the signature showcase on index.html.
   n: [zh-Hant, zh-Hans, en]   d: [en, zh-Hant, zh-Hans]
   t: dim sum size tier (S/M/L/XL/SP)  |  p: fixed price  |  incl: covered by the tea charge
   q: pieces per order   tags: g = signature, v = vegetarian, p = contains peanuts, s = spicy */
window.JB = {
  tiers: { S: 5.5, M: 6.5, L: 7.5, XL: 8.5, SP: 9.8 },
  tierOrder: ['S', 'M', 'L', 'XL', 'SP'],
  tierChar: {
    S: { en: '小', 'zh-Hant': '小', 'zh-Hans': '小' },
    M: { en: '中', 'zh-Hant': '中', 'zh-Hans': '中' },
    L: { en: '大', 'zh-Hant': '大', 'zh-Hans': '大' },
    XL: { en: '特', 'zh-Hant': '特', 'zh-Hans': '特' },
    SP: { en: '頂', 'zh-Hant': '頂', 'zh-Hans': '顶' }
  },
  teaCharge: 2,
  earlyBird: 5.5,
  signatures: ['s01', 's02', 's06', 'f02', 'r01', 'b01'],
  cats: [
    { id: 'steamed', name: { en: 'Steamed', 'zh-Hant': '蒸點', 'zh-Hans': '蒸点' },
      note: { en: 'Steamed to order. Allow seven to ten minutes.', 'zh-Hant': '即叫即蒸，需時約七至十分鐘。', 'zh-Hans': '现点现蒸，约需七到十分钟。' } },
    { id: 'fried', name: { en: 'Fried & Baked', 'zh-Hant': '煎炸焗', 'zh-Hans': '煎炸焗' },
      note: { en: 'From the wok, the flat-top and the oven.', 'zh-Hant': '油鑊、煎板、焗爐，各有火候。', 'zh-Hans': '油锅、煎板、烤炉，各有各的火候。' } },
    { id: 'rolls', name: { en: 'Rice Rolls', 'zh-Hant': '腸粉', 'zh-Hans': '肠粉' },
      note: { en: 'Rice sheets pulled fresh for every order.', 'zh-Hant': '布拉腸粉，落單才拉。', 'zh-Hans': '布拉肠粉，下单才拉。' } },
    { id: 'congee', name: { en: 'Congee & Noodles', 'zh-Hant': '粥粉麵', 'zh-Hans': '粥粉面' },
      note: { en: 'Priced per dish. Served all day.', 'zh-Hant': '按碟計，全日供應。', 'zh-Hans': '按份计价，全天供应。' } },
    { id: 'bbq', name: { en: 'BBQ & Kitchen', 'zh-Hant': '燒味小菜', 'zh-Hans': '烧味小菜' },
      note: { en: 'Priced per dish. Roast meats from 11 am until they run out.', 'zh-Hant': '按碟計。燒味上午十一時起供應，售完即止。', 'zh-Hans': '按份计价。烧味上午11点起供应，售完为止。' } },
    { id: 'sweets', name: { en: 'Sweets', 'zh-Hant': '甜品', 'zh-Hans': '甜品' },
      note: { en: 'Order these with your last round.', 'zh-Hant': '宜留待最後一輪落單。', 'zh-Hans': '建议最后一轮再点。' } },
    { id: 'tea', name: { en: 'Tea', 'zh-Hant': '茗茶', 'zh-Hans': '茗茶' },
      note: { en: 'House teas are covered by the $2.00 per-person tea charge.', 'zh-Hant': '茶位每位 $2.00，以下茗茶任選。', 'zh-Hans': '茶位费每位 $2.00，以下茶叶任选。' } }
  ],
  items: [
    /* ---------- Steamed ---------- */
    { id: 's01', c: 'steamed', n: ['翠籠蝦餃皇', '翠笼虾饺皇', 'Har Gow'], t: 'L', q: 4, tags: 'g',
      d: ['Whole shrimp and bamboo shoot in a translucent wheat-starch wrapper. Thirteen pleats each.', '原隻鮮蝦配筍粒，澄麵皮薄而透，每隻十三摺。', '整只鲜虾配笋丁，澄面皮薄而透亮，每只十三道褶。'] },
    { id: 's02', c: 'steamed', n: ['蟹籽燒賣皇', '蟹籽烧卖皇', 'Siu Mai'], t: 'L', q: 4, tags: 'g',
      d: ['Hand-chopped pork and shrimp with shiitake, open at the top, finished with flying-fish roe.', '手切豬肉、鮮蝦、冬菇，頂綴蟹籽。', '手切猪肉、鲜虾、香菇，顶上点蟹籽。'] },
    { id: 's03', c: 'steamed', n: ['豉汁蒸鳳爪', '豉汁蒸凤爪', 'Black Bean Chicken Feet'], t: 'M', tags: 'p',
      d: ['Fung zao: fried, then braised until tender in black bean sauce, with peanuts underneath.', '先炸後炆，豉汁入味，墊底花生吸盡醬汁。', '先炸后焖，豉汁入味，垫底的花生吸足了酱汁。'] },
    { id: 's04', c: 'steamed', n: ['豉汁蒸排骨', '豉汁蒸排骨', 'Black Bean Spare Ribs'], t: 'M', tags: '',
      d: ['Bite-size pork ribs steamed with fermented black bean and garlic over cubes of taro.', '一口排骨，蒜蓉豆豉同蒸，底下墊芋頭粒。', '小块排骨配蒜蓉豆豉同蒸，下面垫着芋头丁。'] },
    { id: 's05', c: 'steamed', n: ['蜜汁叉燒包', '蜜汁叉烧包', 'Char Siu Bao'], t: 'M', q: 3, tags: '',
      d: ['Fluffy steamed buns that split open at the top, filled with our own honey-roast pork.', '包身鬆軟，頂部自然爆口，餡料用自家明爐叉燒。', '包子松软，顶上自然开花，馅用的是自家烤的叉烧。'] },
    { id: 's06', c: 'steamed', n: ['流沙奶皇包', '流沙奶黄包', 'Lau Sa Bao'], t: 'L', q: 3, tags: 'gv',
      d: ['Molten salted-egg-yolk custard in a soft bun. Tear it carefully — it runs.', '鹹蛋黃奶皇餡，熱食流心，小心燙口。', '咸蛋黄奶黄馅，趁热掰开会流心，小心烫嘴。'] },
    { id: 's07', c: 'steamed', n: ['鮮竹牛肉球', '鲜竹牛肉球', 'Steamed Beef Balls'], t: 'M', q: 3, tags: '',
      d: ['Springy beef with water chestnut and tangerine peel on bean curd skin. Worcestershire on the side.', '牛肉打至起膠，加馬蹄、陳皮，墊鮮腐竹，另上喼汁。', '牛肉搅打上劲，加马蹄和陈皮，垫鲜腐竹，配喼汁蘸食。'] },
    { id: 's08', c: 'steamed', n: ['珍珠糯米雞', '珍珠糯米鸡', 'Lo Mai Gai'], t: 'L', q: 2, tags: '',
      d: ['Sticky rice with chicken, Chinese sausage, shiitake and salted egg yolk, steamed in lotus leaf.', '荷葉包裹糯米、雞件、臘腸、冬菇及鹹蛋黃。', '荷叶裹着糯米、鸡块、腊肠、香菇和咸蛋黄。'] },
    { id: 's09', c: 'steamed', n: ['潮州蒸粉果', '潮州蒸粉果', 'Chiu Chow Fun Gor'], t: 'M', q: 3, tags: 'p',
      d: ['Chewy crystal dumplings of pork, dried shrimp, jicama, chives and crushed peanuts.', '粉皮煙韌，包入豬肉、蝦米、沙葛、韭菜及碎花生。', '粉皮有嚼劲，馅里有猪肉、虾米、沙葛、韭菜和花生碎。'] },
    { id: 's10', c: 'steamed', n: ['花菇上素餃', '花菇上素饺', 'Mushroom & Vegetable Dumplings'], t: 'M', q: 3, tags: 'v',
      d: ['Shiitake, wood ear, carrot and glass noodle in a spinach-green wrapper.', '花菇、木耳、甘筍、粉絲，菠菜汁造皮。', '花菇、木耳、胡萝卜、粉丝，菠菜汁和的皮。'] },
    { id: 's11', c: 'steamed', n: ['蠔皇鮮竹卷', '蚝皇鲜竹卷', 'Bean Curd Skin Rolls'], t: 'M', q: 3, tags: '',
      d: ['Pork, shrimp and bamboo shoot wrapped in tofu skin, fried, then steamed in oyster-sauce gravy.', '腐皮包豬肉、鮮蝦、筍絲，先炸後蒸，淋蠔皇芡汁。', '腐皮包猪肉、虾仁、笋丝，先炸后蒸，浇蚝油芡汁。'] },
    { id: 's12', c: 'steamed', n: ['沙爹金錢肚', '沙爹金钱肚', 'Satay Honeycomb Tripe'], t: 'M', tags: 'sp',
      d: ['Beef tripe simmered soft in a mild satay sauce. The sauce contains peanuts.', '金錢肚炆至軟腍，沙爹汁微辣，含花生。', '金钱肚炖得软烂，沙爹酱微辣，含花生。'] },
    { id: 's13', c: 'steamed', n: ['上湯灌湯餃', '上汤灌汤饺', 'Soup Dumpling in Broth'], t: 'SP', q: 1, tags: '',
      d: ['One large dumpling of pork, shrimp and dried scallop in superior stock. Red vinegar alongside.', '一碗一隻，內有豬肉、鮮蝦、瑤柱，浸於上湯，配大紅浙醋。', '一碗一只，馅是猪肉、鲜虾、干贝，泡在上汤里，配大红浙醋。'] },
    { id: 's14', c: 'steamed', n: ['古法馬拉糕', '古法马拉糕', 'Ma Lai Go'], t: 'M', tags: 'v',
      d: ['Old-style steamed brown-sugar sponge from a three-day starter. Light, with a little caramel.', '麵種發酵三天，黃糖香氣，鬆軟不膩。', '面种发足三天，带黄糖香，松软不腻。'] },

    /* ---------- Fried & Baked ---------- */
    { id: 'f01', c: 'fried', n: ['臘味蘿蔔糕', '腊味萝卜糕', 'Lo Bak Go'], t: 'M', q: 3, tags: '',
      d: ['Turnip cake — daikon, really — with Chinese sausage and dried shrimp, pan-fried crisp at the edges.', '足料蘿蔔絲，加臘腸、蝦米，煎至兩面金黃。', '萝卜丝给得足，加腊肠、虾米，煎到两面金黄。'] },
    { id: 'f02', c: 'fried', n: ['酥皮焗叉燒包', '酥皮焗叉烧包', 'Baked Char Siu Bao'], t: 'L', q: 3, tags: 'g',
      d: ['Baked buns with a crackly sweet crust over honey-roast pork. A fresh tray every twenty minutes.', '菠蘿脆皮面，內藏蜜汁叉燒，每二十分鐘出爐一次。', '表面一层酥脆甜皮，里面是蜜汁叉烧，每二十分钟出一炉。'] },
    { id: 'f03', c: 'fried', n: ['安蝦鹹水角', '安虾咸水角', 'Ham Sui Gok'], t: 'M', q: 3, tags: '',
      d: ['Fried glutinous-rice dumplings: a crisp, chewy shell around savoury pork and dried shrimp.', '外脆內軟糯，餡料鹹香，有豬肉及蝦米。', '外壳脆、里层软糯，馅是咸香的猪肉和虾米。'] },
    { id: 'f04', c: 'fried', n: ['蜂巢荔芋角', '蜂巢荔芋角', 'Wu Gok'], t: 'M', q: 3, tags: '',
      d: ['Taro puffs with a lacy fried crust and a creamy pork and mushroom centre.', '芋蓉炸起蜂巢酥面，內餡是豬肉冬菇。', '芋泥炸出蜂巢状的酥皮，里面是猪肉香菇馅。'] },
    { id: 'f05', c: 'fried', n: ['上素脆春卷', '上素脆春卷', 'Vegetable Spring Rolls'], t: 'M', q: 3, tags: 'v',
      d: ['Cabbage, carrot, wood ear and glass noodle in a thin wrapper that shatters.', '椰菜、甘筍、木耳、粉絲，皮薄香脆。', '圆白菜、胡萝卜、木耳、粉丝，皮薄酥脆。'] },
    { id: 'f06', c: 'fried', n: ['鮮蝦腐皮卷', '鲜虾腐皮卷', 'Crispy Shrimp Bean Curd Rolls'], t: 'L', q: 3, tags: '',
      d: ['Whole shrimp and yellow chive in tofu skin, fried. Worcestershire for dipping.', '腐皮包原隻蝦及韭黃，炸至香脆，蘸喼汁。', '腐皮卷着整只虾和韭黄，炸得酥脆，蘸喼汁吃。'] },
    { id: 'f07', c: 'fried', n: ['香煎韭菜餃', '香煎韭菜饺', 'Pan-Fried Chive Dumplings'], t: 'M', q: 3, tags: '',
      d: ['Garlic chive and shrimp in a crystal wrapper, seared golden on both sides.', '韭菜鮮蝦餡，水晶皮煎至金黃。', '韭菜虾仁馅，水晶皮两面煎黄。'] },
    { id: 'f08', c: 'fried', n: ['生煎鍋貼', '生煎锅贴', 'Pork Potstickers'], t: 'M', q: 4, tags: '',
      d: ['Pork and napa cabbage, crisp on the bottom. Red vinegar and ginger on the side.', '豬肉紹菜餡，底脆皮軟，配浙醋薑絲。', '猪肉白菜馅，底脆皮软，配香醋姜丝。'] },
    { id: 'f09', c: 'fried', n: ['椒鹽豆腐', '椒盐豆腐', 'Salt & Pepper Tofu'], t: 'M', tags: 'vs',
      d: ['Silken tofu cubes fried crisp, tossed with garlic, chili and scallion.', '滑豆腐炸至外脆內嫩，蒜粒、辣椒、葱花兜勻。', '嫩豆腐炸到外脆里嫩，拌上蒜粒、辣椒和葱花。'] },

    /* ---------- Rice Rolls ---------- */
    { id: 'r01', c: 'rolls', n: ['脆皮紅米腸', '脆皮红米肠', 'Crispy Shrimp Red Rice Roll'], t: 'SP', tags: 'g',
      d: ['Shrimp in a crisp fried net, wrapped in a soft red-rice sheet. Sweet soy and sesame sauce.', '紅米腸粉包着脆網鮮蝦，一軟一脆，配甜豉油及麻醬。', '红米肠粉裹着脆网鲜虾，一软一脆，配甜酱油和麻酱。'] },
    { id: 'r02', c: 'rolls', n: ['鮮蝦腸粉', '鲜虾肠粉', 'Shrimp Cheung Fun'], t: 'L', tags: '',
      d: ['Rice sheets steamed to order around whole shrimp. Sweet soy is poured at the table.', '即叫即拉，包原隻鮮蝦，席前淋甜豉油。', '现点现拉，裹整只鲜虾，上桌再淋甜酱油。'] },
    { id: 'r03', c: 'rolls', n: ['叉燒腸粉', '叉烧肠粉', 'Char Siu Cheung Fun'], t: 'M', tags: '',
      d: ['Diced honey-roast pork and scallion in silky rice rolls.', '蜜汁叉燒粒配葱花，粉皮滑身。', '蜜汁叉烧丁配葱花，粉皮爽滑。'] },
    { id: 'r04', c: 'rolls', n: ['香茜牛肉腸', '香菜牛肉肠', 'Beef & Cilantro Cheung Fun'], t: 'M', tags: '',
      d: ['Minced beef with fresh cilantro and a little tangerine peel.', '免治牛肉配芫茜，帶少許陳皮香。', '牛肉末配香菜，带一点陈皮香。'] },
    { id: 'r05', c: 'rolls', n: ['炸兩', '炸两', 'Zha Leung'], t: 'M', tags: 'v',
      d: ['A fresh fried cruller wrapped in rice sheet: soft outside, crunch inside. Eat it at once.', '腸粉包新鮮油炸鬼，外滑內脆，宜即食。', '肠粉裹着刚炸的油条，外滑里脆，趁热吃。'] },
    { id: 'r06', c: 'rolls', n: ['甜醬齋腸', '甜酱斋肠', 'Plain Rolls, Three Sauces'], t: 'S', tags: 'vp',
      d: ['Plain rolled rice sheets with sesame seeds, hoisin, sesame sauce and peanut sauce. A Hong Kong street breakfast.', '淨腸粉灑芝麻，配甜醬、麻醬、花生醬，街頭早餐風味。', '素肠粉撒芝麻，配甜酱、麻酱、花生酱，港式街头早点的味道。'] },

    /* ---------- Congee & Noodles ---------- */
    { id: 'c01', c: 'congee', n: ['皮蛋瘦肉粥', '皮蛋瘦肉粥', 'Preserved Egg & Pork Congee'], p: 9.8, tags: '',
      d: ['Rice simmered three hours until it breaks down, with century egg and salted lean pork.', '明火煲足三小時，米粒開花，配皮蛋及鹹瘦肉。', '明火熬足三小时，米粒开花，配皮蛋和咸瘦肉。'] },
    { id: 'c02', c: 'congee', n: ['荔灣艇仔粥', '荔湾艇仔粥', 'Boat Congee'], p: 10.8, tags: 'p',
      d: ['Sampan style: fish, squid, pork rind, shredded egg, peanuts and scallion.', '魚片、魷魚、豬皮、蛋絲、花生、葱花，材料豐富。', '鱼片、鱿鱼、猪皮、蛋丝、花生、葱花，料多实在。'] },
    { id: 'c03', c: 'congee', n: ['生滾魚片粥', '生滚鱼片粥', 'Sliced Fish Congee'], p: 11.8, tags: '',
      d: ['Fish fillet poached in the congee only once you order, with ginger and lettuce.', '落單才將魚片滾熟，加薑絲、生菜絲。', '下单后才把鱼片烫熟，加姜丝和生菜丝。'] },
    { id: 'c04', c: 'congee', n: ['白粥配油炸鬼', '白粥配油条', 'Plain Congee & Cruller'], p: 5.8, tags: 'v',
      d: ['Plain slow-cooked congee with a freshly fried dough stick.', '綿滑白粥，配即炸油炸鬼一條。', '绵滑白粥，配现炸油条一根。'] },
    { id: 'c05', c: 'congee', n: ['鮮蝦雲吞麵', '鲜虾云吞面', 'Shrimp Wonton Noodle Soup'], p: 12.8, tags: '',
      d: ['Six shrimp wontons and thin egg noodles with some bite, in dried-flounder broth.', '雲吞六粒，幼蛋麵爽口，大地魚湯底。', '云吞六只，细蛋面爽口，大地鱼汤底。'] },
    { id: 'c06', c: 'congee', n: ['干炒牛河', '干炒牛河', 'Beef Chow Fun'], p: 17.8, tags: 'g',
      d: ['Wide rice noodles, beef, bean sprouts and yellow chive over a hard flame. Dry, smoky, never greasy.', '猛火快炒，河粉條條分明，有鑊氣而不油膩。', '猛火快炒，河粉根根分明，镬气十足又不油腻。'] },
    { id: 'c07', c: 'congee', n: ['豉油皇炒麵', '豉油皇炒面', 'Soy Sauce Chow Mein'], p: 14.8, tags: 'v',
      d: ['Thin egg noodles stir-fried with bean sprouts, scallion and first-press soy.', '幼麵配銀芽、葱段，頭抽炒香。', '细面配豆芽、葱段，用头抽炒香。'] },
    { id: 'c08', c: 'congee', n: ['星洲炒米', '星洲炒米粉', 'Singapore Vermicelli'], p: 17.8, tags: 's',
      d: ['Rice vermicelli with shrimp, char siu, egg and peppers in a mild curry.', '米粉配鮮蝦、叉燒、蛋絲、青紅椒，咖喱微辣。', '米粉配虾仁、叉烧、蛋丝、青红椒，咖喱微辣。'] },
    { id: 'c09', c: 'congee', n: ['揚州炒飯', '扬州炒饭', 'Yeung Chow Fried Rice'], p: 16.8, tags: '',
      d: ['Shrimp, char siu, egg and scallion. Every grain separate.', '鮮蝦、叉燒、雞蛋、葱花，飯粒乾身分明。', '虾仁、叉烧、鸡蛋、葱花，米饭粒粒分明。'] },

    /* ---------- BBQ & Kitchen ---------- */
    { id: 'b01', c: 'bbq', n: ['脆皮燒腩仔', '脆皮烧腩仔', 'Crispy Roast Pork Belly'], p: 17.8, tags: 'g',
      d: ['Five-layer belly under glass-crisp crackling, cut to order. Mustard on the side.', '五層腩肉，皮脆如玻璃，即叫即切，配芥末。', '五花腩层次分明，皮脆得像玻璃，现点现切，配芥末酱。'] },
    { id: 'b02', c: 'bbq', n: ['蜜汁叉燒', '蜜汁叉烧', 'Honey Char Siu'], p: 16.8, tags: '',
      d: ['Pork shoulder roasted in the hanging oven with a maltose glaze and charred edges.', '梅頭肉掛爐燒製，麥芽糖上色，邊位微焦。', '梅花肉挂炉烤制，麦芽糖上色，边角微焦。'] },
    { id: 'b03', c: 'bbq', n: ['明爐燒鴨', '明炉烧鸭', 'Roast Duck'], p: 17.8, tags: '',
      d: ['A regular plate is about a quarter bird, with plum sauce. Ask for a half or whole duck.', '例牌約四分一隻，配酸梅醬；半隻、原隻歡迎查詢。', '例份约四分之一只，配酸梅酱；半只、整只可另点。'] },
    { id: 'b04', c: 'bbq', n: ['玫瑰豉油雞', '玫瑰豉油鸡', 'Soy Sauce Chicken'], p: 16.8, tags: '',
      d: ['Poached in rose-wine soy until just set, with ginger-scallion oil.', '玫瑰露豉油浸熟，肉質嫩滑，配薑葱蓉。', '玫瑰露酱油浸熟，肉嫩皮滑，配姜葱蓉。'] },
    { id: 'b05', c: 'bbq', n: ['燒味雙拼', '烧味双拼', 'Two-BBQ Combination'], p: 22.8, tags: '',
      d: ['Choose any two: char siu, roast pork belly, roast duck, soy sauce chicken.', '叉燒、燒腩、燒鴨、豉油雞，任選兩款。', '叉烧、烧腩、烧鸭、豉油鸡，任选两样。'] },
    { id: 'b06', c: 'bbq', n: ['蒜蓉炒豆苗', '蒜蓉炒豆苗', 'Garlic Pea Shoots'], p: 16.8, tags: 'v',
      d: ['Pea shoots flashed in the wok with garlic. Seasonal — ask which greens came in today.', '豆苗猛火快炒，蒜香清甜。時菜供應視乎當造。', '豆苗大火快炒，蒜香清甜。时令蔬菜以当天到货为准。'] },
    { id: 'b07', c: 'bbq', n: ['蠔油芥蘭', '蚝油芥蓝', 'Gai Lan with Oyster Sauce'], p: 9.8, tags: '',
      d: ['Blanched Chinese broccoli with oyster sauce. Every table should have one.', '白灼芥蘭，淋蠔油，爽脆解膩。', '白灼芥蓝淋蚝油，爽脆解腻。'] },
    { id: 'b08', c: 'bbq', n: ['椒鹽鮮魷', '椒盐鲜鱿', 'Salt & Pepper Squid'], p: 15.8, tags: 's',
      d: ['Lightly battered squid, fried and tossed with garlic, chili and five-spice salt.', '鮮魷薄漿炸脆，蒜粒、辣椒、椒鹽兜勻。', '鲜鱿裹薄浆炸脆，拌上蒜粒、辣椒和椒盐。'] },

    /* ---------- Sweets ---------- */
    { id: 'd01', c: 'sweets', n: ['酥皮蛋撻', '酥皮蛋挞', 'Dan Tat'], t: 'M', q: 3, tags: 'v',
      d: ['Egg custard tarts in flaky pastry, served warm from the oven.', '酥皮層層分明，蛋漿嫩滑，暖食最佳。', '酥皮层次分明，蛋液嫩滑，趁热最好吃。'] },
    { id: 'd02', c: 'sweets', n: ['楊枝甘露', '杨枝甘露', 'Mango Pomelo Sago'], t: 'L', tags: 'v',
      d: ['Chilled mango and coconut cream with pomelo and sago pearls.', '芒果、椰汁、柚子肉、西米，冰凍供應。', '芒果、椰浆、柚子粒、西米，冰镇供应。'] },
    { id: 'd03', c: 'sweets', n: ['香煎馬蹄糕', '香煎马蹄糕', 'Water Chestnut Cake'], t: 'M', q: 3, tags: 'v',
      d: ['Translucent amber cake with crunchy water chestnut, pan-seared.', '晶瑩彈牙，粒粒馬蹄，煎香上桌。', '晶莹弹牙，吃得到马蹄粒，煎香了上桌。'] },
    { id: 'd04', c: 'sweets', n: ['黑芝麻煎堆仔', '黑芝麻煎堆', 'Jin Deui'], t: 'M', q: 3, tags: 'v',
      d: ['Fried sesame balls, crisp and chewy, filled with black sesame paste.', '外層香脆，內裏軟糯，黑芝麻蓉流心。', '外皮香脆，里面软糯，黑芝麻馅会流心。'] },
    { id: 'd05', c: 'sweets', n: ['椰汁桂花糕', '椰汁桂花糕', 'Osmanthus & Coconut Jelly'], t: 'M', q: 3, tags: 'v',
      d: ['Layers of osmanthus-flower agar jelly and coconut milk. Cold, fragrant, not too sweet.', '桂花、椰汁相間千層，清香而不太甜。', '桂花冻和椰汁冻层层相间，清香不腻。'] },
    { id: 'd06', c: 'sweets', n: ['擂沙湯圓', '擂沙汤圆', 'Lui Sa Tong Yuen'], t: 'M', q: 3, tags: 'vp',
      d: ['Soft glutinous rice balls rolled in crushed peanut, sesame and sugar.', '軟糯湯圓，滾滿花生碎、芝麻及砂糖。', '软糯的汤圆裹满花生碎、芝麻和白糖。'] },
    { id: 'd07', c: 'sweets', n: ['薑汁豆腐花', '姜汁豆腐花', 'Dau Fu Fa'], t: 'S', tags: 'v',
      d: ['Warm silken tofu pudding with ginger syrup.', '豆花嫩滑，熱食，另配薑汁糖水。', '豆花嫩滑，热食，配姜汁糖水。'] },

    /* ---------- Tea ---------- */
    { id: 't01', c: 'tea', n: ['香片', '香片', 'Jasmine (Heung Pin)'], incl: true, tags: '',
      d: ['Green tea scented with jasmine. The easy first pot.', '茉莉花香，清爽易入口，初次飲茶之選。', '茉莉花茶，清爽好入口，头一回来可以先点它。'] },
    { id: 't02', c: 'tea', n: ['普洱', '普洱', 'Pu-erh (Bo Lei)'], incl: true, tags: '',
      d: ['Dark and earthy; the classic partner for rich dim sum.', '茶色深、味醇厚，解膩首選。', '茶汤深、味道醇，最解腻。'] },
    { id: 't03', c: 'tea', n: ['菊普', '菊普', 'Guk Bo'], incl: true, tags: '',
      d: ['Pu-erh with chrysanthemum flowers: half earthy, half floral.', '普洱加杭菊，醇中帶清。', '普洱加杭白菊，醇厚里带清香。'] },
    { id: 't04', c: 'tea', n: ['鐵觀音', '铁观音', 'Tieguanyin'], incl: true, tags: '',
      d: ['Roasted oolong with a little orchid and a long finish.', '炭焙烏龍，蘭花香，回甘悠長。', '炭焙乌龙，带兰花香，回甘悠长。'] },
    { id: 't05', c: 'tea', n: ['壽眉', '寿眉', 'Shou Mei'], incl: true, tags: '',
      d: ['Mellow white tea, gentle on an empty stomach.', '白茶，性溫和，空肚亦宜。', '白茶，性子温和，空腹喝也合适。'] },
    { id: 't06', c: 'tea', n: ['十年陳普洱', '十年陈普洱', 'Ten-Year Aged Pu-erh'], p: 8, unit: 'pot', tags: '',
      d: ['From tea cakes we store ourselves, brewed in a clay pot. Smooth, no bite.', '自家存倉茶餅，紫砂壺沖泡，入口順滑。', '自家存的茶饼，紫砂壶冲泡，入口顺滑。'] }
  ]
};
/* helpers shared by every page */
(function (JB) {
  var L = function () { return (window.MPi18n && MPi18n.lang) || 'en'; };
  JB.name = function (it, lang) { lang = lang || L(); return lang === 'zh-Hant' ? it.n[0] : lang === 'zh-Hans' ? it.n[1] : it.n[2]; };
  JB.zhName = function (it, lang) { lang = lang || L(); return lang === 'zh-Hans' ? it.n[1] : it.n[0]; };
  JB.desc = function (it, lang) { lang = lang || L(); return lang === 'zh-Hant' ? it.d[1] : lang === 'zh-Hans' ? it.d[2] : it.d[0]; };
  JB.price = function (it) { return it.t ? JB.tiers[it.t] : (it.p || 0); };
  JB.money = function (n) { return '$' + n.toFixed(2); };
  JB.byId = function (id) { for (var i = 0; i < JB.items.length; i++) if (JB.items[i].id === id) return JB.items[i]; return null; };
  JB.has = function (it, tag) { return (it.tags || '').indexOf(tag) > -1; };
})(window.JB);
