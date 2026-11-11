/* farmkit.js: builds a Farm Lab practice app module (same shape as uat-trainer/app-shop.js) from compact data.
   FARM.make({id,title,kind,level,blurb,about,p:'h',sections:[{id,name,items:[feature,...]}]})
   feature = [name, fieldLabels[], rule, out, calc, bug|0, testValues[]]
     out  = [label,'num',unit]  or  [label,'text',[all possible answers]]
     calc = v=>result            v = array of numbers typed in the boxes (strings for text outputs are not used)
     bug  = [what the bug does, hint, buggyCalc, type, severity]   (0 = control feature: no bug, only a control test)
   The expected value of a test is ALWAYS computed by calc() with no bug; the app shows buggyCalc() when that bug is active.
   Loading throws if a planted bug gives the same answer as the correct rule on the test values (so a bug can never be invisible). */
(function(){
 const r2=x=>Math.round((x+Number.EPSILON)*100)/100;
 const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
 const IDEA={Calculation:'Work the sum out by hand with simple numbers, then compare.',Boundary:'Test just below, exactly on, and just above the limit.',Rounding:'Use values that do not divide evenly and check the cents.',Rule:'Read the written rule and test the case it names.',Unit:'Check the units: kg or tonnes, ml or litres, days or weeks.',Validation:'Try values that the rules say must be refused.',Date:'Count the days on a calendar and check the first and last day.',Permission:'Check who is allowed to do this and who is not.'};
 function make(cfg){
  const feats=[];cfg.sections.forEach(sec=>sec.items.forEach((it,i)=>{const [name,fields,rule,out,calc,bug,vals]=it;feats.push({k:cfg.p+(feats.length+1),sec,name,fields,rule,out,calc,bug,vals})}));
  const fmt=(f,x)=>f.out[1]==='num'?String(r2(x)):String(x);
  const bugs={},tests=[];
  feats.forEach((f,i)=>{
   const good=f.calc(f.vals);
   if(f.out[1]==='num'&&!isFinite(good))throw new Error(cfg.id+' '+f.name+': normal answer is not a number');
   if(f.out[1]==='text'&&!f.out[2].includes(good))throw new Error(cfg.id+' '+f.name+': normal answer "'+good+'" is not in its answer list');
   let ob={id:'o1',label:f.out[0],type:f.out[1]==='num'?'number':'choice',key:f.k+'_r',expected:f.out[1]==='num'?r2(good):good};
   if(f.out[1]==='num'&&f.out[2])ob.unit=f.out[2];
   if(f.out[1]==='text')ob.choices=f.out[2].slice();
   if(f.bug){
    const [d,h,bc,t,sv]=f.bug;const bad=bc(f.vals);
    if(f.out[1]==='num'?Math.abs(r2(bad)-r2(good))<0.006:bad===good)throw new Error(cfg.id+' '+f.name+': the planted bug gives the same answer ('+good+') on the test values');
    if(f.out[1]==='text'&&!f.out[2].includes(bad))throw new Error(cfg.id+' '+f.name+': buggy answer "'+bad+'" is not in its answer list');
    bugs[f.k]={area:f.name,type:t||'Calculation',sev:sv||'Major',desc:d,hint:h,idea:IDEA[t||'Calculation']||IDEA.Calculation};
   }
   const typed=f.fields.map((lab,j)=>lab+' = '+f.vals[j]).join(', ');
   tests.push({id:'T'+(i+1),title:(f.bug?'':'Normal case: ')+f.name,bug:f.bug?f.k:null,
    why:(f.bug?'A rule that must always hold: ':'A control test, where nothing is wrong: ')+f.rule,
    steps:['Open the "'+f.sec.name+'" tab.','Find "'+f.name+'" and type: '+typed+'.','Press Calculate and read "'+f.out[0]+'".'],
    scenario:[['calc',f.k+'|'+f.vals.join('|')]],observe:[ob]});
  });
  const byK={};feats.forEach(f=>byK[f.k]=f);
  const MOD={id:cfg.id,group:'farm',title:cfg.title,icon:'',kind:cfg.kind,level:cfg.level,activeCount:20,blurb:cfg.blurb,bugs,
   extra:[{h:'About this app',html:cfg.about+'<p>Every rule below is a practice rule for this exercise. Real rates, limits and laws change, so never use these numbers for real farm decisions.</p>'},
    ...cfg.sections.map(sec=>({h:'Rules: '+sec.name,html:'<ul>'+feats.filter(f=>f.sec===sec).map(f=>'<li><b>'+esc(f.name)+':</b> '+esc(f.rule)+'</li>').join('')+'</ul>'})),
    {h:'How to test calculators',html:'<ul><li>Work the answer out yourself from the written rule before you press Calculate.</li><li>Type exactly the values in the steps, then read the result as shown.</li><li>Not every test hides a bug: a correct result is a pass, not a failure.</li></ul>'}],
   views:cfg.sections.map(s=>s.id),
   fresh:()=>({view:cfg.sections[0].id,in:{},res:{},err:{}}),
   read(s,B){const o={};feats.forEach(f=>{const v=s.res[f.k];o[f.k+'_r']=v===undefined?'No result yet':fmt(f,v)});return o},
   act(s,B,a,arg,ui){
    if(a==='view'){if(cfg.sections.some(x=>x.id===arg)){s.view=arg;return true}return false}
    if(a==='calc'){const parts=String(arg).split('|');const f=byK[parts[0]];if(!f)return false;
     const raw=parts.length>1?parts.slice(1):f.fields.map((_,j)=>ui&&ui.val?ui.val('f_'+f.k+'_'+j):'');
     s.in[f.k]=raw;const v=raw.map(x=>String(x).trim()===''?NaN:Number(String(x).replace(',','.')));
     if(v.length<f.fields.length||v.some(x=>isNaN(x))){delete s.res[f.k];s.err[f.k]='Type a number in every box.';return true}
     const use=(f.bug&&B.has(f.k))?f.bug[2]:f.calc;let r=use(v);
     if(f.out[1]==='num'&&!isFinite(r)){delete s.res[f.k];s.err[f.k]='That cannot be calculated.';return true}
     delete s.err[f.k];s.res[f.k]=r;return true}
    return false},
   render(s,B,ui){const sec=cfg.sections.find(x=>x.id===s.view)||cfg.sections[0];const R=MOD.read(s,B);
    const tabs=cfg.sections.map(x=>'<button class="'+(x.id===sec.id?'on':'')+'" data-act="view" data-arg="'+x.id+'">'+esc(x.name)+'</button>').join('');
    const body=feats.filter(f=>f.sec===sec).map(f=>'<div class="it" style="display:block"><b>'+esc(f.name)+'</b><div style="display:flex;gap:6px;flex-wrap:wrap;margin:6px 0">'+f.fields.map((lab,j)=>'<label style="font-size:13px">'+esc(lab)+'<br><input id="f_'+f.k+'_'+j+'" inputmode="decimal" style="width:120px" value="'+esc((s.in[f.k]||[])[j]===undefined?'':(s.in[f.k]||[])[j])+'"></label>').join('')+'</div><button class="go" data-act="calc" data-arg="'+f.k+'">Calculate</button> <span>'+esc(f.out[0])+': <b><span data-k="'+f.k+'_r">'+esc(R[f.k+'_r'])+'</span></b>'+(f.out[1]==='num'&&f.out[2]?' '+esc(f.out[2]):'')+'</span>'+(s.err[f.k]?'<div class="msg e">'+esc(s.err[f.k])+'</div>':'')+'</div>').join('');
    return '<div class="hd"><b>'+esc(cfg.title)+'</b><span>'+esc(sec.name)+'</span></div><div class="tb">'+tabs+'</div><div class="bd">'+body+'</div>'},
   tests};
  (window.LABAPPS=window.LABAPPS||{})[cfg.id]=MOD;return MOD}
 window.FARM={make,r2};
})();
