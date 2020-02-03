const jwt = require('koa-jwt');
const Router = require('koa-router');
const router = new Router({
  prefix: '/tags',
});

const { appSecret: secret } = require('../../config');
const tagsCtl = require('../controllers/tags');
const { getTagList, createTag, updateTag, getTagById, deleteTag } = tagsCtl;

// Authentication middleware
const auth = jwt({
  secret,
});

router.get('/', getTagList);
router.get('/:id', getTagById);
router.post('/', createTag);
router.put('/:id', auth, updateTag);
router.delete('/:id', auth, deleteTag);

module.exports = router;
