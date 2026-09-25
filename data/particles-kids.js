/* =====================================================================
   Midnight & Light — Particle sentences (kids track)
   Each sentence:
     scene : emoji picture of what the sentence REALLY means
     en/zh : meaning
     parts : text pieces and particle slots, in order
   A slot: {ok:[correct particles], opts:[choices shown], wrong:{particle:[emoji scene, English, 中文]}}
   Any wrong particle without its own card shows the general card.
   "also" lists particles that are also correct (shown as "also correct!").
   ===================================================================== */
const PARTICLE_INFO={
 "は":["topic: “as for …”","主题：「……呢」"],
 "が":["with すき / what is: “… (is liked)”","用在すき等：「喜欢的是……」"],
 "を":["the thing you eat / drink / do / watch","动作的对象：吃、喝、做、看的东西"],
 "で":["by (how you go) / at (where you do it)","用什么方式／在哪里做"],
 "へ":["to (the direction you go)","往（去的方向）"],
 "に":["to (a place) / at (a time)","到（地方）／在（时间）"],
 "から":["from","从"],
 "まで":["until / as far as","到"],
 "と":["with (together)","和（一起）"],
 "も":["too / also","也"]
};
const PARTICLE_SENTENCES=[
 {scene:"🧒🚌 ➡️ 🏫",en:"I go to school by bus.",zh:"我坐巴士去学校。",parts:["バス",
   {ok:["で"],opts:["で","へ","を","と","は"],wrong:{
     "へ":["🧒➡️🚌 ➡️🏫❓","You go TO the bus… and then to school?","你去巴士那里……然后又去学校？"],
     "を":["🚶🔝🚌","You walk along the bus — like walking on its roof!","你沿着巴士走，好像走在车顶上！"],
     "と":["🧒🤝🚌 ➡️ 🏫","You go to school together WITH the bus, like a friend!","你和巴士手牵手一起去学校，像朋友一样！"],
     "は":["🚌💨🏫  🧒❓","Now the BUS goes to school by itself — without you!","现在是巴士自己去学校了——没有载你！"]}},
   "がっこう",{ok:["へ","に"],opts:["へ","に","で","を","と"],wrong:{
     "で":["🏫❓🚶","で is for WHERE you do something. You can't “go” inside the school like that.","で表示「在哪里做事」，不是去的地方。"],
     "を":["🚶🏫🚶","You walk through the school and out the other side!","你从学校穿过去，走到另一边去了！"],
     "と":["🧒🤝🏫 ➡️","The school goes WITH you — you carry the whole school!","学校跟你一起去——你把整间学校带走了！"]}},
   "いきます。"]},
 {scene:"🧒🚃 ➡️ 🛫",en:"I go to the airport by train.",zh:"我坐电车去机场。",parts:["でんしゃ",
   {ok:["で"],opts:["で","へ","を","と"],wrong:{
     "へ":["🧒➡️🚃 ➡️🛫❓","You go TO the train… and then to the airport?","你去电车那里……然后又去机场？"],
     "を":["🚶🔝🚃","You walk along the train roof!","你沿着电车车顶走！"],
     "と":["🧒🤝🚃","You and the train hold hands and walk to the airport!","你和电车手牵手走去机场！"]}},
   "くうこう",{ok:["へ","に"],opts:["へ","に","で","を"],wrong:{"で":["🛫❓","で is for WHERE you do something, not where you go.","で表示「在哪里做事」，不是去的地方。"]}},"いきます。"]},
 {scene:"🧒✈️ ➡️ 🗾",en:"I go to Japan by plane.",zh:"我坐飞机去日本。",parts:["ひこうき",
   {ok:["で"],opts:["で","へ","を","に"],wrong:{
     "へ":["🧒➡️✈️ ➡️🗾❓","You go TO the plane… and then to Japan?","你去飞机那里……然后又去日本？"],
     "を":["🚶🔝✈️","You walk on top of the plane wing — scary!","你走在飞机翅膀上——好可怕！"],
     "に":["🧒➡️✈️❓","に here sounds like the plane is where you're going. The plane is HOW you go: use で.","用に好像飞机是你要去的地方。飞机是交通工具，要用で。"]}},
   "にほん",{ok:["へ","に"],opts:["へ","に","で","を"],wrong:{"で":["🗾❓","で is for WHERE you do something, not where you go.","で表示「在哪里做事」，不是去的地方。"]}},"いきます。"]},
 {scene:"🧒🚲 ➡️ 🏞️",en:"I go to the park by bicycle.",zh:"我骑脚踏车去公园。",parts:["じてんしゃ",
   {ok:["で"],opts:["で","へ","を","と"],wrong:{
     "を":["🚶🔝🚲","You walk along the bicycle — wobbly!","你沿着脚踏车走——摇摇晃晃！"],
     "と":["🧒🤝🚲","You WALK next to your bicycle like a pet — you don't ride it!","你把脚踏车当宠物，牵着一起走，没有骑！"],
     "へ":["🧒➡️🚲❓","You go TO the bicycle, not BY bicycle.","你是「去脚踏车那里」，不是「骑脚踏车去」。"]}},
   "こうえん",{ok:["へ","に"],opts:["へ","に","で","を"],wrong:{}},"いきます。"]},
 {scene:"🧒🚕 ➡️ 🏥",en:"I go to the hospital by taxi.",zh:"我坐德士去医院。",parts:["タクシー",
   {ok:["で"],opts:["で","へ","を","は"],wrong:{
     "は":["🚕💨🏥  🧒❓","The TAXI goes to the hospital by itself — you're left behind!","德士自己去医院了——把你留在原地！"],
     "を":["🚶🔝🚕","You walk on the taxi roof!","你走在德士车顶上！"]}},
   "びょういん",{ok:["へ","に"],opts:["へ","に","で","を"],wrong:{}},"いきます。"]},
 {scene:"🧒🧑 ➡️ 🦁",en:"I go to the zoo with a friend.",zh:"我和朋友去动物园。",parts:["ともだち",
   {ok:["と"],opts:["と","で","を","は"],wrong:{
     "で":["🧒🏇🧑 ➡️🦁","で = HOW you go. You ride on your friend like a horse!","で是交通方式——你把朋友当马骑去动物园！"],
     "は":["🧑💨🦁  🧒❓","Your FRIEND goes to the zoo… without you!","是朋友去动物园……没有你！"],
     "を":["🚶🔝🧑","You walk along your friend's back!","你沿着朋友的背走过去！"]}},
   "どうぶつえん",{ok:["へ","に"],opts:["へ","に","で","と"],wrong:{
     "と":["🧒🤝🦁🐘","You go WITH the zoo — the whole zoo comes along!","整间动物园跟你一起去了！"]}},"いきます。"]},
 {scene:"🧒👩 ➡️ 🛒",en:"I go to the supermarket with Mum.",zh:"我和妈妈去超市。",parts:["おかあさん",
   {ok:["と"],opts:["と","で","を","も"],wrong:{
     "で":["🧒🏇👩","で = HOW you go. You ride on Mum's back to the supermarket!","で是交通方式——你骑在妈妈背上去超市！"],
     "を":["🚶🔝👩","You walk along Mum!","你沿着妈妈走过去！"]}},
   "スーパー",{ok:["へ","に"],opts:["へ","に","で","を"],wrong:{}},"いきます。"]},
 {scene:"🍽️ 🧒😋🍚",en:"I eat rice at a restaurant.",zh:"我在餐厅吃饭。",parts:["レストラン",
   {ok:["で"],opts:["で","を","へ","に"],wrong:{
     "を":["😋🍽️🏢","を = the thing you eat. You EAT the restaurant!","を是吃的东西——你把整间餐厅吃掉了！"],
     "へ":["➡️🍽️❓","へ is for where you GO. Here you EAT at the restaurant: use で.","へ是去的方向。在餐厅「吃」要用で。"]}},
   "ごはん",{ok:["を"],opts:["を","で","と","へ"],wrong:{
     "で":["🍚🥢","で = using. You eat with rice as your chopsticks!","で是「用」——你拿米饭当筷子来吃！"],
     "と":["🧒🤝🍚","You eat together WITH the rice — like a friend at dinner!","米饭变成你的朋友，陪你一起吃！"]}},
   "たべます。"]},
 {scene:"🏞️ ⚽🧒",en:"I play football at the park.",zh:"我在公园踢足球。",parts:["こうえん",
   {ok:["で"],opts:["で","を","へ","と"],wrong:{
     "を":["⚽🏞️❓","を here makes the park the thing you do. Use で for where you play.","用を变成「做公园」。在哪里玩要用で。"],
     "と":["🧒🤝🏞️","You play football WITH the park — the park is on your team!","公园跟你一队踢足球！"]}},
   "サッカー",{ok:["を"],opts:["を","で","と","が"],wrong:{
     "と":["🧒🤝⚽","You do something together WITH football — football is your friend!","足球变成你的朋友，陪你一起做事！"]}},
   "します。"]},
 {scene:"🏠 📺👀",en:"I watch TV at home.",zh:"我在家看电视。",parts:["いえ",
   {ok:["で"],opts:["で","を","へ","と"],wrong:{
     "を":["👀🏠","を = the thing you watch. You stare at your house!","を是看的东西——你一直盯着你的房子看！"]}},
   "テレビ",{ok:["を"],opts:["を","へ","と","が"],wrong:{
     "へ":["🧒➡️📺","へ = the direction you go. You head INTO the TV!","へ是去的方向——你往电视里面走进去了！"],
     "と":["🧒🤝📺","You watch (something) together WITH the TV, like a friend!","电视变成朋友，陪你一起看东西！"]}},
   "みます。"]},
 {scene:"🧒 ❤️ 🐱",en:"I like cats.",zh:"我喜欢猫。",parts:["わたしは ねこ",
   {ok:["が"],opts:["が","を","と","で"],wrong:{
     "と":["🧒🤝🐱 ❤️❓","“With the cat, I like…” — like WHAT?","「和猫一起，我喜欢……」——喜欢什么？"]}},"すきです。"]},
 {scene:"🧒 ❤️ 🍎",en:"I like apples.",zh:"我喜欢苹果。",parts:["わたし",
   {ok:["は"],opts:["は","を","で","に"],wrong:{}},"りんご",
   {ok:["が"],opts:["が","を","で","と"],wrong:{}},"すきです。"]},
 {scene:"🧒 🙅 🥛",en:"I don't like milk.",zh:"我不喜欢牛奶。",parts:["わたしは ぎゅうにゅう",
   {ok:["が"],opts:["が","を","で","と"],wrong:{
     "で":["🥛🧒❓","“Using milk, I don't like…” — using milk for what?","「用牛奶，我不喜欢……」——用牛奶做什么？"]}},"すきじゃないです。"]},
 {scene:"🧒 🥛😋",en:"I drink milk.",zh:"我喝牛奶。",parts:["ぎゅうにゅう",
   {ok:["を"],opts:["を","で","へ","と"],wrong:{
     "で":["🥛➡️🥤","で = using. You use milk as your cup to drink something!","で是「用」——你拿牛奶当杯子来喝东西！"],
     "へ":["🧒➡️🥛","You walk INTO the milk!","你走进牛奶里面了！"],
     "と":["🧒🤝🥛","You drink together WITH the milk — cheers!","牛奶陪你一起喝东西——干杯！"]}},"のみます。"]},
 {scene:"👉 ✏️",en:"This is a pencil.",zh:"这是铅笔。",parts:["これ",
   {ok:["は"],opts:["は","を","で","に"],wrong:{}},"えんぴつです。"]},
 {scene:"✏️ ＋ 👉✏️",en:"This is a pencil too.",zh:"这也是铅笔。",parts:["これ",
   {ok:["も"],opts:["も","は","を","で"],wrong:{
     "は":["✏️ ＋ ✏️","は is fine Japanese, but look: there is ANOTHER pencil. Use も (too).","は也是日文，但是图里有「另一支」铅笔，要用も（也）。"]}},"えんぴつです。"]},
 {scene:"👩➡️  👨➡️",en:"Dad goes too.",zh:"爸爸也去。",parts:["おとうさん",
   {ok:["も"],opts:["も","は","を","で"],wrong:{
     "は":["👩➡️  👨➡️","は is fine Japanese, but Mum is going already — Dad goes TOO. Use も.","は也是日文，但是妈妈已经去了，爸爸「也」去，要用も。"],
     "で":["🧒🏇👨","で = HOW you go. You ride on Dad!","で是交通方式——你骑在爸爸身上去！"]}},"いきます。"]},
 {scene:"🧒 🔟",en:"I am 10 years old.",zh:"我10岁。",parts:["わたし",
   {ok:["は"],opts:["は","を","で","に"],wrong:{}},"10さいです。"]},
 {scene:"🏫 🕗 → 🕒",en:"School is from 8 to 3.",zh:"学校从8点到3点。",parts:["がっこうは 8じ",
   {ok:["から"],opts:["から","まで","に","で"],wrong:{
     "まで":["🏫 ❓→🕗 ❓→🕒","“Until 8 … until 3”? When does it START?","「到8点……到3点」？那什么时候开始？"]}},"3じ",
   {ok:["まで"],opts:["まで","から","に","で"],wrong:{
     "から":["🏫 🕗→  🕒→ ♾️","“From 8, from 3…” — school never ends!","「从8点、从3点……」——学校永远不放学！"]}},"です。"]},
 {scene:"⏰ 🕕 🧒🌅",en:"I get up at 6.",zh:"我6点起床。",parts:["6じ",
   {ok:["に"],opts:["に","から","まで","で"],wrong:{
     "から":["🕕 🧒⬆️⬆️⬆️♾️","“From 6 I get up…” and you keep getting up forever!","「从6点开始起床」……一直起床起不完！"],
     "まで":["🌙🧒👀 … 🕕","おきます also means “stay awake”. You stayed awake UNTIL 6 — all night!","おきます也有「醒着」的意思——你醒着到6点，整晚没睡！"]}},"おきます。"]},
 {scene:"🕙 🧒😴",en:"I go to bed at 10.",zh:"我10点睡觉。",parts:["10じ",
   {ok:["に"],opts:["に","まで","から","で"],wrong:{
     "まで":["😴💤 … 🕙☀️","You sleep UNTIL 10 — so late! School already started!","你睡到10点——太晚了！学校早就开始了！"],
     "から":["🕙 😴 → ♾️","“From 10 I sleep…” and you never wake up!","「从10点开始睡」……然后一直不醒来！"]}},"ねます。"]},
 {scene:"🏫 📖🧒",en:"I read a book at school.",zh:"我在学校读书。",parts:["がっこう",
   {ok:["で"],opts:["で","を","へ","に"],wrong:{
     "を":["🧒📖🏫","を = the thing you read. You read the SCHOOL like a book!","を是读的东西——你把学校当书来读！"],
     "へ":["➡️🏫❓","へ is for where you GO. You READ at school: use で.","へ是去的方向。在学校「读书」要用で。"]}},
   "ほん",{ok:["を"],opts:["を","で","へ","と"],wrong:{
     "へ":["🧒➡️📖","You walk INTO the book!","你走进书里面了！"],
     "で":["📖➡️👀","で = using. You use a book to read… something else?","で是「用」——你用书来读……别的东西？"]}},"よみます。"]},
 {scene:"🧒🧑 🎬",en:"I watch a movie with a friend.",zh:"我和朋友看电影。",parts:["ともだち",
   {ok:["と"],opts:["と","を","で","へ"],wrong:{
     "を":["🧒👀🧑","を = the thing you watch. You just stare at your friend!","を是看的东西——你一直盯着朋友看！"],
     "で":["🧑🎥","で = using. You use your friend as a movie screen!","で是「用」——你拿朋友当电影屏幕！"]}},
   "えいが",{ok:["を"],opts:["を","と","で","へ"],wrong:{
     "へ":["🧒➡️🎬","You walk INTO the movie!","你走进电影里面了！"]}},"みます。"]},
 {scene:"📅⬅️ 🧒🧑⚽",en:"Yesterday I played football with a friend.",zh:"昨天我和朋友踢了足球。",parts:["きのう ともだち",
   {ok:["と"],opts:["と","を","で","に"],wrong:{
     "を":["🧑⚽❓","を is for the thing you play (サッカー). Your friend is not a game! Use と (with).","を是做的事情（足球）。朋友不是游戏！要用と（和）。"]}},
   "サッカー",{ok:["を"],opts:["を","と","で","が"],wrong:{}},"しました。"]},
 {scene:"🧒 🚶 ➡️ 🏫",en:"I walk to school.",zh:"我走路去学校。",parts:["あるいて がっこう",
   {ok:["へ","に"],opts:["へ","に","で","を"],wrong:{
     "で":["🏫❓","で is for WHERE you do something, not where you go.","で表示「在哪里做事」，不是去的地方。"],
     "を":["🚶🏫🚶","You walk through the school and out the other side!","你从学校穿过去，走到另一边去了！"]}},"いきます。"]}
];
