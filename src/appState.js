// const ratio = 540/230 - mug
const appState = {
  currentState: 'intro',
  selected: null,
  aboutVisible: false,
  blank: false,
  error: null,
  kmlLayers: [],
  currentScript: 'roads',
  showZoomWarning: false,
  possibleScripts: {
    selected: 'roads',
    options: [{
      value: 'roads',
      text: 'Roads'
    }, {
      value: 'buildings',
      text: 'Buildings'
    }, {
      value: 'rivers',
      text: 'Rivers'
    }]
  },
  downloadOsmProgress: null,
  building: false,
  buildingMessage: '',
  zazzleLink: null,
  showCancelDownload: false,
  getGraphBBox,
  getGraph,
  setGraph,
  startOver,
  generatingPreview: false,

  backgroundColor: {
    r: 255, g: 255, b: 255, a: 1
  },
  lineColor: {
    r: 22, g: 22, b: 22, a: 1
  },

  getProjector,

  addKMLLayer,
  removeKMLLayer
};

var graph;
var graphBounds;
// projects lon/lat into current XY plane
var projector;

function getGraphBBox() {
  return graphBounds;
}

function getGraph() {
  return graph;
}

function setGraph(newGraph, bounds, newProjector) {
  graph = newGraph;
  graphBounds = bounds;
  projector = newProjector;
}

function getProjector() {
  return projector;
}

function startOver() {
  appState.zazzleLink = null;
  appState.generatingPreview = false;
  appState.currentState = 'intro';
  appState.blank = false,
  appState.downloadOsmProgress = null;
  appState.kmlLayers = [];
}


function addKMLLayer(name, layer) {
  appState.kmlLayers.push(makeKMLLayerViewModel(name, layer));
}

function removeKMLLayer(layerModel) {
  let layerIndex = appState.kmlLayers.indexOf(layerModel);
  if (layerIndex < 0) {
    throw new Error('Invalid layer to remove');
  }
  appState.kmlLayers.splice(layerIndex, 1);
}

export default appState;

function makeKMLLayerViewModel(name, layer) {
  const viewModel = {
    name,
    color: layer.color,
    width: layer.width,
    updateColor() {
      layer.updateColor(viewModel.color);
    },

    getKMLLayer() { return layer }
  }

  return viewModel;
}