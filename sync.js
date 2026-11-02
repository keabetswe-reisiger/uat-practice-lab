/* Cloud sync via a private GitHub Gist. Adds a "☁ Sync" button to every page.
   - Syncs everything this site stores in localStorage (tickets, Arcade rank, workbooks, guides).
   - Newest change per item wins. Needs a GitHub token with ONLY the "gist" permission, pasted once per device.
   - Some keys are deliberately kept off the cloud (see SKIP). */
(function(){
 const CFG='uatsync-cfg',META='uatsync-meta',FILE='uat-lab-progress.json',SKIP=/^(uatsync-)/;
 const ls=window.localStorage;const orig=Storage.prototype.setItem;
 const rd=k=>{try{return ls.getItem(k)}catch{return null}};
 let meta={};try{meta=JSON.parse(rd(META)||'{}')}catch{}
 const wmeta=()=>{try{orig.call(ls,META,JSON.stringify(meta))}catch{}};
 const cfg=()=>{try{return JSON.parse(rd(CFG))}catch{return null}};
 const setCfg=c=>{try{orig.call(ls,CFG,JSON.stringify(c))}catch{}};
 let timer=null,busy=false,status='',changedRemote=false;
 Storage.prototype.setItem=function(k,v){orig.call(this,k,v);if(this===ls&&!SKIP.test(k)){meta[k]=Date.now();wmeta();if(cfg())schedule()}};
 const schedule=()=>{clearTimeout(timer);timer=setTimeout(()=>sync(false),4000)};
 async function api(path,opt){const c=cfg();const r=await fetch('https://api.github.com'+path,Object.assign({},opt,{headers:{Accept:'application/vnd.github+json','Content-Type':'application/json',Authorization:'Bearer '+c.token}}));
  if(r.status===401)throw new Error('That token was not accepted. Create a new one and reconnect.');
  if(r.status===403||r.status===404)throw new Error('GitHub refused ('+r.status+'). Make sure the token has the “gist” permission.');
  if(!r.ok)throw new Error('GitHub error '+r.status);return r.json()}
 async function gistId(){const c=cfg();if(c.gist)return c.gist;
  const list=await api('/gists?per_page=100');const g=list.find(x=>x.files&&x.files[FILE]);
  if(g)c.gist=g.id;else{const n=await api('/gists',{method:'POST',body:JSON.stringify({description:'UAT Practice Lab progress (private)',public:false,files:{[FILE]:{content:'{}'}}})});c.gist=n.id}
  setCfg(c);return c.gist}
 async function pull(){const id=await gistId();const g=await api('/gists/'+id);const f=g.files&&g.files[FILE];if(!f)return false;
  let txt=f.content;if(f.truncated&&f.raw_url)txt=await(await fetch(f.raw_url)).text();
  let remote={};try{remote=JSON.parse(txt||'{}')}catch{}let ch=false;
  for(const[k,o] of Object.entries(remote)){if(SKIP.test(k)||!o||typeof o.v!=='string')continue;
   if(!(k in meta)||o.t>meta[k]){if(rd(k)!==o.v){orig.call(ls,k,o.v);ch=true}meta[k]=o.t}}
  wmeta();return ch}
 async function push(){const id=await gistId();const data={};
  for(let i=0;i<ls.length;i++){const k=ls.key(i);if(SKIP.test(k))continue;if(!(k in meta)){meta[k]=Date.now()}data[k]={v:rd(k),t:meta[k]}}
  wmeta();await api('/gists/'+id,{method:'PATCH',body:JSON.stringify({files:{[FILE]:{content:JSON.stringify(data)}}})})}
 async function sync(manual){if(busy||!cfg())return;busy=true;setStatus('Syncing…');
  try{const ch=await pull();await push();const when=new Date().toLocaleTimeString('en-ZA',{hour:'2-digit',minute:'2-digit'});setStatus('Synced at '+when,'ok');
   try{orig.call(ls,'uatsync-last',when)}catch{}
   if(ch){const last=+(sessionStorage.getItem('uatsync-rl')||0);if(!manual&&Date.now()-last>15000){sessionStorage.setItem('uatsync-rl',Date.now());location.reload();return}changedRemote=true;render()}}
  catch(e){setStatus(e.message||'Sync failed. Check your connection.','err')}finally{busy=false}}
 /* ---------- UI ---------- */
 const css=document.createElement('style');css.textContent=`#us-b{position:fixed;left:14px;bottom:14px;z-index:9999;font:600 13px system-ui,sans-serif;background:#11203b;color:#fff;border:1px solid #ffffff55;border-radius:99px;padding:8px 14px;cursor:pointer;box-shadow:0 2px 8px #0005}
#us-b i{display:inline-block;width:8px;height:8px;border-radius:99px;background:#98a2b3;margin-right:6px}#us-b.ok i{background:#4cc88a}#us-b.err i{background:#ff7b6b}
#us-p{position:fixed;left:14px;bottom:56px;z-index:9999;width:min(340px,calc(100vw - 28px));background:#fff;color:#16202f;border:1px solid #cbd2dc;border-radius:14px;padding:14px;font:14px/1.45 system-ui,sans-serif;box-shadow:0 8px 30px #0006;display:none}
@media(prefers-color-scheme:dark){#us-p{background:#1a2029;color:#eaeef5;border-color:#2b3340}}
#us-p h4{margin:0 0 6px;font-size:15px}#us-p input{width:100%;font:inherit;padding:7px 9px;border:1px solid #cbd2dc;border-radius:8px;background:transparent;color:inherit;margin:6px 0}
#us-p button,#us-p a.us-a{font:600 13px system-ui;border:1px solid #cbd2dc;background:transparent;color:inherit;border-radius:8px;padding:6px 11px;cursor:pointer;text-decoration:none;display:inline-block;margin:4px 4px 0 0}
#us-p .pri{background:#2563eb;border-color:#2563eb;color:#fff}#us-p .m{color:#667085;font-size:12.5px}#us-p .e{color:#c0392b;font-size:13px;margin-top:6px}`;document.head.appendChild(css);
 const btn=document.createElement('button');btn.id='us-b';btn.type='button';const pan=document.createElement('div');pan.id='us-p';
 const add=()=>{document.body.appendChild(btn);document.body.appendChild(pan)};document.body?add():addEventListener('DOMContentLoaded',add);
 let stText='',stCls='',openP=false;
 function setStatus(t,c){stText=t;stCls=c||'';render()}
 function render(){const c=cfg();btn.className=c?stCls:'';btn.innerHTML=`<i></i>${c?'Synced':'Sync'}`;btn.title=c?stText:'Sync progress across devices';
  const last=rd('uatsync-last');
  pan.innerHTML=c?`<h4>☁ Cloud sync is on</h4><div class="m">${stText||(last?'Last synced at '+last:'Ready')}</div>${changedRemote?'<div class="e" style="color:#2563eb">New progress came from another device. <button id="us-rl">Reload to see it</button></div>':''}
   <div><button class="pri" id="us-now">Sync now</button><button id="us-off">Disconnect this device</button></div><div class="m" style="margin-top:8px">Your progress is stored in a private gist in your GitHub account. “Disconnect” only removes the token from this device.</div>${stCls==='err'?`<div class="e">${stText}</div>`:''}`
  :`<h4>☁ Keep your progress everywhere</h4><div class="m">Connect once per device. Your tickets, Arcade rank and workbooks then follow you.</div>
   <ol style="padding-left:18px;margin:8px 0"><li><a class="us-a" style="margin:0" target="_blank" rel="noopener" href="https://github.com/settings/tokens/new?scopes=gist&description=UAT%20Lab%20sync">Create a token</a> (only “gist” is ticked; set expiry as you like)</li><li>Copy it and paste below</li></ol>
   <input id="us-t" type="password" placeholder="ghp_… token" autocomplete="off"><button class="pri" id="us-go">Connect</button>${stCls==='err'?`<div class="e">${stText}</div>`:''}<div class="m" style="margin-top:6px">The token is kept only on this device.</div>`;
  btn.style.display='';pan.style.display=openP?'block':'none'}
 document.addEventListener('click',e=>{const id=e.target.id;
  if(e.target===btn||btn.contains(e.target)){openP=!openP;render();return}
  if(id==='us-go'){const t=($('us-t')||{}).value.trim();if(!t)return;setCfg({token:t});stCls='';stText='';sync(true).then(()=>{if(!cfg())return;const f=stCls==='err';if(f){try{ls.removeItem(CFG)}catch{}}render()})}
  else if(id==='us-now')sync(true);else if(id==='us-off'){try{ls.removeItem(CFG)}catch{}stText='';stCls='';changedRemote=false;render()}
  else if(id==='us-rl')location.reload();
  else if(openP&&!pan.contains(e.target)){openP=false;render()}});
 const $=id=>document.getElementById(id);
 render();if(cfg()){sync(false);document.addEventListener('visibilitychange',()=>{if(!document.hidden)sync(true)})}
 addEventListener('pagehide',()=>{if(cfg()&&timer){clearTimeout(timer);timer=null;try{sync(false)}catch{}}});
})();
