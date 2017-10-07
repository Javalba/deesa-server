const mongoose = require('mongoose');
const User = require('./user');
const Design = require('./design');

var commentSchema = new mongoose.Schema({

  productType: { type: String, enum: global.PRODUCTS },
  design: { type: Schema.Types.ObjectId, ref: 'Design', required: true },
  text: {type: String},
  size: { type: String, enum: global.SIZES, default: 'No' },
  
},
{ timestamps: true });

const Product = mongoose.model('Product', commentSchema );

module.exports = Product;
