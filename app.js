const KEY="modo-buenaventura-v1";
const presets={
huevo:["Huevo",72,6.3,0.4,4.8],pollo:["Muslo de pollo",280,29,0,18],carne:["Carne de res",300,35,0,17],
higado:["Hígado de res",250,39,7,8],atun:["Atún en agua",120,26,0,1],aguacate:["Aguacate",80,1,4,7.5],
aceite:["Aceite de oliva",45,0,0,5],arroz:["Arroz cocido",130,2.7,28,0.3],platano:["Plátano maduro",122,1.3,32,0.4],avena:["Avena",152,5.2,27,2.8]
};
const plan={
0:{title:"Domingo · descanso activo",type:"Descanso",items:[["Actividad","Caminar 30–45 min a paso cómodo/rápido si es seguro.","30–45 min"],["Recuperación","Estiramiento suave y priorizar el sueño.","—"],["Nutrición","Ventana sugerida 12:00–20:00; proteína en las comidas.","16/8"]]},
1:{title:"Lunes · Día A · fuerza",type:"Fuerza",items:[["Thruster con mochila","4 rondas iniciales · 12 repeticiones","12 × 4"],["Flexiones","4 rondas · 8–15 o cerca del fallo técnico","8–15 × 4"],["Peso muerto con mochila","4 rondas · 12 repeticiones","12 × 4"],["Plancha abdominal","4 rondas · 30–45 s","30–45 s × 4"]]},
2:{title:"Martes · Día C · cardio",type:"Cardio",items:[["Calentamiento","Marcha/trote suave","2–5 min"],["Intervalos","Burpees + recuperación caminando","6–8 intervalos*"],["Vuelta a la calma","Movimiento suave","2–3 min"]]},
3:{title:"Miércoles · Día B · piernas y espalda",type:"Fuerza",items:[["Zancadas con mochila","4 rondas · 10 por pierna","10 × 4"],["Remo con mochila","4 rondas · 12 repeticiones","12 × 4"],["Puente de glúteo con mochila","4 rondas · 15 repeticiones","15 × 4"],["Mountain climbers","4 rondas · 30 s","30 s × 4"]]},
4:{title:"Jueves · Día C · cardio",type:"Cardio",items:[["Calentamiento","Marcha/trote suave","2–5 min"],["Intervalos","Burpees + recuperación caminando","6–8 intervalos*"],["Vuelta a la calma","Movimiento suave","2–3 min"]]},
5:{title:"Viernes · Día A · fuerza",type:"Fuerza",items:[["Thruster con mochila","4 rondas iniciales · 12 repeticiones","12 × 4"],["Flexiones","4 rondas · 8–15 o cerca del fallo técnico","8–15 × 4"],["Peso muerto con mochila","4 rondas · 12 repeticiones","12 × 4"],["Plancha abdominal","4 rondas · 30–45 s","30–45 s × 4"]]},
6:{title:"Sábado · Día C · cardio",type:"Cardio",items:[["Calentamiento","Marcha/trote suave","2–5 min"],["Intervalos","Burpees + recuperación caminando","6–8 intervalos*"],["Vuelta a la calma","Movimiento suave","2–3 min"]]}
};
function load(){try{return JSON.parse(localStorage.getItem(KEY))||{days:{},startDate:null}}catch{return{days:{},startDate:null}}}
let db=load(); const iso=()=>new Date().toLocaleDateString("en-CA");
function parseISO(s){return new Date(s+"T12:00:00")}
function dateDiff(a,b){return Math.floor((parseISO(a)-parseISO(b))/86400000)}
function phaseInfo(dateStr=iso()){
  const start=db.startDate||dateStr;
  const diff=dateDiff(dateStr,start);
  const dayIndex=Math.max(0,Math.min(27,diff));
  return {start,diff,dayIndex,week:Math.floor(dayIndex/7)+1,dayInWeek:dayIndex%7+1};
}
function phasePlan(dateStr=iso()){
  const info=phaseInfo(dateStr);
  const dow=(parseISO(dateStr).getDay());
  return plan[dow];
}
function day(){if(!db.days[iso()])db.days[iso()]={foods:[],weight:null,water:null,energy:null,done:[]};return db.days[iso()]}
function save(){localStorage.setItem(KEY,JSON.stringify(db))}
function kcal(){return day().foods.reduce((s,f)=>s+f.kcal*f.qty,0)} function macro(k){return day().foods.reduce((s,f)=>s+(f[k]||0)*f.qty,0)}
function fmtDate(d=new Date()){return d.toLocaleDateString("es-CO",{weekday:"long",day:"numeric",month:"long",year:"numeric"})}
document.getElementById("todayLabel").textContent=fmtDate();
const wd=new Date().getDay(); let currentPlan=phasePlan();
document.getElementById("dayPlanTitle").textContent=currentPlan.title;
document.getElementById("dayPlan").innerHTML=currentPlan.items.slice(0,3).map(x=>`<div class="plan-chip"><b>${x[0]}</b><span>${x[1]} · ${x[2]}</span></div>`).join("");

function initStart(){
  const el=document.getElementById("startDate");
  if(el){el.value=db.startDate||iso();}
}
function scoreFor(x){
  const k=x.foods.reduce((s,f)=>s+f.kcal*f.qty,0);
  let score=0;
  if(x.foods.length)score+=35;
  if(k>=1500&&k<=1700)score+=25; else if(k>0)score+=12;
  if(x.done?.length)score+=30;
  if(x.weight||x.water||x.energy)score+=10;
  return Math.min(100,score);
}
function renderCalendar(){
  const start=db.startDate||iso(), grid=document.getElementById("calendarGrid");
  if(!grid)return;
  document.getElementById("calendarWeek").textContent="SEMANA "+phaseInfo().week;
  let out="";
  for(let i=0;i<28;i++){
    const d=new Date(parseISO(start)); d.setDate(d.getDate()+i);
    const ds=d.toLocaleDateString("en-CA");
    const x=db.days[ds]||{foods:[],done:[]};
    const pp=phasePlan(ds);
    const done=scoreFor(x)>=70;
    out+=`<div class="cal-day ${done?"done ":""}${ds===iso()?"today":""}" onclick="goDate('${ds}')">
      <div class="dow">${d.toLocaleDateString("es-CO",{weekday:"short"})}</div>
      <div class="num">${d.getDate()} · Día ${i+1}</div>
      <div class="mini">${pp.type}<br>${Math.round(x.foods.reduce((s,f)=>s+f.kcal*f.qty,0))} kcal · ${scoreFor(x)} pts</div>
    </div>`;
  }
  grid.innerHTML=out;
}
function goDate(ds){
  if(ds!==iso()){
    // Keep the app static/local: selecting a past/future day changes the visible day through a temporary view.
    alert("Este MVP registra automáticamente el día actual. Para consultar días anteriores usa Historial.");
    return;
  }
  show("dashboard");
}
function refresh(){
 currentPlan=phasePlan(); const k=kcal(), p=macro("protein"), c=macro("carbs"), f=macro("fat"); const pct=Math.min(100,Math.round(k/1700*100));
 document.getElementById("dashKcal").textContent=Math.round(k);document.getElementById("nutKcal").textContent=Math.round(k);
 document.getElementById("dashProtein").textContent=Math.round(p)+" g";document.getElementById("nutProtein").textContent=Math.round(p)+" g";
 document.getElementById("nutCarbs").textContent=Math.round(c)+" g";document.getElementById("nutFat").textContent=Math.round(f)+" g";
 document.getElementById("kcalBar").style.width=pct+"%";document.getElementById("calProgress").textContent=pct+"%";
 document.getElementById("dashWeight").textContent=day().weight??"—";
 const wdone=day().done.length>0; document.getElementById("dashWorkout").textContent=wdone?"Completado":"Pendiente";
 document.getElementById("dashWorkoutSub").textContent=currentPlan.type;
 document.getElementById("weightInput").value=day().weight??"";document.getElementById("waterInput").value=day().water??"";
 document.getElementById("energyInput").value=day().energy??"";
 renderFoods(); advice();
}
function renderFoods(){
 const list=document.getElementById("foodList"), foods=day().foods; document.getElementById("foodCount").textContent=foods.length+" registro(s)";
 if(!foods.length){list.innerHTML='<p class="muted">Todavía no hay alimentos registrados. Pulsa “Añadir alimento” y escribe lo que realmente comiste.</p>';return}
 list.innerHTML=foods.map((x,i)=>`<div class="food-row"><div><b>${x.name}</b><small>${x.meal} · ${x.qty} porción(es)</small></div><div class="food-kcal">${Math.round(x.kcal*x.qty)} kcal</div><div class="food-macro">${Math.round(x.protein*x.qty)}g prot.</div><button class="delete" onclick="removeFood(${i})">Eliminar</button></div>`).join("");
}
function removeFood(i){day().foods.splice(i,1);save();refresh()}
function advice(){
 const k=kcal(), p=macro("protein"), water=Number(day().water||0), energy=day().energy||"";
 let a;
 if(!day().foods.length)a="Empieza registrando tu primera comida. La app podrá detectar si el día queda muy bajo o alto frente al rango del plan.";
 else if(k<1300)a="Tu registro está bastante por debajo del objetivo original de 1.500–1.700 kcal. No intentes compensar automáticamente con más ejercicio; prioriza una comida completa y evalúa cómo te sientes.";
 else if(k<=1700 && p<90)a="Calorías dentro del rango del plan, pero la proteína registrada parece baja. Considera incluir una fuente de proteína en la siguiente comida.";
 else if(k>1700)a="Hoy superaste el rango calórico original. No hace falta castigarte ni saltarte la siguiente comida: vuelve a la estructura habitual y registra con honestidad.";
 else if(currentPlan.type==="Cardio" && energy.includes("1 ·")||currentPlan.type==="Cardio"&&energy.includes("2 ·"))a="Hoy toca cardio, pero tu energía está baja. Reduce la intensidad si no te sientes bien; el plan contempla progresar gradualmente.";
 else if(water>0&&water<1.5)a="Has registrado poca agua hasta ahora. Bebe según sed y actividad, especialmente en clima cálido/húmedo; no necesitas forzarte a una cifra fija.";
 else {
   const meal=day().foods.length?day().foods[day().foods.length-1]:null;
   if(meal && /arroz|platano|plátano/.test(normalize(meal.name)) && p<90)
      a="Tu última comida aporta carbohidrato pero poca proteína en comparación. Para la próxima, prioriza una fuente de proteína del plan.";
   else a="Buen registro. Mantén la estructura, proteína en cada comida y progresión gradual. La consistencia de varias semanas importa más que un solo día.";
 }
 document.getElementById("adviceText").textContent=a;
}
document.getElementById("saveCheckin").onclick=()=>{day().weight=Number(document.getElementById("weightInput").value)||null;day().water=Number(document.getElementById("waterInput").value)||null;day().energy=document.getElementById("energyInput").value||null;save();refresh()};
document.getElementById("openFood").onclick=()=>document.getElementById("foodDialog").showModal();
document.getElementById("closeFood").onclick=()=>document.getElementById("foodDialog").close();
document.getElementById("foodPreset").onchange=e=>{const p=presets[e.target.value];if(p){foodName.value=p[0];foodKcal.value=p[1];foodProtein.value=p[2];foodCarbs.value=p[3];foodFat.value=p[4]}};


const AIKEY="modo-buenaventura-ai";
const AIMEM="modo-buenaventura-ai-memory";
const AIMEM_MAX=30;
function aiMemory(){try{return JSON.parse(localStorage.getItem(AIMEM))||[]}catch{return[]}}
function saveAIMemory(m){localStorage.setItem(AIMEM,JSON.stringify(m.slice(-AIMEM_MAX)))}
function addAIMemory(type,user,assistant,meta=""){
  const m=aiMemory();m.push({date:new Date().toISOString(),type,user,assistant,meta});saveAIMemory(m);renderAIMemory();
}
function buildUserSnapshot(){
  const entries=Object.entries(db.days).sort((a,b)=>a[0].localeCompare(b[0]));
  const recent=entries.slice(-7).map(([d,x])=>({
    date:d,weight:x.weight,water:x.water,energy:x.energy,workoutTasks:x.done?.length||0,
    kcal:Math.round(x.foods.reduce((s,f)=>s+f.kcal*f.qty,0)),
    protein:Math.round(x.foods.reduce((s,f)=>s+f.protein*f.qty,0)),
    foods:x.foods.map(f=>`${f.name} x${f.qty}`).slice(-8)
  }));
  const m=aiMemory().slice(-8).map(x=>({date:x.date,type:x.type,user:x.user,assistant:x.assistant}));
  return {phaseStart:db.startDate||null,phase:phaseInfo(),recentDays:recent,coachMemory:m};
}
function renderAIMemory(){
  const m=aiMemory(), el=document.getElementById("aiMemoryList"), sum=document.getElementById("memorySummary");
  if(sum){
    const e=Object.entries(db.days), w=e.filter(([,x])=>x.weight).map(([,x])=>x.weight);
    const avg=w.length?(w.reduce((a,b)=>a+b,0)/w.length).toFixed(1):"—";
    sum.textContent=`${m.length} conversaciones guardadas · ${e.length} días registrados · peso medio registrado: ${avg} kg`;
  }
  if(el)el.innerHTML=m.length?m.slice().reverse().slice(0,12).map(x=>`<div class="memory-entry"><b>${x.type==="meal"?"Análisis de comida":"Consejo del coach"} · ${new Date(x.date).toLocaleDateString("es-CO")}</b><div>${String(x.assistant).replace(/[<>]/g,"")}</div><small>${String(x.user).slice(0,180).replace(/[<>]/g,"")}</small></div>`).join(""):'<p class="muted">Todavía no hay conversaciones guardadas.</p>';
}

const AIQUOTA="modo-buenaventura-ai-quota";
function aiConfig(){try{return JSON.parse(localStorage.getItem(AIKEY))||{provider:"groq",key:""}}catch{return{provider:"groq",key:""}}}
function quota(){const d=iso();try{const q=JSON.parse(localStorage.getItem(AIQUOTA));if(q&&q.date===d)return q; }catch{} return {date:d,count:0}}
function saveQuota(q){localStorage.setItem(AIQUOTA,JSON.stringify(q))}
function getAiPrompt(text,mode="meal"){
  const snap=buildUserSnapshot();
  const context=`Actúa como el coach nutricional de una sola persona y conserva continuidad entre sesiones usando el HISTORIAL que se te proporciona. Objetivo original del plan: 1500-1700 kcal/día, ayuno sugerido 16/8 y proteína en cada comida. No diagnostiques ni prescribas. Si faltan cantidades, estima una porción razonable y marca que es estimación. No inventes datos personales que no estén en el historial. Prioriza tendencias de varios días sobre un único registro. Devuelve SOLO JSON válido.
HISTORIAL DEL USUARIO:
${JSON.stringify(snap)}
${mode==="meal"?`Analiza esta comida: ${text}
Además de los números, en "note" explica brevemente cómo encaja la comida con el objetivo y qué podría mejorar sin demonizar ningún alimento. Formato: {"items":[{"name":"string","quantity":"string","kcal":number,"protein_g":number,"carbs_g":number,"fat_g":number}],"meal_kcal":number,"protein_g":number,"carbs_g":number,"fat_g":number,"confidence":"alta|media|baja","note":"string"}`:
`Analiza el día del usuario con estos datos: ${text}
Formato: {"advice":"string","priority":"string","next_step":"string"}`}`;
  return context;
}
async function callAI(text,mode="meal"){
  const cfg=aiConfig(); if(!cfg.key)throw new Error("Configura primero una API key.");
  const q=quota(); if(q.count>=10)throw new Error("Has alcanzado el límite local de 10 consultas de IA para hoy.");
  let url,headers,body;
  if(cfg.provider==="groq"){
    url="https://api.groq.com/openai/v1/chat/completions";
    headers={"Content-Type":"application/json","Authorization":"Bearer "+cfg.key};
    body={model:"openai/gpt-oss-20b",messages:[{role:"system",content:"Eres un analizador nutricional prudente y conciso."},{role:"user",content:getAiPrompt(text,mode)}],temperature:.1,max_tokens:700};
  }else{
    url="https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key="+encodeURIComponent(cfg.key);
    headers={"Content-Type":"application/json"};
    body={contents:[{parts:[{text:getAiPrompt(text,mode)}]}],generationConfig:{temperature:.1,responseMimeType:"application/json"}};
  }
  const res=await fetch(url,{method:"POST",headers,body:JSON.stringify(body)});
  if(!res.ok){let msg="Error de API";try{const e=await res.json();msg=e.error?.message||msg}catch{}throw new Error(msg)}
  const data=await res.json(); q.count++;saveQuota(q);
  let txt=cfg.provider==="groq"?data.choices?.[0]?.message?.content:data.candidates?.[0]?.content?.parts?.map(p=>p.text||"").join("");
  txt=(txt||"").replace(/^```json\s*/i,"").replace(/```$/,"").trim();
  return JSON.parse(txt);
}
function renderAIResult(o){
  const box=document.getElementById("aiResult");
  if(!o?.items){box.innerHTML=`<b>${o?.priority||"Consejo"}</b><br>${o?.advice||""}<br><small>${o?.next_step||""}</small>`;return}
  box.innerHTML=o.items.map(x=>`<div class="ai-item"><span>${x.name} · ${x.quantity}</span><b>${Math.round(x.kcal)} kcal</b></div>`).join("")+
  `<div class="ai-total">${Math.round(o.meal_kcal||0)} kcal · ${Math.round(o.protein_g||0)} g proteína · ${Math.round(o.carbs_g||0)} g carbos · ${Math.round(o.fat_g||0)} g grasa</div><div class="confidence">Confianza: ${o.confidence||"media"}. ${o.note||""}</div>`;
}
const foodPatterns=[
  {key:"huevo",names:["huevo","huevos"],unitWords:["unidad","unidades"],defaultQty:1},
  {key:"pollo",names:["pollo","muslo de pollo","muslos de pollo"],unitWords:["g","gramos"],defaultQty:1},
  {key:"carne",names:["carne de res","carne"],unitWords:["g","gramos"],defaultQty:1},
  {key:"higado",names:["higado","hígado"],unitWords:["g","gramos"],defaultQty:1},
  {key:"atun",names:["atun","atún"],unitWords:["lata","latas"],defaultQty:1},
  {key:"aguacate",names:["aguacate"],unitWords:["g","gramos","medio","media"],defaultQty:1},
  {key:"aceite",names:["aceite de oliva","aceite"],unitWords:["cucharadita","cucharaditas"],defaultQty:1},
  {key:"arroz",names:["arroz"],unitWords:["g","gramos"],defaultQty:1},
  {key:"platano",names:["platano","plátano","plátano maduro","platano maduro"],unitWords:["g","gramos"],defaultQty:1},
  {key:"avena",names:["avena"],unitWords:["g","gramos"],defaultQty:1}
];
function normalize(s){return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"")}
function parseNumber(s){
  const map={un:"1",una:"1",uno:"1",dos:"2",tres:"3",cuatro:"4",cinco:"5",medio:"0.5",media:"0.5",mitad:"0.5"};
  s=normalize(s.trim()); if(map[s])return Number(map[s]); const n=parseFloat(s.replace(",",".")); return Number.isFinite(n)?n:null;
}
function analyzeMeal(text){
  const t=normalize(text); const found=[];
  for(const fp of foodPatterns){
    const names=fp.names.map(normalize).sort((a,b)=>b.length-a.length);
    const name=names.find(n=>t.includes(n));
    if(!name)continue;
    const idx=t.indexOf(name), before=t.slice(Math.max(0,idx-25),idx), after=t.slice(idx+name.length,idx+name.length+35);
    let qty=1;
    const numBefore=[...before.matchAll(/(\d+(?:[.,]\d+)?|un|una|uno|dos|tres|cuatro|cinco|medio|media|mitad)\s*$/g)].pop();
    const numAfter=after.match(/^\s*(\d+(?:[.,]\d+)?|un|una|uno|dos|tres|cuatro|cinco|medio|media|mitad)/);
    if(numBefore)qty=parseNumber(numBefore[1])||1; else if(numAfter)qty=parseNumber(numAfter[1])||1;
    // Convert gram quantities to approximate portions based on preset serving sizes.
    let serving=1, displayQty=qty;
    if(fp.key==="pollo"||fp.key==="carne"||fp.key==="higado"){const g=(numBefore&&/g|gram/.test(before.slice(-12)))?qty:(numAfter&&/g|gram/.test(after.slice(0,15))?qty:null); if(g!==null){serving=g/150;displayQty=g+" g"}}
    if(fp.key==="arroz"||fp.key==="platano"){const g=(numBefore&&/g|gram/.test(before.slice(-12)))?qty:(numAfter&&/g|gram/.test(after.slice(0,15))?qty:null); if(g!==null){serving=g/100;displayQty=g+" g"}}
    if(fp.key==="aguacate"){if(t.includes("medio aguacate")||t.includes("media aguacate")){serving=.5;displayQty=.5+" unidad"}}
    if(fp.key==="huevo"){serving=qty;displayQty=qty+" unidad(es)"}
    if(fp.key==="atun"){serving=qty;displayQty=qty+" lata(s)"}
    if(fp.key==="aceite"){serving=qty;displayQty=qty+" cucharadita(s)"}
    if(fp.key==="avena"){const g=(numBefore&&/g|gram/.test(before.slice(-12)))?qty:null;if(g!==null){serving=g/40;displayQty=g+" g"}else{serving=qty;displayQty=qty+" porción(es)"}}
    const p=presets[fp.key]; found.push({key:fp.key,name:p[0],qty:serving,displayQty,kcal:p[1],protein:p[2],carbs:p[3],fat:p[4]});
  }
  return found;
}
function renderMealAnalysis(items,text){
  const box=document.getElementById("mealPreview");
  if(!items.length){box.innerHTML=`No reconocí alimentos de la lista local. Prueba con nombres como <b>huevos, pollo, carne, atún, aguacate, arroz, plátano, avena</b>, indicando cantidades cuando puedas.`;return}
  const total=items.reduce((s,x)=>s+x.kcal*x.qty,0), prot=items.reduce((s,x)=>s+x.protein*x.qty,0);
  const carbs=items.reduce((s,x)=>s+x.carbs*x.qty,0), fat=items.reduce((s,x)=>s+x.fat*x.qty,0);
  box.innerHTML=items.map(x=>`<div class="ai-item"><span>${x.name} · ${x.displayQty}</span><b>${Math.round(x.kcal*x.qty)} kcal</b></div>`).join("")+
    `<div class="ai-total">Estimado: ${Math.round(total)} kcal · ${Math.round(prot)} g proteína · ${Math.round(carbs)} g carbos · ${Math.round(fat)} g grasa</div><div class="confidence">Estimación local basada en porciones de referencia; revisa y ajusta si tu preparación o etiqueta difiere.</div>`;
}
let analyzedItems=[];
document.getElementById("analyzeMeal").onclick=()=>{
  analyzedItems=analyzeMeal(document.getElementById("mealText").value);
  renderMealAnalysis(analyzedItems,document.getElementById("mealText").value);
};
document.getElementById("manualToggle").onclick=()=>document.getElementById("manualFields").classList.toggle("open");
document.getElementById("foodForm").onsubmit=e=>{e.preventDefault();
  if(analyzedItems.length){
    analyzedItems.forEach(x=>day().foods.push({name:x.name,qty:x.qty,kcal:x.kcal,protein:x.protein,carbs:x.carbs,fat:x.fat,meal:foodMeal.value}));
  }else{
    day().foods.push({name:foodName.value||"Alimento",qty:Number(foodQty.value)||1,kcal:Number(foodKcal.value)||0,protein:Number(foodProtein.value)||0,carbs:Number(foodCarbs.value)||0,fat:Number(foodFat.value)||0,meal:foodMeal.value});
  }
  save();e.target.reset();analyzedItems=[];document.getElementById("mealPreview").innerHTML='Escribe una comida y pulsa <b>Analizar comida</b>.';document.getElementById("foodDialog").close();refresh()
};

(function initAI(){
 const c=aiConfig();
 const p=document.getElementById("aiProvider"), k=document.getElementById("aiKey");
 if(p)p.value=c.provider||"groq"; if(k)k.value=c.key||"";
 const status=document.getElementById("aiStatus"); const q=quota();
 if(status)status.textContent=c.key?`Conectado · ${10-q.count} consultas locales disponibles hoy.`:"Sin conexión configurada.";
 document.getElementById("clearAIMemory").onclick=()=>{
  if(confirm("¿Reiniciar la memoria del coach? Se conservarán tus registros de comidas, peso y entrenamientos.")){
    localStorage.removeItem(AIMEM);renderAIMemory();
  }
};
document.getElementById("saveAI").onclick=()=>{
   localStorage.setItem(AIKEY,JSON.stringify({provider:p.value,key:k.value.trim()}));
   status.textContent=k.value.trim()?`Conexión guardada · ${10-quota().count} consultas locales disponibles hoy.`:"Sin conexión configurada.";
 };
 document.getElementById("testAI").onclick=async()=>{
   status.textContent="Probando…";
   try{const o=await callAI("Una comida de prueba: 2 huevos y 100 g de pollo.","meal");status.textContent=`IA funcionando. ${10-quota().count} consultas restantes hoy.`;renderAIResult(o)}
   catch(e){status.textContent="No se pudo conectar: "+e.message}
 };
 document.getElementById("aiAnalyzeMeal").onclick=async()=>{
   const t=document.getElementById("aiMealText").value.trim(), box=document.getElementById("aiResult");
   if(!t)return; box.textContent="Analizando…";
   try{const o=await callAI(t,"meal");renderAIResult(o);addAIMemory("meal",t,`Estimación: ${Math.round(o.meal_kcal||0)} kcal; ${Math.round(o.protein_g||0)} g proteína. ${o.note||""}`);document.getElementById("aiQuota").textContent=(10-quota().count)+" consultas/día restantes";}
   catch(e){box.textContent="No se pudo analizar: "+e.message}
 };
 document.getElementById("aiAdvice").onclick=async()=>{
   const box=document.getElementById("aiResult");box.textContent="Generando consejo…";
   const summary=`Calorías registradas: ${Math.round(kcal())}; proteína: ${Math.round(macro("protein"))} g; carbohidratos: ${Math.round(macro("carbs"))} g; grasas: ${Math.round(macro("fat"))} g; agua: ${day().water||"no registrada"} L; energía: ${day().energy||"no registrada"}; entrenamiento completado: ${day().done?.length||0} tareas.`;
   try{const o=await callAI(summary,"advice");renderAIResult(o);addAIMemory("advice",summary,`${o.priority||""} ${o.advice||""} ${o.next_step||""}`)}
   catch(e){box.textContent="No se pudo generar el consejo: "+e.message}
 };
})();
document.querySelectorAll(".nav-btn").forEach(b=>b.onclick=()=>show(b.dataset.view));document.querySelectorAll("[data-jump]").forEach(b=>b.onclick=()=>show(b.dataset.jump));
function show(id){document.querySelectorAll(".view").forEach(v=>v.classList.remove("active"));document.getElementById(id).classList.add("active");document.querySelectorAll(".nav-btn").forEach(b=>b.classList.toggle("active",b.dataset.view===id));const titles={dashboard:"Tu día, en números.",nutrition:"Nutrición sin adivinar.",training:"Entrena con control.",history:"Mira tu tendencia.",plan:"El mapa de las 4 semanas."};document.getElementById("pageTitle").textContent=titles[id];if(id==="training")renderTraining();if(id==="history"){renderHistory();renderAIMemory()}}
function renderTraining(){const week=Math.min(4,Math.floor((new Date()-new Date(new Date().getFullYear(),new Date().getMonth(),new Date().getDate()-((new Date().getDay()+6)%7)))/(7*86400000))+1);document.getElementById("weekTag").textContent="SEMANA "+week;document.getElementById("trainingTitle").textContent=currentPlan.title;document.getElementById("trainingContent").innerHTML=`<div class="training-block"><h3>${currentPlan.type==="Fuerza"?"Circuito de fuerza":"Cardio metabólico"}</h3><p class="muted">Marca cada bloque que completes. En fuerza, una vuelta completa equivale a 1 ronda. Descansa 60–90 s entre rondas.</p>${currentPlan.items.map((x,i)=>`<div class="exercise"><b>${x[0]}</b><span>${x[2]}</span><label><input class="done" type="checkbox" ${day().done.includes(i)?"checked":""} onchange="toggleDone(${i},this.checked)"> Hecho</label></div>`).join("")}</div><div class="safety"><b>* Progresión cardio:</b> el plan fuente indica 6–8 intervalos en semana 1, 8 en semana 2 y 8–10 en semanas 3–4. Si 80–100 burpees son excesivos, empieza con 4–6 y progresa gradualmente.</div>`}
function toggleDone(i,v){if(v&&!day().done.includes(i))day().done.push(i);if(!v)day().done=day().done.filter(x=>x!==i);save();refresh()}
function renderHistory(){const entries=Object.entries(db.days).sort((a,b)=>b[0].localeCompare(a[0]));const el=document.getElementById("historyList");if(!entries.length){el.innerHTML='<p class="muted">Aún no hay días guardados.</p>';return}el.innerHTML=entries.map(([d,x])=>{const k=x.foods.reduce((s,f)=>s+f.kcal*f.qty,0);return `<div class="history-item"><div class="history-date">${new Date(d+"T12:00:00").toLocaleDateString("es-CO",{day:"2-digit",month:"short"})}</div><div class="history-metrics">${Math.round(k)} kcal · ${Math.round(x.foods.reduce((s,f)=>s+f.protein*f.qty,0))} g proteína · ${x.weight?x.weight+" kg":"sin peso"} · ${x.done?.length||0} tareas</div><div class="score">${k>=1500&&k<=1700?"En rango":"Revisar"}</div></div>`}).join("")}
document.getElementById("saveStart").onclick=()=>{const v=document.getElementById("startDate").value;if(!v)return;db.startDate=v;save();renderCalendar();refresh();alert("Inicio de fase guardado.")};
document.getElementById("exportData").onclick=()=>{
  const blob=new Blob([JSON.stringify(db,null,2)],{type:"application/json"});
  const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="modo-buenaventura-datos.json";a.click();URL.revokeObjectURL(a.href);
};
document.getElementById("clearData").onclick=()=>{if(confirm("¿Borrar todos los registros guardados en este navegador?")){localStorage.removeItem(KEY);db={days:{}};refresh();renderHistory()}};
document.getElementById("weeks").innerHTML=[
["Semana 1","4 rondas de fuerza","6–8 intervalos","Aprender técnica y tolerancia"],
["Semana 2","4 rondas","8 intervalos","Consolidar ritmo"],
["Semana 3","4–5 rondas","8–10 intervalos","Progresar si hay buena recuperación"],
["Semana 4","4–5 rondas","8–10 intervalos","Mantener calidad y evaluar resultados"]
].map((w,i)=>`<article class="week"><span class="tag">SEMANA ${i+1}</span><h3>${w[0]}</h3><p><b>Fuerza:</b> ${w[1]}<br><b>Cardio:</b> ${w[2]}<br>${w[3]}</p></article>`).join("");
initStart();refresh();renderTraining();renderCalendar();renderAIMemory();
