const mongoose = require('mongoose');
const crypto = require('crypto');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name'],
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    validate: {
      validator: validator.isEmail,
      message: 'Please provide a valid email',
    },
  },
  role: {
    type: String,
    enum: {
      values: ['user', 'admin', 'guide', 'lead-guide'],
      message: 'Role is either "user" or "admin" or "guide" or "lead-guide"',
    },
    default: 'user',
  },
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
  photo: String,
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      // This only works on CREATE and SAVE!!!
      validator: function (value) {
        return value === this.password;
      },
      message: 'Passwords are not the same',
    },
  },
  passwordChangedAt: Date,
  passwordResetDigest: String,
  passwordResetExpires: Date,
});

userSchema.methods.authenticate = async function (password) {
  return bcrypt.compare(password, this.password);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  const passwordChangedAtTimeStamp = parseInt(
    this.passwordChangedAt / 1000,
    10
  );
  return JWTTimestamp < passwordChangedAtTimeStamp;
};

userSchema.methods.createResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetDigest = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  console.log(resetToken, this.passwordResetDigest);

  return resetToken;
};

userSchema.pre('save', async function (next) {
  // Only run this function if password was actually modified.
  if (!this.isModified('password')) return next();

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // Delete passwordConfirm field
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre('save', function (next) {
  if (this.isNew || !this.isModified('password')) {
    return next();
  }
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
