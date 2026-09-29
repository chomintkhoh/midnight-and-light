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
 {jp:"これは いもうとの かさです。",emoji:"👧☂️  👩❓",en:"Your littl