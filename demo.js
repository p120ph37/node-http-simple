var hs = require('./http-simple.js');

// a simple "get" example
hs.get('http://github.com/search', {'q': 'node', 'type': 'Everything'}, function(r){
   console.log('response 1 length: ' + r.length);
});

// note the ability to mix and match query string and params
hs.get('http://github.com/search?type=Everything', {'q': 'node'}, function(r){
   console.log('response 2 length: ' + r.length);
});

// the params object may be left null
hs.get('http://github.com/search?type=Everything&q=node', null, function(r){
   console.log('response 3 length: ' + r.length);
});

// the same syntax works for "post"
hs.post('http://github.com/search', {'q': 'node', 'type': 'Everything'}, function(r){
   console.log('response 4 length: ' + r.length);
});
