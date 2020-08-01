var _desc, _value, _class;

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
  var desc = {};
  Object['ke' + 'ys'](descriptor).forEach(function (key) {
    desc[key] = descriptor[key];
  });
  desc.enumerable = !!desc.enumerable;
  desc.configurable = !!desc.configurable;

  if ('value' in desc || desc.initializer) {
    desc.writable = true;
  }

  desc = decorators.slice().reverse().reduce(function (desc, decorator) {
    return decorator(target, property, desc) || desc;
  }, desc);

  if (context && desc.initializer !== void 0) {
    desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
    desc.initializer = undefined;
  }

  if (desc.initializer === void 0) {
    Object['define' + 'Property'](target, property, desc);
    desc = null;
  }

  return desc;
}

const Tour = require('../models/tourModel');
const APIFeatures = require('../utils/apiFeatures');
const { catchAsyncDecorator } = require('../utils/catchAsync');
const AppError = require('../utils/appError');

let TourController = (_class = class TourController {
  aliasTopTours(req, res, next) {
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage price';
    req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
    next();
  }

  getAllTours(req, res, next) {
    return _asyncToGenerator(function* () {
      // EXECUTE QUERY
      const features = new APIFeatures(Tour.find(), req.query).filter().sort().limitFields().paginate();
      const tours = yield features.query;

      // SEND RESPONSE
      res.status(200).json({
        status: 'success',
        results: tours.length,
        data: {
          tours
        }
      });
    })();
  }

  createTour(req, res, next) {
    return _asyncToGenerator(function* () {
      const newTour = yield Tour.create(req.body);

      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour
        }
      });
    })();
  }

  showTour(req, res, next) {
    return _asyncToGenerator(function* () {
      const tour = yield Tour.findById(req.params.id);

      if (!tour) {
        return next(new AppError('No tour found with that ID', 404));
      }

      res.status(200).json({
        status: 'success',
        data: {
          tour
        }
      });
    })();
  }

  updateTour(req, res, next) {
    return _asyncToGenerator(function* () {
      const tour = yield Tour.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
      });

      if (!tour) {
        return next(new AppError('No tour found with that ID', 404));
      }

      res.status(200).json({
        status: 'success',
        data: {
          tour: tour
        }
      });
    })();
  }

  destroyTour(req, res, next) {
    return _asyncToGenerator(function* () {
      const tour = yield Tour.findByIdAndDelete(req.params.id);

      if (!tour) {
        return next(new AppError('No tour found with that ID', 404));
      }

      res.status(204).json({
        status: 'success',
        data: null
      });
    })();
  }

  getTourStats(req, res, next) {
    return _asyncToGenerator(function* () {
      const stats = yield Tour.aggregate([{
        $match: {
          ratingsAverage: { $gte: 4.5 }
        }
      }, {
        $group: {
          _id: { $toUpper: '$difficulty' },
          numTours: { $sum: 1 },
          numRatings: { $sum: '$ratingsQuantity' },
          avgRating: { $avg: '$ratingsAverage' },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' }
        }
      }, {
        $sort: { avgPrice: 1 }
      }, { $match: { _id: { $ne: 'EASY' } } }]);

      res.status(200).json({
        status: 'success',
        data: {
          stats
        }
      });
    })();
  }

  getMonthlyPlan(req, res, next) {
    return _asyncToGenerator(function* () {
      const year = req.params.year * 1;

      const plan = yield Tour.aggregate([{
        $unwind: '$startDates'
      }, {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`)
          }
        }
      }, {
        $group: {
          _id: { $month: '$startDates' },
          numTourStarts: { $sum: 1 },
          tours: { $push: '$name' }
        }
      }, {
        $sort: { numTourStarts: -1 }
      }, {
        $addFields: {
          month: '$_id'
        }
      }, { $project: { _id: 0 } }, { $limit: 12 }]);

      res.status(200).json({
        status: 'success',
        data: {
          plan
        }
      });
    })();
  }
}, (_applyDecoratedDescriptor(_class.prototype, 'getAllTours', [catchAsyncDecorator], Object.getOwnPropertyDescriptor(_class.prototype, 'getAllTours'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'createTour', [catchAsyncDecorator], Object.getOwnPropertyDescriptor(_class.prototype, 'createTour'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'showTour', [catchAsyncDecorator], Object.getOwnPropertyDescriptor(_class.prototype, 'showTour'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'updateTour', [catchAsyncDecorator], Object.getOwnPropertyDescriptor(_class.prototype, 'updateTour'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'destroyTour', [catchAsyncDecorator], Object.getOwnPropertyDescriptor(_class.prototype, 'destroyTour'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'getTourStats', [catchAsyncDecorator], Object.getOwnPropertyDescriptor(_class.prototype, 'getTourStats'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'getMonthlyPlan', [catchAsyncDecorator], Object.getOwnPropertyDescriptor(_class.prototype, 'getMonthlyPlan'), _class.prototype)), _class);


module.exports = TourController;
