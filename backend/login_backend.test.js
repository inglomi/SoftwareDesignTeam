const request = require('supertest');
const app = require('../server');

describe('Login backend routes', () => {
  test('POST /loginForm should return login successful for valid credentials', async () => {
    const response = await request(app)
      .post('/loginForm')
      .send({ username: 'user1', password: 'pass1' });
    expect(response.statusCode).toBe(200);
    expect(response.text).toBe('Login successful');
  });

  test('POST /loginForm should return invalid username or password for invalid credentials', async () => {
    const response = await request(app)
      .post('/loginForm')
      .send({ username: 'user1', password: 'wrong' });
    expect(response.statusCode).toBe(401);
    expect(response.text).toBe('Invalid username or password');
  });

  test('POST /loginForm should return missing username or password for empty credentials', async () => {
    const response = await request(app)
      .post('/loginForm')
      .send({ username: '', password: '' });
    expect(response.statusCode).toBe(400);
    expect(response.text).toBe('Missing username or password');
  });

  test('POST /loginForm should return username or password too long for long credentials', async () => {
    const response = await request(app)
      .post('/loginForm')
      .send({ username: 'user1'.repeat(5), password: 'pass1'.repeat(5) });
    expect(response.statusCode).toBe(400);
    expect(response.text).toBe('Username or password too long');
  });
});
