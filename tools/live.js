/* =====================================================================
   Midnight & Light — LIVE CLASS (shared by the teacher tools)
   Teacher presses 📡 Live → Start → sends the link ONCE.
   The link never changes (the room code is remembered on the teacher's device),
   so students can bookmark it and reuse it every lesson.
   - Teacher refreshes / drops out → the room re-opens by itself.
   - Student drops out → their page keeps trying to reconnect by itself.
   - Several students can join the same room.
   - Everyone sees everyone else's pointer (and a ripple where they tap).
   Uses PeerJS (free, no account): devices connect directly to each other.

   A page uses it like this:
     Live.init({
       room:"hira",                 // keeps different tools' rooms apart
       mount:element,               // where the 📡 Live button goes
       links:[{label,url}],         // optional: "take the class to another page" buttons (teacher)
       onHello(){...},              // TEACHER: a student just joined → send the current state
       onData(m){...},              // a message from another device
       onStatus(){...}              // optional: connection changed
     });
     Live.send({t:"...", ...});     // send to the other device(s) (ignored when not connected)
     Live.applying                  // true while handling a message from another device
     Live.muted                     // true = no sound on this device
   ===================================================================== */
(function(){
const css=`
.live-btn{border:1px solid #e2dccf;background:#fff;border-radius:999px;padding:6px 14px;font-weight:800;font-size:15px;cursor:pointer;font-family:inherit;color:#23263a}
.live-btn.on{background:#e4f3e7;border-color:#2f8a46;color:#2f8a46}.live-btn.wait{background:#fff7d6;border-color:#e9d38a}
.lp{position:fixed;top:60px;right:14px;z-index:50;width:min(380px,92vw);background:#fff;border:1px solid #e2dccf;border-radius:18px;box-shadow:0 14px 40px rgba(0,0,0,.15);padding:16px 18px;display:none;color:#23263a;font-family:Inter,system-ui,sans-serif;text-align:left}
.lp.open{display:block}
.lp h3{margin:0 0 6px;font-size:18px}.lp p{margin:6px 0;color:#7a7686;font-size:14px;line-height:1.45}
.lp .code{font-size:40px;font-weight:800;letter-spacing:.15em;text-align:center;color:#6f5aa8;margin:4px 0}
.lp input{width:100%;font:inherit;font-size:13px;padding:8px;border:1px solid #e2dccf;border-radius:10px;box-sizing:border-box}
.lp .row{display:flex;gap:8px;flex-wrap:wrap;margin-top:10px}
.lp .row button{border:1px solid #e2dccf;background:#fff;border-radius:999px;padding:7px 14px;font-weight:700;font-size:14px;cursor:pointer;font-family:inherit}
.lp .row .main{background:#23263a;color:#fff;border-color:#23263a}
.lp .row .go{background:#efeaf8;border-color:#6f5aa8;color:#6f5aa8}
.lp .st{font-weight:800;margin:8px 0 0}.lp .st.ok{color:#2f8a46}.lp .st.no{color:#c2475d}
.rcur{position:fixed;left:0;top:0;z-index:60;pointer-events:none;transition:transform .08s linear,opacity .4s;opacity:0}
.rcur.show{opacity:1}
.rcur svg{width:26px;height:26px;display:block;filter:drop-shadow(0 1px 2px rgba(0,0,0,.35))}
.rcur span{position:absolute;left:20px;top:20px;white-space:nowrap;font:800 12px Inter,system-ui,sans-serif;color:#fff;border-radius:999px;padding:2px 8px}
.rcur .edge{position:absolute;left:-4px;top:-30px;font-size:22px;display:none}.rcur.out .edge{display:block}
.rtap{position:fixed;z-index:59;pointer-events:none;width:46px;height:46px;margin:-23px 0 0 -23px;border-radius:50%;border:4px solid;animation:rtap .7s ease-out forwards}
@keyframes rtap{from{transform:scale(.3);opacity:1}to{transform:scale(1.6);opacity:0}}`;
function mk(t,c,h){const e=document.createElement(t);if(c)e.className=c;if(h!=null)e.innerHTML=h;return e}
const store={get(k){try{return localStorage.getItem(k)}catch(e){return null}},set(k,v){try{v==null?localStorage.removeItem(k):localStorage.setItem(k,v)}catch(e){}}};
const COLORS=["#d1495b","#2f8a46","#1f7aa8","#c77d14","#8a3fa8"];

const Live=window.Live={peer:null,conns:[],role:null,code:null,applying:false,muted:false,status:"off",cfg:{},retry:null,
  get on(){return this.conns.some(c=>c.open)},
  get conn(){return this.conns.find(c=>c.open)||null},
  init(cfg){this.cfg=cfg||{};
    const st=document.createElement("style");st.textContent=css;document.head.append(st);
    this.btn=mk("button","live-btn","📡 Live");this.btn.dataset.local="";this.btn.title="Do the lesson together on several devices: no screen sharing";
    this.panel=mk("div","lp");this.panel.dataset.local="";document.body.append(this.panel);
    (cfg.mount||document.body).append(this.btn);
    this.btn.onclick=()=>{this.panel.classList.toggle("open");this.draw()};
    this.pointers();
    /* heartbeat: browsers can take a long time to notice a dead connection,
       so everyone says "ping" every 2 s; 7 s of silence = treat it as dropped */
    setInterval(()=>{const now=Date.now();for(const c of this.conns){if(!c.open)continue;try{c.send({t:"ping"})}catch(e){}
      if(now-(c._seen||now)>7000)this.drop(c)}},2000);
    const q=new URLSearchParams(location.search).get("live");
    if(/^\d{4}$/.test(q||""))this.join(q);
    else if(store.get("mnl-live-hosting"))this.host(true)},       // teacher was live before this refresh → reopen the room
  /* m.to = only to that student; m._from = which student it came from (teacher relays to the others) */
  send(m,except){if(this.applying&&!m._relay)return;
    for(const c of this.conns){if(!c.open||c===except)continue;try{c.send(m)}catch(e){}}},
  opts(){const h=new URLSearchParams(location.search).get("peerhost");if(!h)return {};const [host,port]=h.split(":");return {host,port:+port||443,path:"/",secure:location.protocol==="https:"}},
  loadLib(){return new Promise((ok,bad)=>{if(window.Peer)return ok();const srcs=["https://unpkg.com/peerjs@1.5.4/dist/peerjs.min.js","https://cdn.jsdelivr.net/npm/peerjs@1.5.4/dist/peerjs.min.js"];
    const tryN=i=>{if(i>=srcs.length)return bad();const sc=document.createElement("script");sc.src=srcs[i];sc.onload=()=>ok();sc.onerror=()=>tryN(i+1);document.head.append(sc)};tryN(0)})},
  link(url){const ph=new URLSearchParams(location.search).get("peerhost");   // peerhost = testing only
    return (url?new URL(url,location.href).href.split("?")[0]:location.origin+location.pathname)+"?live="+this.code+(ph?"&peerhost="+ph:"")},
  count(){return this.conns.filter(c=>c.open).length},
  set(st,msg){this.status=st;const b=this.btn;b.classList.toggle("on",st==="on");b.classList.toggle("wait",st==="wait");
    const n=this.count();
    b.textContent=st==="on"?(this.role==="host"?`🟢 Live: ${n} student${n>1?"s":""}`:"🟢 Live with teacher"):st==="wait"?(this.role==="guest"?"🟡 Connecting…":"🟡 Live: waiting"):"📡 Live";
    this.msg=msg||"";this.draw();this.cfg.onStatus&&this.cfg.onStatus()},
  draw(){const p=this.panel;if(!p.classList.contains("open"))return;p.innerHTML="";
    if(!this.role){p.innerHTML=`<h3>📡 Live class</h3><p>Do this together on your own devices: no screen sharing. Your link stays the same every lesson.</p>`;
      const r=mk("div","row"),s=mk("button","main","Start live class"),c=mk("button","","Close");s.onclick=()=>this.host();c.onclick=()=>p.classList.remove("open");r.append(s,c);p.append(r);return}
    p.append(mk("h3","","📡 Live class"));
    if(this.role==="host"&&this.code){p.append(mk("p","","Student link (the same every lesson — they can bookmark it):"));
      const inp=mk("input");inp.readOnly=true;inp.value=this.link();inp.onclick=()=>inp.select();p.append(inp,mk("p","","Room code"),mk("div","code",this.code))}
    p.append(mk("div","st "+(this.status==="on"?"ok":this.status==="err"?"no":""),this.msg));
    const r=mk("div","row");
    if(this.role==="host"&&this.code){const cp=mk("button","main","Copy link");cp.onclick=()=>{(navigator.clipboard?navigator.clipboard.writeText(this.link()):Promise.reject()).then(()=>cp.textContent="Copied ✓").catch(()=>p.querySelector("input").select())};r.append(cp)}
    if(this.status==="on"){const rs=mk("button","","🔄 Re-sync");rs.title="Use if the screens look different";rs.onclick=()=>this.role==="host"?this.hello():this.send({t:"hello"});r.append(rs)}
    if(this.role==="host")(this.cfg.links||[]).forEach(l=>{const g=mk("button","go",l.label);g.title="Opens it on every device";g.onclick=()=>this.goTo(typeof l.url==="function"?l.url():l.url);r.append(g)});
    const mu=mk("button","",this.muted?"🔇 Sound off here":"🔊 Sound on here");mu.title="Turn off sound on this device (stops echo in the call)";mu.onclick=()=>{this.muted=!this.muted;this.draw()};r.append(mu);
    const en=mk("button","",this.role==="host"?"End class":"Leave"),cl=mk("button","","Close");en.onclick=()=>this.end();cl.onclick=()=>p.classList.remove("open");r.append(en,cl);p.append(r)},
  async ready(){try{await this.loadLib();return true}catch(e){this.set("err","Could not load the live tool. Check the internet and refresh.");return false}},
  /* TEACHER: open the room. The code is kept on this device, so the link never changes. */
  async host(quiet,tries){this.role="host";tries=tries||0;this.set("wait",tries?"Re-opening your room…":"Starting…");if(!await this.ready())return;
    this.code=store.get("mnl-live-code")||String(1000+Math.floor(Math.random()*9000));store.set("mnl-live-code",this.code);store.set("mnl-live-hosting","1");
    if(this.peer)try{this.peer.destroy()}catch(e){}
    const peer=this.peer=new Peer("mnl-"+(this.cfg.room||"x")+"-"+this.code,this.opts());
    peer.on("open",()=>this.set(this.on?"on":"wait",this.on?this.msg:"Waiting for students to open the link…"));
    peer.on("connection",c=>this.wire(c));
    /* the old room can stay "taken" for a few seconds after a refresh → just try again, same code */
    peer.on("error",e=>{if(e.type==="unavailable-id"&&tries<20){setTimeout(()=>{if(this.role==="host")this.host(true,tries+1)},3000);return}
      if(e.type==="unavailable-id"){store.set("mnl-live-code",null);this.set("err","Your room code is busy (open in another tab?). Close other tabs, then press 📡 Live → Start again.");this.role=null;return}
      if(e.type!=="peer-unavailable")this.set("err","Connection problem: "+e.type+". Trying again…")});
    peer.on("disconnected",()=>{setTimeout(()=>{try{if(this.peer===peer&&!peer.destroyed)peer.reconnect()}catch(e){}},1500)})},
  /* STUDENT: join, and keep trying by itself until the teacher's room is open */
  async join(code){this.role="guest";this.code=code;clearTimeout(this.retry);
    if(!this.joinedOnce)this.panel.classList.add("open");this.set("wait","Connecting to your teacher…");if(!await this.ready())return;
    if(this.peer)try{this.peer.destroy()}catch(e){}
    const again=msg=>{if(this.role!=="guest")return;this.set("wait",msg);clearTimeout(this.retry);this.retry=setTimeout(()=>this.join(code),3000)};
    const peer=this.peer=new Peer(this.opts());
    peer.on("open",()=>this.wire(peer.connect("mnl-"+(this.cfg.room||"x")+"-"+code,{serialization:"json",reliable:true})));
    peer.on("error",e=>again(e.type==="peer-unavailable"?"Waiting for your teacher to open the class… (trying again by itself)":"Connection problem. Trying again…"))},
  drop(c){if(c._dropped)return;c._dropped=true;try{c.close()}catch(e){}this.lost(c)},
  wire(c){c._seen=Date.now();
    if(this.role==="host"){const used=this.conns.filter(x=>x.open).map(x=>x._n);let n=1;while(used.includes(n))n++;c._n=n}   // Student 1, 2… (reuse free numbers)
    this.conns=this.conns.filter(x=>x.open||x===c);this.conns.push(c);
    c.on("open",()=>{
      if(this.role==="guest"){this.joinedOnce=true;this.set("on","✓ Connected to your teacher!");this.send({t:"hello"});setTimeout(()=>this.panel.classList.remove("open"),1500)}
      else this.set("on",`✓ ${this.count()} student${this.count()>1?"s":""} connected. Teach as normal: all screens move together.`)});
    c.on("data",m=>{c._seen=Date.now();if(m&&m.t==="ping")return;this.recv(m,c)});
    c.on("close",()=>this.lost(c))},
  lost(c){if(!this.conns.includes(c))return;{this.conns=this.conns.filter(x=>x!==c);this.cursorOf(c._n||0).classList.remove("show");
      if(this.role==="host")this.set(this.on?"on":"wait",this.on?`✓ ${this.count()} student${this.count()>1?"s":""} connected.`:"A student left. Waiting for them to open the link again…");
      else if(this.role==="guest"){this.set("wait","Connection lost. Reconnecting by itself…");clearTimeout(this.retry);this.retry=setTimeout(()=>this.join(this.code),2000)}}},
  hello(){this.cfg.onHello&&this.cfg.onHello()},
  recv(m,from){if(!m||!m.t)return;
    if(m.t==="hello"){if(this.role==="host")this.hello();return}
    if(m.t==="nav"){if(this.role==="guest")location.href=this.link(m.url);return}
    /* teacher passes a student's action on to the other students */
    if(this.role==="host"){m._from=from._n;if(this.count()>1)this.send({...m,_relay:1},from)}
    if(m.t==="ptr"){this.showPtr(m,this.role==="host"?from._n:(m._from||0));return}
    this.applying=true;try{this.cfg.onData&&this.cfg.onData(m)}catch(e){console.error(e)}finally{this.applying=false}},
  /* TEACHER: take everyone to another page (e.g. the pop quiz) */
  goTo(url){this.send({t:"nav",url});setTimeout(()=>{location.href=new URL(url,location.href).href},300)},
  end(){clearTimeout(this.retry);const was=this.role;this.role=null;
    for(const c of this.conns)try{c.close()}catch(e){}try{this.peer&&this.peer.destroy()}catch(e){}this.conns=[];this.peer=null;
    if(was==="host")store.set("mnl-live-hosting",null);
    this.code=null;this.set("off");const u=new URL(location.href);u.searchParams.delete("live");history.replaceState(null,"",u);this.draw()},

  /* ---------- pointers: where is the other person? ----------
     Position is sent relative to the element under the pointer, so it lands
     on the same button/word even when the two screens are different sizes. */
  els(){return [...document.body.getElementsByTagName("*")]},
  pointers(){let last=0;
    const pos=(e,tap)=>{if(!this.on)return;const t=document.elementFromPoint(e.clientX,e.clientY);if(!t||t.closest("[data-local]"))return;
      const i=this.els().indexOf(t);if(i<0)return;const r=t.getBoundingClientRect();
      this.send({t:"ptr",i,x:+((e.clientX-r.left)/Math.max(r.width,1)).toFixed(3),y:+((e.clientY-r.top)/Math.max(r.height,1)).toFixed(3),tap:tap?1:0})};
    document.addEventListener("pointermove",e=>{const n=Date.now();if(n-last<70)return;last=n;pos(e)},{passive:true});
    document.addEventListener("pointerdown",e=>pos(e,true),{passive:true})},
  cursorOf(n){this.curs=this.curs||{};if(this.curs[n])return this.curs[n];
    const col=this.role==="guest"&&!n?"#23263a":COLORS[(n-1+COLORS.length)%COLORS.length];
    const label=this.role==="host"?"Student"+(n>1||this.count()>1?" "+n:""):(n?"Student "+n:"Teacher");
    const d=mk("div","rcur",`<svg viewBox="0 0 24 24"><path d="M3 2l7 19 2.6-7.4L20 11z" fill="${col}" stroke="#fff" stroke-width="1.5"/></svg><span style="background:${col}">${label}</span><b class="edge"></b>`);
    d.dataset.local="";d._col=col;document.body.append(d);this.curs[n]=d;return d},
  showPtr(m,n){const t=this.els()[m.i];if(!t)return;const r=t.getBoundingClientRect();let x=r.left+m.x*r.width,y=r.top+m.y*r.height;
    const d=this.cursorOf(n),H=innerHeight,W=innerWidth,out=y<0?"⬆️":y>H?"⬇️":"";
    x=Math.min(Math.max(x,4),W-30);y=Math.min(Math.max(y,4),H-30);d.classList.toggle("out",!!out);d.querySelector(".edge").textContent=out;
    d.style.transform=`translate(${x}px,${y}px)`;d.classList.add("show");clearTimeout(d._t);d._t=setTimeout(()=>d.classList.remove("show"),5000);
    if(m.tap&&!out){const w=mk("div","rtap");w.dataset.local="";w.style.left=x+"px";w.style.top=y+"px";w.style.borderColor=d._col;document.body.append(w);setTimeout(()=>w.remove(),800)}}
};
})();
