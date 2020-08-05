const User = require('../models/userModel');
const { catchAsyncFun } = require('../utils/catchAsync');

exports.getAllUsers = catchAsyncFun(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    status: 'success',
    data: { users },
  });
});

exports.createUser = async (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!',
  });
};
exports.showUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!',
  });
};
exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!',
  });
};
exports.destroyUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!',
  });
};
