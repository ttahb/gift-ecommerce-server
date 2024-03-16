const router = require("express").Router();
const Order = require("../models/Order.model");
const Address = require("../models/Address.model");
const { isAdminOrModerator } = require('../middleware/guard.middleware');
const {generateSecureRandom} = require('./../utils/utils');
const mongoose = require("mongoose");
router.get("/orders", async (req, res, next) => {
    try{
        let allOrders;
        if(req.payload.role.toLowerCase() === 'admin'){
             allOrders = await Order.find().populate('user');
        } else {
            allOrders = await Order.find({'user': new mongoose.Types.ObjectId(req.payload.userId)}).populate('user')
        }
       
        res.json(allOrders.sort((o1,o2) => o2.createdAt - o1.createdAt));
    } catch(err){
        console.log(err);
        return res.status(500).json({ message: "Internal server error."});
    }

});

router.get("/orders/:orderId", async (req, res, next) => {

    const { orderId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
        res.status(400).json({ message: "Specified id is not valid" });
        return;
    }

    try{
        const singleOrder = await Order.findById(orderId)
                                        .populate("user")
                                        .populate("shippingAddress")
                                        .populate("billingAddress")

        res.json(singleOrder);

    } catch(err) {
        console.log(err);
        res.status(500).json({ message: "Error while retrieving the project" });
    }
})

router.post('/orders', async (req, res, next) => {
   
    try{ 
        
        console.log('req.body', req.body);
        const [ billingAddress, shippingAddress ] = await Promise.all([
            Address.create(req.body.billingAddress),
            Address.create(req.body.shippingAddress)
        ]);
        
        req.body.billingAddress = billingAddress._id;
        req.body.shippingAddress = shippingAddress._id;
        req.body.user = req.payload.userId;
        //Generating a unique order number.
        req.body.orderNumber = generateSecureRandom(10,99) + '-' + Date.now() + '-' + generateSecureRandom(1000,9999)

        const order = await Order.create(req.body);
        // console.log("one order ==>", order)
        res.status(201).json(order);

    } catch(err){
        console.log('here',err)
        res.status(400).json({message: "Internal Server Error / Order not created."})
    }

})

router.put("/orders/:orderId", isAdminOrModerator, async (req, res, next) => {
    const { orderId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
        res.status(400).json({ message: "Specified id is not valid" });
        return;
    }

   try{ 
    const updatedOrder = await Order.findByIdAndUpdate(orderId, req.body, {new: true});
    res.status(200).json(updatedOrder);

   } catch(err) {
    res.status(400).json({ message: "Internal Server Error / The order has not been updated."});
   }

})

router.patch("/orders/:orderId", isAdminOrModerator, async (req, res, next) => {
    const { orderId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
        res.status(400).json({ message: "Specified id is not valid" });
        return;
    }
    
    try{
        const updateOneFiled = await Order.findByIdAndUpdate(orderId, req.body, {new: true});
        res.status(200).json(updateOneFiled);
    } catch(err) {
        res.status(400).json({ message: "Internal Server Error / The order has not been updated."});
    }
})


module.exports = router;