var memory = require('../bin/sharedmem.js');


describe('Shared Memory', function() {


  
  describe('variables', function() {
    it('save should work without error', function(done) {
      var data = 'a'
      var config = {collection: "col 1", variable: data, key: '1'}
      memory.save(config, function(err, result) {
        if (err) throw err;
        
        done();
      })      
    })
    it('should be retrievable after save', function(done) {
      var config = {collection: "col 1", key: '1'};
      memory.get(config, function(err, result) {
        if (err) throw err;
        
        result.should.equal('a');
        done();
      })
    })
    it('should be in collection after save', function(done) {
      var config = {collection: "col 1"};
      memory.getArray(config, function(err, result) {
        if (err) throw err;
        
        result.should.have.property('1', 'a');
        done();
      })    
    })
    it('should remove from collection after removal', function(done) {
      var config = {collection: "col 1", key: '1'};
      memory.remove(config, function(err, result) {
        if (err) throw err;
        
        memory.getArray(config, function(err, result) {
          if (err) throw err;
          
          result.should.not.have.property('1');
          done();
        })   
      })
    })
  })
  
  describe('timeouts', function() {
    it('save with timeout should auto-remove after timeout', function(done) {
      var data = 'a'
      var config = {collection: "col 2", variable: data, key: '1', options: {expiresIn: 1} };
      memory.save(config, function(err, result) {
        if (err) throw err;

        memory.getArray(config, function(err, result) {
          //should still be there when we check immediately
          result.should.have.property('1', 'a');
          
          setTimeout(function() {
            memory.getArray(config, function(err, result) {
              //should be gone after timeout expires
              result.should.not.have.property('1');
            
              done();
            })
         

          }, 1);
        })
      })      
    })
    it('can be refreshed by saving the variable again', function(done) {
      var data = 'a'
      var config = {collection: "col 3", variable: data, key: '1', options: {expiresIn: 1} };
      memory.save(config, function(err, result) {
        if (err) throw err;
        
        config.options.expiresIn = 3;
        memory.save(config, function(err, result) {
          if (err) throw err;
          
          //timeout should be 3 now, not 1.  Lets wait 2 and see if the variable is still there
          setTimeout(function() {
            memory.getArray(config, function(err, result) {
              //should be gone after timeout expires
              result.should.have.property('1', 'a');
            
              done();
            })
            
          }, 2)
        })
        
      })
      
    })
  })
  
  describe('counters', function() {
    it('should be 1 after first increment', function(done) {
      var config = {counter: 'id'};
      memory.increment(config, function(err, result) {
        if (err) throw err;
        
        result.should.equal(1);
        done();
      })
    })
    it('should be 2 after second increment', function(done) {
      var config = {counter: 'id'};
      memory.increment(config, function(err, result) {
        if (err) throw err;
        
        result.should.equal(2);
        done();
      })
    }) 
    it('should go down when decremented', function(done) {
      var config = {counter: 'id'};
      memory.decrement(config, function(err, result) {
        if (err) throw err;
        
        result.should.equal(1);
        done();
      })    
    })
    it('should be -1 when not incremented before first decrement', function(done) {
      var config = {counter: 'id2'};
      memory.decrement(config, function(err, result) {
        if (err) throw err;
        
        result.should.equal(-1);
        done();
      })    
    })    
  })

})

