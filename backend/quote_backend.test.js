const request = require('supertest');
const app = require('../server');
const db = require('../database_connection');

describe('Quote form routes', () => {
  // mock authentication middleware to simulate logged-in user
  jest.mock('../modules/userAuth', () => {
    return () => (req, res, next) => {
      req.user = { user_id: 1 };
      next();
    };
  });

  // mock database connection to avoid modifying actual data
  jest.mock('../database_connection', () => {
    return {
      query: jest.fn((query, values, callback) => {
        if (query.includes('SELECT addressOne, addressTwo, city, state, zipCode FROM ClientInformation WHERE userID=?')) {
          // return mock user address
          callback(null, [
            {
              addressOne: '123 Main St',
              addressTwo: '',
              city: 'Houston',
              state: 'TX',
              zipCode: '77001',
            },
          ]);
        } else if (query.includes('SELECT quoteID FROM FuelQuotes WHERE UserID=?')) {
          // return mock rate history
          callback(null, [{ quoteID: 1 }, { quoteID: 2 }]);
        } else if (query.includes('INSERT INTO FuelQuotes (userID, gallons, address, secondAddress, city, state, zip, deliveryDate, price, total) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')) {
          // return mock insert result
          callback(null, { insertId: 3 });
        } else {
          // return error for unexpected queries
          callback(new Error('Unexpected query'));
        }
      }),
    };
  });

  afterAll(() => {
    // restore original modules
    jest.resetModules();
  });

  test('GET /quote should return the quote page', async () => {
    const response = await request(app).get('/quote');
    expect(response.statusCode).toBe(200);
    expect(response.type).toBe('text/html');
    expect(response.text).toContain('Quote Form');
  });

  test('GET /data should return the user address', async () => {
    const response = await request(app).get('/data');
    expect(response.statusCode).toBe(200);
    expect(response.type).toBe('application/json');
    expect(response.body).toEqual({
      addressOne: '123 Main St',
      addressTwo: '',
      city: 'Houston',
      state: 'TX',
      zipCode: '77001',
    });
  });

  test('GET /get_quote should return the suggested price and total amount due', async () => {
    const response = await request(app).get('/get_quote?gallons=500&state=TX');
    expect(response.statusCode).toBe(200);
    expect(response.type).toBe('application/json');
    expect(response.body).toEqual({
      suggestedPrice: 1.665,
      totalAmountDue: 832.5,
    });
  });

  test('POST /save_quote should save the quote and redirect to history page', async () => {
    const response = await request(app)
      .post('/save_quote')
      .send({
        gallons: 500,
        address: '123 Main St',
        secondAddress: '',
        city: 'Houston',
        state: 'TX',
        zip: '77001',
        deliveryDate: '2023-12-25',
        price: 1.665,
        total: 832.5,
      });
    expect(response.statusCode).toBe(302);
    expect(response.headers.location).toBe('/history');
  });

  test('POST /save_quote should validate the input and return error messages', async () => {
    const response = await request(app)
      .post('/save_quote')
      .send({
        gallons: -1,
        address: '123 Main St',
        secondAddress: '',
        city: 'Houston',
        state: 'TX',
        zip: '77001',
        deliveryDate: '2020-01-01',
        price: 1.665,
        total: 832.5,
      });
    expect(response.statusCode).toBe(400);
    expect(response.type).toBe('text/html');
    expect(response.text).toContain('Gallons must be a positive number.');
    expect(response.text).toContain('Please select a valid future date.');
  });
});
