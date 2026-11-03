/* labkit.js: makes the three UAT practice apps (coffee, clinic, StockWatch) easier to use.
   1. Focus mode: the Tests tab shows ONE test at a time (with a small map of all tests).
   2. Extra information: reference material is tucked away in a drawer and collapsed sections.
   3. Automatic marking: instant feedback on each Pass/Fail call, and a marked scorecard at sign-off.
   It reads the app's own test list (TCS) and state. The truth is simple: a test linked to a planted bug SHOULD fail; every other test SHOULD pass. */
(function(){
 const page=(location.pathname.split('/').pop()||'').replace('.html','');
 const isW=typeof W!=='undefined'&&W&&W.res!==undefined;
 const st=()=>isW?W:S;
 const res=id=>(isW?W.res[id]:(S.results||{})[id])||{};
 const stat=id=>res(id).status||'Pending';
 const tab=()=>st().tab;
 const viewEl=()=>document.getElementById(isW?'wview':'view');
 const tabsEl=()=>document.getElementById(isW?'wtabs':'tabs');
 const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
 const KEY='labmarks-v1';let M;try{M=JSON.parse(localStorage.getItem(KEY))||{}}catch{M={}}M.p=M.p||{};const P=M.p[page]=M.p[page]||{tries:{},fb:{},focus:null,instant:true,best:null};P.coached=P.coached||{};
 const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(M))}catch{}};
 const tests=()=>typeof TCS!=='undefined'?TCS:[];
 const truth=t=>t.bug?'Fail':'Pass';
 const CO=window.COACH;const skillOf=t=>CO?CO.classify((t.title||'')+' '+(t.exp||'')+' '+(t.req||'')+' '+(t.bug?(()=>{try{const v=BUGS[t.bug];return Array.isArray(v)?v[0]:v}catch{return''}})():'')):'rule';
 const bugDesc=b=>{try{const v=BUGS[b];return Array.isArray(v)?v[0]:v}catch{return ''}};
 const css=document.createElement('style');css.textContent=`
 .lk-nav{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:10px 12px;margin-bottom:10px}
 .lk-nav .row{display:flex;gap:6px;flex-wrap:wrap;align-items:center}.lk-map{display:flex;gap:4px;flex-wrap:wrap;margin-top:8px}
 .lk-map button{min-width:34px;padding:3px 0;font-size:12.5px;border-radius:7px}.lk-map button.cur{outline:2px solid var(--blue,#2563eb)}
 .lk-map button.Pass{background:#16794a33}.lk-map button.Fail{background:#c0392b33}.lk-map button.Blocked{background:#b7791f33}
 .lk-fb{border-radius:10px;padding:10px 12px;margin-top:10px;font-size:15px}.lk-fb.ok{background:#16794a22;border:1px solid #16794a}.lk-fb.no{background:#c0392b1f;border:1px solid #c0392b}.lk-fb.info{background:#2563eb1a;border:1px solid #2563eb}
 .lk-det{margin-top:10px;border:1px dashed var(--line);border-radius:10px;padding:6px 10px}.lk-det summary{cursor:pointer;font-weight:600;color:var(--mute)}
 .lk-ov{position:fixed;inset:0;background:#000a;z-index:9998;display:flex;justify-content:flex-end}.lk-dr{background:var(--card,#fff);color:var(--ink);width:min(560px,100%);height:100%;overflow:auto;padding:14px 16px;border-left:1px solid var(--line)}
 .lk-dr details{border:1px solid var(--line);border-radius:10px;padding:6px 10px;margin:8px 0}.lk-dr summary{cursor:pointer;font-weight:700}
 .lk-score{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:12px 14px;margin:10px 0}.lk-score table{width:100%;border-collapse:collapse}.lk-score td,.lk-score th{border-bottom:1px solid var(--line);padding:4px 6px;text-align:left;font-size:14px}
 .lk-btn{font:inherit;cursor:pointer;border:1px solid var(--line);background:var(--card);color:var(--ink);padding:6px 12px;border-radius:9px;font-weight:600}
 .lk-big{font-size:30px;font-weight:800;line-height:1.1}`;
 document.head.appendChild(css);
 /* ---------- extra information drawer ---------- */
 const GLOSS=[['UAT','User Acceptance Testing: the people who will use the system check that it does what they need before it goes live.'],['Staging','A safe copy of the system for testing, so mistakes cannot hurt real customers.'],['Test case','One check with the exact steps you do (input) and what should happen (expected result).'],['Expected result','What the written rules say should happen. You compare what you SEE with this, letter by letter.'],['Actual result','What you really saw. Write what you saw, not what you think.'],['Pass','You saw exactly the expected result.'],['Fail','What you saw is different from the expected result. This is a defect (a bug).'],['Blocked','You cannot run the test (for example the feature is missing). Not the same as Fail.'],['Defect','A difference between expected and actual. A good defect report has a clear title, steps, expected, actual and severity.'],['Severity','How bad the problem is: Critical (money/data wrong or unusable), Major (a requirement broken, workaround exists), Minor (cosmetic).'],['Role','Who you are logged in as. Different people are allowed to see and do different things.']];
 function drawerHTML(){let h=`<div style="display:flex;justify-content:space-between;align-items:center"><h2 style="margin:0">Extra information</h2><button class="lk-btn" data-lk="close">Close ✕</button></div><div class="mute" style="color:var(--mute)">Everything that is not needed for the test in front of you lives here. Open only what you need.</div>`+`<label style="display:flex;gap:8px;align-items:center;margin:10px 0"><input type="checkbox" id="lk-instant" ${P.instant?'checked':''}> <b>Instant marking</b> (feedback after every test)</label>`;
  h+=`<details open><summary>How to run one test (4 steps)</summary><ol><li><b>Read</b> the steps and the expected result (twice).</li><li><b>Do</b> the steps in the app on the left, exactly as written.</li><li><b>Compare</b> what you see with the expected result, part by part.</li><li><b>Record</b> Pass, Fail or Blocked, and write the actual result.</li></ol></details>`;
  h+=`<details><summary>Automatic marking: how it works</summary><p>The app knows which tests are linked to a planted bug. After you press Pass, Fail or Blocked it checks your call. A test linked to a bug should <b>Fail</b>. Every other test should <b>Pass</b>. Passing a test with a bug is a <b>missed bug</b>. Failing a healthy test is a <b>false alarm</b>.</p><p>With instant marking ON you get feedback straight away, with a small hint first and the full answer after a few tries. With it OFF you work like in a real project and see the marks only at sign-off.</p></details>`;
  h+=`<details><summary>Words you will meet</summary><table style="width:100%">${GLOSS.map(g=>`<tr><td style="vertical-align:top;padding:4px 8px 4px 0"><b>${g[0]}</b></td><td>${esc(g[1])}</td></tr>`).join('')}</table></details>`;
  try{if(typeof BRIEF!=='undefined')h+=`<details><summary>About the system you are testing (briefing)</summary>${BRIEF.map(([hh,qs])=>`<h4 style="margin:10px 0 2px">${esc(hh)}</h4><table style="width:100%">${qs.map(([q,a])=>`<tr><td style="width:38%;vertical-align:top"><b>${q}</b></td><td>${a}</td></tr>`).join('')}</table>`).join('')}</details>`}catch{}
  try{if(typeof REQS!=='undefined')h+=`<details><summary>Requirements (acceptance criteria)</summary><table style="width:100%">${REQS.map(([id,t])=>`<tr><td style="width:70px"><b>${id}</b></td><td>${esc(t)}</td></tr>`).join('')}</table></details>`}catch{}
  return `<div class="lk-dr">${h}</div>`}
 function openDrawer(){closeDrawer();const o=document.createElement('div');o.className='lk-ov';o.id='lk-ov';o.innerHTML=drawerHTML();document.body.appendChild(o)}
 function closeDrawer(){const o=document.getElementById('lk-ov');if(o)o.remove()}
 /* ---------- marking ---------- */
 function mark(id,status){const t=tests().find(x=>x.id===id);if(!t)return;const tr=truth(t);P.tries[id]=(P.tries[id]||0)+1;const n=P.tries[id];let fb;
  if(status==='Blocked')fb={c:'info',t:'Blocked means something stops you from running the test at all (for example missing data or a missing feature). If you could run it, record Pass or Fail.'};
  else if(status===tr){fb=t.bug?{c:'ok',t:'Correct: this test exposes a real defect. '+esc(bugDesc(t.bug))+' Write it up clearly: steps, expected, actual.'}:{c:'ok',t:'Correct: this feature behaves as the expected result says. Good: not every test finds a bug, and a careful tester does not invent failures.'}}
  else if(status==='Pass'){fb=n<2?{c:'no',t:'Not quite. Something in this test does not match the expected result. Run it again slowly and compare every part with the expected result (numbers, wording, who can see what).'}:n<3?{c:'no',t:'Still not right. Hint: look closely at <b>'+esc(t.req||t.title)+'</b>: '+esc(t.title)+'. Compare it with the expected result character by character.'}:{c:'no',t:'The test fails because: '+esc(bugDesc(t.bug))+' It is a real bug. Next time, compare slowly and do not assume.'}}
  else{fb=n<2?{c:'no',t:'Careful: this may be a false alarm. Re-read the expected result and check you did the steps exactly. Do not report a failure unless what you saw really differs.'}:{c:'no',t:'This feature works as expected, so this was a false alarm. Check what exactly you compared. Inventing failures costs the team time.'}}
  P.fb[id]=fb;
  if(CO&&status!=='Blocked'&&!P.coached[id]&&(status===tr||n>=3)){P.coached[id]=1;CO.record(skillOf(t),status===tr)}
  save()}
 function score(){const T=tests();const run=T.filter(t=>['Pass','Fail'].includes(stat(t.id)));const bugT=T.filter(t=>t.bug);const found=bugT.filter(t=>stat(t.id)==='Fail');const missed=bugT.filter(t=>stat(t.id)!=='Fail');const fa=T.filter(t=>!t.bug&&stat(t.id)==='Fail');const correct=run.filter(t=>stat(t.id)===truth(t));
  const runPct=T.length?run.length/T.length:0,acc=run.length?correct.length/run.length:0;const pass=runPct>=.9&&found.length>=Math.ceil(bugT.length*.7)&&fa.length<=1;
  return{T,run,bugT,found,missed,fa,correct,runPct,acc,pass}}
 function scoreHTML(){const s=score();const reasons=[];if(s.runPct<.9)reasons.push(`Run more tests: ${s.run.length} of ${s.T.length} done (need 90%).`);if(s.found.length<Math.ceil(s.bugT.length*.7))reasons.push(`Find more bugs: ${s.found.length} of ${s.bugT.length} found (need ${Math.ceil(s.bugT.length*.7)}).`);if(s.fa.length>1)reasons.push(`Too many false alarms: ${s.fa.length} (maximum 1).`);
  return `<div class="lk-score"><h3 style="margin:0 0 4px">Automatic marking</h3><div class="lk-big">${s.pass?'PASS':'Not yet'}</div><div style="color:var(--mute);font-size:14px">${s.run.length}/${s.T.length} tests run · ${Math.round(s.acc*100)}% of your calls correct · bugs found ${s.found.length}/${s.bugT.length} · false alarms ${s.fa.length}</div>${s.pass?'<p>You ran nearly every test, found most of the planted bugs and invented almost no failures. That is a good UAT result.</p>':`<p><b>To pass:</b></p><ul>${reasons.map(r=>`<li>${r}</li>`).join('')||'<li>Keep going.</li>'}</ul>`}
  ${CO?CO.weakHTML():''}<details class="lk-det" open><summary>Test by test</summary><table><tr><th>Test</th><th>You</th><th>Should be</th><th></th></tr>${s.T.map(t=>{const u=stat(t.id),tr=truth(t),ok=u===tr;return `<tr><td>${esc(t.id)} ${esc(t.title)}</td><td>${u}</td><td>${tr}</td><td>${u==='Pending'?'—':ok?'':''}</td></tr>`}).join('')}</table></details>${s.missed.length?`<details class="lk-det"><summary>Bugs you have not found yet (${s.missed.length})</summary><ul>${s.missed.map(t=>`<li><b>${esc(t.id)}</b> ${esc(t.title)}: ${esc(bugDesc(t.bug))}</li>`).join('')}</ul></details>`:''}</div>`}
 function recordBest(){const s=score();if(!s.run.length)return;const cur={pass:s.pass,found:s.found.length,bugs:s.bugT.length,fa:s.fa.length,run:s.run.length,total:s.T.length,acc:s.acc,ts:Date.now()};if(!P.best||(cur.pass&&!P.best.pass)||(cur.pass===P.best.pass&&cur.found>=P.best.found))P.best=cur;save()}
 /* ---------- decorate the workbook ---------- */
 let busy=false;
 function decorate(){if(busy)return;const v=viewEl();if(!v)return;busy=true;try{
  const tb=tabsEl();if(tb&&!tb.querySelector('[data-lk=open]')){const b=document.createElement('button');b.dataset.lk='open';b.textContent='Extra info';b.type='button';b.style.marginLeft='auto';tb.appendChild(b)}
  const tb2=tab();
  if(tb2==='tests'){const cards=[...v.querySelectorAll('.tc')];const ids=cards.map(c=>(c.querySelector('h3')?.textContent.match(/TC-\d+/)||[])[0]);if(cards.length&&ids.every(Boolean)){
    if(!P.focus||!ids.includes(P.focus))P.focus=ids.find(i=>stat(i)==='Pending')||ids[0];
    cards.forEach((c,i)=>{const on=ids[i]===P.focus;c.style.display=on?'':'none';if(on&&!c.querySelector('.lk-fb,.lk-det')){const t=tests().find(x=>x.id===ids[i]);
      if(t){const det=document.createElement('details');det.className='lk-det';det.innerHTML=`<summary>Extra information about this test</summary><p><b>Requirement:</b> ${esc(t.req||'')} ${t.role?'· <b>You act as:</b> '+esc(t.role):''}</p><p>Compare what you <b>see</b> with the expected result, part by part. If one part is different, it is a Fail. Write the actual result in your own words (what you saw, not what you think).</p><p>More background: tap <b>Extra info</b> at the top.</p>`;c.appendChild(det)}
      const fb=P.fb[ids[i]];if(P.instant&&fb&&stat(ids[i])!=='Pending'){const d=document.createElement('div');d.className='lk-fb '+fb.c;d.innerHTML=fb.t;c.appendChild(d);
       if(CO){const tt=tests().find(x=>x.id===ids[i]);const ok=stat(ids[i])===truth(tt);const fin=ok?(tt.bug?'Found':'Pass'):(stat(ids[i])==='Pass'?'Missed':'Misread');const w=document.createElement('div');w.innerHTML=CO.coachHTML({skill:skillOf(tt),final:fin,tries:P.tries[ids[i]]||1,predOk:null});[...w.children].forEach(n=>c.appendChild(n))}}
      if(CO&&!c.querySelector('.co-plan')){const tt=tests().find(x=>x.id===ids[i]);const w=document.createElement('div');w.className='co-plan';w.innerHTML=CO.planHTML(skillOf(tt),stat(ids[i])==='Pending');const h3=c.querySelector('h3');if(h3&&h3.nextSibling)c.insertBefore(w,h3.nextSibling);else c.appendChild(w)}}});
    if(!v.querySelector('.lk-nav')){const nav=document.createElement('div');nav.className='lk-nav';const ix=ids.indexOf(P.focus);const done=ids.filter(i=>stat(i)!=='Pending').length;
     nav.innerHTML=`<div class="row"><b>Test ${ix+1} of ${ids.length}</b><span style="color:var(--mute);font-size:14px">${done} done</span><span style="flex:1"></span><button type="button" class="lk-btn" data-lk="prev" ${ix===0?'disabled':''}>← Previous</button><button type="button" class="lk-btn" data-lk="next" ${ix===ids.length-1?'disabled':''}>Next →</button></div><div class="lk-map">${ids.map((i,k)=>`<button type="button" class="lk-btn ${stat(i)} ${i===P.focus?'cur':''}" data-lk="go" data-id="${i}" title="${i}">${k+1}</button>`).join('')}</div>`;v.insertBefore(nav,v.firstChild)}}}
  else if(tb2==='brief'){const hs=[...v.querySelectorAll('h4')];hs.forEach(h=>{const tbl=h.nextElementSibling;if(tbl&&tbl.tagName==='TABLE'){const d=document.createElement('details');d.className='lk-det';const s=document.createElement('summary');s.textContent=h.textContent;d.appendChild(s);h.parentNode.insertBefore(d,h);d.appendChild(tbl);h.remove()}});
    if(hs.length&&!v.querySelector('.lk-fb.info')){const n=document.createElement('div');n.className='lk-fb info';n.innerHTML='<b>Short version:</b> you are the user checking that the system does what you need. Each section below opens when you tap it. You do not have to read it all before you start. Go to <b>Pre-flight</b>, then <b>Tests</b>: you will see <b>one test at a time</b>.';v.insertBefore(n,v.firstChild)}}
  if((tb2==='sign'||tb2==='report')&&!v.querySelector('.lk-score')){recordBest();v.insertAdjacentHTML('afterbegin',scoreHTML())}
 }finally{busy=false}}
 function wire(){const v=viewEl();if(!v)return;const mo=new MutationObserver(()=>{if(!busy){mo.disconnect();decorate();mo.observe(v,{childList:true})}});mo.observe(v,{childList:true});decorate()}
 document.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;const d=b.dataset;
  if(d.lk==='open'){openDrawer();return}if(d.lk==='close'){closeDrawer();return}
  if(d.lk==='go'||d.lk==='prev'||d.lk==='next'){const cards=[...viewEl().querySelectorAll('.tc')];const ids=cards.map(c=>(c.querySelector('h3')?.textContent.match(/TC-\d+/)||[])[0]);let ix=ids.indexOf(P.focus);if(d.lk==='go')ix=ids.indexOf(d.id);if(d.lk==='prev')ix=Math.max(0,ix-1);if(d.lk==='next')ix=Math.min(ids.length-1,ix+1);P.focus=ids[ix];save();
   const v=viewEl();v.querySelectorAll('.lk-nav').forEach(n=>n.remove());v.querySelectorAll('.lk-fb,.lk-det,.co-box,.co-plan').forEach(n=>{if(n.closest('.tc'))n.remove()});decorate();window.scrollTo({top:v.getBoundingClientRect().top+scrollY-70,behavior:'smooth'});return}
  if(d.set){const[id,s]=d.set.split('|');setTimeout(()=>{mark(id,s);const v=viewEl();if(v){v.querySelectorAll('.lk-nav').forEach(n=>n.remove());v.querySelectorAll('.tc .lk-fb,.tc .lk-det,.tc .co-box,.tc .co-plan').forEach(n=>n.remove());decorate()}},0)}
 },true);
 document.addEventListener('change',e=>{if(e.target.id==='lk-instant'){P.instant=e.target.checked;save();const v=viewEl();if(v){v.querySelectorAll('.lk-nav').forEach(n=>n.remove());v.querySelectorAll('.tc .lk-fb,.tc .lk-det,.tc .co-box,.tc .co-plan').forEach(n=>n.remove());decorate()}}});
 document.addEventListener('keydown',e=>{if(e.key==='Escape')closeDrawer()});
 window.LABKIT={score,mark,P,page};
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(wire,50));else setTimeout(wire,50);
})();
