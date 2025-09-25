const authService=require('../services/authService');

const handleError=(res,error)=>{
    const statusCode=error.message==='Invalid credentials' ? 401:400;
    res.status(statusCode).json({message:error.message});
};
const register=async(req,res)=>{
    const {email,password,role,adminSecretKey}=req.body;

    if(!email || !password){
        return res.status(400).json({message:'Email and password are required. '});
    }

    try{
        const user=await authService.registerUser(email,
            password,role,adminSecretKey);

            res.status(201).json({message:'User registered successfully',user});
        }catch(error){
            handleError(res,error)
        }
    };

    const login=async(req,res)=>{
        const {email,password}=req.body;

        if(!email || !password){
            return res.status(400).json({message:'Email and password are required .'});
        }

        try{
            const token=await authService.loginUser(email,password);
            res.status(200).json({message:'Login successful',token});
        }catch(error){
          handleError(res,error);
        }
    };

    module.exports={
        register,
        login,
    };