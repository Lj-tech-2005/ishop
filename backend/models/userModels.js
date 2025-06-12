const mongoose = require("mongoose");

// Define Shipping Address schema
const ShippingAddressSchema = new mongoose.Schema(
  {
    addressLine1: { type: String, required: true },
    addressLine2: { type: String },
    city: { type: String, required: true },
    contact: { type: String, default: null },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
  },
  { _id: false } // Disable _id for embedded schema
);

// Define User schema
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      // required: true,
      trim: true,
      minlength: 2,
    },
    lastName: {
      type: String,
      // required: true,
      trim: true,
      minlength: 2,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
    },
    profileImage: {
      type: String,
      default: '', // or a default image URL like '/profile.png'
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
    },
    phone: {
      type: String,
      unique: true,
      sparse: true, // if phone is optional, this avoids unique constraint errors on null
    },
    shipping_address: {
      type: [ShippingAddressSchema],
      default: [],
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  }
);

// Create and export the User model
const UserModel = mongoose.model("User", userSchema);
module.exports = UserModel;
