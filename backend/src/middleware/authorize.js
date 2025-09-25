const authorize=(allowedRoles)=>{
    return(req,res,next)=>{
        const userRole=req.user?.role;

        if(userRole && allowedRoles.includes(userRole)){
            next();
        }else{
            res.status(403).json({message:'Forbidden: You do not have permission to peroform this action'});
        }
    };
};
module.exports=authorize;