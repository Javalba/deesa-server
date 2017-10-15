const express = require('express');
const router = express.Router();

const User = require('../models/user');

const upload = require('../config/multer');
const util = require('util');

// Bcrypt let us encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

router.get('/:username', (req, res, next) => {
    /**
     * toDo: same routes as account
     */
    let username = {
        "username": req.params.username
    }

    User.findOne(username, (err, user) => {
                //console.log(`user-->${user}`);
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

    /*  console.log(`REQ-:::::::::->${util.inspect(req.body)}`); */
    let username = {
        "username": req.body.username
    }

    User.findOne(username, (err, user) => {

        //console.log(`user-->${user}`);
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
 * UPDATE ACCOUNT
 */
router.put('/account', (req, res, next) => {
    console.log(`REQ-:::::::::->${util.inspect(req.body)}`);
    let username = req.body.username;
    console.log(`username-->${username}`);

    let updates = {
        email: req.body.email,
        userInfo: {
            name: req.body.userInfo.name,
            surname: req.body.userInfo.surname,
            birthday: req.body.userInfo.birthday,
        }
    }

    //console.log(`UPDATES-:::::::::->${util.inspect(updates)}`);
    //DUDA::::: Porque funciona si le paso username sin ser objeto?????
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
                //console.log(`user updated::::::::::::::::::::::-->${user}`);
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
    console.log(`REQ-:::::::::->${util.inspect(req.body)}`);

    let username = req.body.username;
    let password = req.body.password;
    let oldPassword = req.body.oldPassword;

    User.findOne({
        "username": username
    }, (err, user) => {

        bcrypt.compare(oldPassword, user.password, function (err, isMatch) {

            console.log(isMatch);
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

                console.log('user', user);
                res.json({
                    message: "ok, password updated"
                });
            }
        });

    });
});


/**
 * VIEW USER ADDRESS
 */
router.post('/account/address', (req, res, next) => {

    console.log(`REQ-:::::::::->${util.inspect(req.body)}`);
    let username = req.body.username;
    console.log(`username:${username}`);

    User.findOne({
        "username": username
    }, (err, user) => {

        console.log(`user-->${user}`);
        if (!user) {
            res.status(401).json({
                message: "Error, no user found"
            });
        } else {
            console.log('user', user);

            //Only send relevant info. 
            let account = {
                id: user._id,
                username: user.username,
                role: user.role,
                addressInfo: {
                    flatNumber: user.addressInfo.flatNumber,
                    floor: user.addressInfo.floor,
                    streetName: user.addressInfo.streetName,
                    streetNumber: user.addressInfo.streetNumber,
                    townName: user.addressInfo.townName,
                    country: user.addressInfo.country
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
 * UPDATE USER ADDRESS
 */
router.put('/account/address', (req, res, next) => {
    console.log(`REQ-:::::::::->${util.inspect(req.body)}`);
    let username = req.body.username;

    let updates = {
        addressInfo: {
            flatNumber: req.body.addressInfo.flatNumber,
            floor: req.body.addressInfo.floor,
            streetName: req.body.addressInfo.streetName,
            streetNumber: req.body.addressInfo.streetNumber,
            townName: req.body.addressInfo.townName,
            country: req.body.addressInfo.country,
        }
    }

    console.log(`UPDATES-:::::::::->${util.inspect(updates)}`);

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
                console.log(`user updated::::::::::::::::::::::-->${user}`);
                //Only send relevant info. 
                let address = {
                    id: user._id,
                    username: user.username,
                    role: user.role,
                    addressInfo: {
                        flatNumber: user.addressInfo.flatNumber,
                        floor: user.addressInfo.floor,
                        streetName: user.addressInfo.streetName,
                        streetNumber: user.addressInfo.streetNumber,
                        townName: user.addressInfo.townName,
                        country: user.addressInfo.country
                    }
                };

                console.log(`ACCOUNT-:::::::::->${util.inspect(address)}`);

                res.status(200).json({
                    message: "user address updated",
                    user: address
                });
            }
        }
    });
});



/**
 * VIEW USER PAYMENT
 */
router.post('/account/address', (req, res, next) => {

    console.log(`REQ-:::::::::->${util.inspect(req.body)}`);
    let username = req.body.username;
    console.log(`username:${username}`);

    User.findOne({
        "username": username
    }, (err, user) => {

        console.log(`user-->${user}`);
        if (!user) {
            res.status(401).json({
                message: "Error, no user found"
            });
        } else {
            console.log('user', user);

            //Only send relevant info. 
            let account = {
                id: user._id,
                username: user.username,
                role: user.role,
                addressInfo: {
                    flatNumber: user.addressInfo.flatNumber,
                    floor: user.addressInfo.floor,
                    streetName: user.addressInfo.streetName,
                    streetNumber: user.addressInfo.streetNumber,
                    townName: user.addressInfo.townName,
                    country: user.addressInfo.country
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
 * UPDATE USER ADDRESS
 * 
 * NEXT UPGRADE: more routes --> router.put('/account/address/:id'
 */
router.put('/account/address', (req, res, next) => {
    console.log(`REQ-:::::::::->${util.inspect(req.body)}`);
    let username = req.body.username;

    let updates = {
        addressInfo: {
            flatNumber: req.body.addressInfo.flatNumber,
            floor: req.body.addressInfo.floor,
            streetName: req.body.addressInfo.streetName,
            streetNumber: req.body.addressInfo.streetNumber,
            townName: req.body.addressInfo.townName,
            country: req.body.addressInfo.country,
        }
    }

    console.log(`UPDATES-:::::::::->${util.inspect(updates)}`);

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
                console.log(`user updated::::::::::::::::::::::-->${user}`);
                //Only send relevant info. 
                let address = {
                    id: user._id,
                    username: user.username,
                    role: user.role,
                    addressInfo: {
                        flatNumber: user.addressInfo.flatNumber,
                        floor: user.addressInfo.floor,
                        streetName: user.addressInfo.streetName,
                        streetNumber: user.addressInfo.streetNumber,
                        townName: user.addressInfo.townName,
                        country: user.addressInfo.country
                    }
                };

                console.log(`ACCOUNT-:::::::::->${util.inspect(address)}`);

                res.status(200).json({
                    message: "user address updated",
                    user: address
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
    console.log(`username:${username}`);

    User.findOne({
        "username": username
    }, (err, user) => {

        console.log(`user-->${user}`);
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

            console.log('user', user);

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
    console.log(`REQ-:::::::::->${util.inspect(req.body)}`);
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

    console.log(`UPDATES-:::::::::->${util.inspect(updates)}`);

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
                console.log(`user updated::::::::::::::::::::::-->${user}`);
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

                console.log(`ACCOUNT-:::::::::->${util.inspect(account)}`);

                res.status(200).json({
                    message: "user designer info updated",
                    user: account
                });
            }
        }
    });
});



router.get('/phones/:id', function (req, res, next) {

    var id = req.params.id

    Phone.findById(id, function (err, phone) {
        if (err) {
            res.json(err)
        } else {
            res.json(phone)
        }
    })
})

router.put('/phones/:id', function (req, res, next) {
    var id = req.params.id;
    var phoneToUpdate = {
        brand: req.body.brand,
        model: req.body.model,
        specs: req.body.specs,
        image: req.body.image || ''
    }

    Phone.findByIdAndUpdate(id, phoneToUpdate, function (err) {
        if (err) {
            res.json(err)
        } else {
            res.json({
                message: "updated"
            })
        }
    })
})

router.delete('/phones/:id', function (req, res, next) {
    var id = req.params.id

    Phone.remove({
        _id: id
    }, function (err) {
        if (err) {
            res.json(err);
        } else {
            res.json({
                message: "deleted"
            });
        }
    })
})


module.exports = router;
