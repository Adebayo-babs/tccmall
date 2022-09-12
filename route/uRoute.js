const express = require('express');

const router = express.Router();

const {landingPage, productView, viewDetails} = require('../controller/uController');

router.get('/', landingPage);
router.get('/products/:category', productView);
router.get('/details/:productid', viewDetails);

router.get('/', landingPage);

module.exports =  router;
