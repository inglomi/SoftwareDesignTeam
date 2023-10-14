const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const server = require('../profile_back_end'); 
chai.use(chaiHttp);

describe('User Profile Update', () => {
  it('should update user profile', async () => {
    let updateProfile = {
      firstName: 'Viet',
      lastName: 'Pham',
      address1: '123 street',
      address2: 'optional',
      city: 'Houston',
      state: 'Texas',
      zipcode: '77004'
    };

    const response = await chai.request(server)
      .post('/profile_saved')
      .send(updateProfile);

    expect(response).to.have.status(200);
    expect(server.userProfile).to.have.property('firstName', 'Viet');
    expect(server.userProfile).to.have.property('lastName', 'Pham');
    expect(server.userProfile).to.have.property('address1', '123 street');
    expect(server.userProfile).to.have.property('address2', 'optional');
    expect(server.userProfile).to.have.property('city', 'Houston');
    expect(server.userProfile).to.have.property('state', 'Texas');
    expect(server.userProfile).to.have.property('zipcode', '77004');
  });
});

describe('User password reset', () =>{
    it('should update user password', async () => {
        let updatePassword = {
          currentPass: 'aaaaaaaaaaaaa!',
          newPass: 'bbbbbbbbbbbbbb!',
        };

        const response = await chai.request(server)
          .post('/password_reset')
          .send(updatePassword);
        
        expect(response).to.have.status(200);
        expect(server.userPassword).to.have.property('currentPass', 'aaaaaaaaaaaaa!');
        expect(server.userPassword).to.have.property('newPass', 'bbbbbbbbbbbbbb!');
    });
});
