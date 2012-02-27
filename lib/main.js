
exports.save = function(config, callback) {
  var provider = getProvider(config);
  provider.save(config.collection, config.key, config.variable, config.options.expiresIn);
  
  callback();
}

exports.get = function(config, callback) {
  var provider = getProvider(config);
  
  var result = provider.get(config.collection, config.key)
  callback(null, result);
}

exports.remove = function(config, callback) {
  var provider = getProvider(config);
  provider.remove(config.collection, config.key);

  callback();
}

exports.getArray = function(config, callback) {
  var provider = getProvider(config);
  
  var result = provider.getArray(config.collection)
  callback(null, result);
}

exports.increment = function(config, callback) {
  var provider = getProvider(config);
  
  var result = provider.increment(config.counter)
  callback(null, result);
}

exports.decrement = function(config, callback) {
  var provider = getProvider(config);
  
  var result = provider.decrement(config.counter)
  callback(null, result);
}

function getProvider(config) {
  return require('./providers/memory.js');
}