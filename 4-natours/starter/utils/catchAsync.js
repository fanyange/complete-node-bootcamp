exports.catchAsyncFun = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

exports.catchAsyncDecorator = (target, key, descriptor) => {
  const fn = descriptor.value;
  descriptor.value = function (req, res, next) {
    fn.apply(this, [req, res, next]).catch((err) => {
      console.log(
        `Just catch an error in async method ${target.constructor.name}#${key}`
      );
      next(err);
    });
  };
  return descriptor;
};
