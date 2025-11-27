const express = require('express');
const { syncUser, getUserProfile, updateUserProfile } = require('../controllers/authController');
const { authenticateUser } = require('../middleware/auth');

const router = express.Router();

router.post('/sync', syncUser);
router.get('/profile', authenticateUser, getUserProfile);
router.put('/profile', authenticateUser, updateUserProfile);

module.exports = router;