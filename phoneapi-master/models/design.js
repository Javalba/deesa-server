const mongoose = require('mongoose');
const User = require('./user');
const Comment = require('./comment');


var designSchema = new mongoose.Schema({
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

var Design = mongoose.model('Design', designSchema );

module.exports = Design;
