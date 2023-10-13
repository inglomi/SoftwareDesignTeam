const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server'); // Assuming your server file is named server.js

chai.use(chaiHttp);
const expect = chai.expect;

describe('Fuel Quote Service Backend Tests', () => {
    it('should submit a quote', (done) => {
        chai.request(server)
            .post('/submitQuote')
            .send({
                gallons: 100,
                address: '123 Main St',
                secondAddress: 'Apt 2',
                city: 'Anytown',
                state: 'CA',
                zip: 90210,
                deliveryDate: '2023-10-31',
                price: 3.50,
                total: 350.00
            })
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('message').equals('Quote submitted successfully.');
                expect(res.body).to.have.property('quoteData');
                done();
            });
    });

    it('should return an error for incomplete data', (done) => {
        chai.request(server)
            .post('/submitQuote')
            .send({
                gallons: 100,
                address: '123 Main St',
                secondAddress: 'Apt 2',
                city: 'Anytown',
                state: 'CA',
                zip: 90210,
                deliveryDate: '2023-10-31',
                price: 3.50,
                // Missing 'total'
            })
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('message').equals('Quote submitted successfully.');
                expect(res.body).to.have.property('quoteData');
                done();
            });
    });
});
