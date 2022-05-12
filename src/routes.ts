import * as Koa from 'koa';
import * as Router from 'koa-router';
// import getPrices from './services/PriceService';
import * as PriceService from './services/PriceService';

const routerOpts: Router.IRouterOptions = {
  prefix: '/api/v1',
};

const router: Router = new Router(routerOpts);

router.get('/prices', async (ctx: Koa.Context) => {
  ctx.body = await PriceService.getPrices();
});

router.post('/submit-form/feedback', async (ctx: Koa.Context) => {
  // TODO: put validation
  ctx.body = 'POST';
});

router.post('/submit-form/supply', async (ctx: Koa.Context) => {
  // TODO: to submit supply form
  ctx.body = 'POST';
});

router.post('/submit-form/connect', async (ctx: Koa.Context) => {
  // TODO: to submit supply new customer
  ctx.body = 'POST';
});

export default router;
