const express = require('express');
const router = express.Router();
const {isSignedIn} = require('../controllers/doctor_auth_controller');

router.use('/doctors', require('./doctor_auth'));
//isSignedIn
//authenticates whether jwt is set or not and whether jwt is valid or not
router.use('/patients',  require('./patient'));
router.use('/reports',  require('./report'));

module.exports = router;