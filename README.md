# Kepler Node


## Installation

* `yarn install`

## Start

* `npm run dev` or  npm run dev:client , npm run dev:serve two command line
* http://localhost:3001


## Test

* `npm test`


## Description

* `特点：No Callback !!!!! => 使用了ES7的Async Await 来处理异步同步取代了Callback，`



## Async Example
```
// await 回传必须是一个aysnc function 且返回必须是promise.
async function sleep(key, delay) {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      resolve({
        key: key,
        delay: delay
      });
    }, delay);
  })
}

router.get('/',  async (ctx) => {
  let list = {};
  let list.a = await sleep('a', 100);
  let list.b = await sleep('b', 100);
  let list.c = await sleep('c', 100);
  let list.d = await sleep('d', 100);
  return ctx.body = list;
});
```
