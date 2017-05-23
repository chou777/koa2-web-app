var config = function (name) {
  // eslint-disable-next-line import/no-dynamic-require, global-require
  return require(`./${process.env.NODE_ENV || 'development'}`)[name];
};

module.exports = config;
