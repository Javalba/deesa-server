let express = require('express');
let router = express.Router();

const Design = require('../models/design');
const Product = require('../models/product');
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
  
  let newProduct = new Product( {
    creator: req.body.creator,  
    productType: req.body.productType,
    design: req.body.design,
    text: req.body.text, 
    qty: req.body.qty,
    size:req.body.size
  });

  newProduct.save((err, product) => {
    if (err) {
      return res.status(400).json({ message: err });
    } else {
        res.status(200).json({
            message: "Added product to cart!",
            product: product
        });
    }
  });
})

/**
 * DELETE A PRODUCT AND REFERENCE
 */
router.delete('/:id', function(req, res, next) {
    
      let idProduct = req.params.id;
      
      Product.findById(idProduct, (err, product) => {
          console.log(product);
          if (err) {
              return next(err);
          } else {
              if(product){
                let idCreator = product.creator;
                User.update({ _id: idCreator }, { "$pull": { "shoppingCart": idProduct} }, { safe: true }, (err, elem) => {
                  if (err){ return next(err);} 
                    Product.findByIdAndRemove(idProduct, (err, product) => {
                        if (err) {
                            return next(err);
                        }
                        return res.json({
                            message: "Producto eliminado"
                        });
                    });
                });
              }
              else{
                  return next(new Error("User not found"));
                }

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