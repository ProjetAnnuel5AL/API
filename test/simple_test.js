var request = require('supertest');
var app = require('../index.js');

 
describe('GET /', function() {
  it('Respond with Hello ESGI !', function(done) {
    request(app).get('/').expect('Hello ESGI !', done);
  });
});