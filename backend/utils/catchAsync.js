export default (fn) => (req, res, next) => {
  fn(req, res, next).catch((err) => {
    console.error('catchAsync caught error:', err);
    next(err);
  });
};
