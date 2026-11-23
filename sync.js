/* Cloud sync via a private GitHub Gist. Adds a "Sync" button to every page.
   - Syncs everything this site stores in localStorage (tickets, Arcade rank, workbooks, guides).
   - Newest change per item wins. Needs a GitHub token with ONLY the "gist" permission, pasted once per device.
   - Only this app's own progress keys are synced (see ONLY). Anything else on the same web address, like other apps, is never uploaded or overwritten. */
(function(){
 const CFG='uatsync-cfg',META='uatsync-meta',FILE='uat-lab-progress.json',ONLY=/^(uat-tickets-v1|uat-lab-v1|testing-types-v1|stockwatch-practice-v1|start-here-v1|sqllab-v1|clinic-practice-v1|careful-v1|arcade-v1|apilab-v1|exam-v1|tech-v1|capstone-v1|interview-v1|workplace-v1|portfolio-v1|phonehome-v1|labmarks-v1|labapps-v1|coach-v1|analogy-v1|appbugs-v1|autolab-v1|tcase-v1|sidebar-v1|ds-v1|sqa-v1|sample-v1|devtools-v1|devcheck-v1)$/,SKIP={test:k=>!ONLY.test(k)};
 const ls=window.localStorage;const orig=Storage.prototype.setItem;
 const rd=k=>{try{return ls.getItem(k)}catch{return null}};
 let meta={};try{meta=JSON.parse(rd(META)||'{}')}catch{}
 const wmeta=()=>{try{orig.call(ls,META,JSON.stringify(meta))}catch{}};
 const cfg=()=>{try{return JSON.parse(rd(CFG))}catch{return null}};
 const setCfg=c=>{try{orig.call(ls,CFG,JSON.stringify(c))}catch{}};
 /* The Sync button only exists on devices you switch on: open any page once with ?sync=on (turn it off again with ?sync=off). Devices that are already connected also keep it. */
 const SHOWK='uatsync-show';
 try{const q=new URLSearchParams(location.search).get('sync');if(q==='on')orig.call(ls,SHOWK,'1');else if(q==='off')ls.removeItem(SHOWK)}catch{}
 const shown=()=>{try{return rd(SHOWK)==='1'||!!cfg()}catch{return false}};
 let timer=null,busy=false,status='',changedRemote=false;
 Storage.prototype.setItem=function(k,v){orig.call(this,k,v);if(this===ls&&!SKIP.test(k)){meta[k]=Date.now();wmeta();if(cfg())schedule()}};
 const schedule=()=>{if(!(cfg()||{}).pin)return;clearTimeout(timer);timer=setTimeout(()=>sync(false),4000)};
 async function api(path,opt){const c=cfg();const r=await fetch('https://api.github.com'+path,Object.assign({},opt,{headers:{Accept:'application/vnd.github+json','Content-Type':'application/json',Authorization:'Bearer '+c.token}}));
  if(r.status===401)throw new Error('That token was not accepted. Create a new one and reconnect.');
  if(r.status===403||r.status===404){const e=new Error('GitHub refused ('+r.status+'). Make sure the token is a classic token with only the “gist” permission (fine-grained tokens do not work).');e.status=r.status;throw e}
  if(!r.ok)throw new Error('GitHub error '+r.status);return r.json()}
 async function gistId(){const c=cfg();if(c.gist)return c.gist;
  const list=await api('/gists?per_page=100');const g=list.find(x=>x.files&&x.files[FILE]);
  if(g)c.gist=g.id;else{const n=await api('/gists',{method:'POST',body:JSON.stringify({description:'UAT Practice Lab progress (private)',public:false,files:{[FILE]:{content:'{}'}}})});c.gist=n.id}
  setCfg(c);return c.gist}
 /* ---------- PIN: the cloud copy is encrypted with a key made from your PIN (AES-GCM, PBKDF2). Without the PIN a token alone cannot read it. ---------- */
 const b64e=u=>btoa(String.fromCharCode.apply(null,Array.from(u))),b64d=t=>Uint8Array.from(atob(t),ch=>ch.charCodeAt(0));
 let kc={};
 async function key(pin,saltB64){if(!(window.crypto&&crypto.subtle))throw new Error('This browser cannot encrypt here. Open the app over https.');const id=pin+'|'+saltB64;if(kc[id])return kc[id];
  const base=await crypto.subtle.importKey('raw',new TextEncoder().encode(pin),'PBKDF2',false,['deriveKey']);
  return kc[id]=await crypto.subtle.deriveKey({name:'PBKDF2',salt:b64d(saltB64),iterations:250000,hash:'SHA-256'},base,{name:'AES-GCM',length:256},false,['encrypt','decrypt'])}
 function wipeThisDevice(){for(let i=ls.length-1;i>=0;i--){const k=ls.key(i);if(!SKIP.test(k))ls.removeItem(k)}try{ls.removeItem(CFG);ls.removeItem(META);ls.removeItem('uatsync-last')}catch{}meta={};sessionStorage.setItem('uatsync-wiped','1');location.reload()}
 async function unwrap(txt){let o={};try{o=JSON.parse(txt||'{}')}catch{}
  {const c=cfg();if(c){if(c.wipeSeen===undefined){c.wipeSeen=o.wipe||0;setCfg(c)}else if(o.wipe&&o.wipe>c.wipeSeen){wipeThisDevice();throw new Error('This device was reset from another device.')}}}
  if(o&&o.enc===1){const c=cfg();c.salt=o.s;setCfg(c);
   try{const k=await key(c.pin||'',o.s);const pt=await crypto.subtle.decrypt({name:'AES-GCM',iv:b64d(o.i)},k,b64d(o.c));return JSON.parse(new TextDecoder().decode(pt))}
   catch{throw new Error('Wrong PIN, or the PIN was changed on another device. Disconnect and connect again with the right PIN.')}}
  return o}
 async function wrap(data){const c=cfg();if(!c.salt){c.salt=b64e(crypto.getRandomValues(new Uint8Array(16)));setCfg(c)}
  const iv=crypto.getRandomValues(new Uint8Array(12));const k=await key(c.pin||'',c.salt);
  const ct=new Uint8Array(await crypto.subtle.encrypt({name:'AES-GCM',iv},k,new TextEncoder().encode(JSON.stringify(data))));
  return JSON.stringify({enc:1,v:1,wipe:c.wipe||c.wipeSeen||undefined,s:c.salt,i:b64e(iv),c:b64e(ct)})}
 async function pull(){const id=await gistId();const g=await api('/gists/'+id);const f=g.files&&g.files[FILE];if(!f)return false;
  let txt=f.content;if(f.truncated&&f.raw_url)txt=await(await fetch(f.raw_url)).text();
  const remote=await unwrap(txt);let ch=false;
  for(const[k,o] of Object.entries(remote)){if(SKIP.test(k)||!o||typeof o.v!=='string')continue;
   if(!(k in meta)||o.t>meta[k]){if(rd(k)!==o.v){orig.call(ls,k,o.v);ch=true}meta[k]=o.t}}
  wmeta();return ch}
 async function push(){const id=await gistId();const data={};
  for(let i=0;i<ls.length;i++){const k=ls.key(i);if(SKIP.test(k))continue;if(!(k in meta)){meta[k]=Date.now()}data[k]={v:rd(k),t:meta[k]}}
  wmeta();const content=await wrap(data);await api('/gists/'+id,{method:'PATCH',body:JSON.stringify({files:{[FILE]:{content}}})})}
 async function sync(manual,retried){if(busy||!cfg())return;if(!cfg().pin){setStatus('Set a PIN to turn sync back on.','err');return}busy=true;setStatus('Syncing…');
  try{const ch=await pull();if(cfg().admin!==false)await push();const when=new Date().toLocaleTimeString('en-ZA',{hour:'2-digit',minute:'2-digit'});setStatus('Synced at '+when,'ok');
   try{orig.call(ls,'uatsync-last',when)}catch{}
   if(ch){const last=+(sessionStorage.getItem('uatsync-rl')||0);if(!manual&&Date.now()-last>15000){sessionStorage.setItem('uatsync-rl',Date.now());location.reload();return}changedRemote=true;render()}}
  catch(e){const c=cfg();if(e.status===404&&c&&c.gist&&!retried){c.gist=null;setCfg(c);busy=false;return sync(manual,true)}setStatus(e.message||'Sync failed. Check your connection.','err')}finally{busy=false}}
 async function changePin(np){const c=cfg();if(!c||busy)return;busy=true;setStatus('Changing PIN…');
  try{await pull();c.pin=np;c.salt=null;setCfg(c);kc={};await push();const when=new Date().toLocaleTimeString('en-ZA',{hour:'2-digit',minute:'2-digit'});setStatus('PIN changed at '+when,'ok')}
  catch(e){setStatus(e.message||'Could not change the PIN.','err')}finally{busy=false}}
 /* ---------- backup and restore (a file you keep yourself) ---------- */
const LASTBK='uatbackup-last',PREV='uatbackup-prev';
 function collect(){const keys={};for(let i=0;i<ls.length;i++){const k=ls.key(i);if(SKIP.test(k))continue;const v=rd(k);if(typeof v==='string')keys[k]=v}return keys}
 function makeBackup(){const keys=collect();return{app:'uat-practice-lab',format:1,created:new Date().toISOString(),count:Object.keys(keys).length,keys}}
 function downloadBackup(){const b=makeBackup();const blob=new Blob([JSON.stringify(b,null,1)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='uat-lab-backup-'+b.created.slice(0,10)+'.json';document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},500);try{orig.call(ls,LASTBK,b.created)}catch{};return b}
 function readBackup(text){let o;try{o=JSON.parse(text)}catch{return{err:'That file could not be read. Choose the .json file you downloaded from this app.'}}
  if(!o||o.app!=='uat-practice-lab'||typeof o.keys!=='object'||!o.keys)return{err:'That is not a backup from this app.'};
  const ok={},skipped=[];for(const[k,v] of Object.entries(o.keys)){if(ONLY.test(k)&&typeof v==='string'){try{JSON.parse(v);ok[k]=v}catch{skipped.push(k)}}else skipped.push(k)}
  if(!Object.keys(ok).length)return{err:'The backup has no progress in it.'};return{ok,skipped,created:o.created}}
 function applyBackup(ok){try{orig.call(ls,PREV,JSON.stringify({when:new Date().toISOString(),keys:collect()}))}catch{}
  for(const[k,v] of Object.entries(ok)){orig.call(ls,k,v);meta[k]=Date.now()}wmeta()}
 function undoRestore(){let p;try{p=JSON.parse(rd(PREV))}catch{}if(!p||!p.keys)return false;for(let i=ls.length-1;i>=0;i--){const k=ls.key(i);if(!SKIP.test(k))ls.removeItem(k)}for(const[k,v] of Object.entries(p.keys)){orig.call(ls,k,v);meta[k]=Date.now()}wmeta();try{ls.removeItem(PREV)}catch{};return true}
 const fmtD=iso=>{try{return new Date(iso).toLocaleString('en-ZA',{dateStyle:'medium',timeStyle:'short'})}catch{return iso}};
 let bkMsg='';
 function bk(){const last=rd(LASTBK),prev=(()=>{try{return JSON.parse(rd(PREV))}catch{return null}})();
  return `<div id="us-bk" style="margin-top:10px;border-top:1px solid #d5dae2;padding-top:8px"><h4>Backup file</h4><div class="m">Save a copy of all your progress, or restore one. Do this before you clear your browser or change phone. The file stays with you.</div>
   <button id="bk-dl">Download backup</button><button id="bk-up">Restore from file</button><input type="file" id="bk-file" accept=".json,application/json" style="display:none">${prev?'<button id="bk-undo">Undo last restore</button>':''}
   <div class="m" style="margin-top:6px">${last?'Last backup: '+fmtD(last):'No backup yet.'}</div>${bkMsg?`<div class="m" id="bk-msg" style="margin-top:4px;color:#16202f">${bkMsg}</div>`:''}</div>`}
 /* ---------- UI ---------- */
 const css=document.createElement('style');css.textContent=`#us-b{position:fixed;left:14px;bottom:14px;z-index:9999;font:600 13px system-ui,sans-serif;background:#11203b;color:#fff;border:1px solid #ffffff55;border-radius:99px;padding:8px 14px;cursor:pointer;box-shadow:0 2px 8px #0005}
#us-b i{display:inline-block;width:8px;height:8px;border-radius:99px;background:#98a2b3;margin-right:6px}#us-b.ok i{background:#4cc88a}#us-b.err i{background:#ff7b6b}
#us-p{max-height:calc(100vh - 80px);overflow:auto;position:fixed;left:14px;bottom:56px;z-index:9999;width:min(340px,calc(100vw - 28px));background:#fff;color:#16202f;border:1px solid #cbd2dc;border-radius:14px;padding:14px;font:14px/1.45 system-ui,sans-serif;box-shadow:0 8px 30px #0006;display:none}
@media(prefers-color-scheme:dark){#us-p{background:#1a2029;color:#eaeef5;border-color:#2b3340}}
#us-p h4{margin:0 0 6px;font-size:15px}#us-p input{width:100%;font:inherit;padding:7px 9px;border:1px solid #cbd2dc;border-radius:8px;background:transparent;color:inherit;margin:6px 0}
#us-p button,#us-p a.us-a{font:600 13px system-ui;border:1px solid #cbd2dc;background:transparent;color:inherit;border-radius:8px;padding:6px 11px;cursor:pointer;text-decoration:none;display:inline-block;margin:4px 4px 0 0}
#us-p .pri{background:#2563eb;border-color:#2563eb;color:#fff}#us-p .m{color:#667085;font-size:12.5px}#us-p .e{color:#c0392b;font-size:13px;margin-top:6px}`;document.head.appendChild(css);
 const btn=document.createElement('button');btn.id='us-b';btn.type='button';const pan=document.createElement('div');pan.id='us-p';
 const add=()=>{document.body.appendChild(btn);document.body.appendChild(pan)};document.body?add():addEventListener('DOMContentLoaded',add);
 let stText='',stCls='',openP=false;
 function setStatus(t,c){stText=t;stCls=c||'';render()}
 function render(){const c=cfg();const nopin=c&&!c.pin;btn.className=c?stCls:'';btn.innerHTML=`<i></i>${c?(stCls==='err'?'Sync problem':stCls==='ok'?'Synced':nopin?'Set PIN':'Sync'):'Sync'}`;btn.title=c?stText:'Sync progress across devices';
  const last=rd('uatsync-last');
  pan.innerHTML=(nopin?`<h4>Set your sync PIN</h4><div class="m">Sync now locks your cloud copy with a PIN. Choose one of 6 or more characters. Use the <b>same PIN on every device</b>. It cannot be recovered if you forget it.</div><input id="us-sp" type="password" placeholder="Your sync PIN (6+ characters)" autocomplete="off"><label class="m" style="display:flex;gap:8px;align-items:center;margin:4px 0"><input type="checkbox" id="us-spa" checked style="width:auto;margin:0"> Admin device</label><button class="pri" id="us-setpin">Save PIN</button><button id="us-off">Disconnect this device</button>${stCls==='err'?`<div class="e">${stText}</div>`:''}`:c?`<h4>Cloud sync is on</h4><div class="m">${stText||(last?'Last synced at '+last:'Ready')}</div>${changedRemote?'<div class="e" style="color:#2563eb">New progress came from another device. <button id="us-rl">Reload to see it</button></div>':''}
   <div><button class="pri" id="us-now">Sync now</button><button id="us-off">Disconnect this device</button></div>
   ${c.admin===false?'<div class="m" style="margin-top:8px"><b>Read-only device.</b> It receives your progress but never saves changes to the cloud, and cannot reset other devices or change the PIN.</div>':`<div style="margin-top:8px"><div class="m">Lost a phone or lent it out? This erases the progress saved on every other device that is connected, and disconnects them. Your cloud copy and this device stay as they are.</div><button id="us-wipe">Reset all other devices</button></div>
   <div style="margin-top:8px"><div class="m">Your cloud copy is locked with your PIN. Change it here (other devices will then ask you to connect again with the new PIN).</div><input id="us-np" type="password" placeholder="New PIN (6+ characters)" autocomplete="off"><button id="us-chg">Change PIN</button></div>`}<div class="m" style="margin-top:8px">Your progress is stored in a private gist in your GitHub account. “Disconnect” only removes the token from this device.</div>${stCls==='err'?`<div class="e">${stText}</div>`:''}`
  :`<h4>Keep your progress everywhere</h4><div class="m">Connect once per device. Your tickets, Arcade rank and workbooks then follow you.</div>
   <ol style="padding-left:18px;margin:8px 0"><li><a class="us-a" style="margin:0" target="_blank" rel="noopener" href="https://github.com/settings/tokens/new?scopes=gist&description=UAT%20Lab%20sync">Create a token</a> (only “gist” is ticked; set expiry as you like)</li><li>Copy it and paste below</li><li>Choose a PIN (6+ characters). Use the <b>same PIN on every device</b>. It cannot be recovered if you forget it.</li></ol>
   <input id="us-t" type="password" placeholder="ghp_… token" autocomplete="off"><input id="us-pin" type="password" placeholder="Your sync PIN (6+ characters)" autocomplete="off"><label class="m" style="display:flex;gap:8px;align-items:center;margin:4px 0"><input type="checkbox" id="us-adm" checked style="width:auto;margin:0"> Admin device (can save changes, reset others, change PIN). Untick for a read-only device.</label><button class="pri" id="us-go">Connect</button>${stCls==='err'?`<div class="e">${stText}</div>`:''}<div class="m" style="margin-top:6px">The token and PIN are kept only on this device. Your progress in the cloud is encrypted with the PIN, so a new device cannot read it without it.</div>`)+bk();
  const sh=shown();btn.style.display=sh?'':'none';pan.style.display=sh&&openP?'block':'none'}
 document.addEventListener('click',e=>{const id=e.target.id;
  if(e.target===btn||btn.contains(e.target)){openP=!openP;render();return}
  if(id==='us-go'){const t=($('us-t')||{}).value.trim(),pn=(($('us-pin')||{}).value||'').trim();if(!t)return;if(pn.length<6){stCls='err';stText='Choose a PIN of at least 6 characters.';render();return}setCfg({token:t,pin:pn,admin:!!(($('us-adm')||{}).checked)});stCls='';stText='';sync(true).then(()=>{if(!cfg())return;const f=stCls==='err';if(f){try{ls.removeItem(CFG)}catch{}}render()})}
  else if(id==='us-now')sync(true);else if(id==='us-off'){try{ls.removeItem(CFG)}catch{}stText='';stCls='';changedRemote=false;render()}
  else if(id==='us-rl')location.reload();
  else if(id==='us-wipe'){if((cfg()||{}).admin===false)return;if(!confirm('Erase the progress on every OTHER device and disconnect them? They are reset the next time they open the app with internet. This device keeps its progress.'))return;const c=cfg();if(!c)return;c.wipe=Date.now();c.wipeSeen=c.wipe;setCfg(c);sync(true).then(()=>{stText='Other devices will reset the next time they open the app online.';stCls='ok';render()})}
  else if(id==='us-setpin'){const pn=(($('us-sp')||{}).value||'').trim();if(pn.length<6){stCls='err';stText='Choose a PIN of at least 6 characters.';render();return}const c=cfg();if(!c)return;c.pin=pn;c.admin=!!(($('us-spa')||{}).checked);setCfg(c);stCls='';stText='';sync(true)}
  else if(id==='us-chg'){if((cfg()||{}).admin===false)return;const np=(($('us-np')||{}).value||'').trim();if(np.length<6){stCls='err';stText='The new PIN needs at least 6 characters.';render();return}changePin(np)}
  else if(id==='bk-dl'){const b=downloadBackup();bkMsg='Saved a backup with '+b.count+' item'+(b.count===1?'':'s')+'. Keep the file somewhere safe (your phone, email to yourself, a drive).';render()}
  else if(id==='bk-up'){const f=$('bk-file');if(f)f.click()}
  else if(id==='bk-undo'){if(confirm('Put back the progress you had before the last restore?')){const ok=undoRestore();bkMsg=ok?'Restored your earlier progress. Reloading…':'Nothing to undo.';render();if(ok)setTimeout(()=>location.reload(),700)}}
  else if(openP&&!pan.contains(e.target)){openP=false;render()}});
 const $=id=>document.getElementById(id);
 document.addEventListener('change',e=>{if(e.target&&e.target.id==='bk-file'){const f=e.target.files&&e.target.files[0];if(!f)return;if(f.size>5e6){bkMsg='That file is too big to be a backup.';render();return}const r=new FileReader();r.onload=()=>{const res=readBackup(String(r.result));if(res.err){bkMsg=res.err;render();return}
   const n=Object.keys(res.ok).length;if(!confirm('Restore '+n+' item'+(n===1?'':'s')+' from a backup made '+fmtD(res.created)+'?\n\nThis replaces the same items on this device. You can undo it afterwards.')){bkMsg='Restore cancelled.';render();return}
   applyBackup(res.ok);bkMsg='Restored '+n+' item'+(n===1?'':'s')+(res.skipped.length?' ('+res.skipped.length+' not recognised and ignored)':'')+'. Reloading…';render();setTimeout(()=>location.reload(),700)};r.readAsText(f);e.target.value=''}});
 render();if(cfg()){sync(false);document.addEventListener('visibilitychange',()=>{if(!document.hidden)sync(true)})}
 addEventListener('pagehide',()=>{if(cfg()&&timer){clearTimeout(timer);timer=null;try{sync(false)}catch{}}});
})();
