import * as Koa from 'koa';
import * as Router from 'koa-router';
import { format } from 'date-fns';
import * as PriceService from './services/PriceService';
import { FeedbackForm, SupplyForm, ConnectForm } from './entity/Forms';

const routerOpts: Router.IRouterOptions = {
  prefix: '/api/v1',
};

const router: Router = new Router(routerOpts);

router.get('/prices', async (ctx: Koa.Context) => {
  const currentDay = format(new Date(), 'dd.MM.yyyy');
  const { date = currentDay, dateTo = currentDay, type = 'day' } = ctx.query;
  ctx.body = await PriceService.getPrices({ date, dateTo, type });
});

router.post('/submit-form/feedback', async (ctx: Koa.Context) => {
  const feedbackForm = new FeedbackForm(ctx.request.body);
  const { status, ...body } = await feedbackForm.validateAndSubmit();
  ctx.status = status;
  ctx.body = body;
});

router.post('/submit-form/supply', async (ctx: Koa.Context) => {
  const supplyForm = new SupplyForm(ctx.request.body);
  const { status, ...body } = await supplyForm.validateAndSubmit();
  ctx.status = status;
  ctx.body = body;
});

router.post('/submit-form/connect', async (ctx: Koa.Context) => {
  const connectForm = new ConnectForm(ctx.request.body);
  const { status, ...body } = await connectForm.validateAndSubmit();
  ctx.status = status;
  ctx.body = body;
});

export default router;
