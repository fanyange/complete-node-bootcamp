exports.catchAsyncFun = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

exports.catchAsyncDecorator = (target, key, descriptor) => {
  const fn = descriptor.value;
  descriptor.value = function (req, res, next) {
    fn.apply(this, [req, res, next]).catch(next);
    console.log('handle a request...');
  };
  return descriptor;
};
