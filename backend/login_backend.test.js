const request = require('supertest');
const app = require('../server');
const chai = require('chai');
const assert = chai.assert;
const mocha = require('./node_modules/mocha');

describe('Login backend routes', () => {
  it('should return login successful for valid credentials', async () => {
    const response = await request(app)
      .post('/loginForm')
      .send({ username: 'user1', password: 'pass1' });
    
    assert.equal(response.statusCode, 200);
    assert.equal(response.text, 'Login successful');
  });

  it('should return invalid username or password for invalid credentials', async () => {
    const response = await request(app)
      .post('/loginForm')
      .send({ username: 'user1', password: 'wrong' });
    
    assert.equal(response.statusCode, 401);
    assert.equal(response.text, 'Invalid username or password');
  });

  it('should return missing username or password for empty credentials', async () => {
    const response = await request(app)
      .post('/loginForm')
      .send({ username: '', password: '' });
    
    assert.equal(response.statusCode, 400);
    assert.equal(response.text, 'Missing username or password');
  });

  it('should return username or password too long for long credentials', async () => {
    const response = await request(app)
      .post('/loginForm')
      .send({ username: 'user1'.repeat(5), password: 'pass1'.repeat(5) });
    
    assert.equal(response.statusCode, 400);
    assert.equal(response.text, 'Username or password too long');
  });
});
