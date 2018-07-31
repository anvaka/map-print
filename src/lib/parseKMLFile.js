var tinyxml = require('tiny.xml')

export default function parseKMLFile(fileList) {
  const pendingFiles = [];
  for (let i = 0; i < fileList.length; ++i) {
    let fileEntry = fileList[i];
    pendingFiles.push(parseFile(fileEntry));
  }

  return Promise.all(pendingFiles);
}


function parseFile(file) {
  return new Promise(resolve => {
    var reader = new FileReader();
    reader.onload = function(){
      var kmlXMLString = reader.result;
      var parser = tinyxml(kmlXMLString)
      var lineStrings = parser.selectNodes('LineString');
      let paths = [];
      lineStrings.forEach(lineNode => {
        let c = lineNode.querySelector('coordinates');
        paths.push(parseLonLat(c.textContent));
      })

      resolve({
        name: file.name,
        paths: paths
      });
    };
    reader.readAsText(file);
  });
}

function parseLonLat(coordinatesTriplet) {
  let lonLatAlt = coordinatesTriplet.split(' ');
  let paths = [];
  lonLatAlt.forEach(tripletString => {
    if (!tripletString) return;

    let parts = tripletString.split(',')
    if (parts.length % 3 !== 0) throw new Error('Expecting three parts from KML coordinates');
    paths.push({
      lon: Number.parseFloat(parts[0]),
      lat: Number.parseFloat(parts[1])
    });
  });

  return paths;
}