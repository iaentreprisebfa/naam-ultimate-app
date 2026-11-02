const crypto=require('crypto');
// Doit correspondre aux billets de index.html (même ordre) : nom, prix FCFA, nombre de passages autorisés
const TICKETS=[{k:'Entrée standard',p:1000,max:1},{k:'Entrée VIP',p:2000,max:1},{k:'Badge VIP 2 jours',p:5000,max:2}];
const env=n=>process.env[n]||'';
const sb=async(path,opt={})=>{const K=env('SUPABASE_SERVICE_KEY'),r=await fetch(env('SUPABASE_URL')+'/rest/v1/'+path,{...opt,headers:{apikey:K,Authorization:'Bearer '+K,'Content-Type':'application/json',Prefer:'return=representation',...(opt.headers||{})}});const t=await r.text();if(!r.ok)throw new Error(t);return t?JSON.parse(t):[]};
const eq=(a,b)=>{a=Buffer.from(String(a));b=Buffer.from(String(b));return a.length===b.length&&crypto.timingSafeEqual(a,b)};
const sign=c=>crypto.createHmac('sha256',env('TOKEN_SECRET')).update(c).digest('hex').slice(0,12);
const rid=(p,n)=>p+crypto.randomBytes(8).toString('hex').toUpperCase().slice(0,n);
const authd=(req,n)=>!!env(n)&&eq(req.headers['x-key']||'',env(n));
const digits=s=>String(s||'').replace(/\D/g,'').slice(-8);
const enc=encodeURIComponent;
const wrap=h=>async(req,res)=>{try{await h(req,res)}catch(e){console.error(e);res.status(500).json({error:'server'})}};
module.exports={TICKETS,sb,sign,rid,authd,digits,enc,eq,wrap};
