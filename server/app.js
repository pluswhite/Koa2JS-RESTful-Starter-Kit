const path = require('path');
const Koa = require('koa');
const static = require('koa-static');

const config = require('../config');
const routing = require('./routes');
const app = new Koa();

const { port } = config;

app.use(static(path.join(__dirname, '../public')));
app.use(async (ctx, next) => {
  await next();
});

routing(app);

app.listen(port, () => {
  console.log(`Server is running at port 3000`);
});
