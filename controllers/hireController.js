const Hire = require('../models/Hire');
const Skill = require('../models/Skill');
const User = require('../models/User');

// Hire a skill
const hireSkill = async (req, res) => {
  try {
    const { skillId } = req.body;

    // Get skill details
    const skill = await Skill.findById(skillId);
    if (!skill) {
      return res.status(404).json({
        success: false,
        error: 'Skill not found'
      });
    }

    // Check if user is trying to hire themselves
    if (skill.userId === req.user.uid) {
      return res.status(400).json({
        success: false,
        error: 'You cannot hire your own skill'
      });
    }

    // Check if already hired
    const existingHire = await Hire.findOne({
      employerId: req.user.uid,
      skillId: skillId,
      status: 'active'
    });

    if (existingHire) {
      return res.status(400).json({
        success: false,
        error: 'You have already hired this skill'
      });
    }

    // Get employer info
    const employer = await User.findOne({ uid: req.user.uid });
    if (!employer) {
      return res.status(404).json({
        success: false,
        error: 'Employer not found'
      });
    }

    const hire = await Hire.create({
      employerId: req.user.uid,
      employerName: employer.name,
      employerEmail: employer.email,
      skillId: skillId,
      skillOwnerId: skill.userId,
      skillOwnerName: skill.userName,
      skillTitle: skill.title
    });

    res.status(201).json({
      success: true,
      data: hire
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get user's hires (as employer)
const getUserHires = async (req, res) => {
  try {
    const hires = await Hire.find({ employerId: req.user.uid })
      .populate('skillId')
      .sort({ hiredAt: -1 });

    res.status(200).json({
      success: true,
      count: hires.length,
      data: hires
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Remove hire
const removeHire = async (req, res) => {
  try {
    const hire = await Hire.findById(req.params.id);

    if (!hire) {
      return res.status(404).json({
        success: false,
        error: 'Hire not found'
      });
    }

    // Check if user owns the hire
    if (hire.employerId !== req.user.uid) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to remove this hire'
      });
    }

    await Hire.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

module.exports = {
  hireSkill,
  getUserHires,
  removeHire
};