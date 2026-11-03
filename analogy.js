/* analogy.js: coffee analogies stay out of the way until you need them.
   Every coffee analogy on every page becomes a small "Coffee analogy" button. Press it when a test or an idea is unclear.
   Works on content that is drawn later too (lessons, tickets, quizzes). A switch in the menu bar can show them all. */
(function(){
 const KEY='analogy-v1';let S;try{S=JSON.parse(localStorage.getItem(KEY))||{}}catch{S={}}
 const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(S))}catch{}};
 let OPEN;try{OPEN=new Set(JSON.parse(sessionStorage.getItem('analogy-open')||'[]'))}catch{OPEN=new Set()}
 const keep=()=>{try{sessionStorage.setItem('analogy-open',JSON.stringify([...OPEN].slice(-200)))}catch{}};
 const H=s=>{let h=5381;for(const c of s)h=((h<<5)+h+c.charCodeAt(0))>>>0;return String(h)};
 const css=document.createElement('style');css.textContent=`
 .an{margin:8px 0}.an-b{font:600 13px Manrope,system-ui,sans-serif;cursor:pointer;background:#fff;color:#7a5a1e;border:1px solid #b38e52;border-radius:99px;padding:4px 12px}.an-b:hover{background:#c9a66e33}.an-b:focus-visible{outline:2px solid #7a5a1e;outline-offset:2px}
 .an .an-t{display:none!important;margin-top:6px}.an.open .an-t{display:block!important}.an-all{font:600 12.5px Manrope,system-ui,sans-serif;cursor:pointer;background:#fff;color:#16202f;border:1px solid #b8c0cc;border-radius:8px;padding:5px 10px;margin-left:auto}.an-all[aria-pressed=true]{background:#c9a66e;border-color:#b38e52;color:#1d1608}
 @media print{.an-b,.an-all{display:none}.an .an-t{display:block!important}}`;
 document.head.appendChild(css);
 const LABEL=/^\s*coffee( analogy| version)?\s*:/i;
 function isAnalogy(el){if(el.closest('.an-t')||el.dataset.an)return false;const t=(el.textContent||'').trim();if(!t)return false;
  if(el.classList.contains('cof'))return true;
  if(t.length>900)return false;return LABEL.test(t)&&el.querySelector('.an,.an-t')===null}
 function wrap(el){el.dataset.an='1';const txt=(el.textContent||'').trim();const id=H(txt);
  /* a label like "Coffee analogy" sitting just above the box is replaced by the button itself */
  const prev=el.previousElementSibling;if(prev&&/^coffee analogy$/i.test((prev.textContent||'').trim())&&prev.children.length===0){prev.style.display='none'}
  const w=document.createElement('div');w.className='an';w.dataset.id=id;const b=document.createElement('button');b.type='button';b.className='an-b';b.setAttribute('aria-expanded','false');b.textContent='Coffee analogy';
  el.parentNode.insertBefore(w,el);w.appendChild(b);w.appendChild(el);el.classList.add('an-t');
  if(S.all||OPEN.has(id))setOpen(w,true,false)}
 function setOpen(w,on,remember=true){w.classList.toggle('open',on);const b=w.querySelector('.an-b');b.setAttribute('aria-expanded',on?'true':'false');b.textContent=on?'Hide coffee analogy':'Coffee analogy';if(remember){on?OPEN.add(w.dataset.id):OPEN.delete(w.dataset.id);keep()}}
 let busy=false,mo=null,raf=0;
 function run(){if(busy)return;busy=true;if(mo)mo.disconnect();try{document.querySelectorAll('.cof,.tip,.spec,.t,p,.ex,li').forEach(el=>{if(isAnalogy(el))wrap(el)});ensureSwitch()}finally{busy=false;if(mo)mo.observe(document.body,{childList:true,subtree:true})}}
 function ensureSwitch(){const bar=document.querySelector('#mm .mm-in');if(!bar||bar.querySelector('.an-all'))return;const b=document.createElement('button');b.type='button';b.className='an-all';b.setAttribute('aria-pressed',S.all?'true':'false');b.textContent=S.all?'Coffee analogies: shown':'Coffee analogies: on request';b.title='Show or hide every coffee analogy';bar.appendChild(b)}
 document.addEventListener('click',e=>{const b=e.target.closest('.an-b');if(b){const w=b.closest('.an');setOpen(w,!w.classList.contains('open'));return}
  const a=e.target.closest('.an-all');if(a){S.all=!S.all;save();a.setAttribute('aria-pressed',S.all?'true':'false');a.textContent=S.all?'Coffee analogies: shown':'Coffee analogies: on request';document.querySelectorAll('.an').forEach(w=>setOpen(w,S.all,false))}});
 mo=new MutationObserver(()=>{if(busy)return;cancelAnimationFrame(raf);raf=requestAnimationFrame(run)});
 function start(){run();mo.observe(document.body,{childList:true,subtree:true})}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
 window.ANALOGY={run,S:()=>S};
})();
