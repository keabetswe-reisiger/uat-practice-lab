/* sqa-core.js: SQL Academy engine inside UAT Lab (ported from ~/sql-academy/common.js by build_sqa.py). Progress key: 'sqa-v1' (synced). */
/* SQL Academy shared engine: sql.js loader, fresh databases, safe runner, answer grader, progress, nav, start-here card */
(function(){
 const $=id=>document.getElementById(id);
 const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
 const KEY='sqa-v1';let ST={};try{ST=JSON.parse(localStorage.getItem(KEY))||{}}catch(e){ST={}}
 const save=()=>{try{if(window.SQA)ST.sum=SQA.summary(ST)}catch(e){}try{localStorage.setItem(KEY,JSON.stringify(ST))}catch(e){}};
 const get=(sec,id)=>((ST[sec]||{})[id]);
 const set=(sec,id,v)=>{ST[sec]=ST[sec]||{};ST[sec][id]=v;save()};
 const count=(sec,pred)=>Object.values(ST[sec]||{}).filter(pred||(x=>x&&x.ok)).length;
 let SQLP=null;
 const ready=()=>SQLP||(SQLP=initSqlJs({locateFile:f=>f}));
 /* a fresh copy of a teaching database every time, so no run can spoil another */
 async function open(key){const SQL=await ready();const db=new SQL.Database();db.run(window.DBS[key].sql);return db}
 /* run one or many statements; the LAST result set is what you see */
 function exec(db,sql){try{const r=db.exec(sql);const last=r.length?r[r.length-1]:{columns:[],values:[]};return{cols:last.columns,rows:last.values,changes:db.getRowsModified()}}catch(e){return{err:String(e.message||e)}}}
 const cell=v=>v===null?'NULL':(typeof v==='number'?String(Math.round(v*100)/100):String(v));
 function table(res,max){if(res.err)return '<div class="msg no">'+esc(res.err)+'</div>';if(!res.cols.length)return '<div class="msg info">Done. No rows to show'+(res.changes?' ('+res.changes+' row(s) changed)':'')+'.</div>';
  const rows=res.rows.slice(0,max||200);
  return '<div class="res"><table><tr>'+res.cols.map(c=>'<th>'+esc(c)+'</th>').join('')+'</tr>'+rows.map(r=>'<tr>'+r.map(v=>v===null?'<td><i>NULL</i></td>':'<td'+(typeof v==='number'?' class="n"':'')+'>'+esc(v)+'</td>').join('')+'</tr>').join('')+'</table></div><div class="mute">'+res.rows.length+' row(s)'+(res.rows.length>rows.length?', first '+rows.length+' shown':'')+'</div>'}
 const norm=(res,ordered)=>{const rows=res.rows.map(r=>JSON.stringify(r.map(cell)));return ordered?rows:rows.slice().sort()};
 /* grade: run the learner's SQL and the reference SQL on two fresh databases and compare what comes out */
 async function grade(q,user){
  const a=await open(q.db),b=await open(q.db);
  const ua=exec(a,user);if(ua.err)return{ok:false,msg:'SQLite says: '+ua.err,res:ua};
  const ra=exec(b,q.sol);if(ra.err)return{ok:false,msg:'Reference problem: '+ra.err,res:ua,broken:true};
  let U=ua,Rf=ra;
  if(q.check){U=exec(a,q.check);Rf=exec(b,q.check);if(U.err)return{ok:false,msg:'SQLite says: '+U.err,res:ua}}
  a.close();b.close();
  if(!U.cols.length&&!q.check)return{ok:false,msg:'Your statement ran but did not return any rows. Finish with a SELECT.',res:ua};
  if(U.cols.length!==Rf.cols.length)return{ok:false,msg:'Your answer has '+U.cols.length+' column(s) but '+Rf.cols.length+' are needed.',res:ua};
  if(U.rows.length!==Rf.rows.length)return{ok:false,msg:'Your answer returned '+U.rows.length+' row(s) but '+Rf.rows.length+' are expected. Check your WHERE, JOIN or GROUP BY.',res:ua};
  const x=norm(U,q.ordered),y=norm(Rf,q.ordered);
  for(let i=0;i<x.length;i++)if(x[i]!==y[i])return{ok:false,msg:'Right shape ('+U.cols.length+' column(s), '+U.rows.length+' row(s)) but some values differ'+(q.ordered?' or the order is wrong':'')+'. Compare with the data.',res:ua};
  return{ok:true,msg:'Correct. Your query gives the same result as the reference answer.',res:ua}}
 /* an editor + Run (+ Check) block */
 function editor(host,o){
  host.innerHTML='<textarea class="sql" spellcheck="false" autocapitalize="off" autocomplete="off" aria-label="SQL editor">'+esc(o.sql||'')+'</textarea><div class="row" style="margin:6px 0"><button class="pri" data-r="run">Run</button>'+(o.sol!==undefined||o.q?'<button data-r="check">Check my answer</button>':'')+'<button class="sm" data-r="reset">Reset</button><span class="mute">Ctrl+Enter runs</span></div><div data-r="out"></div>';
  const ta=host.querySelector('textarea'),out=host.querySelector('[data-r=out]');const start=o.sql||'';
  async function run(){out.innerHTML='<div class="mute">Running...</div>';const db=await open(o.db);const r=exec(db,ta.value);db.close();out.innerHTML=table(r);if(o.onRun)o.onRun(r,ta.value)}
  async function check(){const q=o.q||{db:o.db,sol:o.sol,check:o.check,ordered:o.ordered};out.innerHTML='<div class="mute">Checking...</div>';const g=await grade(q,ta.value);out.innerHTML=(g.res&&!g.res.err?table(g.res,12):'')+'<div class="msg '+(g.ok?'ok':'no')+'">'+esc(g.msg)+'</div>';if(o.onCheck)o.onCheck(g,ta.value)}
  host.addEventListener('click',e=>{const b=e.target.closest('[data-r]');if(!b)return;const k=b.dataset.r;if(k==='run')run();else if(k==='check')check();else if(k==='reset'){ta.value=start;out.innerHTML=''}});
  ta.addEventListener('keydown',e=>{if(e.key==='Enter'&&(e.ctrlKey||e.metaKey)){e.preventDefault();run()}});
  return{ta,run,check,set:v=>{ta.value=v}}}
 /* shared page frame */
 const PAGES=[['sqa-home.html','Modules'],['sqa-gym.html','Practice gym'],['sqa-projects.html','Case studies'],['sqa-exam.html','Interview prep'],['sqa-doctor.html','Query doctor'],['sqa-schema.html','Schema lab'],['sqa-cheatsheet.html','Cheatsheet'],['sqa-career.html','Career']];
 function frame(active){const h=document.createElement('header');h.innerHTML='<h1>SQL Academy</h1><span class="sp"></span>'+PAGES.map(p=>'<a href="'+p[0]+'"'+((p[0]===active||(active==='sqa-module.html'&&p[0]==='sqa-home.html'))?' aria-current="page"':'')+'>'+p[1]+'</a>').join('')+'<a href="uatlab.html#sqa">UAT Lab</a>';document.body.insertBefore(h,document.body.firstChild);
  if('serviceWorker' in navigator&&location.protocol.startsWith('http'))navigator.serviceWorker.register('sw.js').catch(()=>{})}
 /* the beginner layer every page opens with */
 function startHere(o){let closed=false;closed=((ST.misc||{}).sh)==='closed';return '<section class="card gold" aria-label="Start here"><details id="sh"'+(closed?'':' open')+'><summary class="sh">Start here</summary><p><b>In plain words.</b> '+o.plain+'</p><p><b>Coffee-shop picture.</b> '+o.coffee+'</p>'+(o.example?'<p><b>A tiny worked example.</b></p><pre class="code">'+esc(o.example)+'</pre>'+(o.exampleNote?'<p class="mute">'+o.exampleNote+'</p>':''):'')+(o.steps?'<p><b>Try it in four steps.</b></p><ol>'+o.steps.map(s=>'<li>'+s+'</li>').join('')+'</ol>':'')+(o.glossary?'<details class="g"><summary>Words you will meet</summary><table class="plain">'+o.glossary.map(g=>'<tr><th>'+g[0]+'</th><td>'+g[1]+'</td></tr>').join('')+'</table></details>':'')+'</details></section>'}
 document.addEventListener('toggle',e=>{if(e.target&&e.target.id==='sh'){ST.misc=ST.misc||{};ST.misc.sh=e.target.open?'open':'closed';save()}},true);
 /* schema viewer for a database */
 async function schemaHTML(key){const db=await open(key);const t=db.exec("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name")[0].values.map(r=>r[0]);let h='';t.forEach(n=>{const c=db.exec('PRAGMA table_info('+n+')')[0].values;const cnt=db.exec('SELECT COUNT(*) FROM '+n)[0].values[0][0];h+='<tr><th>'+n+' <span class="mute">('+cnt+' rows)</span></th><td>'+c.map(x=>x[1]+' <span class="mute">'+x[2].toLowerCase()+(x[5]?' key':'')+'</span>').join(', ')+'</td></tr>'});db.close();return '<table class="plain">'+h+'</table>'}
 /* multiple choice: item = [question, RIGHT, wrong..., explanation]; options are shuffled by a seed so the right answer moves around */
 function shuf(arr,seed){const a=arr.slice();let x=(seed*2654435761)>>>0||1;for(let i=a.length-1;i>0;i--){x=(Math.imul(x,1103515245)+12345)>>>0;const j=x%(i+1);[a[i],a[j]]=[a[j],a[i]]}return a}
 function mcq(host,item,seed,done){const opts=item.slice(1,-1);const order=shuf(opts.map((o,i)=>i),seed);let answered=false;
  host.innerHTML='<div><b>'+item[0]+'</b></div>'+order.map((k,i)=>'<button class="opt" data-k="'+k+'">'+opts[k]+'</button>').join('')+'<div class="why"></div>';
  host.addEventListener('click',e=>{const b=e.target.closest('.opt');if(!b||answered)return;answered=true;const ok=b.dataset.k==='0';b.classList.add(ok?'right':'wrong');if(!ok)host.querySelector('.opt[data-k="0"]').classList.add('right');host.querySelector('.why').innerHTML='<div class="msg '+(ok?'ok':'no')+'">'+(ok?'Correct. ':'Not quite. ')+item[item.length-1]+'</div>';if(done)done(ok)})}
 window.SA={PAGES,$,esc,get,set,count,save,ready,open,exec,table,grade,editor,frame,startHere,schemaHTML,mcq,shuf,state:()=>ST,KEY};
})();
