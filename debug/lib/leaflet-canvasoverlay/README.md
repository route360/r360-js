### L.CanvasOverlay

Leaflet Canvas Overlay is a straightforward full screen canvas overlay class
that calls custom user function for gl drawing.

**Requires**
  - Leaflet 0.7.3 or later


### Usage

Read more:
- http://geogl.ghost.io/leaflet-canvas-overlay/
- http://blog.sumbera.com/2014/04/20/leaflet-canvas/
- http://bl.ocks.org/sumbera/11114288

```
  /* setup leaflet canvas webgl overlay */
  ovl = L.canvasOverlay().drawing(drawGL).addTo(map);
  cnv = ovl.canvas()
  ovl.canvas.width = cnv.clientWidth;
  ovl.canvas.height = cnv.clientHeight;
```

... where `drawGL()` is your custom user draw function.


### Copyright & License

Originally (C) 2014 Stanislav Sumbera

Maintained by Alexander Schoedon <schoedon@uni-potsdam.de>

GPLv3 attached.


### Credits

Inspired and portions taken from:
  - https://github.com/Leaflet/Leaflet.heat
