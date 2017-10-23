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

  let password = req.body.password;
  let username = req.body.username;

  //console.log(`streetName ${streetName}`);
  if (!username || !password) {
    res.status(400).json({ message: "Provide username and password" });
    return;
  }

  User.findOne({ username:username }, "username", (err, user) => {
    if (user !== null) {
      res.status(400).json({ message: 'user exist' });
      return;
    }

    var salt     = bcrypt.genSaltSync(bcryptSalt);
    var hashPass = bcrypt.hashSync(password, salt);

    var newUser = new User({
      username: username,
      password: hashPass,
      email: req.body.email,
      userInfo: {
        name: req.body.name, 
        surname: req.body.surname
      },
      role: req.body.role
    });

    console.log(`newUser--> ${newUser}`);
    

    newUser.save((err, user) => {
      if (err) {
        return res.status(400).json({ message: err });
      } else {
        var payload = {id: user._id, user: user.username};
        var token = jwt.sign(payload, jwtOptions.secretOrKey);
       return res.status(200).json({message: "ok", token: token, user: user});
      	// res.status(200).json(user);
      }
    });
  });
});





module.exports = router;
