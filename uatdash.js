/* uatdash.js: the dashboard on each UAT Lab section page.
   Header, filters, summary cards, trend line, two bar charts, monthly performance, upcoming and recent lists.
   Numbers are your real progress. Charts over time use the activity log (today.js) and fill in from the first time you open UAT Lab.
   A "Preview with sample data" switch shows what a busy history looks like; it is labelled and off by default. */
(function(){
 const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
 const MN=['January','February','March','April','May','June','July','August','September','October','November','December'];
 const MS=MN.map(m=>m.slice(0,3));
 const mkey=d=>d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0');
 const dkey=t=>{const d=new Date(t);return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')};
 const mStart=k=>{const [y,m]=k.split('-').map(Number);return new Date(y,m-1,1).getTime()};
 const mEnd=k=>{const [y,m]=k.split('-').map(Number);return new Date(y,m,1).getTime()};
 const mLabel=k=>{const [y,m]=k.split('-').map(Number);return MN[m-1]+' '+y};
 const ICON={
  done:'<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="m8.5 12.3 2.5 2.5 4.5-5"/></svg>',
  target:'<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r=".6"/></svg>',
  days:'<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3.5" y="5" width="17" height="15" rx="2"/><path d="M3.5 10h17M8 3v4M16 3v4"/></svg>',
  warn:'<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 4 3 20h18z"/><path d="M12 10v4.5M12 17.5v.01"/></svg>',
  list:'<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01"/></svg>'};

 /* ---------- sample history (only when the preview switch is on) ---------- */
 function hash(s){let h=2166136261;for(const c of s){h^=c.charCodeAt(0);h=Math.imul(h,16777619)}return (h>>>0)/4294967295}
 function sampleEvents(parts){const ev=[],now=new Date();
  parts.forEach(p=>{let tot=0;const goal=Math.round(p.need*(0.35+0.5*hash(p.key)));
   for(let i=5;i>=0;i--){const d=new Date(now.getFullYear(),now.getMonth()-i,1);const w=[.06,.12,.18,.2,.22,.22][5-i];const gain=Math.max(0,Math.min(goal-tot,Math.round(goal*w*(0.7+0.6*hash(p.key+i)))));
    for(let j=0;j<Math.min(gain,3);j++){ev.push({t:new Date(d.getFullYear(),d.getMonth(),4+j*8+Math.floor(hash(p.key+i+j)*3),10).getTime(),k:p.key,d:Math.ceil(gain/Math.min(gain,3))});}
    tot+=gain}});
  return ev.filter(e=>e.t<=Date.now()).sort((a,b)=>a.t-b.t)}

 function render(host,stage,ctx){
  const S={period:'month',month:mkey(new Date()),type:'all',trend:'all',perf:'all',all:false,sample:false};
  try{S.sample=localStorage.getItem('uatlab-sample')==='1'}catch(e){}
  const real=stage.items.map(x=>({key:x.key,n:x.n,have:x.have,need:x.need,href:x.href}));
  const LOG=(window.TODAY&&TODAY.log&&TODAY.log())||{ev:[],since:Date.now()};
  function data(){
   if(!S.sample)return{parts:real,ev:(LOG.ev||[]),since:LOG.since||Date.now(),sample:false};
   const ev=sampleEvents(real);const parts=real.map(p=>({...p,have:Math.min(p.need,ev.filter(e=>e.k===p.key).reduce((a,e)=>a+Math.max(0,e.d),0))}));
   return{parts,ev,since:new Date(new Date().getFullYear(),new Date().getMonth()-5,1).getTime(),sample:true}}
  const months=[];for(let i=11;i>=0;i--){const d=new Date(new Date().getFullYear(),new Date().getMonth()-i,1);months.push(mkey(d))}
  const last6=months.slice(-6);

  host.innerHTML=`<section class="db-head"><div><h1>${esc(stage.name)}</h1><p class="lede">${esc(stage.name)} dashboard. ${esc(stage.desc)}</p><p class="db-badge" id="db-badge" hidden>Sample data: not your real history</p></div>
   <div class="db-filters" role="group" aria-label="Dashboard filters">
    <div class="seg" role="group" aria-label="Period"><button type="button" data-p="month" aria-pressed="true">Monthly</button><button type="button" data-p="ytd" aria-pressed="false">Year to date</button></div>
    <label class="sel"><span>Month</span><select id="db-m" aria-label="Month">${months.slice().reverse().map(k=>`<option value="${k}">${mLabel(k)}</option>`).join('')}</select></label>
    <label class="sel"><span>Type</span><select id="db-t" aria-label="Type"><option value="all">All types</option>${real.map(p=>`<option value="${esc(p.key)}">${esc(p.n)}</option>`).join('')}</select></label>
   </div></section>
   <div class="db-sw"><label class="sw"><input type="checkbox" id="db-s" role="switch"><span>Preview with sample data</span></label><span class="mute" id="db-note"></span></div>
   <div class="db-cards" id="db-cards"></div>
   <section class="db-card"><div class="db-ct"><div><h3>Assessment Trends</h3><p class="d">Overall progress at the end of each month</p></div><label class="sel"><span class="sr">Type</span><select id="db-tt" aria-label="Trend type"><option value="all">All types</option>${real.map(p=>`<option value="${esc(p.key)}">${esc(p.n)}</option>`).join('')}</select></label></div><div class="db-plot" id="db-trend"></div><p class="mute" id="db-trend-n"></p></section>
   <div class="db-two"><section class="db-card"><div class="db-ct"><div><h3>${ICON.done}<span>Progress by part</span></h3><p class="d">How much of each part is done</p></div></div><div class="db-plot" id="db-bars1"></div></section>
   <section class="db-card"><div class="db-ct"><div><h3>${ICON.warn}<span>Left to do by part</span></h3><p class="d">What is still open in each part</p></div></div><div class="db-plot" id="db-bars2"></div></section></div>
   <section class="db-card"><div class="db-ct"><div><h3>Monthly Performance</h3><p class="d">Completed each month against the target pace (finish in 6 months)</p></div><label class="sel"><span class="sr">Part</span><select id="db-pt" aria-label="Performance part"><option value="all">All parts</option>${real.map(p=>`<option value="${esc(p.key)}">${esc(p.n)}</option>`).join('')}</select></label></div><div class="db-plot" id="db-perf"></div></section>
   <div class="db-two"><section class="db-card"><h3>Upcoming</h3><ul class="db-list" id="db-up"></ul></section><section class="db-card"><div class="db-ct"><h3>Recent</h3><button type="button" class="db-va" id="db-all" aria-expanded="false">View All</button></div><ul class="db-list" id="db-rec"></ul></section></div>`;
  const $=id=>host.querySelector('#'+id);

  const inRange=(e)=>{const m=S.month;const end=mEnd(m);const start=S.period==='ytd'?new Date(Number(m.slice(0,4)),0,1).getTime():mStart(m);return e.t>=start&&e.t<end};
  const selParts=D=>S.type==='all'?D.parts:D.parts.filter(p=>p.key===S.type);
  const keyOf=sel=>sel==='all'?null:sel;

  /* ---------- summary cards ---------- */
  function cards(){const D=data(),P=selParts(D);const keys=new Set(P.map(p=>p.key));
   const per=S.period==='ytd'?'this year':'in '+mLabel(S.month);
   const evs=D.ev.filter(e=>keys.has(e.k)&&inRange(e));
   const gain=k=>evs.filter(e=>e.k===k&&e.d>0).reduce((a,e)=>a+e.d,0);
   const tot=P.reduce((a,p)=>a+Math.min(p.need,p.have),0),need=P.reduce((a,p)=>a+p.need,0);
   const pct=P.length?Math.round(P.reduce((a,p)=>a+Math.min(1,p.have/p.need),0)/P.length*100):0;
   const days=new Set(evs.filter(e=>e.d>0).map(e=>dkey(e.t))).size;
   const c=P.map(p=>({i:ICON.done,t:p.n,v:p.have+' of '+p.need,s:'+'+gain(p.key)+' '+per,h:p.href}));
   c.push({i:ICON.target,t:'Overall',v:pct+'%',s:tot+' of '+need+' items done'});
   c.push({i:ICON.days,t:'Active days',v:String(days),s:per+(D.sample||(D.since&&mStart(S.month)>=D.since-86400000*31)?'':' (history starts '+new Date(D.since).toLocaleDateString('en-ZA',{day:'numeric',month:'short'})+')')});
   $('db-cards').innerHTML=c.map(x=>{const tag=x.h?'a':'div';return `<${tag} class="db-sc"${x.h?` href="${esc(x.h)}"`:''}><span class="ic">${x.i}</span><span class="tx"><span class="k">${esc(x.t)}</span><b>${esc(x.v)}</b><span class="s">${esc(x.s)}</span></span></${tag}>`}).join('')}

  /* ---------- tiny SVG charts ---------- */
  const nice=m=>{if(m<=0)return 4;const p=Math.pow(10,Math.floor(Math.log10(m)));const f=m/p;const n=f<=1?1:f<=2?2:f<=2.5?2.5:f<=5?5:10;const top=n*p;return top<4&&top%1?Math.ceil(top):top};
  function frame(el,h,slant,labels,ymax,fmt){const w=Math.max(260,el.clientWidth||320);const ml=40,mr=10,mt=10,mb=slant?84:30;const iw=w-ml-mr,ih=h-mt-mb;
   const ticks=[0,1,2,3,4].map(i=>ymax*i/4);
   let g='';ticks.forEach(t=>{const y=mt+ih-(t/ymax)*ih;g+=`<line x1="${ml}" x2="${w-mr}" y1="${y}" y2="${y}" stroke="#d5dae2" stroke-dasharray="4 4"/><text x="${ml-6}" y="${y+4}" text-anchor="end" font-size="12" fill="#4a5568">${esc(fmt(t))}</text>`});
   const n=labels.length,gw=iw/n;
   labels.forEach((l,i)=>{const cx=ml+gw*i+gw/2,y=mt+ih+16;g+=slant?`<text transform="translate(${cx},${y}) rotate(-35)" text-anchor="end" font-size="12" fill="#4a5568">${esc(l.length>17?l.slice(0,16)+'\u2026':l)}</text>`:`<text x="${cx}" y="${y}" text-anchor="middle" font-size="12" fill="#4a5568">${esc(l)}</text>`});
   return{w,ml,mr,mt,ih,iw,gw,n,g,y:v=>mt+ih-(Math.max(0,v)/ymax)*ih}}
  function legend(items){return `<div class="db-lg">${items.map(([c,t])=>`<span><i style="background:${c}"></i>${esc(t)}</span>`).join('')}</div>`}
  function bars(el,h,labels,series,opts){opts=opts||{};const all=series.flatMap(s=>s.vals.map(v=>v||0));const ymax=opts.ymax||nice(Math.max(...all,1));
   const F=frame(el,h,opts.slant,labels,ymax,opts.fmt||(v=>String(Math.round(v*10)/10)));let s=F.g;
   labels.forEach((l,i)=>{const x0=F.ml+F.gw*i;const tip=l+': '+series.map(se=>se.name+' '+(opts.tipfmt?opts.tipfmt(se.vals[i]):se.vals[i])).join(', ');
    s+=`<rect class="hit" x="${x0}" y="${F.mt}" width="${F.gw}" height="${F.ih}" data-tip="${esc(tip)}" tabindex="0" aria-label="${esc(tip)}"/>`;
    const bw=Math.min(30,F.gw*.7/series.length),gap=2,tw=bw*series.length+gap*(series.length-1);let bx=x0+(F.gw-tw)/2;
    series.forEach(se=>{const v=se.vals[i]||0,y=F.y(v),hh=F.mt+F.ih-y;if(hh>0)s+=`<path d="M${bx},${F.mt+F.ih}V${y+Math.min(4,hh)}Q${bx},${y} ${bx+Math.min(4,bw/2)},${y}H${bx+bw-Math.min(4,bw/2)}Q${bx+bw},${y} ${bx+bw},${y+Math.min(4,hh)}V${F.mt+F.ih}Z" fill="${se.color}" pointer-events="none"/>`;bx+=bw+gap})});
   el.innerHTML=`<svg width="${F.w}" height="${h}" role="img" aria-label="${esc(opts.aria||'Bar chart')}">${s}</svg>`+legend(series.map(se=>[se.color,se.name]))}
  function line(el,h,labels,vals,name,opts){opts=opts||{};const F=frame(el,h,opts.slant,labels,100,v=>Math.round(v)+'%');let s=F.g,seg=[],paths=[];
   vals.forEach((v,i)=>{if(v==null){if(seg.length)paths.push(seg);seg=[]}else seg.push([F.ml+F.gw*i+F.gw/2,F.y(v)])});if(seg.length)paths.push(seg);
   paths.forEach(p=>{if(p.length>1)s+=`<path d="M${p.map(q=>q.join(',')).join('L')}" fill="none" stroke="#b08d57" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>`});
   labels.forEach((l,i)=>{const x0=F.ml+F.gw*i,v=vals[i];const tip=l+': '+(v==null?'no history yet':Math.round(v)+'%');
    s+=`<rect class="hit" x="${x0}" y="${F.mt}" width="${F.gw}" height="${F.ih}" data-tip="${esc(tip)}" tabindex="0" aria-label="${esc(tip)}"/>`;
    if(v!=null)s+=`<circle cx="${x0+F.gw/2}" cy="${F.y(v)}" r="5" fill="#b08d57" stroke="#fff" stroke-width="2" pointer-events="none"/>`});
   el.innerHTML=`<svg width="${F.w}" height="${h}" role="img" aria-label="${esc(opts.aria||'Line chart')}">${s}</svg>`+legend([['#b08d57',name]])}

  /* ---------- charts ---------- */
  function haveAt(p,D,t){const after=D.ev.filter(e=>e.k===p.key&&e.t>=t).reduce((a,e)=>a+e.d,0);return Math.max(0,Math.min(p.need,p.have-after))}
  function trend(){const D=data(),P=S.trend==='all'?D.parts:D.parts.filter(p=>p.key===S.trend);
   const vals=last6.map(m=>{const end=mEnd(m);if(end>Date.now()+31*864e5)return null;if(end<=D.since&&!D.sample)return null;
    const useNow=end>Date.now();return P.length?P.reduce((a,p)=>a+(useNow?Math.min(1,p.have/p.need):haveAt(p,D,end)/p.need),0)/P.length*100:0});
   const has=vals.filter(v=>v!=null).length;
   line($('db-trend'),240,last6.map(m=>MS[Number(m.slice(5))-1]),vals,S.trend==='all'?'All types':(real.find(p=>p.key===S.trend)||{}).n,{aria:'Overall progress at the end of each month'});
   $('db-trend-n').textContent=has>1?(D.sample?'Sample history.':'Dated from '+new Date(D.since).toLocaleDateString('en-ZA',{day:'numeric',month:'long',year:'numeric'})+', the first time UAT Lab was opened.'):'Your trend line appears here as you make progress. History starts the first time you open UAT Lab ('+new Date(D.since).toLocaleDateString('en-ZA',{day:'numeric',month:'long'})+'), so there is only one point so far.'}
  function barsBoth(){const D=data(),P=D.parts;const sl=window.innerWidth<700||P.length>4;
   bars($('db-bars1'),260,P.map(p=>p.n),[{name:'Done %',color:'#b08d57',vals:P.map(p=>Math.round(Math.min(1,p.have/p.need)*100))}],{slant:sl,ymax:100,fmt:v=>Math.round(v)+'%',tipfmt:v=>v+'%',aria:'Percent done in each part'});
   bars($('db-bars2'),260,P.map(p=>p.n),[{name:'Left to do',color:'#b8c0cc',vals:P.map(p=>Math.max(0,p.need-p.have))}],{slant:sl,aria:'Items left in each part'})}
  function perf(){const D=data(),P=S.perf==='all'?D.parts:D.parts.filter(p=>p.key===S.perf),keys=new Set(P.map(p=>p.key));
   const done=last6.map(m=>D.ev.filter(e=>keys.has(e.k)&&e.d>0&&e.t>=mStart(m)&&e.t<mEnd(m)).reduce((a,e)=>a+e.d,0));
   const tgt=Math.round(P.reduce((a,p)=>a+p.need,0)/6*10)/10;
   bars($('db-perf'),300,last6.map(m=>MN[Number(m.slice(5))-1]+' '+m.slice(0,4)),[{name:'Completed',color:'#b08d57',vals:done},{name:'Target pace',color:'#cfd4dc',vals:last6.map(()=>tgt)}],{slant:true,aria:'Completed each month against the target pace'})}

  /* ---------- lists ---------- */
  function lists(){const D=data();const open=D.parts.filter(p=>p.have<p.need);
   let up=open.slice(0,5).map(p=>`<li><a href="${esc(p.href)}"><span class="ln"><b>${esc(p.n)}</b><span class="mute">${p.need-p.have} left of ${p.need}</span></span></a></li>`);
   if(ctx.tickets&&stage.id==='practise'){const t=ctx.tickets().slice(0,3);up=up.slice(0,3).concat(t.map(x=>`<li><a href="tickets.html#${esc(x.key)}"><span class="ln"><b>${esc(x.key)}: ${esc(x.title)}</b><span class="mute">Ticket${x.due?', due '+esc(x.due):''}</span></span></a></li>`))}
   $('db-up').innerHTML=up.length?up.join(''):'<li class="empty">No upcoming work in this section. Everything here is done.</li>';
   const keys=new Set(D.parts.map(p=>p.key)),nm=Object.fromEntries(D.parts.map(p=>[p.key,p.n]));
   const rec=D.ev.filter(e=>keys.has(e.k)).slice().reverse();const lim=S.all?rec.length:5;
   $('db-rec').innerHTML=rec.length?rec.slice(0,lim).map(e=>`<li class="${e.d>0?'ok':'bad'}"><span class="mk" aria-hidden="true">${e.d>0?'✓':'✗'}</span><span class="ln"><b>${esc(nm[e.k])}</b><span class="mute">${e.d>0?'+'+e.d:e.d} on ${new Date(e.t).toLocaleDateString('en-ZA',{day:'numeric',month:'short',year:'numeric'})}${e.d>0?', completed':', went down (reset)'}</span></span></li>`).join(''):'<li class="empty">No recent activity yet. It shows here as you make progress.</li>';
   const b=$('db-all');b.hidden=rec.length<=5;b.textContent=S.all?'Show less':'View All';b.setAttribute('aria-expanded',S.all)}

  function all(){const D=data();$('db-badge').hidden=!D.sample;$('db-s').checked=S.sample;
   $('db-note').textContent=D.sample?'Made-up history so you can judge the design. Switch it off to see your own.':'Showing your real progress.';
   cards();trend();barsBoth();perf();lists()}
  all();
  host.addEventListener('change',e=>{const t=e.target;
   if(t.id==='db-m')S.month=t.value;else if(t.id==='db-t')S.type=t.value;else if(t.id==='db-tt')S.trend=t.value;else if(t.id==='db-pt')S.perf=t.value;
   else if(t.id==='db-s'){S.sample=t.checked;try{localStorage.setItem('uatlab-sample',S.sample?'1':'0')}catch(x){}all();return}
   else return;all()});
  host.addEventListener('click',e=>{const p=e.target.closest('[data-p]');if(p){S.period=p.dataset.p;host.querySelectorAll('[data-p]').forEach(b=>b.setAttribute('aria-pressed',b===p));all();return}
   if(e.target.closest('#db-all')){S.all=!S.all;lists()}});
  let rt;const redraw=()=>{clearTimeout(rt);rt=setTimeout(()=>{if(host.isConnected){trend();barsBoth();perf()}},120)};
  window.addEventListener('resize',redraw);
 }
 const css=document.createElement('style');css.textContent=`
 .db-head{display:flex;justify-content:space-between;align-items:flex-start;gap:16px;flex-wrap:wrap;border:1px solid var(--line);border-radius:16px;padding:20px;background:#fff;margin-bottom:12px}
 .db-head h1{margin-bottom:2px!important}.db-head .lede{margin:0!important}.db-badge[hidden]{display:none}.db-badge{display:inline-block;margin:8px 0 0;background:#fdecc8;border:1px solid #b38e52;border-radius:99px;padding:2px 12px;font-weight:700;font-size:13.5px;color:#5b3a00}
 .db-filters{display:flex;gap:10px;flex-wrap:wrap;align-items:flex-end}
 .seg{display:inline-flex;border:1px solid #b8c0cc;border-radius:10px;overflow:hidden}.seg button{min-height:44px;padding:0 14px;border:0;background:#fff;font:600 14.5px inherit;font-family:inherit;color:var(--ink);cursor:pointer}.seg button[aria-pressed=true]{background:#c9a66e;color:#1d1608;font-weight:800}
 .sel{display:flex;flex-direction:column;gap:2px;font-size:12.5px;color:var(--mute);font-weight:600}.sel select{min-height:44px;font-size:15px;border:1px solid #b8c0cc;border-radius:10px;padding:0 10px;background:#fff;color:var(--ink);max-width:220px}.sr{position:absolute;left:-9999px}
 .db-sw{display:flex;align-items:center;gap:12px;flex-wrap:wrap;margin:0 0 12px}.sw{display:inline-flex;align-items:center;gap:10px;min-height:44px;cursor:pointer;font-weight:600}.sw input{width:22px;height:22px;accent-color:#16202f}
 .db-cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,210px),1fr));gap:12px;margin-bottom:12px}
 .db-sc{display:flex;gap:12px;align-items:flex-start;border:1px solid var(--line);border-radius:14px;padding:14px;background:#fff;color:var(--ink);text-decoration:none;min-width:0}a.db-sc:hover{border-color:#16202f}
 .db-sc .ic{flex:none;width:40px;height:40px;border-radius:10px;background:#f1f3f6;display:inline-flex;align-items:center;justify-content:center;color:#16202f}
 .db-sc .tx{display:flex;flex-direction:column;min-width:0}.db-sc .k{font-size:13px;color:var(--mute);font-weight:600}.db-sc b{font-size:26px;line-height:1.15}.db-sc .s{font-size:13px;color:var(--mute)}
 .db-card{border:1px solid var(--line);border-radius:16px;padding:18px;background:#fff;margin-bottom:12px;min-width:0}.db-card h3{margin:0;font-size:19px;color:var(--ink)!important;display:flex;align-items:center;gap:8px}.db-card .d{margin:2px 0 8px;color:var(--mute);font-size:14.5px}
 .db-ct{display:flex;justify-content:space-between;align-items:flex-start;gap:10px}
 .db-two{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,380px),1fr));gap:12px}
 .db-plot{width:100%;min-width:0;overflow:hidden}.db-plot svg{display:block;max-width:100%}.db-plot .hit{fill:transparent;outline:none}.db-plot .hit:hover,.db-plot .hit:focus-visible{fill:#b08d5726}
 .db-lg{display:flex;gap:16px;flex-wrap:wrap;margin-top:6px;font-size:13.5px;color:var(--ink)}.db-lg i{display:inline-block;width:12px;height:12px;border-radius:2px;margin-right:6px;vertical-align:-1px}
 .db-list{list-style:none;margin:8px 0 0;padding:0;display:grid;gap:4px}.db-list li{display:flex;gap:10px;align-items:flex-start;padding:6px 0;border-bottom:1px solid #eef0f4}.db-list li a{display:flex;color:var(--ink);text-decoration:none;min-height:44px;align-items:center;width:100%}.db-list .ln{display:flex;flex-direction:column}.db-list .mk{width:24px;height:24px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-weight:800;flex:none;margin-top:2px}.db-list .ok .mk{background:#11663f;color:#fff}.db-list .bad .mk{background:#b42318;color:#fff}.db-list .empty{color:var(--mute);border:0}
 .db-va{min-height:44px;padding:0 14px;border:1px solid #b8c0cc;border-radius:10px;background:#fff;font-weight:600;font-family:inherit;font-size:14.5px;cursor:pointer}.db-va[hidden]{display:none}
 @media(max-width:700px){.db-head,.db-card{padding:14px}.db-filters{width:100%}.db-filters .seg{width:100%}.db-filters .seg button{flex:1}.db-filters .sel{flex:1 1 140px}.db-filters .sel select{max-width:none;width:100%}}`;
 document.head.appendChild(css);
 window.UATDASH={render};
})();
