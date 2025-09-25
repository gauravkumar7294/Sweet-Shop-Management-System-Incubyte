
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
