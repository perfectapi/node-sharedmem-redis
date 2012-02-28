
exports.save = function(config, callback) {
  var provider = getProvider(config);
  provider.save(config.collection, config.key, config.variable, config.options.expiresIn, callback);
}

exports.get = function(config, callback) {
  var provider = getProvider(config);
  
  provider.get(config.collection, config.key, callback)
}

exports.remove = function(config, callback) {
  var provider = getProvider(config);
  provider.remove(config.collection, config.key, callback);

}

exports.getArray = function(config, callback) {
  var provider = getProvider(config);
  
  var result = provider.getArray(config.collection, callback);
}

exports.increment = function(config, callback) {
  var provider = getProvider(config);
  
  var result = provider.increment(config.counter, callback);
}

exports.decrement = function(config, callback) {
  var provider = getProvider(config);
  
  var result = provider.decrement(config.counter, callback);
}

function getProvider(config) {
  var provider = require('./providers/redis.js');
  
  provider.setEnvironment(config);
  
  return provider;
}