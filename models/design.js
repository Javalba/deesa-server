const mongoose = require('mongoose');
const User = require('./user');

/* 
const Comment = require('./comment'); */

const Schema = mongoose.Schema;


var designSchema = new Schema({
  creator: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },   
  title: { type: String, required: true },
  designMainImg: { type: String, required: true },  
  designGallery: [{ type: String}],  
  description: {type: String, required: true},
  views: {type: String},
  likedBy: [{type: Schema.Types.ObjectId, ref: 'User'}],
  comments: [{type: Schema.Types.ObjectId, ref: 'Comment'}],
},
{ timestamps: true });



designSchema.pre('save', function (next) {
  console.log(`SE METE AL PRE SAVE`);
  let newDesignId = this._id;
  console.log(`newDesignId-->${newDesignId}`);

  var idCreator = new mongoose.Types.ObjectId(this.creator);

  User
    .findById(idCreator)
    .populate('designerInfo.designs')
    .exec((err, user) => {
      if (err) {
        return next(err);
      } else {

        if (user) {
          if (user.role !== 'DESIGNER') {

            var err = new Error('DESIGNER ROLE REQUIRED');
            next(err);

          } else {

            user.designerInfo.designs.push(newDesignId);

            user.save((err) => {
              if (err) {
                return next(err);
              } else {
                next();
              }
            });
          }

        } else {
          return next(new Error("User not found"));
        }

      }
    });
  });


var Design = mongoose.model('Design', designSchema );

module.exports = Design;
