var AWS = require('aws-sdk');
var multipart = require('aws-lambda-multipart-parser');
var crypto = require('crypto');
var getCorsDomain = require('./getCorsDomain');

var s3 = new AWS.S3();

var signedUrlExpireSeconds = 60 * 24;
var bucket = 'osm-play-v1'

function putObjectToS3(key, data){
  return new Promise((resolve, reject) => {
    var params = {
        Bucket: bucket,
        Key: key,
        Body: data
    }

    s3.putObject(params, function(err, data) {
      if (err) {
        console.log(err, err.stack);
        reject(err);
      } else {
        resolve(data);
      }
    });
  }).then(() => {

      return s3.getSignedUrl('getObject', {
        Bucket: bucket,
        Key: key,
        Expires: signedUrlExpireSeconds
      });
  })
}

exports.handler = (event, context, callback) => {
  console.log(event);
  let parsed = multipart.parse(event);
  let buffer = new Buffer(parsed.image, 'base64');
  const fileName = 'img0-' + crypto.randomBytes(16).toString("hex") + '.png';

  putObjectToS3(fileName, buffer).then(link => {
    callback(null, {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        data: {link}
      }),
      headers: {
        'Access-Control-Allow-Origin': getCorsDomain(event.headers),
        'X-Content-Type-Options': 'nosniff'
      }
    });
  })
};
