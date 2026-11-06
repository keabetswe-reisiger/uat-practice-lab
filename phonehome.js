/* Phone home: show only what you choose; everything else is kept in a Library dropdown at the bottom.
   Choice is saved on this phone (key phonehome-v1, synced like your other progress). Phones only (<=700px). */
(function(){
 if(!matchMedia('(max-width:700px)').matches)return;
 var KEY='phonehome-v1',main=document.querySelector('main');if(!main||!document.querySelector('#today'))return;
 function esc(t){return String(t).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
 function slug(t){return t.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')}
 function load(){try{var s=JSON.parse(localStorage.getItem(KEY));if(s&&Array.isArray(s.show))return s.show}catch(e){}return null}
 function save(a){try{localStorage.setItem(KEY,JSON.stringify({show:a,at:Date.now()}))}catch(e){}}
 var st=document.createElement('style');st.textContent='#ph-bar{margin:18px 0 8px}#ph-bar button{min-height:48px;width:100%;font-weight:700;font-size:16px}#ph-pick{border:1px solid #d5dae2;border-radius:14px;padding:12px 14px;margin:10px 0;background:#fff}#ph-pick h3{margin:0 0 4px;font-size:17px}#ph-pick p{margin:0 0 8px;color:#4a5568;font-size:14.5px}#ph-pick label{display:flex;align-items:center;gap:12px;min-height:48px;font-size:16px;font-weight:600}#ph-pick input{width:24px;height:24px;flex:none;accent-color:#7a5a1e}#ph-pick .row{display:flex;gap:8px;flex-wrap:wrap;margin-top:8px}#ph-pick .row button{flex:1 1 110px;min-height:48px}#ph-lib{margin:14px 0 40px}#ph-lib>h2{margin:0 0 4px}#ph-lib>p{margin:0 0 8px;color:#4a5568;font-size:14.5px}#ph-libsel{width:100%;min-height:52px;font-size:16px;font-weight:700}#ph-libview{margin-top:12px}#ph-libview>div[hidden]{display:none}#ph-libview .ph-t{font-weight:800;font-size:17px;margin:0 0 8px}#ph-lib #mapside{display:block!important}#ph-lib .ph-pl{list-style:none;margin:0;padding:0}#ph-lib .ph-pl a{display:flex;align-items:center;min-height:52px;padding:0 12px;border-radius:10px;color:#16202f;text-decoration:none;font-weight:600;font-size:16px}#ph-lib .ph-pl a:active{background:#f3f4f6}';
 document.head.appendChild(st);
 function build(){
  if(document.getElementById('ph-bar'))return;
  var blocks=[];
  var hero=main.querySelector('.hero');if(hero)blocks.push({id:'guide',title:'Start here guide',els:[hero]});
  document.querySelectorAll('#today .td-c').forEach(function(c,i){var k=c.querySelector('.td-k');var t=k?k.textContent.trim():'Card '+(i+1);t=t.charAt(0)+t.slice(1).toLowerCase();blocks.push({id:'today-'+slug(t),title:'Today: '+t,els:[c],today:true})});
  Array.prototype.slice.call(main.children).forEach(function(h){
   if(h.tagName!=='H2'||h.closest('#today'))return;
   var els=[],e=h.nextElementSibling;while(e&&e.tagName!=='H2'&&e.id!=='mapside'&&e.tagName!=='SCRIPT'){els.push(e);e=e.nextElementSibling}
   var t=h.textContent.replace(/ /g,' ').replace(/^\s*\/\d+\s*/,'').trim();if(!els.length||!t)return;
   blocks.push({id:'sec-'+slug(t),title:t,h:h,els:els})});
  var saved=load(),def=blocks.filter(function(b){return b.today}).map(function(b){return b.id});
  var show=saved||def;
  var hidden=blocks.filter(function(b){return show.indexOf(b.id)<0});
  blocks.forEach(function(b){if(show.indexOf(b.id)>-1){if(b.h)b.h.classList.remove('ph-hide');b.els.forEach(function(e){e.classList.remove('ph-hide')})}});
  var items=[];
  hidden.forEach(function(b){b.els.forEach(function(e){e.classList.remove('ph-hide')});if(b.h)b.h.style.display='none';items.push({id:b.id,title:b.title,group:'On the home page',els:b.els})});
  var ms=document.getElementById('mapside');if(ms)items.push({id:'map',title:'Map your learning',group:'Your progress',els:[ms]});
  (window.__mmData||[]).forEach(function(g){var seen={};var ul=document.createElement('ul');ul.className='ph-pl';g[1].forEach(function(x){if(seen[x[0]])return;seen[x[0]]=1;var li=document.createElement('li'),a=document.createElement('a');a.href=x[0];a.textContent=x[1];li.appendChild(a);ul.appendChild(li)});items.push({id:'pages-'+slug(g[0]),title:g[0],group:'Pages',els:[ul]})});
  var lib=document.createElement('section');lib.id='ph-lib';
  var groups=[];items.forEach(function(it){if(groups.indexOf(it.group)<0)groups.push(it.group)});
  lib.innerHTML='<h2>Library</h2><p>Everything else is kept here. Pick something to open it.</p><select id="ph-libsel" aria-label="Library: choose what to open"><option value="">Choose what to open</option>'+groups.map(function(g){return '<optgroup label="'+esc(g)+'">'+items.filter(function(it){return it.group===g}).map(function(it){return '<option value="'+esc(it.id)+'">'+esc(it.title)+'</option>'}).join('')+'</optgroup>'}).join('')+'</select><div id="ph-libview"></div>';
  var view=lib.querySelector('#ph-libview');
  items.forEach(function(it){var w=document.createElement('div');w.hidden=true;w.setAttribute('data-id',it.id);var t=document.createElement('div');t.className='ph-t';t.textContent=it.title;w.appendChild(t);it.els.forEach(function(e){w.appendChild(e)});view.appendChild(w)});
  lib.querySelector('#ph-libsel').addEventListener('change',function(e){var v=e.target.value;[].slice.call(view.children).forEach(function(w){w.hidden=w.getAttribute('data-id')!==v})});
  var bar=document.createElement('div');bar.id='ph-bar';bar.innerHTML='<button type="button" id="ph-edit">Choose what shows here</button><div id="ph-pick" hidden></div>';
  main.appendChild(bar);main.appendChild(lib);
  var pick=document.getElementById('ph-pick');
  document.getElementById('ph-edit').addEventListener('click',function(){
   if(!pick.hidden){pick.hidden=true;return}
   pick.innerHTML='<h3>What shows on this page</h3><p>Ticked items stay on the page. The rest go into the Library below.</p>'+blocks.map(function(b){return '<label><input type="checkbox" value="'+esc(b.id)+'"'+(show.indexOf(b.id)>-1?' checked':'')+'>'+esc(b.title)+'</label>'}).join('')+'<div class="row"><button type="button" class="pri" data-ph="save">Save</button><button type="button" data-ph="reset">Back to simple</button><button type="button" data-ph="cancel">Cancel</button></div>';
   pick.hidden=false;pick.scrollIntoView({block:'nearest'})});
  pick.addEventListener('click',function(e){var a=e.target.getAttribute&&e.target.getAttribute('data-ph');if(!a)return;
   if(a==='cancel'){pick.hidden=true;return}
   if(a==='reset'){try{localStorage.removeItem(KEY)}catch(x){}location.reload();return}
   if(a==='save'){save([].slice.call(pick.querySelectorAll('input:checked')).map(function(i){return i.value}));location.reload()}});
  window.__phonehome={blocks:blocks.map(function(b){return b.id}),shown:show.slice()};
 }
 function go(){var t=document.getElementById('today');
 if(t.querySelector('.td-c'))build();
 else{var mo=new MutationObserver(function(){if(t.querySelector('.td-c')){mo.disconnect();build()}});mo.observe(t,{childList:true,subtree:true});setTimeout(function(){mo.disconnect();build()},3000)}
 }
 if(document.readyState==='complete')go();else window.addEventListener('load',go);
})();
