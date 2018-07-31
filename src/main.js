/* global mapboxgl */
import * as osm from './lib/osm';
import appState from './appState';
import bus from './bus';
import constructGraph from './lib/constructGraph';
import createBoundaryHighlighter from './lib/createBoundaryHighlighter';
import formatNumber from './lib/formatNumber';

require.ensure('@/vueApp.js', () => {
  // Settings UI is ready, initialize vue.js application
  require('@/vueApp.js');
});

let map;
var cancelDownload;

appState.init = function() {
  mapboxgl.accessToken = 'pk.eyJ1IjoiYW52YWthIiwiYSI6ImNqaWUzZmhqYzA1OXMza213YXh2ZzdnOWcifQ.t5yext53zn1c9Ixd7Y41Dw';
  map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v9',
      center: [-122.2381,47.624],
      zoom: 11.32,
      hash: true
  });

  map.addControl(new mapboxgl.NavigationControl({
    showCompass: false,
  }), 'bottom-right');
  map.on('zoom', updateZoomWarning);
  map.dragRotate.disable();
  map.touchZoomRotate.disableRotation();

  updateZoomWarning();

  bus.on('download-all-roads', downloadRoads);
  bus.on('cancel-download-all-roads', () => {
    if (cancelDownload) cancelDownload();
  });
};

// document.body.addEventListener('touchmove', (event) => event.stopPropagation());

function updateZoomWarning() {
  appState.showZoomWarning = map.getZoom() < 9.7;
}

function downloadRoads() {
  const bounds = map.getBounds();
  const sw = bounds.getSouthWest();
  const ne = bounds.getNorthEast()
  const boundingBox = `${sw.lat},${sw.lng},${ne.lat},${ne.lng}`;
  appState.building = true;
  appState.buildingMessage = 'Sending query to OSM...'
  appState.blank = false;
  appState.error = null;

  const scriptKind = appState.possibleScripts.selected;
  const downloadPromise = osm.getRoadsInBoundingBox(scriptKind, boundingBox, updateDownloadProgress);

  renderAfterResolution(downloadPromise, el => {
    return el.lon >= sw.lng && el.lon <= ne.lng &&
           el.lat >= sw.lat && el.lat <= ne.lat;
  });
}

function updateDownloadProgress(p) {
  let loaded = formatNumber(p.loaded);

  if (p.lengthComputable) {
    let total = formatNumber(p.total);
    appState.buildingMessage = `Downloading data: ${p.percent * 100}% (${loaded} of ${total} bytes)`;
  } else {
    appState.buildingMessage = `Downloading data: ${loaded} bytes so far...`;
  }
}

function renderAfterResolution(promise, filter) {
  cancelDownload = promise.cancel;
  appState.showCancelDownload = true;

  promise.then(osmResponse => {
    cancelDownload = null;
    appState.showCancelDownload = false;
    return constructGraph(osmResponse, filter, updateConstructionProgress);
  }).then(({graph, bounds, projector}) => {
    appState.setGraph(graph, bounds, projector);
    appState.building = false;

    if (graph.getLinksCount() === 0) {
      appState.blank = true;
    } else {
      appState.currentState = 'canvas';
      appState.blank = false;
      bus.fire('graph-loaded');
    }
  }).catch(err => {
    if (err && err.cancelled) {
      cancelDownload = null;
      appState.building = false;
      appState.showCancelDownload = false;
    } else {
      appState.building = false;
      appState.error = err;
    }
  });
}

function updateConstructionProgress(current, total, kind) {
  let totalStr = formatNumber(total);
  let currentStr = formatNumber(current);
  if (kind === 'graph') {
    appState.buildingMessage = `Making graph: ${currentStr} of ${totalStr} records`;
  } else {
    appState.buildingMessage = `Computing bounds: ${currentStr} of ${totalStr} records`;
  }
}
