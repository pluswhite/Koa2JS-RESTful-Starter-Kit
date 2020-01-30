const Router = require('koa-router');
const router = new Router({
  prefix: '/users',
});

const usersCtl = require('../controllers/users');
const {
  getUserList,
  createUser,
  updateUser,
  getUserById,
  deleteUser,
} = usersCtl;

router.get('/', getUserList);
router.get('/:id', getUserById);
router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;
