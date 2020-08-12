const User = require('../models/userModel');
const { catchAsyncFun } = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((k) => {
    if (allowedFields.includes(k)) {
      newObj[k] = obj[k];
    }
  });
  return newObj;
};

exports.getAllUsers = catchAsyncFun(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    status: 'success',
    data: { users },
  });
});

exports.updateMe = catchAsyncFun(async (req, res, next) => {
  // 1) Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError('This route cannot update passwords.', 400));
  }

  // 2) Update user data
  const filterFields = filterObj(req.body, 'name', 'email');
  const user = await User.findByIdAndUpdate(req.user.id, filterFields, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

exports.deleteMe = catchAsyncFun(async (req, res, next) => {
  // 1) Get user from token and set active property of user to false
  await User.findByIdAndUpdate(req.user.id, { active: false });
  // 2) Send response
  res.status('204').json({
    status: 'success',
    data: null,
  });
  // 3) Exclude inactive user from users list
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
