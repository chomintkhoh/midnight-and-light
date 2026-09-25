/* =====================================================================
   Midnight & Light — Particle sentences (kids track)
   scene     : emoji picture of what the sentence REALLY means
   en / zh   : meaning (the learner chooses English OR Chinese)
   parts     : text pieces and particle slots in order
   slot      : {ok:[correct particle], opts:[choices], wrong:{particle: card}}
   card      : [emoji picture, English, 中文, "real"?]
               "real" = this IS real Japanese, but it means something else.
               Cards never say which particle is correct.
   Destination uses へ only (に + いきます is not taught yet).
   ===================================================================== */
const PARTICLE_INFO={
 "は":["the topic: who / what you are talking about","主题：说的是谁／什么（わたしは＝说到我）"],
 "が":["with すき: the thing you like","配合すき：喜欢的对象"],
 "を":["the thing you eat / drink / do / watch","吃、喝、做、看的东西"],
 "で":["by (how you go) / at (where you do it)","用什么方式／在哪里做"],
 "へ":["to (where you go)","往（去的地方）"],
 "に":["at (a time)","在（几点）"],
 "から":["from","从"],
 "まで":["until","到"],
 "と":["with (together)","和（一起）"],
 "も":["too / also","也"]
};
const PARTICLE_SENTENCES=[
 {scene:"🧒🚌 ➡️ 🏫",en:"I go to school by bus.",zh:"我坐巴士去学校。",parts:["バス",
   {ok:["で"],opts:["で","へ","を","と","は"],wrong:{
     "へ":["🧒➡️🚌  ➡️🏫❓","You go TO the bus… and then TO school? Two places!","你去巴士那里……又去学校？去两个地方！"],
     "を":["🚶🔝🚌","You walk along the bus — right on its roof!","你沿着巴士走——走在车顶上！"],
     "と":["🧒🤝🚌","You and the bus hold hands and walk to school together!","你和巴士手牵手，一起走路去学校！"],
     "は":["🚌💨🏫   🧒😢","The BUS goes to school — and leaves you behind!","是巴士自己去学校——把你留在原地！","real"]}},
   "がっこう",{ok:["へ"],opts:["へ","で","を","と"],wrong:{
     "で":["🏫❓","You say something happens AT school… but what? Where are you going?","你说「在学校」……在学校做什么？你到底去哪里？"],
     "を":["🚶🏫🚶","You walk right through the school and out the other side!","你从学校中间穿过去，走到另一边！"],
     "と":["🧒🤝🏫","The school comes WITH you — you carry the whole school!","学校跟你一起去——你把整间学校带走了！"]}},
   "いきます。"]},
 {scene:"🧒🚃 ➡️ 🛫",en:"I go to the airport by train.",zh:"我坐电车去机场。",parts:["でんしゃ",
   {ok:["で"],opts:["で","へ","を","と"],wrong:{
     "へ":["🧒➡️🚃  ➡️🛫❓","You go TO the train… and then TO the airport? Two places!","你去电车那里……又去机场？去两个地方！"],
     "を":["🚶🔝🚃","You walk along the train roof!","你沿着电车车顶走！"],
     "と":["🧒🤝🚃","You and the train hold hands and walk to the airport!","你和电车手牵手，一起走去机场！"]}},
   "くうこう",{ok:["へ"],opts:["へ","で","を"],wrong:{
     "で":["🛫❓","You say something happens AT the airport… but where are you going?","你说「在机场」……那你到底去哪里？"],
     "を":["🚶🛫🚶","You walk right through the airport and out again!","你从机场中间穿过去，又走出来了！"]}},"いきます。"]},
 {scene:"🧒✈️ ➡️ 🗾",en:"I go to Japan by plane.",zh:"我坐飞机去日本。",parts:["ひこうき",
   {ok:["で"],opts:["で","へ","を","と"],wrong:{
     "へ":["🧒➡️✈️  ➡️🗾❓","You go TO the plane… and then TO Japan? Two places!","你去飞机那里……又去日本？去两个地方！"],
     "を":["🚶🔝✈️","You walk along the plane's wing — scary!","你沿着飞机翅膀走——好可怕！"],
     "と":["🧒🤝✈️","You and the plane hold hands and WALK to Japan!","你和飞机手牵手，走路去日本！"]}},
   "にほん",{ok:["へ"],opts:["へ","で","を"],wrong:{
     "で":["🗾❓","You say something happens IN Japan… but where are you going?","你说「在日本」……那你到底去哪里？"],
     "を":["🚶🗾🚶","You walk across the whole of Japan!","你走路横跨整个日本！"]}},"いきます。"]},
 {scene:"🧒🚲 ➡️ 🏞️",en:"I go to the park by bicycle.",zh:"我骑脚踏车去公园。",parts:["じてんしゃ",
   {ok:["で"],opts:["で","へ","を","と"],wrong:{
     "を":["🚶🔝🚲","You walk along the bicycle — wobbly!","你沿着脚踏车走——摇摇晃晃！"],
     "と":["🧒🤝🚲","You walk NEXT TO your bicycle like a pet. You never ride it!","你牵着脚踏车走，像带宠物散步，完全没有骑！"],
     "へ":["🧒➡️🚲  ➡️🏞️❓","You go TO the bicycle… and then TO the park? Two places!","你去脚踏车那里……又去公园？去两个地方！"]}},
   "こうえん",{ok:["へ"],opts:["へ","で","を"],wrong:{
     "で":["🏞️❓","You say something happens AT the park… but where are you going?","你说「在公园」……那你到底去哪里？"]}},"いきます。"]},
 {scene:"🧒🚕 ➡️ 🏥",en:"I go to the hospital by taxi.",zh:"我坐德士去医院。",parts:["タクシー",
   {ok:["で"],opts:["で","へ","を","は"],wrong:{
     "は":["🚕💨🏥   🧒😢","The TAXI goes to the hospital — without you!","是德士自己去医院——没有载你！","real"],
     "を":["🚶🔝🚕","You walk on the taxi's roof!","你走在德士车顶上！"]}},
   "びょういん",{ok:["へ"],opts:["へ","で","を"],wrong:{}},"いきます。"]},
 {scene:"🧒🧑 ➡️ 🦁",en:"I go to the zoo with a friend.",zh:"我和朋友去动物园。",parts:["ともだち",
   {ok:["と"],opts:["と","で","を","は"],wrong:{
     "で":["🧒🏇🧑","Your friend is how you travel — you ride on your friend like a horse!","朋友变成交通工具——你把朋友当马骑！"],
     "は":["🧑💨🦁   🧒😢","Your FRIEND goes to the zoo — you stay at home!","是朋友去动物园——你留在家里！","real"],
     "を":["🚶🔝🧑","You walk along your friend's back!","你沿着朋友的背走过去！"]}},
   "どうぶつえん",{ok:["へ"],opts:["へ","で","と"],wrong:{
     "と":["🧒🤝🦁🐘🦒","The whole zoo comes WITH you!","整间动物园都跟你一起去了！"]}},"いきます。"]},
 {scene:"🧒🤝👩 ➡️ 🛒",en:"I go to the supermarket with Mum.",zh:"我和妈妈一起去超市。",parts:["おかあさん",
   {ok:["と"],opts:["と","で","を","も"],wrong:{
     "で":["🧒🏇👩","Mum is how you travel — you ride on Mum's back!","妈妈变成交通工具——你骑在妈妈背上！"],
     "を":["🚶🔝👩","You walk along Mum!","你沿着妈妈走过去！"],
     "も":["👩➡️🛒  (🧑➡️🛒)","Mum ALSO goes — as well as someone else. But the picture shows you going WITH Mum.","意思是「妈妈也去」（还有别人去）。但图里是你「和」妈妈一起去。","real"]}},
   "スーパー",{ok:["へ"],opts:["へ","で","を"],wrong:{}},"いきます。"]},
 {scene:"🍽️ 🧒😋🍚",en:"I eat rice at a restaurant.",zh:"我在餐厅吃饭。",parts:["レストラン",
   {ok:["で"],opts:["で","を","へ","と"],wrong:{
     "を":["😋🍽️🏢","The restaurant is what you eat — you EAT the whole restaurant!","餐厅变成你吃的东西——你把整间餐厅吃掉了！"],
     "へ":["➡️🍽️ … 🍚❓","You're heading TO the restaurant while eating rice on the way?","你一边往餐厅走，一边吃饭？"],
     "と":["🧒🤝🍽️","You eat together WITH the restaurant — like it's your friend!","餐厅变成你的朋友，陪你一起吃！"]}},
   "ごはん",{ok:["を"],opts:["を","で","と","へ"],wrong:{
     "で":["🍚🥢","You eat something USING rice — rice chopsticks!","你「用」米饭来吃东西——米饭筷子！"],
     "と":["🧒🤝🍚","You eat together WITH the rice — rice is your dinner friend!","米饭变成朋友，陪你一起吃饭！"],
     "へ":["🧒➡️🍚","You walk towards the rice!","你往米饭那边走过去！"]}},
   "たべます。"]},
 {scene:"🏞️ ⚽🧒",en:"I play football at the park.",zh:"我在公园踢足球。",parts:["こうえん",
   {ok:["で"],opts:["で","を","へ","と"],wrong:{
     "を":["🧒❓🏞️","You “do” the park? How do you play a park?","你「做」公园？公园要怎么玩？"],
     "と":["🧒🤝🏞️","You play together WITH the park — the park is on your team!","公园跟你一队踢球！"],
     "へ":["➡️🏞️ … ⚽❓","You're heading TO the park and playing football on the way?","你一边往公园走，一边踢足球？"]}},
   "サッカー",{ok:["を"],opts:["を","で","と","が"],wrong:{
     "と":["🧒🤝⚽","Football is your friend — you do something WITH football!","足球变成你的朋友，陪你一起做事！"],
     "で":["⚽🧒❓","You do something USING football… do what?","你「用」足球来做……做什么？"]}},
   "します。"]},
 {scene:"🏠 📺👀",en:"I watch TV at home.",zh:"我在家看电视。",parts:["いえ",
   {ok:["で"],opts:["で","を","へ","と"],wrong:{
     "を":["👀🏠","Your house is what you watch — you stare at your house!","房子变成你看的东西——你一直盯着房子看！"],
     "と":["🧒🤝🏠","You watch TV together WITH your house!","你和你的房子一起看电视！"]}},
   "テレビ",{ok:["を"],opts:["を","へ","と","が"],wrong:{
     "へ":["🧒➡️📺","You walk INTO the TV!","你往电视里面走进去了！"],
     "と":["🧒🤝📺","You and the TV watch something together, like friends!","你和电视像朋友一样，一起看东西！"]}},
   "みます。"]},
 {scene:"🧒 ❤️ 🐱",en:"I like cats.",zh:"我喜欢猫。",parts:["わたしは ねこ",
   {ok:["が"],opts:["が","を","と","で"],wrong:{
     "と":["🧒🤝🐱  ❤️❓","You and the cat… like WHAT? Something is missing!","你和猫一起……喜欢什么？少了东西！"]}},"すきです。"]},
 {scene:"🧒 ❤️ 🍎",en:"I like apples.",zh:"我喜欢苹果。",parts:["わたし",
   {ok:["は"],opts:["は","を","で","と"],wrong:{
     "と":["🧒🤝🍎 ❤️❓","You and someone else like apples… who?","你和某个人一起喜欢苹果……是谁？"]}},"りんご",
   {ok:["が"],opts:["が","を","で","と"],wrong:{}},"すきです。"]},
 {scene:"🧒 🙅 🥛",en:"I don't like milk.",zh:"我不喜欢牛奶。",parts:["わたしは ぎゅうにゅう",
   {ok:["が"],opts:["が","を","で","と"],wrong:{
     "で":["🥛🧒❓","USING milk, you don't like… what?","「用牛奶」，你不喜欢……什么？"]}},"すきじゃないです。"]},
 {scene:"🧒 🥛😋",en:"I drink milk.",zh:"我喝牛奶。",parts:["ぎゅうにゅう",
   {ok:["を"],opts:["を","で","へ","と"],wrong:{
     "で":["🥛➡️🥤","You drink something USING milk as your cup!","你「用」牛奶当杯子来喝东西！"],
     "へ":["🧒➡️🥛","You walk INTO the milk!","你往牛奶里面走进去了！"],
     "と":["🧒🤝🥛","You drink together WITH the milk — cheers!","牛奶陪你一起喝东西——干杯！"]}},"のみます。"]},
 {scene:"👉 ✏️",en:"This is a pencil.",zh:"这是铅笔。",parts:["これ",
   {ok:["は"],opts:["は","を","で","と"],wrong:{
     "と":["👉🤝✏️","“This AND the pencil are…” — are what?","「这个和铅笔是……」——是什么？"]}},"えんぴつです。"]},
 {scene:"✏️  ＋ 👉✏️",en:"This is a pencil too.",zh:"这也是铅笔。",parts:["これ",
   {ok:["も"],opts:["も","は","を","で"],wrong:{
     "は":["👉✏️","Real Japanese: “This is a pencil.” But look — there is ANOTHER pencil already!","这是真的日文：「这是铅笔」。但是图里已经有「另一支」铅笔了！","real"]}},"えんぴつです。"]},
 {scene:"👩➡️   👨➡️",en:"Dad goes too.",zh:"爸爸也去。",parts:["おとうさん",
   {ok:["も"],opts:["も","は","を","で"],wrong:{
     "は":["👨➡️","Real Japanese: “Dad goes.” But Mum is going already — look again!","这是真的日文：「爸爸去」。但是妈妈已经去了——再看看图！","real"],
     "で":["🧒🏇👨","Dad is how you travel — you ride on Dad!","爸爸变成交通工具——你骑在爸爸身上！"]}},"いきます。"]},
 {scene:"🧒 🔟",en:"I am 10 years old.",zh:"我10岁。",parts:["わたし",
   {ok:["は"],opts:["は","を","で","と"],wrong:{
     "と":["🧒🤝❓ 🔟","You and someone else are 10… who?","你和某个人10岁……是谁？"]}},"10さいです。"]},
 {scene:"🏫 🕗 → 🕒",en:"School is from 8 to 3.",zh:"学校从8点到3点。",parts:["がっこうは 8じ",
   {ok:["から"],opts:["から","まで","で","と"],wrong:{
     "まで":["🏫 ❓→🕗 ❓→🕒","Until 8… until 3… so when does school START?","到8点……到3点……那学校什么时候开始？"],
     "と":["🕗🤝🕒","8 o'clock AND 3 o'clock… just two times?","8点「和」3点……只有两个时间？"]}},"3じ",
   {ok:["まで"],opts:["まで","から","で","と"],wrong:{
     "から":["🏫 🕗→ 🕒→ ♾️","From 8… from 3… school NEVER ends!","从8点、从3点……学校永远不放学！"]}},"です。"]},
 {scene:"⏰ 🕕 🧒🌅",en:"I get up at 6.",zh:"我6点起床。",parts:["6じ",
   {ok:["に"],opts:["に","まで","で","と"],wrong:{
     "まで":["🌙🧒👀 … 🕕","Real Japanese! おきます also means “stay awake”: you stay awake UNTIL 6 — all night!","这是真的日文！おきます也有「醒着」的意思：你醒着到6点——整晚没睡！","real"],
     "と":["🕕🤝🧒","You and 6 o'clock get up together!","你和6点钟一起起床！"]}},"おきます。"]},
 {scene:"🕙 🧒😴",en:"I go to bed at 10.",zh:"我10点睡觉。",parts:["10じ",
   {ok:["に"],opts:["に","まで","で","と"],wrong:{
     "まで":["😴💤 … 🕙☀️","Real Japanese: you sleep UNTIL 10 in the morning — so late!","这是真的日文：你睡「到」早上10点——太晚了！","real"],
     "と":["🕙🤝😴","You and 10 o'clock go to bed together!","你和10点钟一起睡觉！"]}},"ねます。"]},
 {scene:"🏫 📖🧒",en:"I read a book at school.",zh:"我在学校读书。",parts:["がっこう",
   {ok:["で"],opts:["で","を","へ","と"],wrong:{
     "を":["🧒📖🏫","The school is what you read — you read the SCHOOL like a book!","学校变成你读的东西——你把学校当书来读！"],
     "へ":["➡️🏫 … 📖❓","You're heading TO school and reading on the way?","你一边往学校走，一边读书？"]}},
   "ほん",{ok:["を"],opts:["を","で","へ","と"],wrong:{
     "へ":["🧒➡️📖","You walk INTO the book!","你走进书里面了！"],
     "で":["📖➡️👀❓","You read something USING a book… read what?","你「用」书来读……读什么？"]}},"よみます。"]},
 {scene:"🧒🧑 🎬",en:"I watch a movie with a friend.",zh:"我和朋友看电影。",parts:["ともだち",
   {ok:["と"],opts:["と","を","で","へ"],wrong:{
     "を":["🧒👀🧑","Your friend is what you watch — you just stare at your friend!","朋友变成你看的东西——你一直盯着朋友看！"],
     "で":["🧑🎥","You use your friend as the movie screen!","你「用」朋友当电影屏幕！"]}},
   "えいが",{ok:["を"],opts:["を","と","で","へ"],wrong:{
     "へ":["🧒➡️🎬","You walk INTO the movie!","你走进电影里面了！"]}},"みます。"]},
 {scene:"📅⬅️ 🧒🧑⚽",en:"Yesterday I played football with a friend.",zh:"昨天我和朋友踢了足球。",parts:["きのう ともだち",
   {ok:["と"],opts:["と","を","で","へ"],wrong:{
     "を":["🧑⚽❓","Your friend is the thing you play? Your friend is not a game!","朋友是你玩的东西？朋友不是游戏！"],
     "で":["⚽=🧑","You played football USING your friend — as the ball!","你「用」朋友踢足球——朋友变成足球！"]}},
   "サッカー",{ok:["を"],opts:["を","と","で","が"],wrong:{}},"しました。"]},
 {scene:"🧒 🚶 ➡️ 🏫",en:"I walk to school.",zh:"我走路去学校。",parts:["あるいて がっこう",
   {ok:["へ"],opts:["へ","で","を"],wrong:{
     "で":["🏫❓","You say something happens AT school… but where are you going?","你说「在学校」……那你到底去哪里？"],
     "を":["🚶🏫🚶","You walk right through the school and out the other side!","你从学校中间穿过去，走到另一边！"]}},"いきます。"]},
 /* ---- more が ---- */
 {scene:"🧒 ❤️ 🐶",en:"I like dogs.",zh:"我喜欢狗。",parts:["わたしは いぬ",
   {ok:["が"],opts:["が","を","で","と"],wrong:{
     "で":["🐶🧒❓","USING a dog, you like… what?","「用狗」，你喜欢……什么？"],
     "と":["🧒🤝🐶 ❤️❓","You and the dog like… WHAT? Something is missing!","你和狗一起喜欢……什么？少了东西！"]}},"すきです。"]},
 {scene:"🧒 ❤️ ⚽",en:"I like football.",zh:"我喜欢足球。",parts:["わたしは サッカー",
   {ok:["が"],opts:["が","を","で","と"],wrong:{
     "と":["🧒🤝⚽ ❤️❓","You and football like… what?","你和足球一起喜欢……什么？"],
     "で":["⚽🧒❓","USING football, you like… what?","「用足球」，你喜欢……什么？"]}},"すきです。"]},
 {scene:"🧒 🙅 🫑",en:"I don't like green peppers.",zh:"我不喜欢青椒。",parts:["わたしは ピーマン",
   {ok:["が"],opts:["が","を","で","と"],wrong:{
     "と":["🧒🤝🫑 🙅❓","You and the green pepper don't like… what?","你和青椒一起不喜欢……什么？"]}},"すきじゃないです。"]},
 {scene:"👨 ❤️ 🍜",en:"Dad likes ramen.",zh:"爸爸喜欢拉面。",parts:["おとうさんは ラーメン",
   {ok:["が"],opts:["が","を","で","と"],wrong:{
     "で":["🍜👨❓","USING ramen, Dad likes… what?","「用拉面」，爸爸喜欢……什么？"],
     "と":["👨🤝🍜 ❤️❓","Dad and the ramen like… what?","爸爸和拉面一起喜欢……什么？"]}},"すきです。"]},
 /* ---- more は ---- */
 {scene:"👉 🍎",en:"This is an apple.",zh:"这是苹果。",parts:["これ",
   {ok:["は"],opts:["は","を","で","と"],wrong:{
     "と":["👉🤝🍎","“This AND the apple are…” — are what?","「这个和苹果是……」——是什么？"],
     "で":["👉🍎❓","USING this… it's an apple? Using it for what?","「用这个」……是苹果？用来做什么？"]}},"りんごです。"]},
 {scene:"👉(near you) 📖",en:"That (near you) is a book.",zh:"那（你旁边的）是书。",parts:["それ",
   {ok:["は"],opts:["は","を","で","と"],wrong:{
     "と":["👉🤝📖","“That AND the book are…” — are what?","「那个和书是……」——是什么？"]}},"ほんです。"]},
 {scene:"👉 … 🏫 (far away)",en:"That (over there) is a school.",zh:"那（远处的）是学校。",parts:["あれ",
   {ok:["は"],opts:["は","を","で","と"],wrong:{
     "を":["👀🏫❓","“That… school” — what about it? The sentence doesn't work.","「那个……学校」——然后呢？句子不通。"]}},"がっこうです。"]},
 {scene:"👧 5️⃣",en:"My little sister is 5.",zh:"我妹妹5岁。",parts:["いもうと",
   {ok:["は"],opts:["は","を","で","と"],wrong:{
     "と":["👧🤝❓ 5️⃣","You and your sister are 5… who else?","你和妹妹5岁……还有谁？"]}},"5さいです。"]},
 {scene:"📅 👉 🗓️",en:"Today is Wednesday.",zh:"今天是星期三。",parts:["きょう",
   {ok:["は"],opts:["は","を","で","と"],wrong:{
     "と":["📅🤝❓","“Today AND Wednesday…” — are what?","「今天和星期三……」——是什么？"]}},"すいようびです。"]},
 /* ---- more も ---- */
 {scene:"🧑❤️🐶  ＋ 🧒❤️🐶",en:"I like dogs too.",zh:"我也喜欢狗。",parts:["わたし",
   {ok:["も"],opts:["も","は","を","で"],wrong:{
     "は":["🧒❤️🐶","Real Japanese: “I like dogs.” But look — your friend likes dogs as well!","这是真的日文：「我喜欢狗」。但是图里朋友也喜欢狗！","real"],
     "で":["🧒🐶❓","USING me… like dogs? That doesn't work.","「用我」……喜欢狗？说不通。"]}},"いぬが すきです。"]},
 {scene:"👨😴  ＋ 👩😴",en:"Mum goes to bed too.",zh:"妈妈也睡觉。",parts:["おかあさん",
   {ok:["も"],opts:["も","は","を","で"],wrong:{
     "は":["👩😴","Real Japanese: “Mum goes to bed.” But look — Dad is sleeping already!","这是真的日文：「妈妈睡觉」。但是爸爸已经在睡了！","real"],
     "を":["😴👩","Mum is the thing you sleep? You sleep ON Mum!","妈妈是你睡的东西？你睡在妈妈身上！"]}},"ねます。"]},
 {scene:"🍎  ＋ 👉🍎",en:"This is an apple too.",zh:"这也是苹果。",parts:["これ",
   {ok:["も"],opts:["も","は","を","で"],wrong:{
     "は":["👉🍎","Real Japanese: “This is an apple.” But look — there is ANOTHER apple already!","这是真的日文：「这是苹果」。但是图里已经有「另一个」苹果了！","real"]}},"りんごです。"]},
 {scene:"🧃😋  ＋ 🥛😋",en:"I drink milk too.",zh:"我也喝牛奶。",parts:["ぎゅうにゅう",
   {ok:["も"],opts:["も","を","で","と"],wrong:{
     "を":["🥛😋","Real Japanese: “I drink milk.” But look — you are drinking juice as well!","这是真的日文：「我喝牛奶」。但是你也在喝果汁！","real"],
     "で":["🥛➡️🥤","You drink something USING milk as your cup!","你「用」牛奶当杯子来喝东西！"],
     "と":["🧒🤝🥛","You drink together WITH the milk — cheers!","牛奶陪你一起喝东西——干杯！"]}},"のみます。"]},
 /* ---- more から / まで ---- */
 {scene:"🏊 🕘 → 🕔",en:"The pool is open from 9 to 5.",zh:"游泳池从9点到5点。",parts:["プールは 9じ",
   {ok:["から"],opts:["から","まで","で","と"],wrong:{
     "まで":["🏊 ❓→🕘 ❓→🕔","Until 9… until 5… so when does it OPEN?","到9点……到5点……那什么时候开？"],
     "と":["🕘🤝🕔","9 o'clock AND 5 o'clock… only two times?","9点「和」5点……只有两个时间？"]}},"5じ",
   {ok:["まで"],opts:["まで","から","で","と"],wrong:{
     "から":["🏊 🕘→ 🕔→ ♾️","From 9… from 5… the pool NEVER closes!","从9点、从5点……游泳池永远不关门！"]}},"です。"]},
 {scene:"🏦 🕤 → 🕓",en:"The bank is open from 9:30 to 4.",zh:"银行从9点半到4点。",parts:["ぎんこうは 9じはん",
   {ok:["から"],opts:["から","まで","で","と"],wrong:{
     "まで":["🏦 ❓→🕤 ❓→🕓","Until 9:30… until 4… so when does it OPEN?","到9点半……到4点……那什么时候开？"]}},"4じ",
   {ok:["まで"],opts:["まで","から","で","と"],wrong:{
     "から":["🏦 🕤→ 🕓→ ♾️","From 9:30… from 4… the bank NEVER closes!","从9点半、从4点……银行永远不关门！"]}},"です。"]},
 {scene:"🛒 🌅8 → 🌙10",en:"The supermarket is open from 8 a.m. to 10 p.m.",zh:"超市从早上8点到晚上10点。",parts:["スーパーは あさ 8じ",
   {ok:["から"],opts:["から","まで","で","と"],wrong:{
     "まで":["🛒 ❓→🌅 ❓→🌙","Until 8 a.m.… until 10 p.m.… when does it OPEN?","到早上8点……到晚上10点……那什么时候开？"]}},"よる 10じ",
   {ok:["まで"],opts:["まで","から","で","と"],wrong:{
     "から":["🛒 🌅→ 🌙→ ♾️","From 8… from 10… it NEVER closes!","从8点、从10点……永远不关门！"]}},"です。"]},
 {scene:"🏫 月 → 金",en:"School is from Monday to Friday.",zh:"学校从星期一到星期五。",parts:["がっこうは げつようび",
   {ok:["から"],opts:["から","まで","で","と"],wrong:{
     "と":["月🤝金","Only Monday AND Friday? What about the other days?","只有星期一「和」星期五？其他天呢？"],
     "まで":["🏫 ❓→月 ❓→金","Until Monday… until Friday… when does it START?","到星期一……到星期五……那从哪天开始？"]}},"きんようび",
   {ok:["まで"],opts:["まで","から","で","と"],wrong:{
     "から":["🏫 月→ 金→ ♾️","From Monday… from Friday… school every day forever!","从星期一、从星期五……天天都要上学，永远没有假期！"],
     "と":["月🤝金","Only Monday AND Friday? What about the other days?","只有星期一「和」星期五？其他天呢？"]}},"です。"]},
 /* ---- more に (time) ---- */
 {scene:"🕢 🧒 ➡️ 🏫",en:"I go to school at 7:30.",zh:"我7点半去学校。",parts:["7じはん",
   {ok:["に"],opts:["に","まで","で","と"],wrong:{
     "まで":["🧒🚶🚶🚶 … 🕢","You keep walking to school UNTIL 7:30 — all night long!","你一直走去学校，走到7点半——走了一整晚！"],
     "と":["🕢🤝🧒 ➡️🏫","You and 7:30 walk to school together!","你和7点半一起走去学校！"]}},"がっこう",
   {ok:["へ"],opts:["へ","で","を"],wrong:{
     "で":["🏫❓","You say something happens AT school… but where are you going?","你说「在学校」……那你到底去哪里？"],
     "を":["🚶🏫🚶","You walk right through the school and out the other side!","你从学校中间穿过去，走到另一边！"]}},"いきます。"]},
 {scene:"🕛 🍱😋",en:"I eat school lunch at 12.",zh:"我12点吃学校午餐。",parts:["12じ",
   {ok:["に"],opts:["に","まで","で","と"],wrong:{
     "まで":["🍱😋😋😋 … 🕛","Real Japanese: you keep eating lunch UNTIL 12 — a very long lunch!","这是真的日文：你一直吃午餐吃「到」12点——吃好久！","real"],
     "と":["🕛🤝🍱","You eat lunch together WITH 12 o'clock!","你和12点钟一起吃午餐！"]}},"きゅうしょく",
   {ok:["を"],opts:["を","で","と","へ"],wrong:{
     "と":["🧒🤝🍱","You eat together WITH your lunch — lunch is your friend!","午餐变成你的朋友，陪你一起吃！"],
     "へ":["🧒➡️🍱","You walk INTO your lunch box!","你走进便当盒里面了！"]}},"たべます。"]},
 {scene:"🕗 📺👀",en:"I watch TV at 8.",zh:"我8点看电视。",parts:["8じ",
   {ok:["に"],opts:["に","まで","で","と"],wrong:{
     "まで":["📺👀 … 🕗","Real Japanese: you watch TV UNTIL 8 — that's a different meaning!","这是真的日文：你看电视看「到」8点——意思不一样！","real"],
     "と":["🕗🤝📺","You and 8 o'clock watch TV together!","你和8点钟一起看电视！"]}},"テレビ",
   {ok:["を"],opts:["を","へ","と","で"],wrong:{
     "へ":["🧒➡️📺","You walk INTO the TV!","你往电视里面走进去了！"]}},"みます。"]},
 {scene:"🕒 🧒🏠",en:"I go home at 3.",zh:"我3点回家。",parts:["3じ",
   {ok:["に"],opts:["に","で","と","を"],wrong:{
     "と":["🕒🤝🧒🏠","You and 3 o'clock go home together!","你和3点钟一起回家！"]}},"かえります。"]},
 /* ---- more と ---- */
 {scene:"🧒🤝👨 ➡️ 🏞️",en:"I go to the park with Dad.",zh:"我和爸爸去公园。",parts:["おとうさん",
   {ok:["と"],opts:["と","で","を","は"],wrong:{
     "で":["🧒🏇👨","Dad is how you travel — you ride on Dad!","爸爸变成交通工具——你骑在爸爸身上！"],
     "は":["👨💨🏞️   🧒😢","DAD goes to the park — without you!","是爸爸去公园——没有你！","real"]}},"こうえん",
   {ok:["へ"],opts:["へ","で","を"],wrong:{}},"いきます。"]},
 {scene:"🧒🤝👧 🍰😋",en:"I eat cake with my little sister.",zh:"我和妹妹吃蛋糕。",parts:["いもうと",
   {ok:["と"],opts:["と","を","で","は"],wrong:{
     "を":["😋👧","Your sister is what you eat — you EAT your sister!","妹妹变成你吃的东西——你把妹妹吃掉了！"],
     "で":["👧🍴","You eat cake USING your sister as a spoon!","你「用」妹妹当汤匙吃蛋糕！"],
     "は":["👧🍰😋   🧒😢","Your SISTER eats the cake — you get none!","是妹妹吃蛋糕——你一口都没有！","real"]}},"ケーキ",
   {ok:["を"],opts:["を","と","で","へ"],wrong:{
     "へ":["🧒➡️🍰","You walk INTO the cake!","你走进蛋糕里面了！"],
     "と":["🧒🤝🍰","You eat together WITH the cake — the cake is your friend!","蛋糕变成你的朋友，陪你一起吃！"]}},"たべます。"]},
 {scene:"🧒🤝👵 📺",en:"I watch TV with Grandma.",zh:"我和奶奶看电视。",parts:["おばあさん",
   {ok:["と"],opts:["と","を","で","へ"],wrong:{
     "を":["🧒👀👵","Grandma is what you watch — you stare at Grandma!","奶奶变成你看的东西——你一直盯着奶奶看！"],
     "で":["👵📺","You use Grandma as the TV screen!","你「用」奶奶当电视屏幕！"]}},"テレビ",
   {ok:["を"],opts:["を","と","へ","で"],wrong:{
     "へ":["🧒➡️📺","You walk INTO the TV!","你往电视里面走进去了！"]}},"みます。"]}
];
