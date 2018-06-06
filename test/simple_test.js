var request = require('supertest');
var app = require('../index.js');

 
describe('GET /', function() {
  it('Respond with Hello on API !', function(done) {
    request(app).get('/').expect('Hello on API V2 !', done);
  });
});