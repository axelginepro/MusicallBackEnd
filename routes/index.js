var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var request = require('request');

const db = require('../config/model');
const config = require('../config/config')


mongoose.connect(config.url,
  config.options,  error => {
    if (error) {
      console.error(error);
    } else {
      console.log('server is running on Musicall db');
    }
  });




/* GET home page. */
router.get('/', function(req, res, next) {
  res.json({result : true});
});

router.get('/signin', (req, res, next) => {
  console.log('signin');
  UserModel.findOne({
    email: req.query.email,
    password: req.query.password
  }, (error, user) => {
    if (!user) {
      res.json({result: false, isUserExist: false});
    } else {
      res.json({result: true, isUserExist: true});
    }
  });
});

router.post('/signup', function(req, res) {
  console.log(req.body)
  if (req.body.pseudo !== '' && req.body.email !== '' && req.body.password !== '') {
    var newUser = new db.users({
      pseudo: req.body.pseudo,
      email: req.body.email,
      password: req.body.password
    });
    newUser.save(function(error, user) {
      res.json({result: true, user});
    });
  } else {
    console.error('erreur');
    res.json({result: false, error: 'Incorrect data'});
  }
});

router.get('/markerEvent', function (req, res, next) {
  res.json({result : true});;
});

router.post('/addEvent', function (req, res, next) {
  console.log(req.body);
  var newEvent = new db.event({
    image: req.body.image,
    name: req.body.name,
    artist: req.body.artist,
    style: req.body.style,
    eventDate: req.body.event_date,
    description: req.body.description,
    adresse: req.body.adresse,
    price: req.body.price,
  });
  newEvent.save((error, event) => {
    if (error) {
      console.error(error);
    } else {
      res.json({result: true, event});
    };
  });
});

router.get('/listEvent', (req, res, next) => {
  db.event.find({
    image: req.query.image,
    artist: req.query.artist,
    style: req.query.style,
    event_date: req.query.event_date,
    lieu: req.query.lieu,
    price: req.query.price
  }, (error, event) => {
    if (!event) {
      res.json({result: false, isEventExist: false});
    } else {
      res.json({result: true, isEventExist: true});
    }
  });
});



module.exports = router;
