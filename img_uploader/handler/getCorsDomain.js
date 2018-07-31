module.exports = function getCorsDomain(reqHeaders) {
  const defaultDomain = 'https://anvaka.github.io';

  if (!reqHeaders || !reqHeaders.origin) return defaultDomain;

  const origin = reqHeaders.origin;
  return origin.indexOf('http://localhost:8080') === 0 ? 'http://localhost:8080' : 
         origin.indexOf('http://0.0.0.0:8080') === 0 ? 'http://0.0.0.0:8080' : 
         defaultDomain;
}