const mongoose = require('mongoose');
const User = require('./user');
const Design = require('./design');

const Schema = mongoose.Schema;

var commentSchema = new mongoose.Schema({

  productType: { type: String, enum: global.PRODUCTS, required: true },
  design: { type: Schema.Types.ObjectId, ref: 'Design', required: true },
  text: {type: String},
  qty: {type:Number}
  //size: { type: String, enum: global.SIZES, default: 'No' },
  
},
{ timestamps: true });

const Product = mongoose.model('Product', commentSchema );

module.exports = Product;
