# What is this?

This is an implementation of the [node-sharedmem API](https://github.com/perfectapi/node-sharedmem) with a [Redis](http://redis.io/) backend.  

# Why use this?

You have one or more node processes that you want to scale across CPUs or across servers, but you need to share some data between them.  You could use Redis directly, but this is MUCH simpler and it is a common API so you can switch to another backend store if you want.

# Usage

In this implementation, you run node-sharedmem-redis as a normal node module.   So, install as normal:

    $ npm install sharedmem-redis

In order to configure the Redis connection, you need to set two environment variables:

 - `REDIS_HOST` - host name of the redis server 
 - `REDIS_DB_INDEX` - database number to use on the server
 
Note that Redis authentication and also running on a non-standard port are not currently supported.  

Usage in Node goes like this:
 
```
var sharedmem = require('sharedmem-redis');

var myuser = {email: 'steve@perfectapi.com', last:'campbell', first:'steve'};
var config = {collection: 'users', 'key': myuser.email, 'variable': myuser};
sharedmem.save(config, function(err, result) {
	//myuser is saved.  Lets check:

	config = {collection: 'users', 'key': 'steve@perfectapi.com'};
	sharedmem.get(config, function(err, result) {
		//result == myuser
	})
});
```

## Running as a service

You can also run the API as a service, which enables simple access from other languages, currently Javascript and .NET.  You can see instructions on how to do that on the readme for [node-sharedmem](https://github.com/perfectapi/node-sharedmem).

# Available methods (API)

I have put up a [public test page](http://services.perfectapi.com/sharedmem/testapp/) - it has all the commands and their descriptions.  You can also play around with the library there - just be aware that others may be doing the same.  The implementation on that page is actually the [node-sharedmem module](https://github.com/perfectapi/node-sharedmem), but the API is the same.

