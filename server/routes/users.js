const Router = require('koa-router');
const router = new Router({
  prefix: '/users',
});

const usersCtl = require('../controllers/users');
const { getList } = usersCtl;

router.get('/', getList);

module.exports = router;
