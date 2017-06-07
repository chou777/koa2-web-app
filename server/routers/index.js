
/**
 * Index route
 */

const Router = require('koa-router');
const fs = require('fs');

const router = new Router();

// 动态取得Router Js
fs.readdirSync(`${__dirname}`).forEach((file) => {
  var requirePath = `./${file.replace('.js', '')}`;
  if (file !== 'index.js') {
    try {
      /* eslint-disable global-require, import/no-dynamic-require */
      require(requirePath)(router);
    } catch (e) {
      console.error(e);
    }
  }
});

router.get('/*', async (ctx, next) => {
  console.log('Router start.');
  await next();
});

router.get('/', async (ctx) => {
  await ctx.render('index', {
    title: 'Koa 2 Demo.',
    user: 'zhouziyao'
  });
});

module.exports = router;
