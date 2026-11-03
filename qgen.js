/* Question generators for the ISTQB-style K3 (apply) questions and the technique trainers.
   Every answer is computed by code, so it cannot be mistyped. Seeded: same seed = same question. */
(function(){
 const mul=a=>()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296};
 const R=seed=>{const r=mul(seed>>>0||1);r.int=(a,b)=>a+Math.floor(r()*(b-a+1));r.pick=a=>a[Math.floor(r()*a.length)];r.shuf=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};return r};
 const uniq=a=>[...new Set(a)];
 /* make a 4-option question from a correct answer text and wrong texts; returns shuffled */
 const build=(r,meta,q,right,wrongs,why)=>{wrongs=uniq(wrongs.filter(w=>w!==right));while(wrongs.length<3)wrongs.push(right+' ('+(wrongs.length+2)+')');const all=r.shuf([right,...wrongs.slice(0,3)]);return Object.assign({},meta,{q,o:all,a:all.indexOf(right),why,gen:true})};
 const nearNums=(r,n,fmt=x=>String(x),lo=0)=>{const s=new Set([n]);let tries=0;while(s.size<4&&tries++<50){const d=r.pick([-3,-2,-1,1,2,3,4]);if(n+d>=lo)s.add(n+d)}let k=1;while(s.size<4)s.add(n+10*k++);return [...s].map(fmt)};
 const T={};

 /* ---------- 4.2.1 equivalence partitioning ---------- */
 T.ep_count=r=>{ // minimum tests to cover all partitions once
  const item=r.pick(['cups in one order','kilograms of beans in a delivery','loyalty points redeemed','number of guests on a booking']);
  const lo=r.int(1,5),b1=lo+r.int(4,9),b2=b1+r.int(5,15),hi=b2+r.int(10,30);
  const invalidToo=r.int(0,1)===1;const valid=3;const n=invalidToo?valid+2:valid;
  const q=`A system accepts ${item} from ${lo} to ${hi}. The price rule has three bands: ${lo}–${b1-1} (no discount), ${b1}–${b2-1} (5% off) and ${b2}–${hi} (10% off).${invalidToo?' Values below '+lo+' or above '+hi+' are rejected with an error.':' Only valid values are to be tested.'}\nUsing equivalence partitioning, what is the MINIMUM number of test cases needed to cover every ${invalidToo?'valid and invalid ':'valid '}partition at least once?`;
  const why=`Partitions: ${invalidToo?'below '+lo+' (invalid), ':''}${lo}–${b1-1}, ${b1}–${b2-1}, ${b2}–${hi}${invalidToo?', above '+hi+' (invalid)':''}. That is ${n} partitions, and one test per partition is the minimum, so ${n}.`;
  return build(r,{ch:4,lo:'FL-4.2.1',k:'K3',tag:'EP'},q,String(n),nearNums(r,n,String,1).filter(x=>x!==String(n)),why)};
 T.ep_set=r=>{ // which set of inputs achieves 100% EP coverage
  const lo=r.int(1,4),b1=lo+r.int(3,8),b2=b1+r.int(4,10),hi=b2+r.int(6,15);
  const P=[[-1e9,lo-1,'below '+lo],[lo,b1-1,'band 1'],[b1,b2-1,'band 2'],[b2,hi,'band 3'],[hi+1,1e9,'above '+hi]];
  const inP=(v,i)=>v>=P[i][0]&&v<=P[i][1];
  const pickIn=i=>{const a=Math.max(P[i][0],lo-6),b=Math.min(P[i][1],hi+6);return r.int(a,b)};
  const right=P.map((_,i)=>pickIn(i));
  const wrongs=[];for(let k=0;k<3;k++){const s=right.slice();const i=r.int(0,4);let j=(i+r.int(1,4))%5;s[i]=pickIn(j);wrongs.push(s)}
  const fmt=s=>r.shuf(s).join(', ');
  const cover=s=>P.every((_,i)=>s.some(v=>inP(v,i)));
  const ok=[right,...wrongs];if(!cover(right)||wrongs.some(cover))return T.ep_set(R(r.int(1,1e9)));
  return build(r,{ch:4,lo:'FL-4.2.1',k:'K3',tag:'EP'},`Valid quantities are ${lo} to ${hi}. The three bands are ${lo}–${b1-1}, ${b1}–${b2-1} and ${b2}–${hi}. Anything outside ${lo}–${hi} is invalid.\nWhich set of test inputs achieves 100% equivalence partitioning coverage of ALL partitions (valid and invalid)?`,fmt(right),wrongs.map(fmt),`There are five partitions: below ${lo}, ${lo}–${b1-1}, ${b1}–${b2-1}, ${b2}–${hi} and above ${hi}. Only the correct set has at least one value in each. Each wrong set misses at least one partition (it has two values in the same partition instead).`)};

 /* ---------- 4.2.2 boundary value analysis ---------- */
 const bva2=(lo,hi)=>[lo-1,lo,hi,hi+1];
 const bva3=(lo,hi)=>[lo-1,lo,lo+1,hi-1,hi,hi+1];
 T.bva_set=r=>{
  const three=r.int(0,1)===1;const item=r.pick(['order quantity','number of guests','coffee strength setting','loyalty card stamps']);
  const lo=r.int(2,9),hi=lo+r.int(8,25);const set=(three?bva3:bva2)(lo,hi).sort((a,b)=>a-b);
  const mk=a=>r.shuf(a).sort((x,y)=>x-y).join(', ');
  const w1=(three?bva2:bva3)(lo,hi); // wrong technique
  const w2=set.map(v=>v===lo-1?lo-2:v===hi+1?hi+2:v); // not the closest neighbours
  const w3=[lo,lo+1,hi-1,hi,Math.floor((lo+hi)/2)]; // inside only
  const q=`A field accepts whole-number ${item} from ${lo} to ${hi}. Using ${three?'three-value':'two-value'} boundary value analysis, which set of test values is correct? (Take the lowest and highest valid values as the boundary values.)`;
  const why=`${three?'Three-value BVA tests each boundary value and both of its neighbours: '+(lo-1)+', '+lo+', '+(lo+1)+' and '+(hi-1)+', '+hi+', '+(hi+1)+'.':'Two-value BVA tests each boundary value and the closest value in the neighbouring partition: '+(lo-1)+', '+lo+', '+hi+', '+(hi+1)+'.'} The other sets use the other variant, skip the nearest outside values, or only test inside the range.`;
  return build(r,{ch:4,lo:'FL-4.2.2',k:'K3',tag:'BVA'},q,mk(set),[mk(w1),mk(w2),mk(w3)],why)};
 T.bva_count=r=>{
  const three=r.int(0,1)===1;const oneSided=r.int(0,3)===0;const lo=r.int(2,12),hi=lo+r.int(10,40);
  const n=oneSided?(three?3:2):(three?6:4);
  const q=oneSided?`A discount applies only to customers aged ${lo} or older (no upper limit; ages below ${lo} get no discount). Using ${three?'three-value':'two-value'} boundary value analysis, how many test values are needed? (The boundary value is the lowest valid age.)`:`A booking form accepts a party size from ${lo} to ${hi}. Using ${three?'three-value':'two-value'} boundary value analysis, how many test values are needed? (Take the lowest and highest valid values as the boundary values.)`;
  const why=oneSided?`There is one boundary (${lo}). ${three?'Three-value: '+(lo-1)+', '+lo+', '+(lo+1)+' = 3 tests.':'Two-value: '+(lo-1)+' and '+lo+' = 2 tests.'}`:`There are two boundaries (${lo} and ${hi}). ${three?'Three-value gives 3 per boundary but the ones inside do not overlap here: '+(lo-1)+', '+lo+', '+(lo+1)+', '+(hi-1)+', '+hi+', '+(hi+1)+' = 6.':'Two-value gives 2 per boundary: '+(lo-1)+', '+lo+', '+hi+', '+(hi+1)+' = 4.'}`;
  return build(r,{ch:4,lo:'FL-4.2.2',k:'K3',tag:'BVA'},q,String(n),nearNums(r,n,String,1).filter(x=>x!==String(n)),why)};

 /* ---------- 4.2.3 decision tables ---------- */
 T.dt_rules=r=>{
  const n=r.pick([2,3,3,4]);const conds=['customer has a loyalty card','order is over R100','it is happy hour','customer pays by card'].slice(0,n);
  const total=Math.pow(2,n);
  return build(r,{ch:4,lo:'FL-4.2.3',k:'K3',tag:'Decision table'},`A shop's discount depends on ${n} yes/no conditions: ${conds.join('; ')}.\nA full (uncollapsed) decision table lists every combination of the conditions (assume every combination is feasible). How many rules (columns) does it have?`,String(total),nearNums(r,total,String,1).filter(x=>x!==String(total)).concat([String(n*2),String(n*n)]),`Each condition can be yes or no, so the number of combinations is 2 to the power of ${n} = ${total}.`)};
 T.dt_action=r=>{
  const card=r.int(0,1),big=r.int(0,1),happy=r.int(0,1);
  const rule=r.int(0,2);
  const rules=[
   {txt:'A customer gets a 10% discount ONLY IF they have a loyalty card AND the order is over R100. Otherwise no discount.',f:(c,b,h)=>c&&b?'10% discount':'No discount'},
   {txt:'A customer gets a free cookie IF it is happy hour, OR IF they have a loyalty card AND the order is over R100. Otherwise no cookie.',f:(c,b,h)=>(h||(c&&b))?'Free cookie':'No cookie'},
   {txt:'A customer gets free delivery IF the order is over R100 AND (they have a loyalty card OR it is happy hour). Otherwise delivery is charged.',f:(c,b,h)=>(b&&(c||h))?'Free delivery':'Delivery charged'}][rule];
  const ans=rule===0?rules.f(card,big,happy):rules.f(card,big,happy);const all=rule===0?['10% discount','No discount']:rule===1?['Free cookie','No cookie']:['Free delivery','Delivery charged'];
  const yn=v=>v?'yes':'no';
  const opts=all.concat(rule===0?['5% discount','Free cookie']:rule===1?['Free delivery','10% discount']:['10% discount','Free cookie']);
  return build(r,{ch:4,lo:'FL-4.2.3',k:'K3',tag:'Decision table'},`Business rule: ${rules.txt}\nA test uses these inputs: loyalty card = ${yn(card)}, order over R100 = ${yn(big)}, happy hour = ${yn(happy)}.\nWhat is the expected outcome?`,ans,opts,`Apply the rule to the inputs (card ${yn(card)}, over R100 ${yn(big)}, happy hour ${yn(happy)}). The rule gives: ${ans}.`)};

 /* ---------- 4.2.4 state transition ---------- */
 const MACH=[
  {name:'order',states:['New','Paid','Brewing','Served'],ev:[['New','pay','Paid'],['Paid','start','Brewing'],['Brewing','finish','Served'],['Paid','refund','New'],['New','cancel','New']]},
  {name:'loyalty card',states:['Blank','Active','Gold','Blocked'],ev:[['Blank','register','Active'],['Active','earn10','Gold'],['Gold','lose','Active'],['Active','report','Blocked'],['Gold','report','Blocked'],['Blocked','unblock','Active']]},
  {name:'coffee machine',states:['Off','Ready','Brewing','Error'],ev:[['Off','power','Ready'],['Ready','brew','Brewing'],['Brewing','done','Ready'],['Brewing','jam','Error'],['Error','reset','Off'],['Ready','power','Off']]}];
 const step=(m,s,e)=>{const t=m.ev.find(x=>x[0]===s&&x[1]===e);return t?t[2]:null};
 const table=m=>m.ev.map(t=>t[0]+' --'+t[1]+'--> '+t[2]).join('\n');
 T.st_next=r=>{
  const m=r.pick(MACH);const t=r.pick(m.ev);
  const s=t[0];const evs=uniq(m.ev.map(x=>x[1]));const e=r.pick(evs);const nx=step(m,s,e);
  const ans=nx===null?'No change: the event is invalid in this state':nx;
  const opts=m.states.filter(x=>x!==nx).concat(nx===null?[]:['No change: the event is invalid in this state']);
  return build(r,{ch:4,lo:'FL-4.2.4',k:'K3',tag:'State transition'},`The ${m.name} behaves like this (valid transitions only):\n${table(m)}\nThe ${m.name} is in state "${s}" and the event "${e}" happens. What is the result?`,ans,opts,`Look for a transition from "${s}" with event "${e}". ${nx===null?'There is none, so the event is invalid in this state and nothing changes.':'It leads to "'+nx+'".'}`)};
 T.st_cov=r=>{
  const m=r.pick(MACH);const states=m.states;let cur=m.ev[0][0];const seq=[];const used=new Set();const visited=new Set([cur]);
  const len=r.int(3,5);for(let i=0;i<len;i++){const outs=m.ev.filter(x=>x[0]===cur);if(!outs.length)break;const t=r.pick(outs);seq.push(t[1]);used.add(t[0]+'|'+t[1]);cur=t[2];visited.add(cur)}
  const tot=m.ev.length,u=used.size;const kind=r.int(0,1);
  const q=`The ${m.name} behaves like this:\n${table(m)}\nA test starts in "${m.ev[0][0]}" and applies these events in order: ${seq.join(', ')}.\n${kind?'How many DIFFERENT valid transitions does this test exercise?':'How many DIFFERENT states does this test visit (including the start state)?'}`;
  const n=kind?u:visited.size;
  return build(r,{ch:4,lo:'FL-4.2.4',k:'K3',tag:'State transition'},q,String(n),nearNums(r,n,String,1).filter(x=>x!==String(n)),kind?`Follow the events and count each different transition used once: ${[...used].map(x=>x.replace('|',' on ')).join('; ')} = ${u}. (The machine has ${tot} valid transitions in total.)`:`Visited states: ${[...visited].join(', ')} = ${visited.size}.`)};

 /* ---------- 4.3 statement / branch coverage ---------- */
 T.code_cov=r=>{
  const a=r.int(3,9),b=r.int(2,8);const hasElse2=r.int(0,1)===1;
  const code=`1  READ x, y\n2  IF x > ${a} THEN\n3     total = total + 1\n4  END IF\n5  IF y < ${b} THEN\n6     discount = 5\n7  ${hasElse2?'ELSE\n8     discount = 0\n9  ':''}END IF\n${hasElse2?'10':'8'} PRINT total, discount`;
  const stmts=[{id:1,t:'always'},{id:3,t:'if1'},{id:6,t:'if2T'},...(hasElse2?[{id:8,t:'if2F'}]:[]),{id:'p',t:'always'}];
  const total=stmts.length;const tests=[];const nt=r.int(1,3);for(let i=0;i<nt;i++)tests.push([r.int(a-3,a+3),r.int(b-3,b+3)]);
  const ex=new Set(),br=new Set();tests.forEach(([x,y])=>{ex.add(1);ex.add('p');if(x>a){ex.add(3);br.add('1T')}else br.add('1F');if(y<b){ex.add(6);br.add('2T')}else{br.add('2F');if(hasElse2)ex.add(8)}});
  const sc=stmts.filter(s=>s.t==='always'||ex.has(s.id)).length;const bc=br.size;
  const frac=(n,d)=>`${n}/${d}`;const right=`Statement ${frac(sc,total)}, branch ${frac(bc,4)}`;
  const wrongs=[`Statement ${frac(Math.min(total,sc+1),total)}, branch ${frac(bc,4)}`,`Statement ${frac(sc,total)}, branch ${frac(Math.min(4,bc+1)===bc?Math.max(0,bc-1):Math.min(4,bc+1),4)}`,`Statement ${frac(Math.max(1,sc-1),total)}, branch ${frac(bc===1?2:bc-1,4)}`];
  return build(r,{ch:4,lo:'FL-4.3.2',k:'K2',tag:'Coverage'},`Consider this pseudo-code:\n${code}\nTests run (x, y): ${tests.map(t=>'('+t.join(', ')+')').join(', ')}.\nWhat coverage do these tests achieve? (Statements are the executable lines 1, 3, ${hasElse2?'6, 8':'6'} and the final PRINT; there are 4 branches: each IF true and false.)`,right,wrongs,`Run each test: x > ${a} decides if line 3 runs; y < ${b} decides line 6 (true) or ${hasElse2?'line 8 (false)':'nothing (false: no else)'}. Statements executed: ${sc} of ${total}. Branch outcomes taken: ${[...br].join(', ')} = ${bc} of 4.`)};

 /* ---------- 5.1.4 estimation ---------- */
 T.est_3pt=r=>{
  const a=r.int(4,12),m=a+r.int(2,8),b=m+r.int(3,15);const E=(a+4*m+b)/6,sd=(b-a)/6;const askSd=r.int(0,2)===0;
  const f=x=>(Math.round(x*10)/10).toFixed(1);const n=askSd?sd:E;
  const q=`Testers estimate the effort to test a new feature in person-days: most optimistic ${a}, most likely ${m}, most pessimistic ${b}.\nUsing three-point estimation (E = (a + 4m + b) / 6, standard deviation = (b − a) / 6), what is the ${askSd?'standard deviation':'estimate E'}? (one decimal)`;
  const ops=askSd?[f(sd),f(E),f((a+b)/2),f((b-a)/3)]:[f(E),f((a+m+b)/3),f((a+b)/2),f(m)];
  return build(r,{ch:5,lo:'FL-5.1.4',k:'K3',tag:'Estimation'},q,f(n),ops,`E = (${a} + 4×${m} + ${b}) / 6 = ${f(E)}. Standard deviation = (${b} − ${a}) / 6 = ${f(sd)}.`)};
 T.est_ratio=r=>{
  const dev=r.pick([60,80,90,120,150,200]),pa=r.pick([[3,2],[2,1],[4,3],[5,2]]);
  const right=dev/pa[0]*pa[1];
  const q=`On past projects, development effort and test effort followed a ratio of ${pa[0]}:${pa[1]}. The new project's development effort is estimated at ${dev} person-days.\nUsing a ratio-based (metrics-based) estimate, what test effort should be planned?`;
  const f=x=>(Math.round(x*10)/10)+' person-days';
  return build(r,{ch:5,lo:'FL-5.1.4',k:'K3',tag:'Estimation'},q,f(right),[f(dev*pa[0]/pa[1]),f(dev*pa[1]),f(dev+right),f(dev/pa[1])],`Test effort = development × (${pa[1]} / ${pa[0]}) = ${dev} × ${pa[1]}/${pa[0]} = ${f(right)}.`)};

 T.est_extrap=r=>{
  const v=[r.int(8,20),r.int(8,20),r.int(8,20)];const avg=(v[0]+v[1]+v[2])/3;const f=x=>(Math.round(x*10)/10).toFixed(1);
  return build(r,{ch:5,lo:'FL-5.1.4',k:'K3',tag:'Estimation'},`In the last three iterations the test effort was ${v[0]}, ${v[1]} and ${v[2]} person-days. The team estimates the next iteration by extrapolation, using the average of the last three iterations.\nWhat test effort (person-days, one decimal) should be planned?`,f(avg),[f(v[2]),f((v[0]+v[2])/2),f(v[0]+v[1]+v[2]),f(Math.max(...v))],`Average = (${v[0]} + ${v[1]} + ${v[2]}) / 3 = ${f(avg)}.`)};
 /* ---------- 5.1.5 prioritisation ---------- */
 T.prio_risk=r=>{
  const names=['T1','T2','T3','T4','T5'];const lv=['High','Medium','Low'];
  const tests=names.map(n=>({n,risk:r.pick(lv),dep:null}));
  const a=r.int(1,4);const b=r.int(0,a-1);tests[a].dep=names[b]; // tests[a] needs tests[b] first
  const rank={High:0,Medium:1,Low:2};
  const done=new Set(),order=[];const pool=tests.slice();
  while(pool.length){const avail=pool.filter(t=>!t.dep||done.has(t.dep));avail.sort((x,y)=>rank[x.risk]-rank[y.risk]||x.n.localeCompare(y.n));const t=avail[0];order.push(t.n);done.add(t.n);pool.splice(pool.indexOf(t),1)}
  const right=order.join(' → ');
  const noDep=tests.slice().sort((x,y)=>rank[x.risk]-rank[y.risk]||x.n.localeCompare(y.n)).map(t=>t.n);
  const rev=tests.slice().sort((x,y)=>rank[y.risk]-rank[x.risk]||x.n.localeCompare(y.n));const wrongs=[noDep.join(' → '),rev.map(t=>t.n).join(' → '),names.join(' → '),order.slice().reverse().join(' → ')];
  if(noDep.join()===order.join())return T.prio_risk(R(r.int(1,1e9)));
  return build(r,{ch:5,lo:'FL-5.1.5',k:'K3',tag:'Prioritisation'},`Five test cases have these risk levels: ${tests.map(t=>t.n+' = '+t.risk).join(', ')}. ${tests[a].n} cannot run until ${tests[a].dep} has been executed.\nUsing risk-based prioritisation (highest risk first, ties by number) and respecting the dependency, which execution order is correct?`,right,wrongs,`Order by risk (High, then Medium, then Low), but ${tests[a].n} must wait until ${tests[a].dep} has run. Result: ${right}.`)};
 T.prio_cov=r=>{
  const reqs=['R1','R2','R3','R4','R5','R6'];const tests=['A','B','C','D'].map(n=>({n,c:new Set(r.shuf(reqs).slice(0,r.int(2,4)))}));
  const covd=new Set(),order=[];const pool=tests.slice();
  while(pool.length){pool.sort((x,y)=>[...y.c].filter(z=>!covd.has(z)).length-[...x.c].filter(z=>!covd.has(z)).length||x.n.localeCompare(y.n));const t=pool.shift();order.push(t.n);t.c.forEach(z=>covd.add(z))}
  const right=order.join(' → ');const alt=tests.slice().sort((x,y)=>x.c.size-y.c.size||x.n.localeCompare(y.n)).map(t=>t.n).join(' → ');
  const wrongs=[tests.map(t=>t.n).join(' → '),alt,order.slice().reverse().join(' → '),[order[1],order[0],...order.slice(2)].join(' → ')];
  return build(r,{ch:5,lo:'FL-5.1.5',k:'K3',tag:'Prioritisation'},`Four tests cover these requirements: ${tests.map(t=>t.n+' = {'+[...t.c].sort().join(', ')+'}').join('; ')}.\nUsing coverage-based prioritisation (always run next the test that adds the MOST requirements not yet covered; ties by letter), which order is correct?`,right,wrongs,`Step by step: pick the test that covers the most requirements, then each time the one that adds the most NEW requirements. Order: ${right}.`)};

 /* ---------- risk (5.2.1) ---------- */
 T.risk_level=r=>{
  const L=['Low','Medium','High'];const li=r.int(0,2),im=r.int(0,2);const s=li+im; // 0..4
  const lvl=s<=1?'Low':s<=2?'Medium':'High';
  const risk=r.pick(['the till software calculates VAT wrongly','the loyalty app shows the wrong stamp count','the website banner has a typo','the payment terminal rejects valid cards']);
  const opts=['Low','Medium','High','Cannot be determined'];
  return build(r,{ch:5,lo:'FL-5.2.1',k:'K1',tag:'Risk'},`A product risk: "${risk}". Likelihood is ${L[li].toLowerCase()} and impact is ${L[im].toLowerCase()}. Using a simple matrix where risk level grows with BOTH likelihood and impact (low+low or low+medium = Low; medium+medium = Medium; anything with a high plus a medium or higher = High; low+high = Medium), what is the risk level?`,lvl==='Low'&&s===1||lvl==='Medium'&&s===2||lvl==='High'?lvl:lvl,opts.filter(x=>x!==lvl),`Risk level combines likelihood and impact. Here likelihood ${L[li]} and impact ${L[im]} give ${lvl} under the stated matrix.`)};

 window.QGEN={types:T,R,make:(type,seed)=>{const q=T[type](R(seed));q.id='g:'+type+':'+seed;return q},
  byLO:{'FL-4.2.1':['ep_count','ep_set'],'FL-4.2.2':['bva_set','bva_count'],'FL-4.2.3':['dt_rules','dt_action'],'FL-4.2.4':['st_next','st_cov'],'FL-4.3.2':['code_cov'],'FL-5.1.4':['est_3pt','est_ratio','est_extrap'],'FL-5.1.5':['prio_risk','prio_cov']},
  MACH};
})();
