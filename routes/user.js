const express = require('express');
const router = express.Router();
const aws       = require('aws-sdk');
const multerS3  = require('multer-s3');

const User = require('../models/user');

const upload = require('../config/multer');
const util = require('util');
const path = require('path');

// Bcrypt let us encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

let s3 = new aws.S3();

router.get('/:username', (req, res, next) => {
    /**
     * toDo: same routes as account
     */
    let username = {
        "username": req.params.username
    }

    User.findOne(username, (err, user) => {
                if (!user) {
                    res.status(401).json({
                        message: "Error, no user found"
                    });
                } else {
        
                    //Only send relevant info. 
                    let account = {
                        id: user._id,
                        username: user.username,
                        email: user.email,
                        role: user.role,
                        avatarUrl: user.avatarUrl,
                        userInfo: {
                            name: user.userInfo.name,
                            surname: user.userInfo.surname,
                            birthday: user.userInfo.birthday
                        }
                    };
                    res.status(200).json({
                        message: "user info",
                        user: account
                    });
                }
            })
});

/**
 * VIEW USER ACCOUNT
 */
router.post('/account', (req, res, next) => {

    let username = {"username": req.body.username}

    User.findOne(username)
            .populate({path: 'designerInfo.designs', populate: {path: 'creator', select: 'username avatarUrl' }})               
            .exec((err, user) => { 

        //console.log(`user-->${user}`);
        if (!user) {
            res.status(401).json({
                message: "Error, no user found"
            });
        } else {
            res.status(200).json({ message: "user info", user});
        }
    })
});

/**
 * UPDATE ACCOUNT
 */
router.put('/account', (req, res, next) => {

    let username = req.body.username;

    let updates = {
        email: req.body.email,
        userInfo: {
            name: req.body.userInfo.name,
            surname: req.body.userInfo.surname,
            birthday: req.body.userInfo.birthday,
            phone1: req.body.userInfo.phone1 ,
            phone2: req.body.userInfo.phone2,
            profession: req.body.userInfo.profession
        }
    }
    

    //ToDo: FIX Profile validation
    //Separate findOneAndUpdate in two different ways:
    //FindOne & Update

    User.findOneAndUpdate({ "username" : username }, updates, {
        new: true
    }, (err, user) => {
        if (err) {
            next(err);
        } else {
            if (!user) {
                res.status(401).json({
                    message: "Error, no user found"
                });
            } else {
                //Only send relevant info. 
                let account = {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    role: user.role,
                    avatarUrl: user.avatarUrl,
                    userInfo: {
                        name: user.userInfo.name,
                        surname: user.userInfo.surname,
                        birthday: user.userInfo.birthday,
                        phone1:  user.userInfo.phone1,
                        phone2: user.userInfo.phone2,
                        profession: user.userInfo.profession
                    }
                };

                //console.log(`ACCOUNT-:::::::::->${util.inspect(account)}`);

                res.status(200).json({
                    message: "user updated",
                    user: account
                });
            }
        }
    });
});

/**
 * UPDATE PASSWORD ACCOUNT
 */
router.put('/account/password', (req, res, next) => {

    let username = req.body.username;
    let password = req.body.password;
    let oldPassword = req.body.oldPassword;

    User.findOne({
        "username": username
    }, (err, user) => {

        bcrypt.compare(oldPassword, user.password, function (err, isMatch) {

            if (!isMatch) {
                res.status(401).json({
                    message: "You have entered an invalid password"
                });
            } else {

                const salt = bcrypt.genSaltSync(bcryptSalt);
                const hashPass = bcrypt.hashSync(password, salt);

                update = {
                    password: hashPass
                }

                User.findOneAndUpdate(username, update, (err) => {
                    if (err) {
                        return next(err);
                    }
                });

                res.json({
                    message: "ok, password updated"
                });
            }
        });

    });
});

/**
 * UPDATE USER ADDRESS
 * 
 * NEXT UPGRADE: more routes --> router.put('/account/address/:id'
 */
router.put('/account/address', (req, res, next) => {
    let username = req.body.username;

    let updates = {
        addressInfo: {
            streetName: req.body.addressInfo.streetName,
            streetNumber: req.body.addressInfo.streetNumber,
            floor: req.body.addressInfo.floor,
            stairs: req.body.addressInfo.stairs,
            postalCode: req.body.addressInfo.postalCode,
            provinceName: req.body.addressInfo.provinceName,
            townName: req.body.addressInfo.townName,
            country: req.body.addressInfo.country
        }
    }

    User.findOneAndUpdate({ "username" : username }, updates, {
        new: true
    }, (err, user) => {
        if (err) {
            next(err);
        } else {
            if (!user) {
                res.status(401).json({
                    message: "Error, no user found"
                });
            } else {
                //Only send relevant info. 
                let address = {
                    id: user._id,
                    username: user.username,
                    role: user.role,
                    addressInfo: {
                        streetName: user.addressInfo.streetName,
                        streetNumber: user.addressInfo.streetNumber,
                        floor: user.addressInfo.floor,
                        stairs: user.addressInfo.stairs,
                        postalCode: user.addressInfo.postalCode,
                        provinceName: user.addressInfo.provinceName,
                        townName: user.addressInfo.townName,
                        country: user.addressInfo.country
                    }
                };

                res.status(200).json({
                    message: "user address updated",
                    user: address
                });
            }
        }
    });
});

/**
 * UPDATE USER AVATAR
 * 
 * NEXT UPGRADE: more routes --> router.put('/account/address/:id'
 */
router.put('/account/avatar', (req, res, next) => {

    let username = req.body.username;
    let updates = {avatarUrl: req.body.avatarUrl}

     User.findOneAndUpdate({ "username" : username }, updates, {
        new: true
    }, (err, user) => {
        if (err) {
            console.log(err);
            next(err);
        } else {
            if (!user) {
                res.status(401).json({
                    message: "Error, no user found"
                });
            } else {
                //Only send relevant info. 
                let avatarUrl = user.avatarUrl;

                res.status(200).json({
                    message: "user avatar updated",
                    avatarUrl: avatarUrl
                });
            }
        }
    }); 
});

/**
 * VIEW USER DESIGNER INFO
 */
router.post('/account/designer', (req, res, next) => {

    let username = req.body.username;

    User.findOne({
        "username": username
    }, (err, user) => {

        if (!user) {
            res.status(401).json({
                message: "Error, no user found or role "
            });
        } else {

            if (user.role != 'DESIGNER') {
                res.status(401).json({
                    message: "Error, user is not a designer role"
                })
            }

            //Only send relevant info of designer. 
            let account = {
                id: user._id,
                username: user.username,
                role: user.role,
                designerInfo: {
                    contactMail: user.designerInfo.contactMail,
                    website: user.designerInfo.website,
                    description: user.designerInfo.description,
                    socialMedia: {
                        twitter: user.designerInfo.socialMedia.twitter,
                        facebook: user.designerInfo.socialMedia.facebook,
                        linkedin: user.designerInfo.socialMedia.linkedin,
                        instagram: user.designerInfo.socialMedia.instagram,
                    }
                }
            };
            res.status(200).json({
                message: "design info",
                user: account
            });
        }
    })
});

/**
 * UPDATE USER ADDRESS
 * 
 * NEXT UPGRADE: more routes --> router.put('/account/address/:id'
 */
router.put('/account/designer', (req, res, next) => {
    let username = req.body.username;

    let updates = {
        designerInfo: {
            contactMail: req.body.designerInfo.contactMail,
            website: req.body.designerInfo.website,
            description: req.body.designerInfo.description,
            socialMedia: {
                twitter: req.body.designerInfo.socialMedia.twitter,
                facebook: req.body.designerInfo.socialMedia.facebook,
                linkedin: req.body.designerInfo.socialMedia.linkedin,
                instagram: req.body.designerInfo.socialMedia.instagram,
            }
        }
    };

    User.findOneAndUpdate(username, updates, {
        new: true
    }, (err, user) => {
        if (err) {
            next(err);
        } else {
            if (!user) {
                res.status(401).json({
                    message: "Error, no user found"
                });
            } else {
                //Only send relevant info. 
                let account = {
                    id: user._id,
                    username: user.username,
                    role: user.role,
                    designerInfo: {
                        contactMail: user.designerInfo.contactMail,
                        website: user.designerInfo.website,
                        description: user.designerInfo.description,
                        socialMedia: {
                            twitter: user.designerInfo.socialMedia.twitter,
                            facebook: user.designerInfo.socialMedia.facebook,
                            linkedin: user.designerInfo.socialMedia.linkedin,
                            instagram: user.designerInfo.socialMedia.instagram,
                        }
                    }
                };


                res.status(200).json({
                    message: "user designer info updated",
                    user: account
                });
            }
        }
    });
});

  /**
  * Retrieve a list of designs of an user
  */
  router.get('/account/designs/:idUser', (req, res, next) => {
    
            let idUser = req.params.idUser;

            User.findById(idUser)
                        .populate('designerInfo.designs')
                        .exec((err, user) => { 

        
                        if (!user) {
                            res.status(401).json({
                                message: "Error, user found!"
                            });
                        } else {
                            res.status(200).json({
                                message: "designs",
                                designs: user.designerInfo.designs
                            });
                        }
                    })
        });


          /**
  * Retrieve shopping cart
  */
  router.get('/account/cart/:idUser', (req, res, next) => {
    
            let idUser = req.params.idUser;

            User.findById(idUser)
                        .populate('shoppingCart')
                        .exec((err, user) => { 
        
                        if (!user) {
                            res.status(401).json({
                                message: "Error, user found!"
                            });
                        } else {
                            res.status(200).json({
                                message: "cart",
                                products: user.shoppingCart
                            });
                        }
                    })
        });




///// NEW ///

router.post('/avatar', upload.uploadAvatar.single('file'), (req, res, next) => {

  let oldImg = req.body.old_imgUrl;
  let imgToDelete = path.basename(req.body.old_imgUrl);

  let newImg = `https://s3.eu-central-1.amazonaws.com/deesa/avatars/${req.file.key}`;

   User.findByIdAndUpdate(req.body._id, {$set:{avatarUrl:newImg}}, {new: true}, 
   (err, user) => {
    if (err){ return next(err);} 
      s3.deleteObject({
      Bucket: 'deesa',
      Key: `avatars/${imgToDelete}`
    },function (err,data){})
    
        return res.json({
        message: 'Image successfully updated!'
        });
    });
  });  



module.exports = router;
