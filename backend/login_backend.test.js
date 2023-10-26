const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../login_backend'); // Assuming your backend file is named login_backend.js
const should = chai.should();

chai.use(chaiHttp);

describe('/POST login', () => {
  it('it should not POST a login without username field', (done) => {
    let login = {
      password: "password1"
    }
    chai.request(server)
      .post('/login')
      .send(login)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('string');
        res.body.should.be.eql('Missing username or password');
        done();
      });
  });

  it('it should not POST a login without password field', (done) => {
    let login = {
      username: "user1"
    }
    chai.request(server)
      .post('/login')
      .send(login)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('string');
        res.body.should.be.eql('Missing username or password');
        done();
      });
  });

  it('it should POST a login with valid username and password', (done) => {
    let login = {
      username: "user1",
      password: "pass1"
    }
    chai.request(server)
      .post('/login')
      .send(login)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('string');
        res.body.should.be.eql('Login successful');
        done();
      });
  });

  it('it should not POST a login with invalid username and password', (done) => {
    let login = {
      username: "invalidUser",
      password: "invalidPass"
    }
    chai.request(server)
      .post('/login')
      .send(login)
      .end((err, res) => {
        res.should.have.status(401);
        res.body.should.be.a('string');
        res.body.should.be.eql('Invalid username or password');
        done();
      });
  });
});
