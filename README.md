# koay-res

[![npm package](https://nodei.co/npm/koay-res.png?downloads=true&downloadRank=true&stars=true)](https://www.npmjs.com/package/koay-res)

> Note: try to build a compatible express' response for koa2

---

## Installation

### Node >= 7.6

```bash
npm install --save koay-res
```

---

## Usage

```javascript
const compatRes = require('koay-res');
const Koa = require('koa');
const { middleware } = require('stylus');
const app = new Koa();
const fn = middleware( ... );

app.use(async (ctx, next) => {
  await new Promise((resolve, reject) => {
    fn(ctx.req, compatRes(ctx), (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
  await next();
});
```
