import { Hono } from 'hono';
import { TemplateRouter, AuthRouter } from '@/src/api';
import { HTTPException } from 'hono/http-exception';
const PORT = 8080;
const app = new Hono();

app.route('/v1/api/template', TemplateRouter);
app.route('/v1/api/auth', AuthRouter);

app.onError(async (err, _c) => {
  if (err instanceof HTTPException) {
    return err.getResponse();
  }
  console.error(err.message);
  return new Response(`Internal Server Error ${err}`, {
    status: 500
  });
});

export default {
  port: PORT,
  fetch: app.fetch
};

console.log(`Listening on PORT ${PORT}`);
