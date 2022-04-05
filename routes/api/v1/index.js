const express = require('express');
const router = express.Router();


router.use('/posts',require('./postApi.js'));
router.use('/users',require('./userApi.js'));


module.exports = router;