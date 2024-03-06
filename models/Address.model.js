const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const addressSchema = new Schema(
    {
        buildingNumber: {
            type: Number,
            require: [true, 'Building number is required']
        },
        street: {
            type: Number,
            require: [true, 'Street is required']
        },
        city: {
            type: Number,
            require: [true, 'City is required']
        },
        country: {
            type: String,
            enum: ['Spain'], //If needed add more country, M?
            default: 'Spain', // if another country is write or choosen? => 'We do not deliver our site of Spain' M?
        },
        postCode: {
            type: String,
            require: [true, 'PostCode is required']
        },
        contactNumber: {
            type: String
        },
        contactPerson: {
            type: String,
        },
    },
    {
        timestamps: true
    }
);

module.exports = model("Address", addressSchema);