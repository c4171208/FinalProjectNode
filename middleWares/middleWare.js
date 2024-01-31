export const  middleWare=(err,req,res,next)=>
{
  console.error(err.stack)
  let stat=res.stat?res.stat:500;
  res.status(stat).send(err.message||"error in server")  
};