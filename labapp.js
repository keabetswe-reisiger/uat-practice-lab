/* labapp.js: the engine for the new practice apps (lab.html).
   Each app module (app-shop.js, ...) registers itself in window.LABAPPS with:
     id, title, icon, kind, level, blurb, activeCount
     bugs:{id:{area,type,desc,hint,idea}}          pool of planted bugs; `activeCount` of them are active per attempt
     extra:[{h,html}]                              extra information (opens in a drawer, never in your way)
     fresh()                                       new app state
     read(s,B)                                     PURE: every value the screen displays, as an object (B = Set of active bug ids)
     render(s,B,ui)                                HTML of the app screen; show values via <span data-k="key">..</span>
     act(s,B,action,arg,ui)                        handle a click, mutate s, return true to redraw
     tests:[{id,title,why,bug,steps[],scenario:[[action,arg],...],observe:[{id,label,type,choices,key,expected,unit}]}]
   The marker needs NO hand-written "actual" values: it replays the scenario through the app's own act() and reads read(),
   so what the marker thinks the app does is exactly what the screen shows. */
(function(){
 const $=id=>document.getElementById(id);
 const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
 const R=seed=>{let a=seed>>>0||1;const r=()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296};r.shuf=x=>{x=x.slice();for(let i=x.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[x[i],x[j]]=[x[j],x[i]]}return x};return r};
 const KEY='labapps-v1';let ST;try{ST=JSON.parse(localStorage.getItem(KEY))||{}}catch{ST={}}ST.apps=ST.apps||{};ST.best=ST.best||{};
 const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(ST))}catch{}};
 const LA=window.LABAPPS=window.LABAPPS||{};
 /* ---------- model helpers (used by the page AND by the tests) ---------- */
 function pickBugs(mod,seed){const ids=Object.keys(mod.bugs);const r=R(seed);const n=Math.min(mod.activeCount||5,ids.length);return r.shuf(ids).slice(0,n)}
 function replay(mod,B,scenario,fresh){const s=fresh||mod.fresh();const ui={val:()=>''};(scenario||[]).forEach(st=>{mod.act(s,B,st[0],st[1],ui)});return s}
 const num=v=>{const x=parseFloat(String(v).replace(/[R$€£,\s]/g,''));return isNaN(x)?null:x};
 function same(type,exp,obs){if(type==='number'){const a=num(obs);return a!==null&&Math.abs(a-Number(exp))<0.005}return String(obs).trim().toLowerCase()===String(exp).trim().toLowerCase()}
 /* what the app really shows for this test */
 function actualFor(mod,B,t){const s=replay(mod,B,t.scenario);return mod.read(s,B)}
 /* does this test's expected (spec) value differ from the app's real behaviour? */
 function differs(mod,B,t){const a=actualFor(mod,B,t);return t.observe.some(o=>!same(o.type,o.expected,a[o.key]))}
 window.LABENGINE={pickBugs,replay,same,actualFor,differs,R};
 /* ---------- runtime ---------- */
 const params=new URLSearchParams(location.search);const appId=params.get('app');
 const GLOSS=[['UAT','User Acceptance Testing: the people who will use the system check that it does what they need.'],['Expected result','What the written rules say should happen. It comes from the spec, never from your guess.'],['Observed result','What you really saw on screen. Read it exactly.'],['Defect','A difference between expected and observed. The app writes the report for you when you find one, but you should learn to write your own.'],['Control test','A test where nothing is wrong. Good testers pass these and do not invent bugs.'],['Severity','Critical = money or data wrong. Major = a rule broken. Minor = cosmetic.']];
 function catalog(){const ids=Object.keys(LA);const best=ST.best;
  $('v').innerHTML=`<div class="card" style="border-left:4px solid var(--accent)"><h2>Practice apps</h2><div>Each app is a small pretend system with hidden bugs, written like real software. You test it, type what you <b>observe</b>, and the app <b>marks you automatically</b>: it compares what you saw with the written rules and with what the app really does. Every attempt plants a <b>different mix of bugs</b>.</div></div>
  <div class="grid">${ids.map(i=>{const m=LA[i],b=best[i];return `<a class="card appcard" href="lab.html?app=${i}"><div style="font-size:34px">${m.icon}</div><h3>${esc(m.title)}</h3><div class="tags"><span class="tag">${esc(m.kind)}</span><span class="tag">${esc(m.level)}</span><span class="tag">${Object.keys(m.bugs).length} possible bugs</span></div><div class="mute" style="margin:6px 0">${esc(m.blurb)}</div><div>${b?(b.pass?'✅ passed':'Best: '+b.found+'/'+b.bugs+' bugs found'):'Not tried yet'}</div></a>`}).join('')}
  <a class="card appcard" href="coffee.html"><div style="font-size:34px">☕</div><h3>Coffee ordering app</h3><div class="tags"><span class="tag">Order flow</span><span class="tag">easy</span></div><div class="mute" style="margin:6px 0">The first practice app, with a full workbook.</div></a>
  <a class="card appcard" href="clinic-practice.html"><div style="font-size:34px">🩺</div><h3>Clinic booking</h3><div class="tags"><span class="tag">Roles &amp; versions</span><span class="tag">medium</span></div><div class="mute" style="margin:6px 0">Roles, old vs new version, 9 hidden bugs.</div></a>
  <a class="card appcard" href="stockwatch-practice.html"><div style="font-size:34px">📦</div><h3>StockWatch</h3><div class="tags"><span class="tag">Stock &amp; dates</span><span class="tag">harder</span></div><div class="mute" style="margin:6px 0">Counting stock, expiry dates and rounding.</div></a></div>`}
 function run(mod){
  let A=ST.apps[appId];
  const fresh=()=>{const seed=(Date.now()%1e9)+3;A=ST.apps[appId]={seed,bugs:pickBugs(mod,seed),s:mod.fresh(),res:{},focus:mod.tests[0].id,view:'test',started:Date.now()};save()};
  if(!A||!A.bugs)fresh();
  const Bset=()=>new Set(A.bugs);const ui={val:id=>{const e=$(id);return e?e.value:''}};
  const T=()=>mod.tests;const cur=()=>T().find(t=>t.id===A.focus)||T()[0];
  const status=id=>{const r=A.res[id];return r?r.final:'Pending'};
  /* ---- marking a submission ---- */
  function submit(t,vals){const B=Bset();const act=actualFor(mod,B,t);const exp=t.observe.map(o=>o.expected);
   const okExp=t.observe.every(o=>same(o.type,o.expected,vals[o.id]));          // matches the spec => tester says PASS
   const okAct=t.observe.every(o=>same(o.type,act[o.key],vals[o.id]));          // matches what the app really shows
   const prev=A.res[t.id]||{tries:0};const tries=prev.tries+(okAct?0:1);
   let final,fb,verdict=okExp?'Pass':'Fail';
   if(okAct&&okExp){final='Pass';fb={c:'ok',t:'✅ Correct. What you observed matches the expected result, and it is what the app really shows. This test passes.'}}
   else if(okAct&&!okExp){final='Found';const b=t.bug&&mod.bugs[t.bug];fb={c:'ok',t:'✅ <b>Bug found.</b> What you observed is what the app really shows, and it is different from the expected result. '+(b?esc(b.desc):'')+' The defect report below was written from your observation.'}}
   else{ // what they typed is not what the app shows
    const real=t.observe.map(o=>o.label+' → <b>'+esc(act[o.key])+'</b>').join('<br>');
    if(tries<2){final='Recheck';fb={c:'no',t:'⚠ What you typed does not match what this app is showing. Do the steps again, slowly, and read the value exactly as it appears on screen.'}}
    else if(tries<3){final='Recheck';const b=t.bug&&B.has(t.bug)&&mod.bugs[t.bug];fb={c:'no',t:'⚠ Still not matching. Hint: '+esc((b&&b.hint)||'Look at the exact figure or wording, not at what you expected to see.')}}
    else{const real_diff=differs(mod,B,t);final=real_diff?'Missed':'Misread';fb={c:'no',t:'The app really shows:<br>'+real+'<br>'+(real_diff?'This <b>differs</b> from the expected result, so this was a real bug that you missed.':'This <b>matches</b> the expected result, so the test passes. Reporting a failure here would be a false alarm.')}}
   }
   A.res[t.id]={obs:vals,verdict,tries,final,fb};save()}
  function defectText(t){const r=A.res[t.id];const o=t.observe.map(x=>`${x.label}\n  Expected: ${x.expected}${x.unit||''}\n  Observed: ${r.obs[x.id]}`).join('\n');const b=t.bug&&mod.bugs[t.bug];return `DEFECT REPORT\nApp: ${mod.title}\nTest: ${t.id} ${t.title}\nSeverity: ${(b&&b.sev)||'Major'}\nSteps:\n${t.steps.map((s,i)=>(i+1)+'. '+s).join('\n')}\n${o}\nReported by: you · ${new Date().toLocaleString()}`}
  function score(){const B=Bset();const planted=A.bugs.filter(b=>T().some(t=>t.bug===b));const done=T().filter(t=>A.res[t.id]&&['Pass','Found','Missed','Misread'].includes(A.res[t.id].final));const found=T().filter(t=>t.bug&&B.has(t.bug)&&A.res[t.id]&&A.res[t.id].final==='Found');const fa=T().filter(t=>A.res[t.id]&&A.res[t.id].verdict==='Fail'&&!differs(mod,B,t));const ok=T().filter(t=>A.res[t.id]&&['Pass','Found'].includes(A.res[t.id].final));
   const need=Math.ceil(planted.length*.7);return{planted,done,found,fa,ok,need,pass:done.length>=Math.ceil(T().length*.9)&&found.length>=need&&fa.length<=1}}
  function recordBest(){const s=score();if(!s.done.length)return;const cur={pass:s.pass,found:s.found.length,bugs:s.planted.length,fa:s.fa.length,ts:Date.now()};const b=ST.best[appId];if(!b||(cur.pass&&!b.pass)||(cur.pass===b.pass&&cur.found>=b.found))ST.best[appId]=cur;save()}
  /* ---- views ---- */
  const appHTML=()=>`<div class="app">${mod.render(A.s,Bset(),ui)}</div>`;
  function testHTML(){const t=cur();const ix=T().indexOf(t);const r=A.res[t.id];const done=T().filter(x=>['Pass','Found','Missed','Misread'].includes(status(x.id))).length;
   return `<div class="card"><div class="row"><b>Test ${ix+1} of ${T().length}</b><span class="mute">${done} done</span><span style="flex:1"></span><button class="b" data-lk="prev" ${ix===0?'disabled':''}>← Previous</button><button class="b" data-lk="next" ${ix===T().length-1?'disabled':''}>Next →</button></div><div class="map">${T().map((x,i)=>`<button class="b ${status(x.id)} ${x.id===t.id?'cur':''}" data-lk="go" data-id="${x.id}">${i+1}</button>`).join('')}</div></div>
   <div class="card"><div class="tags"><span class="tag">${esc(t.id)}</span>${r?`<span class="tag st-${r.final}">${r.final}</span>`:''}</div><h2 style="margin-top:6px">${esc(t.title)}</h2>
   <div class="why"><b>What you are testing and why:</b> ${esc(t.why)}</div>
   <h3>Steps</h3><ol>${t.steps.map(s=>`<li>${esc(s)}</li>`).join('')}</ol>
   <h3>What did you observe?</h3>${t.observe.map(o=>`<div class="ob"><label>${esc(o.label)}${o.unit?' ('+esc(o.unit)+')':''}</label>${o.type==='choice'?`<select id="ob_${o.id}"><option value="">Choose…</option>${o.choices.map(c=>`<option ${r&&r.obs[o.id]===c?'selected':''}>${esc(c)}</option>`).join('')}</select>`:`<input id="ob_${o.id}" type="text" value="${r?esc(r.obs[o.id]):''}" placeholder="${o.type==='number'?'type the number you saw':'type exactly what you saw'}">`}</div>`).join('')}
   <div style="margin-top:10px"><button class="b pri" data-lk="submit">Submit my result</button></div>
   ${r?`<div class="fb ${r.fb.c}">${r.fb.t}</div>${r.final==='Found'?`<details open class="det"><summary>Your defect report (written from your observation)</summary><pre>${esc(defectText(t))}</pre><button class="b" data-lk="copy" data-id="${t.id}">Copy</button></details>`:''}`:''}
   <details class="det"><summary>Extra information about this test</summary><p>Expected results come from the written rules in <b>📚 Extra info</b> (top right), not from what you guess. Type exactly what the screen shows. The app then decides Pass or Fail by comparing your observation with the expected result, and marks whether you observed correctly.</p></details></div>`}
  function resultHTML(){recordBest();const s=score();const B=Bset();
   return `<div class="card" style="border-left:4px solid ${s.pass?'var(--green)':'var(--red)'}"><h2>${s.pass?'✅ PASS':'Not yet'}</h2><div class="big">${s.found.length} / ${s.planted.length} <span class="mute">bugs found</span></div><div class="mute">${s.done.length}/${T().length} tests completed · ${s.fa.length} false alarm(s) · to pass: 90% of tests done, at least ${s.need} bugs found, at most 1 false alarm.</div>
   ${s.pass?'<p>Well done. You observed carefully, found the planted bugs, and did not invent failures.</p>':'<p>Keep going, or start a new attempt: the next one plants a different mix of bugs.</p>'}<div class="row"><button class="b pri" data-lk="newattempt">New attempt (different bugs)</button><button class="b" data-lk="backtests">Back to tests</button></div></div>
   <div class="card"><h3>Test by test</h3><table><tr><th>Test</th><th>Result</th><th>Tries</th></tr>${T().map(t=>{const r=A.res[t.id];return `<tr><td>${esc(t.id)} ${esc(t.title)}</td><td>${r?r.final:'not done'}</td><td>${r?r.tries:''}</td></tr>`}).join('')}</table></div>
   ${s.planted.filter(b=>!T().some(t=>t.bug===b&&A.res[t.id]&&A.res[t.id].final==='Found')).length?`<div class="card"><h3>Bugs still hidden</h3><div class="mute">Revealed after you finish. Where to look and which test idea finds each one:</div>${s.planted.filter(b=>!T().some(t=>t.bug===b&&A.res[t.id]&&A.res[t.id].final==='Found')).map(b=>`<div style="padding:6px 0;border-bottom:1px solid var(--line)"><b>${esc(mod.bugs[b].area)} · ${esc(mod.bugs[b].type)}</b>: ${esc(mod.bugs[b].desc)}<div class="mute"><b>Test idea:</b> ${esc(mod.bugs[b].idea||'')}</div></div>`).join('')}</div>`:''}`}
  function drawer(){const o=document.createElement('div');o.className='ov';o.id='ov';o.innerHTML=`<div class="dr"><div class="row"><h2 style="margin:0">📚 Extra information</h2><span style="flex:1"></span><button class="b" data-lk="closedr">Close ✕</button></div><div class="mute">All reference material lives here so it never gets in the way of the test.</div>${(mod.extra||[]).map((x,i)=>`<details ${i===0?'open':''}><summary>${esc(x.h)}</summary>${x.html}</details>`).join('')}<details><summary>Words you will meet</summary><table>${GLOSS.map(g=>`<tr><td style="vertical-align:top;padding-right:8px"><b>${g[0]}</b></td><td>${esc(g[1])}</td></tr>`).join('')}</table></details><details><summary>How the automatic marking works</summary><p>You type what you observed. The app (1) compares it with the <b>expected result</b> from the rules: equal means <b>Pass</b>, different means <b>Fail</b> and a defect report is written for you; and (2) compares it with what the app <b>really</b> shows, to check you observed correctly. If you mistype or misread, you get a hint first and the real answer on the third try.</p></details></div>`;document.body.appendChild(o)}
  function render(){const left=$('left'),right=$('right');left.innerHTML=appHTML();right.innerHTML=A.view==='result'?resultHTML():testHTML();$('title').textContent=mod.icon+' '+mod.title}
  const frame=()=>{$('v').innerHTML=`<div class="two"><div><div class="mute" style="margin-bottom:6px">The system under test. Use it like a real user.</div><div id="left"></div></div><div id="right"></div></div>`;render()};
  frame();
  document.addEventListener('click',e=>{const b=e.target.closest('[data-act],[data-lk],[data-top]');if(!b)return;const d=b.dataset;
   if(d.act!==undefined&&$('left')&&$('left').contains(b)){const arg=d.in?(d.arg?d.arg+'|'+ui.val(d.in):ui.val(d.in)):d.arg;if(mod.act(A.s,Bset(),d.act,arg,ui)){save();$('left').innerHTML=appHTML()}return}
   if(d.top==='extra'){drawer();return}
   const k=d.lk;if(!k)return;
   if(k==='closedr'){const o=$('ov');o&&o.remove();return}
   if(k==='go'){A.focus=d.id;A.view='test';save();render();return}
   if(k==='prev'||k==='next'){const i=T().findIndex(t=>t.id===A.focus);A.focus=T()[Math.max(0,Math.min(T().length-1,i+(k==='next'?1:-1)))].id;save();render();window.scrollTo({top:0,behavior:'smooth'});return}
   if(k==='submit'){const t=cur();const vals={};let missing=false;t.observe.forEach(o=>{vals[o.id]=($('ob_'+o.id)||{}).value||'';if(!String(vals[o.id]).trim())missing=true});if(missing){alert('Please fill in what you observed.');return}submit(t,vals);render();return}
   if(k==='copy'){const t=T().find(x=>x.id===d.id);navigator.clipboard&&navigator.clipboard.writeText(defectText(t)).then(()=>{b.textContent='Copied ✓'});return}
   if(k==='finish'){A.view='result';save();render();return}
   if(k==='backtests'){A.view='test';save();render();return}
   if(k==='newattempt'){if(!confirm('Start a new attempt with a different mix of bugs? Your current progress will be replaced.'))return;fresh();frame();return}});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){const o=$('ov');o&&o.remove()}});
  $('fin').onclick=()=>{A.view='result';save();render()};
  window.LABRUN={A:()=>A,score,mod,submit:(id,vals)=>submit(T().find(t=>t.id===id),vals),Bset,save,render}}
 window.LABSTART=()=>{if(appId&&LA[appId])run(LA[appId]);else catalog()};
})();
