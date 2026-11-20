const L=require('./_lib');
module.exports=L.wrap(async(req,res)=>{
 if(req.method!=='POST')return res.status(405).end();
 if(!L.authd(req,'SCAN_KEY'))return res.status(401).json({error:'auth'});
 const tok=String((req.body||{}).token||'').trim(),[code,sig]=tok.split('.'),no=msg=>res.status(200).json({ok:false,msg});
 if(!code||!sig||!L.eq(L.sign(code),sig))return no('CODE INVALIDE (faux billet)');
 const [t]=await L.sb('tickets?select=*&code=eq.'+L.enc(code));
 if(!t)return no('BILLET INTROUVABLE');
 if(t.status!=='valid')return no('NON VALIDE (paiement non confirmé ou annulé)');
 const def=L.TICKETS.find(x=>x.k===t.type),today=new Date().toISOString().slice(0,10);
 if(def&&today>=L.FESTIVAL_START){
  if(!def.days.includes(today))return no('PAS VALABLE AUJOURD’HUI (valable le '+def.days.map(d=>d.slice(8)+'/01').join(' et le ')+')');
  if(t.last_scan&&String(t.last_scan).slice(0,10)===today)return no('DÉJÀ UTILISÉ AUJOURD’HUI');
 }
 if(t.scans>=t.max_scans)return no('DÉJÀ UTILISÉ ('+t.scans+'/'+t.max_scans+')');
 const u=await L.sb('tickets?code=eq.'+L.enc(code)+'&scans=eq.'+t.scans,{method:'PATCH',body:JSON.stringify({scans:t.scans+1,last_scan:new Date().toISOString()})});
 if(!u.length)return no('DÉJÀ SCANNÉ À L’INSTANT');
 res.status(200).json({ok:true,msg:'BILLET VALIDE',type:t.type,name:t.name,scan:t.scans+1,max:t.max_scans});
});
