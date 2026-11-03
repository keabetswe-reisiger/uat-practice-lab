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
 const apps=[['lab.html?app=shop','Online shop','Search, cart, discount code, shipping, checkout.'],['lab.html?app=bank','Mobile banking','Transfers, limits, OTP, history and a loan check.'],['lab.html?app=crm','Business CRM','Roles, deal stages, validation and reports.'],['lab.html?app=docs','Shared documents','Versions, sharing permissions, file limits.'],['lab.html?app=ui','Form playground','Tables, dropdowns, dates, counters, steppers.'],['coffee.html','Coffee ordering app','Easy start. 5 hidden bugs in a coffee-shop order screen.'],['clinic-practice.html','Clinic booking app','Roles, versions and 9 hidden bugs.'],['stockwatch-practice.html','StockWatch stock app','Counting stock, expiry dates and rounding.']];
 const skills=[['sql-lab.html#learn','SQL lessons','Learn SQL from zero, with a teaching mode that builds queries with you.'],['sql-lab.html#gym','SQL practice gym','44 extra questions in 8 sections, easy to hard.'],['api-lab.html','API testing lab','Test the “waiter” between the screen and the system.'],['arcade.html','Test arcade','Five quick games. A new round every time.'],['careful.html','Careful tester toolkit','Checklists, notes and eye-training so you catch the small stuff.'],['sql-lab.html#cases','Data Detective cases','Find 5 planted data bugs and write the bug reports.']];
 const exam=[['exam.html','Exam prep (ISTQB)','64 lessons, hundreds of practice questions, timed mock exams.'],['techniques.html','Technique trainer','Boundary values, decision tables, state transitions and more, with new numbers every time.'],['capstone.html','Final test: unseen app','Find hidden bugs in an app you have never seen.'],['interview.html','Interview practice','42 questions with model answers and key points.'],['workplace.html','Work skills','DevTools, Git, Agile, automation and test documents.'],['portfolio.html','Test portfolio','Turn your real work into a document for employers.'],['readiness.html','Readiness check','Are you ready for the exam? For a job?'],['outside.html','Practice outside the app','Real practice sites, communities and a 4-week plan.']];
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
  const setH=()=>document.documentElement.style.setProperty('--mmh',bar.offsetHeight+'px');setH();window.addEventListener('resize',setH);if(window.ResizeObserver)new ResizeObserver(setH).observe(bar);
 const panels=()=>[...bar.querySelectorAll('.mm-p')],trig=()=>[...bar.querySelectorAll('button.mm-t')];
 const closeAll=()=>{panels().forEach(p=>p.classList.remove('on'));trig().forEach(b=>b.setAttribute('aria-expanded','false'))};
 const open=b=>{closeAll();trig().forEach(x=>{if(x!==b)x.dataset.pin=''});b.setAttribute('aria-expanded','true');document.getElementById(b.getAttribute('aria-controls')).classList.add('on')};
 bar.querySelectorAll('.mm-i').forEach(li=>{const b=li.querySelector('button.mm-t');if(!b)return;
  b.addEventListener('click',()=>{if(b.getAttribute('aria-expanded')==='true'&&b.dataset.pin==='1'){closeAll();b.dataset.pin=''}else{open(b);b.dataset.pin='1'}});
  });
 document.addEventListener('click',e=>{if(!bar.contains(e.target))closeAll()});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'){const o=trig().find(b=>b.getAttribute('aria-expanded')==='true');closeAll();o&&o.focus()}});
})();
