
/*
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
*/

const sweetService = require('../services/sweetService');

// A reusable error handler function to keep the controller code DRY (Don't Repeat Yourself)
const handleError = (res, error) => {
  console.error(error);
  // Check for specific, known errors from the service layer
  if (error.message.includes('Not enough stock') || error.message.includes('Sweet not found')) {
    return res.status(400).json({ message: error.message });
  }
  // Handle Prisma's specific error code for a record not being found during an update/delete
  if (error.code === 'P2025') {
    return res.status(404).json({ message: 'The requested sweet does not exist.' });
  }
  // For all other unexpected errors, send a generic 500 server error
  res.status(500).json({ message: 'An internal server error occurred.' });
};

// Handles the logic for the POST /api/sweets endpoint
const addSweet = async (req, res) => {
  try {
    const sweet = await sweetService.addSweet(req.body);
    res.status(201).json(sweet);
  } catch (error) {
    handleError(res, error);
  }
};

// Handles the logic for the GET /api/sweets endpoint
const getAllSweets = async (req, res) => {
  try {
    const sweets = await sweetService.getAllSweets();
    res.status(200).json(sweets);
  } catch (error) {
    handleError(res, error);
  }
};

// Handles the logic for the GET /api/sweets/search endpoint
const searchSweets = async (req, res) => {
  try {
    const { q } = req.query; // e.g., /search?q=Rasgulla
    if (!q) {
      return res.status(400).json({ message: 'A search query parameter "q" is required.' });
    }
    const sweets = await sweetService.searchSweets(q);
    res.status(200).json(sweets);
  } catch (error) {
    handleError(res, error);
  }
};

// Handles the logic for the PUT /api/sweets/:id endpoint
const updateSweet = async (req, res) => {
  try {
    const sweet = await sweetService.updateSweet(req.params.id, req.body);
    res.status(200).json(sweet);
  } catch (error) {
    handleError(res, error);
  }
};

// Handles the logic for the DELETE /api/sweets/:id endpoint
const deleteSweet = async (req, res) => {
  try {
    await sweetService.deleteSweet(req.params.id);
    res.status(200).json({ message: 'Sweet deleted successfully.' });
  } catch (error) {
    handleError(res, error);
  }
};

// Handles the logic for the POST /api/sweets/:id/purchase endpoint
const purchaseSweet = async (req, res) => {
  try {
    const { quantity } = req.body;
    if (!quantity || typeof quantity !== 'number' || quantity <= 0) {
      return res.status(400).json({ message: 'A valid, positive number for quantity is required.' });
    }
    const sweet = await sweetService.purchaseSweet(req.params.id, quantity);
    res.status(200).json({ message: 'Purchase successful', sweet });
  } catch (error) {
    handleError(res, error);
  }
};

// Handles the logic for the POST /api/sweets/:id/restock endpoint
const restockSweet = async (req, res) => {
  try {
    const { quantity } = req.body;
    if (!quantity || typeof quantity !== 'number' || quantity <= 0) {
      return res.status(400).json({ message: 'A valid, positive number for quantity is required.' });
    }
    const sweet = await sweetService.restockSweet(req.params.id, quantity);
    res.status(200).json({ message: 'Restock successful', sweet });
  } catch (error) {
    handleError(res, error);
  }
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
