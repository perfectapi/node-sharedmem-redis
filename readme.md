# What is this?

This is an implementation of shared memory, for use by multiple node processes that need to share data.  It is a common API, independent of the actual means of storing and sharing the memory.  It does not use any low-level OS shared memory capabilities, and is compatible with both Windows and Linux.

# Why use this?

You have a node process that you want to scale across CPUs or across servers, but you need to share some data between them.  You could use Redis or MongoDB or memcached, but this is much simpler.

# Is this a database?

No, although a database may be used as a means of storing and sharing the memory.

# Usage

In the default implementation, you would run node-sharedmem as a service.  You can do so from the command line like:

    $ sharedmem server -p 3000

(will run on port 3000).  See also options for installing as a service or daemon on Windows or Linux: https://github.com/perfectapi/node-perfectapi/wiki/Installers.

Once you have the service running on an endpoint, you can use like this (you will need to have perfectapi module installed, `npm install perfectapi`):

```
var perfectapi = require('perfectapi');
perfectapi.proxy('http://localhost:3000/sharedmem', function(err, sharedmem) {

	var myuser = {email: 'steve@perfectapi.com', last:'campbell', first:'steve'};
    var config = {collection: 'users', 'key': myuser.email, 'variable': myuser};
    sharedmem.save(config, function(err, result) {
		//myuser is saved.  Lets check:
		
		config = {collection: 'users', 'key': 'steve@perfectapi.com'};
		sharedmem.get(config, function(err, result) {
			//result == myuser
		})
    });

});
```

You can also access an API test page at http://localhost:3000/sharedmem/testapp (replace localhost with your actual server name).

# Why are the methods asynchronous?

I agree, it is not intuitive to access memory in an asynchronous manner.  On Linux you can use [node-fiberize](https://github.com/lm1/node-fiberize) to switch to synchronous calls.  

I could build fiber support in, but unfortunately node-fibers is not currently available for Windows, (and I want to retain compatibility with Windows).

