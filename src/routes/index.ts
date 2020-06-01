import koaRouter from 'koa-router';

const router = new koaRouter({
  prefix: '/api',
});

// TODO dynamic import modules
// const createRoutes = (app: Koa) => {
//   fs.readdirSync(__dirname).forEach((file) => {
//     if (file === 'index.js') {
//       return;
//     }

//     const route = require(`./${file}`).default;
//     app.use(route.routes()).use(route.allowedMethods());
//   });
// };

import home from './home';
import users from './users';
import answers from './answers';
import comments from './comments';
import questions from './questions';
import topics from './topics';

router.use(home.routes(), home.allowedMethods());
router.use(users.routes(), home.allowedMethods());
router.use(answers.routes(), home.allowedMethods());
router.use(comments.routes(), home.allowedMethods());
router.use(questions.routes(), home.allowedMethods());
router.use(topics.routes(), home.allowedMethods());

export default router;
