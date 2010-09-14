// simplified http methods

var url = require('url');
var querystring = require('querystring');
var http = require('http');

// get(url, additional query params, callback);
exports.get = function(u, q, c) {
   u = url.parse(u, true);
   u.port = u.port || (u.protocol == 'https:' ? 443 : 80);
   u.pathname = u.pathname || '/';
   u.query = u.query || {};
   // merge query data
   for(var p in q) {
      if(u.query[p] && u.query[p].implements('push')) {
	 if(q[p].length) {
	    for(var i = 0; i < q[p].length; i++) {
	       u.query[p].push(q[p][i]);
	    }
         } else {
	    u.query[p].push(q[p]);
	 }
      } else {
	 u.query[p] = q[p];
      }
   }
   u.query = u.query ? '?' + querystring.stringify(u.query, '&', '=', false) : '';
   var req = http.createClient(u.port, u.hostname).request(
     'GET',
     u.pathname + u.query,
     {'host': u.hostname}
   );
   req.end();
   req.on('response', function(res) {
      var data = new Buffer(0);
      res.on('data', function(chunk) {
	 var old_length = data.length;
	 data = new Buffer(data.length + chunk.length);
	 chunk.copy(data, old_length);
      });
      res.on('end', function() {
	 c(data);
      });
   });
};

// post(url, query params, callback);
exports.post = function(u, q, c) {
   u = url.parse(u);
   u.port = u.port || (u.protocol == 'https:' ? 443 : 80);
   u.pathname = u.pathname || '/';
   u.query = u.query || '';
   q = querystring.stringify((q || {}), '&', '=', false)
   var req = http.createClient(u.port, u.hostname).request(
     'POST',
     u.pathname + u.query,
     {
	'host': u.hostname,
	'content-type': 'application/x-www-form-urlencoded',
	'content-length': q.length
     }
   );
   req.end(q, 'ascii');
   req.on('response', function(res) {
      var data = new Buffer(0);
      res.on('data', function(chunk) {
	 var old_length = data.length;
	 data = new Buffer(data.length + chunk.length);
	 chunk.copy(data, old_length);
      });
      res.on('end', function() {
	 c(data);
      });
   });
};