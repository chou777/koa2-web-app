var Koa = require('koa');
var views = require('koa-views');
var serve = require('koa-static');
var mount = require('koa-mount');
var path = require('path');
var Routers = require('./routers');
var assetsHelper = require('./libs/assetsHelper');
var packageConfig = require('./libs/packageConfig');
var config = require('./config');

const app = new Koa();

// Assets Helper.
app.use(assetsHelper(packageConfig, path.join(__dirname, 'manifest.json'), config('assets')));

// Static files settings.
app.use(mount('/assets', serve(`${__dirname}/src/`)));

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
app.use(Routers.routes());

// App on error.
app.on('error', function (err) {
  console.error('server error', err);
});

app.listen(packageConfig.port, () => console.log(`server started => localhost:${packageConfig.port}`));

