const jwt=require('jsonwebtoken');
const prisma=require('../config/prisma');

const authenticate=async(req,res,next)=>{
    const authHeader=req.headers.authorization;

    if(!authHeader || !authHeader.startsWith('Bearer')){
        return res.status(401).json({message:'Unauthorized:No token provideed'});
    }
    const token=authHeader.split(' ')[1];

    try{
        const decodedPayload=jwt.verify(token,process.env.JWT_SECRET);

        const user=await prisma.user.findUnique({
            where:{id:decodedPayload.userId},
        });

        if(!user){
            return res.status(401).json({message:'Unauthorized:User not found'});
        }
        req.user=user;
        next();
    }catch(error){
        return res.statu(401).json({message:'Unauthorized:Invalid token'});
    }
};
module.exports=authenticate;