var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var request = require('request');
var crypto = require("crypto");

const db = require('../config/model');
const config = require('../config/config')

// connection mongoose sur mlab
mongoose.connect(config.url,
  config.options,  error => {
    if (error) {
      console.error(error);
    } else {
      console.log('server is running on Musicall db');
    }
  });

  // encryptage du password
function hash(password) {
for (var i = 0; i < password.length; i++) {
  password = crypto.createHash('sha256').update(`${password}42`).digest('base64');
  }
  return password;
};


/* GET home page. */
router.get('/', (req, res, next) => {
  res.json({result : true});
});

// route SignIn avec encryptage , 
router.get('/signin', (req, res, next) => {
  console.log('signin');
  db.users.findOne({
    email: req.query.email,
    password: hash(req.query.password)
  }, (error, user) => {
    if (!user) {
      res.json({result: false, isUserExist: false});
    } else {
      res.json({result: true, isUserExist: true, user});
    }
  });
});

// route SignUp avec encryptage , vérifie si un loger est deja crée
router.post('/signup', (req, res) => {
  console.log(req.body)
  if (req.body.pseudo !== '' && req.body.email !== '') {
    var newUser = new db.users({
      pseudo: req.body.pseudo,
      email: req.body.email,
      password: hash(req.body.password)
    });
    newUser.save((error, user) => {
      res.json({result: true, user});
    });
  } else {
    console.error('erreur');
    res.json({result: false, error: 'Incorrect data'});
  }
});

// ajout d'un événement et enregistre ses coordonnées GoogleMap
router.post('/addEvent',  (req, res, next) => {
  console.log(req.body);
  var newEvent = new db.event({
    image: req.body.image,
    name: req.body.name,
    artist: req.body.artist,
    style: req.body.style,
    eventDate: req.body.eventDate,
    description: req.body.description,
    horaire: req.body.horaire,
    adresse: req.body.adresse,
    price: req.body.price,
    coord: {
      latitude: req.body.coord.latitude,
      longitude: req.body.coord.longitude
    }
  });
  newEvent.save((error, event) => {
    if (error) {
      console.error(error);
    } else {
      res.json({result: true, event});
    };
  });
});

//  affichage de tout les events de la bdd
router.get('/listEvent', (req, res, next) => {
  db.event.find((error, event) => {
    if (!event) {
      res.json({result: false, isEventExist: false});
    } else {
      res.json({result: true, isEventExist: true, event});
    }
  });
});

// enregistre les preferences du user 
router.post('/preference',  (req, res) => {
  console.log(req.body)
  db.users.findOneAndUpdate(
    {
      email: req.body.email
    },
    {
      preference: [
    req.body.preference 
  ]
}, {
  new: true
}, (error, user) => {
  if (error || !user) {
    console.error(error ? error : 'user not found');
  } else {
    console.log(user);
    res.json({
      result: true,
      user
    });
  };
});
});

module.exports = router;
