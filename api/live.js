const L=require('./_lib');
module.exports=L.wrap(async(req,res)=>{
 const teams=await L.sb('teams?select=*&order=name.asc'),matches=await L.sb('matches?select=*&order=id.asc');
 res.setHeader('Cache-Control','s-maxage=3, stale-while-revalidate=10');
 res.status(200).json({teams,matches,liveUrl:process.env.LIVE_URL||'',now:Date.now()});
});
