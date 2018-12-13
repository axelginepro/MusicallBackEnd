var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var request = require('request');
var crypto = require("crypto");

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

function hash(password) {
for (var i = 0; i < password.length; i++) {
  password = crypto.createHash('sha256').update(`${password}42`).digest('base64');
  }
  return password;
};


/* GET home page. */
router.get('/', function(req, res, next) {
  res.json({result : true});
});

router.get('/signin', (req, res, next) => {
  console.log('signin');
  db.users.findOne({
    email: req.query.email,
    password: hash(req.query.password)
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
      password: hash(req.body.password)
    });
    newUser.save(function(error, user) {
      res.json({result: true, user});
    });
  } else {
    console.error('erreur');
    res.json({result: false, error: 'Incorrect data'});
  }
});


router.post('/addEvent', function (req, res, next) {
  console.log(req.body);
  var newEvent = new db.event({
    image: req.body.image,
    name: req.body.name,
    artist: req.body.artist,
    style: req.body.style,
    eventDate: req.body.eventDate,
    description: req.body.description,
    adresse: req.body.adresse,
    price: req.body.price,
    coord: {
      latitude: req.body.latitude,
      longitude: req.body.longitude
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

router.get('/listEvent', (req, res, next) => {
  db.event.find((error, event) => {
    if (!event) {
      res.json({result: false, isEventExist: false});
    } else {
      res.json({result: true, isEventExist: true, event});
    }
  });
});

router.post('/traceme', function (req, res) {
  console.log(req.body.userId, req.body.lat, req.body.lon);
  db.users.findOneAndUpdate({
    _id: req.body.userId
  }, {
    $push: {
      tracelog: {
        lat: req.body.lat,
        lon: req.body.lon
      }
    }
  }, {
    new: true
  }, (error, user) => {
    if (error || !user) {
      console.error(error ? error : 'user not found');
    } else {
      console.log(user);
      res.json({
        result: true,
        tracelog: user.tracelog
      });
    };
  });
});

router.post('/preference', function (req, res) {
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
