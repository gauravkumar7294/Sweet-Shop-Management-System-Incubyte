const prisma=require('../config/prisma');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');

const registerUser=async(email,password,role='CUSTOMER',adminSecretKey=null)=>{
    const existingUser=await prisma.user.findUnique({where:{email}});
    if(existingUser){
        throw new Error('Email already in use');
    }

    let userRole=role.toUpperCase();

    if(userRole==='ADMIN'){
        if(!adminSecretKey || adminSecretKey!=process.env.ADMIN_SECRET_KEY){
            throw new Error('Invalid secret Key for admin registration');
        }
    }
    else{
        userRole='CUSTOMER';
    }

    
    const hashedPassword=await bcrypt.hash(password,10);

    const user=await prisma.user.create({
        data:{
            email,
            password:hashedPassword,
            role:userRole,
        },
    });
    delete user.password;
    return user;
};


const loginUser=async(email,password)=>{
    const user=await prisma.user.findUnique({where:{email}});
    if(!user){
        throw new Error('Invalid credentials');
    }

    const isPasswordValid=await bcrypt.compare(password,user.password);
    if(!isPasswordValid){
        throw new Error('invalid credentials');
    }

    const token=jwt.sign(
        {userId:user.id,role:user.role},
        process.env.JWT_SECRET,
        {expiresIn:'5d'}
    );
    return token;
};

module.exports={
    registerUser,
    loginUser,
};