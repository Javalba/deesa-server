let express = require('express');
let router = express.Router();

const Design = require('../models/design');
const User = require('../models/user');

const upload = require('../config/multer');
const util = require('util');

/* GET users listing. */

router.get('/', function(req, res, next) {

    Design.find({}, function(err, designList) {
    if( err) {
      res.json(err)
    } else {
      res.status(200).json(designList);
    }
  })
});

/**
 * CREATE A NEW DESIGN
 */
router.post('/new', function (req, res, next) {
    /*     console.log(`DESIGNS NEW `);
        console.log('body', req.body); */

    let newDesign = Design({
        creator: req.body.creator, //id
        title: req.body.title,
        designMainImg: req.body.designMainImg, //toDo: multer image
        designGallery: req.body.designGallery, //array of images
        description: req.body.description,
        //image: `/uploads/${req.file.filename}` || ''
    });

    /*   Thing.pre('save', function(next){
        console.log("saving: %s (%s)", this.title, this.content)
        next()
      }) */


    newDesign.save(function (err) {
        if (err) {
            return res.json(err.message);
        } else {
            return res.json({
                message: "design created & disign inserted",
                design: newDesign
            });
        }
    })
})


router.get('/allDesigns', function(req, res, next) {
    
        console.log(`[SERVER] LLEGA ALLDESIGNS`);
        
          Design.find({}, function(err, designList) {
            if( err) {
              res.json(err)
            } else {
              res.status(200).json(designList);
            }
          })
        });

/**
 * VIEW A DESIGN
 * 
 * toRemove: Para que salga una ruta como esta 3887246-Meet-Wearly, en las rutas del client le paso como
 * parametros la ruta que yo me quiera montar. 
 * path: 'phones/:CustomId' , , como parametro le paso lo que me de la gana como string. 
 */
router.get('/:id', (req, res, next) => {

    let idDesign = req.params.id;

         console.log(`ID-:::::::::->${util.inspect(idDesign)}`);

         //POPULATE CREATOR?
            Design.findById(idDesign)
/*             .populate('creator')
 */            .populate({ path: 'creator', select: 'username avatarUrl' })
               .exec((err, design) => {

/*     Design.findById(idDesign, (err, design) => { */
                if (!design) {
                    res.status(401).json({
                        message: "Error, no design founssd"
                    });
                } else {
        
/*                     //Only send relevant info. 
                    let design = {
                        id: design._id,
                        designname: design.username,
                        email: design.email,
                        role: design.role,
                        avatarUrl: design.avatarUrl,
                        designInfo: {
                            name: design.designInfo.name,
                            surname: design.designInfo.surname,
                            birthday: design.designInfo.birthday
                        }
                    }; */
                    res.status(200).json({
                        message: "design info",
                        design: design
                    });
                }
            })
});



/**
 * EDIT A DESIGN
 */
router.put('/:id', function(req, res, next) {

    let idDesign = req.params.id;
    let designToUpdate = {
        title: req.body.title,
        designMainImg: req.body.designMainImg,
        designGallery: req.body.designGallery, // array of images, not only one.
        description: req.body.description,
      }
  
    Design.findByIdAndUpdate(idDesign, designToUpdate, function(err){
      if(err) {
        res.json(err);
      } else {
        res.json({message: "updated"});
      }
    })
  })


/**
 * DELETE A DESIGN
 */
router.delete('/:id', function(req, res, next) {

  let idDesign = req.params.id;

  console.log(`ENTRA EN DELETE`);
  
  console.log(`idDesign --> ${idDesign}`);
  
  Design.findById(idDesign, (err, design) => {
      if (err) {
          return next(err);
      } else {
          let idCreator = design.creator;
          User.update({ _id: idCreator }, { "$pull": { "designerInfo.designs": idDesign} }, { safe: true }, (err, elem) => {
            if (err){ return next(err);} 
              Design.findByIdAndRemove(idDesign, (err, design) => {
              if (err){ return next(err);} 
              return res.json({
                message: "design & id design user deleted"
            });
                    });
          });
      }
  });

})



module.exports = router;