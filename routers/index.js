const router = require('koa-router')();

// await 回传必须是一个aysnc function 且返回必须是promise.
async function sleep(key, delay) {
  return new Promise(function (resolve, reject) {
    try {
      setTimeout(function () {
        resolve({
          key: key,
          delay: delay
        });
      }, delay);
    } catch (err) {
      reject('error');
    }
  });
}

async function demo1Fun() {
  const list = [
    { key: 'a', delay: 50 },
    { key: 'b', delay: 50 },
    { key: 'c', delay: 50 },
    { key: 'd', delay: 50 }
  ];
  var output = [];
  for (let i = 0; i < list.length; i += 1) {
    const { key, delay } = list[i];
    const data = await sleep(key, delay);
    output.push(data);
  }
  return output;
}


router.get('/*', async (ctx, next) => {
  console.log('Router start.');
  await next();
});


router.get('/', async (ctx) => {
  await ctx.render('index', {
    title: 'Koa 2 Demo.',
    user: 'John'
  });
});

// 同步操作
router.get('/demo/1', async (ctx) => {
  var demo1 = {};
  var startTime = new Date().getTime();
  try {
    demo1 = await demo1Fun();
  } catch (err) {
    // 错误处理
    console.log(err);
  }
  const json = {
    title: 'demo1 同步操作',
    demo1: demo1,
    usedTime: `${new Date().getTime() - startTime}/ms`
  };
  ctx.body = JSON.stringify(json);
});

// 异步并发
router.get('/demo/2', async (ctx) => {
  var demo2 = {};
  var startTime = new Date().getTime();
  try {
    demo2 = await Promise.all([
      sleep('a', 50),
      sleep('b', 50),
      sleep('c', 50),
      sleep('d', 50)
    ]);
  } catch (err) {
    // 错误处理
    console.log(err);
  }

  const json = {
    title: 'demo2 异步并发',
    demo2: demo2,
    usedTime: `${new Date().getTime() - startTime}/ms`
  };
  ctx.body = JSON.stringify(json);
});


export default router;