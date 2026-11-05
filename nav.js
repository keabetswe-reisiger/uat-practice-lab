/* Top menu (vanilla version of a shadcn-style NavigationMenu): dropdowns with a title + short description per item,
   a two-column grid, and an icon list. Opens on hover or click, closes on Escape / click outside. */
(()=>{
 if(window.__mm)return;window.__mm=1;
 const I={
  alert:'<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 16.5v.01"/></svg>',
  dash:'<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9" stroke-dasharray="3.2 3.2"/></svg>',
  ok:'<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="m8.5 12.3 2.5 2.5 4.5-5"/></svg>',
  x:'<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="m9.5 9.5 5 5M14.5 9.5l-5 5"/></svg>'};
 const start=[['start-here.html','Start here guide','Testing in plain words, 30 minutes, coffee examples.'],['testing-types.html','Kinds of testing','Smoke, regression, API, usability and more, with a quiz.'],['tickets.html','Your first ticket','A real test job from your “manager”: open one, do it, tick Pass or Fail.']];
 const apps=[['lab.html?app=shop','Online shop','Search, cart, discount code, shipping, checkout.'],['lab.html?app=bank','Mobile banking','Transfers, limits, OTP, history and a loan check.'],['lab.html?app=crm','Business CRM','Roles, deal stages, validation and reports.'],['lab.html?app=docs','Shared documents','Versions, sharing permissions, file limits.'],['lab.html?app=ui','Form playground','Tables, dropdowns, dates, counters, steppers.'],['lab.html?app=api','Order API console','Status codes, data and who may ask.'],['lab.html?app=a11y','Access check','Labels, keyboard order, contrast, images.'],['lab.html?app=sec','Safe login','Lockout, password rules, sessions.'],['coffee.html','Coffee ordering app','Easy start. 5 hidden bugs in a coffee-shop order screen.'],['clinic-practice.html','Clinic booking app','Roles, versions and 9 hidden bugs.'],['stockwatch-practice.html','StockWatch stock app','Counting stock, expiry dates and rounding.']];
 const skills=[['sql-lab.html#learn','SQL lessons','Learn SQL from zero, with a teaching mode that builds queries with you.'],['sql-lab.html#gym','SQL practice gym','44 extra questions in 8 sections, easy to hard.'],['api-lab.html','API testing lab','Test the “waiter” between the screen and the system.'],['arcade.html','Test arcade','Five quick games. A new round every time.'],['careful.html','Careful tester toolkit','Checklists, notes and eye-training so you catch the small stuff.'],['sql-lab.html#cases','Data Detective cases','Find 5 planted data bugs and write the bug reports.'],['autolab.html','Automation lab','Write real automated test steps and run them.'],['appbugs.html','Test this app','Report real bugs you find in the Practice Lab.'],['testcase.html','Write a test case','Write a UAT test case, lock your expected result, get marked on ten points and see the improved version.']];
 const exam=[['exam.html','Exam prep (ISTQB)','64 lessons, hundreds of practice questions, timed mock exams.'],['techniques.html','Technique trainer','Boundary values, decision tables, state transitions and more, with new numbers every time.'],['capstone.html','Final test: unseen app','Find hidden bugs in an app you have never seen.'],['interview.html','Interview practice','42 questions with model answers and key points.'],['workplace.html','Work skills','DevTools, Git, Agile, automation and test documents.'],['portfolio.html','Test portfolio','Turn your real work into a document for employers.'],['readiness.html','Readiness check','Are you ready for the exam? For a job?'],['outside.html','Practice outside the app','Real practice sites, communities and a 4-week plan.']];
 window.__mmData=[['Getting started',start],['Practice apps',apps],['Skills',skills],['Exam & career',exam]];
 let counts={prog:0,done:0,fail:0};
 try{const S=JSON.parse(localStorage.getItem('uat-tickets-v1'))||{};Object.values(S).forEach(x=>{if(!x)return;if(x.status==='In progress'||x.status==='Blocked')counts.prog++;else if(x.status==='Passed')counts.done++;else if(x.status==='Failed')counts.fail++})}catch(e){}
 const here=location.pathname.split('/').pop()||'index.html';
 const cur=h=>{const [f,hs]=h.split('#');return f===here&&(hs?('#'+hs)===location.hash:!location.hash)};
 const item=(h,t,d)=>`<li><a href="${h}" ${cur(h)?'aria-current="page"':''}><b>${t}</b><span>${d}</span></a></li>`;
 const bar=document.createElement('nav');bar.id='mm';bar.setAttribute('aria-label','Main menu');
 bar.innerHTML=`<div class="mm-in"><a class="mm-brand" href="index.html">UAT <b>Practice Lab</b></a><ul class="mm-list">
  <li class="mm-i"><button class="mm-t" aria-expanded="false" aria-controls="mm-p1">Getting started</button><div class="mm-p" id="mm-p1"><ul class="mm-col1">${start.map(x=>item(...x)).join('')}</ul></div></li>
  <li class="mm-i"><button class="mm-t" aria-expanded="false" aria-controls="mm-p2">Practice apps</button><div class="mm-p" id="mm-p2"><ul class="mm-grid">${apps.map(x=>item(...x)).join('')}</ul></div></li>
  <li class="mm-i"><button class="mm-t" aria-expanded="false" aria-controls="mm-p3">Skills</button><div class="mm-p" id="mm-p3"><ul class="mm-grid">${skills.map(x=>item(...x)).join('')}</ul></div></li>
  <li class="mm-i"><button class="mm-t" aria-expanded="false" aria-controls="mm-p4">Exam &amp; career</button><div class="mm-p" id="mm-p4"><ul class="mm-grid">${exam.map(x=>item(...x)).join('')}</ul></div></li>
  <li class="mm-i"><button class="mm-t" aria-expanded="false" aria-controls="mm-p5">My work</button><div class="mm-p" id="mm-p5"><ul class="mm-ico">
    <li><a href="tickets.html">${I.dash}To do</a></li><li><a href="tickets.html">${I.alert}In progress<em>${counts.prog}</em></a></li><li><a href="tickets.html">${I.ok}Passed<em>${counts.done}</em></a></li><li><a href="tickets.html">${I.x}Failed<em>${counts.fail}</em></a></li></ul></div></li>
  <li class="mm-i"><a class="mm-t mm-link" href="index.html">Home</a></li></ul></div>`;
 const css=document.createElement('style');css.textContent=`
 #mm{position:sticky;top:0;z-index:60;border-bottom:1px solid #d5dae2;background:#ffffff;font-family:Manrope,system-ui,sans-serif}
 #mm .mm-in{display:flex;align-items:center;gap:18px;padding:6px clamp(16px,3vw,64px);flex-wrap:wrap}
 #mm .mm-brand{color:#16202f;text-decoration:none;font-weight:500;font-size:14px;margin-right:6px}#mm .mm-brand b{color:#7a5a1e}
 #mm ul{list-style:none;margin:0;padding:0}#mm .mm-list{display:flex;gap:2px;flex-wrap:wrap}
 #mm .mm-i{position:relative}
 #mm .mm-t{background:transparent!important;border:0!important;color:#16202f!important;font:600 14px Manrope,system-ui,sans-serif;padding:9px 13px;border-radius:8px;cursor:pointer;text-decoration:none;display:inline-flex;align-items:center;gap:6px}
 #mm button.mm-t::after{content:"";width:6px;height:6px;border-right:2px solid currentColor;border-bottom:2px solid currentColor;transform:rotate(45deg) translateY(-2px);opacity:.7;transition:transform .15s}
 #mm .mm-t:hover,#mm .mm-t[aria-expanded=true]{background:#f1f3f6!important;color:#7a5a1e!important}#mm button.mm-t[aria-expanded=true]::after{transform:rotate(225deg)}
 #mm .mm-t:focus-visible,#mm a:focus-visible{outline:2px solid #7a5a1e;outline-offset:2px}
 #mm .mm-p{display:none;position:absolute;top:calc(100% + 8px);left:0;background:#fff;border:1px solid #d5dae2;border-radius:12px;padding:8px;box-shadow:0 14px 40px #1018282e}
 #mm .mm-p.on{display:block}
 #mm .mm-col1{width:min(380px,86vw)}#mm .mm-grid{display:grid;grid-template-columns:1fr 1fr;width:min(660px,92vw);gap:2px}#mm .mm-ico{width:210px}
 #mm .mm-p a{display:flex;flex-direction:column;gap:3px;padding:10px 12px;border-radius:8px;color:#16202f;text-decoration:none}
 #mm .mm-p a b{font-size:14px;font-weight:600}#mm .mm-p a span{font-size:12.5px;line-height:1.35;color:#4a5568}
 #mm .mm-p a:hover,#mm .mm-p a[aria-current]{background:#f1f3f6}
 #mm .mm-ico a{flex-direction:row;align-items:center;gap:10px;font-size:14px}#mm .mm-ico em{margin-left:auto;font-style:normal;font:600 12px 'Geist Mono',monospace;background:#eef1f5;border-radius:99px;padding:1px 8px;color:#3b4658}
 @media(max-width:700px){#mm .mm-in{gap:2px;flex-wrap:nowrap;overflow-x:auto;padding:2px 8px;scrollbar-width:none}#mm .mm-in::-webkit-scrollbar{display:none}#mm .mm-brand{display:none}#mm .mm-list{flex-wrap:nowrap}#mm .mm-i{position:static}#mm .mm-t{padding:10px 10px;white-space:nowrap}#mm .mm-p{position:fixed;left:10px;right:10px;top:var(--mmh,46px);max-height:72vh;overflow:auto;margin-top:4px}#mm .mm-grid{grid-template-columns:1fr;width:auto}#mm .mm-col1,#mm .mm-ico{width:auto}#mm .an-all{display:none}}
 @media print{#mm{display:none}}`;
 document.head.appendChild(css);
 const hd=document.querySelector('header');(hd&&hd.parentNode===document.body?hd.after(bar):document.body.prepend(bar));
  const setH=()=>{const sb=document.getElementById('sbbar');document.documentElement.style.setProperty('--mmh',(bar.offsetHeight||(sb?sb.offsetHeight:0))+'px')};setH();window.addEventListener('resize',setH);if(window.ResizeObserver)new ResizeObserver(setH).observe(bar);
 const panels=()=>[...bar.querySelectorAll('.mm-p')],trig=()=>[...bar.querySelectorAll('button.mm-t')];
 const closeAll=()=>{panels().forEach(p=>p.classList.remove('on'));trig().forEach(b=>b.setAttribute('aria-expanded','false'))};
 const open=b=>{closeAll();trig().forEach(x=>{if(x!==b)x.dataset.pin=''});b.setAttribute('aria-expanded','true');document.getElementById(b.getAttribute('aria-controls')).classList.add('on')};
 bar.querySelectorAll('.mm-i').forEach(li=>{const b=li.querySelector('button.mm-t');if(!b)return;
  b.addEventListener('click',()=>{if(b.getAttribute('aria-expanded')==='true'&&b.dataset.pin==='1'){closeAll();b.dataset.pin=''}else{open(b);b.dataset.pin='1'}});
  });
 document.addEventListener('click',e=>{if(!bar.contains(e.target))closeAll()});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'){const o=trig().find(b=>b.getAttribute('aria-expanded')==='true');closeAll();o&&o.focus()}});
})();
/* phone bottom bar: the main places, in thumb reach */
(function(){const here=location.pathname.split('/').pop()||'index.html';
 const it=[['index.html','Home'],['lab.html','Apps'],['exam.html','Exam'],['tickets.html','Tickets']];
 const bn=document.createElement('nav');bn.id='bn';bn.setAttribute('aria-label','Quick links');
 bn.innerHTML=it.map(([h,l])=>`<a href="${h}"${(h===here||(h==='index.html'&&here===''))?' aria-current="page"':''}>${l}</a>`).join('')+'<button type="button" data-bn="menu" aria-label="Open the full menu">Menu</button>';
 const st=document.createElement('style');st.textContent=`#bn{display:none}@media(max-width:700px){#bn{display:flex;position:fixed;left:0;right:0;bottom:0;margin:0!important;width:auto!important;max-width:none!important;z-index:9985;background:#fff;border-top:1px solid #d5dae2;padding:4px 6px calc(4px + env(safe-area-inset-bottom));gap:4px}#bn a,#bn button{flex:1;min-height:48px;display:flex;align-items:center;justify-content:center;font:600 13.5px system-ui,sans-serif;color:#16202f;text-decoration:none;border:0;background:transparent;border-radius:10px}#bn a[aria-current=page]{background:#c9a66e;color:#1d1608}#bn button{border:1px solid #d5dae2}}`;
 document.head.appendChild(st);document.body.appendChild(bn);
 bn.addEventListener('click',e=>{const b=e.target.closest('[data-bn=menu]');if(!b)return;e.stopPropagation();const t=document.querySelector('#mm .mm-t');if(t){window.scrollTo({top:0});t.click()}})})();

/* phone sidebar: on phones the pages live in a slide-in sidebar, and you choose what is in it */
(function(){const D=window.__mmData;const mm=document.getElementById('mm');if(!D||!mm)return;
 const KEY='sidebar-v1';
 const EXTRA=[['index.html','Home'],['lab.html','All practice apps'],['tickets.html','Tickets'],['readiness.html','Readiness'],['portfolio.html','Portfolio'],['outside.html','Practice outside the app'],['workplace.html','Work skills']];
 const seen=new Set();const SEC=[['Quick links',EXTRA]].concat(D.map(([s,it])=>[s,it.map(x=>[x[0],x[1]])])).map(([s,it])=>[s,it.filter(x=>{if(seen.has(x[0]))return false;seen.add(x[0]);return true})]).filter(s=>s[1].length);
 const ALL=[].concat(...SEC.map(s=>s[1]));const known=new Set(ALL.map(x=>x[0]));
 const DEF=['index.html','lab.html','exam.html','tickets.html','testcase.html','autolab.html','sql-lab.html#learn','readiness.html','portfolio.html'].filter(h=>known.has(h));
 const load=()=>{try{const s=JSON.parse(localStorage.getItem(KEY));if(s&&Array.isArray(s.items))return s.items.filter(h=>known.has(h))}catch{}return DEF.slice()};
 let chosen=load();const save=()=>{try{localStorage.setItem(KEY,JSON.stringify({items:chosen,ts:Date.now()}))}catch{}};
 const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
 const here=location.pathname.split('/').pop()||'index.html';
 const isCur=h=>{const [p,hs]=h.split('#');const [f,q]=p.split('?');if(f!==here)return false;if(q&&!location.search.includes(q))return false;if(hs)return location.hash==='#'+hs;return !(ALL.some(x=>x[0]!==h&&x[0].split('#')[0].split('?')[0]===f&&x[0].includes('#')&&location.hash==='#'+x[0].split('#')[1]))};
 const bar=document.createElement('div');bar.id='sbbar';
 bar.innerHTML='<button type="button" data-sb="open" aria-haspopup="dialog" aria-label="Open the sidebar"><span class="sb-ham" aria-hidden="true"><i></i><i></i><i></i></span>Menu</button><span class="sb-t"></span>';
 const setT=()=>{bar.querySelector('.sb-t').textContent=(document.title||'').replace(/\s*[-|:].*$/,'')||'UAT Practice Lab'};setT();
 const st=document.createElement('style');st.textContent=`#sbbar{display:none}@media(max-width:700px){#mm,#bn{display:none!important}#sbbar{display:flex;align-items:center;gap:8px;position:sticky;top:0;z-index:9989;background:#fff;border-bottom:1px solid #d5dae2;padding:4px 10px 4px 8px}#sbbar button{min-height:48px;display:inline-flex;align-items:center;gap:10px;padding:0 14px;font-weight:700}.sb-ham{display:inline-flex;flex-direction:column;gap:4px}.sb-ham i{display:block;width:18px;height:2px;border-radius:2px;background:#16202f}#sbbar .sb-t{flex:1;min-width:0;font-weight:700;font-size:15px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:#16202f}}
.sb-l{list-style:none;margin:0;padding:0}.sb-l li{margin:0}.sb-l a{display:flex;align-items:center;min-height:52px;padding:0 12px;border-radius:10px;color:#16202f;text-decoration:none;font-weight:600;font-size:16px}.sb-l a[aria-current=page]{background:#c9a66e;color:#1d1608;font-weight:800}.sb-l a:active{background:#f3f4f6}
.sb-e fieldset{border:0;padding:0;margin:0 0 10px}.sb-e legend{font:600 12px 'Geist Mono',ui-monospace,monospace;letter-spacing:.12em;text-transform:uppercase;color:#4a5568;padding:8px 0 2px}.sb-e label{display:flex;align-items:center;gap:12px;min-height:48px;padding:0 6px;font-size:16px;font-weight:600}.sb-e input[type=checkbox]{width:24px;height:24px;flex:none;accent-color:#7a5a1e}
.sb-row{display:flex;gap:8px;flex-wrap:wrap;margin:10px 0 4px}.sb-row button{flex:1 1 130px;min-height:48px}.sb-n{color:#4a5568;font-size:14.5px;margin:8px 0}`;
 document.head.appendChild(st);mm.after(bar);
 let mode='list';
 const listView=()=>{const its=ALL.filter(x=>chosen.includes(x[0]));return (its.length?`<nav aria-label="Your sidebar"><ul class="sb-l">${its.map(([h,t])=>`<li><a href="${h}"${isCur(h)?' aria-current="page"':''}>${esc(t)}</a></li>`).join('')}</ul></nav>`:'<p class="sb-n">Nothing is chosen yet. Press the button below and tick the pages you want here.</p>')+`<div class="sb-row"><button type="button" class="pri" data-sb="edit">Choose what shows here</button></div><p class="sb-n">${its.length} of ${ALL.length} pages shown. Only you see this, and it is saved on this phone.</p>`};
 const editView=()=>`<div class="sb-e"><p class="sb-n">Tick the pages you want in your sidebar.</p>${SEC.map(([s,it],i)=>`<fieldset><legend>${esc(s)}</legend>${it.map(([h,t])=>`<label><input type="checkbox" value="${esc(h)}" ${chosen.includes(h)?'checked':''}>${esc(t)}</label>`).join('')}</fieldset>`).join('')}<div class="sb-row"><button type="button" class="pri" data-sb="save">Save sidebar</button><button type="button" data-sb="cancel">Cancel</button></div><div class="sb-row"><button type="button" data-sb="all">Tick all</button><button type="button" data-sb="none">Clear all</button><button type="button" data-sb="reset">Reset to default</button></div></div>`;
 const paint=()=>{const b=document.querySelector('.sh-b'),t=document.querySelector('.sh-t'),d=document.querySelector('.sh-d');if(!b)return;b.innerHTML=mode==='edit'?editView():listView();if(t)t.textContent=mode==='edit'?'Choose your sidebar':'Your sidebar';if(d)d.textContent=mode==='edit'?'You decide which pages appear here.':'Your pages, one tap away.';b.scrollTop=0;const f=b.querySelector(mode==='edit'?'input':'a,button');f&&f.focus()};
 const ensure=()=>window.SHEET?Promise.resolve():new Promise((ok,no)=>{const s=document.createElement('script');s.src='sheet.js';s.onload=ok;s.onerror=no;document.head.appendChild(s)});
 const open=()=>ensure().then(()=>{mode='list';SHEET.open({side:'left',title:'Your sidebar',desc:'Your pages, one tap away.',html:listView()})}).catch(()=>{location.href='index.html'});
 const read=()=>[...document.querySelectorAll('.sb-e input[type=checkbox]')].filter(c=>c.checked).map(c=>c.value);
 document.addEventListener('click',e=>{const b=e.target.closest('[data-sb]');if(!b)return;const a=b.dataset.sb;
  if(a==='open'){open();return}
  if(!b.closest('.sh'))return;
  if(a==='edit'){mode='edit';paint()}
  else if(a==='save'){chosen=ALL.map(x=>x[0]).filter(h=>read().includes(h));save();mode='list';paint()}
  else if(a==='cancel'){mode='list';paint()}
  else if(a==='all'||a==='none'){document.querySelectorAll('.sb-e input[type=checkbox]').forEach(c=>c.checked=a==='all')}
  else if(a==='reset'){document.querySelectorAll('.sb-e input[type=checkbox]').forEach(c=>c.checked=DEF.includes(c.value))}});
 window.addEventListener('hashchange',setT);
 window.__sidebar={all:()=>ALL.map(x=>x[0]),chosen:()=>chosen.slice(),def:DEF.slice()};
})();

/* breadcrumbs: Home > section > this page. The section is a dropdown of its other pages; on phones it shows as "..." */
(function(){const D=window.__mmData;const mm=document.getElementById('mm');if(!D||!mm)return;
 const here=location.pathname.split('/').pop()||'index.html';if(here==='index.html')return;
 const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
 const match=(h)=>{const [p,hs]=h.split('#');const [f,q]=p.split('?');if(f!==here)return 0;let s=1;if(q){if(!location.search.includes(q))return 0;s+=2}if(hs){if(location.hash==='#'+hs)s+=2;else if(location.hash)return 0}return s};
 function build(){const old=document.getElementById('crumbs');if(old)old.remove();let best=null;D.forEach(([sec,items])=>items.forEach(it=>{const s=match(it[0]);if(s&&(!best||s>best.s))best={s,sec,items,it}}));
 if(!best)return;
 const nav=document.createElement('nav');nav.id='crumbs';nav.setAttribute('aria-label','Breadcrumb');
 const cur=h=>match(h)===best.s&&h===best.it[0];
 nav.innerHTML=`<ol><li><a href="index.html">Home</a></li><li class="cr-mid"><button type="button" class="cr-t" aria-expanded="false" aria-haspopup="true" aria-controls="cr-p"><span class="cr-full">${esc(best.sec)}</span><span class="cr-dots" aria-hidden="true">&hellip;</span><span class="cr-sr">Show the pages in ${esc(best.sec)}</span></button><ul id="cr-p" hidden>${best.items.map(([h,t])=>`<li><a href="${h}"${cur(h)?' aria-current="page"':''}>${esc(t)}</a></li>`).join('')}</ul></li><li><span aria-current="page">${esc(best.it[1])}</span></li></ol>`;
 if(!document.getElementById('crumbs-css')){const st=document.createElement('style');st.id='crumbs-css';st.textContent=`#crumbs{border-bottom:1px solid #d5dae2;background:#fff;padding:2px 12px;font:14px system-ui,sans-serif}#crumbs ol{list-style:none;margin:0;padding:0;display:flex;align-items:center;flex-wrap:wrap;gap:0}#crumbs li{display:flex;align-items:center;position:relative}#crumbs li+li::before{content:"\\203A";color:#6b7380;padding:0 6px;font-size:18px}#crumbs a,#crumbs .cr-t,#crumbs [aria-current=page]{min-height:44px;display:inline-flex;align-items:center;padding:0 6px;color:#16202f;text-decoration:none;font:inherit}#crumbs a:hover,#crumbs .cr-t:hover{text-decoration:underline}#crumbs [aria-current=page]{font-weight:700}#crumbs .cr-t{border:0;background:transparent;cursor:pointer;gap:4px}#crumbs .cr-t::after{content:"\\25BE";font-size:11px;color:#6b7380}#crumbs .cr-dots{display:none;font-size:20px;line-height:1}#crumbs .cr-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}#cr-p{position:absolute;top:100%;left:0;z-index:9990;min-width:220px;max-width:calc(100vw - 24px);margin:0;padding:6px;list-style:none;background:#fff;border:1px solid #d5dae2;border-radius:12px;box-shadow:0 10px 30px #10182822}#cr-p[hidden]{display:none}#cr-p li{display:block}#cr-p li::before{content:none!important}#cr-p a{display:flex;border-radius:8px;width:100%}#cr-p a:hover{background:#f3f4f6;text-decoration:none}#cr-p a[aria-current=page]{background:#c9a66e;color:#1d1608;font-weight:700}@media(max-width:700px){#crumbs .cr-full{display:none}#crumbs .cr-dots{display:inline}#crumbs .cr-t{min-width:48px;justify-content:center}#crumbs .cr-t::after{content:none}#crumbs{padding:0 8px}#crumbs [aria-current=page]{max-width:60vw;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}}`;
 document.head.appendChild(st)}(document.getElementById('sbbar')||mm).after(nav);
 const t=nav.querySelector('.cr-t'),p=nav.querySelector('#cr-p');
 const open=o=>{p.hidden=!o;t.setAttribute('aria-expanded',String(o));if(o){const a=p.querySelector('a');a&&a.focus()}};
 t.addEventListener('click',e=>{e.stopPropagation();open(p.hidden)});
 document.addEventListener('click',e=>{if(nav.isConnected&&!p.hidden&&!nav.contains(e.target))open(false)});
 nav.addEventListener('keydown',e=>{if(e.key==='Escape'&&!p.hidden){open(false);t.focus()}else if((e.key==='ArrowDown'||e.key==='ArrowUp')&&!p.hidden){const a=[...p.querySelectorAll('a')];const i=a.indexOf(document.activeElement);const j=e.key==='ArrowDown'?(i+1)%a.length:(i-1+a.length)%a.length;a[j].focus();e.preventDefault()}});}
 build();
 window.addEventListener('hashchange',build);
})();
