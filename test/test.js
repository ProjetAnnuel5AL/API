var request = require('supertest');
var app = require('../index.js');

 
describe('GET /', function() {
  it('respond with hello jenkins', function(done) {
    request(app).get('/').expect('Hello Azedine !', done);
  });
});