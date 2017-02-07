var host;
var port;
var staticPrefix;
var staticType = 'dev';// dev,dist,cdn: default dev
var manifestJson;
var helpers;
var staticPath = '/';
function getManifest(manifestPath) {
  if (staticType === 'dev') {
    return '';
  }

  /* eslint global-require: 0 import/no-unresolved: 0 */
  return require(manifestPath);
}

helpers = {
  script: function(file) {
    var str = '';
    str = `<script src="//${host}:${port}/assets/${file}.js"></script>`;

    if (staticType === 'dev') {
    } else if (staticType === 'dist') {
      if (Array.isArray(manifestJson[file])) {
        str = `<script src="/assets/${staticPrefix}/${manifestJson[file][0]}"></script>`;
      } else {
        str = `<script src="/assets/${staticPrefix}/${manifestJson[file]}"></script>`;
      }
    } else {
      if (Array.isArray(manifestJson[file])) {
        // eslint-disable-next-line max-len
        str = `<script src="${staticPath}${staticPrefix}/${manifestJson[file][0]}"></script>`;
      } else {
        // eslint-disable-next-line max-len
        str = `<script src="${staticPath}${staticPrefix}/${manifestJson[file]}"></script>`;
      }
    }

    return str;
  },

  css: function(file) {
    var str = '';

    if (staticType === 'dev') {
      str = `<link rel="stylesheet" href="//${host}:${port}/assets/${file}.css">`;
    } else if (staticType === 'dist') {
      if (Array.isArray(manifestJson[file])) {
        str = `<link rel="stylesheet" href="/assets/${staticPrefix}/${manifestJson[file][1]}">`;
      }
    } else {
      if (Array.isArray(manifestJson[file])) {
        // eslint-disable-next-line max-len
        str = `<link rel="stylesheet" href="${staticPath}${staticPrefix}/${manifestJson[file][1]}">`;
      }
    }

    return str;
  },

  /**
   * @path is an entry, e.g. app, or a relative path
   * @type is js or css
   */
  assetUrl: function(path, type) {
    var testPath;
    var prdPath;

    if (staticType === 'dev') {
      return helpers.formatUrl(path.replace(/^(\/|\.\/)*/, ''));
    } else if (staticType === 'dist') {
      testPath = `./src/${path.replace(/^(\/|\.\/)*/, '')}`;

      if (manifestJson[testPath]) {
        return helpers.formatUrl(manifestJson[testPath]);
      }

      return '';
    } else if (staticType === 'cdn') {
      // webpack entry
      if (Array.isArray(manifestJson[path])) {
        // eslint-disable-next-line max-len
        return `${staticPath}${staticPrefix}/${((type === 'js' || !type) ? manifestJson[path][0] : manifestJson[path][1])}`;
      }

      prdPath = `./src/${path.replace(/^(\/|\.\/)*/, '')}`;

      if (manifestJson[prdPath]) {
        return `${staticPath}${staticPrefix}/${manifestJson[prdPath]}`;
      }

      return '';
    }

    return path;
  },

  formatUrl: function (path) {
    if (staticType === 'dev') {
      return path ? `/assets/${path}` : '';
    } else if (staticType === 'dist') {
      return path ? `/assets/${staticPrefix}/${path}` : '';
    } else if (staticType === 'cdn') {
      return path ? `${staticPath}${staticPrefix}/${path}` : '';
    }
    return '';
  }
};

module.exports = (config, manifestPath, type) => {
  port = config.staticPort;
  staticPrefix = config.staticPrefix;
  staticType = type || 'dev';
  manifestJson = getManifest(manifestPath);
  return (ctx, next) => {
    host = ctx.header.host.replace(/:\d+/, '');
    Object.keys(helpers).forEach(function(key) {
      ctx.state[key] = helpers[key];
    });

    return next()
  };
};