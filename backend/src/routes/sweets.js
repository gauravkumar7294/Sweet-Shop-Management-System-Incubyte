const express=require('express');
const router=express.Router();
const sweetController=require('../controllers/sweetController');
const authenticate=require('../middleware/authenticate');
const authorize=require('../middleware/authorize');

router.post('/',authenticate,authorize(['ADMIN']),sweetController.addSweet);

module.exports=router;