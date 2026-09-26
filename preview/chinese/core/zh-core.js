window.MLZH=(function(){
const KEY="ml.zh.settings",defaults={reading:"ruby",english:true,difficulty:"basic",scale:1};let audio=null;
function settings(){try{return Object.assign({},defaults,JSON.parse(localStorage.getItem(KEY)||"{}"))}catch(e){return {...defaults}}}
function save(v){try{localStorage.setItem(KEY,JSON.stringify(v))}catch(e){}}
function esc(s){return String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]))}
function punct(h){return /^[，。！？；：、,.!?;:“”‘’（）()…—-]+$/.test(h)}
function token(t,mode,index){
  let hz=t.hz??t[0],py=t.py??t[1]??"",role=t.role??t[2]??"";
  if(punct(hz))return '<span class="mltok punct" data-i="'+index+'">'+esc(hz)+'</span>';
  if(mode==="ruby"||mode==="pinyin")return '<ruby class="mltok" data-i="'+index+'" data-role="'+esc(role)+'"><rb>'+esc(hz)+'</rb><rt>'+esc(py)+'</rt></ruby>';
  return '<span class="mltok peekable" data-i="'+index+'" data-py="'+esc(py)+'" data-role="'+esc(role)+'">'+esc(hz)+'</span>';
}
function renderTokens(tokens,mode){
  let html="";
  tokens.forEach((t,i)=>{
    const hz=t.hz??t[0],isP=punct(hz);
    if(mode==="pinyin"&&i>0){
      const prev=tokens[i-1],phz=prev.hz??prev[0];
      if(!isP&&!punct(phz))html+='<span class="ml-ruby-gap" aria-hidden="true"></span>';
    }
    html+=token(t,mode,i);
  });
  return '<span class="ml-reading mode-'+mode+'">'+html+'</span>';
}
function wirePeek(root,cb){root.querySelectorAll(".peekable").forEach(el=>el.addEventListener("click",()=>{if(!el.dataset.py)return;el.classList.add("peeking");el.setAttribute("data-show",el.dataset.py);cb&&cb(el);setTimeout(()=>{el.classList.remove("peeking");el.removeAttribute("data-show")},2000)}))}
function player(base="/chinese/audio/linking-words/"){return{play(file,onended){if(!file){onended&&onended();return}try{if(!audio)audio=new Audio();audio.onended=onended||null;audio.onerror=()=>{audio.onended=null;onended&&onended()};audio.src=base+file;audio.play().catch(()=>{audio.onended=null;onended&&onended()})}catch(e){onended&&onended()}},preload(file){if(!file)return;try{let a=new Audio();a.preload="auto";a.src=base+file}catch(e){}}}}
return{settings,save,renderTokens,wirePeek,player};
})();