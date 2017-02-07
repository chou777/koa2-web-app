var packageConfig = require('../libs/packageConfig');

var config = {
  mock: false,

  // MemoryStore or RedisStore
  session: 'RedisStore',

  // enable or disable @fdd/route-cache
  cache: false,

  assets: 'cdn',

  redis: {
    prefix: `${packageConfig.prefix}:testing`,
    host: '127.0.0.1',
    port: 6379
  },

  routeCacheExpire: {
    200: 86400,
    302: 0,
    304: 86400,
    '4xx': 30,
    403: 30,
    '5xx': 30,
    xxx: 30
  }
};

module.exports = config;
