const Skill = require('../models/Skill');
const User = require('../models/User');

// Create new skill
const createSkill = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      yearsOfExperience,
      hourlyCharge,
      availableDays,
      imageUrl
    } = req.body;

    // Get user info
    const user = await User.findOne({ uid: req.user.uid });
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    const skill = await Skill.create({
      title,
      description,
      category,
      yearsOfExperience,
      hourlyCharge,
      availableDays,
      imageUrl: imageUrl || '',
      userId: req.user.uid,
      userEmail: user.email,
      userName: user.name
    });

    res.status(201).json({
      success: true,
      data: skill
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get all skills (with filtering)
const getSkills = async (req, res) => {
  try {
    const { category, search, minExperience, maxExperience } = req.query;
    
    let query = { isActive: true };

    // Filter by category
    if (category && category !== 'all') {
      query.category = category;
    }

    // Search in title and description
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Filter by experience
    if (minExperience || maxExperience) {
      query.yearsOfExperience = {};
      if (minExperience) query.yearsOfExperience.$gte = parseInt(minExperience);
      if (maxExperience) query.yearsOfExperience.$lte = parseInt(maxExperience);
    }

    const skills = await Skill.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: skills.length,
      data: skills
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get single skill
const getSkill = async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);

    if (!skill) {
      return res.status(404).json({
        success: false,
        error: 'Skill not found'
      });
    }

    res.status(200).json({
      success: true,
      data: skill
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get user's skills
const getUserSkills = async (req, res) => {
  try {
    const skills = await Skill.find({ userId: req.user.uid }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: skills.length,
      data: skills
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Update skill
const updateSkill = async (req, res) => {
  try {
    let skill = await Skill.findById(req.params.id);

    if (!skill) {
      return res.status(404).json({
        success: false,
        error: 'Skill not found'
      });
    }

    // Check if user owns the skill
    if (skill.userId !== req.user.uid) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update this skill'
      });
    }

    skill = await Skill.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: skill
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Delete skill
const deleteSkill = async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);

    if (!skill) {
      return res.status(404).json({
        success: false,
        error: 'Skill not found'
      });
    }

    // Check if user owns the skill
    if (skill.userId !== req.user.uid) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to delete this skill'
      });
    }

    await Skill.findByIdAndDelete(req.params.id);

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
  createSkill,
  getSkills,
  getSkill,
  getUserSkills,
  updateSkill,
  deleteSkill
};