const metaTags = '[timeout:9000][maxsize:2000000000][out:json];';

const highwayTags = [
  'motorway',
  'motorway_link',
  'trunk',
  'trunk_link',
  'primary',
  'primary_link',
  'secondary',
  'secondary_link',
  'tertiary',
  'tertiary_link',
  'unclassified',
  'unclassified_link',
  'residential',
  'residential_link',
  'service',
  'service_link',
  'living_street',
  'pedestrian',
  'road'
].join('|');


export default {
  roads(bbox) {
    return `${metaTags}
(
  way["highway"~"${highwayTags}"](${bbox});
  node(w);
);
out skel;`
  },
  waterway(bbox) {
    return `${metaTags}
(
  way["waterway"](${bbox});
  node(w);
);
out skel;`
  },
  buildings(bbox) {
    return `${metaTags}
(
  way["building"](${bbox});
  node(w);
);
out skel;`
  },
  rivers(bbox) {
    return `${metaTags}
(
  way["waterway"="river"](${bbox});
  node(w);
);
out skel;`
  },
}

