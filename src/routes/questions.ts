import jwt from 'koa-jwt';
import Router from 'koa-router';

import questionsCtl from '../controllers/questions';

const router = new Router({
  prefix: '/questions',
});
import config from '../config';

const { secret } = config;

const {
  // login,
  create,
  update,
  find,
  findById,
  delete: del,
  checkQuestionExist,
  checkQuestioner,
} = questionsCtl;

// auth middleware
const auth = jwt({ secret });

router.get('/', find);
router.post('/', auth, create);
router.get('/:id', checkQuestionExist, findById);
router.patch('/:id', auth, checkQuestionExist, checkQuestioner, update);
router.delete('/:id', auth, checkQuestionExist, checkQuestioner, del);

export default router;
