let express = require('express');
let router = express.Router();

const Design = require('../models/design');
const User = require('../models/user');

const upload = require('../config/multer');
const util = require('util');
const global = require('../global');


router.get('/allProductTypes', (req, res, next) => {

    let products = global.PRODUCTS;

    res.status(200).json({
        message: "products in shopping cart",
        products: products
    });
});

//SEARCH PRODUCT BY NAME
router.get('/productType/:name', (req, res, next) => {
    
        let products = global.PRODUCTS;
        let name = req.params.name;

        products.forEach((element)=>{
            if(element.name === name){
                return res.status(200).json({
                    product: element
                }); 
            }
        });

        return res.status(200).json({
            message: "no product finded",
        });
    });

/**
 * CREATE A NEW PRODUCT
 */
router.post('/new', function(req, res, next) {
    console.log(`PRODUCT NEW `);
    console.log('body', req.body);
  
  let newProduct = new Product( {
    product: req.body.product,
    design: req.body.design,
    text: req.body.text, 
  } )

  newProduct.save((err, product) => {
    if (err) {
      return res.status(400).json({ message: err });
    } else {
        res.status(200).json({
            message: "product created",
            product: product
        });
    }
  });
})




 /**
  * Retrieve a list of products in shopping cart by id design 
  */
  router.get('/shoppingCart/:idUser', (req, res, next) => {
    
            let idUser = req.params.idUser;
            console.log(`ID-:::::::::->${util.inspect(idUser)}`);
    
                    User.findById(idUser)
                        .populate('shoppingCart')
                       .exec((err, products) => {
        
                        if (!products) {
                            res.status(401).json({
                                message: "Error, no shopping cart found!"
                            });
                        } else {
                            res.status(200).json({
                                message: "products in shopping cart",
                                products: products.shoppingCart
                            });
                        }
                    })
        });

  /**
  * Retrieve a list of products in orders by id design 
  */
  router.get('/orders/:idUser', (req, res, next) => {
    
            let idUser = req.params.idUser;
            console.log(`ID-:::::::::->${util.inspect(idUser)}`);
    
                    User.findById(idUser)
                        .populate('orders')
                       .exec((err, products) => {
        
                        if (!products) {
                            res.status(401).json({
                                message: "Error, no shopping cart found!"
                            });
                        } else {
                            res.status(200).json({
                                message: "products in shopping cart",
                                products: products.shoppingCart
                            });
                        }
                    })
        });

module.exports = router;