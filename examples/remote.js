var perfectapi = require('perfectapi');

perfectapi.proxy('http://myserver.com:3000/sharedmem', function(err, sharedmem) {

	var data = {email: 'steve@perfectapi.com', last:'campbell', first:'steve'};
  var config = {collection: 'users', 'key': data.email, 'variable': data};
  sharedmem.save(config, function(err, result) {
		//data is saved.  Lets check:
		
		config = {collection: 'users', 'key': 'steve@perfectapi.com'};
		sharedmem.get(config, function(err, result) {
			//result == data
		})
  });

});

