import Koa from 'koa';
import views from 'koa-views';
import serve from 'koa-static';
import mount from 'koa-mount';
import path from 'path';
import Routers from './routers';
import assetsHelper from './libs/assetsHelper';
import packageConfig from './libs/packageConfig';
import config from './config';

const app = new Koa();

// Assets Helper.
app.use(assetsHelper(packageConfig, path.join(__dirname, 'manifest.json'), config('assets')));

// Static files settings.
app.use(mount('/assets', serve(`${__dirname}/../client/`)));

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

export default app;
