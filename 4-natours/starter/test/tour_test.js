const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });
const assert = require('assert');
const mongoose = require('mongoose');
const Tour = require('../models/tour_model');

describe('Test Mongoose', function () {
  before(function () {
    mongoose
      .connect(process.env.DATABASE_LOCAL, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
      })
      .then(() => console.log('DB connection successful!'));
  });

  describe('.find()', function () {
    it('should return 11 documents', async function () {
      const tours = await Tour.find();
      assert.equal(tours.length, 11);
    });
  });

  describe('validate name', () => {
    it('should be >10 and <40', () => {
      const shorTour = new Tour({ name: 'hello' });
      const err1 = shorTour.validateSync();
      assert.ok(err1.errors.name);

      const longTour = new Tour({ name: '1234567890'.repeat(5) });
      const err2 = longTour.validateSync();
      assert.ok(err2.errors.name);

      const properTour = new Tour({ name: '1234567890'.repeat(3) });
      const err3 = properTour.validateSync();
      assert.ok(!err3.errors.name);
    });
  });

  describe('validate ratingsAverage', () => {
    it('should be >=1 and <=5', () => {
      let tour = new Tour({ ratingsAverage: -1 });
      let err = tour.validateSync();
      assert.match(err.errors.ratingsAverage.message, /must be above 1\.0/);

      tour = new Tour({ ratingsAverage: 6 });
      err = tour.validateSync();
      assert.match(err.errors.ratingsAverage.message, /must be below 5\.0/);

      tour = new Tour({ ratingsAverage: 4.5 });
      err = tour.validateSync();
      assert.ok(!err.errors.ratingsAverage);
    });
  });
});
