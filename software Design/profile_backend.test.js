const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('./server'); // Assuming your server file is named server.js

chai.use(chaiHttp);
const expect = chai.expect;

describe('Profile Management Backend Tests', () => {
    it('should save personal info', (done) => {
        chai.request(server)
            .post('/savePersonalInfo')
            .send({
                first_name: 'John',
                last_name: 'Doe',
                address_1: '123 Main St',
                city: 'Anytown',
                state: 'CA',
                zipcode: '90210'
            })
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('message').equals('Data saved successfully.');
                expect(res.body).to.have.property('userId');
                done();
            });
    });

    it('should return an error for missing fields', (done) => {
        chai.request(server)
            .post('/savePersonalInfo')
            .send({})
            .end((err, res) => {
                expect(res).to.have.status(400);
                expect(res.body).to.have.property('error').equals('All fields are required.');
                done();
            });
    });

    it('should return an error for invalid zip code format', (done) => {
        chai.request(server)
            .post('/savePersonalInfo')
            .send({
                first_name: 'John',
                last_name: 'Doe',
                address_1: '123 Main St',
                city: 'Anytown',
                state: 'CA',
                zipcode: 'invalidzipcode'
            })
            .end((err, res) => {
                expect(res).to.have.status(400);
                expect(res.body).to.have.property('error').equals('Invalid zip code format.');
                done();
            });
    });
});
