const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const AppError = require('../utils/appError');
const User = require('../models/userModel');
const { catchAsyncDecorator } = require('../utils/catchAsync');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

class AuthController {
  @catchAsyncDecorator
  async protect(req, res, next) {
    // 1) Getting token and check of it's there
    const authData = req.headers.authorization;
    let token;
    if (authData && authData.startsWith('Bearer ')) {
      token = authData.split(' ')[1];
    }
    if (!token) {
      return next(new AppError('Access denied. You must log in first.'));
    }

    // 2) Verification token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // 3) Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return next(new AppError('User not found with that ID'));
    }

    // 4) Check if user changed password after the token was issued
    if (currentUser.changedPasswordAfter(decoded.iat)) {
      return next(
        new AppError(
          'Password is changed after the token was issued. Please log in again.'
        )
      );
    }

    // 5) set current user
    req.user = currentUser;
    next();
  }

  @catchAsyncDecorator
  async signup(req, res, next) {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
      passwordChangedAt: req.body.passwordChangedAt,
    });

    const token = signToken(newUser._id);

    res.status(201).json({
      status: 'success',
      token,
      data: { user: newUser },
    });
  }

  @catchAsyncDecorator
  async login(req, res, next) {
    const { email, password } = req.body;

    // 1) Check email and password exist
    if (!email || !password) {
      return next(new AppError('Please provide both email and password', 400));
    }

    // 2) Check if user exists && password is correct
    const user = await User.findOne({ email }).select('+password');

    // 3) If everything is ok, send toek to client
    if (!user || !(await user.authenticate(password))) {
      return next(new AppError('Incorrect email or password', 401));
    }

    const token = signToken(user._id);

    res.status(200).json({
      status: 'success',
      token,
    });
  }
}

module.exports = AuthController;
