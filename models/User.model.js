const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: [true, 'Email is required.'],
      unique: true,
      lowercase: true,
      trim: true
    },
    role: {
      type: String,
      enum: ['admin', 'customer', 'moderator'],
      default: 'customer'
    },
    companyName: {
      type: String,
    },
    companySize: {
      type: String,
      enum: ['0-100', '101-1000', '1001-10000', '10000+']
    },
    password: {
      type: String,
      // required: [true, 'Password is required.']
    },
    basket: [{
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
    // this second object adds extra properties: `createdAt` and `updatedAt`    
    timestamps: true
  }
);

const User = model("User", userSchema);

module.exports = User;
