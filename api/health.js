// Diagnostic : ouvrez /api/health. N'affiche aucune clé, seulement si elles sont présentes.
const L=require('./_lib');
module.exports=async(req,res)=>{
 const names=['SUPABASE_URL','SUPABASE_SERVICE_KEY','TOKEN_SECRET','ADMIN_KEY','SCAN_KEY'];
 const variables={};for(const n of names)variables[n]=!!L.env(n);
 const k=L.env('SUPABASE_SERVICE_KEY');
 const keyFormat=!k?'absente':k.startsWith('eyJ')?'ancienne (JWT)':k.startsWith('sb_secret_')?'nouvelle (sb_secret_)':k.startsWith('sb_publishable_')?'ERREUR : clé publique, il faut la clé secrète':'format inconnu';
 const urlOk=/^https:\/\/[a-z0-9-]+\.supabase\.co$/.test(L.base());
 const tables={};
 for(const t of ['orders','tickets','teams','matches']){
  try{await L.sb(t+'?select=*&limit=1');tables[t]='ok'}
  catch(e){tables[t]=String(e.message||e).replace(k||'#none#','***').slice(0,200)}
 }
 const ok=Object.values(variables).every(Boolean)&&urlOk&&Object.values(tables).every(v=>v==='ok');
 res.setHeader('Cache-Control','no-store');
 res.status(200).json({ok,variables,supabaseUrlFormatOk:urlOk,keyFormat,tables});
};
