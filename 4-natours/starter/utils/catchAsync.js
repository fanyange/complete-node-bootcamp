exports.catchAsyncFun = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

exports.catchAsyncDecorator = (target, key, descriptor) => {
  const fn = descriptor.value;
  descriptor.value = function (req, res, next) {
    fn.apply(this, [req, res, next]).catch(next);
    console.log('Just catch an error in an asychronous function...');
  };
  return descriptor;
};
