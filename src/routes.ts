import Koa from 'koa';
import Router from 'koa-router';
import { format } from 'date-fns';
import * as PriceService from './services/PriceService';
import { FeedbackForm, SupplyForm, ConnectForm } from './services/Forms';

const routerOpts: Router.IRouterOptions = {
  prefix: '/api/v1',
};

const router: Router = new Router(routerOpts);

router.get('/prices', async (ctx: Koa.Context) => {
  const currentDay = format(new Date(), 'dd.MM.yyyy');
  const { date = currentDay, dateTo = currentDay, type = 'day' } = ctx.query;
  ctx.body = await PriceService.getPrices({ date, dateTo, type });
});

router.post('/submit-form/:type', async (ctx: Koa.Context) => {
  const { type } = ctx.params;
  let form;
  switch (type) {
    case 'feedback':
      form = new FeedbackForm(ctx.request.body);
      break;
    case 'supply':
      form = new SupplyForm(ctx.request.body);
      break;
    case 'connect':
      form = new ConnectForm(ctx.request.body);
      break;
    default:
      throw new Error(`${type} is unsupported type`);
      return;
  }
  const { status, ...body } = await form.validateAndSubmit();
  ctx.status = status;
  ctx.body = body;
});

export default router;
