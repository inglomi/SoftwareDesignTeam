const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;

const app = require('./your-express-app'); // Replace with the path to your Express app

chai.use(chaiHttp);

describe('User Profile Update', () => {
  it('should update user profile', async () => {
    const updateData = {
      firstName: 'Viet',
      lastName: 'Pham',
      address1: '123 street',
      address2: '',
      city: 'Houston',
      state: 'Texas',
      zipcode: '77004',
    };

    const response = await chai.request(app)
      .post('/submit')
      .send(updateData);

    expect(response).to.have.status(200); 

    // Now, check if the userProfile object has been updated
    expect(app.userProfile).to.deep.equal(updateData);
  });
});
