/* Black-cat mascot for the practice pages (needs mascot.css).
   Moods:  peek     – start screen / menu
           think    – question in progress, not answered yet
           sugoi    – correct answer
           confused – wrong answer
           stamp    – stamp / round finished
           sleep    – waiting (no activity for a while)
   Mascot.at(mood[,text])   → the page's one live cat, moved to wherever it is appended
   Mascot.set(mood[,text])  → change the live cat's mood
   Mascot.card(mood[,text]) → a separate, static cat (e.g. in the report box) */
(function(){
  var SRC="./assets/images/mascot/cat-{m}-256.png";
  var LINES={
    en:{peek:"Pick a game — I'll watch!",think:"Take your time…",sugoi:"すごい! Correct!",confused:"Hmm… let's look again.",stamp:"Stamp time! Well done!",sleep:"Zzz… tap when you're ready."},
    zh:{peek:"选一个游戏吧——我在看喔！",think:"慢慢想……",sugoi:"すごい！答对了！",confused:"嗯……再看一次吧。",stamp:"盖章！做得好！",sleep:"Zzz……准备好就点一下。"}
  };
  var ALT={peek:"Black cat peeking",think:"Black cat thinking",sugoi:"Black cat cheering: sugoi!",confused:"Confused black cat",stamp:"Black cat with a stamp",sleep:"Sleeping black cat"};
  var REACT_MS=1500, IDLE_MS=30000;
  var lang="en", mood="", reactedAt=0, idleTimer=null, revertTimer=null;

  /* preload so the first reaction doesn't flash */
  Object.keys(ALT).forEach(function(m){ var i=new Image(); i.src=SRC.replace("{m}",m); });

  function build(m,text){
    var box=document.createElement("div"); box.className="mascot";
    var img=document.createElement("img"); img.className="mascot-pic"; img.width=112; img.height=112;
    var say=document.createElement("p"); say.className="mascot-say";
    box.append(img,say); paint(box,m,text); return box;
  }
  function paint(box,m,text){
    var img=box.querySelector("img"),say=box.querySelector(".mascot-say");
    img.src=SRC.replace("{m}",m); img.alt=ALT[m]||"Black cat";
    say.textContent=text!=null?text:(LINES[lang]||LINES.en)[m]||"";
    box.dataset.mood=m;
  }
  var live=build("peek");
  live.setAttribute("aria-live","polite");

  function set(m,text){
    clearTimeout(revertTimer);
    if(m==="sugoi"||m==="confused"){ reactedAt=Date.now(); live.classList.remove("pop"); void live.offsetWidth; live.classList.add("pop"); }
    mood=m; paint(live,m,text); armIdle();
  }
  /* a new screen: keep a fresh reaction visible for a moment, then settle into the new mood */
  function at(m,text){
    var left=REACT_MS-(Date.now()-reactedAt);
    if((mood==="sugoi"||mood==="confused")&&left>0&&(m==="think"||m==="peek")){
      clearTimeout(revertTimer);
      revertTimer=setTimeout(function(){ if(live.isConnected) set(m,text); },left);
      armIdle(); return live;
    }
    set(m,text); return live;
  }
  /* waiting → the cat falls asleep; any activity wakes it up */
  function armIdle(){
    clearTimeout(idleTimer);
    if(mood==="think"||mood==="peek"){
      var back=mood;
      idleTimer=setTimeout(function(){ if(live.isConnected){ live.dataset.wake=back; paint(live,"sleep"); mood="sleep"; } },IDLE_MS);
    }
  }
  function wake(){
    if(mood==="sleep"&&live.dataset.wake){ set(live.dataset.wake); }
    else if(mood==="think"||mood==="peek") armIdle();
  }
  ["pointerdown","keydown"].forEach(function(ev){ window.addEventListener(ev,wake,{passive:true}); });

  window.Mascot={
    at:at, set:set,
    card:function(m,text){ return build(m,text); },
    get mood(){ return mood; },
    setLang:function(l){ if(LINES[l]&&l!==lang){ lang=l; if(mood) paint(live,mood); } }
  };
})();
