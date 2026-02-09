
const STORAGE_KEY = "fslab_checklist_v1";

function loadData(){
  const raw = localStorage.getItem(STORAGE_KEY);
  if(raw){
    try { return JSON.parse(raw); } catch(e){}
  }
  return null;
}
function saveData(data){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}
function getData(){
  let data = loadData();
  if(!data){
    data = window.SEED_DATA;
    saveData(data);
  }
  return data;
}
function setData(data){
  saveData(data);
}
function pct(n, d){ return d ? Math.round((n/d)*100) : 0; }

function allTasks(data){
  const list=[];
  data.phases.forEach(p=>{
    p.tasks.forEach(t=> list.push({...t, phaseId:p.id, phaseName:p.name}));
  });
  return list;
}
function taskCounts(data){
  const tasks = allTasks(data);
  const done = tasks.filter(t=>t.status==="done").length;
  return { total: tasks.length, done, pct: pct(done,tasks.length) };
}
function phaseProgress(phase){
  const total = phase.tasks.length;
  const done = phase.tasks.filter(t=>t.status==="done").length;
  return { total, done, pct: pct(done,total) };
}
function formatPrio(prio){
  if(prio==="high") return {label:"Alta", cls:"high"};
  if(prio==="med") return {label:"Média", cls:"med"};
  return {label:"Baixa", cls:"low"};
}

function findTask(data, taskId){
  for(const p of data.phases){
    const t = p.tasks.find(x=>x.id===taskId);
    if(t) return {phase:p, task:t};
  }
  return null;
}
function updateTask(data, taskId, updater){
  data.phases.forEach(p=>{
    p.tasks = p.tasks.map(t=>{
      if(t.id===taskId){
        const nt = {...t};
        updater(nt, p);
        return nt;
      }
      return t;
    });
  });
  return data;
}

function registerSW(){
  if('serviceWorker' in navigator){
    navigator.serviceWorker.register('/sw.js').catch(()=>{});
  }
}
document.addEventListener('DOMContentLoaded', registerSW);
