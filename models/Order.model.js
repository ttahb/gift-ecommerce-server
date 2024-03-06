const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const orderSchema = new Schema(
    {
        user: {
            type:Schema.Types.ObjectId, 
            ref: "User"
        },
        address: {
            type:Schema.Types.ObjectId,
            ref: "Address"
        },
        amounth: {
            type: Number,
            require: true
        },
        status: {
            type: String,
            // https://support.bigcommerce.com/s/article/Order-Statuses?language=en_US
            // Sorce I found interesting to consider more then the 3 fileds.
            enum: ["Pending", "Initiated", "Awaiting Payment", "In-progress", "Shipped", "Delivered", "Cancelled", "Partially Refunded", "Refunded"],
            default: "Pending",
        }, 
        content: [{
            productId:{
                type: String,
                require: true
            },
            productName: {
                type: String,
                require: true
            },
        // Suggestion for the top 2 fileds, to refer to the obj.Type Product
                // product: {
                //     type: Schema.Types.ObjectId,
                //     ref: "Product"
                // }
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