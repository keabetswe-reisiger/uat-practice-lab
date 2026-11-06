/* today.js: the "Today" section and the learning map on the home page.
   Everything is read from the progress this browser already stores (and syncs), so nothing here needs its own save. */
(function(){
 const rd=k=>{try{return JSON.parse(localStorage.getItem(k))||{}}catch{return{}}};
 const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
 const todayStr=()=>new Date().toISOString().slice(0,10);
 const T=window.TICKETS||[];const TS=rd('uat-tickets-v1'),EX=rd('exam-v1'),AR=rd('arcade-v1'),SQ=rd('sqllab-v1'),AP=rd('apilab-v1'),CA=rd('careful-v1'),SH=rd('start-here-v1'),TE=rd('tech-v1'),CP=rd('capstone-v1'),IV=rd('interview-v1'),WP=rd('workplace-v1'),PF=rd('portfolio-v1'),LA=rd('labapps-v1'),LM=rd('labmarks-v1'),AL=rd('autolab-v1');
 const status=k=>(TS[k]&&TS[k].status)||'Open';
 /* ----- numbers ----- */
 const N={
  tickets:{have:T.filter(t=>['Passed','Failed'].includes(status(t.key))).length,need:T.length||37},
  apps:{have:Object.values(LA.best||{}).filter(b=>b&&b.pass).length+Object.values(LM.p||{}).filter(x=>x&&x.best&&x.best.pass).length,need:11},
  auto:{have:Math.min(Object.keys(AL.done||{}).length,4),need:4},
  arcade:{have:Math.min(AR.xp||0,100),need:100},
  api:{have:Object.keys(AP.found||{}).length,need:8},
  sqlLearn:{have:Object.keys(SQ.done||{}).length+Object.keys(SQ.cases||{}).length,need:13},
  sqlGym:{have:Object.keys(SQ.gym||{}).length,need:44},   /* 44 questions in the SQL practice gym */
  start:{have:Object.keys(SH.done||{}).length,need:7},
  careful:{have:Math.min((CA.sessions||[]).length,3),need:3},
  examRead:{have:Object.keys(EX.read||{}).length,need:64},
  mocks:{have:(EX.mocks||[]).filter(m=>m.score/40>=.8).length,need:3},
  tech:{have:0,need:14},
  final:{have:(CP.attempts||[]).filter(a=>a.pass).length?1:0,need:1},
  interview:{have:Math.min(Object.keys(IV.ans||{}).length,20),need:20},
  work:{have:Math.min(Object.values(WP.done||{}).filter(x=>x>=2).length,27),need:27},
  portfolio:{have:PF.exported?1:0,need:1}};
 ['ep_count','ep_set','bva_set','bva_count','dt_rules','dt_action','st_next','st_cov','code_cov','est_3pt','est_ratio','est_extrap','prio_risk','prio_cov'].forEach(t=>{const r=(TE.recent||{})[t]||[];if(r.length>=5&&r.filter(x=>x).length/r.length>=.8)N.tech.have++});
 const FL='1.1.1 1.1.2 1.2.1 1.2.2 1.2.3 1.3.1 1.4.1 1.4.2 1.4.3 1.4.4 1.4.5 1.5.1 1.5.2 1.5.3 2.1.1 2.1.2 2.1.3 2.1.4 2.1.5 2.1.6 2.2.1 2.2.2 2.2.3 2.3.1 3.1.1 3.1.2 3.1.3 3.2.1 3.2.2 3.2.3 3.2.4 3.2.5 4.1.1 4.2.1 4.2.2 4.2.3 4.2.4 4.3.1 4.3.2 4.3.3 4.4.1 4.4.2 4.4.3 4.5.1 4.5.2 4.5.3 5.1.1 5.1.2 5.1.3 5.1.4 5.1.5 5.1.6 5.1.7 5.2.1 5.2.2 5.2.3 5.2.4 5.3.1 5.3.2 5.3.3 5.4.1 5.5.1 6.1.1 6.2.1'.split(' ');
 const nextLesson=FL.find(x=>!(EX.read||{})['FL-'+x]);
 const dueN=Object.values(EX.q||{}).filter(e=>e&&e.d<=Date.now()&&e.b<5).length;
 /* ----- the Today cards ----- */
 function nextTicket(){const open=T.filter(t=>['In progress','Open'].includes(status(t.key)));
  open.sort((a,b)=>(status(a.key)==='In progress'?0:1)-(status(b.key)==='In progress'?0:1)||String(a.due).localeCompare(String(b.due))||a.key.localeCompare(b.key));return open[0]}
 function cards(){const nt=nextTicket();const w=window.COACH?COACH.weak():[];const c=[];
  const dueWords=d=>{const iso=x=>x.getFullYear()+'-'+String(x.getMonth()+1).padStart(2,'0')+'-'+String(x.getDate()).padStart(2,'0');const now=new Date();const tm=new Date(now.getTime()+864e5);if(d===iso(now))return 'due today';if(d===iso(tm))return 'due tomorrow';if(d&&d<iso(now))return 'overdue since '+new Date(d+'T00:00').toLocaleDateString('en-ZA',{day:'numeric',month:'short'});return 'due '+(d?new Date(d+'T00:00').toLocaleDateString('en-ZA',{weekday:'short',day:'numeric',month:'short'}):'soon')};
  c.push(nt?{k:'Next ticket',t:esc(nt.key)+': '+esc(nt.title),d:`${esc(nt.type)} test · about ${esc(nt.est)} · ${dueWords(nt.due)}${status(nt.key)==='In progress'?' · <b>in progress</b>':''}.`,p:{have:N.tickets.have,need:N.tickets.need,w:'tickets'},a:'Open this ticket',h:'tickets.html#'+nt.key}:{k:'Tickets',t:'All tickets finished',d:'Excellent. Open the board to review your results or export your report.',a:'Open the board',h:'tickets.html'});
  c.push(w.length?{k:'Practise a weak point',t:esc(w[0].name),d:`You got ${w[0].ok} of ${w[0].n} right so far. Read its plan and example, then test it again in a practice app.`,a:'Practise in a practice app',h:'lab.html'}:{k:'Practice app',t:N.apps.have?'Pass another practice app':'Try the Online shop',d:`${N.apps.have} of 11 practice apps passed. The app marks you automatically and coaches you after every test.`,a:'Choose an app',h:N.apps.have?'lab.html':'lab.html?app=shop'});
  const done=AR.last===todayStr();c.push({k:'Daily 5',t:done?'Done today':'Play today\'s Daily 5',d:done?`Streak: ${AR.streak||1} day${(AR.streak||1)===1?'':'s'}. Come back tomorrow for a new set.`:`Five quick questions, about 5 minutes.${AR.streak?` Streak: ${AR.streak} day${AR.streak===1?'':'s'}.`:''}`,a:done?'Play again':'Play now',h:'arcade.html'});
  c.push({k:'SQL question of the day',t:N.sqlGym.have>=N.sqlGym.need?'All 44 gym questions done':'One new SQL question',d:`${N.sqlGym.have} of 44 gym questions finished. Today\'s question is picked for you.`,a:'Open today\'s question',h:'sql-lab.html#daily'});
  c.push(dueN?{k:'Exam prep',t:dueN+' question'+(dueN===1?'':'s')+' due for review',d:'Questions you missed come back on a schedule. Ten minutes now saves hours later.',a:'Review now',h:'exam.html#due'}:nextLesson?{k:'Exam prep',t:'Next lesson: FL-'+nextLesson,d:`${N.examRead.have} of 64 syllabus lessons read.`,a:'Read it',h:'exam.html#learn-'+nextLesson.split('.')[0]}:{k:'Exam prep',t:'Take a mock exam',d:'All lessons read. A timed 40-question mock shows where you stand.',a:'Start a mock',h:'exam.html#mock'});
  const lastBk=localStorage.getItem('uatbackup-last');const hasProgress=Object.values(N).some(x=>x.have>0);const old=!lastBk||(Date.now()-new Date(lastBk).getTime())>7*864e5;
  if(hasProgress&&old)c.push({k:'Backup',t:lastBk?'Time for a new backup':'Back up your progress',d:lastBk?'Your last backup is over a week old.':'Save a copy of your progress to a file. It takes ten seconds and protects weeks of work.',a:'Open backup',h:'#backup'});
  const pct=Math.round(Object.values(N).reduce((a,x)=>a+Math.min(1,x.have/x.need),0)/Object.keys(N).length*100);
  c.push({k:'Overall',t:pct+'% of the learning map',d:'See the whole path, or check the exam and job gates.',a:'Readiness check',h:'readiness.html'});return c}
 /* ----- the map ----- */
 const STAGES=[
  ['1. Learn the basics',[['Start here guide',N.start,'start-here.html'],['Careful tester toolkit (3 sessions)',N.careful,'careful.html']]],
  ['2. Practise on apps',[['Tickets finished',N.tickets,'tickets.html'],['Practice apps passed',N.apps,'lab.html'],['Test arcade (XP)',N.arcade,'arcade.html'],['API lab bugs found',N.api,'api-lab.html'],['SQL lessons and cases',N.sqlLearn,'sql-lab.html#learn'],['SQL practice gym',N.sqlGym,'sql-lab.html#gym']]],
  ['3. Build exam skills',[['Syllabus lessons read',N.examRead,'exam.html#learn-1'],['Mocks at 80% or more',N.mocks,'exam.html#mock'],['Techniques mastered',N.tech,'techniques.html']]],
  ['4. Prove it for a job',[['Final test passed',N.final,'capstone.html'],['Automation lab challenges',N.auto,'autolab.html'],['Interview answers',N.interview,'interview.html'],['Work-skills lessons',N.work,'workplace.html'],['Portfolio exported',N.portfolio,'portfolio.html']]]];
 const css=document.createElement('style');css.textContent=`
 .td-h h2{font:600 12.5px 'Geist Mono',ui-monospace,monospace!important;letter-spacing:.14em;text-transform:uppercase;color:var(--mute,#4a5568)}.td-h h2 em{font-style:normal;color:#7a5a1e}.td-g .td-c:first-child .td-t{font-size:20px}.td-p{font-size:13.5px;color:var(--mute,#4a5568)}.td-bar{height:8px;border-radius:99px;background:#e6e9ef;margin-top:4px;overflow:hidden}.td-bar i{display:block;height:100%;background:#7a5a1e}
 .td-h{display:flex;justify-content:space-between;align-items:baseline;gap:10px;flex-wrap:wrap;margin:6px 0 8px}.td-h h2{margin:0}
 .td-g{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:12px}.td-c{border:1px solid var(--line,#d5dae2);border-radius:14px;padding:14px 16px;background:var(--card,#fff);display:flex;flex-direction:column;gap:6px}
 .td-c .td-k{font:500 11px 'Geist Mono',monospace;letter-spacing:.14em;text-transform:uppercase;color:var(--mute,#4a5568)}.td-c .td-t{font-weight:700;font-size:16.5px;line-height:1.3}.td-c .td-d{color:var(--mute,#4a5568);font-size:14.5px;flex:1}
 .td-c a.go{align-self:flex-start;margin-top:4px;background:var(--r-gold,#c9a66e);color:var(--r-on-gold,#1d1608);border:1px solid var(--r-gold-deep,#b38e52);border-radius:8px;padding:6px 12px;font-weight:700;text-decoration:none}
 .map{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:14px;margin-top:6px}@media(max-width:1100px){.map{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:600px){.map{grid-template-columns:1fr}}
 .map .st{position:relative}.map .st h3{font:500 12px 'Geist Mono',monospace;letter-spacing:.12em;text-transform:uppercase;color:var(--mute,#4a5568)!important;margin:0 0 8px}
 .map .nd{display:block;text-decoration:none;color:inherit;border:1px solid var(--line,#d5dae2);border-left-width:5px;border-radius:10px;padding:8px 10px;margin-bottom:8px;background:var(--card,#fff)}
 .map .nd:hover{border-color:var(--r-gold-deep,#b38e52)}.map .nd.full{border-left-color:#11663f}.map .nd.part{border-left-color:#b38e52}.map .nd.none{border-left-color:#b8c0cc}
 .map .nd b{display:block;font-size:14px}.map .nd small{color:var(--mute,#4a5568)}.map .bar2{height:6px;background:#e5e8ee;border-radius:99px;overflow:hidden;margin:4px 0}.map .bar2 i{display:block;height:100%;background:#b38e52}.map .nd.full .bar2 i{background:#11663f}
 @media(min-width:1101px){.map .st:not(:last-child)::after{content:"→";position:absolute;right:-12px;top:0;color:var(--mute,#4a5568);font-size:16px}}`;
 document.head.appendChild(css);
 function mapHTML(){return `<div class="map">${STAGES.map(([h,ns])=>`<div class="st"><h3>${h}</h3>${ns.map(([n,x,l])=>{const p=Math.min(1,x.have/x.need);return `<a class="nd ${p>=1?'full':p>0?'part':'none'}" href="${l}"><b>${n}</b><div class="bar2"><i style="width:${p*100}%"></i></div><small>${x.have} of ${x.need}${p>=1?' · done':''}</small></a>`}).join('')}</div>`).join('')}</div>`}
 function render(){const a=document.getElementById('today'),m=document.getElementById('map');
  if(a)a.innerHTML=`<div class="td-h"><h2><em>Today</em>&nbsp; ${new Date().toLocaleDateString('en-ZA',{weekday:'long',day:'numeric',month:'long'})}</h2></div><div class="td-g">${cards().map(c=>`<div class="td-c"><div class="td-k">${c.k}</div><div class="td-t">${c.t}</div><div class="td-d">${c.d}</div>${c.p?`<div class="td-p"><span>${c.p.have} of ${c.p.need} ${c.p.w} finished</span><div class="td-bar"><i style="width:${Math.round(100*c.p.have/Math.max(1,c.p.need))}%"></i></div></div>`:''}<a class="go" href="${c.h}">${c.a}</a></div>`).join('')}</div>`;
  if(m)m.innerHTML=mapHTML()}
 document.addEventListener('click',e=>{const l=e.target.closest('a[href="#backup"]');if(l){e.preventDefault();e.stopImmediatePropagation();const b=document.getElementById('us-b');if(b)b.click()}});
 /* Activity log: remembers WHEN progress changed, so charts over time are real.
    Each time this file runs (home page, UAT Lab) it compares today's numbers with the last snapshot and records the difference
    with today's date. Progress made between two visits is dated to the next visit. The first run only takes the starting snapshot. */
 const LOGK='uatlog-v1';let LOG;try{LOG=JSON.parse(localStorage.getItem(LOGK))||{}}catch{LOG={}}
 LOG.snap=LOG.snap||{};LOG.ev=LOG.ev||[];
 (function(){const now=Date.now();if(!LOG.since)LOG.since=now;const first=!Object.keys(LOG.snap).length;
  Object.entries(N).forEach(([k,v])=>{const prev=LOG.snap[k];if(!first&&prev!=null&&v.have!==prev)LOG.ev.push({t:now,k,d:v.have-prev});LOG.snap[k]=v.have});
  if(LOG.ev.length>3000)LOG.ev=LOG.ev.slice(-3000);
  try{localStorage.setItem(LOGK,JSON.stringify(LOG))}catch{}})();
 window.TODAY={N,cards,nextTicket,render,mapHTML,STAGES,log:()=>LOG};
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',render);else render();
})();
/* put the learning map in the sidebar on wide screens, back under "Today" on phones */
(function(){const mq=window.matchMedia('(min-width:701px)');const place=()=>{const side=document.getElementById('mapside'),slot=document.getElementById('mapslot'),today=document.getElementById('today');if(!side||!slot||!today)return;if(mq.matches){if(side.parentNode!==slot)slot.appendChild(side)}else if(today.nextElementSibling!==side)today.after(side)};place();(mq.addEventListener?mq.addEventListener('change',place):mq.addListener(place))})();
