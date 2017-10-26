const mongoose = require('mongoose');
const User = require('./user');
const Design = require('./design');
const Schema = mongoose.Schema;

var commentSchema = new mongoose.Schema({
  creator: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  design: { type: Schema.Types.ObjectId, ref: 'Design', required: true },
  message: { type: String, required: true, minlength: 1, maxlength: 120 },
  likedBy: [{type: Schema.Types.ObjectId, ref: 'User'}]
},
{ timestamps: true });

const Comment = mongoose.model('Comment', commentSchema );

module.exports = Comment;
