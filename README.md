# [Map Print](https://anvaka.github.io/map-print/)

Print a map of roads on a mug.

![demo](https://i.imgur.com/lXBMVxV.gif)

## Why?

I love maps and travels. Every time I grab a Vancouver mug - not only it is filled with hot coffee,
it is also filled with warm memories. 

![vancouver mug](https://i.imgur.com/XiISjy3.png)

Now you too can [make a mug from the roads network](https://anvaka.github.io/map-print/) of a city that you've visited (or planning to visit).
Or give it as a gift to those whom you care about. I hope you like what this project does.

I'm giving away the entire source code for free. Yet I think you should know: with every purchase 
coming from this project, Zazzle gives me a small revenue from the sale. 
So every purchase supports this project.

Your ideas and suggestions are more than welcomed!

## How?

The original map is rendered with [mapbox-gl](https://github.com/mapbox/mapbox-gl-js). When you find an 
area that you like and click the "Start" button - I send request to the [OpenStreet Map](https://www.openstreetmap.org/)
with [Overpass-Turbo](http://overpass-turbo.eu/) API to fetch all the roads in a given bounding box.

These roads are then rendered with my own tiny-toy WebGL rendering engine [w-gl](https://github.com/anvaka/w-gl).
The engine is not ready for production use, but it can render millions of roads very quickly. 

Virtualization is a common technique used by mapping software to reduce amount of things rendered 
on the screen and focus user's attention on major facets of a map. `w-gl` gives unique opportunity to
see how road networks look without virtualization. I.e. every single road is rendered on the screen, regardless
of the zoom level.

Sometimes it's just a single large blob of ink, but more often you'd see [beautiful patterns](https://twitter.com/anvaka/status/1005527424757448704) on the screen.

That said, I wouldn't recommend zooming out too far. When I tried it - I had either OpenStreetMap failing my requests,
or my browser running out of memory. You will see a warning on the screen if you zoom out too far.

## Local Development

Get the package and its dependencies

```
git clone https://github.com/anvaka/map-print.git
npm install
cd map-print
```

And then start the local server:

```
npm start
```

This should open a server on http://localhost:8080

## License

MIT. 

If you'd like to support the project - here is my Patreon page: https://www.patreon.com/anvaka 🧙
