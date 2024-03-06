const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const addressSchema = new Schema(
    {
        contactPerson: {
            type: String,
            require: [true, 'contactPerson is required']
        },

        buildingNumber: {
            type: String,
            require: [true, 'Building number is required']
        },
        street: {
            type: String,
            require: [true, 'Street is required']
        },
        city: {
            type: String,
            require: [true, 'City is required']
        },
        country: {
            type: String,
            require: [true, 'Country is required']
            //we will use a country-list package in Front End which user can select a country. We should not default this field
            // enum: ['Spain'], //If needed add more country, M?
            // default: 'Spain', // if another country is write or choosen? => 'We do not deliver our site of Spain' M?
        },
        postalCode: {
            type: String,
            require: [true, 'PostalCode is required']
        },
        contactNumber: {
            type: String
        }
    },
    {
        timestamps: true
    }
);

module.exports = model("Address", addressSchema);