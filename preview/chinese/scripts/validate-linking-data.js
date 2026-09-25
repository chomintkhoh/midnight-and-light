#!/usr/bin/env node
// 从 repo 根目录执行：node preview/chinese/scripts/validate-linking-data.js
const fs=require("fs"),vm=require("vm");
function load(p,name){let c={window:{}};vm.createContext(c);vm.runInContext(fs.readFileSync(p,"utf8"),c);return c.window[name]}
const B="preview/chinese/data/linking-words/";
const T=load(B+"teacher-scenes.js","ML_TEACHER_SCENES"),D=load(B+"detective-cases.js","ML_DETECTIVE_CASES");
const syn=[["但是","可是","不过","然而"],["仍然","依然","还是"],["竟然","居然"],["接着","然后"],["所以","因此","于是"]];
const near=(a,b)=>syn.some(g=>g.includes(a)&&g.includes(b));
const legit=[["因为","才"],["如果","才"],["即使","还"]];
const han=/[一-鿿]/;let bad=[];
function checkCore(){
  const code=fs.readFileSync("preview/chinese/core/zh-core.js","utf8"),ctx={localStorage:{getItem(){return null},setItem(){}},Audio:function(){}};
  ctx.window=ctx;vm.createContext(ctx);vm.runInContext(code,ctx);
  const src=[["因为","yīnwèi","connector","c1"],["下雨","xiàyǔ","",""],["，","","",""],["所以","suǒyǐ","connector","c2"],["迟到","chídào","",""],["。","","",""]],hz=src.map(x=>x[0]).join("");
  for(const mode of ["pinyin","ruby","hanzi"]){
    const out=ctx.MLZH.renderTokens(src,mode),ids=[...out.matchAll(/class="mltok[^"]*"[^>]*data-i="([^"]+)"/g)].map(m=>m[1]);
    if(ids.length!==src.length||ids.some(x=>!/^(0|[1-9]\d*)$/.test(x)))bad.push("CORE "+mode+": data-i invalid");
    if(mode==="ruby"){
      const rubies=[...out.matchAll(/<ruby\b[\s\S]*?<\/ruby>/g)].map(m=>m[0]);
      if(rubies.length!==src.filter(x=>x[1]).length||rubies.some(r=>(r.match(/<rt>/g)||[]).length!==1))bad.push("CORE ruby: each ruby needs exactly one rt");
      const noPy=out.replace(/<rt>[\s\S]*?<\/rt>/g,"").replace(/<[^>]+>/g,"");
      if(noPy!==hz)bad.push("CORE ruby: text mismatch after removing pinyin");
    }
  }
}
function checkTokens(id,toks){for(const t of toks){if(han.test(t[0])&&!t[1])bad.push(id+": 缺拼音 "+t[0]);}}
checkCore();
for(const s of T.scenes){
  checkTokens(s.id,s.tokens);
  const slots=Object.fromEntries(s.tokens.filter(t=>t[3]).map(t=>[t[3],t[0]]));
  for(const e of s.errors){
    const [sl,w,wpy]=e;
    if(!(sl in slots))bad.push(s.id+": 没有 slot "+sl);
    else{
      if(slots[sl]===w)bad.push(s.id+": 错误词等于正确词");
      if(near(slots[sl],w))bad.push(s.id+": 近义词当错误 "+slots[sl]+"/"+w);
    }
    if(!wpy)bad.push(s.id+": 错误词缺拼音 "+w);
    const firsts=Object.values(slots);
    if(legit.some(([a,b])=>firsts.includes(a)&&w===b))bad.push(s.id+": 「"+firsts[0]+"…"+w+"」其实成立，不能当错误");
  }
  if(s.audio.errors.length!==s.errors.length)bad.push(s.id+": 录音档数和错误数不一致");
}
for(const c of D){
  checkTokens(c.id,c.tokens);
  const inText=c.tokens.filter(t=>t[3]).map(t=>t[3]);
  for(const sl of inText)if(!c.slots[sl])bad.push(c.id+": 文中 slot "+sl+" 没有定义");
  for(const [sl,v] of Object.entries(c.slots)){
    const tok=c.tokens.find(t=>t[3]===sl);
    if(!tok||tok[0]!==v.correct)bad.push(c.id+": 修复词不符 "+sl);
    for(const e of v.errors){
      if(near(v.correct,e[0]))bad.push(c.id+": 近义词 "+v.correct+"/"+e[0]);
      if(!e[1])bad.push(c.id+": 错误词缺拼音");
    }
  }
  const q=c.question;if(!(q.answer>=0&&q.answer<q.options.length))bad.push(c.id+": 理解题答案超出范围");
}
const texts=D.map(c=>c.tokens.map(t=>t[0]).join(""));texts.forEach((t,i)=>{if(texts.indexOf(t)!==i)bad.push(D[i].id+": 文章内容和 "+D[texts.indexOf(t)].id+" 完全相同")});
const sents=T.scenes.map(s=>s.tokens.map(t=>t[0]).join(""));sents.forEach((t,i)=>{if(sents.indexOf(t)!==i)bad.push(T.scenes[i].id+": 句子和 "+T.scenes[sents.indexOf(t)].id+" 完全相同")});
if(T.scenes.length!==34)bad.push("浏览器/数据题数应为 34，实际 "+T.scenes.length);
if(D.length!==3)bad.push("Detective 题数应为 3，实际 "+D.length);
if(bad.length){console.error(bad.join("\n"));process.exit(1)}
console.log("QA PASS:",T.scenes.length,"teacher scenes,",D.length,"detective cases; core reading modes PASS");
