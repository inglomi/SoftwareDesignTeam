// import dependencies for testing
const app = require('../server');
const request = require('supertest');
const mockKnex = require('mock-knex');
const passport = require('passport');
const MockStrategy = require('passport-mock-strategy');

// sample user
const sampleUser = {
    user_id: 1,
    username: 'johndoe',
    password: 'password',
    addressOne: '123 Main Street',
    addressTwo: '',
    city: 'League City',
    state: 'TX',
    zipCode: '77573'
};

// sample quote request
const sampleQuote = {
    name: 'John Doe',
    email: 'johndoe@example.com',
    phone: '123-456-7890',
    address: '123 Main Street',
    addressTwo: '',
    city: 'League City',
    state: 'TX',
    zip: '77573',
    service: 'Lawn Mowing',
    frequency: 'Weekly',
    date: '2023-05-01',
    time: '10:00 AM',
    notes: 'Please mow the front and back yard',
    gallons: 1000,
    price: 1.61,
    total: 1610
};

// function to mock database connection and queries
const mockDatabase = () => {
    const db = require('../database_connection');
    const tracker = mockKnex.getTracker();
    tracker.install();
    tracker.on('query', (query) => {
        if (query.sql.includes('SELECT addressOne, addressTwo, city, state, zipCode FROM ClientInformation WHERE userID=?')) {
            query.response([sampleUser]);
        } else if (query.sql.includes('SELECT quoteID FROM FuelQuotes WHERE UserID=?')) {
            query.response([]);
        } else if (query.sql.includes('INSERT INTO FuelQuotes (userID, gallons, address, secondAddress, city, state, zip, deliveryDate, price, total) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')) {
            query.response({
                insertId: 1
            });
        } else {
            query.response([]);
        }
    });
};

// function to mock the authentication middleware
const mockAuthentication = () => {
    passport.use(new MockStrategy({
        name: 'mock',
        user: sampleUser
    }));
    passport.serializeUser((user, done) => {
        done(null, user);
    });
    passport.deserializeUser((user, done) => {
        done(null, user);
    });
};

// test database
beforeAll(() => {
    process.env.DATABASE = 'testdb';
});

// mock database and authentication before each test
beforeEach(() => {
    mockDatabase();
    mockAuthentication();
});

// test GET /quote route
describe('GET /quote', () => {
    // Test that the quote page is rendered for an authenticated user
    test('should render the quote page for an authenticated user', async () => {
        const response = await request(app)
            .get('/quote')
            .set('Cookie', 'connect.sid=s%3A1234567890')
            .expect(200);
        expect(response.text).toContain('Quote Form');
    });

    // test that user is redirected to login page if not authenticated
    test('should redirect to the login page if not authenticated', async () => {
        const response = await request(app)
            .get('/quote')
            .expect(302);
        expect(response.headers.location).toBe('/login');
    });
});

// test GET /data route
describe('GET /data', () => {
    // Test that the user address is returned from the database
    test('should return the user address from the database', async () => {
        const response = await request(app)
            .get('/data')
            .set('Cookie', 'connect.sid=s%3A1234567890')
            .expect(200);
        expect(response.body).toEqual({
            addressOne: sampleUser.addressOne,
            addressTwo: sampleUser.addressTwo,
            city: sampleUser.city,
            state: sampleUser.state,
            zipCode: sampleUser.zipCode
        });
    });
});

// test GET /get_quote route
describe('GET /get_quote', () => {
    // Test that the suggested price and total amount due are calculated and returned based on the query parameters
    test('should return the suggested price and total amount due based on the query parameters', async () => {
        const response = await request(app)
            .get('/get_quote')
            .query({
                gallons: sampleQuote.gallons,
                state: sampleQuote.state
            })
            .set('Cookie', 'connect.sid=s%3A1234567890')
            .expect(200);
        expect(response.body).toEqual({
            suggestedPrice: sampleQuote.price,
            totalAmountDue: sampleQuote.total
        });
    });
});

// test POST /save__quote route
describe('POST /save__quote', () => {
    // Test that a valid quote request is saved to the database and redirects to the history page
    test('should save a valid quote request and redirect to the history page', async () => {
        const response = await request(app)
            .post('/save__quote')
            .send(sampleQuote)
            .set('Cookie', 'connect.sid=s%3A1234567890')
            .expect(302);
        expect(response.headers.location).toBe('/history');
    });

    // test that invalid quote request is rejected and returns error message
    test('should reject an invalid quote request and return an error message', async () => {
        const invalidQuote = {
            name: '',
            email: 'invalid',
            phone: 'abc',
            address: '',
            addressTwo: '',
            city: '',
            state: '',
            zip: '',
            service: '',
            frequency: '',
            date: '',
            time: '',
            notes: '',
            gallons: -1,
            price: 0,
            total: 0
        };
        const response = await request(app)
            .post('/save__quote')
            .send(invalidQuote)
            .set('Cookie', 'connect.sid=s%3A1234567890')
            .expect(400);
        expect(response.body.message).toBe('There are some errors in your quote request.');
        expect(response.body.errors).toEqual([{
                param: 'gallons',
                msg: 'Gallons must be a positive number.'
            },
            {
                param: 'deliveryDate',
                msg: 'Please select a valid future date.'
            }
        ]);
    });
});
