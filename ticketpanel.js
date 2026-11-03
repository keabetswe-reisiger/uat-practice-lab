/* ticketpanel.js: a docked "Your ticket" panel beside the app you are testing.
   Shows the ticket linked to this page (steps with reasons, expected result, criteria) and lets you record the result
   without leaving the app. It reads and writes the same progress as the ticket board. */
(function(){
 const page=(location.pathname.split('/').pop()||'')+location.search;
 const T=(window.TICKETS||[]).filter(t=>t.app===page);if(!T.length)return;
 const TE=window.TEACH||{};
 const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
 const rd=k=>{try{return JSON.parse(localStorage.getItem(k))||{}}catch{return{}}};
 const wr=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch{}};
 const now=()=>new Date().toLocaleString('en-ZA',{dateStyle:'medium',timeStyle:'short'});
 let S=rd('uat-tickets-v1');const P=rd('ticketpanel-v1');P.sel=P.sel||{};
 const st=k=>S[k]||(S[k]={status:'Open',actual:'',sev:'Major',notes:[],crit:{},log:[],time:'',own:''});
 const saveT=()=>wr('uat-tickets-v1',S),saveP=()=>wr('ticketpanel-v1',P);
 if(P.force&&P.force.page===page){P.open=true;P.sel[page]=P.force.key;delete P.force;saveP()}
 const order=[...T].sort((a,b)=>{const r=s=>s==='In progress'?0:s==='Open'?1:s==='Blocked'?2:3;return r(st(a.key).status)-r(st(b.key).status)||a.key.localeCompare(b.key)});
 const cur=()=>T.find(t=>t.key===P.sel[page])||order[0];
 const W=380;let box,tab;
 const css=document.createElement('style');css.textContent=`
 #tp-tab{position:fixed;right:0;top:42%;z-index:9980;writing-mode:vertical-rl;background:#c9a66e;color:#1d1608;border:1px solid #b38e52;border-right:0;border-radius:10px 0 0 10px;padding:12px 6px;font:700 13px Manrope,system-ui,sans-serif;cursor:pointer;box-shadow:-2px 2px 10px #1018282e}
 #tp{position:fixed;right:0;top:0;bottom:0;width:min(${W}px,100vw);z-index:9980;background:#fff;color:#16202f;border-left:1px solid #d5dae2;box-shadow:-6px 0 24px #1018281f;overflow:auto;padding:12px 14px;font:15px/1.5 Manrope,system-ui,sans-serif;display:none}
 #tp.on{display:block}#tp h3{margin:12px 0 4px;font-size:13px;letter-spacing:.08em;text-transform:uppercase;color:#4a5568!important;font-family:'Geist Mono',monospace!important}#tp h2{font-size:17px;margin:4px 0}
 #tp .why{border-left:3px solid #b38e52;background:#c9a66e24;padding:6px 10px;border-radius:4px;margin:6px 0}#tp ol{margin:4px 0 4px 18px;padding:0}#tp li{margin-bottom:6px}#tp .sw{font-size:13px;color:#4a5568}
 #tp .row{display:flex;gap:6px;flex-wrap:wrap;align-items:center}#tp .chip{font:12px 'Geist Mono',monospace;background:#eef1f5;border:1px solid #d5dae2;border-radius:99px;padding:1px 9px;color:#3b4658}
 #tp textarea,#tp select{width:100%;font:inherit;border:1px solid #b8c0cc;border-radius:8px;padding:6px 8px;background:#fff;color:#16202f}#tp label.cb{display:flex;gap:8px;align-items:flex-start;margin:4px 0;cursor:pointer}
 #tp button{font:inherit;font-weight:600;cursor:pointer;border:1px solid #b8c0cc;background:#fff;color:#16202f;border-radius:8px;padding:6px 12px}#tp button.ok{background:#11663f;color:#fff;border-color:#11663f}#tp button.no{background:#b42318;color:#fff;border-color:#b42318}#tp button.go{background:#c9a66e;border-color:#b38e52;color:#1d1608}
 #tp details{border:1px dashed #d5dae2;border-radius:8px;padding:4px 8px;margin-top:8px}#tp summary{cursor:pointer;font-weight:600}@media print{#tp,#tp-tab{display:none}}`;
 document.head.appendChild(css);
 function html(){const t=cur(),x=st(t.key),w=TE[t.key]||{};const done=t.criteria.filter((_,i)=>x.crit[i]).length;
  return `<div class="row" style="justify-content:space-between"><b>Your ticket</b><button data-tp="close">Close</button></div>
  ${T.length>1?`<select data-tp="sel" aria-label="Choose a ticket">${order.map(o=>`<option value="${o.key}" ${o.key===t.key?'selected':''}>${o.key} · ${esc(o.title.slice(0,46))} (${st(o.key).status})</option>`).join('')}</select>`:''}
  <h2>${esc(t.key)}: ${esc(t.title)}</h2><div class="row"><span class="chip">${esc(t.priority)}</span><span class="chip">${esc(t.type)}</span><span class="chip">${esc(x.status)}</span><span class="chip">${esc(t.est)}</span></div>
  ${x.status==='Open'?`<div style="margin-top:8px"><button class="go" data-tp="start">Start testing</button></div>`:''}
  ${w.testing?`<h3>What you are testing</h3><div class="why">${esc(w.testing)}</div><details><summary>Why it matters</summary><p style="margin:6px 0">${esc(w.risk||'')}</p></details>`:`<div class="why">${esc(t.summary)}</div>`}
  <h3>Steps</h3><ol>${t.steps.map((s,i)=>`<li>${esc(s)}${w.stepwhy&&w.stepwhy[i]?`<div class="sw">Why: ${esc(w.stepwhy[i])}</div>`:''}</li>`).join('')}</ol>
  <h3>Expected result</h3><div>${esc(t.expected)}</div>
  <h3>Acceptance criteria (${done}/${t.criteria.length})</h3>${t.criteria.map((c,i)=>`<label class="cb"><input type="checkbox" data-tp-crit="${i}" ${x.crit[i]?'checked':''}> <span>${esc(c)}</span></label>`).join('')}
  ${w.decide?`<details><summary>How to decide: Pass or Fail?</summary><p style="margin:6px 0">${w.decide}</p></details>`:''}
  <h3>Your result</h3><textarea rows="3" data-tp-f="actual" placeholder="What exactly did you see?">${esc(x.actual)}</textarea>
  <div class="row" style="margin-top:6px"><select data-tp-f="sev" style="width:auto">${['Critical','Major','Minor'].map(s=>`<option ${x.sev===s?'selected':''}>${s}</option>`).join('')}</select><span style="color:#4a5568;font-size:13px">severity if it fails</span></div>
  <div class="row" style="margin-top:8px"><button class="ok" data-tp-st="Passed">Pass</button><button class="no" data-tp-st="Failed">Fail</button><button data-tp-st="Blocked">Blocked</button></div>
  <div style="margin-top:10px"><a href="tickets.html#${t.key}" style="color:#7a5a1e;font-weight:600">Open the full ticket</a></div>`}
 const setStatus=(t,s)=>{const x=st(t.key);if(s==='Failed'&&!String(x.actual).trim()){alert('Write the actual result first: what exactly did you see?');return}x.status=s;x.log.unshift(now()+' · Status changed to '+s);saveT()};
 function apply(){const on=!!P.open;box.classList.toggle('on',on);tab.style.display=on?'none':'block';document.body.style.paddingRight=(on&&innerWidth>=1250)?W+'px':'';if(on)box.innerHTML=html()}
 function mount(){tab=document.createElement('button');tab.id='tp-tab';tab.type='button';tab.textContent='Your ticket';box=document.createElement('aside');box.id='tp';box.setAttribute('aria-label','Your ticket');document.body.appendChild(tab);document.body.appendChild(box);
  tab.addEventListener('click',()=>{S=rd('uat-tickets-v1');P.open=true;saveP();apply()});
  box.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;const d=b.dataset;const t=cur();
   if(d.tp==='close'){P.open=false;saveP();apply();return}
   if(d.tp==='start'){const x=st(t.key);x.status='In progress';x.log.unshift(now()+' · Started testing');saveT();apply();return}
   if(d.tpSt){const f=box.querySelector('[data-tp-f=actual]');if(f)st(t.key).actual=f.value;setStatus(t,d.tpSt);apply()}});
  box.addEventListener('change',e=>{const t=cur(),d=e.target.dataset;
   if(d.tp==='sel'){P.sel[page]=e.target.value;saveP();apply();return}
   if(d.tpCrit!==undefined){st(t.key).crit[d.tpCrit]=e.target.checked;saveT();apply();return}
   if(d.tpF){st(t.key)[d.tpF]=e.target.value;saveT()}});
  box.addEventListener('input',e=>{const d=e.target.dataset;if(d.tpF){st(cur().key)[d.tpF]=e.target.value;saveT()}});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&P.open&&!document.getElementById('ov')&&!document.querySelector('.lk-ov')){/* keep panel: Escape is used by drawers */}});
  window.addEventListener('resize',apply);apply()}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount);else mount();
 window.TICKETPANEL={cur,P,apply};
})();
