const express = require('express');
const router = express.Router();
const {
    registerUser,
    authenticateUser,
    logoutUser,
} = require('../controllers/reg-auth-logout-controller');


router.post('/registration', registerUser);
router.post('/authentication', authenticateUser);
router.get('/logout', logoutUser);

module.exports = router;