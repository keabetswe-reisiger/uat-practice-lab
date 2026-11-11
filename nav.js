/* Fonts load after the page has finished, so a slow font server can never hold the page up (the system font shows until then). */
(function(){var u='https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Geist+Mono:wght@400;500;600&display=swap';function add(){if(document.getElementById('uat-fonts'))return;var l=document.createElement('link');l.id='uat-fonts';l.rel='stylesheet';l.href=u;document.head.appendChild(l)}if(document.readyState==='complete')setTimeout(add,0);else addEventListener('load',function(){setTimeout(add,0)})})();
/* Top menu (vanilla version of a shadcn-style NavigationMenu): dropdowns with a title + short description per item,
   a two-column grid, and an icon list. Opens on hover or click, closes on Escape / click outside. */
(()=>{
 if(window.__mm)return;window.__mm=1;
 const I={
  alert:'<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 16.5v.01"/></svg>',
  dash:'<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9" stroke-dasharray="3.2 3.2"/></svg>',
  ok:'<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="m8.5 12.3 2.5 2.5 4.5-5"/></svg>',
  x:'<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="m9.5 9.5 5 5M14.5 9.5l-5 5"/></svg>'};
 const start=[['uatlab.html','UAT Lab','Your four stages as progress charts, with the suggested path.'],['start-here.html','Start here guide','Testing in plain words, 30 minutes, coffee examples.'],['testing-types.html','Kinds of testing','Smoke, regression, API, usability and more, with a quiz.'],['tickets.html','Your first ticket','A real test job from your “manager”: open one, do it, tick Pass or Fail.']];
 const apps=[['lab.html?app=shop','Online shop','Search, cart, discount code, shipping, checkout.'],['lab.html?app=bank','Mobile banking','Transfers, limits, OTP, history and a loan check.'],['lab.html?app=crm','Business CRM','Roles, deal stages, validation and reports.'],['lab.html?app=docs','Shared documents','Versions, sharing permissions, file limits.'],['lab.html?app=ui','Form playground','Tables, dropdowns, dates, counters, steppers.'],['lab.html?app=api','Order API console','Status codes, data and who may ask.'],['lab.html?app=a11y','Access check','Labels, keyboard order, contrast, images.'],['lab.html?app=sec','Safe login','Lockout, password rules, sessions.'],['lab.html?app=booking','Table booking','Dates, party sizes, deposits, cut-offs.'],['lab.html?app=payroll','Staff payroll','Overtime, UIF, tax brackets, rounding.'],['lab.html?app=loyalty','Loyalty card','Points, tiers, expiry, redemption.'],['lab.html?app=taxi','Taxi fare planner','Fares, half price, seats, change.'],['coffee.html','Coffee ordering app','Easy start. 5 hidden bugs in a coffee-shop order screen.'],['clinic-practice.html','Clinic booking app','Roles, versions and 9 hidden bugs.'],['stockwatch-practice.html','StockWatch stock app','Counting stock, expiry dates and rounding.']];
 const skills=[['ds-home.html','Data science','Twelve modules from the first question to a portfolio, with practice labs, checkpoints and exam questions.'],['sqa-home.html','SQL Academy','Nine modules from the first SELECT to window functions, with a graded gym, interview prep and case studies.'],['farm-home.html','Farm practice','Thirteen practice apps for software farmers use: herds, feed, spraying, water, money, labour and sales.'],['sql-lab.html#learn','SQL lessons','Learn SQL from zero, with a teaching mode that builds queries with you.'],['sql-lab.html#gym','SQL practice gym','44 extra questions in 8 sections, easy to hard.'],['api-lab.html','API testing lab','Test the “waiter” between the screen and the system.'],['arcade.html','Test arcade','Five quick games. A new round every time.'],['careful.html','Careful tester toolkit','Checklists, notes and eye-training so you catch the small stuff.'],['sql-lab.html#cases','Data Detective cases','Find 5 planted data bugs and write the bug reports.'],['autolab.html','Automation lab','Write real automated test steps and run them.'],['appbugs.html','Test this app','Report real bugs you find in the Practice Lab.'],['testcase.html','Write a test case','Write a UAT test case, lock your expected result, get marked on ten points and see the improved version.']];
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
  <li class="mm-i"><a class="mm-t mm-link" href="index.html">Home</a></li></ul><div class="mm-s"><input id="mm-q" type="search" placeholder="Search pages" aria-label="Search pages" autocomplete="off"><ul id="mm-res" hidden></ul></div></div>`;
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
  const setH=()=>{const sb=document.getElementById('sbbar');document.documentElement.style.setProperty('--mmh',(bar.offsetHeight||0)+'px')};setH();window.addEventListener('resize',setH);if(window.ResizeObserver)new ResizeObserver(setH).observe(bar);
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

/* phone bar: there is no sidebar on phones. A slim top bar with Home, a "Go to a page" dropdown and a search box. */
(function(){const D=window.__mmData;const mm=document.getElementById('mm');if(!D||!mm)return;
 const EXTRA=[['index.html','Home'],['lab.html','All practice apps'],['tickets.html','Tickets'],['readiness.html','Readiness'],['portfolio.html','Portfolio'],['outside.html','Practice outside the app'],['workplace.html','Work skills']];
 const seen=new Set();const SEC=D.map(([s,it])=>[s,it.map(x=>[x[0],x[1]]).concat(s==='Exam & career'?EXTRA.slice(5):s==='Getting started'?[EXTRA[0],EXTRA[2]]:s==='Practice apps'?[EXTRA[1]]:[])]).map(([s,it])=>[s,it.filter(x=>{if(seen.has(x[0]))return false;seen.add(x[0]);return true})]).filter(s=>s[1].length);
 const ALL=[].concat(...SEC.map(s=>s[1]));
 const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
 const here=location.pathname.split('/').pop()||'index.html';
 const isCur=h=>{const [p,hs]=h.split('#');const [f,q]=p.split('?');if(f!==here)return false;if(q&&!location.search.includes(q))return false;if(hs)return location.hash==='#'+hs;return !(ALL.some(x=>x[0]!==h&&x[0].split('#')[0].split('?')[0]===f&&x[0].includes('#')&&location.hash==='#'+x[0].split('#')[1]))};
 const bar=document.createElement('div');bar.id='sbbar';
 bar.innerHTML=`<div class="sb-r1"><a class="sb-home" href="index.html">UAT Practice Lab</a><select id="sb-go" aria-label="Go to a page"><option value="">Go to a page</option>${SEC.map(([s,it])=>`<optgroup label="${esc(s)}">${it.map(([h,t])=>`<option value="${esc(h)}"${isCur(h)?' selected':''}>${esc(t)}</option>`).join('')}</optgroup>`).join('')}</select></div><div class="sb-s"><input id="sb-q" type="search" placeholder="Search pages" aria-label="Search pages" autocomplete="off"><ul id="sb-res" class="sb-l" hidden></ul></div>`;
 const st=document.createElement('style');st.textContent=`#sbbar{display:none}@media(max-width:700px){#mm,#bn{display:none!important}#sbbar{display:block;background:#fff;border-bottom:1px solid #d5dae2;padding:6px 12px 8px}.sb-r1{display:flex;align-items:center;gap:10px}.sb-home{font-weight:800;font-size:15px;color:#16202f;text-decoration:none;min-height:48px;display:flex;align-items:center;white-space:nowrap}#sb-go{flex:1;min-width:0;min-height:48px;font-size:16px}#sbbar #sb-q{height:48px;min-height:48px}}
.sb-l{list-style:none;margin:0;padding:0}.sb-l li{margin:0}`;
 document.head.appendChild(st);mm.after(bar);
 bar.querySelector('#sb-go').addEventListener('change',e=>{if(e.target.value)location.href=e.target.value});
 window.__phonebar={all:()=>ALL.map(x=>x[0])};
})();

/* breadcrumbs: Home > section > this page. The section is a dropdown of its other pages; on phones it shows as "..." */
(function(){const D=window.__mmData;const mm=document.getElementById('mm');if(!D||!mm)return;
 const here=location.pathname.split('/').pop()||'index.html';if(here==='index.html')return;
 const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
 const match=(h)=>{const [p,hs]=h.split('#');const [f,q]=p.split('?');if(f!==here&&!(f==='ds-home.html'&&/^ds-/.test(here))&&!(f==='sqa-home.html'&&/^sqa-/.test(here))&&!(f==='farm-home.html'&&/^farm-/.test(here)))return 0;let s=1;if(q){if(!location.search.includes(q))return 0;s+=2}if(hs){if(location.hash==='#'+hs)s+=2;else if(location.hash)return 0}return s};
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

/* Accessibility: give every unlabelled form control an accessible name (adjacent label, first option, id). */
(function(){
 function name(e){
  if(e.type==='file')return 'Choose backup file';
  var p=e.previousElementSibling;
  if(p&&p.tagName==='LABEL'&&p.textContent.trim())return p.textContent.trim();
  var l=e.parentElement&&e.parentElement.querySelector(':scope > label, :scope > .lbl, :scope > b');
  if(l&&l.textContent.trim()&&l.textContent.trim().length<60)return l.textContent.trim();
  if(e.tagName==='SELECT'&&e.options[0])return e.options[0].text.trim()||'Choose an option';
  var t=(e.name||e.id||'').replace(/[-_]+/g,' ').trim();
  return t?t.charAt(0).toUpperCase()+t.slice(1):'Input';
 }
 function fix(){
  document.querySelectorAll('input:not([type=hidden]):not([type=checkbox]):not([type=radio]),select,textarea').forEach(function(e){
   if(e.getAttribute('aria-label')||e.getAttribute('aria-labelledby')||e.title||e.placeholder||(e.id&&document.querySelector('label[for="'+e.id+'"]'))||e.closest('label'))return;
   e.setAttribute('aria-label',name(e));
  });
 }
 var t;function later(){clearTimeout(t);t=setTimeout(fix,150)}
 fix();document.addEventListener('DOMContentLoaded',fix);
 new MutationObserver(later).observe(document.documentElement,{childList:true,subtree:true});
})();

/* Search: one index of every page (title + description), used by the top bar and the phone bar. */
(function(){
 var EX=[['index.html','Home','Today, your next ticket and progress.'],['lab.html','All practice apps','Pick any of the practice apps.'],['tickets.html','Tickets','Test jobs from your manager.'],['readiness.html','Readiness','Check you are ready for the exam and the job.'],['portfolio.html','Test portfolio','Keep proof of the testing you did.'],['outside.html','Practice outside the app','Real web apps to practise on.'],['workplace.html','Work skills','Skills you need in a real test team.'],['ds-exam.html','Data science exam practice','Original data science questions by module and a 40-question mock.'],['ds-career.html','Data science career and income','Roles, portfolio projects, interview questions and honest notes on income.'],['ds-research.html','Data science research notes','What was looked up, the sources and how far each point can be trusted.'],['sqa-gym.html','SQL practice gym (academy)','Over 220 graded SQL questions on coffee, farm, HR and library data.'],['sqa-projects.html','SQL case studies','Three business projects with a note to the owner at the end.'],['sqa-exam.html','SQL interview prep','Interview questions, a timed 40-question mock and timed SQL challenges.'],['sqa-doctor.html','SQL query doctor','Repair broken and slow queries and read the query plan.'],['sqa-schema.html','SQL schema lab','Split a messy sheet into clean tables and write the CREATE TABLE statements.'],['sqa-cheatsheet.html','SQL cheatsheet','One printable page of the SQL shapes you use most.'],['sqa-career.html','SQL career and income','What employers test and honest notes on earning from SQL.'],['farm-start.html','Farm practice: start here','A plain explanation of testing farm software, a worked example and a glossary.'],['farm-research.html','Farm practice: research and sources','What was looked up for the farm apps and which figures are unconfirmed.']];
 var idx;
 function build(){if(idx)return idx;var seen={};idx=[];(window.__mmData||[]).forEach(function(g){g[1].forEach(function(x){if(!seen[x[0]]){seen[x[0]]=1;idx.push({h:x[0],t:x[1],d:x[2]||'',s:g[0]})}})});EX.forEach(function(x){if(!seen[x[0]]){seen[x[0]]=1;idx.push({h:x[0],t:x[1],d:x[2],s:''})}});return idx}
 function esc(t){return String(t).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
 function find(q){var w=q.toLowerCase().split(/\s+/).filter(Boolean);if(!w.length)return[];
  return build().map(function(p){var t=p.t.toLowerCase(),d=(p.d+' '+p.s).toLowerCase(),sc=0;
   for(var i=0;i<w.length;i++){if(t.indexOf(w[i])>-1)sc+=t.indexOf(w[i])===0?4:3;else if(d.indexOf(w[i])>-1)sc+=1;else return null}
   return{p:p,sc:sc}}).filter(Boolean).sort(function(a,b){return b.sc-a.sc}).slice(0,8).map(function(x){return x.p})}
 function render(list,q){return list.length?list.map(function(p){return '<li><a href="'+esc(p.h)+'"><b>'+esc(p.t)+'</b><span>'+esc(p.d)+'</span></a></li>'}).join(''):'<li class="sr-none">No page matches “'+esc(q)+'”. Try another word.</li>'}
 function wire(inp,res,nav){var q=inp.value.trim();
  if(!q){res.hidden=true;res.innerHTML='';if(nav)nav.hidden=false;return}
  res.innerHTML=render(find(q),q);res.hidden=false;if(nav)nav.hidden=true}
 document.addEventListener('input',function(e){var t=e.target;
  if(t.id==='mm-q')wire(t,document.getElementById('mm-res'));
  else if(t.id==='sb-q')wire(t,document.getElementById('sb-res'),document.getElementById('sb-nav'))});
 document.addEventListener('keydown',function(e){var t=e.target;if(t.id!=='mm-q'&&t.id!=='sb-q')return;
  var r=document.getElementById(t.id==='mm-q'?'mm-res':'sb-res');
  if(e.key==='Enter'){var a=r&&r.querySelector('a');if(a)location.href=a.getAttribute('href')}
  else if(e.key==='Escape'){t.value='';t.dispatchEvent(new Event('input',{bubbles:true}))}
  else if(e.key==='ArrowDown'&&r){var f=r.querySelector('a');if(f){f.focus();e.preventDefault()}}});
 document.addEventListener('click',function(e){var q=document.getElementById('mm-q');if(q&&q.value&&!e.target.closest('.mm-s')){q.value='';q.dispatchEvent(new Event('input',{bubbles:true}))}});
 var st=document.createElement('style');st.textContent='#mm .mm-s{position:relative;margin-left:auto}#mm .mm-s input{width:190px;max-width:40vw;min-height:36px;border:1px solid #d5dae2;border-radius:8px;padding:0 10px;font:500 14px Manrope,system-ui,sans-serif;color:#16202f;background:#fff}#mm-res{position:absolute;right:0;top:42px;width:340px;max-width:92vw;background:#fff;border:1px solid #d5dae2;border-radius:12px;box-shadow:0 12px 32px rgba(22,32,47,.14);padding:6px;z-index:70;list-style:none;margin:0}#mm-res[hidden],#sb-res[hidden]{display:none}#mm-res a,#sb-res a{display:flex;flex-direction:column;gap:2px;padding:9px 10px;border-radius:8px;color:#16202f;text-decoration:none}#mm-res a:hover,#mm-res a:focus,#sb-res a:focus{background:#f3f4f6}#mm-res b,#sb-res b{font-weight:800;font-size:14.5px}#mm-res span,#sb-res span{color:#4a5568;font-size:13px}.sr-none{padding:10px;color:#4a5568;font-size:14px}.sb-s{padding:4px 0 10px}.sb-s input{width:100%;min-height:48px;border:1px solid #c5ccd6;border-radius:10px;padding:0 14px;font-size:16px;color:#16202f;background:#fff;box-sizing:border-box}#sb-res a{min-height:52px;justify-content:center;padding:6px 12px}#sb-res a b{font-size:16px}';
 document.head.appendChild(st);
})();
