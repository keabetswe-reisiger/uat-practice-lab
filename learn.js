/* Learn pop-ups: explains how UAT theory applies to the app on screen.
   Quotes are verbatim from the sources listed in SOURCES; "Practical tip" boxes are the author's own, not from the books. */
(function(){
const CFG=window.LEARN_CFG||{};
const CTFL='ISTQB Certified Tester Foundation Level Syllabus v4.0.1 (2024)';
const ACT='ISTQB Certified Tester Acceptance Testing Syllabus v1.0 (2019)';
const SOURCES=[
 {t:CTFL,u:'https://www.istqb.org/certifications/certified-tester-foundation-level',n:'Free syllabus; the PDF is also in your Pictures/3/mess folder. Cites Myers (2011), Craig (2002), Whittaker for techniques.'},
 {t:ACT,u:'https://www.istqb.org/wp-content/uploads/2024/11/ISTQB-CT-AcT_Syllabus_v1.0_2019.pdf',n:'Free syllabus dedicated to acceptance testing, UAT, acceptance criteria and Given–When–Then.'},
 {t:'aqua-cloud: UAT entry and exit criteria (web article)',u:'https://aqua-cloud.io/uat-entry-and-exit-criteria/',n:'Vendor blog. Its numeric thresholds are examples, not standards.'},
 {t:'Bird Eats Bug: user acceptance testing (web article)',u:'https://birdeatsbug.com/blog/user-acceptance-testing',n:'Vendor blog on UAT steps and sign-off.'},
 {t:'University of Minnesota: UAT template guide (web)',u:'https://ddg.wcroc.umn.edu/?p=44386',n:'Sign-off as written confirmation.'},
 {t:'Marker.io: bug severity vs priority (web article)',u:'https://marker.io/blog/bug-severity-vs-priority',n:'Severity vs priority explained.'},
 {t:'Sauce Labs: bug severity vs priority (web article)',u:'https://saucelabs.com/resources/blog/bug-severity-vs-priority',n:'Severity vs priority best practices.'}
];
const BOOKS=[
 ['Mike Cohn','User Stories Applied: For Agile Software Development','2004','ISBN 978-0321205681','Source of good-practice rules for writing acceptance criteria (cited by the ISTQB AcT syllabus).'],
 ['Ken Pugh','Lean-Agile Acceptance Test-Driven Development','2011','ISBN 978-0321714084','Acceptance tests as a team conversation (cited by the AcT syllabus).'],
 ['John Ferguson Smart','BDD in Action','2014','ISBN 978-1617291654','Given–When–Then and behaviour-driven development (cited by the AcT syllabus).'],
 ['James Whittaker','Exploratory Software Testing','2009','ISBN 978-0321636416','Exploratory testing and error guessing (cited by the AcT and Foundation syllabi).'],
 ['Jeffrey Rubin & Dana Chisnell','Handbook of Usability Testing, 2nd ed.','2008','ISBN 978-0470185483','Testing with real users (cited by the AcT syllabus).'],
 ['Glenford Myers et al.','The Art of Software Testing, 3rd ed.','2011','','Boundary value analysis (cited in Foundation syllabus 4.2.2 as Myers 2011).']
];
const T={
 uat:{h:'What is user acceptance testing?',
  say:'UAT is the last check before go-live. The people the system is built for confirm it does what they actually need, not just what was written in a spec.',
  q:[['“Acceptance testing focuses on validation and on demonstrating readiness for deployment, which means that the system fulfills the user’s business needs. Ideally, acceptance testing should be performed by the intended users.”',CTFL+', §2.2.1 Test Levels']],
  how:'In this app you play the intended user. The system was already built and checked by developers; your job is not “does it run?” but “does it do what a Manager, Auditor or Storeman needs?”. The briefing tab holds those needs.',rel:['criteria','env','resources']},
 criteria:{h:'Acceptance criteria',
  say:'Acceptance criteria are the yes/no rules a feature must satisfy to be accepted. Each test you run is tied to one.',
  q:[['“acceptance criteria are measurable criteria, formulated as a statement (or a set of statements), which can be either true or false.”',ACT+', §2.1'],['“Well-written acceptance criteria are precise, measurable and concise.”',ACT+', §2.1'],['“Acceptance criteria represent the test conditions which determine ‘what’ to test. They do not contain the detailed test procedures.”',ACT+', §2.1']],
  how:'The requirement rows and the “Expected” results here are the acceptance criteria. If a rule is vague (for example “without lag”), note it: a criterion you cannot measure cannot be passed or failed cleanly.',rel:['gwt','uat']},
 gwt:{h:'Given – When – Then (and the A × B idea)',
  say:'Every test is a pair: the starting situation and action you give (A) and the result you expect (B). Given–When–Then splits that into set-up, action, result.',
  q:[['“The ‘Given’ block aims to put the test object in a state before performing test actions in the ‘When’ block. The ‘Then’ block specifies the consequences that can be observed from the actions defined in the ‘When’ block.”',ACT+', §2.2']],
  how:'Do the set-up first (log in as the right role, open the right screen), perform exactly one action, then compare what you saw with the expected result. Write what you actually saw in “Actual result”, in your own words.',rel:['criteria','ep','bva']},
 entry:{h:'Pre-flight = entry criteria',
  say:'Before testing starts, certain things must be true. Otherwise you waste time on problems that are not real defects.',
  q:[['“Entry criteria define the preconditions for undertaking a given activity. If entry criteria are not met, it is likely that the activity will prove to be more difficult, time-consuming, costly, and riskier.”',CTFL+', §5.1.3'],['“Typical entry criteria include: availability of resources (e.g., people, tools, environments, test data, budget, time), availability of testware (e.g., test basis, testable requirements, user stories, test cases)…”',CTFL+', §5.1.3']],
  web:'Web articles (e.g. aqua-cloud) add that the UAT environment should resemble production and test data should be prepared first. Treat their numeric thresholds as examples only.',
  how:'The pre-flight checklist is your entry criteria: Staging not Production, the right version, the right account, criteria re-read, and a place to report problems.',rel:['env','exit']},
 env:{h:'Environment and version',
  say:'Test on a copy that behaves like the real thing, and know exactly which version you are checking.',
  q:[['“System testing … it is preferable to test [some qualities] on a complete system in a representative test environment”',CTFL+', §2.2.1']],
  tip:'Production holds real data, so testing there can damage it. Dev changes constantly, so results are not repeatable. That is why the app locks when you pick Production.',
  how:'Check the banner (Staging / Production / Dev) and the version (v1 / v2) before every session. A test passing on v1 says nothing about v2.',rel:['entry']},
 ep:{h:'Equivalence partitioning',
  say:'Inputs fall into groups the system should treat the same way. Test one typical value from each group instead of every value.',
  q:[['“if a test case, that tests one value from an equivalence partition, detects a defect, this defect should also be detected by test cases that test any other value from the same partition. Therefore, one test for each partition is sufficient.”',CTFL+', §4.2.1']],
  how:'Look for groups: valid vs blank vs invalid input, upper vs lower case, Manager vs Auditor. If one value in a group works, the whole group should. If two values from the same group behave differently, you have found a defect.',rel:['bva','errguess']},
 bva:{h:'Boundary value analysis',
  say:'Mistakes cluster at the edges of a rule, such as “10 or more”, “within 3 days” or “after today”. Test the edge value and its neighbour on the other side.',
  q:[['“developers are more likely to make errors with these boundary values. Typical defects found by BVA are located where implemented boundaries are misplaced to positions above or below their intended positions or are omitted altogether.”',CTFL+', §4.2.2'],['2-value BVA: test the boundary value and its closest neighbour in the adjacent partition. 3-value BVA also adds the neighbour on the other side.',CTFL+', §4.2.2 (paraphrase)']],
  how:'Work out the exact edge in the requirement (for example “R100 or more”, “exactly 10 digits”, “3 days”) and test just below, on, and just above it.',rel:['ep','errguess']},
 errguess:{h:'Error guessing',
  say:'Use what you know about how software usually breaks to design tests that go looking for those faults.',
  q:[['“Error guessing is a test technique used to anticipate the occurrence of errors, defects, and failures, based on the tester’s knowledge”',CTFL+', §4.4.1'],['errors may relate to “input (e.g., correct input not accepted, parameters wrong or missing), output (e.g., wrong format, wrong result), logic (e.g., missing cases, wrong operator), computation…”',CTFL+', §4.4.1']],
  how:'Try the things users really do: negative numbers, blank fields, wrong case, doing steps in an unusual order, a second action after the first.',rel:['explor','bva']},
 explor:{h:'Exploratory testing',
  say:'Learn the system while testing it: design, run and judge tests as you go, then follow what looks odd.',
  q:[['“In exploratory testing, tests are simultaneously designed, executed, and evaluated while the tester learns about the test object.”',CTFL+', §4.4.2'],['“Exploratory testing is useful when there are few or inadequate specifications”',CTFL+', §4.4.2']],
  how:'After the scripted tests, spend 15 minutes with a goal such as “try to break scheduling”. Note anything surprising as a possible defect.',rel:['errguess']},
 role:{h:'Role and permission checks',
  say:'Different users must see and do different things. Test each rule as the right role and as a wrong role.',
  q:[['“Acceptance criteria … conditions that an implementation of the user story must meet to be accepted by stakeholders.”',CTFL+', §4.5.2']],
  tip:'Practical tip (not from the book): for every “only X can …” rule, run it twice, once as X (should work) and once as someone else (should be refused). Security-type failures are usually Critical.',
  how:'Switch the “Logged in as” selector. Compare what each role sees with what the briefing says that role may do.',rel:['criteria','sevpri']},
 state:{h:'Multi-step and state-dependent behaviour',
  say:'Some faults only show after several actions, because the system remembers earlier steps.',
  q:[],
  tip:'Practical tip (not from the book): after any change, go back to the other screens that should reflect it (dashboard counts, totals, logs), and repeat an action a second time. Many defects only appear on the second or third step.',
  how:'Re-visit related screens after each action and repeat an action twice. Compare running totals and counts with what you expect by hand.',rel:['errguess','gwt']},
 calc:{h:'Check the arithmetic yourself',
  say:'Never trust a calculated number until you have worked it out independently.',
  q:[],
  tip:'Practical tip (not from the book): do the sum on paper first, from the stated rule (for example variance ÷ system quantity), then compare. Rounding and the wrong base number are common causes of wrong figures.',
  how:'Write the expected figure in the test before you look at the screen.',rel:['gwt','bva']},
 defect:{h:'Writing a good defect report',
  say:'A defect report must give the developer enough to find, reproduce and fix the problem without asking you questions.',
  q:[['Provide “those responsible for handling and resolving reported defects with sufficient information to resolve the issue”',CTFL+', §5.5'],['A defect report typically includes a unique identifier, a title with a short summary, identification of the test object and test environment, the test steps that detected the anomaly, expected results and actual results, severity, priority, and references (for example to the test case).',CTFL+', §5.5 (paraphrase)']],
  how:'The defect form here drafts the title, steps and expected result. You add the actual result, set severity, and make sure someone else could repeat it.',rel:['sevpri','decoy']},
 sevpri:{h:'Severity vs priority, and release impact',
  say:'Severity is how bad the problem is for the user or system. Priority is how soon it should be fixed. They are related but different.',
  q:[['A defect report typically records both “Severity of the defect (degree of impact)” and “Priority to fix”.',CTFL+', §5.5 (paraphrase)']],
  web:'Web guides (Marker.io, Sauce Labs) describe severity as technical or user impact, usually judged by QA, and priority as urgency, usually set by the product or business owner. A low-severity bug can be high priority (a wrong logo just before launch), and the reverse. Typical triage questions: are users blocked, and is there a workaround? (Summarised from search results.)',
  tip:'In these apps: Critical = wrong money or stock numbers, a security or permission failure, or the feature is unusable. Major = a requirement broken but there is a workaround. Minor = small annoyance. The release-impact rule (Critical in Week 3 delays release) is this exercise’s rule, so confirm the real rule with your project.',
  how:'Choose the severity from the user’s point of view. The Release impact line then shows what the Week-3 rule means for that defect.',rel:['defect','exit']},
 decoy:{h:'Not every Fail is a defect',
  say:'Some things you report turn out to be correct behaviour, a misunderstanding, or a change request. Only mark Fail when the result differs from the written expectation.',
  q:[['reported anomalies “may turn out to be real defects or something else (e.g., false–positive result, change request)”',CTFL+', §5.5']],
  how:'The answer key shows “false alarms”. Many tests are designed to pass. Before you fail one, re-read the expected result and your steps.',rel:['defect']},
 exit:{h:'Sign-off = exit criteria and approval',
  say:'Testing ends when agreed conditions are met, and a named person formally approves the release based on your evidence.',
  q:[['“Exit criteria define what must be achieved to declare an activity completed.”',CTFL+', §5.1.3'],['“Running out of time or budget can also be viewed as valid exit criteria … if the stakeholders have reviewed and accepted the risk to go live without further testing.”',CTFL+', §5.1.3']],
  web:'Web guides describe sign-off as written confirmation from business representatives that they reviewed the results and accept the release, often in a short sign-off meeting. Typical exit conditions are: critical defects fixed and retested, planned tests run, and an agreed defect threshold. (aqua-cloud, University of Minnesota, Bird Eats Bug.)',
  how:'Your recommendation (Approve / Approve with known issues / Do not approve) goes to the approver named in the briefing. Cite test IDs and defect IDs. The approver decides; you provide the evidence. Answer the question “Does this do what the real user needs it to do?” for each user need.',rel:['sevpri','cycle']},
 cycle:{h:'The 3-week cycle and late defects',
  say:'A cycle has fixed weeks. Late findings force a trade-off between delaying the release and shipping with a known issue.',
  q:[['“Running out of time or budget can also be viewed as valid exit criteria … if the stakeholders have reviewed and accepted the risk”',CTFL+', §5.1.3']],
  tip:'Practical tip (not from the book): this is why the briefing asks what happens to a problem found late in Week 3. Agree the rule before testing starts, so severity is judged on the facts, not the deadline.',
  how:'Change the week selector and open Defects: the same defect has a different release impact in Week 3.',rel:['exit','sevpri']},
 resources:{h:'Sources and books',special:'resources'}
};
const TABMAP=CFG.tabs||{};
const css=`.lrn-dock{position:fixed;right:14px;bottom:14px;display:flex;gap:6px;z-index:50}
.lrn-dock button,.lrn-i{font:inherit;cursor:pointer;border:1px solid var(--line,#ccc);background:var(--card,#fff);color:var(--ink,#222);border-radius:99px;padding:6px 12px;box-shadow:0 2px 8px #0003}
.lrn-i{padding:0 7px;margin-left:6px;font-size:12px;box-shadow:none;height:fit-content;white-space:nowrap}
.lrn-ov{position:fixed;inset:0;background:#0007;z-index:100;display:flex;align-items:center;justify-content:center;padding:14px}
.lrn-card{background:var(--card,#fff);color:var(--ink,#222);border:1px solid var(--line,#ccc);border-radius:12px;max-width:620px;width:100%;max-height:86vh;overflow:auto;padding:18px 20px;font:15px/1.5 system-ui,sans-serif}
.lrn-card h3{margin:0 0 6px;color:var(--brand,#5b3a29)}.lrn-card blockquote{margin:8px 0;padding:6px 10px;border-left:3px solid #b08d57;background:#b08d5714;font-size:14px}
.lrn-card cite{display:block;color:var(--mute,#666);font-size:12px;margin-top:2px;font-style:normal}
.lrn-card .lab{font-size:12px;text-transform:uppercase;letter-spacing:.04em;color:var(--mute,#666);margin:12px 0 2px}
.lrn-card .box{background:var(--line,#eee);border-radius:8px;padding:8px 10px;font-size:14px}
.lrn-chips{display:flex;gap:6px;flex-wrap:wrap;margin-top:12px}.lrn-chips button,.lrn-x{font:inherit;cursor:pointer;border:1px solid var(--line,#ccc);background:var(--card,#fff);color:var(--ink,#222);border-radius:6px;padding:4px 10px}
.lrn-card a{color:var(--brand,#5b3a29)}`;
const st=document.createElement('style');st.textContent=css;document.head.appendChild(st);
const E=s=>String(s).replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
function open(key,extra){
  const t=T[key];if(!t)return;
  let b=`<h3>${E(t.h)}</h3>`;
  if(t.special==='resources'){
    b+=`<div class="lab">Syllabi and articles</div>`+SOURCES.map(s=>`<p style="margin:6px 0"><a href="${s.u}" target="_blank" rel="noopener">${E(s.t)}</a><br><small>${E(s.n)}</small></p>`).join('')+
       `<div class="lab">Books (as cited by the ISTQB syllabi)</div>`+BOOKS.map(x=>`<p style="margin:6px 0"><b>${E(x[1])}</b> (${x[2]}) by ${E(x[0])}${x[3]?', '+x[3]:''}<br><small>${E(x[4])}</small></p>`).join('')+
       `<p class="sub" style="font-size:12px">Quotes in the pop-ups come from the two ISTQB syllabi. Web articles were summarised, not quoted. Practical-tip boxes are the author’s own advice.</p>`;
  }else{
    b+=`<p>${E(t.say)}</p>`;
    if(t.q&&t.q.length)b+=`<div class="lab">From the source</div>`+t.q.map(([q,c])=>`<blockquote>${E(q)}<cite>${E(c)}</cite></blockquote>`).join('');
    if(t.web)b+=`<div class="lab">From web guides</div><div class="box">${E(t.web)}</div>`;
    if(t.tip)b+=`<div class="lab">${t.tip.startsWith('Practical')?'Practical tip':'Note'}</div><div class="box">${E(t.tip)}</div>`;
    b+=`<div class="lab">How it applies in this app</div><p style="margin:0">${E(t.how)}</p>`;
    if(extra)b+=`<div class="lab">This test</div><div class="box">${E(extra)}</div>`;
    const rel=(t.rel||[]).concat(['resources']);
    b+=`<div class="lrn-chips">${rel.map(r=>`<button data-lrn="${r}">${E(T[r].h.split(' (')[0])}</button>`).join('')}</div>`;
  }
  b+=`<div style="text-align:right;margin-top:14px"><button class="lrn-x" data-lrnx="1">Close</button></div>`;
  const old=document.querySelector('.lrn-ov');if(old)old.remove();
  const ov=document.createElement('div');ov.className='lrn-ov';ov.innerHTML=`<div class="lrn-card" role="dialog" aria-modal="true">${b}</div>`;document.body.appendChild(ov);
  ov.querySelector('.lrn-x,.lrn-chips button')&&ov.querySelector('.lrn-x').focus();
}
const close=()=>{const o=document.querySelector('.lrn-ov');if(o)o.remove()};
document.addEventListener('click',e=>{
  const t=e.target;
  if(t.closest&&t.closest('[data-lrnx]'))return close();
  if(t.classList&&t.classList.contains('lrn-ov'))return close();
  const k=t.closest&&t.closest('[data-lrn]');
  if(k){e.stopPropagation();e.preventDefault();return open(k.dataset.lrn)}
  const q=t.closest&&t.closest('[data-lrntc]');
  if(q){e.stopPropagation();e.preventDefault();const id=q.dataset.lrntc,tc=(CFG.tests||{})[id];if(tc)open(tc.k,tc.note)}
},true);
document.addEventListener('keydown',e=>{if(e.key==='Escape')close()});
const dock=document.createElement('div');dock.className='lrn-dock';
dock.innerHTML='<button data-lrnstep="1">About this step</button><button data-lrn="resources">Sources</button>';document.body.appendChild(dock);
dock.querySelector('[data-lrnstep]').addEventListener('click',e=>{e.stopPropagation();const tab=(CFG.getTab&&CFG.getTab())||'';open(TABMAP[tab]||'uat')});
if(CFG.tests){
  const decorate=()=>{document.querySelectorAll('.tc h3').forEach(h=>{
    if(h.querySelector('[data-lrntc]'))return;const m=h.textContent.trim().match(/^(TC-\d+)/);
    if(m&&CFG.tests[m[1]]){const b=document.createElement('button');b.type='button';b.className='lrn-i';b.dataset.lrntc=m[1];b.title='How this test works';b.textContent='technique';h.appendChild(b)}})};
  new MutationObserver(decorate).observe(document.body,{childList:true,subtree:true});decorate();
}
})();
