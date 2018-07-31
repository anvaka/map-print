var d3geo = require('d3-geo')

export default function createProjector(lonLatBbox, r) {
  if (!r) r = 6371393; // radius of earth in meters

  var q = [0, 0];
  var projector = d3geo.geoMercator()
      .center([lonLatBbox.cx, lonLatBbox.cy])
      .scale(r)

  return function(lon, lat) {
    q[0] = lon; q[1] = lat;

    let xyPoint = projector(q)

    return {
      x: xyPoint[0],
      y: xyPoint[1]
    };
  };
}
