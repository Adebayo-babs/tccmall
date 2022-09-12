const mongoose = require('mongoose');
const Merchant = require('../model/merchant');
const Product = require('../model/product');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
//const express = require('express');
//const session = require('express-session');
//const flash = require('connect-flash');
//const app = express();
//app.use(flash());

  let storage = multer.diskStorage({
    destination: (req, file, cb) => {
      //cb(null, 'uploads')
      cb(null, __dirname + '/uploads')
    },
    filename: (req, file, cb) => {
      cb(null, file.fieldname, '_' + Date.now())
    }
  });

  // let upload = multer({storage: storage});
  const upload = multer({storage: storage});

// display merchant signup page
const mSignup = (req, res) => {
  res.render('mSignup');
}

// display merchant login page
const mLogin = (req, res) => {
  res.render('mLogin');
}

// PROCESS MERCHANT SIGNUP page
const mReg = (req, res) => {
  const {fn, ln, phone, status, username, pass1, pass2} = req.body;
  let error = [];
  if(!fn || !ln || !phone || !status || !username || !pass1 || !pass2) {
    error.push({"msg": "Some fields are missing. Please fill all fields"});
  }

  if(pass1 !== pass2) {
    error.push({"msg": "Passwords do not match"});
  }

  if(error.length > 0) {
    res.render('mSignup', {error, fn, ln, phone, status, username, pass1, pass2})
  } else {
   //  res.send("We are good to go");
   // BELOW WE ENCRYPT OUR Password
   bcrypt.hash(pass1, 10, (error, hash) => {
     const newMerchant = new Merchant({
       fn,
       ln,
       phone,
       cacStatus:status,
       username,
       password:hash,
       image:{
         data:fs.readFileSync(path.join(__dirname+'/uploads/'+req.file.filename)),
         contentType: '/image/png'
       }
     })

     newMerchant.save((err) => {
       if(err){
         // console.log(err);
         // res.send("There was a problem saving into the DB");
         req.flash('error_msg', 'There was a problem saving into the database');
         res.redirect('/signup');
       } else {
         // res.send("Data Successfully Captured");
         req.flash('message', "Data successfully Captured. Now you can login");
        res.redirect('/login');
       }
     })
   })
  }
}

const mLoginPost = (req, res) => {
  // console.log(req.body);
  // res.send("Data Processing");

  const {username, password} = req.body;

  Merchant.findOne({username:username}, (error, result) => {
    if(error) {
      console.log(error);
      res.send("There's an issue. Trying to resolve it");
    }

    if(!result) {
      req.flash('error_msg', "Username does not exist");
      res.redirect('/login');
    } else {
      // WE COMPARE THE PASSWORD ENTERED WITH THE HASHED PASSWORD
      bcrypt.compare(password, result.password, (err, isVerified) => {
        if(err) {
          req.flash('error_msg', "Something uncommon has happened.");
          res.redirect('/login');
        }

        if(isVerified){
            req.session.merchant_id = result._id;
            req.session.username = result.username;

            res.redirect('/dashboard');
        } else {
          req.flash('error_msg', "Incorrect Password");
          res.redirect('/login');
        }

      })
    }
  })
}

const mDashboard = (req, res) => {
  if(!req.session.merchant_id && !req.session.username) {
    req.flash('error_msg', "Please login to access App");
    res.redirect('/login');
  } else {
    Merchant.findOne({username:req.session.username}, (err, result) => {
      if(result){
        res.render('dashboard', {merchant_id:req.session.merchant_id, username:req.session.username, r:result});
      }
    })
    // res.render('dashboard', {merchant_id:req.session.merchant_id, username:req.session.username});
  }
}

const addPro = (req, res) => {
  if(!req.session.merchant_id && !req.session.username) {
    req.flash('error_msg', "Please login to access App");
    res.redirect('/login');
  } else {
    res.render('add_product', {merchant_id:req.session.merchant_id, username:req.session.username})
  }
}

const addProPost = (req, res) => {
  const{productName, description, price, category,} = req.body;

  let error_message = [];

  if(!productName || !description || !price || !category) {
    error_message.push({"msg":"Some fields are missing. Please fill all fields"});
  }

  if(error_message.length > 0) {
    res.render('add_product', {merchant_id:req.session.merchant_id, username:req.session.username, error_message, productName, description, price, category})
  } else {
    const newProduct = new Product({
      productName,
      description,
      price,
      category,
      username:req.session.username,
      image:{
        data:fs.readFileSync(path.join(__dirname+'/uploads/'+req.file.filename)),
        contentType: '/image/png'
      }
    })

    newProduct.save((err) =>{
      if(err){
        req.flash('error_msg',"There was a problem saving into the database");
        res.redirect('/addPro');
      } else {
        req.flash('message',"Data successfully Captured. Now you can login");
        res.redirect('/addPro');
      }
    })
  }
}

const viewPro = (req, res) => {
  if(!req.session.merchant_id && !req.session.username) {
    req.flash('error_msg',"Please login to access App");
    res.redirect('/login');
  } else {
    Product.find({username:req.session.username}, (err, result) => {
      if(err) {
        req.flash('error_msg',"Could not select from database");
        res.redirect('/viewPro');
      }

      if(result) {
        res.render('view_product', {result, username:req.session.username, merchant_id:req.session.merchant_id});
      }
    })
  }
}

const edit = (req, res) => {
  if(!req.session.merchant_id && !req.session.username) {
    req.flash('error_msg',"Please login to access App");
    res.redirect('/login');
  } else {
    Product.findOne({_id:req.params.r_id}, (err, result) =>{
      res.render('edit',{result});
    })
  }
}

const editP = (req, res) => {
  const {productName, description, price, category} = req.body;
  Product.updateOne({_id:req.params.r_id}, {$set:{productName, description, price, category}}, (err)=>{
    if(err){
      res.send("Update wasn't Succeful");
    } else {
      req.flash("message","Product updated Succefully");
      res.redirect('/viewPro')
    }
  })
}

const deleteP = (req, res) => {
  Product.deleteOne({_id:req.params.r_id}, (err) => {
    if(err){
      res.flash("error_msg","Could not delete");
      console.log(err);
    } else {
      res.redirect("/viewPro");
    }
  })
}

const logout = (req, res) => {
  res.redirect('/login');
}

module.exports = ({
  mSignup,
  mLogin,
  upload,
  mReg,
  mLoginPost,
  mDashboard,
  addPro,
  addProPost,
  viewPro,
  edit,
  editP,
  deleteP,
  logout
})
