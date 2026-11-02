/* Phone support: App/Workbook switch on narrow screens + service worker registration. */
(function(){
const css=`@media(max-width:950px){
 body{font-size:16px}input,select,textarea{font-size:16px!important}button{min-height:38px}
 main{padding:10px!important;gap:10px!important;padding-bottom:84px!important}
 .mob-bar{position:sticky;top:0;z-index:40;display:flex;gap:6px;padding:8px 10px;background:var(--bg);border-bottom:1px solid var(--line)}
 .mob-bar button{flex:1;font-weight:600}.mob-bar button.on{background:var(--brand);color:#fff;border-color:var(--brand)}
 .scroll{max-height:none!important}.lrn-dock{bottom:10px;right:10px}.lrn-dock button{padding:9px 14px}
 header h1 small{display:none}
}
@media(max-width:600px){.env{grid-template-columns:1fr!important}}
@media(min-width:951px){.mob-bar{display:none}}
@media(max-width:950px) and (prefers-color-scheme:dark){.mob-bar button.on{color:#16181d}}`;
const st=document.createElement('style');st.textContent=css;document.head.appendChild(st);
const panels=document.querySelectorAll('main > .panel');
if(panels.length===2){
  const bar=document.createElement('div');bar.className='mob-bar';
  bar.innerHTML='<button data-p="0">1 · App to test</button><button data-p="1">2 · Workbook</button>';
  document.querySelector('header').after(bar);
  let cur=0;try{cur=+sessionStorage.getItem('mobpanel')||0}catch{}
  const show=i=>{cur=i;panels.forEach((p,k)=>{p.style.display=window.matchMedia('(max-width:950px)').matches&&k!==i?'none':''});
    bar.querySelectorAll('button').forEach((b,k)=>b.classList.toggle('on',k===i));try{sessionStorage.setItem('mobpanel',i)}catch{};window.scrollTo(0,0)};
  bar.addEventListener('click',e=>{const b=e.target.closest('button');if(b)show(+b.dataset.p)});
  window.matchMedia('(max-width:950px)').addEventListener('change',()=>show(cur));
  show(cur);
}
if('serviceWorker' in navigator&&location.protocol.startsWith('http'))navigator.serviceWorker.register('sw.js').catch(()=>{});
})();
