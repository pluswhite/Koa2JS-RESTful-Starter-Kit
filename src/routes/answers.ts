import jwt from 'koa-jwt';
import Router from 'koa-router';

import answersCtl from '../controllers/answers';
import config from '../config';

const router = new Router({
  prefix: '/questions/:questionId/answers',
});

const { secret } = config;

const {
  // login,
  create,
  update,
  find,
  findById,
  delete: del,
  checkAnswerExist,
  checkAnswerer,
} = answersCtl;

// auth middleware
const auth = jwt({ secret });

router.get('/', find);
router.post('/', auth, create);
router.get('/:id', checkAnswerExist, findById);
router.patch('/:id', auth, checkAnswerExist, checkAnswerer, update);
router.delete('/:id', auth, checkAnswerExist, checkAnswerer, del);

export default router;
