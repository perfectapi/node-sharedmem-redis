#!/usr/bin/env node

var perfectapi = require('perfectapi');  
//var perfectapi = require('../../perfectapi/api.js')
var path = require('path');
var main = require('../lib/main.js');

var configPath = path.resolve(__dirname, '..', 'perfectapi.json');
var parser = new perfectapi.Parser();

//handle the commands
parser.on("save", function(config, callback) {
  main.save(config, function(err, result) {
    callback(err, result);
  });
});

parser.on("get", function(config, callback) {
  main.get(config, function(err, result) {
    callback(err, result);
  });
});

parser.on("remove", function(config, callback) {
  main.remove(config, function(err, result) {
    callback(err, result);
  });
});

parser.on("getArray", function(config, callback) {
  main.getArray(config, function(err, result) {
    callback(err, result);
  });
});

parser.on("increment", function(config, callback) {
  main.increment(config, function(err, result) {
    callback(err, result);
  });
});

parser.on("decrement", function(config, callback) {
  main.decrement(config, function(err, result) {
    callback(err, result);
  });
});

//this should go last:
module.exports = parser.parse(configPath);

