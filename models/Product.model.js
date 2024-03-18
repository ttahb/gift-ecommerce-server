const { Schema, model } = require("mongoose");
const User = require("./User.model");

const productSchema = new Schema(
    {
        // in case we want to know which admin or mod has created this product.
       userId: {
        type: Schema.Types.ObjectId,
        ref: User
       },
       
       lastUpdatedBy: {
        type: Schema.Types.ObjectId,
        ref: User
       },

       productName: {
        type: String,
        required: true,
       },

       price: {
        type: Number,
        required:true 
       }, 

       description: {
        type: String,
        required: true
       },

       image: {
        type: String,
        default: 'https://drive.google.com/file/d/1C7ZnQZjSuFHNjIiicKTFB967Rb-zBvl_/view?usp=sharing',
       },

       hearts: {
        type: Number,
        default: 5
       },

       tags: {
        type: String,
        enum: ['wine', 'jams', 'chocolates', 'cookies', 'cakes']  // TODO  AIM - Add appropriate tags here.
       }
    },
    {
      // this second object adds extra properties: `createdAt` and `updatedAt`    
      timestamps: true
    }
  );
  
  const Product = model("Product", productSchema);
  
  module.exports = Product;