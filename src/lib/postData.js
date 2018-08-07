import request from './request';

const overpassUrl = 'https://overpass-api.de/api/interpreter' ;
const backupUrl = 'https://overpass.kumi.systems/api/interpreter';

export default function postData(data, progress, useBackup) {
  return request(useBackup ? backupUrl : overpassUrl, {
    method: 'POST',
    responseType: 'json',
    progress,
    headers: {
      'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
    },
    body: 'data=' + encodeURIComponent(data),
  }, 'POST').catch(err => {
    if (useBackup) {
      // we can't do much anymore
      throw err;
    }

    return postData(data, progress, /* useBackup = */ true);
  });
}
