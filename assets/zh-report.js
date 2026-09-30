/* Shared Chinese homework reporting. Embedded pages share the parent session. */
(()=>{
"use strict";
if(window.parent!==window){try{if(window.parent.MLZhReport){window.MLZhReport=window.parent.MLZhReport;return}}catch(e){}}
const clean=v=>(v||"").trim().toUpperCase().replace(/[^A-Z0-9]/g,"").slice(0,20);
let code=clean(new URLSearchParams(location.search).get("s"));try{if(code)localStorage.setItem("mlStudentCode",code);else code=clean(localStorage.getItem("mlStudentCode"))}catch(e){}
const key="ml.zh.report.v1."+(code||"guest");
let memory=null,busy=false;
const fresh=()=>({id:Date.now().toString(36)+"-"+Math.random().toString(36).slice(2),start:Date.now(),events:[]});
function read(){try{const s=JSON.parse(localStorage.getItem(key)||"null");if(s&&Array.isArray(s.events))return s}catch(e){}return memory||(memory=fresh())}
function write(s){memory=s;try{localStorage.setItem(key,JSON.stringify(s))}catch(e){}}
function record(activity,item,ok,picked="",question=""){const s=read();s.events.push({activity,item:String(item),ok:!!ok,picked:String(picked),question:String(question),at:Date.now()});write(s)}
function payload(s){const a={};s.events.forEach(e=>{const x=a[e.activity]||(a[e.activity]={total:0,correct:0});x.total++;if(e.ok)x.correct++});return {code,page:"chinese-vocab-practice.html",sessionId:s.id,minutes:Math.max(1,Math.round((Date.now()-s.start)/60000)),summary:Object.entries(a).map(([k,v])=>k+"："+v.correct+"/"+v.total+" 次作答正确").join("；"),mistakes:s.events.filter(e=>!e.ok).map(e=>e.activity+"："+(e.question||e.item)+(e.picked?"；作答："+e.picked:"")).join("\n"),detail:JSON.stringify({activities:a,attempts:s.events})}}
window.MLZhReport={record,payload,read};
function node(t,text){const e=document.createElement(t);if(text)e.textContent=text;return e}
function open(){const s=read(),p=payload(s),ov=node("div"),box=node("section");ov.className="zh-report-overlay";box.className="zh-report-box";box.setAttribute("role","dialog");box.setAttribute("aria-modal","true");box.setAttribute("aria-label","华文练习报告");box.append(node("h2","📋 华文练习报告"),node("p","学生代码："+(code||"未输入")),node("p",p.summary||"还没有作答记录。"),node("p","词语与关联词一起提交；重复作答按次数记录。"));
if(p.mistakes){const d=node("details"),summary=node("summary","查看错题");d.append(summary,node("pre",p.mistakes));box.append(d)}
const status=node("p"),send=node("button","📨 提交给老师 / Send to Teacher"),close=node("button","继续练习 / Keep Practising");
send.disabled=busy||!code||!s.events.length;if(!code)status.textContent="请先从 My Practice 输入学生代码。";
close.onclick=()=>{ov.remove();button.focus()};send.onclick=async()=>{if(busy)return;busy=true;send.disabled=true;status.textContent="正在提交…";const snapshot=read(),body=payload(snapshot);try{await fetch("https://script.google.com/macros/s/AKfycbyudegTYiMN3lR_DccPITENYKQfAEimsJqsigTqj3ea8slXMCGN1Q0OrSu8UTv_kYs/exec",{method:"POST",mode:"no-cors",headers:{"Content-Type":"text/plain;charset=utf-8"},body:JSON.stringify(body)});
const latest=read(),ids=new Set(snapshot.events.map(e=>JSON.stringify(e)));const remaining=latest.events.filter(e=>!ids.has(JSON.stringify(e)));const next=fresh();next.events=remaining;write(next);status.textContent="✓ 提交请求已发出。";send.textContent="已提交";close.textContent="关闭";
}catch(e){status.textContent="提交失败，记录已保留，请重试。";send.disabled=false}finally{busy=false}};
box.append(send,close,status);ov.append(box);document.body.append(ov);ov.onclick=e=>{if(e.target===ov)close.click()};close.focus()}
if(window.parent!==window)return;
const style=node("style");style.textContent=".zh-report-button{position:fixed;right:10px;bottom:10px;z-index:90;background:#ffd75a;color:#202033;border:2px solid #202033;border-radius:24px;padding:12px 16px;font:bold 16px Arial;cursor:pointer;min-height:48px}.zh-report-overlay{position:fixed;inset:0;z-index:1000;background:#0009;display:flex;align-items:center;justify-content:center;padding:12px}.zh-report-box{background:#f3efe5;color:#202033;border-radius:18px;padding:20px;width:min(560px,100%);max-height:90dvh;overflow:auto;font:16px/1.5 Arial}.zh-report-box button{margin:8px 8px 0 0;padding:10px;border:2px solid #202033;border-radius:12px;min-height:48px;background:#ffd75a;color:#202033;font:700 16px Arial}.zh-report-box button:disabled{opacity:.5}.zh-report-box pre{white-space:pre-wrap;font:inherit}.frames{padding-bottom:70px}body{padding-bottom:80px}body:has(.frames){padding-bottom:0}";
document.head.append(style);const button=node("button","✅ 完成并提交给老师");button.className="zh-report-button";button.onclick=open;document.body.append(button);
})();