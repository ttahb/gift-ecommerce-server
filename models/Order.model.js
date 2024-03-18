const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const orderSchema = new Schema(
    {
        user: {
            type:Schema.Types.ObjectId, 
            ref: "User",
            require: true
        },

        orderNumber: {
            type: String,
            require: true
        },
        
        shippingAddress: {
            type:Schema.Types.ObjectId,
            ref: "Address",
            require: true
        },

        billingAddress: {
            type:Schema.Types.ObjectId,
            ref: "Address",
            require: true
        },

        amount: {
            type: Number,
            require: true
        },

        status: {
            type: String,
            enum: ["Order Created", "Confirmed", "Needs Payment confirmation", "Completed", "Delivered", "Cancelled", "Refunded"],
            default: "Order Created",
        }, 

        // served: {
        //     type: Boolean,
        //     default: false
        // },

        content: [{
            productImg: {
                type: String,
            },
            productId:{
                type: String,
                require: true
            },
            productName: {
                type: String,
                require: true
            },
            price: {
                type:Number,
                require: true
            },
            quantity: {
                type: Number,
                require: true
            }
        }]
    },
    {
        timestamps: true
    }
);

module.exports = model('Order', orderSchema);