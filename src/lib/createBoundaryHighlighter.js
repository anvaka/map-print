import * as osm from './osm';
import appState from '../appState';

export default function createBoundaryHighlighter(map) {
  return {
    removeHighlight,
    highlight
  }

  function highlight(relationId, bounds) {
    removeHighlight();

    map.fitBounds([bounds.minlon, bounds.minlat, bounds.maxlon, bounds.maxlat]);

    appState.downloadOsmProgress = true;
    osm.getRelationBoundary(relationId)
      .then(buildPolygon)
      .then(drawPolygonHighlight);

    function drawPolygonHighlight(features) {
      appState.downloadOsmProgress = false;
      map.addLayer({
        id: 'highlight',
        type: 'line',
        source: {
            type: 'geojson',
            data: {
              type: 'FeatureCollection',
              features: features
            }
        },
        layout: {},
        paint: {
          'line-width': 3,
          'line-color': '#A33F6F',
        }
      });
    }
  }

  function buildPolygon(osmBounds) {
    var {nodes, ways} = osmBounds;
    return ways.map(way => {

      let coordinates = way.nodes.map(node => {
        var n = nodes.get(node)
        return [n.lon, n.lat]
      });
      return {
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: coordinates
        }
      };
    });
  }

  function removeHighlight() {
    if (map.getLayer('highlight')) {
      map.removeLayer('highlight');
      map.removeSource('highlight');
    }
  }
}