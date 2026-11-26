/* Failure types (defect categories) for every testing app.
   Severity (Critical, High, Medium, Low) says HOW BAD a bug is. The failure type says WHAT KIND of problem it is.
   Classic apps (coffee, clinic, stockwatch) have a hand-written type per bug. The lab apps (lab.html?app=...) and the
   farm apps already label each bug with a short "type" (Calculation, Boundary, Permission...); fromEngine() maps that
   label and the bug text to the closest failure type (a best fit, so the apps say "best fit"). */
(function(){
 const CATS={
  sec:['Security / Permissions','Who may see or do what is not enforced. Users reach pages, data or actions meant for a higher role, or sensitive data is exposed.','a stop-release risk','Role-Based Access Control (RBAC) checks and security testing: log in as each role (for example Manager, Doctor, Receptionist) and confirm each one sees and does only what that role is allowed to.','Doctor Thabo logs in and sees the Manager KPI suite (UAT-103).'],
  data:['Data Integrity','Information that is stored, calculated, updated or shown becomes wrong, lost, duplicated or out of sync between screens.','a stop-release risk','Functional, database and end-to-end testing: create, edit and filter records, then check that numbers, totals and saved details match the expected truth on every screen.','The dashboard shows wrong appointment counts and does not update when switching between weekly and monthly (UAT-104).'],
  func:['Functional','A button, workflow or business rule does not do its intended job.','must be fixed before release if it blocks a main task','Run the workflow from start to finish with normal data and check each step does what the requirement says.','Clicking Save Appointment does nothing, or a booking saves under the wrong date.'],
  usab:['Usability / UX','The feature works, but is confusing, awkward or unforgiving for real users.','can usually be fixed in a later release','Use the feature like a real user would, including different ways of typing, and ask whether a normal person would be stopped or confused.','Search finds Mokoena but not mokoena (UAT-107).'],
  ui:['UI / Cosmetic','Visual layout problems that do not change how the app works.','can usually wait','Look at each screen at different sizes and zoom levels: check for overlapping text, broken icons, cut-off labels and misaligned columns.','Overlapping text or cut-off labels on mobile.'],
  val:['Validation / Input handling','The app accepts bad data it should block, or refuses good data it should accept.','often serious, because bad data then spreads','Boundary and negative testing: try values just below, on and just above each limit, plus blanks, letters and negative numbers, and check the refusal message.','Booking an appointment in the past, or letters in a phone number field.'],
  int:['Integration / API','Two systems, modules or services do not communicate properly.','serious when another system is affected','End-to-end testing: do the action, then check the other system too (message sent, calendar updated, data arrived).','A booking in the clinic portal does not trigger the SMS reminder or update the doctor calendar.'],
  perf:['Performance','The system is too slow, freezes or crashes under normal or heavy use.','serious when it blocks real work','Time the action against the limit in the requirement and repeat it with many users or large data.','Patient search takes 30 seconds, or the app crashes when 20 staff log in at once.'],
  compat:['Compatibility','The app works in one browser or device but breaks in another.','serious when many users are on the broken one','Repeat the same test on each listed browser, device and screen size and compare the results.','Walk-in Add looks fine on Chrome desktop but the layout breaks on a tablet or Safari.']};
 const WHY={
  'clinic-practice|D1':'A Doctor must not see the Manager KPI suite, so an access rule is not being enforced.','clinic-practice|D2':'The numbers shown do not match the Weekly filter, so the data displayed is wrong.','clinic-practice|F1':'Search works, but it punishes a normal user who types in lowercase.','clinic-practice|F2':'A Doctor can see patients assigned to other doctors: restricted data is exposed.','clinic-practice|S1':'The form accepts a duplicate booking it should refuse: bad input gets through.','clinic-practice|S3':'The booking workflow sets the wrong status (Confirmed instead of Pending Review).','clinic-practice|R1':'The Dashboard count is out of sync with the Diary after a cancel.','clinic-practice|R2':'The change is saved but the change-log entry is missing, so the stored history is incomplete.','clinic-practice|Q1':'A blank patient type is accepted although the field is required.',
  'coffee|B1':'A 9-digit phone number is accepted although exactly 10 digits are required.','coffee|B2':'The code works, but a normal user typing it in lowercase is rejected.','coffee|B3':'The quantity accepts 0 and below, which are invalid values.','coffee|B4':'The free-delivery business rule starts at the wrong amount.','coffee|B5':'The confirmation total leaves out the delivery fee, so a calculated amount is wrong.',
  'stockwatch-practice|E4':'The expiring-soon rule misses items that are exactly 3 days away.','stockwatch-practice|E3':'The screen shows the wrong batch date, so displayed data is wrong.','stockwatch-practice|R1':'Stock expiring today is accepted although the rule refuses it.','stockwatch-practice|R2':'A negative quantity is accepted and reduces stock.','stockwatch-practice|L1':'The low-stock count is not refreshed, so it is out of sync with the stock.','stockwatch-practice|V5':'The percentage is calculated from the wrong base, so a calculated figure is wrong.','stockwatch-practice|P6':'A Storeman can approve adjustments that only a Manager may approve.','stockwatch-practice|W7':'A waste reason is not required, so input that should be refused is accepted.','stockwatch-practice|W8':'The waste total is overwritten instead of added up, so a stored total is wrong.'};
 const CLASSIC={
  'clinic-practice|D1':'sec','clinic-practice|D2':'data','clinic-practice|F1':'usab','clinic-practice|F2':'sec','clinic-practice|S1':'val','clinic-practice|S3':'func','clinic-practice|R1':'data','clinic-practice|R2':'data','clinic-practice|Q1':'val',
  'coffee|B1':'val','coffee|B2':'usab','coffee|B3':'val','coffee|B4':'func','coffee|B5':'data',
  'stockwatch-practice|E4':'func','stockwatch-practice|E3':'data','stockwatch-practice|R1':'val','stockwatch-practice|R2':'val','stockwatch-practice|L1':'data','stockwatch-practice|V5':'data','stockwatch-practice|P6':'sec','stockwatch-practice|W7':'val','stockwatch-practice|W8':'data'};
 function fromEngine(b){const type=String((b&&b.type)||'').toLowerCase(),d=String((b&&b.desc)||'')+' '+String((b&&b.area)||'');
  if(/permission|security/.test(type))return 'sec';
  if(/sorting/.test(type)||(/case.?sensitiv/i.test(d)&&!/validation|boundary/.test(type)&&!/(refus|reject)/i.test(d)))return 'usab';
  if(/validation/.test(type))return 'val';
  if(/boundary/.test(type))return /accept|allow|refus|reject|invalid|blank|empty|limit|maximum|minimum|too (long|short|many|few)|must be|only digits|letters/i.test(d)?'val':'func';
  if(/calculation|rounding|data/.test(type))return 'data';
  if(/state/.test(type))return /not (updat|refresh)|stale|still (shows|counts|reads)|count|total|out of sync|balance|stock level/i.test(d)?'data':'func';
  if(/business rule/.test(type))return /accept|allow(s|ed)? (a |an |the )?(blank|empty|negative|past|invalid)|refus|reject|blank|invalid/i.test(d)?'val':'func';
  if(/display/.test(type))return /layout|overlap|cut off|misalign|colour|color|font/i.test(d)?'ui':'data';
  if(/message/.test(type))return /number|count|figure|higher|lower|total|amount|\d/i.test(d)?'data':'usab';
  return 'func'}
 const keyOf=k=>CATS[k]?k:'func';
 function name(k){return CATS[keyOf(k)][0]}
 function ofClassic(page,bug){return CLASSIC[page+'|'+bug]||null}
 function line(k,best){if(!k)return '';const c=CATS[keyOf(k)];return '<br><b>Failure type'+(best?' (best fit)':'')+':</b> '+c[0]+'. '+c[1]+' <span class="mute">Business risk: '+c[2]+'.</span>'}
 function text(k,best){return k?'Failure type'+(best?' (best fit)':'')+': '+CATS[keyOf(k)][0]:''}
 const esc=t=>String(t).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
 function block(k,why,best){if(!k)return '';const c=CATS[keyOf(k)];
  return '<div style="margin-top:6px"><b>Failure type to write on the defect'+(best?' (best fit)':'')+': '+esc(c[0])+'</b>'
   +'<ul style="margin:4px 0 0 18px;padding:0"><li><b>What it means:</b> '+esc(c[1])+'</li>'
   +(why?'<li><b>Why this bug is this type:</b> '+esc(why)+'</li>':'')
   +'<li><b>How testers find it:</b> '+esc(c[3])+'</li>'
   +'<li><b>Example:</b> '+esc(c[4])+'</li>'
   +'<li><b>Business risk:</b> '+esc(c[2])+'. Severity says how bad the bug is; the failure type says what kind of problem it is.</li></ul></div>'}
 function cell(k,why,best){if(!k)return '';return '<details><summary><b>'+esc(CATS[keyOf(k)][0])+'</b></summary>'+block(k,why,best)+'</details>'}
 window.FAILTYPE={CATS,fromEngine,ofClassic,name,line,text,
  block,cell,
  classicBlock:(page,bug)=>block(ofClassic(page,bug),WHY[page+'|'+bug],false),
  classicCell:(page,bug)=>cell(ofClassic(page,bug),WHY[page+'|'+bug],false),
  engineBlock:b=>block(fromEngine(b),'The app labels this bug "'+((b&&b.type)||'')+'", which is closest to this failure type.',true),
  classicLine:(page,bug)=>line(ofClassic(page,bug),false),
  engineLine:b=>line(fromEngine(b),true)};
})();
