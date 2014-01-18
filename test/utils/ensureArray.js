var Utils = require('../../index.js').Utils;

describe('Utils.ensureArray', function() {
  describe('should work', function() {
    it('when using an array', function() {
      var plugins = ['plugin1', 'plugin2'];
      Utils.ensureArray(plugins).should.equal(plugins);
    });

    it('when using a string', function() {
      Utils.ensureArray('plugin1').should.deep.equal(['plugin1']);
      Utils.ensureArray('plugin1,plugin2;plugin3').should.deep.equal(['plugin1', 'plugin2', 'plugin3']);
    });

    it('when using null', function() {
      Utils.ensureArray(null).should.be.empty;
    });

    it('when using simple objects', function() {
      Utils.ensureArray(23).should.deep.equal([23]);
      Utils.ensureArray(0.5).should.deep.equal([0.5]);
      Utils.ensureArray(true).should.deep.equal([true]);
      Utils.ensureArray(false).should.deep.equal([false]);
    });
  });
});
