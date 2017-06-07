

function api(router) {
  router.get('/midas/kepler/indexAction*', async (ctx) => {
    await ctx.render('index', {
      title: 'Koa 2 Demo.',
      user: 'zhouziyao'
    });
  });
}

module.exports = api;
