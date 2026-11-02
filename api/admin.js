const L=require('./_lib');
module.exports=L.wrap(async(req,res)=>{
 if(!L.authd(req,'ADMIN_KEY'))return res.status(401).json({error:'auth'});
 if(req.method==='POST'){
  const {ref,action}=req.body||{},r=L.enc(ref||'');
  if(action!=='valid'&&action!=='reject')return res.status(400).json({error:'action'});
  await L.sb('orders?ref=eq.'+r,{method:'PATCH',body:JSON.stringify({status:action==='valid'?'paid':'rejected'})});
  await L.sb('tickets?order_ref=eq.'+r,{method:'PATCH',body:JSON.stringify({status:action==='valid'?'valid':'void'})});
  return res.status(200).json({ok:true});
 }
 const orders=await L.sb('orders?select=*&order=created_at.desc&limit=300');
 const t=await L.sb('tickets?select=scans&status=eq.valid');
 res.status(200).json({orders,validTickets:t.length,scanned:t.filter(x=>x.scans>0).length});
});
