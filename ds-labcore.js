/* Shared helpers for the practice labs: statistics, tables, and a small task engine with hints and saved progress. */
(function(){
 const S=window.LAB={};
 S.sum=a=>a.reduce((x,y)=>x+y,0);
 S.mean=a=>a.length?S.sum(a)/a.length:NaN;
 S.sorted=a=>a.slice().sort((x,y)=>x-y);
 S.median=a=>{if(!a.length)return NaN;const s=S.sorted(a),n=s.length;return n%2?s[(n-1)/2]:(s[n/2-1]+s[n/2])/2};
 S.mode=a=>{const c={};a.forEach(v=>c[v]=(c[v]||0)+1);const m=Math.max(...Object.values(c));return Object.keys(c).filter(k=>c[k]===m).map(Number).sort((x,y)=>x-y)};
 S.range=a=>Math.max(...a)-Math.min(...a);
 S.ss=a=>{const m=S.mean(a);return S.sum(a.map(v=>(v-m)**2))};
 S.varP=a=>S.ss(a)/a.length; S.varS=a=>a.length>1?S.ss(a)/(a.length-1):NaN;
 S.sdP=a=>Math.sqrt(S.varP(a)); S.sdS=a=>Math.sqrt(S.varS(a));
 /* quartiles by the "median of the halves" method used in the lessons */
 S.quart=a=>{const s=S.sorted(a),n=s.length,h=Math.floor(n/2);const lo=s.slice(0,h),hi=s.slice(n%2?h+1:h);return{q1:S.median(lo),q2:S.median(s),q3:S.median(hi)}};
 S.fences=a=>{const q=S.quart(a),i=q.q3-q.q1;return{iqr:i,lo:q.q1-1.5*i,hi:q.q3+1.5*i}};
 S.outliers=a=>{const f=S.fences(a);return a.filter(v=>v<f.lo||v>f.hi)};
 S.corr=(x,y)=>{const mx=S.mean(x),my=S.mean(y);let sxy=0,sxx=0,syy=0;x.forEach((v,i)=>{sxy+=(v-mx)*(y[i]-my);sxx+=(v-mx)**2;syy+=(y[i]-my)**2});return sxy/Math.sqrt(sxx*syy)};
 S.reg=(x,y)=>{const mx=S.mean(x),my=S.mean(y);let sxy=0,sxx=0;x.forEach((v,i)=>{sxy+=(v-mx)*(y[i]-my);sxx+=(v-mx)**2});const b=sxy/sxx,a=my-b*mx;const sse=S.sum(x.map((v,i)=>(y[i]-(a+b*v))**2));const sst=S.ss(y);return{slope:b,intercept:a,r2:1-sse/sst}};
 S.round=(v,d)=>{const p=10**(d==null?2:d);return Math.round((v+Number.EPSILON)*p)/p};
 S.fmt=(v,d)=>Number.isFinite(v)?String(S.round(v,d==null?2:d)):'n/a';
 S.esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
 S.table=(rows,cols,opts)=>{opts=opts||{};const lim=opts.limit||rows.length;return '<div class="tw"><table><thead><tr>'+cols.map(c=>'<th>'+S.esc(c)+'</th>').join('')+'</tr></thead><tbody>'+rows.slice(0,lim).map(r=>'<tr>'+cols.map(c=>'<td>'+(r[c]==null?'<span class="mute">(missing)</span>':S.esc(r[c]))+'</td>').join('')+'</tr>').join('')+'</tbody></table></div>'+(rows.length>lim?'<div class="mute">Showing the first '+lim+' of '+rows.length+' rows.</div>':'')};
 /* Task engine. tasks: [{id, title, help, hint, auto:()=>bool} or {id, title, help, hint, ask:{label, expected:()=>value, tol, text}}]
    Auto tasks tick by themselves when the state is right. Ask tasks have an answer box and a Check button. Progress is saved per lab. */
 S.tasks=(el,lab,tasks)=>{
  const saved=(DS.progress().labs[lab])||{};const hintOn={};const msg={};
  const num=v=>parseFloat(String(v).replace(/[R,\s]/g,''));
  const draw=()=>{
   const done=tasks.filter(t=>saved[t.id]).length;
   el.innerHTML='<div class="row"><b>Tasks</b><span class="tag">'+done+' of '+tasks.length+' done</span></div><div class="bar" style="margin:6px 0 10px"><i style="width:'+Math.round(100*done/tasks.length)+'%"></i></div>'+tasks.map((t,i)=>{
    const d=!!saved[t.id];
    return '<div class="card" data-task="'+t.id+'" style="'+(d?'border-color:#11663f':'')+'"><h3 style="margin:0">'+(i+1)+'. '+S.esc(t.title)+(d?' <span class="tag" style="color:#11663f">done</span>':'')+'</h3><div>'+t.help+'</div>'+
     (t.ask?'<div class="row" style="margin-top:8px"><label for="a_'+t.id+'">'+S.esc(t.ask.label)+'</label><input id="a_'+t.id+'" type="text" inputmode="decimal" '+(t.ask.text?'':'')+' style="width:150px" value=""><button data-chk="'+t.id+'">Check</button></div>':'')+
     (msg[t.id]?'<div class="msg '+(msg[t.id].ok?'ok':'no')+'">'+S.esc(msg[t.id].t)+'</div>':'')+
     '<div style="margin-top:6px"><button data-hint="'+t.id+'">'+(hintOn[t.id]?'Hide hint':'Show a hint')+'</button></div>'+(hintOn[t.id]?'<div class="msg info">'+t.hint+'</div>':'')+'</div>'}).join('');
  };
  const mark=id=>{if(!saved[id]){saved[id]=true;DS.markLab(lab,id)}};
  const refresh=()=>{let ch=false;tasks.forEach(t=>{if(t.auto&&!saved[t.id]){let ok=false;try{ok=!!t.auto()}catch(e){}if(ok){mark(t.id);ch=true}}});if(ch||true)draw()};
  el.addEventListener('click',e=>{
   const h=e.target.closest('[data-hint]');if(h){hintOn[h.dataset.hint]=!hintOn[h.dataset.hint];const keep={};el.querySelectorAll('input[id^=a_]').forEach(i=>keep[i.id]=i.value);draw();Object.keys(keep).forEach(k=>{const i=document.getElementById(k);if(i)i.value=keep[k]});return}
   const c=e.target.closest('[data-chk]');if(c){const t=tasks.find(x=>x.id===c.dataset.chk);const raw=document.getElementById('a_'+t.id).value;let ok=false,exp=t.ask.expected();
    if(typeof exp==='number'){const v=num(raw);ok=Number.isFinite(v)&&Math.abs(v-exp)<=(t.ask.tol==null?0.01:t.ask.tol)}else{ok=String(raw).trim().toLowerCase()===String(exp).trim().toLowerCase()}
    msg[t.id]=ok?{ok:true,t:'Correct.'}:{ok:false,t:raw.trim()===''?'Type your answer first.':'Not quite. Work through it again, or open the hint.'};if(ok)mark(t.id);draw();const i=document.getElementById('a_'+t.id);if(i&&!ok)i.value=raw}});
  S.refresh=refresh;draw();refresh();return{refresh,saved};
 };
})();
