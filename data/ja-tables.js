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
/* [日文, 平假名读法（片假名才要）, 旗, English, 中文]。〜じん = 〜人 */
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
  ["オーストラリア","おーすとらりあ","🇦🇺","Australia","澳洲"]
];
/* 画面用：片假名上面加平假名 */
const jtRuby = (k, h) => h ? `<ruby>${k}<rt>${h}</rt></ruby>` : k;
const jtCountryHTML = c => jtRuby(c[0], c[1]);

/* ---------- いくつ（ひとつ〜とお） ---------- */
const JT_TSU = ["","ひとつ","ふたつ","みっつ","よっつ","いつつ","むっつ","ななつ","やっつ","ここのつ","とお"];

/* ---------- 发音（装置的日文语音） ---------- */
const JTSpeak = (() => {
  let voice = null;
  function pick(){ try{ const v = speechSynthesis.getVoices(); voice = v.find(x => /^ja/i.test(x.lang)) || null; if(voice) document.querySelectorAll(".voice-warn").forEach(w => w.remove()); }catch(e){} }
  if("speechSynthesis" in window){ pick(); speechSynthesis.onvoiceschanged = pick; }
  return {
    say(t){
      try{
        if(!("speechSynthesis" in window)) return;
        speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(String(t).replace(/[＿〇]+/g, ""));
        u.lang = "ja-JP"; if(voice) u.voice = voice; u.rate = .8;
        speechSynthesis.speak(u);
      }catch(e){}
    },
    hasVoice(){ return !!voice; },
    supported(){ return "speechSynthesis" in window; }
  };
})();
