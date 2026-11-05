/* sheet.js: a slide-in panel (top, right, bottom, left) with a dimmed backdrop.
   SHEET.open({side,title,desc,html,actions:[{label,primary,close,onClick}],onClose}) -> close()
   Escape and a backdrop tap close it; focus stays inside; the page behind does not scroll. */
(function(){if(window.SHEET)return;
const css=`.sh-ov{position:fixed;inset:0;z-index:9995;background:#101828;opacity:0;transition:opacity .22s}.sh-ov.on{opacity:.45}
.sh{position:fixed;z-index:9996;background:#fff;color:#16202f;display:flex;flex-direction:column;box-shadow:0 0 40px #10182833;transition:transform .26s cubic-bezier(.2,.8,.2,1);font:16px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
.sh-right{top:0;right:0;bottom:0;width:min(400px,90vw);transform:translateX(105%);border-left:1px solid #d5dae2}
.sh-left{top:0;left:0;bottom:0;width:min(400px,90vw);transform:translateX(-105%);border-right:1px solid #d5dae2}
.sh-bottom{left:0;right:0;bottom:0;max-height:min(70vh,640px);transform:translateY(105%);border-top:1px solid #d5dae2;border-radius:18px 18px 0 0}
.sh-top{left:0;right:0;top:0;max-height:min(70vh,640px);transform:translateY(-105%);border-bottom:1px solid #d5dae2;border-radius:0 0 18px 18px}
.sh.on{transform:none}
.sh-grab{width:44px;height:5px;border-radius:99px;background:#c3c9d3;margin:8px auto 0}
.sh-h{padding:14px 18px 6px;display:flex;gap:10px;align-items:flex-start}.sh-h div{flex:1}.sh-t{font-weight:800;font-size:19px;margin:0}.sh-d{color:#4a5568;font-size:14.5px;margin:2px 0 0}
.sh-x{min-width:44px;min-height:44px;border:1px solid #b8c0cc;background:#fff;border-radius:10px;font:600 15px system-ui;cursor:pointer;color:#16202f}
.sh-b{padding:6px 18px 12px;overflow-y:auto;flex:1;-webkit-overflow-scrolling:touch}
.sh-f{padding:10px 18px calc(12px + env(safe-area-inset-bottom));display:flex;gap:8px;flex-wrap:wrap;border-top:1px solid #e6e9ef}
.sh-f button{flex:1 1 140px;min-height:48px;border:1px solid #b8c0cc;background:#fff;border-radius:10px;font:700 15px system-ui;cursor:pointer;color:#16202f}.sh-f button.pri{background:#c9a66e;border-color:#b38e52;color:#1d1608}
body.sh-lock{overflow:hidden}
@media (prefers-reduced-motion:reduce){.sh,.sh-ov{transition:none}}`;
const st=document.createElement('style');st.textContent=css;document.head.appendChild(st);
const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
let n=0;
window.SHEET={open(o){o=o||{};const side=['top','right','bottom','left'].includes(o.side)?o.side:'right';const id='sh'+(++n);const prev=document.activeElement;
 const ov=document.createElement('div');ov.className='sh-ov';
 const p=document.createElement('div');p.className='sh sh-'+side;p.setAttribute('role','dialog');p.setAttribute('aria-modal','true');p.setAttribute('aria-labelledby',id+'t');if(o.desc)p.setAttribute('aria-describedby',id+'d');
 p.innerHTML=(side==='bottom'?'<div class="sh-grab" aria-hidden="true"></div>':'')+`<div class="sh-h"><div><h2 class="sh-t" id="${id}t">${esc(o.title||'')}</h2>${o.desc?`<p class="sh-d" id="${id}d">${esc(o.desc)}</p>`:''}</div><button type="button" class="sh-x" data-sh="close" aria-label="Close">Close</button></div><div class="sh-b">${o.html||''}</div>`+((o.actions&&o.actions.length)?`<div class="sh-f">${o.actions.map((a,i)=>`<button type="button" data-sh="${i}" class="${a.primary?'pri':''}">${esc(a.label)}</button>`).join('')}</div>`:'');
 document.body.appendChild(ov);document.body.appendChild(p);document.body.classList.add('sh-lock');
 requestAnimationFrame(()=>requestAnimationFrame(()=>{ov.classList.add('on');p.classList.add('on')}));
 let closed=false;const close=()=>{if(closed)return;closed=true;document.removeEventListener('keydown',key,true);ov.classList.remove('on');p.classList.remove('on');setTimeout(()=>{ov.remove();p.remove();document.body.classList.remove('sh-lock')},260);prev&&prev.focus&&prev.focus();o.onClose&&o.onClose()};
 const foc=()=>[...p.querySelectorAll('button,a[href],input,select,textarea,[tabindex]:not([tabindex="-1"])')].filter(e=>!e.disabled&&e.offsetParent!==null);
 const key=e=>{if(e.key==='Escape'){e.stopPropagation();close()}else if(e.key==='Tab'){const f=foc();if(!f.length)return;const i=f.indexOf(document.activeElement);if(e.shiftKey&&(i<=0)){f[f.length-1].focus();e.preventDefault()}else if(!e.shiftKey&&i===f.length-1){f[0].focus();e.preventDefault()}}};
 document.addEventListener('keydown',key,true);ov.addEventListener('click',close);
 p.addEventListener('click',e=>{const b=e.target.closest('[data-sh]');if(!b)return;if(b.dataset.sh==='close'){close();return}const a=o.actions[+b.dataset.sh];if(a&&a.onClick)a.onClick(close);if(a&&a.close!==false)close()});
 setTimeout(()=>{const f=foc();(f.find(e=>!e.classList.contains('sh-x'))||f[0]||p).focus()},60);
 return close}}})();
