/* Mobile menu for .site-nav — adds a Menu button on small screens.
   Without this script the links simply wrap (see cosmic.css). */
(function(){
  var nav=document.querySelector(".site-nav"),links=nav&&nav.querySelector(".nav-links");
  if(!nav||!links)return;
  document.documentElement.classList.add("js-nav");
  links.id=links.id||"site-menu";
  var b=document.createElement("button");
  b.type="button";b.className="nav-toggle";
  b.setAttribute("aria-controls",links.id);b.setAttribute("aria-expanded","false");
  b.innerHTML='<span aria-hidden="true">☰</span> Menu';
  nav.insertBefore(b,links);
  function set(open){nav.classList.toggle("open",open);b.setAttribute("aria-expanded",open?"true":"false");b.innerHTML=open?'<span aria-hidden="true">✕</span> Close':'<span aria-hidden="true">☰</span> Menu'}
  b.addEventListener("click",function(){set(!nav.classList.contains("open"))});
  links.addEventListener("click",function(e){if(e.target.closest("a"))set(false)});
  document.addEventListener("keydown",function(e){if(e.key==="Escape"&&nav.classList.contains("open")){set(false);b.focus()}});
  document.addEventListener("click",function(e){if(nav.classList.contains("open")&&!nav.contains(e.target))set(false)});
})();
