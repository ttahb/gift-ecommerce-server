const router = require("express").Router();
const Product = require('../models/Product.model');
const { isAuthenticated } = require('../middleware/jwt.middleware');
const {isAdmin, isModerator, isAdminOrModerator} = require('../middleware/guard.middleware');
const mongoose = require("mongoose");

// GET /products - should be accessible to all
router.get('/products', async(req, res, next) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        console.log(err);
        res.status(500).json({ message: "Failed to get all products."});
    }
})

// GET a particular product  - All users
router.get('/products/:productId', async(req, res, next) => {

    const { productId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(productId)) {
        res.status(400).json({ message: "product id is not valid" });
        return;
    }

    try {     
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ message: `Product with Product ID - ${productId} is not found.` });
        }

        res.status(200).json(product);
    } catch (error){
        console.log(error);
        res.status(500).json({ message: "Failed to get the product"});
    }
})


/* **************      PROTECTED Routes below        *********** */
router.post('/products',isAuthenticated, isAdmin, async(req, res, next) => {
    try {
        const {productName, price, description, image, tags} = req.body;
        const product = await Product.create({productName, price, description, image, tags, userId: req.payload.userId, lastUpdatedBy: req.payload.userId});
        res.status(201).json(product);
    } catch(error){
        console.log(error);
        res.status(500).json({ message: "Failed to create the product"});
    }
})

router.put('/products/:productId', isAuthenticated, isAdminOrModerator, async(req, res, next) => {
    const { productId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(productId)) {
        res.status(400).json({ message: "product id is not valid" });
        return;
    }

    try {     
        const updatedProduct = await Product.findByIdAndUpdate(productId, req.body, {new:true});

        if (!updatedProduct) {
            return res.status(404).json({ message: `Product with Product ID - ${productId} is not found.` });
        }
        
        res.status(200).json(updatedProduct);
    } catch (error){
        console.log(error);
        res.status(500).json({ message: `Failed to update the product with productId: ${productId}`});
    }
})

router.delete('/products/:productId', isAuthenticated, isAdmin, async(req, res, next) => {
    const { productId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(productId)) {
        res.status(400).json({ message: "product id is not valid" });
        return;
    }

    try {     
        const deletedProduct = await Product.findByIdAndDelete(productId);
        if (!deletedProduct) {
            return res.status(404).json({ message: `Product with Product ID - ${productId} is not found.` });
        }
        res.json({message: `Product with ${productId} is removed successfully.`})
    } catch (error){
        console.log(error);
        res.status(500).json({ message: `Failed to update the product with productId: ${productId}`});
    }
})

router.patch('/products/:productId', isAuthenticated, isAdminOrModerator, async(req, res, next) => {
    const { productId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(productId)) {
        res.status(400).json({ message: "product id is not valid" });
        return;
    }

    try {     
        const patchedProduct = await Product.findByIdAndUpdate(productId, req.body, {new:true});

        if (!patchedProduct) {
            return res.status(404).json({ message: `Product with Product ID - ${productId} is not found.` });
        }

        res.json(patchedProduct);
    } catch (error){
        console.log(error);
        res.status(500).json({ message: `Failed to update the product with productId: ${productId}`});
    }
})

module.exports = router;