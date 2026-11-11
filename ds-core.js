/* ds-core.js: shared helpers and saved progress for the Data science stage of UAT Lab.
   Everything is kept under ONE localStorage key, 'ds-v1' (always in try/catch; falls back to memory if storage is blocked).
   Shape: { les:{lessonId:{done,best}}, ex:{exerciseId:true}, labs:{lab:{taskId:true}}, chk:{m1:{best,tries:[{ts,ok,n,pct}]}},
            mock:[{ts,ok,total,pct,by}], misc:{}, sum:{ds_m1:{have,need}} }
   'sum' is rewritten on every save, so uatlab.html and today.js can show real progress without loading any lesson data. */
(function(){
 const KEY='ds-v1',LABMIN=5;let mem=null;
 const rd=()=>{if(mem)return mem;try{const v=JSON.parse(localStorage.getItem(KEY));return v&&typeof v==='object'?v:{}}catch(e){return {}}};
 const norm=s=>{s.les=s.les||{};s.ex=s.ex||{};s.labs=s.labs||{};s.chk=s.chk||{};s.mock=s.mock||[];s.misc=s.misc||{};s.sum=s.sum||{};return s};
 const DS=window.DS={
  LABMIN,
  esc(s){return String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]))},
  $(id){return document.getElementById(id)},
  /* seeded random: the same seed gives the same sequence */
  rng(seed){let a=seed>>>0||1;const r=()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296};r.int=(x,y)=>x+Math.floor(r()*(y-x+1));r.shuf=x=>{x=x.slice();for(let i=x.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[x[i],x[j]]=[x[j],x[i]]}return x};return r},
  state(){return norm(rd())},
  save(s){norm(s);if(window.DSMODS)s.sum=DS.summary(s);try{localStorage.setItem(KEY,JSON.stringify(s));mem=null;return true}catch(e){mem=s;return false}},
  /* old data-lab API, used by the copied practice labs */
  progress(){const s=DS.state();return{lessons:s.les,labs:s.labs,exam:s.mock}},
  markLesson(id,patch){const s=DS.state();s.les[id]=Object.assign(s.les[id]||{},patch);DS.save(s)},
  markLab(lab,task){const s=DS.state();s.labs[lab]=s.labs[lab]||{};s.labs[lab][task]=true;DS.save(s)},
  get(k,d){const s=DS.state();return s.misc[k]===undefined?d:s.misc[k]},
  set(k,v){const s=DS.state();s.misc[k]=v;DS.save(s)},
  labDone(s,lab){return Object.keys((s.labs||{})[lab]||{}).length>=LABMIN},
  /* progress of one module: lessons done + exercises right + lab done + checkpoint passed */
  moduleProgress(m,s){s=s||DS.state();const les=(m.lessons||[]).filter(id=>(s.les[id]||{}).done).length;
   const exIds=Array.from({length:m.ex||0},(_,k)=>'m'+m.id+'e'+(k+1));const ex=exIds.filter(id=>s.ex[id]).length;
   const lab=m.lab?(DS.labDone(s,m.lab)?1:0):0;const c=(s.chk['m'+m.id]||{});const chk=(c.best||0)>=80?1:0;
   const need=(m.lessons||[]).length+exIds.length+(m.lab?1:0)+1;
   return{les,lesN:(m.lessons||[]).length,ex,exN:exIds.length,lab,labN:m.lab?1:0,chk,chkN:1,have:les+ex+lab+chk,need}},
  summary(s){const o={};(window.DSMODS||[]).forEach(m=>{const p=DS.moduleProgress(m,s);o['ds_m'+m.id]={have:p.have,need:p.need}});return o}
 };
 if('serviceWorker' in navigator&&location.protocol.startsWith('http')){try{navigator.serviceWorker.register('sw.js').catch(()=>{})}catch(e){}}
})();
