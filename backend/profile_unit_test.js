const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('./app'); 
const connection = require('./database'); 
const { expect } = chai;

chai.use(chaiHttp);

  describe('PATCH /update_info/:clientID', () => {
    it('should update client information', (done) => {  
      chai.request("http://localhost:3000")
        .patch('/update_info/1') // Replace with a valid clientID
        .send({
          first_name: 'viet',
          last_name: 'pham',
          address1: '123 street blv',
          city: 'houston',
          state: 'texas',
          zipcode: '77004',
        })
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.text).to.equal('updated!');
          done();
        });
    });
  });

  describe('PATCH /update_login/:login_id', () => {
    it('should update user password', (done) => {
      chai.request('http://localhost:3000')
        .patch('/update_login/1') 
        .send({
          "L_password": 'newpass1',
        })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.text).to.equal('updated!');
          done();
        });
    });
  });

