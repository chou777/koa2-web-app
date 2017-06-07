/**
 * Assets Hepler.
 *
 */
const config = require('../config');

const relativePath = 'client';
const staticType = config('assets') || 'dev'; // dev,dist,cdn: default dev
const cdnPath = '/';

var manifestJson;
var host;
var port;
var helpers;

function getManifest(manifestPath) {
  if (staticType === 'dev') {
    return '';
  }
  /* eslint-disable global-require, import/no-dynamic-require */
  return require(manifestPath);
}


helpers = {
  script: function (file) {
    var filePath = '';
    switch (staticType) {
      case 'dev':
        filePath = `//${host}:${port}/assets/${file}.js`;
        break;
      case 'dist':
        if (Array.isArray(manifestJson[file])) {
          filePath = `/assets/${manifestJson[file][0]}`;
        } else {
          filePath = `/assets/${manifestJson[file]}`;
        }
        break;
      case 'cdn':
        if (Array.isArray(manifestJson[file])) {
          filePath = `${cdnPath}${manifestJson[file][0]}`;
        } else {
          filePath = `${cdnPath}${manifestJson[file]}`;
        }
        break;
      default:
        filePath = '/';
        break;
    }
    return `<script src="${filePath}"></script>`;
  },

  css: function (file) {
    var filePath = '';
    switch (staticType) {
      case 'dev':
        filePath = `//${host}:${port}/assets/${file}.css`;
        break;
      case 'dist':
        if (Array.isArray(manifestJson[file])) {
          filePath = `/assets/${manifestJson[file][1]}`;
        } else {
          filePath = `/assets/${manifestJson[file]}`;
        }
        break;
      case 'cdn':
        if (Array.isArray(manifestJson[file])) {
          filePath = `${cdnPath}${manifestJson[file][1]}`;
        } else {
          filePath = `${cdnPath}${manifestJson[file]}`;
        }
        break;
      default:
        filePath = '/';
        break;
    }
    return `<link rel="stylesheet" href="${filePath}">`;
  },

  /**
   * @path is an entry, e.g. app, or a relative path
   * @type is js or css
   */
  assetUrl: function (path, type) {
    var distPath;
    var prdPath;
    var fPath = '';

    switch (staticType) {
      case 'dev':
        fPath = helpers.formatUrl(path.replace(/^(\/|\.\/)*/, ''));
        break;
      case 'dist':
        distPath = `./${relativePath}/${path.replace(/^(\/|\.\/)*/, '')}`;
        if (manifestJson[distPath]) {
          fPath = helpers.formatUrl(manifestJson[distPath]);
        }
        break;
      case 'cdn':
        // webpack entry
        if (Array.isArray(manifestJson[path])) {
          // eslint-disable-next-line max-len
          fPath = `${cdnPath}${((type === 'js' || !type) ? manifestJson[path][0] : manifestJson[path][1])}`;
        }
        prdPath = `./src/${path.replace(/^(\/|\.\/)*/, '')}`;
        if (manifestJson[prdPath]) {
          fPath = `${cdnPath}${manifestJson[prdPath]}`;
        }
        break;
      default:
        fPath = '';
        break;
    }
    return fPath;
  },

  formatUrl: function (path) {
    var fPath = '';
    switch (staticType) {
      case 'dev':
        fPath = path ? `/assets/${path}` : '';
        break;
      case 'dist':
        fPath = path ? `/assets/${path}` : '';
        break;
      case 'cdn':
        fPath = path ? `${cdnPath}${path}` : '';
        break;
      default:
        fPath = '';
        break;
    }
    return fPath;
  }
};

module.exports = (packageConfig, manifestPath) => {
  manifestJson = getManifest(manifestPath);
  port = packageConfig.staticPort;
  return (ctx, next) => {
    host = ctx.header.host.replace(/:\d+/, '');
    Object.keys(helpers).forEach(function (key) {
      ctx.state[key] = helpers[key];
    });
    return next();
  };
};

