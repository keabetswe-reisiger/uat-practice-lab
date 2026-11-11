/* ds-module.js: renders one Data science module (ds-module.html?m=N) from ds-mods.js, ds-data.js and the lesson / question files.
   Sections: title and progress, Start here, outcomes, lessons (each with a quiz), applied practice (lab + guided exercises), checkpoint. */
(function(){
 const $=DS.$,esc=DS.esc;
 const LABS={pivot:['Pivot table lab','ds-lab-pivot.html','Summarise the sales table with pivots and check your totals.'],stats:['Statistics lab','ds-lab-stats.html','A calculator that shows its workings, plus tasks that check your own answers.'],clean:['Cleaning lab','ds-lab-clean.html','Find and fix the planted problems in a messy order table.'],chart:['Charting lab','ds-lab-chart.html','Build charts from the daily data and judge which chart fits the question.']};
 const mid=parseInt(new URLSearchParams(location.search).get('m'),10);
 const M=DSMODS.find(m=>m.id===mid);
 const root=$('v');
 if(!M){root.innerHTML='<div class="card"><h2>Module not found</h2><p>Choose a module on the <a href="ds-home.html">modules page</a>.</p></div>';return}
 document.title='Module '+M.id+': '+M.title+' | UAT Lab';
 const LS=M.lessons.map(DSL.byId),EX=DSEX['m'+M.id],START=DSSTART[M.id],POOL=DSQ.forModule(M.id);
 const hours=Math.round(LS.reduce((a,l)=>a+l.h,0)*2)/2;
 const open=new Set();let ans={};let msg={};let hintOn={};let run=null;let showRev=false;
 if(location.hash&&LS.some(l=>l.id===location.hash.slice(1)))open.add(location.hash.slice(1));
 const num=v=>{const x=parseFloat(String(v).replace(/[R%\s,]/g,''));return Number.isFinite(x)?x:NaN};
 const shufOpts=(texts,correct,seed)=>DS.rng(seed).shuf(texts.map(t=>({t,ok:t===correct})));
 const hashStr=s=>{let h=7;for(let i=0;i<s.length;i++)h=(h*31+s.charCodeAt(i))>>>0;return h||1};
 const tbl=rows=>{const cols=Object.keys(rows[0]);return '<div class="dtab" tabindex="0" role="region" aria-label="Practice data"><table><thead><tr>'+cols.map(c=>'<th>'+esc(c)+'</th>').join('')+'</tr></thead><tbody>'+rows.map(r=>'<tr>'+cols.map(c=>'<td>'+(r[c]==null||r[c]===''?'<i>empty</i>':esc(r[c]))+'</td>').join('')+'</tr>').join('')+'</tbody></table></div>'};
 /* ---------- sections ---------- */
 function head(P,s){
  const pre=M.prereq.length?'Works best after module'+(M.prereq.length>1?'s ':' ')+M.prereq.join(' and '):'No prerequisite';
  const done=P.have>=P.need;
  const step=(label,have,n,ok)=>`<span class="tag${ok?' ok':''}">${label} ${have} of ${n}</span>`;
  return `<div class="card"><div class="crumbs2"><a href="ds-home.html">All modules</a> / Module ${M.id}</div><h2>Module ${M.id}: ${esc(M.title)}</h2><p class="mute" style="margin:0 0 6px">${esc(M.desc)}</p>
  <div class="kv"><span>About <b>${hours} hours</b></span><span>${esc(pre)}</span><span>Progress <b>${P.have} of ${P.need}</b> steps</span></div>
  <div class="bar" role="img" aria-label="Module progress ${P.have} of ${P.need}"><i style="width:${Math.round(100*P.have/P.need)}%"></i></div>
  <div class="steps">${step('Lessons',P.les,P.lesN,P.les===P.lesN)}${step('Exercises',P.ex,P.exN,P.ex===P.exN)}${M.lab?step('Lab',P.lab,1,P.lab===1):''}${step('Checkpoint',P.chk,1,P.chk===1)}</div>
  ${done?'<div class="msg ok"><b>Module complete.</b> Every lesson, exercise'+(M.lab?', the lab':'')+' and the checkpoint are done.</div>':''}</div>`}
 function start(){const g=START.gl.map(x=>`<dt style="font-weight:700">${esc(x[0])}</dt><dd style="margin:0 0 6px">${esc(x[1])}</dd>`).join('');
  return `<h2 class="sec">Start here</h2><div class="card"><div class="lbl">In plain words</div><div class="plain">${esc(START.plain)}</div><div class="lbl">Coffee analogy</div><div class="cof">${esc(START.cof)}</div><div class="lbl">Worked example</div><div class="ex">${esc(START.ex)}</div><div class="lbl">Words to know</div><dl style="margin:0">${g}</dl><div class="lbl">Try it</div><ol style="margin:0;padding-left:20px">${START.tryit.map(t=>`<li>${esc(t)}</li>`).join('')}</ol></div>`}
 function outcomes(){return `<h2 class="sec">What you will be able to do</h2><div class="card"><ul style="margin:0;padding-left:20px">${M.outcomes.map(o=>`<li>${esc(o)}</li>`).join('')}</ul></div>`}
 function quizOf(l,s){const a=ans[l.id]||{};
  return `<div class="lbl">Quick quiz</div>`+l.q.map((q,qi)=>{const o=shufOpts(q[1],q[1][q[2]],hashStr(l.id)+qi*101);const pick=a[qi];
   return `<div style="margin:10px 0"><div><b>${qi+1}.</b> ${esc(q[0])}</div>${o.map((x,oi)=>`<button class="opt ${pick!=null?(x.ok?'right':(pick===oi?'wrong':'')):''}" data-lq="${l.id}|${qi}|${oi}" ${pick!=null?'disabled':''}>${esc(x.t)}</button>`).join('')}${pick!=null?`<div class="why">${o[pick].ok?'Correct. ':'Not quite. '}${esc(q[3])}</div>`:''}</div>`}).join('')}
 function lessonHTML(l,s){const p=s.les[l.id]||{};
  return `<details class="lsn${p.done?' done':''}" id="l-${l.id}" data-l="${l.id}" ${open.has(l.id)?'open':''}><summary>${esc(l.t)}</summary><div class="in"><div class="row"><span class="tag">${esc(l.lv)}</span><span class="tag">${esc(l.topic)}</span><span class="tag">about ${l.h} h</span></div>
  <div class="lbl">In plain words</div><div class="plain">${esc(l.plain)}</div><div class="lbl">Coffee analogy</div><div class="cof">${esc(l.cof)}</div><div class="lbl">Worked example</div><div class="ex" style="white-space:pre-wrap">${esc(l.ex)}</div>
  <div class="lbl">Words to know</div><dl style="margin:0">${l.gl.map(g=>`<dt style="font-weight:700">${esc(g[0])}</dt><dd style="margin:0 0 6px">${esc(g[1])}</dd>`).join('')}</dl>
  <div class="lbl">Try it</div><ol style="margin:0;padding-left:20px">${l.tryit.map(t=>`<li>${esc(t)}</li>`).join('')}</ol>${quizOf(l,s)}
  <div class="row" style="margin-top:10px"><button data-done="${l.id}">${p.done?'Mark as not done':'Mark this lesson as done'}</button>${p.best!=null?`<span class="mute">Best quiz score ${p.best} of 3</span>`:''}</div></div></details>`}
 function lessons(s){return `<h2 class="sec">Lessons</h2><p class="mute">${LS.length} lessons. Open one, read it, answer its quiz. A score of 2 out of 3 marks it done.</p>`+LS.map(l=>lessonHTML(l,s)).join('')}
 function exHTML(e,s){const done=!!s.ex[e.id];const m=msg[e.id];
  const data=e.data?`<details class="det"><summary style="min-height:44px;display:flex;align-items:center;cursor:pointer">Show the ${e.data} data for this exercise: ${esc(e.title.toLowerCase())}</summary>${tbl(DS_DATA[e.data])}</details>`:'';
  let input;
  if(e.type==='choice'){const ch=e.choices();const o=shufOpts(ch,e.answer(),hashStr(e.id));input=`<div>${o.map((x,oi)=>`<button class="opt ${m&&m.pick===oi?(m.ok?'right':'wrong'):''}" data-ex="${e.id}|${oi}" ${done?'disabled':''}>${esc(x.t)}</button>`).join('')}</div>`}
  else input=`<div class="row"><label for="in_${e.id}">Your answer${e.unit?' ('+esc(e.unit)+')':''}</label><input id="in_${e.id}" type="text" inputmode="decimal" style="width:150px" autocomplete="off"><button data-exn="${e.id}">Check</button></div>`;
  return `<div class="exr${done?' done':''}" data-exr="${e.id}"><h3>${esc(e.title)}${done?' <span class="tag ok">done</span>':''}</h3><div>${esc(e.task)}</div>${data}${input}${m?`<div class="msg ${m.ok?'ok':'no'}">${esc(m.t)}</div>`:''}${done&&!m?`<div class="mute">Solved earlier.</div>`:''}<div style="margin-top:6px"><button data-hint="${e.id}">${hintOn[e.id]?'Hide hint':'Show a hint'}</button></div>${hintOn[e.id]?`<div class="msg info">${esc(e.hint)}</div>`:''}</div>`}
 function practice(s){let h=`<h2 class="sec">Applied practice</h2>`;
  if(M.lab){const L=LABS[M.lab];const n=Object.keys((s.labs||{})[M.lab]||{}).length;
   h+=`<div class="card"><h3>${esc(L[0])}</h3><div>${esc(L[2])}</div><div class="mute" style="margin:6px 0">Solve ${DS.LABMIN} tasks to count the lab as done. Tasks solved so far: ${n}.</div><a class="btn" href="${L[1]}">Open the ${esc(L[0].toLowerCase())}</a></div>`}
  if(M.link)h+=`<div class="card"><h3>Practise SQL in the app</h3><div>The runnable SQL lessons, the practice gym and the data detective cases are already part of UAT Lab.</div><a class="btn" style="margin-top:6px" href="${esc(M.link.href)}">${esc(M.link.label)}</a></div>`;
  h+=`<p class="mute">Guided exercises use the pretend coffee business data. Answers are checked by the page and every figure is calculated from the data shown.</p>`+EX.map(e=>exHTML(e,s)).join('');return h}
 function checkpoint(s){const c=s.chk['m'+M.id]||{};const tries=c.tries||[];
  let h=`<h2 class="sec">Module checkpoint</h2><div class="card"><p>Ten questions drawn from ${POOL.length} on this module, explained afterwards. Pass mark: 80% (8 of 10). ${c.best!=null?`Your best so far: <b>${c.best}%</b>${c.best>=80?', passed':''}.`:'You have not tried it yet.'}</p>`;
  if(!run)h+=`<button class="pri" data-cp="start">${tries.length?'Try the checkpoint again':'Start the checkpoint'}</button>`;
  else if(run.done){const ok=run.items.filter(x=>x.o[x.a]&&x.o[x.a].ok).length,n=run.items.length,pct=Math.round(100*ok/n);
   h+=`<div class="msg ${pct>=80?'ok':'info'}"><b>${ok} out of ${n} (${pct}%).</b> ${pct>=80?'Checkpoint passed.':'Below 80%. Read the explanations, revisit the lessons and try again. The next attempt draws a different set.'}</div><div class="row"><button data-cp="start">Try again</button><button data-cp="review">${showRev?'Hide the review':'Review my answers'}</button></div>`;
   if(showRev)h+=run.items.map((x,i)=>`<div class="exr"><b>${i+1}. ${esc(x.q.q)}</b><div>Your answer: ${x.a==null?'<i>none</i>':esc(x.o[x.a].t)}${x.a!=null&&x.o[x.a].ok?' (correct)':''}</div>${x.a!=null&&x.o[x.a].ok?'':`<div>Correct answer: ${esc(x.q.c)}</div>`}<div class="why">${esc(x.q.why)}</div></div>`).join('')}
  else{const it=run.items[run.i];h+=`<div class="row" style="justify-content:space-between"><span class="tag">Question ${run.i+1} of ${run.items.length}</span><span class="tag">${esc(it.q.t)}</span></div><p style="font-size:17px;margin:10px 0"><b>${esc(it.q.q)}</b></p>${it.o.map((x,oi)=>`<button class="opt ${it.a===oi?'on':''}" data-cpa="${oi}" aria-pressed="${it.a===oi}">${esc(x.t)}</button>`).join('')}<div class="row" style="justify-content:space-between;margin-top:10px"><button data-cp="prev" ${run.i===0?'disabled':''}>Previous</button>${run.i===run.items.length-1?'<button class="pri" data-cp="finish">Finish and see the result</button>':'<button data-cp="next">Next</button>'}</div>`}
  if(tries.length&&(!run||run.done))h+=`<div class="lbl">Your attempts</div><div class="tw"><table><thead><tr><th>Date</th><th>Score</th><th>Percent</th></tr></thead><tbody>${tries.slice().reverse().slice(0,5).map(t=>`<tr><td>${new Date(t.ts).toLocaleString()}</td><td>${t.ok} / ${t.n}</td><td>${t.pct}%</td></tr>`).join('')}</tbody></table></div>`;
  return h+'</div>'}
 function nav(){const p=DSMODS.find(m=>m.id===M.id-1),n=DSMODS.find(m=>m.id===M.id+1);
  return `<div class="row" style="justify-content:space-between;margin-top:8px">${p?`<a class="btn" href="${p.href}">Previous: module ${p.id}</a>`:'<span></span>'}<a class="btn" href="ds-home.html">All modules</a>${n?`<a class="btn" href="${n.href}">Next: module ${n.id}</a>`:`<a class="btn" href="ds-exam.html">Exam practice</a>`}</div>`}
 function render(){const y=window.scrollY;const s=DS.state();const P=DS.moduleProgress(M,s);
  root.innerHTML=head(P,s)+start()+outcomes()+lessons(s)+practice(s)+checkpoint(s)+nav();window.scrollTo(0,y)}
 /* ---------- actions ---------- */
 document.addEventListener('toggle',e=>{const d=e.target.closest&&e.target.closest('details[data-l]');if(d){if(d.open)open.add(d.dataset.l);else open.delete(d.dataset.l)}},true);
 document.addEventListener('click',e=>{
  const lq=e.target.closest('[data-lq]');if(lq){const [id,qi,oi]=lq.dataset.lq.split('|');const l=DSL.byId(id);ans[id]=ans[id]||{};ans[id][+qi]=+oi;
   const a=ans[id];if(Object.keys(a).length===l.q.length){let ok=0;l.q.forEach((q,i)=>{const o=shufOpts(q[1],q[1][q[2]],hashStr(id)+i*101);if(o[a[i]].ok)ok++});const s=DS.state();const pr=s.les[id]||{};s.les[id]=Object.assign(pr,{best:Math.max(pr.best||0,ok),done:ok>=2||pr.done});DS.save(s)}
   open.add(id);render();return}
  const dn=e.target.closest('[data-done]');if(dn){const id=dn.dataset.done;const s=DS.state();const pr=s.les[id]||{};s.les[id]=Object.assign(pr,{done:!pr.done});DS.save(s);open.add(id);render();return}
  const h=e.target.closest('[data-hint]');if(h){hintOn[h.dataset.hint]=!hintOn[h.dataset.hint];const keep={};document.querySelectorAll('input[id^=in_]').forEach(i=>keep[i.id]=i.value);render();Object.keys(keep).forEach(k=>{const i=$(k);if(i)i.value=keep[k]});return}
  const ec=e.target.closest('[data-ex]');if(ec){const [id,oi]=ec.dataset.ex.split('|');const ex=EX.find(x=>x.id===id);const o=shufOpts(ex.choices(),ex.answer(),hashStr(id));const ok=o[+oi].ok;
   msg[id]={ok,pick:+oi,t:ok?'Correct. '+ex.why(ex.answer()):'Not quite. Open the hint and try another option.'};if(ok){const s=DS.state();s.ex[id]=true;DS.save(s)}render();return}
  const en=e.target.closest('[data-exn]');if(en){const id=en.dataset.exn;const ex=EX.find(x=>x.id===id);const raw=$('in_'+id).value;const v=num(raw),a=ex.answer();const ok=Number.isFinite(v)&&Math.abs(v-a)<=(ex.tol==null?0.01:ex.tol);
   msg[id]=ok?{ok:true,t:'Correct. '+ex.why(a)}:{ok:false,t:String(raw).trim()===''?'Type your answer first.':'Not quite. Work it out again from the data, or open the hint.'};if(ok){const s=DS.state();s.ex[id]=true;DS.save(s)}render();const i=$('in_'+id);if(i&&!ok)i.value=raw;return}
  const ca=e.target.closest('[data-cpa]');if(ca&&run&&!run.done){run.items[run.i].a=+ca.dataset.cpa;render();return}
  const cp=e.target.closest('[data-cp]');if(!cp)return;const k=cp.dataset.cp;
  if(k==='start'){const r=DS.rng((Date.now()%1e9)+11);const pick=r.shuf(POOL).slice(0,10);run={items:pick.map((q,i)=>({q,o:r.shuf([{t:q.c,ok:true}].concat(q.w.map(t=>({t,ok:false})))),a:null})),i:0,done:false};showRev=false}
  else if(k==='next')run.i++;else if(k==='prev')run.i--;
  else if(k==='review')showRev=!showRev;
  else if(k==='finish'){const un=run.items.filter(x=>x.a==null).length;if(un&&!confirm(un+' question(s) are unanswered. Finish anyway?'))return;run.done=true;const ok=run.items.filter(x=>x.o[x.a]&&x.o[x.a].ok).length,n=run.items.length,pct=Math.round(100*ok/n);
   const s=DS.state();const c=s.chk['m'+M.id]=s.chk['m'+M.id]||{tries:[]};c.tries=(c.tries||[]).concat([{ts:Date.now(),ok,n,pct}]).slice(-10);c.best=Math.max(c.best||0,pct);DS.save(s)}
  render()});
 render();
 if(location.hash&&$('l-'+location.hash.slice(1))){const el=$('l-'+location.hash.slice(1));el.scrollIntoView()}
 window.DSMOD={M,state:()=>({run,ans})};
})();
