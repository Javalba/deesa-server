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



commentSchema.pre('save', function (next) {

  let newCommentId = this._id;

  var idCreator = new mongoose.Types.ObjectId(this.creator);
  var idDesign = new mongoose.Types.ObjectId(this.design);
  
        //INSERT COMMENT INTO USER DESIGN INFO
        User
        .findById(idCreator)
        .exec((err, user) => {
            if (err) {
                return next(err);
            } else {
                if (!user) {
                  var err = new Error('Error, user not find');
                  next(err);
                } else {
                    
                    user.comments.push(newCommentId);
                       
                    //Mongoose save is converted into either a MongoDB insert (for a new document) or an update.
                    user.save((err) => {
                        if (err) {
                            return next(err);
                        } else {
                            //INSERT COMMENT INTO A DESIGN 
                            //MongoDB update
                            Design.findById(idDesign)
                            .exec((err,design)=>{
                                if(err){
                                    return next(err);                                        
                                }else{
                                    Design.update({ _id: idDesign }, { "$push": { "comments": newCommentId} }, { safe: true }, (err, elem) => {
                                        if (err){ return next(err);}
                                        else{
                                          return next();
                                        } 
                                      });
                                }
                            })
                        }
                    });
                }
            }
        });
  });

module.exports =  mongoose.model('Comment', commentSchema );
