const express = require('express');
const { getAllUsers, getUser, postCreateUser, updateUser, deleteUser } = require('./../../controllers/userControler');

const router = express.Router();

router.route('/').get(getAllUsers).post(postCreateUser).put(updateUser).delete(deleteUser);

router.route('/:_id').get(getUser);

module.exports = router;
