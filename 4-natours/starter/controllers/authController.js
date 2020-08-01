const User = require('../models/userModel');
const { catchAsyncDecorator } = require('../utils/catchAsync');

class AuthController {
  @catchAsyncDecorator
  async signup(req, res, next) {
    const newUser = await User.create(req.body);

    res.status(201).json({
      status: 'success',
      data: { user: newUser },
    });
  }
}

module.exports = AuthController;
