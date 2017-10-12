const express = require('express');
const router = express.Router();

/* const Phone = require('../models/phone'); */
const User = require('../models/user');
const upload = require('../config/multer');
const util = require('util');

router.get('/:username', (req, res, next) => {
/**
 * toDo: same routes as account
 */
});

router.post('/account', (req, res, next) => {
    console.log(`REQ-:::::::::->${util.inspect(req.body)}`);
    let username = req.body.username;

    let updates = { 
        email: req.body.email,
        userInfo: {
            name: req.body.userInfo.name,
            surname: req.body.userInfo.surname,
            birthday: req.body.userInfo.birthday,
        }
    }

    User.findOneAndUpdate({
        "username": username
    }, updates, (err, user) => {
        if (err) {
            next(err);
        } else {
            console.log(`user-->${user}`);
            if (!user) {
                res.status(401).json({
                    message: "Error, no user found"
                });
            } else {
                console.log('user', user);
                res.status(200).json({
                    message: "user updated",
                    user: user
                });
            }
        }
    });

/*     User.findOne({
        "username": username
    }, (err, user) => {

        console.log(`user-->${user}`);
        if (!user) {
            res.status(401).json({
                message: "Error, no user found"
            });
        } else {
            console.log('user', user);
            var profile = {
                id: user._id,
                user: user.username
            };
            res.status(200).json({
                message: "ok",
                user: user
            });
        }
    }) */


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
