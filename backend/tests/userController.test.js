/* eslint-disable */

import { Sequelize } from 'sequelize';
import app from '../app.js';
import request from 'supertest';
// const sequelize = new Sequelize('sqlite::memory:');

const req = request('http://localhost:3000');

req.get('/').expect(200, function (err) {
  console.log(err);
});
