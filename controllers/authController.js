const User = require('../models/User');

// Sync user from Firebase to MongoDB
const syncUser = async (req, res) => {
  try {
    const { uid, name, email, phone, profilePicture } = req.body;

    let user = await User.findOne({ uid });

    if (user) {
      // Update existing user
      user = await User.findOneAndUpdate(
        { uid },
        { name, email, phone, profilePicture },
        { new: true }
      );
    } else {
      // Create new user
      user = await User.create({
        uid,
        name,
        email,
        phone: phone || '',
        profilePicture: profilePicture || ''
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get user profile
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findOne({ uid: req.user.uid });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Update user profile
const updateUserProfile = async (req, res) => {
  try {
    const { name, phone, profilePicture } = req.body;

    const user = await User.findOneAndUpdate(
      { uid: req.user.uid },
      { name, phone, profilePicture },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

module.exports = {
  syncUser,
  getUserProfile,
  updateUserProfile
};