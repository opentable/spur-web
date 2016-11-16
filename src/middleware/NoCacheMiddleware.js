module.exports = function () {
  const NoCacheMiddleware = function (req, res, next) {
    res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.header('Pragma', 'no-cache');
    res.header('Expires', 0);

    next();
  };

  return NoCacheMiddleware;
};
