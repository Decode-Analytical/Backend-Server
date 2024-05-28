const request = require('supertest');
const app = require('./app');

describe('GET /users', () => {
  it('should respond with a list of users', async () => {
    const res = await request(app).get('/users');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('users');
    expect(res.body.users).toBeInstanceOf(Array);
    expect(res.body.users.length).toBeGreaterThan(0);
  });
});
