### L.TileBuffer

Geometry tile buffer objects for leaflet,
storing vertex and color array buffers and tile information.


**Requires**
  - Leaflet 0.7.3 or later


### L.TileBufferCollection

Geometry tile buffer object cache for leaflet,
storing all loaded tile buffers on current zoom level.

**Requires**
  - Leaflet 0.7.3 or later
  - L.TileBuffer


### Usage

Read more: http://geogl.ghost.io/leaflet-geometry-tiling/

```
  /* init cache for tile buffers for current zoom level */
  TILE_CACHE = L.tileBufferCollection(map.getZoom());

  /* [...] create buffers for the tile [...] */

  /* create a tile buffer object for the current tile */
  var tileBuffer = L.tileBuffer(vtx, idx, clr, {
    x: tile.x,
    y: tile.y,
    zoom: map.getZoom()
  });

  /* make sanity check on the tile buffer cache */
  if (TILE_CACHE.getZoom() != map.getZoom()) {
    TILE_CACHE.resetOnZoom(map.getZoom());
  }

  /* add tile buffer geometries to the collection */
  TILE_CACHE.add(tileBuffer);
```


### Copyright & License

(C) 2015 Alexander Schoedon <schoedon@uni-potsdam.de>

GPLv3 attached.


### Credits

Inspired by Stanislav Sumbera's Leaflet Canvas Overlay.
  - http://blog.sumbera.com/2014/04/20/leaflet-canvas/
