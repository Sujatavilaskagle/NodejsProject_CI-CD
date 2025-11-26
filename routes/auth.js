const express = require('express');
const router = express.Router();
const { register, login, getUserById, updateUser } = require('../controllers/authController');


router.post('/register', register);
router.post('/login', login);
router.get('/users/:id', getUserById);
router.put('/users/:id', updateUser);

module.exports = router;
