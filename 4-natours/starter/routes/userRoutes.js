const express = require('express');
const userController = require('../controllers/userController');
require('@babel/register');
const AuthController = require('../controllers/authController');

const authController = new AuthController();

const router = express.Router();

router.post('/signup', authController.signup);

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
