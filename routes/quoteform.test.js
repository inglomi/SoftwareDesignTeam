const request = require('supertest'); // For making HTTP requests in tests
const express = require('express');
const app = express();

// Import your module to test
const quoteForm = require('./quoteform');

// Mock any dependencies, such as your database connection
jest.mock('../database_connection', () => {
  return {
    query: jest.fn(),
  };
});

// Use your router in the Express app
app.use(quoteForm);

describe('Quote Router Tests', () => {
  it('should respond to GET /quote', async () => {
    const response = await request(app).get('/quote');
    expect(response.statusCode).toBe(200);
    expect(response.type).toBe('text/html');
  });

  it('should respond to GET /data', async () => {
    const mockDbQueryResponse = [
        {
          addressOne: '123 Main St',
          city: 'Example City',
          state: 'CA',
          zipCode: '12345',
        },
      ];
      
    const dbQueryResponse = [{ addressOne: '123 Main St', city: 'Example City', state: 'CA', zipCode: '12345' }];

    jest.spyOn(require('../database_connection'), 'query').mockImplementation((query, callback) => {
      callback(null, dbQueryResponse);
    });

    const response = await request(app).get('/data');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(dbQueryResponse[0]);
  });

  it('should respond to POST /save__quote', async () => {
    const response = await request(app)
      .post('/save__quote')
      .send({
        gallons: 100,
        deliveryDate: '2023-11-15',
        price: 2.50,
        total: 250,
      });

    expect(response.statusCode).toBe(200);
    expect(response.text).toBe('Data updated successfully');
  });
});
