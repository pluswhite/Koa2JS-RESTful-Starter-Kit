const Router = require('koa-router');
const router = new Router({
  prefix: '/users',
});

const usersCtl = require('../controllers/users');
const { index } = usersCtl;

router.get('/', index);

module.exports = router;
