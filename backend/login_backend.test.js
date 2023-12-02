const request = require('supertest');
const app = require('../server');
const chai = require('chai');
const expect = chai.expect;
const faker = require('faker');

describe('Login backend routes', () => {
  it('should return login successful for valid credentials', async () => {
    // generate random user with valid credentials
    const user = {
      username: faker.internet.userName(),
      password: faker.internet.password()
    };

    // register user in database
    await request(app)
      .post('/registrationForm')
      .send(user);

    // login with same credentials
    const response = await request(app)
      .post('/loginForm')
      .send(user);
    
    expect(response.statusCode).to.equal(200);
    expect(response.text).to.equal('Login successful');
  });

  it('should return invalid username or password for invalid credentials', async () => {
    // generate random user with invalid credentials
    const user = {
      username: faker.internet.userName(),
      password: faker.internet.password()
    };

    // login with invalid credentials
    const response = await request(app)
      .post('/loginForm')
      .send(user);
    
    expect(response.statusCode).to.equal(401);
    expect(response.text).to.equal('Invalid username or password');
  });

  it('should return missing username or password for empty credentials', async () => {
    // login with empty credentials
    const response = await request(app)
      .post('/loginForm')
      .send({ username: '', password: '' });
    
    expect(response.statusCode).to.equal(400);
    expect(response.text).to.equal('Missing username or password');
  });

  it('should return username or password too long for long credentials', async () => {
    // generate random user with long credentials
    const user = {
      username: faker.internet.userName().repeat(5),
      password: faker.internet.password().repeat(5)
    };

    // login with long credentials
    const response = await request(app)
      .post('/loginForm')
      .send(user);
    
    expect(response.statusCode).to.equal(400);
    expect(response.text).to.equal('Username or password too long');
  });
});

describe('Registration backend routes', () => {
  it('should return registration successful for valid credentials', async () => {
    // generate random user with valid credentials
    const user = {
      username: faker.internet.userName(),
      password: faker.internet.password()
    };

    // register user in database
    const response = await request(app)
      .post('/registrationForm')
      .send(user);

    expect(response.statusCode).to.equal(200);
    expect(response.text).to.equal('Registration successful');
  });

  it('should return username already exists for duplicate credentials', async () => {
    // generate random user with valid credentials
    const user = {
      username: faker.internet.userName(),
      password: faker.internet.password()
    };

    // register user in database twice
    await request(app)
      .post('/registrationForm')
      .send(user);

    const response = await request(app)
      .post('/registrationForm')
      .send(user);

    expect(response.statusCode).to.equal(409);
    expect(response.text).to.equal('Username already exists');
  });

  it('should return missing username or password for empty credentials', async () => {
    // register with empty credentials
    const response = await request(app)
      .post('/registrationForm')
      .send({ username: '', password: '' });

    expect(response.statusCode).to.equal(400);
    expect(response.text).to.equal('Missing username or password');
  });

  it('should return username or password too long for long credentials', async () => {
    // generate random user with long credentials
    const user = {
      username: faker.internet.userName().repeat(5),
      password: faker.internet.password().repeat(5)
    };

    // register with long credentials
    const response = await request(app)
      .post('/registrationForm')
      .send(user);

    expect(response.statusCode).to.equal(400);
    expect(response.text).to.equal('Username or password too long');
  });
});
