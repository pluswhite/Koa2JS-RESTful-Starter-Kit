const jwt = require('koa-jwt');
const Router = require('koa-router');
const router = new Router({
  prefix: '/api/users',
});

const { appSecret: secret } = require('../../config');
const usersCtl = require('../controllers/users');
const {
  checkOwner,
  checkUserExist,
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
router.get('/:id', checkUserExist, getUserById);
router.post('/', createUser);
router.put('/:id', auth, checkOwner, updateUser);
router.delete('/:id', auth, checkOwner, deleteUser);
router.post('/login', userLogin);

module.exports = router;
