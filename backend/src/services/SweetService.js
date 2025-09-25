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

/*
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
*/

const prisma = require('../config/prisma');

/**
 * Creates a new sweet in the database. (Admin only)
 */
const addSweet = async (data) => {
  // Ensure price and quantity are numbers
  const sweetData = {
    ...data,
    price: parseFloat(data.price),
    quantity: parseInt(data.quantity, 10),
  };
  return prisma.sweet.create({ data: sweetData });
};

/**
 * Retrieves a list of all sweets.
 */
const getAllSweets = async () => {
  return prisma.sweet.findMany();
};

/**
 * Searches for sweets based on criteria (name, category).
 */
const searchSweets = async (query) => {
  return prisma.sweet.findMany({
    where: {
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { category: { contains: query, mode: 'insensitive' } },
      ],
    },
  });
};

/**
 * Updates an existing sweet's details. (Admin only)
 */
const updateSweet = async (id, data) => {
  const sweetData = { ...data };
  if (data.price) sweetData.price = parseFloat(data.price);
  if (data.quantity) sweetData.quantity = parseInt(data.quantity, 10);

  return prisma.sweet.update({
    where: { id: parseInt(id, 10) },
    data: sweetData,
  });
};

/**
 * Deletes a sweet from the database. (Admin only)
 */
const deleteSweet = async (id) => {
  return prisma.sweet.delete({
    where: { id: parseInt(id, 10) },
  });
};

/**
 * Handles the purchase of a sweet, decreasing its quantity.
 */
const purchaseSweet = async (id, purchaseQuantity) => {
  const sweet = await prisma.sweet.findUnique({ where: { id: parseInt(id, 10) } });

  if (!sweet) {
    throw new Error('Sweet not found');
  }

  if (sweet.quantity < purchaseQuantity) {
    throw new Error('Not enough stock available');
  }

  return prisma.sweet.update({
    where: { id: parseInt(id, 10) },
    data: {
      quantity: {
        decrement: purchaseQuantity,
      },
    },
  });
};

/**
 * Handles restocking a sweet, increasing its quantity. (Admin only)
 */
const restockSweet = async (id, restockQuantity) => {
  return prisma.sweet.update({
    where: { id: parseInt(id, 10) },
    data: {
      quantity: {
        increment: restockQuantity,
      },
    },
  });
};

module.exports = {
  addSweet,
  getAllSweets,
  searchSweets,
  updateSweet,
  deleteSweet,
  purchaseSweet,
  restockSweet,
};

