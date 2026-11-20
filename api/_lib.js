const crypto=require('crypto');
// Doit correspondre aux billets de index.html (même ordre) : nom, prix FCFA, passages autorisés, jours valables (heure de Ouagadougou = UTC)
const TICKETS=[{k:'Standard · Samedi 23 janvier',p:500,max:1,days:['2027-01-23']},{k:'Standard · Dimanche 24 janvier',p:1000,max:1,days:['2027-01-24']},{k:'Pass VIP · 23 et 24 janvier',p:3000,max:2,days:['2027-01-23','2027-01-24']}];
// Le contrôle du jour ne s'applique qu'à partir de l'ouverture du festival (avant : scans de test possibles)
const FESTIVAL_START='2027-01-21';
const env=n=>String(process.env[n]||'').trim();
const base=()=>env('SUPABASE_URL').replace(/\/+$/,'').replace(/\/rest\/v1$/,'');
// Clés Supabase : ancien format (JWT "eyJ...") ou nouveau format ("sb_secret_..."). Le nouveau format ne doit pas être envoyé en "Bearer".
const keyHeaders=()=>{const K=env('SUPABASE_SERVICE_KEY');return K.startsWith('eyJ')?{apikey:K,Authorization:'Bearer '+K}:{apikey:K}};
const sb=async(path,opt={})=>{const r=await fetch(base()+'/rest/v1/'+path,{...opt,headers:{...keyHeaders(),'Content-Type':'application/json',Prefer:'return=representation',...(opt.headers||{})}});const t=await r.text();if(!r.ok)throw new Error(r.status+' '+t);return t?JSON.parse(t):[]};
const eq=(a,b)=>{a=Buffer.from(String(a));b=Buffer.from(String(b));return a.length===b.length&&crypto.timingSafeEqual(a,b)};
const sign=c=>crypto.createHmac('sha256',env('TOKEN_SECRET')).update(c).digest('hex').slice(0,12);
const rid=(p,n)=>p+crypto.randomBytes(8).toString('hex').toUpperCase().slice(0,n);
const authd=(req,n)=>!!env(n)&&eq(req.headers['x-key']||'',env(n));
const digits=s=>String(s||'').replace(/\D/g,'').slice(-8);
const enc=encodeURIComponent;
const wrap=h=>async(req,res)=>{try{await h(req,res)}catch(e){console.error(e);res.status(500).json({error:'server'})}};
module.exports={TICKETS,FESTIVAL_START,sb,sign,rid,authd,digits,enc,eq,wrap,env,base};
