/* coach.js: the "coach" that explains WHAT you are testing, HOW to plan a test with a worked example,
   and tracks YOUR weak points after every test. Used by labapp.js (new apps) and labkit.js (classic apps). */
(function(){
 const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
 const SK={
  calc:{name:'Checking calculations',what:'Working out money figures yourself and comparing them with what the screen shows.',why:'Wrong totals cost real money, and customers notice them first.',
   plan:['Find the rule (price × quantity, discount percentage, VAT included in the total).','Choose simple numbers you can work out in your head, like R100 × 3.','Write your predicted answer BEFORE you press anything.','Do the steps, then read the figure exactly as shown.','Compare digit by digit: R360.00 is not R306.00.'],
   ex:{setup:'A shop sells coffee at R40. The rule: 10% off when you spend R200 or more.',predict:'5 coffees = R200. 10% of R200 = R20. So the total should be R180.00.',doit:'Add 5 coffees, apply the discount, read the total.',compare:'Screen shows R180.00: it matches. Screen shows R190.00: you have found a calculation bug.'},
   mistake:'Trusting the screen because the number "looks reasonable". Always calculate first.',practise:'For the next 3 tests, write your predicted number on paper before touching the app.'},
  boundary:{name:'Testing the edges of a rule',what:'Trying the value just below a limit, exactly on it, and just above it.',why:'Programmers often write "less than" when the rule says "less than or equal to", so the edge value misbehaves.',
   plan:['Find the limit in the rules (free shipping at R500 or more).','List three values: just below (R499), exactly on (R500), just above (R501).','Predict the result for each one BEFORE testing.','Test them one by one.','Pay the most attention to the exactly-on value: that is where bugs hide.'],
   ex:{setup:'A loyalty card gives a free coffee at 10 stamps.',predict:'9 stamps: no free coffee. 10 stamps: free coffee. 11 stamps: free coffee and 1 stamp left over.',doit:'Collect 9 stamps and try to redeem, then 10 stamps and try again.',compare:'If 9 stamps already gives a free coffee, the limit is wrong.'},
   mistake:'Testing only a value far from the limit, like 50 stamps.',practise:'Whenever you see a number in a rule, test that number and the two values next to it.'},
  validation:{name:'Testing what the system accepts and refuses',what:'Typing wrong, empty, too short, too long and strange values into fields.',why:'Bad data causes trouble later: lost parcels, wrong emails, broken reports.',
   plan:['Read the rule for the field (phone: exactly 10 digits).','List one valid value and several invalid ones: 9 digits, 11 digits, letters, empty, spaces.','Predict: the valid one is accepted, every invalid one gets a clear message.','Try each invalid value and read the message.','Check that nothing was saved when the input was refused.'],
   ex:{setup:'A phone field must have exactly 10 digits.',predict:'0821234567 is accepted. 082123456 is refused. 08212345678 is refused. abc1234567 is refused.',doit:'Try all four and read what the app says each time.',compare:'If abc1234567 is accepted, validation is missing.'},
   mistake:'Testing only the valid value and the empty value.',practise:'For every input box, try at least four invalid values.'},
  rule:{name:'Checking business rules',what:'Making sure the system follows the written rule in every situation, including the awkward ones.',why:'A rule that works only sometimes is worse than no rule: staff and customers stop trusting the system.',
   plan:['Read the rule slowly and underline the conditions (who, when, how much).','Make one test where the rule should apply and one where it should not.','Predict both results.','Run them and compare every part of the result with the rule.','Ask: what should NOT have happened?'],
   ex:{setup:'Rule: the Gear filter shows only Gear products.',predict:'Press Gear: 5 products appear and every one of them is Gear.',doit:'Press Gear and check the category of each product.',compare:'If a Gift Card appears, the filter rule is broken.'},
   mistake:'Checking that the right things appear, but not checking that the wrong things do NOT appear.',practise:'After every test, ask yourself: what should not have happened?'},
  state:{name:'Following changes step by step',what:'Checking that after each action (add, remove, edit, undo) the screen and the data change exactly as they should.',why:'Real users change their minds. State bugs show up as the wrong item removed, a stale total, or steps that can be skipped.',
   plan:['Write down the order of actions you will do (add A, add B, remove A).','Predict what the screen shows after EACH action, not only at the end.','Do the actions slowly, one at a time.','After each action, read the screen.','Try one action that should be refused (like skipping a step) and check it is refused.'],
   ex:{setup:'A cart holds a Mug and a Frother.',predict:'Remove the Mug: only the Frother stays and the total drops by the Mug price.',doit:'Add both, then press Remove on the first row.',compare:'If the Mug stays and the Frother disappears, the wrong item was removed.'},
   mistake:'Checking only the final screen.',practise:'Say each step out loud, and what you expect, before you click.'},
  display:{name:'Checking what the screen shows',what:'Comparing what is shown (wording, counts, dates, labels, messages) with the rule, or with the same fact shown somewhere else.',why:'People act on what they see. A wrong label, count or message misleads them even when the data underneath is right.',
   plan:['Pick one fact that is shown in two places (a balance on two screens, a count and a list).','Predict that both places must agree.','Read both exactly, word for word and digit for digit.','Read every error message: would a new customer know what to do?','Write down the exact wording of anything that looks odd.'],
   ex:{setup:'A history list says the balance after a transfer is R7 500.',predict:'The accounts screen must also say R7 500.',doit:'Make the transfer and compare both screens.',compare:'If the history says R8 000, the display is wrong.'},
   mistake:'Skimming. Read slowly and compare each character.',practise:'Always check one value in two places.'},
  access:{name:'Checking who is allowed to do what',what:'Using different roles and trying things each role should and should not be able to do.',why:'People must only see and change what their job allows. Mistakes can leak private data or let the wrong person delete or approve things.',
   plan:['List the roles and what each one may do.','Make a small table: role × action → allowed or refused.','Start with the LOWEST role and try things it should not be able to do.','Then check the highest role can do all of them.','Check the app refuses clearly and that nothing changed behind the scenes.'],
   ex:{setup:'A Viewer can read a document but not edit it.',predict:'As Viewer: trying to edit is refused and the text stays the same.',doit:'Switch to Viewer and try to change the text.',compare:'If the text changes, anyone with a Viewer link could damage your document.'},
   mistake:'Testing only as the Admin, who can do everything.',practise:'For each new feature, test it as the lowest role first.'},
  persistence:{name:'Checking that data is really saved',what:'Doing something, then reloading or reopening, and checking it is still there.',why:'A screen that looks fine but forgets data after a refresh loses the customer\'s work.',
   plan:['Make a change (save a profile, add a stamp).','Predict that it survives a refresh.','Reload the page or reopen the screen.','Check the value is still there, exactly as you left it.','Also check an edited value, not only a new one.'],
   ex:{setup:'You change your email address and press Save.',predict:'After a reload the new email is still shown.',doit:'Save, reload the page, open the profile.',compare:'If the old email is back, the change was never really saved.'},
   mistake:'Trusting the "Saved" message.',practise:'After every Save, reload and look again.'}};
 const MAP={calculation:'calc',boundary:'boundary',validation:'validation','business rule':'rule',state:'state',display:'display',message:'display',permission:'access','permission / security':'access',security:'access','data not saved':'persistence'};
 const skillKey=label=>MAP[String(label||'').trim().toLowerCase()]||'rule';
 function classify(text){const t=String(text||'').toLowerCase();
  const R=[['boundary',/exactly|boundary|limit|maximum|minimum|at least|9 vs 10|over r?\d|under r?\d|r100|digits? (long|exactly)/],['calc',/total|price|sum|calculat|discount|round|vat|percent|%|cost|rate|stock level|quantity/],['access',/role|doctor|manager|permission|only (see|their|own)|not see|access|hidden|kpi|login|nurse|admin/],['validation',/valid|reject|invalid|required|empty|format|email|phone|accepts|too (short|long)/],['persistence',/saved|reload|refresh|persist|remember/],['state',/state|status|stage|flow|lifecycle|confirmed|pending|version|v1|v2|environment|unconfirmed/],['display',/search|filter|sort|case|display|label|wording|banner|badge|message|shows/]];
  for(const [k,re] of R)if(re.test(t))return k;return 'rule'}
 /* ---------- your weak points (saved in this browser, synced with the rest of your progress) ---------- */
 const KEY='coach-v1';let C;try{C=JSON.parse(localStorage.getItem(KEY))||{}}catch{C={}}C.skills=C.skills||{};C.pred=C.pred||{n:0,ok:0};
 const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(C))}catch{}};
 function record(key,ok){const s=C.skills[key]=C.skills[key]||{n:0,ok:0};s.n++;if(ok)s.ok++;save()}
 function recordPred(ok){C.pred.n++;if(ok)C.pred.ok++;save()}
 function weak(){const out=[];Object.entries(C.skills).forEach(([k,s])=>{if(s.n>=2&&s.ok/s.n<.7&&SK[k])out.push({key:k,name:SK[k].name,n:s.n,ok:s.ok,acc:s.ok/s.n})});if(C.pred.n>=2&&C.pred.ok/C.pred.n<.7)out.push({key:'pred',name:'Predicting the result from the rules',n:C.pred.n,ok:C.pred.ok,acc:C.pred.ok/C.pred.n});return out.sort((a,b)=>a.acc-b.acc)}
 function table(){const rows=Object.entries(SK).map(([k,v])=>{const s=C.skills[k]||{n:0,ok:0};return{key:k,name:v.name,n:s.n,ok:s.ok}}).filter(r=>r.n>0);if(C.pred.n)rows.push({key:'pred',name:'Predicting the result from the rules',n:C.pred.n,ok:C.pred.ok});return rows}
 /* ---------- diagnosis text ---------- */
 function diagnose(final){return {
  Found:'You compared what you saw with the rule and spotted the difference. That habit is what finds bugs.',
  Pass:'Good. You confirmed a healthy feature without inventing a problem. Not every test finds a bug.',
  Recheck:'What you typed was not what the screen shows. Slow down: read the exact number or wording on the screen, not what you expect it to say.',
  Missed:'The app really shows something different from the rules, but you reported what you EXPECTED to see. This is called expectation bias: the brain fills in what it thinks should be there. Cure: write your prediction first, then read the screen without looking at your prediction.',
  Misread:'You reported a problem that was not there. Before you call something a defect, re-read the rule and compare it with exactly what you saw.'}[final]||''}
 /* ---------- HTML pieces ---------- */
 const css=document.createElement('style');css.textContent=`
 .co-box{border:1px solid var(--line,#d5dae2);border-radius:12px;padding:10px 12px;margin-top:10px;background:var(--card,#fff);color:var(--ink,#16202f)}.co-box h4{margin:0 0 4px;font-size:15px;color:var(--brand,#7a5a1e)}
 .co-box ol,.co-box ul{margin:4px 0 4px 20px;padding:0}.co-ex{border-left:3px solid #b38e52;background:#c9a66e24;border-radius:4px;padding:6px 10px;margin:6px 0;font-size:14.5px}
 .co-weak{border-color:#b42318}.co-ok{border-color:#11663f}.co-bar{height:8px;background:#e5e8ee;border-radius:99px;overflow:hidden;margin:2px 0 6px}.co-bar i{display:block;height:100%}
 .co-t{width:100%;border-collapse:collapse;font-size:14px}.co-t td{padding:3px 6px;border-bottom:1px solid var(--line,#d5dae2)}.co-mute{color:var(--mute,#4a5568);font-size:14px}`;
 document.head.appendChild(css);
 function planHTML(key,open){const k=SK[key]||SK.rule;return `<details class="co-box" ${open?'open':''}><summary style="cursor:pointer;font-weight:700">Plan this test: ${esc(k.name)}</summary><p class="co-mute" style="margin:6px 0">${esc(k.what)} <b>Why it matters:</b> ${esc(k.why)}</p><h4>How to plan it</h4><ol>${k.plan.map(p=>`<li>${esc(p)}</li>`).join('')}</ol><h4>A worked example (not this test)</h4><div class="co-ex"><b>Situation:</b> ${esc(k.ex.setup)}<br><b>Predict first:</b> ${esc(k.ex.predict)}<br><b>Then do:</b> ${esc(k.ex.doit)}<br><b>Compare:</b> ${esc(k.ex.compare)}</div><div class="co-mute"><b>Common mistake:</b> ${esc(k.mistake)}</div></details>`}
 function weakHTML(){const w=weak();const t=table();
  if(!t.length)return `<div class="co-box"><h4>Your weak points</h4><div class="co-mute">Finish a few tests and this box will show where you are strong and where to practise.</div></div>`;
  return `<div class="co-box ${w.length?'co-weak':'co-ok'}"><h4>Your weak points so far</h4>${w.length?`<div class="co-mute">Skills where you got fewer than 7 in 10 right (after at least 2 tests):</div>`:'<div class="co-mute">No weak points yet. Keep going, and keep predicting before you test.</div>'}
   <table class="co-t">${t.map(r=>{const p=Math.round(r.ok/r.n*100);return `<tr><td>${esc(r.name)}</td><td style="width:110px"><div class="co-bar"><i style="width:${p}%;background:${p<70?'#b42318':'#11663f'}"></i></div></td><td style="width:70px">${r.ok}/${r.n}</td></tr>`}).join('')}</table>
   ${w.slice(0,2).map(x=>{const k=SK[x.key];if(!k)return `<div class="co-ex"><b>Practise: ${esc(x.name)}.</b> Before each test, write down what you expect, from the rules, then compare it with the rules again. A wrong prediction means the rule was misunderstood: re-read it in Extra information.</div>`;return `<div class="co-ex"><b>Practise: ${esc(k.name)}.</b> ${esc(k.practise)}<br><b>Example:</b> ${esc(k.ex.predict)}</div>`}).join('')}</div>`}
 function coachHTML(o){ /* o: {skill, final, tries, predOk} */
  const k=SK[o.skill]||SK.rule;let h=`<div class="co-box"><h4>Coach: ${esc(k.name)}</h4><div>${esc(diagnose(o.final))}</div>`;
  if(o.predOk===true)h+=`<div class="co-mute" style="margin-top:6px"><b>Your prediction matched the rules.</b> That is exactly the habit that prevents expectation bias.</div>`;
  if(o.predOk===false)h+=`<div class="co-mute" style="margin-top:6px"><b>Your prediction did not match the rules.</b> Before testing, re-read the rule in Extra information and work the answer out step by step. A wrong prediction usually means the rule was misunderstood.</div>`;
  if(o.predOk===null)h+=`<div class="co-mute" style="margin-top:6px">Tip: type what you expect BEFORE you test. Predicting first protects you from only seeing what you expected.</div>`;
  h+=`<div class="co-mute" style="margin-top:6px"><b>Skill to remember:</b> ${esc(k.mistake)} <b>Try:</b> ${esc(k.practise)}</div></div>`;return h+weakHTML()}
 window.COACH={SK,skillKey,classify,record,recordPred,weak,table,diagnose,planHTML,weakHTML,coachHTML,state:()=>C,esc};
})();
