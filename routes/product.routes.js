const router = require("express").Router();
const Product = require('../models/Product.model');
const { isAuthenticated } = require('../middleware/jwt.middleware');
const {isAdmin} = require('../middleware/guard.middleware');


// GET /products
router.get('/products', async(req, res, next) => {
    try {
        const products = await Product.find();
        return res.json(products);
    } catch (error) {
        console.log(err);
        return res.status(500).json({ message: "Failed to get all products."});
    }
})

//POST /products - > Create a product
router.post('/products',isAuthenticated, isAdmin, async(req, res, next) => {
    try {
        const {productName, price, description, image, tags} = req.body;
        const product = await Product.create({productName, price, description, image, tags, userId: req.payload.userId, lastUpdatedBy: req.payload.userId});
        res.status(201).json(product);
    } catch(error){
        console.log(error);
        return res.status(500).json({ message: "Failed to create the product"});
    }
})

module.exports = router;