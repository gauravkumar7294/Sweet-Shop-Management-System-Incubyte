const authService=require('../services/authService');

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
            res.status(400).json({message:error.message});
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
            res.status(401).json({messga:error.message});
        }
    };

    module.exports={
        register,
        login,
    };