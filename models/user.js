const mongoose = require("mongoose");
const global = require('../global');
const Design = require('./design');
const Product = require('./product');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: { type: String, required: true, unique: true, trim: true, minlength: 3, maxlength: 15 },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    userInfo: {
       name: String, surname: String, city: String, country: String, birthday: Date, 
    },
    addressInfo: {
       streetName: String 
    },
    avatarUrl: { type: String, default: '/images/avatar-default.png', },
    googleID: String,
    facebookID: String,
    role: { type: String, enum: global.ROLES, default: 'FAN' },
    paymentInfo: { method: String, creditCard: String },
    shoppingCart: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
    orders: [{ type: Schema.Types.ObjectId, ref: 'Product', delivered: Boolean }],

    designerInfo: {
      designs: [{ type: Schema.Types.ObjectId, ref: 'Design' }],
      contactMail: { type: String, required: true, unique: true },
      website: String,
      description: String,
      socialMedia: { twitter: String, facebook: String, linkedin: String, instagram: String, behance: String, pinterest: String }
    }
  }, {timestamps: true}
);

const User = mongoose.model("User", userSchema);

module.exports = User;