/* Practice app: Order API Console (API testing). */
(function(){
 const esc=x=>String(x==null?'':x).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
 const TXT={200:'OK',201:'Created',204:'No Content',400:'Bad Request',401:'Unauthorized',403:'Forbidden',404:'Not Found'};
 const USERS=[['none','No token'],['sipho','Sipho (owner of orders 1-4)'],['thabo','Thabo (owner of orders 5-7)']];
 const ITEMS=['-','Latte','Flat white','Beans 1kg','Rusks','Cappuccino','Espresso','Mocha'];
 const OWN=['-','sipho','thabo'];
 const STX=['-','OK','Created','No Content','Bad Request','Unauthorized','Forbidden','Not Found'];
 const blank=()=>({status:'-',id:'-',item:'-',qty:'-',owner:'-',count:'-',page:'-',first:'-',cost:'Not present'});
 const reply=(status,o)=>Object.assign(blank(),{status},o||{});
 const MOD={id:'api',title:'Order API Console',icon:'',kind:'API testing',level:'harder',activeCount:6,
  blurb:'A small request console talking to a pretend orders server: send GET, POST and DELETE requests as different people and check the status codes and replies.',
  bugs:{
   x1:{area:'GET one order',type:'Business rule',sev:'Major',desc:'Asking for an order that does not exist returns 200 OK with an empty reply. It must return 404 Not Found.',hint:'Ask the server for something that was never created and read the status code, not just the body.',idea:'Test the "not found" path of every lookup, and check the status code as well as the body.'},
   x2:{area:'POST order',type:'Validation',sev:'Major',desc:'An order with an empty item name is accepted and created. The item is required, so this must give 400.',hint:'Leave one of the body fields empty and see what the server says.',idea:'Try empty values on every required field.'},
   x3:{area:'POST order',type:'Boundary',sev:'Major',desc:'A quantity of 11 is accepted. The maximum is 10.',hint:'Try the number right after the largest allowed quantity.',idea:'Boundary values: one below, exactly on, one above the limit.'},
   x4:{area:'POST order',type:'Business rule',sev:'Minor',desc:'A newly created order returns 200 OK instead of 201 Created.',hint:'Create a good order and read the exact status code and status text.',idea:'Check the exact status code, not only that it "worked".'},
   x5:{area:'GET order list',type:'State',sev:'Major',desc:'Page 2 of the order list shows the same orders as page 1.',hint:'Ask for the second page and look at which order comes first.',idea:'Check paging: page 2 must continue after page 1, not repeat it.'},
   x6:{area:'DELETE order',type:'State',sev:'Critical',desc:'DELETE answers 204 but the order is not really deleted; it is still in the list.',hint:'After deleting, do not trust the 204. Look at what the server lists afterwards.',idea:'After a change request, read the data again to prove it really changed.'},
   x7:{area:'GET one order',type:'Permission / security',sev:'Critical',desc:'A person can read another person\'s order. It must give 403 Forbidden.',hint:'Sign in as one person and ask for an order that belongs to the other.',idea:'Test that each user can reach only their own data.'},
   x8:{area:'Reply body',type:'Permission / security',sev:'Critical',desc:'The reply for a single order includes the internal cost price. Internal fields must never be sent to the caller.',hint:'Read every labelled line in the reply, not only the ones you asked about.',idea:'Inspect the whole response body for fields that should be private.'},
   x9:{area:'Sign-in',type:'Permission / security',sev:'Critical',desc:'A request with no token still works and returns the order. It must give 401 Unauthorized.',hint:'Send a request while "No token" is chosen.',idea:'Test every endpoint with no credentials at all.'},
   x10:{area:'DELETE order',type:'Permission / security',sev:'Critical',desc:'A person can delete another person\'s order (204). It must give 403 Forbidden.',hint:'Try to delete an order that is not yours.',idea:'Test restricted actions (delete) against the wrong user, not only reads.'}},
  extra:[
   {h:'About the Order API Console',html:'<p>Behind most apps there is a server that answers <b>requests</b>. A request has a <b>method</b> (GET = read, POST = create, DELETE = remove), a <b>path</b> (like /orders/1) and sometimes a token that says who is asking. The server answers with a <b>status code</b> (a number such as 200 or 404), a status text, and a body. This console is a pretend tool for sending requests to a pretend orders server. You are the tester.</p><p>How to use it: choose a value in each box and press the Set button next to it (method, path, who am I, and for POST the item and quantity), then press <b>Send</b>. The reply appears underneath, and every request is added to the history.</p><p>Start data (7 orders): 1 Latte x2, 2 Flat white x1, 3 Beans 1kg x4, 4 Rusks x6 (all Sipho); 5 Cappuccino x2, 6 Espresso x3, 7 Mocha x1 (all Thabo). The server keeps an internal cost price on each order.</p>'},
   {h:'The business rules (your expected results)',html:'<ul><li>No token means no access: any request gives <b>401</b> Unauthorized.</li><li><b>GET /orders</b> lists only the orders the caller owns, 3 per page. Use <b>/orders?page=2</b> for the next page. The reply shows the page, how many orders are on it (count) and the id of the first one. Sipho has 4 orders, so page 1 has 3 and page 2 has 1.</li><li><b>GET /orders/{id}</b>: 200 with the order if it is yours; <b>404</b> if the order does not exist; <b>403</b> if it belongs to someone else.</li><li><b>POST /orders</b> needs an item (not empty) and a quantity that is a whole number from 1 to 10. Valid gives <b>201 Created</b> and a new id (one more than the highest id). Invalid gives <b>400</b>.</li><li><b>DELETE /orders/{id}</b> by the owner gives <b>204</b> and the order is really gone (a later list no longer shows it, and a GET gives 404). Someone else\'s order gives <b>403</b>; a missing order gives <b>404</b>.</li><li>Replies never include internal fields such as the cost price.</li><li>The history counts every request you send.</li></ul>'},
   {h:'Test ideas',html:'<ul><li>For every request, check the status code first, then the body.</li><li>Try each person against each order: own, other person\'s, and one that does not exist.</li><li>Try no token at all.</li><li>Try missing, empty and too-big values in the POST body.</li><li>After a DELETE, ask the server again to prove it is gone.</li></ul>'}],
  views:['console'],
  fresh:()=>({view:'console',m:'GET',p:'/orders',u:'none',item:'',qty:'',res:null,hist:[],
   orders:[
    {id:1,item:'Latte',qty:2,owner:'sipho',cost:18},
    {id:2,item:'Flat white',qty:1,owner:'sipho',cost:22},
    {id:3,item:'Beans 1kg',qty:4,owner:'sipho',cost:95},
    {id:4,item:'Rusks',qty:6,owner:'sipho',cost:30},
    {id:5,item:'Cappuccino',qty:2,owner:'thabo',cost:20},
    {id:6,item:'Espresso',qty:3,owner:'thabo',cost:15},
    {id:7,item:'Mocha',qty:1,owner:'thabo',cost:24}]}),
  read(s,B){const r=s.res||blank();
   return {status:r.status,statusText:r.status==='-'?'-':TXT[r.status],bodyId:r.id,bodyItem:r.item,bodyQty:r.qty,bodyOwner:r.owner,bodyCount:r.count,bodyPage:r.page,bodyFirst:r.first,bodyCost:r.cost,historyCount:s.hist.length}},
  act(s,B,a,arg){
   if(a==='setm'){s.m=arg||'GET';return true}
   if(a==='setp'){s.p=arg||'';return true}
   if(a==='setu'){s.u=arg||'none';return true}
   if(a==='setitem'){s.item=arg||'';return true}
   if(a==='setqty'){s.qty=arg||'';return true}
   if(a==='view'){s.view=arg;return true}
   if(a==='send'){
    const path=String(s.p).trim(),parts=path.split('?'),route=parts[0],q=parts[1]||'';
    let r;
    const one=route.match(/^\/orders\/(\d+)$/);const id=one?Number(one[1]):null;
    const mine=o=>o.owner===s.u;
    const view=o=>reply(200,{id:o.id,item:o.item,qty:o.qty,owner:o.owner,cost:B.has('x8')?'Present':'Not present'});
    if(s.u==='none'&&!B.has('x9'))r=reply(401);
    else if(s.m==='GET'&&route==='/orders'){
     const pm=q.match(/page=(\d+)/);const pg=pm?Number(pm[1]):1;
     const list=s.orders.filter(mine);
     const sl=list.slice((pg-1)*3,pg*3);const shown=(B.has('x5')&&pg===2)?list.slice(0,3):sl;
     r=reply(200,{page:pg,count:shown.length,first:shown.length?shown[0].id:'-'})}
    else if(s.m==='GET'&&one){
     const o=s.orders.find(x=>x.id===id);
     if(!o)r=B.has('x1')&&id>7?reply(200):reply(404);
     else if(s.u==='none')r=view(o);
     else if(!mine(o)&&!B.has('x7'))r=reply(403);
     else r=view(o)}
    else if(s.m==='POST'&&route==='/orders'){
     const it=s.item.trim(),qs=s.qty.trim();const qn=/^\d+$/.test(qs)?Number(qs):NaN;
     const qok=isFinite(qn)&&qn>=1&&qn<=(B.has('x3')?11:10);
     const iok=it!==''||B.has('x2');
     if(!iok||!qok)r=reply(400);
     else{const nid=s.orders.reduce((m,o)=>Math.max(m,o.id),0)+1;const o={id:nid,item:it,qty:qn,owner:s.u==='none'?'sipho':s.u,cost:10};s.orders.push(o);r=Object.assign(view(o),{status:B.has('x4')?200:201})}}
    else if(s.m==='DELETE'&&one){
     const o=s.orders.find(x=>x.id===id);
     if(!o)r=reply(404);
     else if(!mine(o)&&!B.has('x10'))r=reply(403);
     else{if(!B.has('x6'))s.orders=s.orders.filter(x=>x.id!==id);r=reply(204)}}
    else r=reply(404);
    s.res=r;s.hist.push(s.m+' '+path+' -> '+r.status);return true}
   return false},
  render(s,B,ui){const R=MOD.read(s,B);
   const F=(id,lab,inner,act)=>`<div style="margin:4px 0"><b style="display:inline-block;width:80px">${lab}</b> ${inner} <button data-act="${act}" data-in="${id}">Set</button></div>`;
   const meth=['GET','POST','DELETE'].map(x=>`<option ${s.m===x?'selected':''}>${x}</option>`).join('');
   const who=USERS.map(([k,l])=>`<option value="${k}" ${s.u===k?'selected':''}>${l}</option>`).join('');
   const line=(lab,k,v)=>`<tr><td>${lab}</td><td><span data-k="${k}">${esc(v)}</span></td></tr>`;
   const body=`<div class="mute">Choose each value, press its Set button, then press Send. Current: ${esc(s.m)} ${esc(s.p)} as ${esc((USERS.find(u=>u[0]===s.u)||[0,s.u])[1])}</div>`
    +F('api_m','Method',`<select id="api_m">${meth}</select>`,'setm')
    +F('api_p','Path',`<input id="api_p" value="${esc(s.p)}" placeholder="/orders">`,'setp')
    +F('api_u','Who am I',`<select id="api_u">${who}</select>`,'setu')
    +F('api_i','Item (POST)',`<input id="api_i" value="${esc(s.item)}" placeholder="item name">`,'setitem')
    +F('api_q','Quantity (POST)',`<input id="api_q" value="${esc(s.qty)}" placeholder="quantity" style="width:80px">`,'setqty')
    +`<div style="margin:8px 0"><button class="go" data-act="send">Send</button></div>`
    +`<div class="it" style="display:block"><b>Response</b><table>`
    +line('Status code','status',R.status)+line('Status text','statusText',R.statusText)
    +line('id','bodyId',R.bodyId)+line('item','bodyItem',R.bodyItem)+line('qty','bodyQty',R.bodyQty)+line('owner','bodyOwner',R.bodyOwner)
    +line('count','bodyCount',R.bodyCount)+line('page','bodyPage',R.bodyPage)+line('first id','bodyFirst',R.bodyFirst)+line('internal cost field','bodyCost',R.bodyCost)
    +`</table></div>`
    +`<div class="mute" style="margin-top:6px">History: <span data-k="historyCount">${R.historyCount}</span> request(s)</div>`
    +`<div class="mute">${s.hist.slice(-5).map(esc).join('<br>')}</div>`;
   return `<div class="hd"><b>Order API Console</b><span>Pretend orders server</span></div><div class="bd">${body}</div>`},
  tests:[
   {id:'T1',title:'Read your own order',bug:null,why:'A control test: the normal request must work, or nobody can see their orders.',steps:['Choose method GET and press Set; type path /orders/1 and press Set.','Choose "Sipho" in Who am I and press Set.','Press Send and read the status code and the item in the response.'],scenario:[['setm','GET'],['setp','/orders/1'],['setu','sipho'],['send']],observe:[{id:'o1',label:'What status code is shown?',type:'number',key:'status',expected:200},{id:'o2',label:'What item is shown in the response?',type:'choice',choices:ITEMS,key:'bodyItem',expected:'Latte'}]},
   {id:'T2',title:'A new order gets the next id',bug:null,why:'A control test: a good order must be created with the next free id, or orders overwrite each other.',steps:['Choose method POST and press Set; type path /orders and press Set.','Choose "Sipho" and press Set.','Type item Latte and press Set; type quantity 2 and press Set.','Press Send and read the id in the response.'],scenario:[['setm','POST'],['setp','/orders'],['setu','sipho'],['setitem','Latte'],['setqty','2'],['send']],observe:[{id:'o1',label:'What id is shown in the response?',type:'number',key:'bodyId',expected:8}]},
   {id:'T3',title:'The first page of the order list',bug:null,why:'A control test: a person must see their own orders, three per page.',steps:['Choose method GET and press Set; type path /orders and press Set.','Choose "Sipho" and press Set.','Press Send and read the count and the first id.'],scenario:[['setm','GET'],['setp','/orders'],['setu','sipho'],['send']],observe:[{id:'o1',label:'What count is shown?',type:'number',key:'bodyCount',expected:3},{id:'o2',label:'What first id is shown?',type:'number',key:'bodyFirst',expected:1}]},
   {id:'T4',title:'The history counts requests',bug:null,why:'A control test: a tester relies on the history to know which requests were really sent.',steps:['Choose GET, path /orders, person Sipho (press Set after each) and press Send.','Change the path to /orders/1, press Set, and press Send again.','Read how many requests the history shows.'],scenario:[['setm','GET'],['setp','/orders'],['setu','sipho'],['send'],['setp','/orders/1'],['send']],observe:[{id:'o1',label:'How many requests does the history show?',type:'number',key:'historyCount',expected:2}]},
   {id:'T5',title:'An order that does not exist',bug:'x1',why:'If the server says "OK" for something that is not there, apps show blank orders and hide real problems.',steps:['Choose GET, path /orders/99, person Sipho (press Set after each).','Press Send.','Read the status code.'],scenario:[['setm','GET'],['setp','/orders/99'],['setu','sipho'],['send']],observe:[{id:'o1',label:'What status code is shown?',type:'number',key:'status',expected:404}]},
   {id:'T6',title:'An order needs an item',bug:'x2',why:'An order with no item cannot be made or packed, so the bakery would waste time.',steps:['Choose POST, path /orders, person Sipho (press Set after each).','Make sure the item box is empty and press Set; type quantity 2 and press Set.','Press Send and read the status code.'],scenario:[['setm','POST'],['setp','/orders'],['setu','sipho'],['setitem',''],['setqty','2'],['send']],observe:[{id:'o1',label:'What status code is shown?',type:'number',key:'status',expected:400}]},
   {id:'T7',title:'Quantity above the maximum',bug:'x3',why:'The business only allows 1 to 10 per order. A bigger number can mean a typing mistake that costs real money.',steps:['Choose POST, path /orders, person Sipho (press Set after each).','Type item Latte and press Set; type quantity 11 and press Set.','Press Send and read the status code.'],scenario:[['setm','POST'],['setp','/orders'],['setu','sipho'],['setitem','Latte'],['setqty','11'],['send']],observe:[{id:'o1',label:'What status code is shown?',type:'number',key:'status',expected:400}]},
   {id:'T8',title:'Creating an order gives 201',bug:'x4',why:'Other programs rely on the exact code 201 to know that something new was created.',steps:['Choose POST, path /orders, person Sipho (press Set after each).','Type item Latte and press Set; type quantity 2 and press Set.','Press Send and read the status code and the status text.'],scenario:[['setm','POST'],['setp','/orders'],['setu','sipho'],['setitem','Latte'],['setqty','2'],['send']],observe:[{id:'o1',label:'What status code is shown?',type:'number',key:'status',expected:201},{id:'o2',label:'What status text is shown?',type:'choice',choices:STX,key:'statusText',expected:'Created'}]},
   {id:'T9',title:'Page 2 of the order list',bug:'x5',why:'Paging must continue where the last page stopped, or people never see some of their orders.',steps:['Choose GET, person Sipho (press Set after each).','Type the path /orders?page=2 and press Set.','Press Send and read the count and the first id.'],scenario:[['setm','GET'],['setp','/orders?page=2'],['setu','sipho'],['send']],observe:[{id:'o1',label:'What first id is shown?',type:'number',key:'bodyFirst',expected:4},{id:'o2',label:'What count is shown?',type:'number',key:'bodyCount',expected:1}]},
   {id:'T10',title:'A deleted order is really gone',bug:'x6',why:'If a deleted order stays, it is still made and billed, and the customer is angry.',steps:['Choose person Thabo and press Set.','Choose DELETE, path /orders/5, press Set after each, and press Send (expect 204).','Choose GET, path /orders, press Set after each, and press Send.','Read the count: Thabo started with 3 orders.'],scenario:[['setu','thabo'],['setm','DELETE'],['setp','/orders/5'],['send'],['setm','GET'],['setp','/orders'],['send']],observe:[{id:'o1',label:'What count is shown in the last response?',type:'number',key:'bodyCount',expected:2}]},
   {id:'T11',title:'Reading somebody else\'s order',bug:'x7',why:'Customers\' orders are private. Showing them to the wrong person is a data leak.',steps:['Choose GET, path /orders/5, person Sipho (press Set after each). Order 5 belongs to Thabo.','Press Send.','Read the status code.'],scenario:[['setm','GET'],['setp','/orders/5'],['setu','sipho'],['send']],observe:[{id:'o1',label:'What status code is shown?',type:'number',key:'status',expected:403}]},
   {id:'T12',title:'No internal fields in the reply',bug:'x8',why:'The cost price is a business secret. It must never be sent to customers.',steps:['Choose GET, path /orders/1, person Sipho (press Set after each).','Press Send.','Look at every line in the response, including "internal cost field".'],scenario:[['setm','GET'],['setp','/orders/1'],['setu','sipho'],['send']],observe:[{id:'o1',label:'What does "internal cost field" show?',type:'choice',choices:['Not present','Present'],key:'bodyCost',expected:'Not present'}]},
   {id:'T13',title:'A request with no token',bug:'x9',why:'The server must know who is asking. Without a token anyone on the internet could read orders.',steps:['Choose GET, path /orders/1.','Choose "No token" in Who am I (press Set after each).','Press Send and read the status code.'],scenario:[['setm','GET'],['setp','/orders/1'],['setu','none'],['send']],observe:[{id:'o1',label:'What status code is shown?',type:'number',key:'status',expected:401}]},
   {id:'T14',title:'Deleting somebody else\'s order',bug:'x10',why:'Deleting is permanent. Only the owner may do it.',steps:['Choose DELETE, path /orders/6, person Sipho (press Set after each). Order 6 belongs to Thabo.','Press Send.','Read the status code.'],scenario:[['setm','DELETE'],['setp','/orders/6'],['setu','sipho'],['send']],observe:[{id:'o1',label:'What status code is shown?',type:'number',key:'status',expected:403}]}]};
 (window.LABAPPS=window.LABAPPS||{}).api=MOD;
})();
