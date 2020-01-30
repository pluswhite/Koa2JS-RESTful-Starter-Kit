const jwt = require('koa-jwt');
const Router = require('koa-router');
const router = new Router({
  prefix: '/users',
});

const { appSecret: secret } = require('../../config');
const usersCtl = require('../controllers/users');
const {
  getUserList,
  createUser,
  updateUser,
  getUserById,
  deleteUser,
  userLogin,
} = usersCtl;
// Authentication middleware
const auth = jwt({
  secret,
});

router.get('/', getUserList);
router.get('/:id', getUserById);
router.post('/', createUser);
router.put('/:id', auth, updateUser);
router.delete('/:id', auth, deleteUser);
router.post('/login', userLogin);

module.exports = router;
