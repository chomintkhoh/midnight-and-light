/* Shared Chinese homework reporting. Embedded pages share the parent session.
   自动交作业：离开页面／切到别的 app（pagehide、visibilitychange=hidden）时用 sendBeacon 送出未交的记录；
   未交满 20 笔也会先送一次。入口页 ⚙ 里有「现在交」按钮（MLZhReport.flush）。没有学生代号就不送，记录留在本机。 */
(()=>{
"use strict";
if(window.parent!==window){try{if(window.parent.MLZhReport){window.MLZhReport=window.parent.MLZhReport;return}}catch(e){}}
const URL_="https://script.google.com/macros/s/AKfycbyudegTYiMN3lR_DccPITENYKQfAEimsJqsigTqj3ea8slXMCGN1Q0OrSu8UTv_kYs/exec";
const clean=v=>(v||"").trim().toUpperCase().replace(/[^A-Z0-9]/g,"").slice(0,20);
let code=clean(new URLSearchParams(location.search).get("s"));try{if(code)localStorage.setItem("mlStudentCode",code);else code=clean(localStorage.getItem("mlStudentCode"))}catch(e){}
const key="ml.zh.report.v1."+(code||"guest");
let memory=null;
const fresh=()=>({id:Date.now().toString(36)+"-"+Math.random().toString(36).slice(2),start:Date.now(),events:[]});
function read(){try{const s=JSON.parse(localStorage.getItem(key)||"null");if(s&&Array.isArray(s.events))return s}catch(e){}return memory||(memory=fresh())}
function write(s){memory=s;try{localStorage.setItem(key,JSON.stringify(s))}catch(e){}}
function payload(s){const a={};s.events.forEach(e=>{const x=a[e.activity]||(a[e.activity]={total:0,correct:0});x.total++;if(e.ok)x.correct++});return {code,page:"chinese-vocab-practice.html",sessionId:s.id,minutes:Math.max(1,Math.round((Date.now()-s.start)/60000)),summary:Object.entries(a).map(([k,v])=>k+"："+v.correct+"/"+v.total+" 次作答正确").join("；"),mistakes:s.events.filter(e=>!e.ok).map(e=>e.activity+"："+(e.question||e.item)+(e.picked?"；作答："+e.picked:"")).join("\n"),detail:JSON.stringify({activities:a,attempts:s.events})}}
function pending(){return read().events.length}
/* 送出目前全部未交记录；送出后只保留送出之后才新增的记录 */
function dispatch(useBeacon){
  const snap=read();if(!code||!snap.events.length)return false;
  const body=JSON.stringify(payload(snap));let ok=false;
  if(useBeacon&&navigator.sendBeacon){try{ok=navigator.sendBeacon(URL_,new Blob([body],{type:"text/plain;charset=utf-8"}))}catch(e){ok=false}}
  if(!ok){try{fetch(URL_,{method:"POST",mode:"no-cors",keepalive:true,headers:{"Content-Type":"text/plain;charset=utf-8"},body});ok=true}catch(e){ok=false}}
  if(ok){const sent=new Set(snap.events.map(e=>JSON.stringify(e)));const next=fresh();next.events=read().events.filter(e=>!sent.has(JSON.stringify(e)));write(next)}
  return ok;
}
async function flush(){return dispatch(false)}
function record(activity,item,ok,picked="",question=""){const s=read();s.events.push({activity,item:String(item),ok:!!ok,picked:String(picked),question:String(question),at:Date.now()});write(s);if(s.events.length>=20)dispatch(false)}
window.MLZhReport={record,payload,read,pending,flush};
if(window.parent!==window)return;
addEventListener("pagehide",()=>dispatch(true));
document.addEventListener("visibilitychange",()=>{if(document.visibilityState==="hidden")dispatch(true)});
})();
