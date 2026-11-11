/* Embedded datasets for the practice labs. All values are made up for practice (a pretend three-branch coffee business).
   They are generated from fixed seeds, so every visit shows the same numbers. */
(function(){
 const rng=a=>()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296};
 const DRINKS=[['flat white',38],['cappuccino',35],['americano',30],['iced latte',42],['rooibos latte',34]];
 const BRANCHES=['Soweto','Sandton','Pretoria'];
 const DAYS=['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
 /* 1. Sales lines: 140 rows, one row per order line */
 const r=rng(2026),sales=[];
 for(let i=0;i<140;i++){
  const d=DRINKS[Math.floor(r()*DRINKS.length)];const day=DAYS[Math.floor(r()*7)];
  const boost=(day==='Fri'||day==='Sat')?1:0;
  sales.push({id:2001+i,day,branch:BRANCHES[Math.floor(r()*3)],drink:d[0],qty:1+Math.floor(r()*3)+(r()<0.25+0.25*boost?1:0),price:d[1]});
 }
 /* 2. Daily weather and sales: 45 days */
 const r2=rng(77),daily=[];
 for(let i=0;i<45;i++){
  const temp=Math.round(12+r2()*22);
  const iced=Math.max(0,Math.round(4+2.1*(temp-12)+(r2()-0.5)*12));
  const hot=Math.max(10,Math.round(70-1.2*temp+(r2()-0.5)*14));
  daily.push({day:i+1,weekday:DAYS[i%7],temp_c:temp,iced_cups:iced,hot_cups:hot,rain:r2()<0.22?'yes':'no'});
 }
 /* 3. A messy order table for the cleaning lab (dirt added on purpose, at fixed places) */
 const r3=rng(5),messy=[];
 for(let i=0;i<30;i++){const d=DRINKS[Math.floor(r3()*DRINKS.length)];messy.push({order_id:1001+i,drink:d[0],qty:1+Math.floor(r3()*3),price:d[1],branch:BRANCHES[Math.floor(r3()*3)]})}
 [3,11,17,24].forEach(i=>{messy[i].price=null});                 /* four missing prices */
 messy[6].drink='Flat White ';messy[12].drink='FLAT WHITE';messy[19].drink='Cappuccino';messy[25].drink=' americano'; /* text clean-up */
 messy[8].qty=-1;messy[21].qty=-2;                                  /* refunds typed as negative sales */
 messy[14].price=3800;                                              /* decimal point missing: should be 38.00 */
 [5,16,27].forEach(i=>messy.push(Object.assign({},messy[i])));      /* three exact duplicate rows at the end */
 /* 4. Small teaching sets used by the statistics lab */
 const sets={
  spread:{name:'Spread practice',x:[2,4,4,4,5,5,7,9],note:'The worked example from the lessons.'},
  tips:{name:'Daily tips (rand)',x:[40,45,50,55,210],note:'One big day lifts the mean.'},
  quart:{name:'Quartile practice',x:[12,14,15,16,18,19,21,22,24,60],note:'Used for the IQR outlier rule.'},
  reg:{name:'Hours open and cups',x:[1,2,3,4],y:[3,5,6,10],note:'Least squares example from the lessons.'},
  cor:{name:'Correlation practice',x:[1,2,3,4,5],y:[2,4,5,4,5],note:'r is about 0.77.'}
 };
 window.DS_DATA={sales,daily,messy,sets,DRINKS,BRANCHES,DAYS};
})();
