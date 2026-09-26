/* =====================================================================
   Midnight & Light — Question-word sentences (kids track)
   scene   : emoji picture of the ANSWER
   ans     : the answer in Japanese; aEn / aZh = what the answer means
   qEn/qZh : what the finished question means (shown after it is correct)
   parts   : text pieces and slots in order
     {k:"qw", ok:[...], opts:[...], wrong:{word: card}}  question word
     {k:"end", ok:[...], wrong:{ending: card}}            question ending
       (ending choices come from the level; ENDING_CARDS below is the
        default card, a sentence's own "wrong" overrides it)
   card    : [emoji picture, English, 中文, "real"?]
             "real" = this IS real Japanese, but it asks something else.
             Cards never say which word is correct.
   This set: だれ・どこ・なに・なん・どれ・なんで(by what).
   どうして / なんで(why) are NOT in this set yet.
   Easy = ですか・ますか only. Normal adds ましたか・ませんか・ませんでしたか.
   ===================================================================== */
const QW_INFO={
 "だれ":["who","谁"],
 "どこ":["where","哪里"],
 "なに":["what (before を・が・と)","什么（在を・が・と前面）"],
 "なん":["what (before です・じ・さい)","什么（在です・じ・さい前面）"],
 "どれ":["which one (of these)","哪一个（从几个里面选）"],
 "なんで":["by what (how you go)","坐什么／用什么交通"]
};
const ENDING_INFO={
 "ですか":["Is it …? (a thing, a number — no action)","是…吗？（东西、数字——没有动作）"],
 "ますか":["Do you …? (every day, or later)","会…吗？（平常或以后）"],
 "ましたか":["Did you …? (it already happened)","…了吗？（已经发生了）"],
 "ませんか":["Don't you …? (every day, or later)","不…吗？（平常或以后）"],
 "ませんでしたか":["Didn't you …? (it already happened)","没有…吗？（已经发生了）"]
};
const EASY_ENDINGS=["ですか","ますか"];
const ALL_ENDINGS=["ですか","ますか","ましたか","ませんか","ませんでしたか"];
/* default card when an ending is picked by mistake (no card = "Japanese doesn't say it this way") */
const ENDING_CARDS={
 "ますか":["🔁❓","You asked about every day, or later: “Do you …?”","你问的是平常或以后：「会…吗？」","real"],
 "ましたか":["⏪❓","You asked about something that already happened: “Did you …?”","你问的是已经发生的事：「…了吗？」","real"],
 "ませんか":["🙅❓","You asked: “DON'T you …?”","你问的是：「不…吗？」","real"],
 "ませんでしたか":["⏪🙅❓","You asked about the past: “DIDN'T you …?”","你问的是过去：「没有…吗？」","real"]
};
/* shared cards */
const C_NOLIST=["📋❓","“Which one of these…?” — but nobody showed you any choices!","「这些里面的哪一个……？」——可是根本没有给你选项呀！","real"];
const C_EAT_WHO=["😱🧟","WHO do you eat?! Are you a monster?","你吃“谁”？！你是怪兽吗？","real"];

const Q_SENTENCES=[
/* ---------- easy: ですか・ますか ---------- */
{scene:"🧒➡️🏞️",ans:"こうえんへ いきます。",aEn:"I go to the park.",aZh:"我去公园。",qEn:"Where do you go?",qZh:"你去哪里？",parts:[
  {k:"qw",ok:["どこ"],opts:["どこ","だれ","なに","どれ"],wrong:{
    "だれ":["🧒➡️🧍❓","You go TO a person? You walk straight into somebody?","你去一个“人”那里？直接走进别人身上？"],
    "どれ":C_NOLIST}},
  "へ いき",{k:"end",ok:["ますか"]},"。"]},
{scene:"🧒⚽🏞️",ans:"こうえんで サッカーを します。",aEn:"I play football at the park.",aZh:"我在公园踢足球。",qEn:"Where do you play football?",qZh:"你在哪里踢足球？",parts:[
  {k:"qw",ok:["どこ"],opts:["どこ","なに","だれ","どれ"],wrong:{
    "なに":["🍉⚽❓","WHAT do you play football with? With a watermelon?","你用“什么”踢足球？用西瓜吗？","real"],
    "どれ":C_NOLIST}},
  "で サッカーを し",{k:"end",ok:["ますか"]},"。"]},
{scene:"🧒🍎",ans:"りんごを たべます。",aEn:"I eat an apple.",aZh:"我吃苹果。",qEn:"What do you eat?",qZh:"你吃什么？",parts:[
  {k:"qw",ok:["なに"],opts:["なに","だれ","どこ","なん"],wrong:{
    "だれ":C_EAT_WHO,
    "どこ":["🧒🍽️🏞️","You eat a PLACE? You eat the whole park?","你吃一个“地方”？把整个公园吃掉？"]}},
  "を たべ",{k:"end",ok:["ますか"]},"。"]},
{scene:"🧒🥛",ans:"ぎゅうにゅうを のみます。",aEn:"I drink milk.",aZh:"我喝牛奶。",qEn:"What do you drink?",qZh:"你喝什么？",parts:[
  {k:"qw",ok:["なに"],opts:["なに","だれ","どこ","なん"],wrong:{
    "だれ":["🧛❓","WHO do you drink?! Are you a vampire?","你喝“谁”？！你是吸血鬼吗？","real"],
    "どこ":["🧒🥤🌊","You drink a PLACE? The whole sea?","你喝一个“地方”？把整片海喝掉？"]}},
  "を のみ",{k:"end",ok:["ますか"]},"。"]},
{scene:"🧒📺",ans:"テレビを みます。",aEn:"I watch TV.",aZh:"我看电视。",qEn:"What do you watch?",qZh:"你看什么？",parts:[
  {k:"qw",ok:["なに"],opts:["なに","だれ","どこ","なん"],wrong:{
    "だれ":["👀👵","WHO do you watch? You stare at Grandma all day?","你看“谁”？整天盯着奶奶看？","real"],
    "どこ":["👀⬆️⬇️","WHERE do you look? Up? Down?","你看“哪里”？上面？下面？","real"]}},
  "を み",{k:"end",ok:["ますか"]},"。"]},
{scene:"🧒❤️🐱",ans:"ねこが すきです。",aEn:"I like cats.",aZh:"我喜欢猫。",qEn:"What do you like?",qZh:"你喜欢什么？",parts:[
  {k:"qw",ok:["なに"],opts:["なに","だれ","どこ","なん"],wrong:{
    "だれ":["🧒😳💕","WHO do you like?! Ooh… who is it? 💕","你喜欢“谁”？！哇……是谁呀？💕","real"],
    "どこ":["🗺️❤️","WHERE do you like? Which place is your favourite?","你喜欢“哪里”？哪个地方是你最爱的？","real"]}},
  "が すき",{k:"end",ok:["ですか"]},"。"]},
{scene:"✏️",ans:"えんぴつです。",aEn:"It's a pencil.",aZh:"是铅笔。",qEn:"What is this?",qZh:"这是什么？",parts:[
  "これは ",{k:"qw",ok:["なん"],opts:["なん","なに","だれ","どこ"],wrong:{
    "なに":["🗣️❓","Close! But right before です, Japanese people say this word a little differently.","很接近！可是在です前面，日本人会把这个词说得不太一样。"],
    "だれ":["✏️🙂👋","WHO is this? The pencil is a person? Hello, Mr Pencil!","这是“谁”？铅笔是人吗？铅笔先生你好！","real"],
    "どこ":["✏️🗺️","WHERE is this? The pencil is a place?","这里是“哪里”？铅笔是一个地方？","real"]}},
  {k:"end",ok:["ですか"]},"。"]},
{scene:"🧒🎂🔟",ans:"10さいです。",aEn:"I'm 10 years old.",aZh:"我10岁。",qEn:"How old are you?",qZh:"你几岁？",parts:[
  {k:"qw",ok:["なん"],opts:["なん","なに","だれ","どこ"],wrong:{
    "だれ":["🧍🎂❓","“WHO years old?” — a person can't be an age!","“谁”岁？——人又不是年龄！"]}},
  "さい",{k:"end",ok:["ですか"]},"。"]},
{scene:"⏰6️⃣🧒🥱",ans:"6じに おきます。",aEn:"I get up at 6.",aZh:"我6点起床。",qEn:"What time do you get up?",qZh:"你几点起床？",parts:[
  {k:"qw",ok:["なん"],opts:["なん","なに","どこ","だれ"],wrong:{
    "どこ":["🗺️⏰❓","“WHERE o'clock”? A clock doesn't show places!","“哪里”点？时钟上又没有地方！"]}},
  "じに おき",{k:"end",ok:["ますか"]},"。"]},
{scene:"🧒🤝🧒 ➡️ 🦁",ans:"ともだちと いきます。",aEn:"I go with a friend.",aZh:"我和朋友去。",qEn:"Who do you go to the zoo with?",qZh:"你和谁去动物园？",parts:[
  "どうぶつえんへ ",{k:"qw",ok:["だれ"],opts:["だれ","なに","どこ","どれ"],wrong:{
    "なに":["🧒🤝🥔","You go WITH WHAT? With a potato?","你和“什么”一起去？和一颗马铃薯？","real"],
    "どれ":C_NOLIST}},
  "と いき",{k:"end",ok:["ますか"]},"。"]},
{scene:"🧒🤝👩 ➡️ 🛒",ans:"おかあさんと いきます。",aEn:"I go with Mum.",aZh:"我和妈妈去。",qEn:"Who do you go to the supermarket with?",qZh:"你和谁去超市？",parts:[
  {k:"qw",ok:["だれ"],opts:["だれ","なに","どこ","どれ"],wrong:{
    "なに":["🧒🤝🐔🛒","You go shopping WITH WHAT? With a chicken?","你和“什么”一起去超市？和一只鸡？","real"],
    "どれ":C_NOLIST}},
  "と スーパーへ いき",{k:"end",ok:["ますか"]},"。"]},
{scene:"👜 ➡️ 👩‍🏫",ans:"せんせいの かばんです。",aEn:"It's the teacher's bag.",aZh:"是老师的包。",qEn:"Whose bag is this?",qZh:"这是谁的包？",parts:[
  "これは ",{k:"qw",ok:["だれ"],opts:["だれ","なん","どこ","なに"],wrong:{
    "なん":["👜❓","WHAT KIND of bag is it? A school bag? A shopping bag?","这是“什么”包？书包？购物袋？","real"],
    "どこ":["👜🏬","A bag from WHERE? Which shop is it from?","“哪里”的包？从哪家店买的？","real"]}},
  "の かばん",{k:"end",ok:["ですか"]},"。"]},
{scene:"🖊️ 🖍️ ✏️   👉🖊️",ans:"それです。",aEn:"That one (near you).",aZh:"是那个（你旁边的）。",qEn:"Which one is the teacher's pen?",qZh:"老师的笔是哪一个？",parts:[
  "せんせいの ペンは ",{k:"qw",ok:["どれ"],opts:["どれ","どこ","なん","だれ"],wrong:{
    "どこ":["🖊️📍","WHERE is the pen? That asks for a place — here, over there…","笔在“哪里”？这是在问地方——这里、那边……","real"],
    "なん":["🖊️❓","WHAT is a pen? Everyone knows what a pen is!","笔是“什么”？大家都知道笔是什么呀！","real"],
    "だれ":["🖊️🙂","WHO is the pen? The pen is a person now?","笔是“谁”？笔变成人了？","real"]}},
  {k:"end",ok:["ですか"]},"。"]},
{scene:"👟 👞 🥾   👉👞",ans:"あれです。",aEn:"That one over there.",aZh:"是那个（远处的）。",qEn:"Which ones are Dad's shoes?",qZh:"爸爸的鞋子是哪一双？",parts:[
  "おとうさんの くつは ",{k:"qw",ok:["どれ"],opts:["どれ","どこ","なん","だれ"],wrong:{
    "どこ":["👞📍","WHERE are the shoes? That asks for a place — here, over there…","鞋子在“哪里”？这是在问地方——这里、那边……","real"],
    "なん":["👞❓","WHAT are shoes? Dad knows what shoes are!","鞋子是“什么”？爸爸知道鞋子是什么啦！","real"]}},
  {k:"end",ok:["ですか"]},"。"]},
{scene:"🚃 ➡️ 🛫",ans:"でんしゃで いきます。",aEn:"I go by train.",aZh:"我坐电车去。",qEn:"How do you go to the airport?",qZh:"你坐什么去机场？",parts:[
  "くうこうへ ",{k:"qw",ok:["なんで"],opts:["なんで","どこ","なに","だれ"],wrong:{}},
  " いき",{k:"end",ok:["ますか"]},"。"]},
{scene:"🧒🚲 ➡️ 🏞️",ans:"じてんしゃで いきます。",aEn:"I go by bicycle.",aZh:"我骑脚踏车去。",qEn:"How do you go to the park?",qZh:"你怎么去公园？",parts:[
  "こうえんへ ",{k:"qw",ok:["なんで"],opts:["なんで","どこ","だれ","なに"],wrong:{}},
  " いき",{k:"end",ok:["ますか"]},"。"]},
{scene:"🚌 ➡️ 🏫",ans:"バスで いきます。",aEn:"I go by bus.",aZh:"我坐巴士去。",qEn:"How do you go to school?",qZh:"你坐什么去学校？",parts:[
  "がっこうへ ",{k:"qw",ok:["なんで"],opts:["なんで","どこ","なに","どれ"],wrong:{}},
  " いき",{k:"end",ok:["ますか"]},"。"]},

/* ---------- normal: ましたか・ませんか・ませんでしたか ---------- */
{scene:"📅⏪ 🧒➡️🦁🐘",ans:"どうぶつえんへ いきました。",aEn:"I went to the zoo.",aZh:"我去了动物园。",qEn:"Where did you go yesterday?",qZh:"你昨天去了哪里？",parts:[
  "きのう ",{k:"qw",ok:["どこ"],opts:["どこ","だれ","なに","どれ"],wrong:{
    "だれ":["🧒➡️🧍❓","You went TO a person? You walked straight into somebody?","你去了一个“人”那里？直接走进别人身上？"],
    "どれ":C_NOLIST}},
  "へ いき",{k:"end",ok:["ましたか"]},"。"]},
{scene:"📅⏪ 🧒🍜",ans:"ラーメンを たべました。",aEn:"I ate ramen.",aZh:"我吃了拉面。",qEn:"What did you eat yesterday?",qZh:"你昨天吃了什么？",parts:[
  "きのう ",{k:"qw",ok:["なに"],opts:["なに","だれ","どこ","なん"],wrong:{
    "だれ":["😱🧟","WHO did you eat?! Were you a monster yesterday?","你吃了“谁”？！你昨天变成怪兽了吗？","real"],
    "どこ":["🧒🍽️🏙️","You ate a PLACE? You ate the whole town?","你吃了一个“地方”？把整个城市吃掉？"]}},
  "を たべ",{k:"end",ok:["ましたか"]},"。"]},
{scene:"📅⏪ 🧒⚽🧒",ans:"ともだちと しました。",aEn:"I played with a friend.",aZh:"我和朋友踢了。",qEn:"Who did you play football with yesterday?",qZh:"你昨天和谁踢了足球？",parts:[
  "きのう ",{k:"qw",ok:["だれ"],opts:["だれ","なに","どこ","どれ"],wrong:{
    "なに":["🧒⚽🐔","You played football WITH WHAT? With a chicken?","你和“什么”一起踢足球？和一只鸡？","real"],
    "どれ":C_NOLIST}},
  "と サッカーを し",{k:"end",ok:["ましたか"]},"。"]},
{scene:"📅⏪ 🚕➡️🏠",ans:"タクシーで かえりました。",aEn:"I went home by taxi.",aZh:"我坐德士回家了。",qEn:"How did you go home yesterday?",qZh:"你昨天坐什么回家？",parts:[
  "きのう ",{k:"qw",ok:["なんで"],opts:["なんで","どこ","だれ","なに"],wrong:{}},
  " うちへ かえり",{k:"end",ok:["ましたか"]},"。"]},
{scene:"📅⏪ 😴🔟",ans:"10じに ねました。",aEn:"I went to bed at 10.",aZh:"我10点睡觉了。",qEn:"What time did you go to bed yesterday?",qZh:"你昨天几点睡觉？",parts:[
  "きのう ",{k:"qw",ok:["なん"],opts:["なん","なに","どこ","だれ"],wrong:{
    "どこ":["🗺️⏰❓","“WHERE o'clock”? A clock doesn't show places!","“哪里”点？时钟上又没有地方！"]}},
  "じに ね",{k:"end",ok:["ましたか"]},"。"]},
{scene:"📅⏪ 🍽️🍝",ans:"レストランで たべました。",aEn:"I ate at a restaurant.",aZh:"我在餐厅吃了。",qEn:"Where did you eat dinner yesterday?",qZh:"你昨天在哪里吃晚饭？",parts:[
  "きのう ",{k:"qw",ok:["どこ"],opts:["どこ","なに","だれ","どれ"],wrong:{
    "なに":["🥢🍚","WHAT did you eat dinner WITH? Chopsticks? A spoon?","你用“什么”吃晚饭？筷子？汤匙？","real"],
    "どれ":C_NOLIST}},
  "で ばんごはんを たべ",{k:"end",ok:["ましたか"]},"。"]},
{scene:"🧒🙅🫑",ans:"ピーマンを たべません。",aEn:"I don't eat green peppers.",aZh:"我不吃青椒。",qEn:"What don't you eat?",qZh:"你不吃什么？",parts:[
  {k:"qw",ok:["なに"],opts:["なに","だれ","どこ","なん"],wrong:{
    "だれ":["🧟❓","WHO don't you eat?! So… there ARE people you eat?!","你“不吃谁”？！所以……有些人你会吃？！","real"],
    "どこ":["🧒🙅🏞️","WHERE don't you eat? You don't eat… the park?","你“不吃哪里”？你不吃……公园？"]}},
  "を たべ",{k:"end",ok:["ませんか"]},"。"]},
{scene:"🧒🙅☕",ans:"コーヒーを のみません。",aEn:"I don't drink coffee.",aZh:"我不喝咖啡。",qEn:"What don't you drink?",qZh:"你不喝什么？",parts:[
  {k:"qw",ok:["なに"],opts:["なに","だれ","どこ","なん"],wrong:{
    "だれ":["🧛🙅","WHO don't you drink?! So you drink SOME people?!","你“不喝谁”？！所以有些人你会喝？！","real"]}},
  "を のみ",{k:"end",ok:["ませんか"]},"。"]},
{scene:"📅⏪ 🧒🙈📚",ans:"しゅくだいを しませんでした。",aEn:"I didn't do my homework.",aZh:"我没有做功课。",qEn:"What didn't you do yesterday?",qZh:"你昨天没有做什么？",parts:[
  "きのう ",{k:"qw",ok:["なに"],opts:["なに","だれ","どこ","なん"],wrong:{
    "だれ":["🧒❓🧍","“WHO didn't you do?” — you can't DO a person!","你“没有做谁”？——人又不能拿来“做”！"]}},
  "を し",{k:"end",ok:["ませんでしたか"]},"。"]},
{scene:"📅⏪ 🧒🙅🥦",ans:"やさいを たべませんでした。",aEn:"I didn't eat vegetables.",aZh:"我没有吃蔬菜。",qEn:"What didn't you eat yesterday?",qZh:"你昨天没有吃什么？",parts:[
  "きのう ",{k:"qw",ok:["なに"],opts:["なに","だれ","どこ","なん"],wrong:{
    "だれ":["🧟❓","WHO didn't you eat yesterday?! Who DID you eat?!","你昨天“没有吃谁”？！那你吃了谁？！","real"],
    "どこ":["🧒🙅🏙️","WHERE didn't you eat? You didn't eat… the town?","你“没有吃哪里”？你没有吃……城市？"]}},
  "を たべ",{k:"end",ok:["ませんでしたか"]},"。"]}
];
