const mongoose = require('mongoose');
const User = require('./user');
const Design = require('./design');

const Schema = mongoose.Schema;

var productSchema = new mongoose.Schema({

/*   productType: [{ type: String, enum: global.PRODUCTS, required: true }],
  design: { type: Schema.Types.ObjectId, ref: 'Design', required: true },
  text: {type: String},
  qty: {type:Number},
  size: {type: String} */
  creator: { type: Schema.Types.ObjectId, ref: 'User', required: true },  
  productType: {
    name: {type: String, required: true},
    price: {type: Number, required: true},
    images: [String],
    description: String
  },
  design: { type: Schema.Types.ObjectId, ref: 'Design', required: true },
  text: String,
  qty: {type:Number, min: 1},
  size: {type: String}
},
{ timestamps: true });

productSchema.pre('save', function (next) {
  console.log(`SE METE AL PRE SAVE`);
  let newProductId = this._id;

  var idCreator = new mongoose.Types.ObjectId(this.creator);

  User
    .findById(idCreator)
    .exec((err, user) => {
      if (err) {
        return next(err);
      } else {
        if (user) {
            user.shoppingCart.push(newProductId);
            user.save((err) => {
              if (err) {
                return next(err);
              } else {
                next();
              }
            });
        } else {
          return next(new Error("User not found"));
        }
      }
    });
  });

module.exports = mongoose.model('Product', productSchema );
