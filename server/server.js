const Koa = require('koa');
const Router = require('@koa/router');
const cors = require('@koa/cors');
const getNewMessages = require('./model');

const app = new Koa();
const router = new Router();
const corsOptions = {};
const [corsOrigin] = process.argv.slice(2);
if (corsOrigin) corsOptions.origin = corsOrigin;

router.get('/messages/unread', (ctx) => {
  if (Math.random() < 0.5) {
    ctx.response.status = 500;
    return;
  }
  const messages = getNewMessages();
  ctx.response.body = { status: 'ok', timestamp: Date.now(), messages };
});

app.use(cors(corsOptions))
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(8088);
