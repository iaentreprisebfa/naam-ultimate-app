const L=require('./_lib');
module.exports=L.wrap(async(req,res)=>{
 if(req.method!=='POST')return res.status(405).end();
 const b=req.body||{},tx=String(b.txid||'').trim().slice(0,40),op=['Orange Money','Moov Money'].includes(b.operator)?b.operator:null;
 const [o]=await L.sb('orders?select=ref,phone,status&ref=eq.'+L.enc(b.ref||''));
 if(!o||L.digits(o.phone)!==L.digits(b.phone)||!tx||!op||!['pending','proof'].includes(o.status))return res.status(400).json({error:'invalid'});
 await L.sb('orders?ref=eq.'+L.enc(o.ref),{method:'PATCH',body:JSON.stringify({status:'proof',operator:op,txid:tx})});
 res.status(200).json({ok:true});
});
