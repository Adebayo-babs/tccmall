require('dotenv').config();
const express = require('express'),
      mongoose = require('mongoose'),
      ejs = require('ejs'),
      session = require('express-session'),
      flash = require('connect-flash'),

      app = express();

      mongoose.connect(process.env.DB, {useNewUrlParser:true})

      app.set('view engine', 'ejs');
      app.use(express.urlencoded({extended:true}));

      // code ...



      // EXPRESS-SESSION MIDDLEWARE
      app.use(session({
        secret: 'secret',
        resave: true,
        saveUninitialized: true
      }));

      // CONNECT FLASH

      app.use(flash());

      app.use((req,res,next) => {
        res.locals.message = req.flash('message');
        res.locals.error_msg = req.flash('error_msg');
        next();
      });

      // WE IMPORT THE ROUTE FILES
      app.use('/', require('./route/uRoute'));
      app.use('/', require('./route/mRoute'));

app.listen(process.env.PORT || 2100, () => {
  console.log('Server started on port 2100');
});
