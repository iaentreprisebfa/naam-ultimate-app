const L=require('./_lib');
module.exports=L.wrap(async(req,res)=>{
 if(req.method!=='POST')return res.status(405).end();
 const b=req.body||{},t=L.TICKETS[b.type],q=Math.floor(+b.qty);
 const name=String(b.name||'').trim().slice(0,80),phone=String(b.phone||'').trim().slice(0,20),email=String(b.email||'').trim().slice(0,120);
 if(!t||!(q>=1&&q<=10)||!name||L.digits(phone).length<8)return res.status(400).json({error:'invalid'});
 const ref=L.rid('CMD-',8),total=t.p*q;
 await L.sb('orders',{method:'POST',body:JSON.stringify({ref,name,phone,email,ticket_type:b.type,qty:q,total})});
 await L.sb('tickets',{method:'POST',body:JSON.stringify(Array.from({length:q},()=>({code:L.rid('NUG-',10),order_ref:ref,name,type:t.k,max_scans:t.max})))});
 res.status(200).json({ref,total});
});
