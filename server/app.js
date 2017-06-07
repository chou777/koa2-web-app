/**
 * @author zhouziyao@meituan.com
 * @description Webpakc Config use for dev and dist
 */

var Koa = require('koa');
var views = require('koa-views');
var serve = require('koa-static');
var mount = require('koa-mount');
var path = require('path');
var Routers = require('./routers');
var assetsHelper = require('./libs/assetsHelper');
var packageConfig = require('./libs/packageConfig');
var config = require('./config');

const env = process.env.NODE_ENV || 'development';
const clientPath = env === 'development' ? '../client' : 'client';
const app = new Koa();

// Assets Helper.
app.use(assetsHelper(packageConfig, path.join(__dirname, 'manifest.json'), config('assets')));

// Static files settings.
console.log(`${__dirname}/${clientPath}`);

app.use(mount('/assets', serve(`${__dirname}/${clientPath}`)));

// Template settings.
app.use(views(`${__dirname}/views`, {
  map: {
    html: 'ejs'
  }
}));

// Middleware Example.
app.use(async (ctx, next) => {
  const start = new Date();
  console.log('Middeware start.');
  await next();
  // 等待其他app.use 执行完毕会在接下去执行
  console.log('Middeware continue.');
  const ms = new Date() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
  console.log('Middeware end.');
});

// Router settings
app.use(Routers.routes()).use(Routers.allowedMethods());

// App on error.
app.on('error', function (err) {
  console.error('server error', err);
});

app.listen(packageConfig.port, () => console.log(`\n server started => localhost:${packageConfig.port}`));

export default app;
