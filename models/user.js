const mongoose = require("mongoose");
const global = require('../global');
/* const Design = require('./design');
const Product = require('./product');
const Comment = require('./comment'); */


const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: { type: String, required: true, unique: true, trim: true, minlength: 3, maxlength: 15 },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    userInfo: {
       name: String, surname: String, birthday: Date, nif: String, language: String,
       sex: String,  phone1: String, phone2: String, profession: String, clientNum: Number,
       phoneState: String, mailState: String, 
    },
    addressInfo: {
      block: String, extraAddress: String, flatNumber: String, floor: String, postalCode: String,
      provinceCode: String, provinceName: String, stairs: String, streetCode: String, streetName: String,
      streetNumber: String, townCode: String, townName: String, country: String
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
      contactMail: { type: String, unique: true },
      website: String,
      description: String,
      socialMedia: { twitter: String, facebook: String, linkedin: String, instagram: String, behance: String, pinterest: String }
    },
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment'}]
  }, {timestamps: true}
);

const User = mongoose.model("User", userSchema);

module.exports = User;