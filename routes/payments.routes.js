const router = require("express").Router();
// This is your test secret API key.
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const Order = require("../models/Order.model");

router.post('/create-payment-intent', async (req, res) => {

    try {
        console.log('req.body', req.body);
        const {currentOrderId} = req.body;
        console.log('currentOrderId', currentOrderId);
        const currrentOrder = await Order.findById(currentOrderId);
        console.log('amount intended', currrentOrder.amount);
        // Create a PaymentIntent with the order amount and currency
        if(currrentOrder && currrentOrder.amount){
            const paymentIntent = await stripe.paymentIntents.create({
                amount: currrentOrder.amount,
                currency: 'EUR',
                description: 'Pirineous Gourmet goods',
                shipping: {
                    name: 'Jenny Rosen',
                    address: {
                      line1: '510 Townsend St',
                      postal_code: '98140',
                      city: 'San Francisco',
                      state: 'CA',
                      country: 'US',
                    }
                },
                automatic_payment_methods: {
                    enabled: true,
                }
            })

            res.send({
                clientSecret: paymentIntent.client_secret
            });
            return;
        } else {
            res.status(400).send({message:'Something went wrong!'})
        }
        
    } catch (error){
        console.log('err', error)
        res.status(500).send({message: error.message});
    }
})

module.exports = router;