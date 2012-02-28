# What is this?

This is an implementation of shared memory, for use by multiple node processes that need to share data.  It is a common API, independent of the actual means of storing and sharing the memory.  It does not use any low-level OS shared memory capabilities, and is compatible with both Windows and Linux.

# Why use this?

You have a node process that you want to scale across CPUs or across servers, but you need to share some data between them.  You could use Redis directly, but this is simpler and it is a common API so you can switch to another backend store if you want.

# Usage

In this implementation, you run node-sharedmem-redis as a normal node module. 

```

todo
```

# Available methods (API)

I have put up a public [test page](http://services.perfectapi.com/sharedmem/testapp/) - it has all the commands and their descriptions.  You can also play around with the library there - just be aware that others may be doing the same.  The implementation on that page is actually the [node-sharedmem module](https://github.com/perfectapi/node-sharedmem), but the API is the same.

