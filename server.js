// https://medium.freecodecamp.org/securing-node-js-restful-apis-with-json-web-tokens-9f811a92bb52

var app = require('./app');
var port = process.env.PORT || 3000;

var server = app.listen(port, function() {
  console.log('Express server listening on port ' + port);
});