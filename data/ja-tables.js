/* =====================================================================
   Midnight & Light — 日文参考表（数字・年龄・国家・いくつ）
   单元里只用到一部分；完整的表在 tables.html（额外练习）。
   改内容只改这里，self-intro.html 和 tables.html 都读这个档。
   ===================================================================== */

/* ---------- 数字 ---------- */
const JT_D1 = ["","いち","に","さん","よん","ご","ろく","なな","はち","きゅう"];
const JT_HUN = {1:"ひゃく",3:"さんびゃく",6:"ろっぴゃく",8:"はっぴゃく"};
const JT_THO = {1:"せん",3:"さんぜん",8:"はっせん"};
function jtNum(n){
  if(n === 0) return "ゼロ";
  let s = "";
  const th = Math.floor(n/1000); n %= 1000; if(th) s += JT_THO[th] || JT_D1[th] + "せん";
  const h = Math.floor(n/100);   n %= 100;  if(h)  s += JT_HUN[h] || JT_D1[h] + "ひゃく";
  const t = Math.floor(n/10);    n %= 10;   if(t)  s += (t === 1 ? "" : JT_D1[t]) + "じゅう";
  if(n) s += JT_D1[n];
  return s;
}
/* 表上显示的数字：0〜10、20〜100（每十）。alt = 另一个念法 */
const JT_NUMBERS = [
  {n:0,  alt:"れい"}, {n:1}, {n:2}, {n:3}, {n:4, alt:"し"}, {n:5}, {n:6},
  {n:7, alt:"しち"}, {n:8}, {n:9, alt:"く"}, {n:10},
  {n:20},{n:30},{n:40},{n:50},{n:60},{n:70},{n:80},{n:90},{n:100}
];

/* ---------- 年龄 ---------- */
/* 1 いっさい・8 はっさい・10 じゅっさい・20 はたち 会变音 */
function jtAge(n){
  if(n === 20) return "はたち";
  const b = jtNum(n), d = n % 10;
  if(d === 1) return b.slice(0,-2) + "いっさい";
  if(d === 8) return b.slice(0,-2) + "はっさい";
  if(d === 0) return b.slice(0,-3) + "じゅっさい";
  return b + "さい";
}
const jtAgeIrr = n => n === 20 || n % 10 === 1 || n % 10 === 8 || n % 10 === 0;
const JT_AGE_RANGE = { kid:[1,20], adult:[20,60] };

/* ---------- 国家 ---------- */
/* [日文, 平假名读法（片假名才要）, 旗, English, 中文]。〜じん = 〜人。顺序：前 12 个是常用的 */
const JT_COUNTRIES = [
  ["マレーシア","まれーしあ","🇲🇾","Malaysia","马来西亚"],
  ["シンガポール","しんがぽーる","🇸🇬","Singapore","新加坡"],
  ["インドネシア","いんどねしあ","🇮🇩","Indonesia","印尼"],
  ["タイ","たい","🇹🇭","Thailand","泰国"],
  ["にほん","","🇯🇵","Japan","日本"],
  ["ちゅうごく","","🇨🇳","China","中国"],
  ["たいわん","","🇹🇼","Taiwan","台湾"],
  ["かんこく","","🇰🇷","Korea","韩国"],
  ["インド","いんど","🇮🇳","India","印度"],
  ["アメリカ","あめりか","🇺🇸","USA","美国"],
  ["イギリス","いぎりす","🇬🇧","UK","英国"],
  ["オーストラリア","おーすとらりあ","🇦🇺","Australia","澳洲"],
  ["ベトナム","べとなむ","🇻🇳","Vietnam","越南"],
  ["ドイツ","どいつ","🇩🇪","Germany","德国"]
];
/* 另一个念法 */
const JT_COUNTRY_ALT = { "にほん":"にっぽん" };
/* 画面用：片假名上面加平假名 */
const jtRuby = (k, h) => h ? `<ruby>${k}<rt>${h}</rt></ruby>` : k;
const jtCountryHTML = c => jtRuby(c[0], c[1]);

/* ---------- いくつ（ひとつ〜とお） ---------- */
const JT_TSU = ["","ひとつ","ふたつ","みっつ","よっつ","いつつ","むっつ","ななつ","やっつ","ここのつ","とお"];

/* ---------- 发音：先用 Mint 的录音，没录到的才用装置的日文语音 ----------
   录音放在 assets/audio/japanese/intro/。表里的字（平假名）对到档名。
   没有整句录音时，会拆开接起来播：国家＋じん＋です、年龄＋です。
   say(文字, {voice:"satoshi"}) = 优先用さとし的录音。 */
const JT_AUDIO_DIR = "./assets/audio/japanese/intro/";
const JT_CLIPS = {"ぜろ":"num-01.mp3","れい":"num-02.mp3","いち":"num-03.mp3","に":"num-04.mp3","さん":"num-05.mp3","よん":"num-06.mp3","し":"num-07.mp3","ご":"num-08.mp3","ろく":"num-09.mp3","しち":"num-10.mp3","なな":"num-11.mp3","はち":"num-12.mp3","きゅう":"num-13.mp3","く":"num-14.mp3","じゅう":"num-15.mp3","にじゅう":"num-16.mp3","さんじゅう":"num-17.mp3","よんじゅう":"num-18.mp3","ごじゅう":"num-19.mp3","ろくじゅう":"num-20.mp3","はちじゅう":"num-21.mp3","きゅうじゅう":"num-22.mp3","ひゃく":"num-23.mp3","ひとつ":"num-24.mp3","ふたつ":"num-25.mp3","みっつ":"num-26.mp3","よっつ":"num-27.mp3","いつつ":"num-28.mp3","むっつ":"num-29.mp3","ななつ":"num-30.mp3","やっつ":"num-31.mp3","ここのつ":"num-32.mp3","とお":"num-33.mp3","これはいくつですか":"num-34.mp3","いっさい":"age-01.mp3","にさい":"age-02.mp3","さんさい":"age-03.mp3","よんさい":"age-04.mp3","ごさい":"age-05.mp3","ろくさい":"age-06.mp3","ななさい":"age-07.mp3","はっさい":"age-08.mp3","きゅうさい":"age-09.mp3","じゅっさい":"age-10.mp3","じゅういっさい":"age-11.mp3","じゅうにさい":"age-12.mp3","じゅうさんさい":"age-13.mp3","じゅうよんさい":"age-14.mp3","じゅうごさい":"age-15.mp3","じゅうろくさい":"age-16.mp3","じゅうななさい":"age-17.mp3","じゅうはっさい":"age-18.mp3","じゅうきゅうさい":"age-19.mp3","はたち":"age-20.mp3","にじゅういっさい":"age-21.mp3","にじゅうにさい":"age-22.mp3","にじゅうさんさい":"age-23.mp3","にじゅうよんさい":"age-24.mp3","にじゅうごさい":"age-25.mp3","にじゅうろくさい":"age-26.mp3","にじゅうななさい":"age-27.mp3","にじゅうはっさい":"age-28.mp3","にじゅうきゅうさい":"age-29.mp3","さんじゅっさい":"age-30.mp3","さんじゅういっさい":"age-31.mp3","さんじゅうにさい":"age-32.mp3","さんじゅうさんさい":"age-33.mp3","さんじゅうよんさい":"age-34.mp3","さんじゅうごさい":"age-35.mp3","さんじゅうろくさい":"age-36.mp3","さんじゅうななさい":"age-37.mp3","さんじゅうはっさい":"age-38.mp3","さんじゅうきゅうさい":"age-39.mp3","よんじゅっさい":"age-40.mp3","よんじゅういっさい":"age-41.mp3","よんじゅうにさい":"age-42.mp3","よんじゅうさんさい":"age-43.mp3","よんじゅうよんさい":"age-44.mp3","よんじゅうごさい":"age-45.mp3","よんじゅうろくさい":"age-46.mp3","よんじゅうななさい":"age-47.mp3","よんじゅうはっさい":"age-48.mp3","よんじゅうきゅうさい":"age-49.mp3","ごじゅっさい":"age-50.mp3","ごじゅういっさい":"age-51.mp3","ごじゅうにさい":"age-52.mp3","ごじゅうさんさい":"age-53.mp3","ごじゅうよんさい":"age-54.mp3","ごじゅうごさい":"age-55.mp3","ごじゅうろくさい":"age-56.mp3","ごじゅうななさい":"age-57.mp3","ごじゅうはっさい":"age-58.mp3","ごじゅうきゅうさい":"age-59.mp3","ろくじゅっさい":"age-60.mp3","マレーシア":"country-01.mp3","シンガポール":"country-02.mp3","インドネシア":"country-03.mp3","タイ":"country-04.mp3","にほん":"country-05.mp3","にっぽん":"country-06.mp3","ちゅうごく":"country-07.mp3","たいわん":"country-08.mp3","かんこく":"country-09.mp3","インド":"country-10.mp3","アメリカ":"country-11.mp3","イギリス":"country-12.mp3","オーストラリア":"country-13.mp3","ベトナム":"country-15.mp3","ドイツ":"country-16.mp3","じん":"country-17.mp3","はじめまして":"rina-01.mp3","わたしはリナです":"rina-02.mp3","マレーシアじんです":"rina-03.mp3","さんじゅうごさいです":"rina-04.mp3","どうぞよろしくおねがいします":"rina-05.mp3","にほんじんじゃありません":"rina-06.mp3","にほんじんですか":"rina-07.mp3","わたしもマレーシアじんです":"rina-08.mp3","ですか":"rina-09.mp3","です":"rina-10.mp3","じゃありません":"rina-11.mp3"};
const JT_CLIPS_SATOSHI = {"はじめまして":"satoshi-01.mp3","わたしはさとしです":"satoshi-02.mp3","にほんじんです":"satoshi-03.mp3","よろしくおねがいします":"satoshi-04.mp3"};
/* 画面上的字跟录音的字不一样的地方 */
const JT_CLIP_ALIAS = { "ゼロ":"ぜろ", "わたしはです":"わたしはリナです", "さいです":"さんじゅうごさいです" };

const JTSpeak = (() => {
  let voice = null, audio = null, token = 0, timer = null;
  function pick(){ try{ const v = speechSynthesis.getVoices(); voice = v.find(x => /^ja/i.test(x.lang)) || null; }catch(e){} }
  if("speechSynthesis" in window){ pick(); speechSynthesis.onvoiceschanged = pick; }
  const norm = t => String(t).replace(/<rt>.*?<\/rt>/g, "").replace(/<[^>]+>/g, "").replace(/[\s　。．？?！!＿〇]+/g, "");
  function clip(t, v){ t = JT_CLIP_ALIAS[t] || t; return (v === "satoshi" && JT_CLIPS_SATOSHI[t]) || JT_CLIPS[t] || JT_CLIPS_SATOSHI[t] || null; }
  /* 一句话 → 录音档清单；拆不出来就回 null */
  function parts(t, v){
    if(!t) return [];
    const c = clip(t, v); if(c) return [c];
    for(const end of ["じゃありません", "ですか", "です", "じん"]){
      if(t.length > end.length && t.endsWith(end)){
        const head = parts(t.slice(0, -end.length), v), tail = clip(end, v);
        if(head && tail) return head.concat(tail);
      }
    }
    return null;
  }
  function tts(t, done){
    try{
      if(!("speechSynthesis" in window)) return done();
      const u = new SpeechSynthesisUtterance(t);
      u.lang = "ja-JP"; if(voice) u.voice = voice; u.rate = .8;
      u.onend = u.onerror = () => done();
      speechSynthesis.speak(u);
    }catch(e){ done(); }
  }
  function stop(){ token++; clearTimeout(timer); try{ if(audio){ audio.pause(); audio = null; } speechSynthesis.cancel(); }catch(e){} }
  return {
    /* 「　」或「、」或「。」分开的每一段，依序播放 */
    say(t, opt){
      stop();
      const my = token;
      /* t 可以是一串字，也可以是 [{text, voice}, …]（对话里两个人的声音不同） */
      const items = Array.isArray(t) ? t : [{text:t, voice:opt && opt.voice}];
      const queue = [];
      items.forEach(it => String(it.text).split(/[　、。]+/).map(norm).filter(Boolean).forEach(s => {
        if(queue.length) queue.push({pause:350});
        const p = parts(s, it.voice); queue.push(p ? {files:p} : {text:s});
      }));
      (function next(){
        if(my !== token || !queue.length) return;
        const q = queue.shift();
        if(q.pause){ timer = setTimeout(next, q.pause); return; }
        if(q.text){ tts(q.text, next); return; }
        const f = q.files.shift(); if(q.files.length) queue.unshift(q);
        audio = new Audio(JT_AUDIO_DIR + f);
        audio.onended = next; audio.onerror = next;
        audio.play().catch(next);
      })();
    },
    /* 这句话有没有完整的录音（没有就会用装置语音） */
    recorded(t, opt){ return String(t).split(/[　、。]+/).map(norm).filter(Boolean).every(s => parts(s, opt && opt.voice)); },
    hasVoice(){ return !!voice; },
    supported(){ return "speechSynthesis" in window; }
  };
})();
