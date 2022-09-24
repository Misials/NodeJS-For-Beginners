const express = require('express');
const { handleNewUser } = require('./../controllers/registerControler');

const router = express.Router();

router.post('/', handleNewUser);

module.exports = router;
