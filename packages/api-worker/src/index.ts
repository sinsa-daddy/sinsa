import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { handle } from 'hono/cloudflare-pages';
import feishu from './services/feishu';

const app = new Hono().basePath('/api-worker');

app.use(logger());

app.route('/feishu', feishu);

export const onRequest: PagesFunction<Env> = handle(app);
