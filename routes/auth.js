var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var jwtOptions = require('../config/jwtoptions');
const passport   = require('../config/passport');

// Our user model
const User           = require("../models/user");

// Bcrypt let us encrypt passwords
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;


router.post("/login", function(req, res) {

  if(req.body.username && req.body.password){
    var username = req.body.username;
    var password = req.body.password;
  }

  if (username === "" || password === "") {
    res.status(401).json({message:"fill up the fields"});
    return;
  }

  User.findOne({ "username": username }, (err, user)=> {

  	if( ! user ){
	    res.status(401).json({message:"You have entered an invalid username or password"});
	  } else {
      bcrypt.compare(password, user.password, function(err, isMatch) {
        console.log(isMatch);
        if (!isMatch) {
          res.status(401).json({message:"You have entered an invalid username or password"});
        } else {
        	console.log('user', user);
          var payload = {id: user._id, user: user.username};
          var token = jwt.sign(payload, jwtOptions.secretOrKey);
          console.log(token)
          res.json({message: "ok", token: token, user: user});
        }
      });
    }
  })
});

router.get("/token", passport.authenticate('jwt', { session: false }), (req, res, next) => {
	res.json({ok:'ok'});
})

router.post("/signup", (req, res, next) => {

// Destructure the body
    let { username, password, email,avatarUrl,googleId,facebookID,role,shoppingCart} = req.body;
    
    let { name, surname, birthday, nif, language,
         sex, phone1, phone2, profession, clientNum,
         phoneState, mailState
        } = req.body.userInfo;

    let { block, extraAddress, flatNumber, floor, postalCode,
         provinceCode, provinceName, stairs, streetCode, streetName,
         streetNumber, townCode, townName, country
        } = req.body.addressInfo;
    
    let { method,creditCard}  = req.body.paymentInfo;
    
    let { designs,contactMail,website,description,
          socialMedia: {
            twitter,facebook,linkedin,instagram
          }
        } = req.body.designerInfo;

    //console.log(`streetName ${streetName}`);
  if (!username || !password) {
    res.status(400).json({ message: "Provide username and password" });
    return;
  }

  User.findOne({ username }, "username", (err, user) => {
    if (user !== null) {
      res.status(400).json({ message: 'user exist' });
      return;
    }

    var salt     = bcrypt.genSaltSync(bcryptSalt);
    var hashPass = bcrypt.hashSync(password, salt);

    var newUser = User({
      username,
      password: hashPass,
      email,
      userInfo: {
        name, surname, birthday, nif, language,
        sex, phone1, phone2, profession, clientNum,
        phoneState, mailState
      },
      addressInfo:{
        block, extraAddress, flatNumber, floor, postalCode,
        provinceCode, provinceName, stairs, streetCode, streetName,
        streetNumber, townCode, townName, country
      },
      avatarUrl,googleId,facebookID,role,
      paymentInfo:{
        method,creditCard
      },
      designerInfo:{
        contactMail,website,description,
        socialMedia: {
          twitter,facebook,linkedin,instagram
        }
      }
    });

    console.log(`newUser--> ${newUser}`);
    

    newUser.save((err, user) => {
      if (err) {
        res.status(400).json({ message: err });
      } else {
        var payload = {id: user._id, user: user.username};
        var token = jwt.sign(payload, jwtOptions.secretOrKey);
        res.status(200).json({message: "ok", token: token, user: user});
      	// res.status(200).json(user);
      }
    });
  });
});





module.exports = router;
