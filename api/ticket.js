const L=require('./_lib');
module.exports=L.wrap(async(req,res)=>{
 const {ref,phone}=req.query;
 const [o]=await L.sb('orders?select=*&ref=eq.'+L.enc(ref||''));
 if(!o||L.digits(o.phone)!==L.digits(phone))return res.status(404).json({error:'notfound'});
 const out={ref:o.ref,status:o.status,total:o.total,name:o.name};
 if(o.status==='paid'){const ts=await L.sb('tickets?select=code,type,name,max_scans&status=eq.valid&order_ref=eq.'+L.enc(o.ref));out.tickets=ts.map(t=>({...t,token:t.code+'.'+L.sign(t.code)}))}
 res.status(200).json(out);
});
