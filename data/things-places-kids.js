/* =====================================================================
   Midnight & Light — Things & Places (kids track)
   Grammar already taught:
   これは〜です / これも〜です / AのB / 〜じゃないです /
   ここ・そこ・あれ

   Keep this file intentionally conservative: do not add それ・あそこ・
   います・あります until they have been taught.
   ===================================================================== */
// Distractors: literal meaning, playful reaction, accurate explanation.
const TP_GROUPS=[
  {
    "id": "this",
    "icon": "👉",
    "jp": "これ・これも",
    "en": "This / This too",
    "zh": "这是／这也是"
  },
  {
    "id": "no",
    "icon": "🎒",
    "jp": "AのB",
    "en": "Whose thing?",
    "zh": "谁的东西？"
  },
  {
    "id": "negative",
    "icon": "🙅",
    "jp": "じゃないです",
    "en": "It is not…",
    "zh": "不是……"
  },
  {
    "id": "place",
    "icon": "📍",
    "jp": "ここ・そこ・あれ",
    "en": "Here / there / that",
    "zh": "这里／那里／那个"
  },
  {
    "id": "mix",
    "icon": "😈",
    "jp": "Mix It Up",
    "en": "Mix everything",
    "zh": "全部混合"
  }
];

const TP_QUESTIONS=[
  {
    "id": "this-pencil",
    "group": "this",
    "scene": "👉✏️",
    "en": "Introduce the pointed object. Say: “This is a pencil.”",
    "zh": "介绍指着的东西。说：「这是铅笔。」",
    "options": [
      {
        "jp": "これは えんぴつです。",
        "ok": true
      },
      {
        "jp": "これも えんぴつです。",
        "kind": "real",
        "emoji": "✏️➕❓",
        "en": "“Too”? The pencil is looking around for its teammate.",
        "zh": "「也是」？铅笔左右看了看：我的队友呢？",
        "teachEn": "も means “too”, referring to something mentioned earlier. Here, use は for “This is…”.",
        "teachZh": "も是「也」，呼应前文。本题只说「这是……」，用は。",
        "meaningEn": "This is a pencil too.",
        "meaningZh": "这也是铅笔。"
      },
      {
        "jp": "これは ほんです。",
        "emoji": "✏️📖❓",
        "en": "A book? This one has only one line—and no pages.",
        "zh": "书？这本只有一条，而且还没有书页。",
        "teachEn": "The sentence works, but the noun does not match the picture.",
        "teachZh": "句型成立，但名词和图片不符。",
        "kind": "real",
        "meaningEn": "This is a book.",
        "meaningZh": "这是书。"
      }
    ]
  },
  {
    "id": "also-pencil",
    "group": "this",
    "scene": "✏️  ＋  👉✏️",
    "en": "You have already called the first pencil a pencil. Say: “This is a pencil too.”",
    "zh": "已经说过第一件是铅笔。现在说：「这也是铅笔。」",
    "options": [
      {
        "jp": "これも えんぴつです。",
        "ok": true
      },
      {
        "jp": "これは えんぴつです。",
        "kind": "real",
        "emoji": "✏️   ✏️😶",
        "en": "The second pencil got introduced. The “too” is still waiting outside.",
        "zh": "第二支铅笔介绍完了，「也」还在门口等着进来。",
        "teachEn": "は introduces the item; も adds “too”. This task asks for “too”.",
        "teachZh": "は介绍东西；も加上「也」。本题要说「这也是……」。",
        "meaningEn": "This is a pencil.",
        "meaningZh": "这是铅笔。"
      },
      {
        "jp": "これも ほんです。",
        "emoji": "✏️📖",
        "en": "The pencil opened a bookshop. Stock: one pencil.",
        "zh": "铅笔开了家书店。库存：一支铅笔。",
        "teachEn": "The sentence works, but the noun does not match the picture.",
        "teachZh": "句型成立，但名词和图片不符。",
        "kind": "real",
        "meaningEn": "This is a book too.",
        "meaningZh": "这也是书。"
      }
    ]
  },
  {
    "id": "this-book",
    "group": "this",
    "scene": "👉📖",
    "en": "Introduce the pointed object. Say: “This is a book.”",
    "zh": "介绍指着的东西。说：「这是书。」",
    "options": [
      {
        "jp": "これは ほんです。",
        "ok": true
      },
      {
        "jp": "これも ほんです。",
        "kind": "real",
        "emoji": "📖➕👻",
        "en": "“This book too.” A book from an earlier conversation just got a shout-out.",
        "zh": "「这本也是。」前面聊过的那本书突然被点名了。",
        "teachEn": "も means “too”, referring to something mentioned earlier. Here, use は for “This is…”.",
        "teachZh": "も是「也」，呼应前文。本题只说「这是……」，用は。",
        "meaningEn": "This is a book too.",
        "meaningZh": "这也是书。"
      },
      {
        "jp": "これは かさです。",
        "emoji": "📖☂️",
        "en": "A paper umbrella! The rain is delighted.",
        "zh": "纸做的雨伞！雨一听就乐了。",
        "teachEn": "The sentence works, but the noun does not match the picture.",
        "teachZh": "句型成立，但名词和图片不符。",
        "kind": "real",
        "meaningEn": "This is an umbrella.",
        "meaningZh": "这是雨伞。"
      }
    ]
  },
  {
    "id": "also-book",
    "group": "this",
    "scene": "📖  ＋  👉📖",
    "en": "You have already called the first book a book. Say: “This is a book too.”",
    "zh": "已经说过第一件是书。现在说：「这也是书。」",
    "options": [
      {
        "jp": "これも ほんです。",
        "ok": true
      },
      {
        "jp": "これは ほんです。",
        "kind": "real",
        "emoji": "📖   📖🙄",
        "en": "A perfectly good sentence. One tiny “too” missed the bus.",
        "zh": "句子没坏，只是那个小小的「也」没赶上车。",
        "teachEn": "は introduces the item; も adds “too”. This task asks for “too”.",
        "teachZh": "は介绍东西；も加上「也」。本题要说「这也是……」。",
        "meaningEn": "This is a book.",
        "meaningZh": "这是书。"
      },
      {
        "jp": "これも えんぴつです。",
        "emoji": "📖✏️",
        "en": "A pencil with pages. Please sharpen the table of contents.",
        "zh": "带书页的铅笔。请先削一下目录。",
        "teachEn": "The sentence works, but the noun does not match the picture.",
        "teachZh": "句型成立，但名词和图片不符。",
        "kind": "real",
        "meaningEn": "This is a pencil too.",
        "meaningZh": "这也是铅笔。"
      }
    ]
  },
  {
    "id": "this-umbrella",
    "group": "this",
    "scene": "👉☂️",
    "en": "Introduce the pointed object. Say: “This is an umbrella.”",
    "zh": "介绍指着的东西。说：「这是雨伞。」",
    "options": [
      {
        "jp": "これは かさです。",
        "ok": true
      },
      {
        "jp": "これも かさです。",
        "kind": "real",
        "emoji": "☂️➕❓",
        "en": "“Too” has arrived. Its other umbrella is still off-screen.",
        "zh": "「也」已经到了，它的另一把伞还没入镜。",
        "teachEn": "も means “too”, referring to something mentioned earlier. Here, use は for “This is…”.",
        "teachZh": "も是「也」，呼应前文。本题只说「这是……」，用は。",
        "meaningEn": "This is an umbrella too.",
        "meaningZh": "这也是雨伞。"
      },
      {
        "jp": "これは えんぴつです。",
        "emoji": "☂️✏️",
        "en": "A pencil? No wonder your homework won't fit in the pencil case.",
        "zh": "铅笔？难怪你的文具盒怎么也关不上。",
        "teachEn": "The sentence works, but the noun does not match the picture.",
        "teachZh": "句型成立，但名词和图片不符。",
        "kind": "real",
        "meaningEn": "This is a pencil.",
        "meaningZh": "这是铅笔。"
      }
    ]
  },
  {
    "id": "also-umbrella",
    "group": "this",
    "scene": "☂️  ＋  👉☂️",
    "en": "You have already called the first umbrella a umbrella. Say: “This is a umbrella too.”",
    "zh": "已经说过第一件是雨伞。现在说：「这也是雨伞。」",
    "options": [
      {
        "jp": "これも かさです。",
        "ok": true
      },
      {
        "jp": "これは かさです。",
        "kind": "real",
        "emoji": "☂️   ☂️😑",
        "en": "You introduced the umbrella, but left “too” out in the rain.",
        "zh": "雨伞进句子了，「也」还在外面淋雨。",
        "teachEn": "は introduces the item; も adds “too”. This task asks for “too”.",
        "teachZh": "は介绍东西；も加上「也」。本题要说「这也是……」。",
        "meaningEn": "This is an umbrella.",
        "meaningZh": "这是雨伞。"
      },
      {
        "jp": "これも ほんです。",
        "emoji": "☂️📖",
        "en": "A book with a handle. Reading in the rain just got ambitious.",
        "zh": "带把手的书。下雨天读书，装备也太齐全了。",
        "teachEn": "The sentence works, but the noun does not match the picture.",
        "teachZh": "句型成立，但名词和图片不符。",
        "kind": "real",
        "meaningEn": "This is a book too.",
        "meaningZh": "这也是书。"
      }
    ]
  },
  {
    "id": "this-apple",
    "group": "this",
    "scene": "👉🍎",
    "en": "Introduce the pointed object. Say: “This is a apple.”",
    "zh": "介绍指着的东西。说：「这是苹果。」",
    "options": [
      {
        "jp": "これは りんごです。",
        "ok": true
      },
      {
        "jp": "これも りんごです。",
        "kind": "real",
        "emoji": "🍎➕❓",
        "en": "“Also an apple.” Someone from the earlier conversation has joined the fruit club.",
        "zh": "「也是苹果。」前面聊过的那位也加入水果队了。",
        "teachEn": "も means “too”, referring to something mentioned earlier. Here, use は for “This is…”.",
        "teachZh": "も是「也」，呼应前文。本题只说「这是……」，用は。",
        "meaningEn": "This is an apple too.",
        "meaningZh": "这也是苹果。"
      },
      {
        "jp": "これは ぎゅうにゅうです。",
        "emoji": "🍎🥛",
        "en": "Crunchy milk. The straw has resigned.",
        "zh": "会咔嚓响的牛奶。吸管辞职了。",
        "teachEn": "The sentence works, but the noun does not match the picture.",
        "teachZh": "句型成立，但名词和图片不符。",
        "kind": "real",
        "meaningEn": "This is milk.",
        "meaningZh": "这是牛奶。"
      }
    ]
  },
  {
    "id": "also-apple",
    "group": "this",
    "scene": "🍎  ＋  👉🍎",
    "en": "You have already called the first apple a apple. Say: “This is a apple too.”",
    "zh": "已经说过第一件是苹果。现在说：「这也是苹果。」",
    "options": [
      {
        "jp": "これも りんごです。",
        "ok": true
      },
      {
        "jp": "これは りんごです。",
        "kind": "real",
        "emoji": "🍎   🍎👀",
        "en": "The apple is correct. The “too” has rolled under the table.",
        "zh": "苹果没说错，「也」滚到桌子底下去了。",
        "teachEn": "は introduces the item; も adds “too”. This task asks for “too”.",
        "teachZh": "は介绍东西；も加上「也」。本题要说「这也是……」。",
        "meaningEn": "This is an apple.",
        "meaningZh": "这是苹果。"
      },
      {
        "jp": "これも かさです。",
        "emoji": "🍎☂️",
        "en": "An apple umbrella. One drop of rain and lunch is washed.",
        "zh": "苹果雨伞。一滴雨下来，午餐顺便洗好了。",
        "teachEn": "The sentence works, but the noun does not match the picture.",
        "teachZh": "句型成立，但名词和图片不符。",
        "kind": "real",
        "meaningEn": "This is an umbrella too.",
        "meaningZh": "这也是雨伞。"
      }
    ]
  },
  {
    "id": "no-mum-umbrella",
    "group": "no",
    "scene": "👩 ➜ ☂️",
    "en": "The umbrella belongs to Mum.",
    "zh": "这把雨伞是妈妈的。",
    "options": [
      {
        "jp": "これは おかあさんの かさです。",
        "ok": true
      },
      {
        "jp": "これは おとうさんの かさです。",
        "emoji": "👨☂️  👩😑",
        "en": "You called it Dad's. Mum is checking the name label.",
        "zh": "你说这是爸爸的。妈妈已经开始翻名字标签了。",
        "teachEn": "Check the owner. AのB means “A’s B”.",
        "teachZh": "看清主人。AのB表示「A的B」。",
        "kind": "real",
        "meaningEn": "This is Dad's umbrella.",
        "meaningZh": "这是爸爸的雨伞。"
      },
      {
        "jp": "これは いもうとの かさです。",
        "emoji": "👧☂️  👩❓",
        "en": "Little sister's umbrella? Mum would like a word.",
        "zh": "妹妹的伞？妈妈有话要说。",
        "teachEn": "Check the owner. AのB means “A’s B”.",
        "teachZh": "看清主人。AのB表示「A的B」。",
        "kind": "real",
        "meaningEn": "This is my little sister's umbrella.",
        "meaningZh": "这是妹妹的雨伞。"
      }
    ]
  },
  {
    "id": "no-dad-book",
    "group": "no",
    "scene": "👨 ➜ 📖",
    "en": "The book belongs to Dad.",
    "zh": "这本书是爸爸的。",
    "options": [
      {
        "jp": "これは おとうさんの ほんです。",
        "ok": true
      },
      {
        "jp": "これは おかあさんの ほんです。",
        "emoji": "👩📖  👨🤨",
        "en": "You called it Mum's book. Dad is still on page 12.",
        "zh": "你说是妈妈的书。爸爸还读到第十二页呢。",
        "teachEn": "Check the owner. AのB means “A’s B”.",
        "teachZh": "看清主人。AのB表示「A的B」。",
        "kind": "real",
        "meaningEn": "This is Mum's book.",
        "meaningZh": "这是妈妈的书。"
      },
      {
        "jp": "これは いもうとの ほんです。",
        "emoji": "👧📖  👨🙃",
        "en": "You called it little sister's. Dad's bookmark is protesting.",
        "zh": "你说是妹妹的。爸爸的书签第一个不服。",
        "teachEn": "Check the owner. AのB means “A’s B”.",
        "teachZh": "看清主人。AのB表示「A的B」。",
        "kind": "real",
        "meaningEn": "This is my little sister's book.",
        "meaningZh": "这是妹妹的书。"
      }
    ]
  },
  {
    "id": "no-sister-pencil",
    "group": "no",
    "scene": "👧 ➜ ✏️",
    "en": "The pencil belongs to your little sister.",
    "zh": "这支铅笔是妹妹的。",
    "options": [
      {
        "jp": "これは いもうとの えんぴつです。",
        "ok": true
      },
      {
        "jp": "これは おかあさんの えんぴつです。",
        "emoji": "👩✏️  👧😤",
        "en": "You called it Mum's pencil. Little sister is guarding her pencil case.",
        "zh": "你说是妈妈的铅笔。妹妹已经抱紧文具盒了。",
        "teachEn": "Check the owner. AのB means “A’s B”.",
        "teachZh": "看清主人。AのB表示「A的B」。",
        "kind": "real",
        "meaningEn": "This is Mum's pencil.",
        "meaningZh": "这是妈妈的铅笔。"
      },
      {
        "jp": "これは おとうさんの えんぴつです。",
        "emoji": "👨✏️  👧🙅",
        "en": "You called it Dad's. Little sister would like her homework pencil back.",
        "zh": "你说是爸爸的。妹妹：那我的功课谁帮我写？",
        "teachEn": "Check the owner. AのB means “A’s B”.",
        "teachZh": "看清主人。AのB表示「A的B」。",
        "kind": "real",
        "meaningEn": "This is Dad's pencil.",
        "meaningZh": "这是爸爸的铅笔。"
      }
    ]
  },
  {
    "id": "no-my-umbrella",
    "group": "no",
    "scene": "🙋 ➜ ☂️",
    "en": "The umbrella belongs to you.",
    "zh": "这把雨伞是你的。",
    "options": [
      {
        "jp": "これは わたしの かさです。",
        "ok": true
      },
      {
        "jp": "これは おかあさんの かさです。",
        "emoji": "🙋☂️  👩❓",
        "en": "You called your umbrella Mum's. She wasn't expecting presents today.",
        "zh": "你把自己的伞说成妈妈的。妈妈：今天还有礼物收？",
        "teachEn": "Check the owner. AのB means “A’s B”.",
        "teachZh": "看清主人。AのB表示「A的B」。",
        "kind": "real",
        "meaningEn": "This is Mum's umbrella.",
        "meaningZh": "这是妈妈的雨伞。"
      },
      {
        "jp": "これは いもうとの かさです。",
        "emoji": "🙋☂️  👧✨",
        "en": "You called it little sister's. She says, “Thank you!” You say, “Wait…”",
        "zh": "你说是妹妹的。妹妹：「谢谢！」你：「等一下……」",
        "teachEn": "Check the owner. AのB means “A’s B”.",
        "teachZh": "看清主人。AのB表示「A的B」。",
        "kind": "real",
        "meaningEn": "This is my little sister's umbrella.",
        "meaningZh": "这是妹妹的雨伞。"
      }
    ]
  },
  {
    "id": "no-mum-book",
    "group": "no",
    "scene": "👩 ➜ 📖",
    "en": "Choose the sentence that says “Mum's book.”",
    "zh": "选择表示「妈妈的书」的句子。",
    "options": [
      {
        "jp": "これは おかあさんの ほんです。",
        "ok": true
      },
      {
        "jp": "これは おかあさんと ほんです。",
        "emoji": "👩🤝📖",
        "en": "Mum AND a book. Both checked in; neither knows whose book it is.",
        "zh": "妈妈和书都到场了。书是谁的？两位都没回答。",
        "teachEn": "と means “and”; の shows ownership: A’s B.",
        "teachZh": "と是「和」；の才表示「谁的东西」。",
        "kind": "real",
        "meaningEn": "This is Mum and a book.",
        "meaningZh": "这是妈妈和书。"
      },
      {
        "jp": "おかあさんも ほんです。",
        "emoji": "👩➡️📖😱",
        "en": "Mum is also a book. Does she come with a bedtime-story button?",
        "zh": "妈妈也是书。那她有没有睡前故事播放键？",
        "teachEn": "も means “too”. For someone’s thing, use owner＋の＋thing.",
        "teachZh": "も是「也」。说谁的东西，用「主人＋の＋东西」。",
        "kind": "real",
        "meaningEn": "Mum is also a book.",
        "meaningZh": "妈妈也是书。"
      }
    ]
  },
  {
    "id": "no-dad-umbrella",
    "group": "no",
    "scene": "👨 ➜ ☂️",
    "en": "Which one means “Dad's umbrella”?",
    "zh": "哪一句表示「爸爸的雨伞」？",
    "options": [
      {
        "jp": "これは おとうさんの かさです。",
        "ok": true
      },
      {
        "jp": "これは おとうさんと かさです。",
        "emoji": "👨🤝☂️",
        "en": "Dad AND an umbrella. Two guests, one invitation.",
        "zh": "爸爸和雨伞。两位来宾，一张邀请卡。",
        "teachEn": "と means “and”; の shows ownership: A’s B.",
        "teachZh": "と是「和」；の才表示「谁的东西」。",
        "kind": "real",
        "meaningEn": "This is Dad and an umbrella.",
        "meaningZh": "这是爸爸和雨伞。"
      },
      {
        "jp": "おとうさんも かさです。",
        "emoji": "👨☂️😵",
        "en": "Dad is also an umbrella. Please ask before opening Dad.",
        "zh": "爸爸也是雨伞。打开爸爸之前，请先问一下。",
        "teachEn": "も means “too”. For someone’s thing, use owner＋の＋thing.",
        "teachZh": "も是「也」。说谁的东西，用「主人＋の＋东西」。",
        "kind": "real",
        "meaningEn": "Dad is also an umbrella.",
        "meaningZh": "爸爸也是雨伞。"
      }
    ]
  },
  {
    "id": "no-sister-book",
    "group": "no",
    "scene": "👧 ➜ 📖",
    "en": "Choose “my little sister's book.”",
    "zh": "选择「妹妹的书」。",
    "options": [
      {
        "jp": "これは いもうとの ほんです。",
        "ok": true
      },
      {
        "jp": "いもうとも ほんです。",
        "emoji": "👧📖😨",
        "en": "Little sister is also a book. Please don't fold her corners.",
        "zh": "妹妹也是书。请不要把妹妹折角。",
        "teachEn": "も means “too”. For someone’s thing, use owner＋の＋thing.",
        "teachZh": "も是「也」。说谁的东西，用「主人＋の＋东西」。",
        "kind": "real",
        "meaningEn": "My little sister is also a book.",
        "meaningZh": "妹妹也是书。"
      },
      {
        "jp": "これは いもうとと ほんです。",
        "emoji": "👧🤝📖",
        "en": "Little sister AND a book. The book is tagging along again.",
        "zh": "妹妹和书。书又跟着妹妹一起出门了。",
        "teachEn": "と means “and”; の shows ownership: A’s B.",
        "teachZh": "と是「和」；の才表示「谁的东西」。",
        "kind": "real",
        "meaningEn": "This is my little sister and a book.",
        "meaningZh": "这是妹妹和书。"
      }
    ]
  },
  {
    "id": "no-my-pencil",
    "group": "no",
    "scene": "🙋 ➜ ✏️",
    "en": "Which sentence means “my pencil”?",
    "zh": "哪一句表示「我的铅笔」？",
    "options": [
      {
        "jp": "これは わたしの えんぴつです。",
        "ok": true
      },
      {
        "jp": "これは わたしと えんぴつです。",
        "emoji": "🙋🤝✏️",
        "en": "You AND a pencil. A team of two; only one does the writing.",
        "zh": "你和铅笔组成一队。负责写字的那位不能缺席。",
        "teachEn": "と means “and”; の shows ownership: A’s B.",
        "teachZh": "と是「和」；の才表示「谁的东西」。",
        "kind": "real",
        "meaningEn": "This is me and a pencil.",
        "meaningZh": "这是我和铅笔。"
      },
      {
        "jp": "わたしも えんぴつです。",
        "emoji": "🙋➡️✏️",
        "en": "You are also a pencil. Pencil case or bedroom tonight?",
        "zh": "你也是铅笔。今晚睡房间，还是文具盒？",
        "teachEn": "も means “too”. For someone’s thing, use owner＋の＋thing.",
        "teachZh": "も是「也」。说谁的东西，用「主人＋の＋东西」。",
        "kind": "real",
        "meaningEn": "I am also a pencil.",
        "meaningZh": "我也是铅笔。"
      }
    ]
  },
  {
    "id": "neg-not-book",
    "group": "negative",
    "scene": "👉✏️   📖❌",
    "en": "Say: “This is not a book.”",
    "zh": "说：「这不是书。」",
    "options": [
      {
        "jp": "これは ほんじゃないです。",
        "ok": true
      },
      {
        "jp": "これは ほんです。",
        "kind": "real",
        "emoji": "✏️➡️📖",
        "en": "A book? The pencil is still searching for page two.",
        "zh": "书？铅笔还在找第二页。",
        "teachEn": "です means “is”; じゃないです means “is not”. Check the object and owner.",
        "teachZh": "です是「是」；じゃないです是「不是」。看清物品和主人。",
        "meaningEn": "This is a book.",
        "meaningZh": "这是书。"
      },
      {
        "jp": "これは えんぴつじゃないです。",
        "kind": "real",
        "emoji": "✏️😧",
        "en": "“Not a pencil.” The pencil checked its reflection twice.",
        "zh": "「不是铅笔。」铅笔照了两次镜子。",
        "teachEn": "です means “is”; じゃないです means “is not”. Check the object and owner.",
        "teachZh": "です是「是」；じゃないです是「不是」。看清物品和主人。",
        "meaningEn": "This is not a pencil.",
        "meaningZh": "这不是铅笔。"
      }
    ]
  },
  {
    "id": "neg-not-pencil",
    "group": "negative",
    "scene": "👉📖   ✏️❌",
    "en": "Say: “This is not a pencil.”",
    "zh": "说：「这不是铅笔。」",
    "options": [
      {
        "jp": "これは えんぴつじゃないです。",
        "ok": true
      },
      {
        "jp": "これは えんぴつです。",
        "kind": "real",
        "emoji": "📖➡️✏️",
        "en": "A pencil with chapters. Sharpening it could take all afternoon.",
        "zh": "有章节的铅笔。削完可能都放学了。",
        "teachEn": "です means “is”; じゃないです means “is not”. Check the object and owner.",
        "teachZh": "です是「是」；じゃないです是「不是」。看清物品和主人。",
        "meaningEn": "This is a pencil.",
        "meaningZh": "这是铅笔。"
      },
      {
        "jp": "これは ほんじゃないです。",
        "kind": "real",
        "emoji": "📖😱",
        "en": "“Not a book.” The book opened itself: “And these pages?”",
        "zh": "「不是书。」书翻开自己：那这些是什么？",
        "teachEn": "です means “is”; じゃないです means “is not”. Check the object and owner.",
        "teachZh": "です是「是」；じゃないです是「不是」。看清物品和主人。",
        "meaningEn": "This is not a book.",
        "meaningZh": "这不是书。"
      }
    ]
  },
  {
    "id": "neg-not-umbrella",
    "group": "negative",
    "scene": "👉📖   ☂️❌",
    "en": "Say: “This is not an umbrella.”",
    "zh": "说：「这不是雨伞。」",
    "options": [
      {
        "jp": "これは かさじゃないです。",
        "ok": true
      },
      {
        "jp": "これは かさです。",
        "kind": "real",
        "emoji": "📖☔💦",
        "en": "A book umbrella. Chapter one: everybody gets wet.",
        "zh": "书本雨伞。第一章：大家都湿了。",
        "teachEn": "です means “is”; じゃないです means “is not”. Check the object and owner.",
        "teachZh": "です是「是」；じゃないです是「不是」。看清物品和主人。",
        "meaningEn": "This is an umbrella.",
        "meaningZh": "这是雨伞。"
      },
      {
        "jp": "これは ほんじゃないです。",
        "kind": "real",
        "emoji": "📖😵",
        "en": "“Not a book.” The bookmark quietly packed its bags.",
        "zh": "「不是书。」书签默默收拾行李。",
        "teachEn": "です means “is”; じゃないです means “is not”. Check the object and owner.",
        "teachZh": "です是「是」；じゃないです是「不是」。看清物品和主人。",
        "meaningEn": "This is not a book.",
        "meaningZh": "这不是书。"
      }
    ]
  },
  {
    "id": "neg-not-apple",
    "group": "negative",
    "scene": "👉☂️   🍎❌",
    "en": "Say: “This is not an apple.”",
    "zh": "说：「这不是苹果。」",
    "options": [
      {
        "jp": "これは りんごじゃないです。",
        "ok": true
      },
      {
        "jp": "これは りんごです。",
        "kind": "real",
        "emoji": "☂️🍎",
        "en": "An apple with a handle! The fruit basket needs a bigger door.",
        "zh": "带长把手的苹果！水果篮得换个大一点的门。",
        "teachEn": "です means “is”; じゃないです means “is not”. Check the object and owner.",
        "teachZh": "です是「是」；じゃないです是「不是」。看清物品和主人。",
        "meaningEn": "This is an apple.",
        "meaningZh": "这是苹果。"
      },
      {
        "jp": "これは かさじゃないです。",
        "kind": "real",
        "emoji": "☂️😤",
        "en": "“Not an umbrella.” It was halfway through opening.",
        "zh": "「不是雨伞。」它都已经打开一半了。",
        "teachEn": "です means “is”; じゃないです means “is not”. Check the object and owner.",
        "teachZh": "です是「是」；じゃないです是「不是」。看清物品和主人。",
        "meaningEn": "This is not an umbrella.",
        "meaningZh": "这不是雨伞。"
      }
    ]
  },
  {
    "id": "neg-owner",
    "group": "negative",
    "scene": "👩☂️   👨❌",
    "en": "The umbrella is Mum's, not Dad's.",
    "zh": "这把雨伞是妈妈的，不是爸爸的。",
    "options": [
      {
        "jp": "これは おとうさんの かさじゃないです。",
        "ok": true
      },
      {
        "jp": "これは おとうさんの かさです。",
        "kind": "real",
        "emoji": "👨☂️  👩😑",
        "en": "You called it Dad's umbrella. Mum has raised one eyebrow.",
        "zh": "你说是爸爸的伞。妈妈的一边眉毛已经抬起来了。",
        "teachEn": "です means “is”; じゃないです means “is not”. Check the object and owner.",
        "teachZh": "です是「是」；じゃないです是「不是」。看清物品和主人。",
        "meaningEn": "This is Dad's umbrella.",
        "meaningZh": "这是爸爸的雨伞。"
      },
      {
        "jp": "これは おかあさんの かさじゃないです。",
        "kind": "real",
        "emoji": "👩☂️😧",
        "en": "“Not Mum's.” Mum is looking at the label: “Then who am I?”",
        "zh": "「不是妈妈的。」妈妈看了看名字标签：那我是谁？",
        "teachEn": "です means “is”; じゃないです means “is not”. Check the object and owner.",
        "teachZh": "です是「是」；じゃないです是「不是」。看清物品和主人。",
        "meaningEn": "This is not Mum's umbrella.",
        "meaningZh": "这不是妈妈的雨伞。"
      }
    ]
  },
  {
    "id": "neg-my-book",
    "group": "negative",
    "scene": "🙋📖   👧❌",
    "en": "The book is yours, not your little sister's.",
    "zh": "这本书是你的，不是妹妹的。",
    "options": [
      {
        "jp": "これは いもうとの ほんじゃないです。",
        "ok": true
      },
      {
        "jp": "これは いもうとの ほんです。",
        "kind": "real",
        "emoji": "👧📖✨  🙋😐",
        "en": "You called it little sister's book. She's already said thank you.",
        "zh": "你说是妹妹的书。妹妹的「谢谢」都说完了。",
        "teachEn": "です means “is”; じゃないです means “is not”. Check the object and owner.",
        "teachZh": "です是「是」；じゃないです是「不是」。看清物品和主人。",
        "meaningEn": "This is my little sister's book.",
        "meaningZh": "这是妹妹的书。"
      },
      {
        "jp": "これは わたしの ほんじゃないです。",
        "kind": "real",
        "emoji": "🙋📖❓",
        "en": "“Not my book.” Your name on the cover disagrees.",
        "zh": "「不是我的书。」封面上你的名字不同意。",
        "teachEn": "です means “is”; じゃないです means “is not”. Check the object and owner.",
        "teachZh": "です是「是」；じゃないです是「不是」。看清物品和主人。",
        "meaningEn": "This is not my book.",
        "meaningZh": "这不是我的书。"
      }
    ]
  },
  {
    "id": "neg-simple-true",
    "group": "negative",
    "scene": "👉📖",
    "en": "Which sentence correctly says what this IS?",
    "zh": "哪一句正确说明它是什么？",
    "options": [
      {
        "jp": "これは ほんです。",
        "ok": true
      },
      {
        "jp": "これは ほんじゃないです。",
        "kind": "real",
        "emoji": "📖💔",
        "en": "“Not a book.” The book turns a page, just to make a point.",
        "zh": "「不是书。」书当场翻了一页给你看。",
        "teachEn": "です means “is”; じゃないです means “is not”. Check the object and owner.",
        "teachZh": "です是「是」；じゃないです是「不是」。看清物品和主人。",
        "meaningEn": "This is not a book.",
        "meaningZh": "这不是书。"
      },
      {
        "jp": "これは えんぴつです。",
        "emoji": "📖✏️",
        "en": "A pencil with 200 pages. That's a very long homework answer.",
        "zh": "两百页的铅笔。这份功课的答案也太长了。",
        "teachEn": "です means “is”; じゃないです means “is not”. Check the object and owner.",
        "teachZh": "です是「是」；じゃないです是「不是」。看清物品和主人。",
        "kind": "real",
        "meaningEn": "This is a pencil.",
        "meaningZh": "这是铅笔。"
      }
    ]
  },
  {
    "id": "neg-simple-umbrella",
    "group": "negative",
    "scene": "👉☂️",
    "en": "Which sentence correctly identifies the umbrella?",
    "zh": "哪一句正确说明这把雨伞？",
    "options": [
      {
        "jp": "これは かさです。",
        "ok": true
      },
      {
        "jp": "これは かさじゃないです。",
        "kind": "real",
        "emoji": "☂️😶",
        "en": "“Not an umbrella.” It politely stopped keeping the rain off.",
        "zh": "「不是雨伞。」它很礼貌地暂停了挡雨服务。",
        "teachEn": "です means “is”; じゃないです means “is not”. Check the object and owner.",
        "teachZh": "です是「是」；じゃないです是「不是」。看清物品和主人。",
        "meaningEn": "This is not an umbrella.",
        "meaningZh": "这不是雨伞。"
      },
      {
        "jp": "これは ほんです。",
        "emoji": "☂️📚",
        "en": "A book? The librarian is looking for a shelf with a drain.",
        "zh": "书？图书馆正在找有排水口的书架。",
        "teachEn": "です means “is”; じゃないです means “is not”. Check the object and owner.",
        "teachZh": "です是「是」；じゃないです是「不是」。看清物品和主人。",
        "kind": "real",
        "meaningEn": "This is a book.",
        "meaningZh": "这是书。"
      }
    ]
  },
  {
    "id": "place-koko-library",
    "group": "place",
    "scene": "🙋📍📚",
    "en": "You are standing inside the library. What can you say?",
    "zh": "你正站在图书室里面。你可以怎么说？",
    "options": [
      {
        "jp": "ここは としょしつです。",
        "ok": true
      },
      {
        "jp": "そこは としょしつです。",
        "kind": "real",
        "emoji": "🙋📍   👉📚",
        "en": "You said “by you”, while standing here. Your words went over; you stayed put.",
        "zh": "你说「你那边」。话已经过去了，你还站在这里。",
        "teachEn": "ここ is by the speaker; そこ is by the listener. あれ points to a distant thing or building.",
        "teachZh": "ここ是说话人这里；そこ是听话人那里。あれ指远处的东西或建筑。",
        "meaningEn": "That place near you is the school library.",
        "meaningZh": "你那边是图书室。"
      },
      {
        "jp": "あれは としょしつです。",
        "emoji": "📚➡️📦❓",
        "en": "You said “that library over there”. You're already inside. That's a very long pointing finger.",
        "zh": "你说「远处那间图书室」。你明明就在里面，手指也伸得太远了吧。",
        "teachEn": "ここ is by the speaker; そこ is by the listener. あれ points to a distant thing or building.",
        "teachZh": "ここ是说话人这里；そこ是听话人那里。あれ指远处的东西或建筑。",
        "kind": "real",
        "meaningEn": "That thing/building over there is the school library.",
        "meaningZh": "远处那个是图书室。"
      }
    ]
  },
  {
    "id": "place-soko-bank",
    "group": "place",
    "scene": "🙋        👧📍🏦",
    "en": "Your friend is standing beside the bank. Tell your friend: “The bank is there (by you).”",
    "zh": "朋友正站在银行旁边。对朋友说：「银行就在你那里。」",
    "options": [
      {
        "jp": "ぎんこうは そこです。",
        "ok": true
      },
      {
        "jp": "ぎんこうは ここです。",
        "kind": "real",
        "emoji": "🏦➡️🙋",
        "en": "You said the bank was here. Please make room for the cash machines.",
        "zh": "你说银行在这里。请给提款机让一点位置。",
        "teachEn": "ここ is by the speaker; そこ is by the listener. あれ points to a distant thing or building.",
        "teachZh": "ここ是说话人这里；そこ是听话人那里。あれ指远处的东西或建筑。",
        "meaningEn": "The bank is here.",
        "meaningZh": "银行在这里。"
      },
      {
        "jp": "ぎんこうは あれです。",
        "kind": "real",
        "emoji": "👉🏦",
        "en": "You picked out a distant bank building. Your friend says, “Mine is right beside me.”",
        "zh": "你指认了远处那栋银行。朋友：我说的是我旁边这间啦。",
        "teachEn": "ここ is by the speaker; そこ is by the listener. あれ points to a distant thing or building.",
        "teachZh": "ここ是说话人这里；そこ是听话人那里。あれ指远处的东西或建筑。",
        "meaningEn": "The bank is that one over there.",
        "meaningZh": "银行是远处那个。"
      }
    ]
  },
  {
    "id": "place-are-umbrella",
    "group": "place",
    "scene": "🙋        👧        ☂️",
    "en": "The umbrella is far from both of you. Point to the umbrella itself.",
    "zh": "雨伞离你们两个人都很远。指着那把雨伞本身。",
    "options": [
      {
        "jp": "おかあさんの かさは あれです。",
        "ok": true
      },
      {
        "jp": "おかあさんの かさは そこです。",
        "kind": "real",
        "emoji": "👧📍❓☂️",
        "en": "You gave a location by your friend. Your friend checked: “I only brought myself.”",
        "zh": "你说伞在朋友那边。朋友检查了一下：我只带了我自己。",
        "teachEn": "あれ points to a thing far from both people. ここ／そこ name places.",
        "teachZh": "あれ指远离双方的东西；ここ／そこ指地点。",
        "meaningEn": "Mum's umbrella is there, near you.",
        "meaningZh": "妈妈的雨伞在你那边。"
      },
      {
        "jp": "ここは おかあさんの かさです。",
        "emoji": "📍➡️☂️",
        "en": "“This place is Mum's umbrella.” That's one enormous umbrella.",
        "zh": "「这里是妈妈的伞。」妈妈这把伞的面积有点夸张。",
        "teachEn": "あれ points to a thing far from both people. ここ／そこ name places.",
        "teachZh": "あれ指远离双方的东西；ここ／そこ指地点。",
        "kind": "odd",
        "meaningEn": "This place is Mum's umbrella.",
        "meaningZh": "这里是妈妈的雨伞。"
      }
    ]
  },
  {
    "id": "place-koko-school",
    "group": "place",
    "scene": "🙋📍🏫",
    "en": "You are at school. Say: “Here is the school.”",
    "zh": "你就在学校。说：「这里是学校。」",
    "options": [
      {
        "jp": "ここは がっこうです。",
        "ok": true
      },
      {
        "jp": "そこは がっこうです。",
        "kind": "real",
        "emoji": "🙋➡️👧🏫",
        "en": "The sentence says the school is by your listener. Your feet are still in this school.",
        "zh": "句子说学校在对方那边。你的两只脚却还在这间学校里。",
        "teachEn": "ここ is by the speaker; そこ is by the listener. あれ points to a distant thing or building.",
        "teachZh": "ここ是说话人这里；そこ是听话人那里。あれ指远处的东西或建筑。",
        "meaningEn": "That place near you is the school.",
        "meaningZh": "你那边是学校。"
      },
      {
        "jp": "あれは がっこうです。",
        "kind": "real",
        "emoji": "👉🏫",
        "en": "“That school over there.” The classroom you're in would like some recognition.",
        "zh": "「远处那间学校。」你所在的教室：也看一下我好吗？",
        "teachEn": "ここ is by the speaker; そこ is by the listener. あれ points to a distant thing or building.",
        "teachZh": "ここ是说话人这里；そこ是听话人那里。あれ指远处的东西或建筑。",
        "meaningEn": "That thing/building over there is the school.",
        "meaningZh": "远处那个是学校。"
      }
    ]
  },
  {
    "id": "place-soko-library",
    "group": "place",
    "scene": "🙋        👧📍📚",
    "en": "Your friend is beside the library. Say the library is there by your friend.",
    "zh": "朋友就在图书室旁边。说图书室在朋友那里。",
    "options": [
      {
        "jp": "としょしつは そこです。",
        "ok": true
      },
      {
        "jp": "としょしつは ここです。",
        "kind": "real",
        "emoji": "📚➡️🙋",
        "en": "You said the library was here. Your friend is still standing beside the bookshelves over there.",
        "zh": "你说图书室在这里。朋友还站在那边的书架旁等你改口。",
        "teachEn": "ここ is by the speaker; そこ is by the listener. あれ points to a distant thing or building.",
        "teachZh": "ここ是说话人这里；そこ是听话人那里。あれ指远处的东西或建筑。",
        "meaningEn": "The school library is here.",
        "meaningZh": "图书室在这里。"
      },
      {
        "jp": "としょしつは あれです。",
        "kind": "real",
        "emoji": "👉📚",
        "en": "You identified a distant building. Your friend is pointing to the one beside them: “This one!”",
        "zh": "你认了远处的建筑。朋友指着身边这间：这间啦！",
        "teachEn": "ここ is by the speaker; そこ is by the listener. あれ points to a distant thing or building.",
        "teachZh": "ここ是说话人这里；そこ是听话人那里。あれ指远处的东西或建筑。",
        "meaningEn": "The school library is that one over there.",
        "meaningZh": "图书室是远处那个。"
      }
    ]
  },
  {
    "id": "place-are-book",
    "group": "place",
    "scene": "🙋        👧        📖",
    "en": "A book is far from both of you. Point to the book itself.",
    "zh": "一本书离你们两个人都很远。指着那本书本身。",
    "options": [
      {
        "jp": "わたしの ほんは あれです。",
        "ok": true
      },
      {
        "jp": "わたしの ほんは そこです。",
        "kind": "real",
        "emoji": "👧📍📖?",
        "en": "You said the book was by your friend. Your friend is patting empty pockets.",
        "zh": "你说书在朋友那边。朋友已经把空口袋拍了一遍。",
        "teachEn": "あれ points to a thing far from both people. ここ／そこ name places.",
        "teachZh": "あれ指远离双方的东西；ここ／そこ指地点。",
        "meaningEn": "My book is there, near you.",
        "meaningZh": "我的书在你那边。"
      },
      {
        "jp": "ここは わたしの ほんです。",
        "emoji": "📍📖",
        "en": "“This place is my book.” Nice floor. Difficult to turn the page.",
        "zh": "「这里是我的书。」地板不错，就是翻页有点累。",
        "teachEn": "ここ names a place. To point out the distant item, use あれ.",
        "teachZh": "ここ指地点。指远处那个物品，用あれ。",
        "kind": "odd",
        "meaningEn": "This place is my book.",
        "meaningZh": "这里是我的书。"
      }
    ]
  },
  {
    "id": "place-koko-bank",
    "group": "place",
    "scene": "🙋📍🏦",
    "en": "You are standing at the bank. Which sentence fits?",
    "zh": "你正站在银行这里。哪一句符合图片？",
    "options": [
      {
        "jp": "ここは ぎんこうです。",
        "ok": true
      },
      {
        "jp": "ぎんこうは そこです。",
        "kind": "real",
        "emoji": "🏦➡️👧",
        "en": "You sent the bank to your listener's side. The teller beside you is confused.",
        "zh": "你把银行说到对方那边了。你旁边的柜台职员有点困惑。",
        "teachEn": "ここ is by the speaker; そこ is by the listener. あれ points to a distant thing or building.",
        "teachZh": "ここ是说话人这里；そこ是听话人那里。あれ指远处的东西或建筑。",
        "meaningEn": "The bank is there, near you.",
        "meaningZh": "银行在你那边。"
      },
      {
        "jp": "ぎんこうは あれです。",
        "kind": "real",
        "emoji": "👉🏦",
        "en": "You picked “that one over there”. The bank you're standing in says, “Ahem.”",
        "zh": "你选了「远处那个」。你所在的银行轻轻咳了一声。",
        "teachEn": "ここ is by the speaker; そこ is by the listener. あれ points to a distant thing or building.",
        "teachZh": "ここ是说话人这里；そこ是听话人那里。あれ指远处的东西或建筑。",
        "meaningEn": "The bank is that one over there.",
        "meaningZh": "银行是远处那个。"
      }
    ]
  },
  {
    "id": "place-are-pencil",
    "group": "place",
    "scene": "🙋        👧        ✏️",
    "en": "The pencil is far away. Point to that pencil.",
    "zh": "铅笔在远处。指着那支铅笔。",
    "options": [
      {
        "jp": "いもうとの えんぴつは あれです。",
        "ok": true
      },
      {
        "jp": "いもうとの えんぴつは そこです。",
        "kind": "real",
        "emoji": "👧📍✏️?",
        "en": "You gave a spot by your friend. Your friend checked behind one ear. Nothing.",
        "zh": "你说在朋友那边。朋友连耳朵后面都找了，没有。",
        "teachEn": "あれ points to a thing far from both people. ここ／そこ name places.",
        "teachZh": "あれ指远离双方的东西；ここ／そこ指地点。",
        "meaningEn": "My little sister's pencil is there, near you.",
        "meaningZh": "妹妹的铅笔在你那边。"
      },
      {
        "jp": "ここは いもうとの えんぴつです。",
        "emoji": "📍✏️",
        "en": "“This place is little sister's pencil.” Her pencil case must be the size of a house.",
        "zh": "「这里是妹妹的铅笔。」妹妹的文具盒得有一间屋子那么大。",
        "teachEn": "ここ names a place. To point out the distant item, use あれ.",
        "teachZh": "ここ指地点。指远处那个物品，用あれ。",
        "kind": "real",
        "meaningEn": "This place is my little sister's pencil.",
        "meaningZh": "这里是妹妹的铅笔。"
      }
    ]
  }
];
