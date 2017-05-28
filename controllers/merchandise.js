var express = require('express');
var router = express.Router();
var User = require('../models/user')
var Merchandise = require('../models/merchandise')
var bcrypt = require('bcryptjs');
var csrf = require('csurf')

exports.itemPage = function(req, res, next) {
  Merchandise.find({
    _id: req.params.id
  }, function(err, doc) {
    if (err)
      throw err;
    if (req.session.users._id === doc[0].owner) {
      res.render('./userViews/itemPage', {
        title: 'My Listing',
        merchandise: doc,
        csrfToken: req.csrfToken()
      });
      console.log(doc)
    } else {
      res.render('./publicViews/itemPage', {
        title: 'Public Listings',
        merchandise: doc
      });
    }
  })
}
exports.listing = function(req, res, next) {
  Merchandise.find({}, function(err, doc) {
    if (err)
      throw err;
    console.log(doc)
    res.render('./publicViews/listing', {
      title: 'Listings',
      merchandise: doc
    });
  })
}
exports.deleteListing = function(req, res, next) {
  Merchandise.findByIdAndRemove(req.params.id, function(err, merc) {
    if (err)
      throw err;
    res.redirect('/dashboard')
    console.log(merc)
  });
}

exports.updateListing = function(req, res, next){
  Merchandise.findByIdAndUpdate(req.params.id,
    {$set: {
      itemName: req.body.itemName,
      description: req.body.description,
      price: req.body.price
    }
  }, {new: true}, function(err, merc){
    if(err) return handleError(err);
    console.log(merc)
    res.redirect('/listing/'+ req.params.id)
  })
}