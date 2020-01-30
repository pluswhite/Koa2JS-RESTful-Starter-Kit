const Router = require('koa-router');
const router = new Router({
  prefix: '/users',
});

const usersCtl = require('../controllers/users');
const { getList, createUser } = usersCtl;

router.get('/', getList);
router.post('/', createUser);

module.exports = router;
