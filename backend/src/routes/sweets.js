
/*
const express=require('express');
const router=express.Router();
const sweetController=require('../controllers/sweetController');
const authenticate=require('../middleware/authenticate');
const authorize=require('../middleware/authorize');

router.post('/',authenticate,authorize(['ADMIN']),sweetController.addSweet);

module.exports=router;
*/

const express = require('express');
const router = express.Router();
const sweetController = require('../controllers/sweetController');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');

// POST /api/sweets - Add a new sweet (Admin Only)
// This route is protected. A user must be logged in (authenticate) and must have the 'ADMIN' role (authorize).
router.post('/', authenticate, authorize(['ADMIN']), sweetController.addSweet);

// GET /api/sweets - Get all sweets (Any Authenticated User)
// This route only requires a user to be logged in.
router.get('/', authenticate, sweetController.getAllSweets);

// GET /api/sweets/search - Search for sweets (Any Authenticated User)
// This route also only requires a user to be logged in.
router.get('/search', authenticate, sweetController.searchSweets);

// PUT /api/sweets/:id - Update a sweet (Admin Only)
// Protected for admins only.
router.put('/:id', authenticate, authorize(['ADMIN']), sweetController.updateSweet);

// DELETE /api/sweets/:id - Delete a sweet (Admin Only)
// Protected for admins only.
router.delete('/:id', authenticate, authorize(['ADMIN']), sweetController.deleteSweet);

// POST /api/sweets/:id/purchase - Purchase a sweet (Any Authenticated User)
// Any logged-in user can purchase a sweet.
router.post('/:id/purchase', authenticate, sweetController.purchaseSweet);

// POST /api/sweets/:id/restock - Restock a sweet (Admin Only)
// Protected for admins only.
router.post('/:id/restock', authenticate, authorize(['ADMIN']), sweetController.restockSweet);

module.exports = router;