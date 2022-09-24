const express = require('express');
const { handleLogout } = require('../controllers/logoutControler');

const router = express.Router();

router.get('/', handleLogout);

module.exports = router;
