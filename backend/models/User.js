const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  accountType: {
    type: String,
    enum: ['User', 'Admin', 'Supervisor'],
    default: 'User'
  },
  accountNumber: { type: String, unique: true, immutable: true, required: true },
  balance: { type: Number, default: 0 },
  latestTransactionType: {
    type: String,
    enum: ['Send', 'Receive', 'Deposit', 'Withdrawal'],
    default: null
  },
  resetPasswordToken: { type: String },
  resetPasswordExpire: { type: Date },
  creationDate: {
    type: Number,
    default: () => Date.now(), 
  }
}, { timestamps: true });

// Exclude passwordHash when sending data back
userSchema.methods.toJSON = function () {
  const userObject = this.toObject();
  delete userObject.passwordHash;
  return userObject;
};

module.exports = mongoose.model('User', userSchema);
