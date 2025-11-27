const express = require('express');
const {
  hireSkill,
  getUserHires,
  removeHire
} = require('../controllers/hireController');
const { authenticateUser } = require('../middleware/auth');

const router = express.Router();

router.post('/', authenticateUser, hireSkill);
router.get('/user', authenticateUser, getUserHires);
router.delete('/:id', authenticateUser, removeHire);

module.exports = router;