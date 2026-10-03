/* =====================================================================
   Midnight & Light — 日文单元表（N5，0〜27）＋ 学生进度
   ---------------------------------------------------------------------
   Mint 平常只要改最下面的 STUDENT_UNITS：
     "代号": { book: "minna",  lesson: 3 },   大家的日本語 第 3 課
     "代号": { book: "kodomo", lesson: 5 },   こどものにほんご 第 5 课
     "代号": { book: "dekiru", lesson: 2 },   できる日本語 第 2 课
     lesson: 0 = 还在学假名，只开放单元 0。
   上完一课就把 lesson 的数字改大。没写在这里的学生，My Practice 跟以前一样全部显示。

   单元开放规则：学生的课本里，第一次教到这个单元的那一课上到了，单元就开放。
   对照表来自 2026-09-25「N5 单元大纲」，2026-10-03 用两本课本目录核对改正过。
   ===================================================================== */

/* books: 每本课本对应的课数。できる 写「课-小话题」，开放时只看「-」前面的课数。
   tasks: 这个单元的作业卡。href 带的参数让练习页只出这几组题。 */
const UNITS = [
 {n:0,  zh:"假名",           en:"Kana",                  can:"读写平假名、片假名；常用招呼语",
  books:{minna:[], dekiru:[], kodomo:[]},
  tasks:[
   {href:"hiragana-homework.html", ic:"✍️", name:"Hiragana Homework", desc:"あ〜ん · fill in, listen, maze"}
  ]},
 {n:1,  zh:"初次见面",       en:"Nice to meet you",      can:"说名字、国家、职业或年级",
  books:{minna:[1], dekiru:["1-1"], kodomo:[1]},
  tasks:[
   {href:"self-intro.html", ic:"🙋", name:"じこしょうかい", desc:"Name · country · age"}
  ]},
 {n:2,  zh:"家人和生日",     en:"Family & birthdays",    can:"介绍家人，说年龄和生日",
  books:{minna:[1,5], dekiru:["1-2"], kodomo:[1,5]},
  tasks:[
   {href:"tables.html#ages", ic:"🎂", name:"Ages table", desc:"なんさいですか？", stars:false}
  ]},
 {n:3,  zh:"这是谁的？",     en:"Whose is this?",        can:"问东西的名称和主人",
  books:{minna:[2], dekiru:["2-2"], kodomo:[2]},
  tasks:[
   {href:"things-places.html?groups=this,no,negative", ic:"🎒", name:"これ・の・じゃないです", desc:"This / whose / is not"},
   {href:"particles.html?focus=は,も&upto=3", ic:"🧩", name:"Particles は・も", desc:"これは〜です · これも〜です"},
   {href:"questions.html?focus=なん,だれ,どれ&upto=3", ic:"❓", name:"Question Words", desc:"なん・だれ・どれ"}
  ]},
 {n:4,  zh:"在哪里？",       en:"Where is it?",          can:"问地点和楼层",
  books:{minna:[3], dekiru:["2-1"], kodomo:[3]},
  tasks:[
   {href:"things-places.html?groups=place", ic:"📍", name:"ここ・そこ", desc:"Here / there"}
  ]},
 {n:5,  zh:"多少钱？",       en:"How much?",             can:"问价钱、买东西",
  books:{minna:[3], dekiru:["2-2"], kodomo:[10]}, tasks:[]},
 {n:6,  zh:"在餐厅",         en:"At a restaurant",       can:"点餐、说数量",
  books:{minna:[11], dekiru:["2-3"], kodomo:[10]}, tasks:[]},
 {n:7,  zh:"几点？",         en:"What time?",            can:"问时间和营业时间",
  books:{minna:[4], dekiru:["3-1"], kodomo:[5,6]},
  tasks:[
   {href:"clock.html", ic:"🕒", name:"Time & Clock", desc:"Read the clock, から～まで, mall mission"},
   {href:"particles.html?focus=から,まで,は&upto=7", ic:"🧩", name:"Particles から・まで", desc:"from ～ until"}
  ]},
 {n:8,  zh:"我的一天",       en:"My day",                can:"说作息和习惯",
  books:{minna:[4,6,11], dekiru:["3-3"], kodomo:[5,6,7,16]},
  tasks:[
   {href:"particles.html?focus=を,に,で,も&upto=8", ic:"🧩", name:"Particles を・に・で", desc:"ごはんを たべます · 7じに · こうえんで"},
   {href:"questions.html?focus=なに,なん,どこ&upto=8", ic:"❓", name:"Question Words", desc:"なに・なんじ・どこで"}
  ]},
 {n:9,  zh:"去哪里？怎么去？", en:"Going places",        can:"说去哪、搭什么、和谁去",
  books:{minna:[5], dekiru:["3-2","4-1"], kodomo:[5]},
  tasks:[
   {href:"particles.html?focus=へ,で,と,に,も&upto=9", ic:"🧩", name:"Particles へ・で・と", desc:"to · by · with"},
   {href:"questions.html?focus=どこ,だれ,なんで&upto=9", ic:"❓", name:"Question Words", desc:"どこへ・だれと・なんで"}
  ]},
 {n:10, zh:"一起去吧！",     en:"Let's go together",     can:"邀约、答应或婉拒",
  books:{minna:[6], dekiru:["6-1"], kodomo:[8,17]}, tasks:[]},
 {n:11, zh:"我的城市",       en:"My town",               can:"形容地方和东西",
  books:{minna:[8], dekiru:["4-2"], kodomo:[4,8]}, tasks:[]},
 {n:12, zh:"天气和味道",     en:"Weather & taste",       can:"聊天气、季节、食物",
  books:{minna:[8], dekiru:["4-3"], kodomo:[4]}, tasks:[]},
 {n:13, zh:"我喜欢…",        en:"I like…",               can:"说喜好、擅长、原因",
  books:{minna:[9], dekiru:["9-1","8-2"], kodomo:[4,8,14]},
  tasks:[
   {href:"particles.html?focus=が,は,も&upto=13", ic:"🧩", name:"Particle が", desc:"Nが すきです"}
  ]},
 {n:14, zh:"有什么？在哪里？", en:"There is…",            can:"说人和东西的位置",
  books:{minna:[10], dekiru:["7-1"], kodomo:[9]}, tasks:[]},
 {n:15, zh:"周末做了什么",   en:"My weekend",            can:"说过去的事和感想",
  books:{minna:[12], dekiru:["5-1","5-2"], kodomo:[7,12]}, tasks:[]},
 {n:16, zh:"比一比",         en:"Comparing",             can:"比较、选择",
  books:{minna:[12], dekiru:["6-2"], kodomo:[13]}, tasks:[]},
 {n:17, zh:"想要／想去",     en:"I want…",               can:"说愿望和假期计划",
  books:{minna:[13], dekiru:["5-3"], kodomo:[9,13,19]}, tasks:[]},
 {n:18, zh:"送礼物",         en:"Giving gifts",          can:"送礼、收礼",
  books:{minna:[7], dekiru:["8-3"], kodomo:[11,14]}, tasks:[]},
 {n:19, zh:"请帮我",         en:"Please help",           can:"请求、帮忙、说正在做的事",
  books:{minna:[14], dekiru:["7-2","7-3"], kodomo:[14,15]}, tasks:[]},
 {n:20, zh:"可以吗？",       en:"May I?",                can:"请求许可、说规则",
  books:{minna:[15,17], dekiru:["10-2"], kodomo:[17]}, tasks:[]},
 {n:21, zh:"先…再…",         en:"First…then…",           can:"说顺序、描述人",
  books:{minna:[16], dekiru:["8-2","9-3"], kodomo:[16,17]}, tasks:[]},
 {n:22, zh:"必须／不用",     en:"Must / don't have to",  can:"说义务和不必做的事",
  books:{minna:[17], dekiru:["14-2"], kodomo:[20]}, tasks:[]},
 {n:23, zh:"我会…",          en:"I can…",                can:"说能力和兴趣",
  books:{minna:[18], dekiru:["9-1","9-2","12-3"], kodomo:[18,19]}, tasks:[]},
 {n:24, zh:"我去过",         en:"I have been…",          can:"说经验和变化",
  books:{minna:[19], dekiru:["13-1","11-1"], kodomo:[21,22]}, tasks:[]},
 {n:25, zh:"跟朋友聊天",     en:"Talking with friends",  can:"切换普通体和礼貌体",
  books:{minna:[20,26], dekiru:["11-3"], kodomo:[8,11,14,21,23]}, tasks:[]},
 {n:26, zh:"我觉得…",        en:"I think…",              can:"说意见、转述、建议、打算",
  books:{minna:[19,21,31], dekiru:["14-3","12-2"], kodomo:[20,24,26,30]}, tasks:[]},
 {n:27, zh:"描述和时间",     en:"Describing & when",     can:"用句子描述人和东西、说「…的时候」",
  books:{minna:[22,23,34,42], dekiru:["13-3","11-1"], kodomo:[21,22,23]}, tasks:[]}
];

const BOOK_NAMES = { minna:"大家的日本語", kodomo:"こどものにほんご", dekiru:"できる日本語" };

/* ===== 额外练习：不绑课本进度，所有学生都看得到 ===== */
const EXTRAS = [
 {href:"tables.html", ic:"📋", name:"Reference Tables", desc:"Numbers · ages · countries · ひとつ〜とお", stars:false},
 {href:"vocab.html", ic:"🍎", name:"Words", desc:"Pictures and words in 16 topics"}
];

/* ===== 学生进度（只管日文单元；中文照 practice.html 原本的设定） ===== */
const STUDENT_UNITS = {
  "FRD9J": { book:"minna", lesson:0 },   /* Yixuan：还在学平假名，只开单元 0 */
};

/* 这个单元在这本书第几课开始教（没有就是 Infinity） */
function unitStartLesson(unit, book){
  const list = (unit.books[book] || []).map(x => parseInt(String(x), 10)).filter(x => !isNaN(x));
  if(unit.n === 0) return 0;
  return list.length ? Math.min(...list) : Infinity;
}
function unitOpen(unit, progress){
  return !!progress && unitStartLesson(unit, progress.book) <= (progress.lesson || 0);
}

/* 句子属于哪个单元（Particles、Question Words 用）。按句子里用到的文法取最大的单元：
   これ/それ/あれ/の(所有)=3 · から/まで/ようび=7 · ます形=8 · 去/回/へ/と(一起)/なんで=9 · すき=13 */
function unitOfJa(t){
  let u = 1;
  const has = r => r.test(t);
  if(has(/これ|それ|あれ|どれ|だれの|の\s*(かばん|ペン|くつ)/)) u = Math.max(u,3);
  if(has(/から|まで|ようび/)) u = Math.max(u,7);
  if(has(/ます|ました|ません/)) u = Math.max(u,8);
  if(has(/いき|かえり|へ|と\s|と(いき|スーパー|サッカー|ケーキ|テレビ|えいが)|\[と|\[なんで\]/)) u = Math.max(u,9);
  if(has(/すき/)) u = Math.max(u,13);
  return u;
}
/* 练习页读网址：?focus=は,も&upto=3 */
function unitParams(){
  const q = new URLSearchParams(location.search);
  const focus = (q.get("focus") || "").split(",").map(x => x.trim()).filter(Boolean);
  const upto = parseInt(q.get("upto"), 10);
  const groups = (q.get("groups") || "").split(",").map(x => x.trim()).filter(Boolean);
  return { focus, upto: isNaN(upto) ? null : upto, groups };
}
