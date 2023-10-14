import { Elysia } from "elysia";
import { CustomError } from './custom-errors';

const app = new Elysia();

app
  .error({
    BadRequest: CustomError, // handle custom errors
  })
  .onError(({ code, error, set }) => {
    if (code === 'BadRequest') {
      set.status = 400;
      return `Bad Request: ${error.message}`;
    }

    set.status = 500;
    return `${error}`;
  })
  .get("/", () => {
    return 'hello world';
  })
  .get('/posts/:id', ({ params }) => {
    const { id } = params;

    return {
      id,
      title: 'test post',
      body: 'test body',
    };
  })
  .get('/posts', () => {
    return [{
      id: '1',
      title: 'first post',
      body: 'first post body'
    }, {
      id: '2',
      title: 'second post',
      body: 'second post body'
    }];
  })
  .post('/posts', (ctx) => {
    const { body } = ctx;
    return body;
  })
  .get('/users/*', () => {
    return 'anywhere on /users';
  })
  .get('/context', (ctx) => {
    const { set } = ctx;
    set.status = 200;

    return 'success';
  })
  .get('/error', (ctx) => {
    // throw new Error('There was an error');
    throw new CustomError(('missing param'));
  })
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
