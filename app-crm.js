/* Practice app: Bean Counter CRM (Enterprise / SaaS). */
(function(){
 const ST=['New','Contacted','Qualified','Won','Lost'];
 const OK={New:['Contacted','Lost'],Contacted:['Qualified','Lost'],Qualified:['Won','Lost'],Won:[],Lost:['New']};
 const ROLES=[['admin','Admin'],['rep','Sales rep'],['viewer','Viewer']];
 const r2=x=>Math.round(x*100)/100;const money=x=>'R'+r2(x).toFixed(2);
 const esc=x=>String(x==null?'':x).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
 const live=s=>s.leads.filter(l=>!l.deleted);
 const counted=(s,B)=>B.has('b6')?s.leads:live(s);
 const tot=(s,B,st)=>counted(s,B).filter(l=>l.stage===st).reduce((a,l)=>a+l.value,0);
 const open=(s,B)=>tot(s,B,'New')+tot(s,B,'Contacted')+tot(s,B,'Qualified')+(B.has('b4')?tot(s,B,'Lost'):0);
 const MOD={id:'crm',title:'Bean Counter CRM',icon:'🤝',kind:'Enterprise / SaaS',level:'harder',activeCount:6,
  blurb:'A sales pipeline for a coffee wholesaler: three user roles, deal stages with strict moves, an add-lead form and a pipeline report.',
  bugs:{
   b1:{area:'Permissions',type:'Permission / security',sev:'Critical',desc:'A Viewer can move a deal to another stage. Viewers must be read-only.',hint:'Switch to the Viewer role and try to change something, then check whether it really changed.',idea:'Test every role against every action, especially the role with the fewest rights.'},
   b2:{area:'Pipeline stages',type:'Business rule',sev:'Major',desc:'A New lead can jump straight to Won. A deal must pass through Contacted and Qualified first.',hint:'Try to move a brand-new lead as far forward as you can in one step.',idea:'Try the illegal moves in a workflow, not just the legal ones.'},
   b3:{area:'Delete',type:'Permission / security',sev:'Critical',desc:'A Sales rep can delete a lead. Only an Admin may delete.',hint:'As a Sales rep, look at what the Delete button really does.',idea:'Check that restricted actions are refused, not just hidden or labelled.'},
   b4:{area:'Pipeline report',type:'Calculation',sev:'Major',desc:'The total open value also counts Lost deals. Open means New + Contacted + Qualified only.',hint:'Add up the open stages by hand and compare with the Total open value.',idea:'Recalculate every report total by hand from the list.'},
   b5:{area:'Edit deal',type:'State',sev:'Major',desc:'Editing a deal value shows a success message but the old value stays.',hint:'After saving an edit, read the value in the list, not just the message.',idea:'After a change, check that the new data really stuck.'},
   b6:{area:'Pipeline report',type:'State',sev:'Major',desc:'A deleted lead is still counted in the pipeline report.',hint:'Delete a lead, then compare the report with the leads you can still see.',idea:'After deleting, check every place that uses that data.'},
   b7:{area:'Add lead',type:'Boundary',sev:'Major',desc:'A phone number with 9 digits is accepted. It must be exactly 10 digits.',hint:'Try a phone number one digit too short.',idea:'Boundary values: one below, exactly on, one above.'},
   b8:{area:'Add lead',type:'Validation',sev:'Major',desc:'A deal value of 0 is accepted. It must be a positive number.',hint:'Try the smallest "empty" value you can think of for the deal value.',idea:'Try zero, negative and blank on every number field.'},
   b9:{area:'Add lead',type:'Validation',sev:'Minor',desc:'An email without an @ sign is accepted if it contains a dot.',hint:'Type something that looks a bit like an email but is not one.',idea:'Invalid formats on every field, not only empty values.'},
   b10:{area:'Pipeline stages',type:'Permission / security',sev:'Major',desc:'A Sales rep can reopen a Lost deal. Only an Admin may reopen a Lost deal.',hint:'Try to bring a Lost deal back as the Sales rep.',idea:'Check rules that depend on both the role and the current state.'}},
  extra:[
   {h:'About Bean Counter CRM',html:'<p><b>Bean Counter CRM</b> is a pretend sales tool for a small coffee wholesaler. Staff keep a list of leads (cafes and restaurants that might buy coffee) and move each deal through a pipeline. You are the user acceptance tester: check it behaves the way the business rules say.</p><p>Start data: Karoo Cafe R1000 (New), Table Bay Roasters R2000 (Contacted), Jozi Beans R4000 (Qualified), Durban Deli R8000 (Won), Cape Kiosk R500 (Lost). The app starts as a Sales rep.</p>'},
   {h:'The business rules (your expected results)',html:'<ul><li>Three roles: <b>Admin</b>, <b>Sales rep</b>, <b>Viewer</b>.</li><li><b>Viewer</b> can only look. A Viewer cannot move, edit, add or delete anything.</li><li>Stage moves allowed: New to Contacted, Contacted to Qualified, Qualified to Won. Any open stage (New, Contacted, Qualified) can go to Lost. Nothing else, so a New lead can <b>not</b> go straight to Won.</li><li>Won deals are final. A Lost deal can be reopened to New by an <b>Admin only</b>.</li><li>Only an <b>Admin</b> can delete a lead. A deleted lead disappears everywhere, including the report.</li><li>Editing a deal value: it must be a positive number, and the new value is saved.</li><li>Add lead: name is required; email must look like name@place.co.za (has @ and a dot after it); phone must be exactly 10 digits; deal value must be a positive number. The first problem found is shown.</li><li><b>Total open value</b> = New + Contacted + Qualified. Lost and Won are not open. <b>Won value this month</b> = total of Won deals.</li></ul>'},
   {h:'Test ideas',html:'<ul><li>Switch roles and try every action as each role.</li><li>Try every illegal stage move, not only legal ones.</li><li>Check forms with too short, too long, empty, zero and wrongly formatted values.</li><li>After a delete or an edit, check the list AND the report.</li><li>Add up the report by hand.</li></ul>'}],
  views:['leads','add','report'],
  fresh:()=>({role:'rep',view:'leads',next:6,msg:'',addMsg:'',editMsg:'',f:{name:'',email:'',phone:'',value:''},leads:[
   {id:'l1',name:'Karoo Cafe',value:1000,stage:'New',deleted:false},
   {id:'l2',name:'Table Bay Roasters',value:2000,stage:'Contacted',deleted:false},
   {id:'l3',name:'Jozi Beans',value:4000,stage:'Qualified',deleted:false},
   {id:'l4',name:'Durban Deli',value:8000,stage:'Won',deleted:false},
   {id:'l5',name:'Cape Kiosk',value:500,stage:'Lost',deleted:false}]}),
  read(s,B){const o={role:s.role==='admin'?'Admin':s.role==='rep'?'Sales rep':'Viewer',leadCount:live(s).length,addMsg:s.addMsg||'No message yet',editMsg:s.editMsg||'No message yet',
    tNew:r2(tot(s,B,'New')),tContacted:r2(tot(s,B,'Contacted')),tQualified:r2(tot(s,B,'Qualified')),tWon:r2(tot(s,B,'Won')),tLost:r2(tot(s,B,'Lost')),openValue:r2(open(s,B)),wonValue:r2(tot(s,B,'Won'))};
   live(s).forEach(l=>{o['stage_'+l.id]=l.stage;o['value_'+l.id]=r2(l.value)});return o},
  act(s,B,a,arg){
   if(a==='role'){s.role=arg;s.msg='';return true}
   if(a==='view'){s.view=arg;return true}
   if(a==='setname'){s.f.name=arg||'';return true}
   if(a==='setemail'){s.f.email=arg||'';return true}
   if(a==='setphone'){s.f.phone=arg||'';return true}
   if(a==='setvalue'){s.f.value=arg||'';return true}
   if(a==='addlead'){
    if(s.role==='viewer'){s.addMsg='Not allowed for this role';return true}
    const f=s.f,n=f.name.trim(),e=f.email.trim(),p=f.phone.trim(),vs=f.value.trim();const v=vs===''?NaN:Number(vs);
    const emailOk=B.has('b9')?e.includes('.'):/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e);
    const phoneOk=B.has('b7')?/^\d{9,10}$/.test(p):/^\d{10}$/.test(p);
    const valOk=isFinite(v)&&(B.has('b8')?v>=0:v>0);
    if(!n)s.addMsg='Name is required';else if(!emailOk)s.addMsg='Email is not valid';else if(!phoneOk)s.addMsg='Phone must be 10 digits';else if(!valOk)s.addMsg='Value must be a positive number';
    else{s.leads.push({id:'l'+s.next++,name:n,value:v,stage:'New',deleted:false});s.addMsg='Lead added';s.f={name:'',email:'',phone:'',value:''}}
    return true}
   if(a==='move'){const[id,to]=String(arg).split('|');const l=s.leads.find(x=>x.id===id&&!x.deleted);if(!l)return true;
    if(s.role==='viewer'&&!B.has('b1')){s.msg='Not allowed: viewers cannot edit';return true}
    let ok=OK[l.stage].includes(to);
    if(l.stage==='Lost'&&to==='New'&&s.role==='rep'&&!B.has('b10'))ok=false;
    if(B.has('b2')&&l.stage==='New'&&to==='Won')ok=true;
    if(ok){l.stage=to;s.msg=l.name+' moved to '+to}else s.msg='Move refused: not allowed';
    return true}
   if(a==='edit'){const[id,vs]=String(arg).split('|');const l=s.leads.find(x=>x.id===id&&!x.deleted);if(!l)return true;
    if(s.role==='viewer'){s.editMsg='Not allowed: viewers cannot edit';return true}
    const t=String(vs).trim();const v=t===''?NaN:Number(t);
    if(!(isFinite(v)&&v>0)){s.editMsg='Value must be a positive number';return true}
    if(!B.has('b5'))l.value=v;s.editMsg='Value saved';return true}
   if(a==='delete'){const l=s.leads.find(x=>x.id===arg&&!x.deleted);if(!l)return true;
    const ok=s.role==='admin'||(B.has('b3')&&s.role==='rep');
    if(!ok){s.msg='Not allowed: only an Admin can delete';return true}
    l.deleted=true;s.msg=l.name+' deleted';return true}
   return false},
  render(s,B,ui){const R=MOD.read(s,B);let body='';
   const hdr=`<div class="hd"><b>🤝 Bean Counter CRM</b><span>Role: <span data-k="role">${R.role}</span></span></div>`;
   const roles=`<div style="padding:6px 10px">${ROLES.map(([k,l])=>`<button class="${s.role===k?'go':''}" data-act="role" data-arg="${k}">${l}</button>`).join(' ')}</div>`;
   const tabs=[['leads','Leads'],['add','Add lead'],['report','Report']];
   if(s.view==='leads'){body=`<div class="mute"><span data-k="leadCount">${R.leadCount}</span> lead(s)</div>`+live(s).map(l=>`<div class="it" style="display:block"><span class="n"><b>${esc(l.name)}</b> <span class="badge" data-k="stage_${l.id}">${l.stage}</span> <span data-k="value_${l.id}">${money(l.value)}</span></span><div style="margin-top:4px">${ST.filter(x=>x!==l.stage).map(x=>`<button data-act="move" data-arg="${l.id}|${x}">→ ${x}</button>`).join(' ')}</div><div style="margin-top:4px"><input id="v_${l.id}" placeholder="New value" style="width:90px"> <button data-act="edit" data-arg="${l.id}" data-in="v_${l.id}">Save value</button> <button class="dng" data-act="delete" data-arg="${l.id}">Delete</button></div></div>`).join('')+(s.msg?`<div class="msg ${/refused|Not allowed/.test(s.msg)?'e':'s'}">${esc(s.msg)}</div>`:'')+`<div class="mute" style="margin-top:6px">Edit message: <span data-k="editMsg">${esc(R.editMsg)}</span></div>`}
   else if(s.view==='add'){const F=(k,lab,ph)=>`<div style="margin:4px 0"><input id="f_${k}" placeholder="${lab}" value="${esc(s.f[k])}"> <button data-act="set${k}" data-in="f_${k}">Set ${lab.toLowerCase()}</button></div>`;
    body=F('name','Name')+F('email','Email')+F('phone','Phone')+F('value','Deal value')+`<div style="margin-top:8px"><button class="go" data-act="addlead">Add lead</button></div><div class="mute" style="margin-top:6px">Message: <span data-k="addMsg">${esc(R.addMsg)}</span></div>`}
   else{body=`<table><tr><th>Stage</th><th>Total</th></tr><tr><td>New</td><td data-k="tNew">${money(R.tNew)}</td></tr><tr><td>Contacted</td><td data-k="tContacted">${money(R.tContacted)}</td></tr><tr><td>Qualified</td><td data-k="tQualified">${money(R.tQualified)}</td></tr><tr><td>Won</td><td data-k="tWon">${money(R.tWon)}</td></tr><tr><td>Lost</td><td data-k="tLost">${money(R.tLost)}</td></tr></table><div class="tot" style="margin-top:8px">Total open value <span data-k="openValue">${money(R.openValue)}</span><br><b>Won value this month <span data-k="wonValue">${money(R.wonValue)}</span></b></div>`}
   return hdr+roles+`<div class="tb">${tabs.map(([k,l])=>`<button class="${s.view===k?'on':''}" data-act="view" data-arg="${k}">${l}</button>`).join('')}</div><div class="bd">${body}</div>`},
  tests:[
   {id:'T1',title:'A Sales rep can move a deal forward',bug:null,why:'A control test: the normal, allowed stage move must work, or nobody can do their job.',steps:['Make sure the role is Sales rep.','On the Leads tab find Karoo Cafe and press "→ Contacted".','Read the stage shown next to Karoo Cafe.'],scenario:[['move','l1|Contacted']],observe:[{id:'o1',label:'What stage does Karoo Cafe show?',type:'choice',choices:ST,key:'stage_l1',expected:'Contacted'}]},
   {id:'T2',title:'Won value this month',bug:null,why:'A control test: the sales manager reads this figure every month, and with the start data it must equal the one Won deal.',steps:['Open the Report tab.','Read "Won value this month".'],scenario:[['view','report']],observe:[{id:'o1',label:'What is the Won value this month?',type:'number',key:'wonValue',expected:8000,unit:'R'}]},
   {id:'T3',title:'A correct lead is added',bug:null,why:'A control test: a lead with valid details must be accepted, or the sales team cannot capture new customers.',steps:['Open the Add lead tab.','Fill and set each field: Name "Sizwe Roasters", Email "sizwe@roasters.co.za", Phone "0821234567", Deal value "1500". Press the Set button next to each field.','Press "Add lead" and read the message.'],scenario:[['view','add'],['setname','Sizwe Roasters'],['setemail','sizwe@roasters.co.za'],['setphone','0821234567'],['setvalue','1500'],['addlead']],observe:[{id:'o1',label:'What message is shown?',type:'choice',choices:['No message yet','Lead added','Name is required','Email is not valid','Phone must be 10 digits','Value must be a positive number'],key:'addMsg',expected:'Lead added'}]},
   {id:'T4',title:'Total open value in the report',bug:'b4',why:'The owner uses the open value to forecast sales. Counting dead (Lost) deals makes the forecast too happy.',steps:['Open the Report tab.','Add up New, Contacted and Qualified by hand (do not include Won or Lost).','Read "Total open value".'],scenario:[['view','report']],observe:[{id:'o1',label:'What is the Total open value?',type:'number',key:'openValue',expected:7000,unit:'R'}]},
   {id:'T5',title:'A Viewer cannot move a deal',bug:'b1',why:'Viewers (for example the accountant) may only look. If they can change deals, the data cannot be trusted.',steps:['Press the Viewer role button.','On the Leads tab press "→ Contacted" on Karoo Cafe.','Read the stage shown next to Karoo Cafe.'],scenario:[['role','viewer'],['move','l1|Contacted']],observe:[{id:'o1',label:'What stage does Karoo Cafe show?',type:'choice',choices:ST,key:'stage_l1',expected:'New'}]},
   {id:'T6',title:'A New lead cannot jump to Won',bug:'b2',why:'The pipeline exists so every sale is followed up properly. Skipping stages gives false sales figures.',steps:['Make sure the role is Sales rep.','On the Leads tab press "→ Won" on Karoo Cafe (a New lead).','Read the stage shown next to Karoo Cafe.'],scenario:[['move','l1|Won']],observe:[{id:'o1',label:'What stage does Karoo Cafe show?',type:'choice',choices:ST,key:'stage_l1',expected:'New'}]},
   {id:'T7',title:'A Sales rep cannot delete a lead',bug:'b3',why:'Deleting loses customer history for ever. Only the Admin is trusted with it.',steps:['Make sure the role is Sales rep.','On the Leads tab press Delete on Karoo Cafe.','Read how many leads are listed.'],scenario:[['delete','l1']],observe:[{id:'o1',label:'How many leads are listed?',type:'number',key:'leadCount',expected:5}]},
   {id:'T8',title:'An edited deal value is saved',bug:'b5',why:'If an edit looks saved but is not, the team quotes customers using old prices and amounts.',steps:['Make sure the role is Sales rep.','On the Leads tab type 1500 in the box under Karoo Cafe and press "Save value".','Read the value shown next to Karoo Cafe.'],scenario:[['edit','l1|1500']],observe:[{id:'o1',label:'What value is shown next to Karoo Cafe?',type:'number',key:'value_l1',expected:1500,unit:'R'}]},
   {id:'T9',title:'A deleted lead leaves the report',bug:'b6',why:'A lead that no longer exists must not stay in the money totals, or the report is wrong.',steps:['Press the Admin role button.','On the Leads tab press Delete on Karoo Cafe (the only New lead).','Open the Report tab and read the New total.'],scenario:[['role','admin'],['delete','l1'],['view','report']],observe:[{id:'o1',label:'What is the New total in the report?',type:'number',key:'tNew',expected:0,unit:'R'}]},
   {id:'T10',title:'Phone must be exactly 10 digits',bug:'b7',why:'A short phone number means the rep can never call the customer back.',steps:['Open the Add lead tab.','Set Name "Sizwe Roasters", Email "sizwe@roasters.co.za", Phone "082123456" (only 9 digits), Deal value "1500".','Press "Add lead" and read the message.'],scenario:[['view','add'],['setname','Sizwe Roasters'],['setemail','sizwe@roasters.co.za'],['setphone','082123456'],['setvalue','1500'],['addlead']],observe:[{id:'o1',label:'What message is shown?',type:'choice',choices:['No message yet','Lead added','Name is required','Email is not valid','Phone must be 10 digits','Value must be a positive number'],key:'addMsg',expected:'Phone must be 10 digits'}]},
   {id:'T11',title:'Deal value must be positive',bug:'b8',why:'A deal worth nothing clutters the pipeline and spoils averages. The rule says positive numbers only.',steps:['Open the Add lead tab.','Set Name "Sizwe Roasters", Email "sizwe@roasters.co.za", Phone "0821234567", Deal value "0".','Press "Add lead" and read the message.'],scenario:[['view','add'],['setname','Sizwe Roasters'],['setemail','sizwe@roasters.co.za'],['setphone','0821234567'],['setvalue','0'],['addlead']],observe:[{id:'o1',label:'What message is shown?',type:'choice',choices:['No message yet','Lead added','Name is required','Email is not valid','Phone must be 10 digits','Value must be a positive number'],key:'addMsg',expected:'Value must be a positive number'}]},
   {id:'T12',title:'Email must have an @ sign',bug:'b9',why:'Quotes and invoices are emailed. An address that is not a real email means the customer never receives them.',steps:['Open the Add lead tab.','Set Name "Sizwe Roasters", Email "sizwe.roasters.co.za" (no @), Phone "0821234567", Deal value "1500".','Press "Add lead" and read the message.'],scenario:[['view','add'],['setname','Sizwe Roasters'],['setemail','sizwe.roasters.co.za'],['setphone','0821234567'],['setvalue','1500'],['addlead']],observe:[{id:'o1',label:'What message is shown?',type:'choice',choices:['No message yet','Lead added','Name is required','Email is not valid','Phone must be 10 digits','Value must be a positive number'],key:'addMsg',expected:'Email is not valid'}]},
   {id:'T13',title:'Only an Admin can reopen a Lost deal',bug:'b10',why:'Reopening a lost deal changes the forecast. The rule keeps this decision with the Admin.',steps:['Make sure the role is Sales rep.','On the Leads tab press "→ New" on Cape Kiosk (a Lost deal).','Read the stage shown next to Cape Kiosk.'],scenario:[['move','l5|New']],observe:[{id:'o1',label:'What stage does Cape Kiosk show?',type:'choice',choices:ST,key:'stage_l5',expected:'Lost'}]}]};
 (window.LABAPPS=window.LABAPPS||{}).crm=MOD;
})();
