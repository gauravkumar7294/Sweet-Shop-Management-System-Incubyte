/*
const sweets=[];
let currentId=1;

class SweetService{
    addSweet(sweetData){
        const newSweet={
            id:currentId++,
            name:sweetData.name,
            price:sweetData.price,
        };
        sweets.push(newSweet);
        return newSweet;
    }
    getAllSweets(){
        return sweets;
    }
}

module.exports=SweetService;
*/

const prisma=require('../config/prisma');

const createSweet=async(sweetData)=>{
    const {name,price,quantity,imageUrl,category}=sweetData;

    const newSweet=await prisma.sweet.create({
        data:{
            name,
            price,
            quantity,
            imageUrl,
            category,
        },
    });
    return newSweet;
};

module.exports={
    createSweet,
};