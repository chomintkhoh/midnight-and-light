import { chromium } from "playwright";
import fs from "fs";
fs.mkdirSync("qa-output",{recursive:true});
const report=[];
function ok(name,cond,detail=""){report.push({name,pass:!!cond,detail});if(!cond)throw new Error(name+" :: "+detail)}
const browser=await chromium.launch({headless:true});
async function fresh(width,height=900){
  const p=await browser.newPage({viewport:{width,height}});
  await p.goto("http://127.0.0.1:8000/preview/chinese/index.html#vocab",{waitUntil:"networkidle"});
  return p;
}
async function vocabShot(width,label,scale){
  const p=await fresh(width,width===390?844:900);
  await p.locator('[data-scale="'+scale+'"]').click();
  await p.locator('[data-tab="vocab"]').click();
  const vf=p.frameLocator("#vocabFrame");
  await vf.locator("body").waitFor();
  const zoom=await p.locator("#vocabFrame").evaluate(el=>el.contentDocument.documentElement.style.zoom);
  ok("vocab zoom "+width+" "+label,zoom===String(scale),"zoom="+zoom);
  await p.screenshot({path:"qa-output/vocab-"+width+"-"+label+".png",fullPage:true});
  await p.close();
}
await vocabShot(1280,"A",1);
{
  const p=await fresh(1280,900);
  await p.locator('[data-tab="linking"]').click();
  await p.locator('[data-scale="1.25"]').click();
  await p.locator('[data-tab="vocab"]').click();
  const vf=p.frameLocator("#vocabFrame"); await vf.locator("body").waitFor();
  const zoom=await p.locator("#vocabFrame").evaluate(el=>el.contentDocument.documentElement.style.zoom);
  ok("A+ persists linking→vocab 1280",zoom==="1.25","zoom="+zoom);
  await p.screenshot({path:"qa-output/vocab-1280-Aplus.png",fullPage:true}); await p.close();
}
await vocabShot(390,"A",1);
{
  const p=await fresh(390,844);
  await p.locator('[data-tab="linking"]').click();
  await p.locator('[data-scale="1.25"]').click();
  await p.locator('[data-tab="vocab"]').click();
  const vf=p.frameLocator("#vocabFrame"); await vf.locator("body").waitFor();
  const zoom=await p.locator("#vocabFrame").evaluate(el=>el.contentDocument.documentElement.style.zoom);
  ok("A+ persists linking→vocab 390",zoom==="1.25","zoom="+zoom);
  await p.screenshot({path:"qa-output/vocab-390-Aplus.png",fullPage:true}); await p.close();
}
async function linkingPage(width,scale){
  const p=await fresh(width,width===390?844:900);
  await p.locator('[data-tab="linking"]').click();
  await p.locator('[data-scale="'+scale+'"]').click();
  const lf=p.frameLocator("#linkingFrame");
  await lf.locator("#play").waitFor();
  return {p,lf};
}
async function checkBigPinyin(width,scale){
  const {p,lf}=await linkingPage(width,scale);
  await lf.locator("#reading").selectOption("pinyin");
  await p.waitForTimeout(120);
  const gaps=await lf.locator("#play").evaluate(root=>{
    const rts=[...root.querySelectorAll(".mode-pinyin ruby rt")].map(x=>x.getBoundingClientRect());
    const vals=[]; for(let i=0;i<rts.length-1;i++){const a=rts[i],b=rts[i+1];if(Math.abs(a.top-b.top)<2 && b.left>=a.left)vals.push(b.left-a.right)} return vals;
  });
  ok("Big Pinyin gaps "+width+" scale "+scale,gaps.length===0||Math.min(...gaps)>=2,"gaps="+JSON.stringify(gaps.slice(0,20)));
  await p.close();
}
for(const w of [1280,390])for(const s of [1,1.25])await checkBigPinyin(w,s);
async function buildShot(width){
  const {p,lf}=await linkingPage(width,1);
  await lf.locator('[data-mode="build"]').click(); await p.waitForTimeout(120);
  const info=await lf.locator("#play").evaluate(root=>{
    const cards=[...root.querySelectorAll(".bopt")];
    const connectorSet=new Set(["因为","所以","虽然","但是","却","如果","就","只要","不但","而且","还","不仅","一边","无论","都","不管","既然","即使","也","尽管","还是","不是","而是","与其","不如","宁愿","先","然后","再","一旦","除非","否则","既","又","有的","一方面","另一方面"]);
    return {count:cards.length,cards:cards.map(b=>b.textContent.trim()),rubyAligned:cards.every(b=>[...b.querySelectorAll("ruby")].every(r=>r.querySelectorAll("rb").length===1&&r.querySelectorAll("rt").length===1))};
  });
  ok("BUILD 4+ cards "+width,info.count>=4,JSON.stringify(info));
  ok("BUILD ruby aligned "+width,info.rubyAligned,JSON.stringify(info));
  const embedded=await lf.locator("body").evaluate(b=>({
    h1:getComputedStyle(b.querySelector(".app>h1")).display,
    scale:getComputedStyle(b.querySelector(".scale-controls")).display,
    controls:b.querySelector(".panel.controls").getBoundingClientRect(),
    play:b.querySelector("#play").getBoundingClientRect()
  }));
  ok("embedded title hidden "+width,embedded.h1==="none",JSON.stringify(embedded));
  ok("embedded scale hidden "+width,embedded.scale==="none",JSON.stringify(embedded));
  if(width===390){
    ok("mobile controls one row",embedded.controls.height<70,"height="+embedded.controls.height);
    ok("mobile question first screen",embedded.play.top<844,"top="+embedded.play.top);
  }
  await p.screenshot({path:"qa-output/build-"+width+".png",fullPage:true});
  await p.close();
}
await buildShot(1280); await buildShot(390);
async function detectiveShot(width){
  const {p,lf}=await linkingPage(width,1);
  await lf.locator('[data-mode="detective"]').click(); await p.waitForTimeout(120);
  ok("DETECTIVE visible "+width,await lf.locator("#case").isVisible(),"case hidden");
  if(width===390){
    const top=await lf.locator("#case").evaluate(x=>x.getBoundingClientRect().top);
    ok("DETECTIVE first screen starts "+width,top<844,"top="+top);
  }
  await p.screenshot({path:"qa-output/detective-"+width+".png",fullPage:true});
  await p.close();
}
await detectiveShot(1280); await detectiveShot(390);
await browser.close();
fs.writeFileSync("qa-output/report.json",JSON.stringify(report,null,2));
fs.writeFileSync("qa-output/report.txt",report.map(x=>(x.pass?"PASS ":"FAIL ")+x.name+(x.detail?" :: "+x.detail:"")).join("\n")+"\n");
