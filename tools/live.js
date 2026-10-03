/* =====================================================================
   Midnight & Light — LIVE CLASS (shared by the teacher tools)
   Teacher presses 📡 Live → gets a link → sends it to the student.
   The student opens the link on their own device: no screen sharing.
   Uses PeerJS (free, no account): the two devices connect directly.

   A page uses it like this:
     Live.init({
       room:"hira",                 // keeps different tools' rooms apart
       mount:element,               // where the 📡 Live button goes
       onHello(){...},              // TEACHER: student just joined → send them the current state
       onData(m){...},              // both: a message from the other device
       onStatus(){...}              // optional: connection changed
     });
     Live.send({t:"...", ...});     // send to the other device (ignored when not connected)
     Live.applying                  // true while handling a message from the other side
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
.lp .st{font-weight:800;margin:8px 0 0}.lp .st.ok{color:#2f8a46}.lp .st.no{color:#c2475d}`;
function mk(t,c,h){const e=document.createElement(t);if(c)e.className=c;if(h!=null)e.innerHTML=h;return e}

const Live=window.Live={peer:null,conn:null,role:null,code:null,applying:false,muted:false,status:"off",cfg:{},
  get on(){return !!(this.conn&&this.conn.open)},
  init(cfg){this.cfg=cfg||{};
    const st=document.createElement("style");st.textContent=css;document.head.append(st);
    this.btn=mk("button","live-btn","📡 Live");this.btn.dataset.local="";this.btn.title="Do the lesson together on two devices: no screen sharing";
    this.panel=mk("div","lp");this.panel.dataset.local="";document.body.append(this.panel);
    (cfg.mount||document.body).append(this.btn);
    this.btn.onclick=()=>{this.panel.classList.toggle("open");this.draw()};
    const q=new URLSearchParams(location.search).get("live");
    if(/^\d{4}$/.test(q||""))this.join(q)},
  send(m){if(this.applying||!this.on)return;try{this.conn.send(m)}catch(e){}},
  opts(){const h=new URLSearchParams(location.search).get("peerhost");if(!h)return {};const [host,port]=h.split(":");return {host,port:+port||443,path:"/",secure:location.protocol==="https:"}},
  loadLib(){return new Promise((ok,bad)=>{if(window.Peer)return ok();const srcs=["https://unpkg.com/peerjs@1.5.4/dist/peerjs.min.js","https://cdn.jsdelivr.net/npm/peerjs@1.5.4/dist/peerjs.min.js"];
    const tryN=i=>{if(i>=srcs.length)return bad();const sc=document.createElement("script");sc.src=srcs[i];sc.onload=()=>ok();sc.onerror=()=>tryN(i+1);document.head.append(sc)};tryN(0)})},
  link(){return location.origin+location.pathname+"?live="+this.code},
  set(st,msg){this.status=st;const b=this.btn;b.classList.toggle("on",st==="on");b.classList.toggle("wait",st==="wait");
    b.textContent=st==="on"?(this.role==="host"?"🟢 Live: student here":"🟢 Live with teacher"):st==="wait"?"🟡 Live: waiting":"📡 Live";
    this.msg=msg||"";this.draw();this.cfg.onStatus&&this.cfg.onStatus()},
  draw(){const p=this.panel;if(!p.classList.contains("open"))return;p.innerHTML="";
    if(!this.role){p.innerHTML=`<h3>📡 Live class</h3><p>Do this together on two devices. The student opens your link on their own tablet or computer: no screen sharing.</p>`;
      const r=mk("div","row"),s=mk("button","main","Start live class"),c=mk("button","","Close");s.onclick=()=>this.host();c.onclick=()=>p.classList.remove("open");r.append(s,c);p.append(r);return}
    p.append(mk("h3","","📡 Live class"));
    if(this.role==="host"&&this.code){p.append(mk("p","","Send this link to your student (WhatsApp / chat):"));
      const inp=mk("input");inp.readOnly=true;inp.value=this.link();inp.onclick=()=>inp.select();p.append(inp,mk("p","","Room code"),mk("div","code",this.code))}
    p.append(mk("div","st "+(this.status==="on"?"ok":this.status==="err"?"no":""),this.msg));
    const r=mk("div","row");
    if(this.role==="host"&&this.code){const cp=mk("button","main","Copy link");cp.onclick=()=>{(navigator.clipboard?navigator.clipboard.writeText(this.link()):Promise.reject()).then(()=>cp.textContent="Copied ✓").catch(()=>p.querySelector("input").select())};r.append(cp)}
    if(this.status==="on"){const rs=mk("button","","🔄 Re-sync");rs.title="Use if the two screens look different";rs.onclick=()=>this.role==="host"?this.hello():this.send({t:"hello"});r.append(rs)}
    if(this.role==="guest"&&this.status==="err"){const rt=mk("button","main","Try again");rt.onclick=()=>this.join(this.code);r.append(rt)}
    const mu=mk("button","",this.muted?"🔇 Sound off here":"🔊 Sound on here");mu.title="Turn off sound on this device (stops echo in the call)";mu.onclick=()=>{this.muted=!this.muted;this.draw()};r.append(mu);
    const en=mk("button","","End"),cl=mk("button","","Close");en.onclick=()=>this.end();cl.onclick=()=>p.classList.remove("open");r.append(en,cl);p.append(r)},
  async ready(){try{await this.loadLib();return true}catch(e){this.set("err","Could not load the live tool. Check the internet and refresh.");return false}},
  async host(){this.role="host";this.set("wait","Starting…");if(!await this.ready())return;
    this.code=String(1000+Math.floor(Math.random()*9000));
    const peer=this.peer=new Peer("mnl-"+(this.cfg.room||"x")+"-"+this.code,this.opts());
    peer.on("open",()=>this.set("wait","Waiting for the student to open the link…"));
    peer.on("connection",c=>{if(this.conn)try{this.conn.close()}catch(e){}this.wire(c)});
    peer.on("error",e=>{if(e.type==="unavailable-id"){peer.destroy();this.host();return}this.set("err","Connection problem: "+e.type)});
    peer.on("disconnected",()=>{try{peer.reconnect()}catch(e){}})},
  async join(code){this.role="guest";this.code=code;this.panel.classList.add("open");this.set("wait","Joining class "+code+"…");if(!await this.ready())return;
    if(this.peer)try{this.peer.destroy()}catch(e){}
    const peer=this.peer=new Peer(this.opts());
    peer.on("open",()=>this.wire(peer.connect("mnl-"+(this.cfg.room||"x")+"-"+code,{serialization:"json",reliable:true})));
    peer.on("error",e=>this.set("err",e.type==="peer-unavailable"?"Teacher's class is not open yet. Ask your teacher, then press Try again.":"Connection problem: "+e.type))},
  wire(c){this.conn=c;
    c.on("open",()=>{this.set("on",this.role==="host"?"✓ Student connected. Teach as normal: both screens move together.":"✓ Connected to your teacher!");
      if(this.role==="guest"){this.send({t:"hello"});setTimeout(()=>this.panel.classList.remove("open"),1500)}});
    c.on("data",m=>this.recv(m));
    c.on("close",()=>{if(this.conn===c){this.conn=null;this.set(this.role==="host"?"wait":"err",this.role==="host"?"Student left. Waiting for them to open the link again…":"Disconnected. Press Try again.")}})},
  hello(){this.cfg.onHello&&this.cfg.onHello()},
  recv(m){if(!m||!m.t)return;
    if(m.t==="hello"){if(this.role==="host")this.hello();return}
    this.applying=true;try{this.cfg.onData&&this.cfg.onData(m)}catch(e){console.error(e)}finally{this.applying=false}},
  end(){try{this.conn&&this.conn.close()}catch(e){}try{this.peer&&this.peer.destroy()}catch(e){}this.conn=this.peer=null;this.role=null;this.code=null;this.set("off");
    const u=new URL(location.href);u.searchParams.delete("live");history.replaceState(null,"",u);this.draw()}
};
})();
