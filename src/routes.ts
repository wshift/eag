import Koa from 'koa';
import Router from 'koa-router';
import { format } from 'date-fns';
import { getPrices } from './services/price-service';
import { getFormByType } from './services/form-service';
import { ALLOWED_FORM_TYPES } from './constants';

const routerOpts: Router.IRouterOptions = {
  prefix: '/api/v1',
};

const router: Router = new Router(routerOpts);

router.get('/prices', async (ctx: Koa.Context) => {
  const currentDay = format(new Date(), 'dd.MM.yyyy');
  const { date = currentDay, dateTo = currentDay, type = 'day' } = ctx.query;
  ctx.body = await getPrices({ date, dateTo, type });
});

router.post('/submit-form/:type', async (ctx: Koa.Context) => {
  const { type } = ctx.params;
  if (!ALLOWED_FORM_TYPES.includes(type)) {
    ctx.status = 400;
    ctx.body = {
      status: false,
      error: [`Allowed form types: ${ALLOWED_FORM_TYPES}`],
    };
    return;
  }
  const formFields = ctx.request.body;
  const formType = getFormByType(type);
  if (!formType) {
    ctx.status = 400;
    ctx.body = { status: false, error: ['Wrong form type provided'] };
  }
  const definedForm = new formType(formFields);
  const validationResult = await definedForm.validate(formFields);
  if (!validationResult.success) {
    ctx.status = 503;
    ctx.body = validationResult;
    return;
  }
  const submitResult = await definedForm.submit(formFields);
  if (!submitResult.success) {
    ctx.status = 503;
    ctx.body = submitResult;
    return;
  }
  ctx.body = submitResult;
});

export default router;
