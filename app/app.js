const Koa = require('koa');

const app = new Koa();

app.use(async () => {
  console.log('Hello World!');
});

app.listen(3000, () => {
  console.log(`Server is running at port 3000`);
});
