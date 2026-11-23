/* ticketcheck.js: "Is my observation correct?" for tickets (full ticket page and the docked panel).
   Tickets do not run a real app we can inspect, so this compares what the tester WROTE with the ticket's expected result
   (keyword check) and always shows the correct step-by-step version to compare with. It is a coach, not a judge. */
(function(){
 const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
 const STOP=new Set('the a an and or of to in on at is are was were be been it its this that with for from by as no not any all each every then than so if when your you can will should must into out up down over under'.split(' '));
 const stem=w=>w.replace(/(ing|ed|es|s|ly)$/,'');
 const words=t=>(String(t||'').toLowerCase().match(/[a-z0-9]+/g)||[]).filter(w=>w.length>2&&!STOP.has(w)).map(stem);
 const PROB=/\b(blank|error|crash|crashed|fail|failed|wrong|missing|nothing|stuck|broken|empty|incorrect|duplicate|freez|froze|bug|unable|cannot|can't|cant|doesn't|doesnt|didn't|didnt|not (work|open|show|load|display|appear|save|update)|no (content|data|message))\b/i;
 /* Judge only what the tester says they SAW: text after the last "actual", with any "expected ..." sentence or "(it should ...)" bracket removed,
    so a report that lists the expected result AND the actual result is not mistaken for describing the expected result. */
 const stripExp=(a,exp)=>{exp=String(exp||'').trim();if(exp.length<12)return a;try{return a.replace(new RegExp(exp.replace(/[.*+?^${}()|[\]\\]/g,'\\$&').replace(/\s+/g,'\\s+'),'gi'),' ')}catch(e){return a}};
 function seen(a0,exp){const a=stripExp(a0,exp);let r=a;const am=[...a.matchAll(/actual(\s*results?)?/gi)];if(am.length)r=a.slice(am[am.length-1].index+am[am.length-1][0].length);
  r=r.replace(/\(\s*(it |this |that |they )?(should|must|expected)\b[^]*$/i,' ');
  r=r.split(/(?<=[.!?])\s+|\n/).map(sn=>{return sn.replace(/\bexpect(ed|s)?\b[^]*?(?=\b(but|however|yet|although|instead)\b|$)/i,' ')}).join(' ');
  return r.replace(/[^a-z0-9]/gi,'')?r:a0}
 function judge(t,x){
  const a0=String(x.actual||'').trim();const a=a0?(seen(a0,t.expected).trim()||a0):a0;
  if(!a)return{c:'info',h:'Write what you saw first.',b:'Type exactly what you saw in the box above, even if it matches the expected result. Then this check compares it with the expected result.'};
  const ew=[...new Set(words(t.expected))],aw=new Set(words(a));
  const hit=ew.length?ew.filter(w=>aw.has(w)).length/ew.length:0;
  const awf=new Set(words(a0)),hitFull=ew.length?ew.filter(w=>awf.has(w)).length/ew.length:0; /* hit = words in what they SAW; hitFull = words anywhere in their text */
  const NEG=/\b(no|without|zero)\s+\w+/gi,PG=new RegExp(PROB.source,'gi');
  const pw=txt=>(String(txt).replace(NEG,' ').match(PG)||[]).map(m=>m.toLowerCase());
  const expOk=new Set(pw(t.expected));
  const prob=pw(a).some(m=>!expOk.has(m));
  let r;
  if(prob&&hit<0.5)r={c:'ok',h:'Your result describes a problem.',b:'If that is really what you saw, <b>Fail</b> is the right call. Make sure you say <b>which step</b>, <b>what you saw</b> and <b>what you expected</b> so a developer can repeat it.'};
  else if(!prob&&hitFull>=0.3)r={c:'ok',h:'Your result matches the expected result.',b:'If you followed every step and saw this each time, <b>Pass</b> is the right call. Also tick the acceptance criteria you checked.'};
  else r={c:'no',h:'Your result is not clear enough yet.',b:'It neither clearly matches the expected result nor names a specific problem. Run the steps again and write what you saw after <b>each</b> step (for example: &ldquo;Step 3: Patients tab opened with a list of 4 names&rdquo;).'};
  const s=x.status;
  if(s==='Passed'&&prob&&hit<0.5)r.b+='<br><b>But you marked it Passed.</b> Your words describe a problem. Check again before you sign off.';
  if(s==='Failed'&&!prob&&hit>=0.5)r.b+='<br><b>But you marked it Failed.</b> Your words match the expected result. Is there really a defect? If not, mark it Passed.';
  return r}
 function html(t,x,W){
  W=W||(window.TEACH||{})[t.key]||{};const j=judge(t,x||{});
  const rows=t.steps.map((s,i)=>`<li><b>Do:</b> ${esc(s)}${W.stepwhy&&W.stepwhy[i]?`<div class="tc-see"><b>You should see / why:</b> ${esc(W.stepwhy[i])}</div>`:''}</li>`).join('');
  const open=(x&&(String(x.actual||'').trim()||x.status==='Passed'||x.status==='Failed'))?' open':'';
  return `<div class="tc-fb tc-${j.c}"><b>${j.h}</b> ${j.b}<div class="tc-n">This is a word check against the expected result. It cannot see the app, so you still decide.</div></div>`+
   `<details class="tc-det"${open}><summary>Steps to compare with yours (correct version)</summary><ol>${rows}<li><b>Compare:</b> Expected result: ${esc(t.expected)}${W.bug?`<br><span class="tc-n">A bug could look like: ${esc(W.bug)}</span>`:''}</li></ol></details>`}
 const css=document.createElement('style');css.textContent='.tc-fb{border-left:4px solid #98a2b3;background:#f3f4f6;color:#16202f;padding:8px 10px;border-radius:6px;margin:8px 0;font-size:14px}.tc-fb.tc-ok{border-color:#11663f;background:#e7f4ec}.tc-fb.tc-no{border-color:#c0392b;background:#fdecea}.tc-n{color:#4a5568;font-size:12.5px;margin-top:4px}.tc-det{border:1px dashed #b8c0cc;border-radius:8px;padding:6px 10px;margin:8px 0}.tc-det summary{cursor:pointer;font-weight:600}.tc-det ol{margin:8px 0 4px 18px;padding:0}.tc-det li{margin-bottom:8px}.tc-see{color:#4a5568;font-size:13.5px;margin-top:2px}';
 document.head.appendChild(css);
 window.TICKETCHECK={html,judge};
})();
