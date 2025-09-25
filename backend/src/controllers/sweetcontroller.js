const sweetService=require('../services/sweetService');

const addSweet=async(req,res)=>{
    const {name,price,quantity,imageUrl,category}=req.bodyl;

    if(!name || typeof price !=='number' || typeof quantity!=='number'){
        return res.status(400).json({message:'Name,price,and quantity are required .'});
    }
    try{
        const newSweet=await sweetService.createSweet({name,price,quantity,imageUrl,category});
        res.status(201).json({message:'sweet added successfully',sweet:newSweet});
    }catch(error){
        res.status(500).json({message:'An error occurred while adding the sweet .',error:error.message});
    }
};

module.exports={
    addSweet,
};