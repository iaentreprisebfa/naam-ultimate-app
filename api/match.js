const L=require('./_lib');
module.exports=L.wrap(async(req,res)=>{
 if(req.method!=='POST')return res.status(405).end();
 if(!L.authd(req,'ADMIN_KEY'))return res.status(401).json({error:'auth'});
 const b=req.body||{},now=new Date(),ok=()=>res.status(200).json({ok:true}),S=x=>String(x||'').slice(0,60);
 const P=(id,o)=>L.sb('matches?id=eq.'+(+id),{method:'PATCH',body:JSON.stringify(o)});
 if(b.action==='team'){if(!S(b.name))return res.status(400).json({error:'name'});await L.sb('teams',{method:'POST',body:JSON.stringify({name:S(b.name),city:S(b.city),palmares:String(b.palmares||'').slice(0,160)})});return ok()}
 if(b.action==='match'){await L.sb('matches',{method:'POST',body:JSON.stringify({team_a:+b.team_a,team_b:+b.team_b,field:S(b.field)})});return ok()}
 const [m]=await L.sb('matches?select=*&id=eq.'+(+b.id));if(!m)return res.status(404).json({error:'nf'});
 const el=m.base_sec+(m.status==='live'?Math.floor((now-new Date(m.started_at))/1000):0);
 if(b.action==='state'){
  if(b.to==='live')await P(m.id,{status:'live',started_at:now.toISOString()});
  else if(b.to==='paused'||b.to==='finished')await P(m.id,{status:b.to,base_sec:el});
  else return res.status(400).json({error:'to'});
 }else if(b.action==='goal'&&['a','b'].includes(b.side)){
  await P(m.id,{events:[...m.events,{t:'goal',side:b.side,player:S(b.player),min:Math.floor(el/60)+1,at:now.toISOString()}],score_a:m.score_a+(b.side==='a'?1:0),score_b:m.score_b+(b.side==='b'?1:0)});
 }else if(b.action==='undo'){
  const i=m.events.map(e=>e.t).lastIndexOf('goal');if(i>=0){const e=m.events[i];await P(m.id,{events:m.events.filter((_,k)=>k!==i),score_a:m.score_a-(e.side==='a'?1:0),score_b:m.score_b-(e.side==='b'?1:0)})}
 }else return res.status(400).json({error:'action'});
 ok();
});
