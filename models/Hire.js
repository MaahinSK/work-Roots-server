const mongoose = require('mongoose');

const hireSchema = new mongoose.Schema({
  employerId: {
    type: String,
    required: true
  },
  employerName: {
    type: String,
    required: true
  },
  employerEmail: {
    type: String,
    required: true
  },
  skillId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Skill',
    required: true
  },
  skillOwnerId: {
    type: String,
    required: true
  },
  skillOwnerName: {
    type: String,
    required: true
  },
  skillTitle: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'cancelled'],
    default: 'active'
  },
  hiredAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Hire', hireSchema);