import request from './request';

const overpassUrl = 'https://overpass-api.de/api/interpreter' ;

export default function postData(data, progress) {
  return request(overpassUrl, {
    method: 'POST',
    responseType: 'json',
    progress,
    headers: {
      'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
    },
    body: 'data=' + encodeURIComponent(data),
  }, 'POST');
}
