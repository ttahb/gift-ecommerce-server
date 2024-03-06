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
            // Sorce I found interesting to consider more the 
            enum: ["Pending", "Initiated", "Awaiting Payment", "In-progress", "Shipped", "Delivered", "Cancelled", "Partially Refunded", "Refunded"],
            default: "Pending",
        }, 
    },
    {
        timestamps: true
    }
);

module.exports = model('Order', orderSchema);