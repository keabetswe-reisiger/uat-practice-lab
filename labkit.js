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
 const FTB=b=>{try{return window.FAILTYPE&&b?'<li>'+FAILTYPE.classicBlock(page,b)+'</li>':''}catch(e){return ''}};
 const FT=b=>{try{return window.FAILTYPE&&b?FAILTYPE.classicLine(page,b):''}catch(e){return ''}};
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

 /* ---------- check the tester's own "Actual result" text against what the app really does ---------- */
 const OBS={
  'coffee|B3':['Quantity drops to 0 and then below 0 (it should stop at 1).',/(\b0\b|zero|negative|-\s?1|below|minus|went down|disappear)/i],
  'coffee|B2':['The lowercase code welcome10 is rejected, so no 10% discount is applied.',/(no discount|not applied|invalid|reject|error|refus|didn.?t|did not|doesn.?t|not accept|not work|failed|nothing)/i],
  'coffee|B4':['At exactly R100 the delivery fee is still charged: delivery R20.00 and total R120.00 (it should be R0.00 and R100.00).',/(charged|fee|not free|extra|more than|total.*(above|over|more))/i,/(free|r0\.00).*(correct|as expected)/i],
  'coffee|B1':['The 9-digit phone number is accepted and the order is placed (it should be refused).',/(accept|allowed|went through|placed|no error|confirmed|success|9 digit|nine)/i,/(refus|rejected|error shown|not accepted)/i],
  'coffee|B5':['The confirmation says R30.00 (delivery fee left out) while the cart total was R50.00.',/(less|lower|without|exclud|missing|differ|not include|doesn.?t include|doesn.?t match|not match|wrong|r\s?4\d|r\s?3\d|r\s?2\d)/i],
  'clinic-practice|D1':['As Thabo (Doctor) the full manager KPI suite IS shown (it should be hidden).',/(sees|can see|is shown|are shown|displayed|visible|appears|showing|shows|kpi.*(there|present))/i,/(not (shown|visible|displayed)|hidden|cannot see|can.?t see|doesn.?t (see|show))/i],
  'clinic-practice|D2':['Choosing Weekly shows the monthly figures, not 64 completed / 9 no-shows / 22 min / 5 doctors.',/(month|different|wrong|not 64|not the same|doesn.?t match|not match|other figures|higher)/i],
  'clinic-practice|F1':['Searching "mokoena" in lowercase finds nobody. Only "Mokoena" with a capital M works.',/(no (result|patient|match)|nobody|nothing|not found|empty|zero|0 (result|patient)|case|capital|no one)/i,/(as expected|everything works|it works\b|works (fine|correctly|well)|is working|both (found|shown)|giving expected)/i],
  'clinic-practice|F2':['Thabo also sees patients who are not assigned to him (the list is longer than the three expected).',/(more|other|extra|all (patients|the patients)|also|not assigned|longer|everyone|every patient|6|six)/i],
  'clinic-practice|S1':['The duplicate booking is accepted and saved (it should be refused).',/(accept|saved|allowed|booked|went through|no error|success|submitted|duplicate)/i,/(refus|blocked|rejected|not allowed)/i],
  'clinic-practice|S3':['The new booking shows as Confirmed (it should say Pending Review / Unconfirmed).',/(confirmed)/i,/(pending review|unconfirmed)/i],
  'clinic-practice|R1':['The Upcoming appointments count stays at 3 after the cancel (it should drop to 2).',/(3|three|same|unchanged|not (change|update|drop|reduce)|still)/i],
  'clinic-practice|R2':['The change log gets no new line after the date is changed.',/(no (new )?(line|entry|log|record)|nothing|not (logged|recorded|added|updated)|missing|empty)/i],
  'clinic-practice|Q1':['The walk-in is added with a blank patient type (it should be refused).',/(accept|added|saved|allowed|went through|no error|success|blank|empty)/i,/(refus|blocked|rejected|not allowed|error)/i],
  'stockwatch-practice|E4':['The milk expiring in exactly 3 days is NOT tagged "Expiring soon".',/(no tag|not tag|no (expiring|flag|label)|not (flagged|shown|marked|labelled)|missing|without|nothing)/i],
  'stockwatch-practice|E3':['Next expiry shows the LATER batch (2027-03-01) instead of 2026-12-01 (the earliest).',/(later|latest|wrong|different|not 2026-12-01|other date|newer)/i],
  'stockwatch-practice|R1':['Muffins expiring today are received (they should be refused).',/(accept|received|allowed|went through|no error|success|saved)/i,/(refus|blocked|rejected|not allowed)/i],
  'stockwatch-practice|R2':['-20 is accepted and the cups go DOWN from 500 (it should be refused).',/(accept|reduc|went down|480|less|allowed|no error|success|decreas)/i,/(refus|blocked|rejected|not allowed|still 500)/i],
  'stockwatch-practice|L1':['The Low stock count stays at 2 after receiving (it should become 1).',/(\b2\b|\btwo\b|same|unchanged|not (change|update|drop|reduce|refresh)|still)/i],
  'stockwatch-practice|V5':['The variance % shows -5.3% (worked out on the counted qty) instead of -5.0%.',/(-?\s?5\.\d|not -?5|wrong|different|-?\s?2\.6|counted)/i],
  'stockwatch-practice|P6':['Lerato (Storeman) CAN see and use the approve option (only the Manager should).',/(can approve|approve (option|button)|sees|can see|visible|shown|allowed|there)/i,/(cannot|can.?t|not (shown|visible|there)|hidden)/i],
  'stockwatch-practice|W7':['Waste of 12 with no reason is accepted (a reason should be required).',/(accept|allowed|went through|no error|success|saved|recorded|logged(?! in))/i,/(refus|blocked|rejected|not allowed|reason required)/i],
  'stockwatch-practice|W8':['The waste total shows only the last entry (R42.00) instead of R70.00.',/(42|last|only|overwrit|replace|not (add|accumulat)|wrong|r\s?28|less)/i]
 };

 /* step-by-step correction: what you should SEE after each step, then the model actual result */
 const STEPS={
  'coffee|B3':[['Muffin is in the cart with quantity 1.','Quantity shows 0 (then -1 if you click again). Expected: it stays at 1.'],'Quantity goes to 0 / below 0 after clicking minus twice. Expected: stays at 1.'],
  'coffee|B2':[['Cappuccino is in the cart; total is the full price.','The code is not accepted: an error shows or the total does not change. Expected: 10% off.'],'Entering welcome10 in lowercase gives no 10% discount (code rejected). Expected: 10% discount applied.'],
  'coffee|B4':[['Espresso is in the cart with quantity 2 (R60).','Cappuccino is added; subtotal is exactly R100.','A delivery fee is still added (not R0.00). Expected: delivery R0.00, total R100.00.'],'Subtotal is exactly R100 but delivery R20.00 is still charged, so the total is R120.00. Expected: delivery R0.00, total R100.00.'],
  'coffee|B1':[['Cart has one item.','Fields show Thabo and 082123456 (that is only 9 digits).','The order is placed and a confirmation appears. Expected: refused with a phone error.'],'A 9-digit phone number is accepted and the order is placed. Expected: order refused with a phone error.'],
  'coffee|B5':[['Cart shows Espresso plus delivery, total R50.00.','Name and phone are filled in.','The confirmation total is lower than R50.00 because the delivery fee is missing. Expected: R50.00.'],'Confirmation total says R30.00 while the cart total was R50.00 (delivery fee left out). Expected: R50.00.'],
  'clinic-practice|D1':[['You are logged in as Thabo (Doctor).','The Dashboard shows the full KPI suite (completed, no-shows, average wait, doctors on duty). Expected: NOT shown to a Doctor.'],'As Thabo the full manager KPI suite is displayed. Expected: hidden from a Doctor.'],
  'clinic-practice|D2':[['Dashboard is open as Sipho.','Weekly is chosen, but the numbers are the monthly ones, not 64 / 9 / 22 min / 5. Expected: the weekly figures.'],'With Weekly selected the dashboard shows the monthly figures. Expected: Completed 64, no-shows 9, 22 min wait, 5 doctors.'],
  'clinic-practice|F1':[['The Patients tab is open as Sipho.','You type mokoena in lowercase and the list is EMPTY. Expected: Zanele and Zodwa Mokoena.'],'Searching mokoena in lowercase returns no patients (only Mokoena with a capital M works). Expected: Zanele and Zodwa Mokoena found.'],
  'clinic-practice|F2':[['You are logged in as Thabo.','The list shows more than 3 patients, including ones not assigned to Thabo. Expected: only Zanele, Gogo Martha Sithole and Zodwa.'],'Thabo sees patients assigned to other doctors as well. Expected: only his three patients.'],
  'clinic-practice|S1':[['Form filled: Thabo, Zanele Mokoena, Check-up, 2026-11-09.','You add it and submit: it is accepted and saved. Expected: refused, because appointment #101 already exists.'],'The duplicate booking (same patient, type and day as #101) is accepted. Expected: refused.'],
  'clinic-practice|S3':[['You are logged in as Thabo on Book appointment.','Gogo Martha Sithole and Check-up are in the booking list for 2026-11-13.','The Diary shows the status Confirmed. Expected: Pending Review / Unconfirmed.'],'The new booking shows as Confirmed. Expected: Pending Review / Unconfirmed.'],
  'clinic-practice|R1':[['Dashboard shows Upcoming appointments = 3.','Appointment #102 is now cancelled.','The Upcoming count still reads 3. Expected: 2.'],'Upcoming appointments stays at 3 after cancelling #102. Expected: 2.'],
  'clinic-practice|R2':[['Diary is open as Sipho.','You save the new date, then open the change log: NO new line was added. Expected: a line with user, time and the change.'],'No new line appears in the change log after changing the date. Expected: a new line with user, time and change.'],
  'clinic-practice|Q1':[['Walk-in add is open as Thabo.','A name is entered, patient type is left blank, and it is added. Expected: refused, patient type required.'],'A walk-in with a blank patient type is accepted. Expected: refused, type required.'],
  'stockwatch-practice|E4':[['Fresh milk 1L (expiry 2026-10-29) is exactly 3 days away and has NO "Expiring soon" tag. Expected: tagged.'],'Fresh milk, 3 days from expiry, is not tagged Expiring soon. Expected: tagged.'],
  'stockwatch-practice|E3':[['10 Arabica beans received with expiry 2026-12-01.','Stock shows a LATER date as next expiry. Expected: 2026-12-01.'],'Beans show a later date as next expiry instead of 2026-12-01 (the earliest).'],
  'stockwatch-practice|R1':[['You receive 5 Muffins expiring today (2026-10-26) and it is accepted. Expected: refused, expiry must be after today.'],'Muffins expiring today are received. Expected: refused.'],
  'stockwatch-practice|R2':[['You enter -20 Cups and it is accepted.','Cups drop from 500 to 480. Expected: refused and still 500.'],'A negative quantity (-20) is accepted and cups fall to 480. Expected: refused, cups stay 500.'],
  'stockwatch-practice|L1':[['The Low stock count at the top reads 2.','After receiving 20 Fresh milk the count still reads 2. Expected: 1 (only Oat milk).'],'Low stock count stays at 2 after receiving milk. Expected: 1.'],
  'stockwatch-practice|V5':[['You count Arabica beans = 38 (system 40). The variance % is NOT -5.0% because it divides by the counted qty. Expected: -5.0% (2 / 40).'],'Variance % is calculated on the counted quantity, so it is not -5.0%. Expected: -5.0%.'],
  'stockwatch-practice|P6':[['Lerato submits a count.','The approve option IS visible and usable for Lerato. Expected: only Sipho (Manager) can approve.'],'A Storeman (Lerato) can approve stock-take adjustments. Expected: only the Manager.'],
  'stockwatch-practice|W7':[['Waste of 12 Fresh milk with no reason is accepted. Expected: refused, reason required.'],'Waste of 12 with no reason is accepted. Expected: refused, reason required.'],
  'stockwatch-practice|W8':[['The first waste (R28) is recorded.','After the second waste (R42) the total shows R42.00, not R70.00. Expected: R70.00 (it should add up).'],'Total waste value shows R42.00 (the last entry only). Expected: R70.00.']
 };
 function stepsHTML(t,open){const k=page+'|'+t.bug,st=STEPS[k],list=t.steps||t.input||[];
  if(!st){const bd=t.bug?bugDesc(t.bug):'';const rows=list.map((x,i)=>`<li><b>Step ${i+1}: do</b> ${esc(x)}</li>`).join('');return `<details class="lk-det" data-lk-obs="1" open><summary>Steps to compare with yours</summary><ol style="margin:8px 0 4px 18px;padding:0">${rows}<li><b>Compare:</b> Expected: ${esc(t.exp)}<br>${t.bug?`What really happens is different (${esc(bd)}), so the result is a <b>Fail</b>.</li><li><b>Write the Actual result like this:</b> &ldquo;${esc(bd)}. Expected: ${esc(t.exp)}&rdquo;</li>${FTB(t.bug)}`:`The app does exactly this, so the result is a <b>Pass</b>.</li><li><b>Write the Actual result like this:</b> &ldquo;As expected: ${esc(t.exp)}&rdquo;</li>`}</ol></details>`}
  const rows=list.map((x,i)=>`<li><b>Step ${i+1}: do</b> ${esc(x)}<br><b>You should see:</b> ${esc(st[0][i]||'(nothing special; carry on)')}</li>`).join('');
  return `<details class="lk-det" data-lk-obs="1" ${open?'open':''}><summary>Steps to compare with yours (correct version)</summary><ol style="margin:8px 0 4px 18px;padding:0">${rows}<li><b>Compare:</b> Expected: ${esc(t.exp)}<br>What really happened is different, so the result is a <b>Fail</b>.</li><li><b>Write the Actual result like this:</b> &ldquo;${esc(st[1])}&rdquo;</li>${FTB(t.bug)}</ol></details>`}
 const NOTE={'clinic-practice|TC-11':'The second Add shows "Already in the booking list." and the list keeps ONE Zodwa entry, so the duplicate IS blocked and this test passes. Careful: after the first Add the form goes back to the first patient (Zanele), so choose Zodwa Mokoena and Check-up again before the second Add. Pressing Submit twice for the same patient and day is a different test (TC-12): that one is NOT blocked, which is a real bug.'};
 function judge(o,a,exp){
  const stripExp=(a,exp)=>{exp=String(exp||'').trim();if(exp.length<12)return a;try{return a.replace(new RegExp(exp.replace(/[.*+?^${}()|[\]\\]/g,'\\$&').replace(/\s+/g,'\\s+'),'gi'),' ')}catch(e){return a}};
/* judge only what the tester says the app DID, never what they say it should do:
   1) if they wrote an "actual" part, use the text after the last "actual";  2) cut brackets and tails that talk about what was expected / should happen
   ("accepted (it should be refused)" -> "accepted");  3) "not rejected" / "wasn't refused" mean the app let it through, so they are not counted as refusing */
  a=stripExp(String(a||''),exp);const am=[...a.matchAll(/actual(\s*results?)?/gi)];let aa=am.length?a.slice(am[am.length-1].index+am[am.length-1][0].length):a;
  const EXPW=/\b(expect(?:ed|s)?|should(?:n't| not)?|must|supposed|ought|needs? to|required to|instead of|rather than)\b/i;
  aa=aa.replace(/\(\s*(it |this |that |they )?(should|must|expected)\b[^]*$/i,' ').replace(/\([^)]*\)/g,m=>EXPW.test(m)?' ':m);
  aa=aa.split(/(?<=[.!?])\s+|\n/).map(sn=>{return sn.replace(new RegExp(EXPW.source+'[^]*?(?=\\b(?:but|however|yet|although|and it|and the)\\b|$)','i'),' ')}).join(' ');
  if(!aa.replace(/[^a-z0-9]/gi,''))return false; /* nothing left that says what the app DID */
  const nz=x=>String(x||'').toLowerCase().replace(/[^a-z0-9]/g,'');if(nz(exp).length>=10&&nz(aa).includes(nz(exp))&&nz(aa).length<=nz(exp).length+15)return false; /* only repeated the expected result */
  const an=aa.replace(/\b(not|never|wasn't|isn't|didn't|without)\s+(?:\w+\s+)?(?:\w+\/)*(refus\w*|reject\w*|block\w*|den(?:y|ied)\w*)/gi,' ');
  return o[1].test(aa)&&!(o[2]&&o[2].test(an))}
 function obsHTML(t){const a=String(res(t.id).actual||'').trim();const o=t.bug&&OBS[page+'|'+t.bug];
  if(!o){const nt=NOTE[page+'|'+t.id];let extra='';
   if(a&&!t.bug){const exp=String(t.exp||'');const wantsNo=/(refus|blocked|not shown|cannot|not allowed|only )/i.test(exp);const saysDone=/(submitted|accepted|saved|allowed|went through|success|was added|booked)/i.test(a)&&!/(refus|blocked|rejected|error|already|not allowed)/i.test(a);
    if(wantsNo&&saysDone)extra=`<div class="lk-fb no" data-lk-obs="1"><b>Your actual result does not match this test.</b> You wrote: &ldquo;${esc(a.length>140?a.slice(0,140)+'...':a)}&rdquo; but this test expects: ${esc(exp)}${nt?'<br><b>What the app really did:</b> '+esc(nt):''}<br>Check you did every step exactly as written, then rewrite the Actual result with what the screen showed at that step.</div>`}
   if(!extra&&nt)extra=`<div class="lk-fb info" data-lk-obs="1"><b>What the app really did:</b> ${esc(nt)}</div>`;
   return extra+(a?'':'<div class="lk-fb info" data-lk-obs="1"><b>Actual result is empty.</b> Write what you saw, even if it matches the expected result.</div>')+stepsHTML(t,true)}
  const say=esc(o[0]);
  if(!a)return `<div class="lk-fb no" data-lk-obs="1"><b>Your Actual result is empty.</b> Write what you really saw. <br><b>What the app really did:</b> ${say}</div>${stepsHTML(t,true)}`;
  const hit=judge(o,a,t.exp);const SH=stepsHTML(t,true);
  return hit?`<div class="lk-fb ok" data-lk-obs="1"><b>Your actual result looks right.</b> It describes the real problem. <br><b>What the app really did:</b> ${say}${FT(t.bug)}</div>${SH}`
   :`<div class="lk-fb no" data-lk-obs="1"><b>Your actual result does not describe what really happened.</b> You wrote: &ldquo;${esc(a.length>140?a.slice(0,140)+'...':a)}&rdquo; <br><b>What the app really did:</b> ${say}<br><b>Why this was marked wrong:</b> your text says what you expected or what happened to the list, but not the exact thing on screen that was different (a number, a word, a missing item). A developer needs: what you saw, then what you expected.<br><b>Try this shape:</b> &ldquo;After step X the screen showed ___. Expected: ___.&rdquo; Open &ldquo;Steps to compare with yours&rdquo; below to see the correct version.</div>${SH}`}
 /* ---------- marking ---------- */
 function mark(id,status){const t=tests().find(x=>x.id===id);if(!t)return;const tr=truth(t);P.tries[id]=(P.tries[id]||0)+1;const n=P.tries[id];let fb;
  if(status==='Blocked')fb={c:'info',t:'Blocked means something stops you from running the test at all (for example missing data or a missing feature). If you could run it, record Pass or Fail.'};
  else if(status===tr){fb=t.bug?{c:'ok',t:'Correct: this test exposes a real defect. '+esc(bugDesc(t.bug))+FT(t.bug)+' Write it up clearly: steps, expected, actual, severity and failure type.'}:{c:'ok',t:'Correct: this feature behaves as the expected result says. Good: not every test finds a bug, and a careful tester does not invent failures.'}}
  else if(status==='Pass'){fb=n<2?{c:'no',t:'Not quite. Something in this test does not match the expected result. Run it again slowly and compare every part with the expected result (numbers, wording, who can see what).'}:n<3?{c:'no',t:'Still not right. Hint: look closely at <b>'+esc(t.req||t.title)+'</b>: '+esc(t.title)+'. Compare it with the expected result character by character.'}:{c:'no',t:'The test fails because: '+esc(bugDesc(t.bug))+FT(t.bug)+' It is a real bug. Next time, compare slowly and do not assume.'}}
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
      const fb=P.fb[ids[i]];if(P.instant&&fb&&stat(ids[i])!=='Pending'){const d=document.createElement('div');d.className='lk-fb '+fb.c;d.innerHTML=fb.t;c.appendChild(d);{const tt0=tests().find(x=>x.id===ids[i]);if(tt0){const w0=document.createElement('div');w0.innerHTML=obsHTML(tt0);[...w0.children].forEach(n=>c.appendChild(n))}}
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
 document.addEventListener('change',e=>{if(e.target.dataset&&e.target.dataset.actual){setTimeout(()=>{const v=viewEl();if(v&&stat(e.target.dataset.actual)!=='Pending'){v.querySelectorAll('.lk-nav').forEach(n=>n.remove());v.querySelectorAll('.tc .lk-fb,.tc .lk-det,.tc .co-box,.tc .co-plan').forEach(n=>n.remove());decorate()}},30)}});
 document.addEventListener('keydown',e=>{if(e.key==='Escape')closeDrawer()});
 window.LABKIT={score,mark,P,page,judge,OBS,STEPS};
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(wire,50));else setTimeout(wire,50);
})();
