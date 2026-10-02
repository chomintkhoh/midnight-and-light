/* 华文练习共用 TTS（浏览器语音，Mint 2026-10 同意暂用；以后换成预先生成的录音）。
   MLTTS.say(文字)；MLTTS.btn(文字, 标签) 产生 🔊 按钮 HTML（没有中文语音时回传空字串）；
   页面里任何带 data-say 的按钮点了都会读出 data-say 的内容。 */
(()=>{
"use strict";
let voice=null;
function find(){try{const v=speechSynthesis.getVoices();voice=v.find(x=>/zh[-_]CN/i.test(x.lang))||v.find(x=>/^(zh|cmn)/i.test(x.lang)&&!/HK|yue/i.test(x.lang))||null}catch(e){voice=null}
  document.documentElement.classList.toggle("has-tts",!!voice)}
if("speechSynthesis" in window){find();try{speechSynthesis.addEventListener("voiceschanged",find)}catch(e){speechSynthesis.onvoiceschanged=find}}
function say(text){if(!voice||!text)return;try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(String(text));u.voice=voice;u.lang=voice.lang;u.rate=.8;speechSynthesis.speak(u)}catch(e){}}
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
function btn(text,label="🔊",cls="tts-btn"){return voice?`<button type="button" class="${cls}" data-say="${esc(text)}" aria-label="Listen">${label}</button>`:""}
document.addEventListener("click",e=>{const b=e.target.closest("[data-say]");if(b){e.preventDefault();say(b.dataset.say)}});
const st=document.createElement("style");st.textContent=".tts-btn{min-height:38px;min-width:44px;padding:2px 10px;border:2px solid #202033;border-radius:12px;background:#fff;font:700 16px Arial,sans-serif;cursor:pointer;color:#202033;vertical-align:middle}.tts-btn:active{background:#ffd75a}";
document.head.append(st);
window.MLTTS={say,btn,ok:()=>!!voice};
})();
