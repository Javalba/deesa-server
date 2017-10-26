let express = require('express');
let router = express.Router();

const Design = require('../models/design');
const User = require('../models/user');
const Comment = require('../models/comment');


const upload = require('../config/multer');
const util = require('util');
const assert = require('assert');

/**
 * CREATE A NEW COMMENT
 * Se me ocurre hacer findbyid antes y hacer todas las validaciones y asignar variables flag con true
 * Si todas las variables son true entonces hacer el save y los updates.
 */
router.post('/new', function(req, res, next) {
    console.log(`COMMENT NEW `);
    console.log('body', req.body);
  
  let newComment = new Comment( {
    creator: req.body.creator, //id
    design: req.body.design,
    message: req.body.message,
  } );

  //Save new comment
  newComment.save(function (err) {

    console.log(`ENTER SAVE CREATE COMMENT`);
   let idDesign =  req.body.design;
   let idUser = req.body.creator;


/*     let error = newComment.validateSync(); //si algun campo falla entonces lanza error.
    console.log(`error.errors-->${error.errors}`);
    try {   
   //console.log(`error validateSync${error}`);
       assert.equal(err.errors['message'].message,
       'ngth: 1, maxlength: 15'); 
     }
     catch (e) {
        // statements to handle any exceptions
        console.log(e); // pass exception object to error handler
     } */

    if (err) {
        res.json(err);
    } else {
        //INSERT COMMENT INTO USER DESIGN INFO
        User
            .findById(idUser)
            .exec((err, user) => {
                console.log(`ENTER EXEC`);
                if (err) {
                    return next(err);
                } else {
                    if (user.role !== 'DESIGNER') { // FAN cannot comment
                        res.status(401).json({
                            message: "DESIGNER ROLE REQUIRED",
                        });
                    } else {
                        console.log(`user  after push ----------------> ${user.designerInfo.comments}`);
                        user.designerInfo.comments.push(newComment._id);
                        console.log(`user  before push----------------> ${user.designerInfo.comments}`);
                        
                        
                        //Mongoose save is converted into either a MongoDB insert (for a new document) or an update.
                        user.save((err) => {
                            if (err) {
                                return next(err);
                            } else {

                                //INSERT COMMENT INTO A DESIGN 
                                //MongoDB update
                                console.log(`user  after update ----------------> ${user.designerInfo.designs}`);
                                Design.findById(idDesign)
                                .exec((err,design)=>{
                                    if(err){
                                        return next(err);                                        
                                    }else{
                                        Design.update({ _id: idDesign }, { "$push": { "comments": newComment._id} }, { safe: true }, (err, elem) => {
                                            if (err){ return next(err);}
                                            else{
                                                res.json({
                                                    message: "comment created & comment inserted",
                                                    comment: newComment
                                                });
                                            } 
       
                                          });

/*                                         design.comments.push(newComment._id);
                                        design.save((err) => {
                                            if (err) {
                                                return next(err);
                                            } else {
                                                console.log(`user  after update ----------------> ${user.designerInfo.designs}`);
                
                                                res.json({
                                                    message: "comment created & comment inserted",
                                                    comment: newComment
                                                });
                                            }
                                        }); */


                                    }
                                })
                            }
                        });
                    }
                }
            });
            //Si todo sale bien crear el comment, si alguna de las referencias de arriba devuelve un error entonces cancelar o forzar a un error (como se hace eso??)
    }
})
})


 /**
  * Retrieve a list of comments by an id design
  */
  router.get('/design/:id', (req, res, next) => {

        let idDesign = req.params.id;
        console.log(`ID-:::::::::->${util.inspect(idDesign)}`);

                Design.findById(idDesign)
                    .populate('comments')
                   .exec((err, design) => {
    
                    if (!design) {
                        res.status(401).json({
                            message: "Error, no design found!"
                        });
                    } else {
                        res.status(200).json({
                            message: "comments by an id",
                            comments: design.comments
                        });
                    }
                })
    });


    

/**
 * EDIT A COMMENT - ADDING LIKES
 * When user clicks like in a comment. We need id of comment and an id of this user.
 */
router.patch('/likes/:idComment/:idUser', function(req, res, next) {
    
        let idComment = req.params.idComment;
        let idUser = req.params.idUser;

        Comment.findById(idComment)
        .exec((err,comment)=>{
            if(err){
                return next(err);                                        
            }else{

                User.findById(idUser)
                .exec((err,user)=>{
                    if(err) return next(err);
                    else{
                        //$addToSet adds a value to an array unless the value is already present, in which case does nothing to that array.
                        Comment.update({ _id: idComment }, { "$addToSet": { "likedBy": idUser}}, (err, elem) => {
                            if (err){ return next(err);}
                            else{
                                res.json({
                                    message: "like inserted",
                                });
                            } 
                          });
                    }
                });
            }
        });
      });
      
      
/**
 * DELETE A COMMENT and references: user & design
 */
router.delete('/:id', function(req, res, next) {
    
      let idComment = req.params.id;
      console.log(`ENTRA EN DELETE idDesign --> ${idComment}`);
      
      Comment.findById(idComment, (err, comment) => {
          if (err) {
              return next(err);
          } else {
              console.log(`comment ${JSON.stringify(comment)}`);
              let idCreator = comment.creator;
              let idDesign = comment.design;

              //delete user reference 
              User.update({ _id: idCreator }, { "$pull": { "designerInfo.comments": idComment} }, { safe: true }, (err, elem) => {
                if (err){ return next(err);}

                else{
                    //delte design reference
                    Design.update({ _id: idDesign }, { "$pull": { "comments": idComment} }, { safe: true }, (err, elem) => {
                        if (err){ return next(err);}
                        else{
                            Comment.findByIdAndRemove(idComment, (err, design) => {
                                if (err){ return next(err);} 
                                return res.json({
                                  message: "design & id design user deleted"
                                });
                            });
                        } 

                    });
                } 
              });
          }
      });
    })
module.exports = router;