const express = require('express');
const {
  createSkill,
  getSkills,
  getSkill,
  getUserSkills,
  updateSkill,
  deleteSkill
} = require('../controllers/skillController');
const { authenticateUser } = require('../middleware/auth');

const router = express.Router();

router.route('/')
  .post(authenticateUser, createSkill)
  .get(getSkills);

router.route('/user')
  .get(authenticateUser, getUserSkills);

router.route('/:id')
  .get(getSkill)
  .put(authenticateUser, updateSkill)
  .delete(authenticateUser, deleteSkill);

module.exports = router;