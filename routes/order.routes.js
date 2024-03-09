const router = require("express").Router();
const Order = require("../models/Order.model");
const Address = require("../models/Address.model");
const {isAdmin} = require('../middleware/guard.middleware');

router.get("/orders", async (req, res, next) => {

    try{
        const allOrders = await Order.find();
        res.json(allOrders);
        return;
    } catch(err){
        console.log(err);
        return res.status(500).json({ message: "Error while getting all orders"});
    }

});

router.get("/orders/:orderId", async (req, res, next) => {

    const { orderId } = req.params;

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

router.post('/orders', isAdmin, async (req, res, next) => {
   
    try{     
        const [ billingAddress, shippingAddress ] = await Promise.all([
            Address.create(req.body.billingAddress),
            Address.create(req.body.shippingAddress)
        ]);
        
        req.body.billingAddress = billingAddress._id;
        req.body.shippingAddress = shippingAddress._id;
        req.body.user = req.payload.userId;

        const order = await Order.create(req.body);
        // console.log("one order ==>", order)
        res.status(201).json(order);

    } catch(err){
        // console.log(err)
        res.status(400).json({message: "Internal Server Error / Order not created."})
    }

})

router.put("/orders/:orderId", isAdmin, async (req, res, next) => {
    const { orderId } = req.params;

   try{ 
    const updatedOrder = await Order.findByIdAndUpdate(orderId, req.body, {new: true});
    res.status(200).json(updatedOrder);

   } catch(err) {
    res.status(400).json({ message: "Internal Server Error / The order has not been updated."});
   }

})

router.patch("/orders/:orderId", isAdmin, async (req, res, next) => {
    const { orderId } = req.params;
    
    try{
        const updateOneFiled = await Order.findByIdAndUpdate(orderId, req.body, {new: true});
        res.status(200).json(updateOneFiled);
    } catch(err) {
        res.status(400).json({ message: "Internal Server Error / The order has not been updated."});
    }
})



module.exports = router;