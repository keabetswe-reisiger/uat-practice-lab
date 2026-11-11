/* sqa-module.js: one SQL Academy module (sqa-module.html?m=1..9). Four tabs: Overview, Lessons, Practice, Checkpoint.
   Lessons reuse the SQL Academy lesson player; practice embeds the graded gym question or links to the lab; the checkpoint is 10 questions, pass 80%. */
(function(){
 const SA=window.SA,$=SA.$,esc=SA.esc,M=window.SQAMODS,LS=window.LESSONS,G=window.GYM;
 SA.frame('sqa-module.html');
 const qs=new URLSearchParams(location.search);let mid=+qs.get('m')||1;if(!M.find(x=>x.id===mid))mid=1;
 const mod=M.find(x=>x.id===mid);const lessons=mod.lessons.map(id=>LS.find(l=>l.id===id));
 const TABS=[['overview','Overview'],['lessons','Lessons'],['practice','Practice'],['checkpoint','Checkpoint']];
 let tab='overview',cur=lessons[0].id,exCur=null,cp=null;
 const h=location.hash.slice(1);if(/^L\d\d$/.test(h)&&mod.lessons.includes(h)){tab='lessons';cur=h}else if(TABS.some(t=>t[0]===h))tab=h;
 const prog=()=>SQA.progress(mod,SA.state());
 const bar=(a,b)=>'<div class="bar" style="margin:4px 0"><i style="width:'+(b?Math.round(100*a/b):0)+'%"></i></div>';
 const EXLAB={gym:'Practice gym question',schema:'Schema lab scenario',doctor:'Query doctor case',chal:'Timed challenge',proj:'Case-study step'};
 function exInfo(spec){const[k,id]=spec.split(':');
  if(k==='gym'){const g=G.find(x=>x.id===id);return{k,id,title:g.title,sub:g.topic+' · '+g.level,ok:SQA.lookup(SA.state(),spec)}}
  if(k==='schema'){const s=window.SCHEMAS.find(x=>x.id===id);return{k,id,title:s.title,sub:EXLAB[k],ok:SQA.lookup(SA.state(),spec),href:'sqa-schema.html'}}
  if(k==='doctor'){const d=window.DOCTOR.find(x=>x.id===id);return{k,id,title:d.title,sub:EXLAB[k],ok:SQA.lookup(SA.state(),spec),href:'sqa-doctor.html'}}
  if(k==='chal'){const c=window.CHALLENGES.find(x=>x.id===id);return{k,id,title:c.title,sub:EXLAB[k]+', '+c.minutes+' minutes',ok:SQA.lookup(SA.state(),spec),href:'sqa-exam.html'}}
  const p=window.PROJECTS.find(x=>id.startsWith(x.id+'-'));const s=p.steps.find(x=>x.id===id);return{k,id,title:p.title+', step '+id.split('-')[1],sub:EXLAB[k],ok:SQA.lookup(SA.state(),spec),href:'sqa-projects.html'}}
 function head(){const p=prog();const i=M.indexOf(mod);
  return '<h2 class="pt">Module '+mod.id+' of '+M.length+': '+esc(mod.title)+'</h2><div class="row"><span class="tag '+mod.level+'">'+mod.level+'</span><span class="tag">about '+mod.hours+' hours</span><span class="tag">Prerequisite: '+esc(mod.prereq)+'</span><span class="sp"></span><a class="btn" href="sqa-home.html">All modules</a></div>'
  +'<div class="card"><div class="row"><b>'+p.have+' of '+p.need+' steps done</b><span class="mute">'+p.les+' of '+p.lesN+' lessons · '+p.ex+' of '+p.exN+' exercises · checkpoint '+(p.chk?'passed':'not passed yet')+'</span></div>'+bar(p.have,p.need)
  +'<div class="row" role="tablist" style="margin-top:8px">'+TABS.map(t=>'<button role="tab" data-tab="'+t[0]+'" aria-selected="'+(tab===t[0])+'" class="'+(tab===t[0]?'pri':'')+'">'+t[1]+'</button>').join('')+'</div></div>'}
 function overview(){const p=prog();const nx=lessons.find(l=>!((SA.get('lessons',l.id)||{}).ok));
  return SA.startHere(mod.start)+'<div class="card"><h3>What you will be able to do</h3><ul>'+mod.outcomes.map(o=>'<li>'+esc(o)+'</li>').join('')+'</ul></div>'
  +'<div class="card"><h3>What is in this module</h3><ul><li>'+p.lesN+' lessons. Each has the idea in plain words, a worked example you can run, a task and a three-question quiz.</li><li>'+p.exN+' practice exercises that the computer marks.</li><li>A 10-question checkpoint. You need 8 right to pass.</li></ul>'
  +'<p class="mute">Already know SQL basics? Try the checkpoint first. The eight short lessons in the <a href="sql-lab.html#learn">SQL lab</a> are a gentler first step if this is your first time.</p>'
  +'<div class="row"><button class="pri" data-go="lessons" data-l="'+(nx?nx.id:lessons[0].id)+'">'+(p.les?'Continue with the lessons':'Start the first lesson')+'</button><button data-go="practice">Go to practice</button><button data-go="checkpoint">Go to the checkpoint</button></div></div>'}
 function lessonSide(){return '<h4>Lessons in this module</h4>'+lessons.map(l=>'<button data-lid="'+l.id+'" class="'+(l.id===cur?'on ':'')+(((SA.get('lessons',l.id)||{}).ok)?'done':'')+'">'+l.id.slice(1)+'. '+esc(l.t)+'</button>').join('')}
 function lessonsView(){return '<div class="layout"><aside class="side" id="side" aria-label="Lessons in this module">'+lessonSide()+'</aside><div id="lesson"></div></div>'}
 async function showLesson(){const i=lessons.findIndex(l=>l.id===cur),l=lessons[i];const st=SA.get('lessons',l.id)||{try:false,q:{}};
  const sol=typeof l.sol==='string'?{sql:l.sol}:l.sol;
  $('lesson').innerHTML='<div class="card"><div class="row"><h3 style="margin:0">'+l.id.slice(1)+'. '+l.t+'</h3><span class="tag '+l.lv+'">'+l.lv+'</span></div>'
  +'<h4>In plain words</h4><p>'+l.plain+'</p><h4>The coffee-shop picture</h4><p>'+l.cof+'</p>'
  +'<h4>Worked example</h4><p class="mute">Press Run. Then change the query and run it again.</p><div id="ex"></div><p class="mute">'+l.exNote+'</p>'
  +'<details class="g"><summary>The data this lesson uses ('+esc(DBS[l.db].title)+')</summary><div id="sch">Loading...</div></details>'
  +'<h4>Now you try</h4><p>'+l.task+'</p><div id="try"></div><div id="ref"></div>'
  +'<h4>Three-question quiz</h4><div id="quiz"></div>'
  +'<div class="row" style="margin-top:14px"><button id="prev" '+(i===0?'disabled':'')+'>Previous lesson</button><span class="sp"></span>'+(i===lessons.length-1?'<button id="next" class="pri" data-go="practice">On to the practice</button>':'<button id="next" class="pri">Next lesson</button>')+'</div></div>';
  SA.editor($('ex'),{db:l.db,sql:l.ex});SA.schemaHTML(l.db).then(x=>{if($('sch'))$('sch').innerHTML=x});
  const upd=()=>{const qOk=Object.values(st.q||{}).filter(x=>x).length;st.ok=!!st.try&&qOk>=2;SA.set('lessons',l.id,st);$('side').innerHTML=lessonSide();refreshHead()};
  const task={db:l.db,sol:sol.sql,check:sol.check,ordered:/ORDER BY/i.test(sol.sql)};let fails=0;
  SA.editor($('try'),{db:l.db,sql:'',q:task,onCheck:g=>{if(g.ok){st.try=true;upd()}else{fails++;if(fails>=2&&!$('ref').innerHTML)$('ref').innerHTML='<details class="g" open><summary>Stuck? One way to write it</summary><pre class="code">'+esc(sol.sql)+'</pre></details>'}}});
  $('quiz').innerHTML=l.quiz.map((q,k)=>'<div class="card" id="qz'+k+'"></div>').join('');
  l.quiz.forEach((q,k)=>SA.mcq($('qz'+k),q,LS.indexOf(l)*7+k+1,ok=>{st.q=st.q||{};st.q[k]=ok;upd()}));
  $('prev').onclick=()=>goLesson(lessons[i-1].id);if(i<lessons.length-1)$('next').onclick=()=>goLesson(lessons[i+1].id)}
 function goLesson(id){cur=id;history.replaceState(null,'','#'+id);$('side').innerHTML=lessonSide();showLesson();window.scrollTo(0,0)}
 /* practice */
 function practiceView(){const ex=mod.ex.map(exInfo);
  return '<div class="card"><h3>Practice exercises</h3><p class="mute">Solve each one to count it. The computer runs your query and the reference answer and compares the results, so any correct query passes.</p><table class="plain" style="width:100%">'
  +ex.map((e,i)=>'<tr><td>'+(e.ok?'Done':'Not yet')+'</td><td><b>'+esc(e.title)+'</b><br><span class="mute">'+esc(e.sub)+'</span></td><td>'+(e.k==='gym'?'<button data-ex="'+i+'">'+(i===exCur?'Showing below':'Open here')+'</button>':'<a href="'+e.href+'">Open the '+(e.k==='schema'?'Schema lab':e.k==='doctor'?'Query doctor':e.k==='chal'?'interview prep':'case studies')+'</a>')+'</td></tr>').join('')+'</table></div><div id="exq"></div>'}
 function showEx(i){exCur=i;const e=exInfo(mod.ex[i]);if(e.k!=='gym')return;const g=G.find(x=>x.id===e.id);const st=SA.get('gym',g.id)||{ok:false,tries:0};
  $('exq').innerHTML='<div class="card"><div class="row"><h3 style="margin:0">'+esc(g.title)+'</h3><span class="tag '+g.level+'">'+g.level+'</span><span class="tag">'+esc(DBS[g.db].title)+'</span></div><p>'+g.prompt+'</p>'+(g.ordered?'<p class="mute">The order of the rows matters here.</p>':'')+(g.check?'<p class="mute">This question changes data. Your statement is checked by looking at the data afterwards.</p>':'')
  +'<details class="g"><summary>Tables in this database</summary><div id="sch">Loading...</div></details><div id="ed"></div><div class="row" style="margin-top:8px"><button id="hint">Hint</button><button id="ans">Show a model answer</button></div><div id="hh"></div></div>';
  SA.schemaHTML(g.db).then(x=>{if($('sch'))$('sch').innerHTML=x});
  SA.editor($('ed'),{db:g.db,sql:'',q:{db:g.db,sol:g.sol,check:g.check,ordered:g.ordered},onCheck:r=>{st.tries=(st.tries||0)+1;if(r.ok)st.ok=true;SA.set('gym',g.id,st);refreshHead();redrawPractice(i)}});
  $('hint').onclick=()=>{$('hh').innerHTML='<div class="msg info"><b>Hint:</b> '+g.hint+'</div>'};
  $('ans').onclick=()=>{if(!st.tries&&!confirm('Try first? Seeing the answer straight away teaches much less. Show it anyway?'))return;$('hh').innerHTML='<div class="msg info"><b>One model answer:</b><pre class="code">'+esc(g.sol)+'</pre></div>'}}
 function redrawPractice(i){const tbl=$('body').querySelector('.card');if(tbl){const tmp=document.createElement('div');tmp.innerHTML=practiceView();tbl.replaceWith(tmp.firstChild)}}
 /* checkpoint */
 function pool(){const items=[];lessons.forEach(l=>l.quiz.forEach(q=>items.push(q)));(window.EXAM||[]).filter(e=>mod.topics.includes(e.topic)).forEach(e=>items.push([e.q].concat(e.o,[e.why])));return items}
 function newCheckpoint(){const seed=(Date.now()%1e9)+mod.id;const items=SA.shuf(pool(),seed).slice(0,10);cp={items,seed,res:{}};return cp}
 function checkpointView(){const c=(SA.state().chk||{})['m'+mod.id]||{};
  const last=(c.tries||[]).slice(-3).reverse();
  if(!cp)return '<div class="card"><h3>Module checkpoint</h3><p>Ten questions drawn from this module. You need <b>8 right</b> (80%) to pass. You can retake it as often as you like, and the questions change each time.</p>'
   +'<p>Best so far: <b>'+(c.best===undefined?'not tried':c.best+'%')+'</b>'+(c.best>=80?' (passed)':'')+'</p>'+(last.length?'<table class="plain"><tr><th>Try</th><th>Score</th></tr>'+last.map(t=>'<tr><td>'+new Date(t.ts).toLocaleString()+'</td><td>'+t.ok+' of '+t.n+' ('+t.pct+'%)</td></tr>').join('')+'</table>':'')
   +'<div class="row" style="margin-top:10px"><button class="pri" data-start="1">Start the checkpoint</button></div></div>';
  return '<div class="card"><h3>Checkpoint questions</h3><p class="mute">Answer all ten. Each answer is explained straight away.</p><div id="cpq"></div><div class="row" style="margin-top:10px"><span id="cpn" class="mute"></span><span class="sp"></span><button class="pri" id="cpfin" disabled>See my score</button></div></div><div id="cpres"></div>'}
 function mountCheckpoint(){if(!cp||!$('cpq'))return;$('cpq').innerHTML=cp.items.map((q,k)=>'<div class="card" id="cq'+k+'"></div>').join('');
  const upd=()=>{const n=Object.keys(cp.res).length;$('cpn').textContent=n+' of 10 answered';$('cpfin').disabled=n<10};
  cp.items.forEach((q,k)=>SA.mcq($('cq'+k),q,cp.seed+k*13,ok=>{cp.res[k]=ok;upd()}));upd();
  $('cpfin').onclick=()=>{const ok=Object.values(cp.res).filter(x=>x).length;const pct=ok*10;const st=SA.state();st.chk=st.chk||{};const c=st.chk['m'+mod.id]||{best:0,tries:[]};c.tries=(c.tries||[]).concat([{ts:Date.now(),ok,n:10,pct}]).slice(-20);c.best=Math.max(c.best||0,pct);st.chk['m'+mod.id]=c;SA.save();refreshHead();
   $('cpres').innerHTML='<div class="card '+(pct>=80?'gold':'')+'"><h3>'+(pct>=80?'Checkpoint passed':'Not passed yet')+'</h3><p><b>'+ok+' of 10</b> ('+pct+'%). '+(pct>=80?'Well done. This module now counts as complete when its lessons and exercises are done too.':'You need 8 right. Re-read the lessons you found hard and try again: the questions change.')+'</p><div class="row"><button class="pri" data-start="1">Try again with new questions</button><button data-go="lessons" data-l="'+lessons[0].id+'">Back to the lessons</button>'+(mod.id<M.length&&pct>=80?'<a href="sqa-module.html?m='+(mod.id+1)+'">On to module '+(mod.id+1)+'</a>':'')+'</div></div>';$('cpfin').disabled=true;$('cpres').scrollIntoView({behavior:'smooth'})}}
 /* frame */
 function refreshHead(){const t=$('head');if(t)t.innerHTML=head()}
 function draw(){$('v').innerHTML='<div id="head">'+head()+'</div><div id="body"></div>';drawBody()}
 function drawBody(){const b=$('body');
  if(tab==='overview')b.innerHTML=overview();
  else if(tab==='lessons'){b.innerHTML=lessonsView();showLesson()}
  else if(tab==='practice'){b.innerHTML=practiceView();if(exCur!==null)showEx(exCur)}
  else{b.innerHTML=checkpointView();mountCheckpoint()}}
 function go(t,l){tab=t;if(l)cur=l;history.replaceState(null,'','#'+(t==='lessons'?cur:t));$('head').innerHTML=head();drawBody();window.scrollTo(0,0)}
 document.addEventListener('click',e=>{
  const t=e.target.closest('[data-tab]');if(t){go(t.dataset.tab);return}
  const g=e.target.closest('[data-go]');if(g){go(g.dataset.go,g.dataset.l);return}
  const l=e.target.closest('[data-lid]');if(l){goLesson(l.dataset.lid);return}
  const x=e.target.closest('[data-ex]');if(x){showEx(+x.dataset.ex);redrawPractice(+x.dataset.ex);$('exq').scrollIntoView({behavior:'smooth'});return}
  const s=e.target.closest('[data-start]');if(s){newCheckpoint();$('body').innerHTML=checkpointView();mountCheckpoint();window.scrollTo(0,0)}});
 document.title='Module '+mod.id+': '+mod.title+' | SQL Academy | UAT Lab';
 SA.ready().then(draw);
})();
