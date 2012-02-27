var store = {};
var timeouts = {};

exports.save = function(collection, key, val, ttlMilliseconds) {
  store[collection] = store[collection] || {};
  var col = store[collection];
  
	col[key] = val;
	
	if (ttlMilliseconds && ttlMilliseconds != '' && Number(ttlMilliseconds) > 0) {
		timeouts[collection] = timeouts[collection] || {};
    var timeoutCol = timeouts[collection];
    if (timeoutCol.hasOwnProperty(key)) {
      //this variable is already set to timeout - remove the old timeout
      clearTimeout(timeoutCol[key])
    }
    
    //set the new timeout
		timeoutCol[key] = setTimeout(function() {
      //console.log('deleting ' + key + ' from store - timed out');
			exports.remove(collection, key);
		}, ttlMilliseconds)
	}
}

exports.get = function(collection, key) {
  if (store.hasOwnProperty(collection)) {
    var col = store[collection];
    
    if (col.hasOwnProperty(key)) {
      return col[key];
    }     
  }
  
  return null;
}

exports.remove = function(collection, key) {
  if (store.hasOwnProperty(collection)) {
    var col = store[collection];
    
    if (col.hasOwnProperty(key)) {
      delete col[key];
    }     
  }
}

exports.getArray = function(collection) {
  if (store.hasOwnProperty(collection)) {
    var col = store[collection];
    
    return col;
  }
  
  return {};
}

exports.increment = function(key) {
  var col = 'sharemem.counters';
  var val = exports.get(col, key);
  if (val) {
    exports.save(col, key, val + 1);
    return val + 1;
  } else {
    exports.save(col, key, 1);
    return 1;
  }
}

exports.decrement = function(key) {
  var col = 'sharemem.counters';
  var val = exports.get(col, key);
  if (val) {
    exports.save(col, key, val - 1);
    return val - 1;
  } else {
    //should not happen, but allowed
    exports.save(col, key, -1);
    return -1;
  }
}

