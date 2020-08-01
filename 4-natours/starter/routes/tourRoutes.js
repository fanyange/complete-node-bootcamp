const express = require('express');
require('@babel/register');
const TourController = require('../controllers/tourController');

const router = express.Router();

const tourController = new TourController();
// router.param('id', tourController.checkID);

router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours);

router.route('/tour-stats').get(tourController.getTourStats);
router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);

router
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.createTour);
router
  .route('/:id')
  .get(tourController.showTour)
  .patch(tourController.updateTour)
  .delete(tourController.destroyTour);

module.exports = router;
