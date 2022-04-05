const express = require('express');
const router = express.Router();


router.use('/',require('./v1/index.js'));


module.exports = router;