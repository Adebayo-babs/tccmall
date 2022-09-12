const express = require('express');
const router = express.Router();

const {mSignup, mLogin, upload, mReg, mLoginPost, mDashboard, addPro, addProPost, viewPro, edit, editP, deleteP, logout} = require('../controller/mController');

router.get('/signup', mSignup);
router.get('/login', mLogin);
router.post('/signup', upload.single('image'), mReg);
router.post('/login', mLoginPost);
router.get('/dashboard', mDashboard);
router.get('/addPro', addPro);
router.post('/addPro', upload.single('image'), addProPost);
router.get('/viewPro', viewPro);
router.get('/edit/:r_id', edit);
router.post('/editP/:r_id', editP);
router.get('/delete/:r_id', deleteP);
router.get('/logout', logout);

module.exports = router;
