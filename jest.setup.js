// jest.setup.js
const dotenv = require('dotenv');
dotenv.config();

beforeAll(() => {
  console.log('Global setup');
});

afterAll(() => {
  console.log('Global teardown');
});
