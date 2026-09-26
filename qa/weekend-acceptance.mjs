// 周末版验收脚本。用法（repo 根目录）：
//   python3 -m http.server 8765 &   然后   node qa/weekend-acceptance.mjs
// 需要 playwright（npm i -D playwright 或全域安装）。任何一项 FAIL 都不可给学生。
import { chromium } from 'playwright';
const BASE = 'http://localhost:8765/preview/chinese/';
const results = []; const ok = (name, pass, info='') => results.push(`${pass?'PASS':'FAIL'}  ${name}${info?'  — '+info:''}`);
const frame = (p, re) => p.frames().find(f => re.test(new URL(f.url()).pathname));
const b = await chromium.launch();
for (const [w, h, tag] of [[1280, 860, 'desktop'], [390, 844, 'mobile']]) {
  const ctx = await b.newContext({ viewport: { width: w, height: h } }); const p = await ctx.newPage(); p.setDefaultTimeout(6000);
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  p.on('response', r => { if (r.status() >= 400 && !/\/audio\//.test(r.url())) errs.push(r.status() + ' ' + r.url()); });
  await p.goto(BASE + 'index.html#linking'); await p.waitForTimeout(900);
  let L = frame(p, /games\/linking-words/);
  // 1. 字级：A+ 后切到词语页签
  await p.click('[data-scale="1.25"]'); await p.waitForTimeout(300); await p.click('[data-tab=vocab]'); await p.waitForTimeout(300);
  const z = await frame(p, /games\/vocab/).evaluate(() => getComputedStyle(document.documentElement).zoom);
  ok(`${tag} 词语页 A+ zoom=1.25`, z === '1.25', z);
  await p.click('[data-scale="1"]'); await p.click('[data-tab=linking]'); await p.waitForTimeout(300); L = frame(p, /games\/linking-words/);
  // 2. 手机控制列最小字级
  const fs = await L.evaluate(() => ['#difficulty', '#reading', '[data-mode=match]', '#status'].map(s => { const e = document.querySelector(s); return e ? parseFloat(getComputedStyle(e).fontSize) : 0; }));
  const minUI = tag === 'mobile' ? 14 : 15; ok(`${tag} 控制列字级 ≥ ${minUI}px`, fs.every(x => x >= minUI), fs.join('/'));
  // 3. 大拼音：同一行相邻拼音不能相连
  await L.selectOption('#reading', 'pinyin'); await p.waitForTimeout(200);
  for (const mode of ['match', 'detective']) {
    await L.click(`[data-mode=${mode}]`); await p.waitForTimeout(300);
    const g = await L.evaluate(() => { const r = [...document.querySelectorAll('#play rt')].map(x => x.getBoundingClientRect()).filter(x => x.width > 0); let bad = 0, n = 0; for (let i = 1; i < r.length; i++) { if (Math.abs(r[i].top - r[i - 1].top) > 3) continue; n++; if (r[i].left - r[i - 1].right < 2) bad++; } return { n, bad }; });
    ok(`${tag} 大拼音 ${mode} 相邻 rt 间距 ≥2px`, g.bad === 0, `${g.bad}/${g.n} 对相连`);
  }
  // 4. BUILD：≥3 张、关联词独立、卡片不能跨标点
  let buildOK = true, sample = '';
  for (let k = 0; k < 40; k++) {
    await L.click('[data-mode=match]'); await L.click('[data-mode=build]'); await p.waitForTimeout(120);
    const cards = await L.evaluate(() => [...document.querySelectorAll('#play button')].filter(b => !/RESET|CHECK|NEXT/.test(b.innerText)).map(b => { const c = b.cloneNode(true); c.querySelectorAll('rt,rp').forEach(x => x.remove()); return c.textContent.replace(/\s/g, ''); }));
    const cross = cards.filter(c => /[，；：、][^，；：、。！？]/.test(c));
    if (cards.length < 3 || cross.length) { buildOK = false; sample = cards.join(' | '); break; }
  }
  ok(`${tag} BUILD 40 题：≥3 张且不跨标点`, buildOK, sample);
  // 5. 侦探：没有旧圆圈
  await L.click('[data-mode=detective]'); await p.waitForTimeout(200);
  ok(`${tag} 侦探无 .ml-lens`, (await L.evaluate(() => document.querySelectorAll('.ml-lens').length)) === 0);
  ok(`${tag} console/HTTP 零错误`, errs.length === 0, errs.slice(0, 3).join(' ; '));
  await p.screenshot({ path: `qa/${tag}-detective.png` }); await L.click('[data-mode=build]'); await p.screenshot({ path: `qa/${tag}-build.png` });
  await ctx.close();
}
await b.close(); console.log(results.join('\n')); process.exit(results.some(r => r.startsWith('FAIL')) ? 1 : 0);
