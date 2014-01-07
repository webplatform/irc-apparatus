var app = require('../../index.js');

describe('The Bot module', function() {
  it('should be exposed', function() {
    app.Bot.should.exist;
  });

  it('should create a new bot', function() {
    app.Bot().should.be.an('object');
  });
});
