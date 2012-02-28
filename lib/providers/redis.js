var redis = require('redis');
var async = require('async');

var environment = {};

function getRedisClient() {
  var db = redis.createClient(6379, environment.REDIS_HOST);
  db.select(environment.REDIS_DB_INDEX);
  db.on("error", function (err) {
    console.log(err);
  });
  
  return db;
}

/**
* Call this first to set the environment for Redis connections
*/
exports.setEnvironment = function(config) {
  environment = config.environment;
}

exports.save = function(collection, key, val, ttlMilliseconds, callback) {
  
  var db = getRedisClient();
  
  var dataKey = 'sharedmem:' + collection + ':' + key;
  var arrayKey = 'sharedmem:' + collection + '.list'
  var redisVal = val;
  if (typeof val == 'object')
    redisVal = JSON.stringify(val);
  var ttl = 0;
  if (ttlMilliseconds && ttlMilliseconds != '' && Number(ttlMilliseconds) > 0) {
    ttl = Math.ceil(Number(ttlMilliseconds) / 1000);  //rounds up
  }
  
  async.series([
    function(callback) {
      db.set(dataKey, val, callback);
    },
    function(callback) {
      if (ttl > 0) {
        db.expire(dataKey, ttl, callback)
      } else {
        callback();
      }
    },
    function(callback) {
      db.sadd(arrayKey, key, callback);
    }
  ], function(err, results) {
    db.quit();
    
    return callback(err);
  })
  
}

exports.get = function(collection, key, callback) {
  var dataKey = 'sharedmem:' + collection + ':' + key;

  var db = getRedisClient();
  db.get(dataKey, function(err, result) {
    var val = getValAsObject(result);
    callback(err, val);
    
    db.quit();
  })
}

function getValAsObject(result) {
  if (result) {
    try {
      var resultAsObject = JSON.parse(result);
      return resultAsObject
    } catch(e) {
      //just return string
      return result;
    }
  } else {
    return result;
  }
}

exports.remove = function(collection, key, callback) {
  var db = getRedisClient();
  
  var dataKey = 'sharedmem:' + collection + ':' + key;
  var arrayKey = 'sharedmem:' + collection + '.list';

  async.parallel([
    function(callback) {
      db.del(dataKey, callback);
    },
    function(callback) {
      db.srem(arrayKey, key, callback)
    }
  ], function(err, results) {
    db.quit();
    
    return callback(err);
  })
}

exports.getArray = function(collection, callback) {

  var db = getRedisClient();
  
  var arrayKey = 'sharedmem:' + collection + '.list'
  var results = {};

  async.waterfall([
    function(callback) {
      db.smembers(arrayKey, callback);
    },
    function(keys, callback) {
      async.forEach(keys, function(key, cb) {
        var dataKey = 'sharedmem:' + collection + ':' + key;
        db.get(dataKey, function(err, result) {
          var val = getValAsObject(result);
          if (val) {
            results[key] = val;
          }
          
          cb(err);
        })
      }, function(err) {
        callback(err, results);
      })
    }
  ], function(err, results) {
    db.quit();
    
    return callback(err, results);
  })
}

exports.increment = function(key, callback) {
  var redisKey = 'sharemem.counters:' + key;
  
  var db = getRedisClient();
  db.incr(redisKey, function(err, result) {
    callback(err, result);
    
    db.quit();
  })

}

exports.decrement = function(key, callback) {
  var redisKey = 'sharemem.counters:' + key;
  
  var db = getRedisClient();
  db.decr(redisKey, function(err, result) {
    callback(err, result);
    
    db.quit();
  })
}
