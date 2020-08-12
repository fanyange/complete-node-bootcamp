const express = require('express');
const userController = require('../controllers/userController');
require('@babel/register');
const AuthController = require('../controllers/authController');

const authController = new AuthController();

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:resetToken', authController.resetPassword);
router.patch(
  '/updateMyPassword',
  authController.protect,
  authController.updatePassword
);

router.patch('/updateMe', authController.protect, userController.updateMe);
router.delete('/deleteMe', authController.protect, userController.deleteMe);

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);
router
  .route('/:id')
  .get(userController.showUser)
  .patch(userController.updateUser)
  .delete(userController.destroyUser);

module.exports = router;
