var getCorsDomain = require('./getCorsDomain');

exports.handler = (event, context, callback) => {
  callback(null, {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': getCorsDomain(event.headers)
    }
  })
}