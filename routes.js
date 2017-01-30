'use strict'

var router = require('express').Router();
var mongoose = require('mongoose');


var db = 'mongodb://127.0.0.1:27017/yellow';
mongoose.connect(db, function(err)  {
    if(err){
      console.log('Connection Error:' + err);
	  }
    else
        console.log("Connected");
});

var Business = require('./models/business');


// homepage
router.get('/', function(req, res, next) {
    // use mongoose to get all business in the database
    Business.find({},function(err, businesses) {
        // if there is an error retrieving, send the error.
        if (err)
            res.send(err);

        var pageData = {
          title: 'Yellow Pages',
          businesses: businesses
        }
        res.render('index', pageData);
    });
});

// create a business listing
router.post('/business/create', function(req, res, next){

    var business = {
      name: req.body.name,
      description: req.body.description,
      address: req.body.address,
      state: req.body.state
    }

    if(req.files){
      var logoFile = req.files.logo;
      var filePath = "./public/images/" + logoFile.name;console.log(logoFile);
      logoFile.mv(filePath, function(err) {
        if (err) {
          console.log(err);
          saveBusiness(business);
        }
        else {
          business.imgUrl = '/images/' + logoFile.name;
          saveBusiness(business);
        }
      });

    }else{
      saveBusiness(business);
    }

    function saveBusiness(body){
      Business.create(body, function(err, business) {
          if(err)
              res.send(err);
          res.redirect("/business/" + business._id);
      });
    }
});

// delete a business listing
router.post('/business/:id/delete', function(req, res, next) {
    var id = req.params.id;
    Business.remove({_id: id}, function(error){
      if(error)
        res.redirect('back');
      res.redirect("/");
    })
});

// update a business listing
router.post('/business/:id/update', function(req, res, next) {
    Business.findByIdAndUpdate(req.params.id, req.body, function(err , result) {
        if(err)
            return next(err);
        res.redirect("back");
    });
});


// business detail page
router.get('/business/:id', function(req, res, next){
    var id = req.params.id;
    Business.findById(id).exec(function (error, business) {
        if(error)
            next(error);

        var pageData = {
          title: 'Detail Page | ' + business.name,
          business: business
        }
        console.log(business);
        res.render('detail', pageData);

    });
});

//search business
router.get('/search', function(req, res, next){
    var query = req.query.query;
    var queryText = query;
    var regex = new RegExp(query, "ig");
    query     = { $or: [ { name: regex }, { state: regex } ] };
    Business.find(query).exec(function (error, businesses) {
        if(error)
            console.log(error);

        var pageData = {
          title: 'Listing Page | ' + query,
          query: queryText,
          businesses: businesses
        }
        res.render('listing', pageData);

    });
});

module.exports = router;
