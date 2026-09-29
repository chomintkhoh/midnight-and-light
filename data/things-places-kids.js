/* =====================================================================
   Midnight & Light — Things & Places (kids track)
   Grammar already taught:
   これは〜です / これも〜です / AのB / 〜じゃないです /
   ここ・そこ・あれ

   Keep this file intentionally conservative: do not add それ・あそこ・
   います・あります until they have been taught.
   ===================================================================== */
const TP_GROUPS=[
 {id:"this",icon:"👉",jp:"これ・これも",en:"This / This too",zh:"这是／这也是"},
 {id:"no",icon:"🎒",jp:"AのB",en:"Whose thing?",zh:"谁的东西？"},
 {id:"negative",icon:"🙅",jp:"じゃないです",en:"It is not…",zh:"不是……"},
 {id:"place",icon:"📍",jp:"ここ・そこ・あれ",en:"Here / there / that",zh:"这里／那里／那个"},
 {id:"mix",icon:"😈",jp:"Mix It Up",en:"Mix everything",zh:"全部混合"}
];

const TP_QUESTIONS=[
/* ---------- これは / これも ---------- */
{id:"this-pencil",group:"this",scene:"👉✏️",en:"There is one pencil. What fits the picture?",zh:"这里只有一支铅笔。哪一句最符合图片？",options:[
 {jp:"これは えんぴつです。",ok:true},
 {jp:"これも えんぴつです。",kind:"real",emoji:"✏️➕❓",en:"You said “THIS is a pencil TOO.” Too? Where is the other pencil hiding?",zh:"你说「这也是铅笔」。也？另一支铅笔躲到哪里去了？",teachEn:"も means “too / also”. Use it when another matching thing is already in the scene or conversation.",teachZh:"も表示「也」。前面已经有另一个相同的东西／信息时才用它。"},
 {jp:"これは ほんです。",emoji:"✏️📖❓",en:"That pencil has been promoted to a book. Where are the pages?",zh:"这支铅笔突然升职变成书了。书页在哪里？",teachEn:"The sentence pattern is fine, but the noun must match the picture: えんぴつ.",teachZh:"句型没问题，但名词要和图片一致：えんぴつ。"}
]},
{id:"also-pencil",group:"this",scene:"✏️  ＋  👉✏️",en:"One pencil is already there. The pointed one is a pencil too.",zh:"已经有一支铅笔了。现在指着的这一支也是铅笔。",options:[
 {jp:"これも えんぴつです。",ok:true},
 {jp:"これは えんぴつです。",kind:"real",emoji:"✏️   ✏️😶",en:"True… but you completely ignored the first pencil. Cold.",zh:"是没错啦……但你把第一支铅笔完全无视了。好冷淡。",teachEn:"は says “as for this…”. も adds “this too”, which is the meaning shown here.",teachZh:"は只是说「这个是……」；も才有「这个也……」的意思。"},
 {jp:"これも ほんです。",emoji:"✏️📖",en:"“This is a book too.” The pencil would like to object.",zh:"「这也是书。」铅笔本人表示抗议。",teachEn:"も is correct for “too”, but the noun still has to match: えんぴつ.",teachZh:"「也」用も没错，但名词还是要看图片：えんぴつ。"}
]},
{id:"this-book",group:"this",scene:"👉📖",en:"There is one book. Choose the matching sentence.",zh:"这里只有一本书。选择符合图片的句子。",options:[
 {jp:"これは ほんです。",ok:true},
 {jp:"これも ほんです。",kind:"real",emoji:"📖➕👻",en:"A mysterious invisible book must be somewhere, because you said “this one too”.",zh:"看来附近有一本隐形书，因为你说了「这本也」。",teachEn:"も needs an earlier matching item or idea. Here we only see one book.",teachZh:"も需要前面已经有相同的东西／信息。这里目前只有一本书。"},
 {jp:"これは かさです。",emoji:"📖☂️",en:"Opening this “umbrella” in the rain may end badly.",zh:"下雨时打开这把「伞」……大概会很惨。",teachEn:"Use ほん for the book in the picture.",teachZh:"图片里是书，所以这里用 ほん。"}
]},
{id:"also-book",group:"this",scene:"📖  ＋  👉📖",en:"There is already a book. The pointed one is also a book.",zh:"已经有一本书了。指着的这一本也是书。",options:[
 {jp:"これも ほんです。",ok:true},
 {jp:"これは ほんです。",kind:"real",emoji:"📖   📖🙄",en:"Yes, yes, it is a book. The first book is still waiting for its “too”.",zh:"对，对，它是书。第一本书还在等那个「也」呢。",teachEn:"Use も when you want to add “this one too”.",teachZh:"要表达「这一个也是」，使用 も。"},
 {jp:"これも えんぴつです。",emoji:"📖✏️",en:"That is one very flat pencil.",zh:"这支「铅笔」也太扁了吧。",teachEn:"The grammar これも is good, but the picture shows ほん.",teachZh:"これも 的句型对了，不过图片里是 ほん。"}
]},
{id:"this-umbrella",group:"this",scene:"👉☂️",en:"Point to the umbrella and say what it is.",zh:"指着雨伞，说它是什么。",options:[
 {jp:"これは かさです。",ok:true},
 {jp:"これも かさです。",kind:"real",emoji:"☂️➕❓",en:"“This umbrella too”… and the other umbrella is where exactly?",zh:"「这把伞也是」……所以另一把伞到底在哪里？",teachEn:"Without an earlier matching item, use は here, not も.",teachZh:"没有前面另一个相同的东西时，这里用 は，不用 も。"},
 {jp:"これは えんぴつです。",emoji:"☂️✏️",en:"That pencil is suspiciously good at keeping off rain.",zh:"这支铅笔挡雨的能力也太强了。",teachEn:"The picture shows かさ.",teachZh:"图片里是 かさ。"}
]},
{id:"also-umbrella",group:"this",scene:"☂️  ＋  👉☂️",en:"Another umbrella appears. Say “this is an umbrella too.”",zh:"又出现一把雨伞。说「这也是雨伞」。",options:[
 {jp:"これも かさです。",ok:true},
 {jp:"これは かさです。",kind:"real",emoji:"☂️   ☂️😑",en:"Correct Japanese, but the “also” fell out of the sentence and rolled away.",zh:"日文本身没错，不过「也」从句子里掉出去滚走了。",teachEn:"も carries the added meaning “too / also”.",teachZh:"も负责表达「也／也是」。"},
 {jp:"これも ほんです。",emoji:"☂️📖",en:"Please do not shelve the umbrella in the library.",zh:"请不要把雨伞放进书架里。",teachEn:"Use かさ for umbrella.",teachZh:"雨伞是 かさ。"}
]},
{id:"this-apple",group:"this",scene:"👉🍎",en:"What is this?",zh:"这是什么？",options:[
 {jp:"これは りんごです。",ok:true},
 {jp:"これも りんごです。",kind:"real",emoji:"🍎➕❓",en:"You smuggled an extra apple into the story with も.",zh:"你用一个 も，偷偷在故事里多塞了一颗苹果。",teachEn:"も means another matching thing is already relevant. For a plain identification, use は.",teachZh:"も表示前面已经有另一个同类事物。单纯说明「这是苹果」用 は。"},
 {jp:"これは ぎゅうにゅうです。",emoji:"🍎🥛",en:"Crunchy milk. Bold invention.",zh:"会咬下去咔嚓一声的牛奶。很有创意。",teachEn:"The picture is りんご, not ぎゅうにゅう.",teachZh:"图片是 りんご，不是 ぎゅうにゅう。"}
]},
{id:"also-apple",group:"this",scene:"🍎  ＋  👉🍎",en:"Say “this is an apple too.”",zh:"说「这也是苹果」。",options:[
 {jp:"これも りんごです。",ok:true},
 {jp:"これは りんごです。",kind:"real",emoji:"🍎   🍎👀",en:"True, but the first apple is giving you the “what about me?” look.",zh:"是没错，不过第一颗苹果正在用「那我呢？」的眼神看你。",teachEn:"Use も to add “this one too”.",teachZh:"要加上「这个也」的意思，用 も。"},
 {jp:"これも かさです。",emoji:"🍎☂️",en:"An apple umbrella. Tiny coverage, excellent snack value.",zh:"苹果雨伞。挡雨面积很小，但饿了可以吃。",teachEn:"The noun should be りんご.",teachZh:"名词应该是 りんご。"}
]},

/* ---------- A の B ---------- */
{id:"no-mum-umbrella",group:"no",scene:"👩 ➜ ☂️",en:"The umbrella belongs to Mum.",zh:"这把雨伞是妈妈的。",options:[
 {jp:"これは おかあさんの かさです。",ok:true},
 {jp:"これは おとうさんの かさです。",emoji:"👨☂️  👩😑",en:"Dad just walked off with Mum's umbrella. Mum has noticed.",zh:"爸爸直接拿走了妈妈的伞。妈妈已经看到了。",teachEn:"AのB means “A's B”. The owner in the picture is おかあさん.",teachZh:"AのB 表示「A的B」。图片里的主人是 おかあさん。"},
 {jp:"これは いもうとの かさです。",emoji:"👧☂️  👩❓",en:"Your little sister has somehow claimed Mum's umbrella.",zh:"妹妹不知什么时候把妈妈的伞认领走了。",teachEn:"Look at who the item belongs to before の.",teachZh:"看清楚 の 前面是谁，也就是东西的主人。"}
]},
{id:"no-dad-book",group:"no",scene:"👨 ➜ 📖",en:"The book belongs to Dad.",zh:"这本书是爸爸的。",options:[
 {jp:"これは おとうさんの ほんです。",ok:true},
 {jp:"これは おかあさんの ほんです。",emoji:"👩📖  👨🤨",en:"Mum has been assigned Dad's book. Paperwork scandal.",zh:"妈妈被分配到了爸爸的书。家庭资产登记出错。",teachEn:"Put the owner before の: おとうさんの ほん.",teachZh:"主人放在 の 前面：おとうさんの ほん。"},
 {jp:"これは いもうとの ほんです。",emoji:"👧📖  👨🙃",en:"Your little sister has acquired another suspiciously familiar book.",zh:"妹妹又得到了一本怎么看都很眼熟的书。",teachEn:"The picture shows Dad as the owner.",teachZh:"图片显示主人是爸爸。"}
]},
{id:"no-sister-pencil",group:"no",scene:"👧 ➜ ✏️",en:"The pencil belongs to your little sister.",zh:"这支铅笔是妹妹的。",options:[
 {jp:"これは いもうとの えんぴつです。",ok:true},
 {jp:"これは おかあさんの えんぴつです。",emoji:"👩✏️  👧😤",en:"Mum has accidentally stolen the smallest piece of stationery possible.",zh:"妈妈不小心偷走了家里最小件的文具。",teachEn:"Use いもうとの when the owner is your little sister.",teachZh:"主人是妹妹时，用 いもうとの。"},
 {jp:"これは おとうさんの えんぴつです。",emoji:"👨✏️  👧🙅",en:"Dad, please return the pencil to its tiny owner.",zh:"爸爸，请把铅笔还给它的小主人。",teachEn:"The word before の tells us whose thing it is.",teachZh:"の 前面的词告诉我们东西是谁的。"}
]},
{id:"no-my-umbrella",group:"no",scene:"🙋 ➜ ☂️",en:"The umbrella belongs to you.",zh:"这把雨伞是你的。",options:[
 {jp:"これは わたしの かさです。",ok:true},
 {jp:"これは おかあさんの かさです。",emoji:"🙋☂️  👩❓",en:"You just donated your umbrella to Mum without asking yourself.",zh:"你刚刚没问过自己，就把自己的伞捐给妈妈了。",teachEn:"わたしの かさ = my umbrella.",teachZh:"わたしの かさ = 我的雨伞。"},
 {jp:"これは いもうとの かさです。",emoji:"🙋☂️  👧✨",en:"Your little sister accepts this surprise gift with enthusiasm.",zh:"妹妹非常开心地接受了这份突如其来的礼物。",teachEn:"The picture marks you as the owner, so use わたしの.",teachZh:"图片标示主人是你，所以用 わたしの。"}
]},
{id:"no-mum-book",group:"no",scene:"👩 ➜ 📖",en:"Choose the sentence that says “Mum's book.”",zh:"选择表示「妈妈的书」的句子。",options:[
 {jp:"これは おかあさんの ほんです。",ok:true},
 {jp:"これは おかあさんと ほんです。",emoji:"👩🤝📖",en:"Mum AND a book? The book has become a family member.",zh:"妈妈「和」一本书？这本书正式加入家庭成员名单了。",teachEn:"と joins things or people. Ownership uses の: おかあさんの ほん.",teachZh:"と表示「和／跟」。所属关系要用 の：おかあさんの ほん。"},
 {jp:"これは おかあさんも ほんです。",emoji:"👩➡️📖😱",en:"You just said Mum is also a book. Please apologise to Mum.",zh:"你刚刚说妈妈也是一本书。请向妈妈道歉。",teachEn:"For “Mum's book”, put の between the owner and the thing.",teachZh:"要说「妈妈的书」，主人和东西中间放 の。"}
]},
{id:"no-dad-umbrella",group:"no",scene:"👨 ➜ ☂️",en:"Which one means “Dad's umbrella”?",zh:"哪一句表示「爸爸的雨伞」？",options:[
 {jp:"これは おとうさんの かさです。",ok:true},
 {jp:"これは おとうさんと かさです。",emoji:"👨🤝☂️",en:"Dad and Umbrella are apparently attending together.",zh:"爸爸和雨伞看起来要一起出席活动。",teachEn:"Use の for belonging: おとうさんの かさ.",teachZh:"表示所属用 の：おとうさんの かさ。"},
 {jp:"これは おとうさんも かさです。",emoji:"👨☂️😵",en:"Dad is also an umbrella now. Weather powers unlocked.",zh:"爸爸现在也是一把雨伞了。天气系能力解锁。",teachEn:"も means “also”; it cannot replace の here.",teachZh:"も表示「也」，这里不能代替表示所属的 の。"}
]},
{id:"no-sister-book",group:"no",scene:"👧 ➜ 📖",en:"Choose “my little sister's book.”",zh:"选择「妹妹的书」。",options:[
 {jp:"これは いもうとの ほんです。",ok:true},
 {jp:"これは いもうとも ほんです。",emoji:"👧📖😨",en:"Your little sister is also a book. That family photo is getting strange.",zh:"妹妹也是一本书。全家福开始变得很奇怪。",teachEn:"Ownership needs の: いもうとの ほん.",teachZh:"表示所属要用 の：いもうとの ほん。"},
 {jp:"これは いもうとと ほんです。",emoji:"👧🤝📖",en:"Little sister AND book. Both present, ownership missing.",zh:"妹妹「和」书。两个都到了，但所属关系不见了。",teachEn:"と means “and/with”; の means “A's B”.",teachZh:"と表示「和」；の表示「A的B」。"}
]},
{id:"no-my-pencil",group:"no",scene:"🙋 ➜ ✏️",en:"Which sentence means “my pencil”?",zh:"哪一句表示「我的铅笔」？",options:[
 {jp:"これは わたしの えんぴつです。",ok:true},
 {jp:"これは わたしと えんぴつです。",emoji:"🙋🤝✏️",en:"You and the pencil are now a duo. Cute, but not “my pencil”.",zh:"你和铅笔组成了二人组合。很可爱，但不是「我的铅笔」。",teachEn:"Use の to connect the owner and the thing.",teachZh:"主人和东西之间用 の 连接。"},
 {jp:"これは わたしも えんぴつです。",emoji:"🙋➡️✏️",en:"You have declared yourself to be a pencil too. Very committed to stationery.",zh:"你宣布自己也是一支铅笔。对文具事业非常投入。",teachEn:"も means “also”. For “my pencil”, use わたしの えんぴつ.",teachZh:"も表示「也」。要说「我的铅笔」，用 わたしの えんぴつ。"}
]},

/* ---------- じゃないです ---------- */
{id:"neg-not-book",group:"negative",scene:"👉✏️   📖❌",en:"Say: “This is not a book.”",zh:"说：「这不是书。」",options:[
 {jp:"これは ほんじゃないです。",ok:true},
 {jp:"これは ほんです。",kind:"real",emoji:"✏️➡️📖",en:"You looked straight at a pencil and confidently called it a book. Powerful confidence.",zh:"你看着一支铅笔，非常有自信地说它是书。这个自信很强。",teachEn:"じゃないです makes a noun sentence negative: “is not”.",teachZh:"じゃないです 把名词句变成否定，表示「不是」。"},
 {jp:"これは えんぴつじゃないです。",kind:"real",emoji:"✏️😧",en:"The pencil has just been told it is NOT a pencil. Identity crisis incoming.",zh:"铅笔刚刚被告知「你不是铅笔」。身份危机即将发生。",teachEn:"The target meaning is “not a book”, so negate ほん, not えんぴつ.",teachZh:"目标是「不是书」，所以要否定 ほん，不是否定 えんぴつ。"}
]},
{id:"neg-not-pencil",group:"negative",scene:"👉📖   ✏️❌",en:"Say: “This is not a pencil.”",zh:"说：「这不是铅笔。」",options:[
 {jp:"これは えんぴつじゃないです。",ok:true},
 {jp:"これは えんぴつです。",kind:"real",emoji:"📖➡️✏️",en:"A book has been sentenced to pencil duty.",zh:"一本书被判去执行铅笔职务。",teachEn:"To say “is not”, add じゃないです after the noun.",teachZh:"要表达「不是」，在名词后面接 じゃないです。"},
 {jp:"これは ほんじゃないです。",kind:"real",emoji:"📖😱",en:"The book would like to file a complaint: it is definitely a book.",zh:"这本书想提出申诉：它明明就是书。",teachEn:"You need to negate えんぴつ because the meaning is “not a pencil”.",teachZh:"题目要表达「不是铅笔」，所以否定的是 えんぴつ。"}
]},
{id:"neg-not-umbrella",group:"negative",scene:"👉📖   ☂️❌",en:"Say: “This is not an umbrella.”",zh:"说：「这不是雨伞。」",options:[
 {jp:"これは かさじゃないです。",ok:true},
 {jp:"これは かさです。",kind:"real",emoji:"📖☔💦",en:"Please try holding that “umbrella” over your head in the rain. Report back.",zh:"下雨时请把这把「伞」举在头上试试看。记得回报结果。",teachEn:"じゃないです changes “is” to “is not”.",teachZh:"じゃないです 把「是」变成「不是」。"},
 {jp:"これは ほんじゃないです。",kind:"real",emoji:"📖😵",en:"You denied the one thing the picture is actually showing.",zh:"图片明明是书，你却偏偏否认了它唯一正确的身份。",t