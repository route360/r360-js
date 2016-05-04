/* global leaflet map, overlay, canvas */
var m, o, c;

/* global webgl context, shader program */
var gl, sp;

/* global center berlin, default zoom, preload an example tile */
var CENTER_BERLIN = [52.516, 13.377];
var DEFAULT_ZOOM = 14;

/* cache for all tile's vertex, index and color buffers */
var TILE_CACHE;

/* some map geometries */
var EARTH_EQUATOR = 40075016.68557849;
var EARTH_RADIUS = 6378137.0;
var TILE_SIZE  = 256.0;
//   var TILE_SIZE  = 1;

/**
 * initialize the distance map visualization
 */
function distance_map() {

  /* leaflet map canvas */
  m = L.map('map', {
    minZoom: 1,
    maxZoom: 18,
    maxBounds: L.latLngBounds(L.latLng(49.6, 6.0), L.latLng(54.8, 20.4)),
    noWrap: true,
    continuousWorld: false
  }).setView(CENTER_BERLIN, DEFAULT_ZOOM);

  /* setup leaflet canvas webgl overlay */
  o = L.canvasOverlay().drawing(drawGL).addTo(m);
  c = o.canvas()
  o.canvas.width = c.clientWidth;
  o.canvas.height = c.clientHeight;

  /* initialize webgl on canvas overlay */
  initGL();
  initShaders();

  /* setup map with mapbox basemap tiles */
  var tileLayerUrl =
    'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}';
  var attribution =
    '<a href="https://www.mapbox.com/developers/vector-tiles/">Mapbox</a> | '
    + '<a href="https://mapzen.com/projects/vector-tiles/">Mapzen</a> | '
    + 'Rendering &copy; <a href="./LICENSE">Schoedon</a>';
  var token =
    'pk.eyJ1IjoiZG9uc2Nob2UiLCJhIjoiMkN5RUk0QSJ9.FGcEYWjfgcJUmSyN1tkwgQ';
  var mapboxTiles = L.tileLayer(tileLayerUrl, {
    attribution: attribution,
    id: 'mapbox.dark',
    accessToken: token,
    noWrap: true,
    continuousWorld: false
  });

  marker = L.marker(CENTER_BERLIN, { draggable : true }).addTo(m);
  marker.on('dragend', function(){

      TILE_CACHE.resetOnZoom(m.getZoom());
      hardwareTiles.redraw();
    //   drawGL();
  })

  /* init cache for tile buffers for current zoom level */
  TILE_CACHE = L.tileBufferCollection(m.getZoom());

  /* reset tile buffer cache for each zoom level change */
  m.on('zoomstart', function(e) {
    TILE_CACHE.resetOnZoom(m.getZoom());
  });

  /* create webgl geometry tiles */
  hardwareTiles = L.tileLayer.canvas({async:false});
  hardwareTiles.drawTile = function(canvas, tile, zoom) {
      getRoute360TileBuffer(tile, zoom);
  }

  /* redraw the scene after all tiles are loaded */
  hardwareTiles.on('load', function(e) {
      drawGL();
  });

  /* add mapbox and webgl tiles to the map */
  mapboxTiles.addTo(m);
  hardwareTiles.addTo(m);

  /* adjust misc map settings */
  m.zoomControl.setPosition('bottomright');
}

/**
 * initialize webgl context
 */
function initGL() {

  /* wrap webgl context in a debug context */
  gl = WebGLDebugUtils.makeDebugContext(
    WebGLUtils.setupWebGL(c),
    throwOnGLError
  );

  /* init webgl debug context */
  WebGLDebugUtils.init(gl);
}

/**
 * init vertex/fragment shader and shader program
 */
function initShaders() {

  /* vertex shader */
  var vShader = getShader("shader-vtx");

  /* fragment shader */
  var fShader = getShader("shader-frg");

  /* shader program */
  sp = gl.createProgram();
  gl.attachShader(sp, vShader);
  gl.attachShader(sp, fShader);
  gl.linkProgram(sp);

  /* check shader linking */
  if (!gl.getProgramParameter(sp, gl.LINK_STATUS)) {
    log("initShaders(): [ERR]: could not init shaders");
  } else {

    /* use shader programm */
    gl.useProgram(sp);

    /* get attribute and uniform locations */
    sp.uniformMatrix = gl.getUniformLocation(sp, "u_matrix");
    sp.vertexPosition = gl.getAttribLocation(sp, "a_vertex");
    sp.vertexColor = gl.getAttribLocation(sp, "a_color");
    gl.enableVertexAttribArray(sp.vertexPosition);
    gl.enableVertexAttribArray(sp.vertexColor);
  }
}

/**
 * parse shader from dom by id
 *
 * @param {string} id the shader element id in the document
 * @return {object} the compiled shader
 */
function getShader(id) {

  var shader;
  var shaderScript = document.getElementById(id);

  if (!shaderScript) {
    log("getShader(id): [WRN]: shader not found");
    return null;
  }

  var str = "";
  var k = shaderScript.firstChild;
  while (k) {
    if (k.nodeType == 3)
      str += k.textContent;
    k = k.nextSibling;
  }

  if (shaderScript.type == "x-shader/x-fragment") {

    /* fragment shader */
    shader = gl.createShader(gl.FRAGMENT_SHADER);
  } else if (shaderScript.type == "x-shader/x-vertex") {

    /* vertex shader */
    shader = gl.createShader(gl.VERTEX_SHADER);
  } else {
    log("getShader(id): [WRN]: unknown shader type");
    return null;
  }

  gl.shaderSource(shader, str);
  gl.compileShader(shader);

  /* check shader compile status */
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    log("getShader(id): [ERR]: shader failed to compile");
    log(gl.getShaderInfoLog(shader));
    return null;
  }

  return shader;
}

function getRoute360TileBuffer(tile, zoom) {

    /* request tile from tiling server */
    requestTile(tile.x, tile.y, zoom, function(r360Tile){

        if ( r360Tile.tile.gltf.buffers.vertices.length > 0 ) {

            /* define sizes of vertex and color buffer objects */
            var vtxSize = 2;
            var clrSize = 4;

            var green = {
                r : 255.0 / 255.0,
                g : 0.0   / 255.0,
                b : 0.0   / 255.0,
                alpha : 1
            }

            var red = {
                r : 0.0   / 255.0,
                g : 255.0 / 255.0,
                b : 0.0   / 255.0,
                alpha : 1
            }

            /* generate random vertex, index and color buffers */
            var vtx = new Float32Array(vtxSize * r360Tile.tile.gltf.buffers.vertices.length);
            var idx = new Uint16Array(r360Tile.tile.gltf.buffers.indices.length);
            var clr = new Float32Array(clrSize * r360Tile.tile.gltf.buffers.vertices.length);

            /* vertex buffer: random points within the tile bounds */
            for (var i = 0, j = 0; i < r360Tile.tile.gltf.buffers.vertices.length; i += vtxSize, j++) {

              vtx[i]     = r360Tile.tile.gltf.buffers.vertices[i];
              vtx[i + 1] = r360Tile.tile.gltf.buffers.vertices[i + 1];

              clr[i * clrSize]     = red.r + r360Tile.tile.gltf.buffers.colors[j] * (green.r - red.r);
              clr[i * clrSize + 1] = red.g + r360Tile.tile.gltf.buffers.colors[j] * (green.g - red.g);
              clr[i * clrSize + 2] = red.b + r360Tile.tile.gltf.buffers.colors[j] * (green.b - red.b);
              clr[i * clrSize + 3] = 1.0;

              clr[(i + 1) * clrSize]     = red.r + r360Tile.tile.gltf.buffers.colors[j] * (green.r - red.r);
              clr[(i + 1) * clrSize + 1] = red.g + r360Tile.tile.gltf.buffers.colors[j] * (green.g - red.g);
              clr[(i + 1) * clrSize + 2] = red.b + r360Tile.tile.gltf.buffers.colors[j] * (green.b - red.b);
              clr[(i + 1) * clrSize + 3] = 1.0;
            };

            /* index buffer: draw continuous lines */
            for (var i = 0; i < r360Tile.tile.gltf.buffers.indices.length; i++) {
              idx[i] = i;
            }

            /* create a tile buffer object for the current tile */
            var tileBuffer = L.tileBuffer(vtx, idx, clr, {
              x: tile.x,
              y: tile.y,
              zoom: zoom
            });

            /* make sanity check on the tile buffer cache */
            if (TILE_CACHE.getZoom() != zoom) {
              TILE_CACHE.resetOnZoom(zoom);
            }

            /* add tile buffer geometries to the collection */
            TILE_CACHE.addTile(tileBuffer);

            drawGL();
        }
    });
}

/**
 * Requests a tile from the tiling server.
 *
 * @param (Integer) x the x coordinate of the tile
 * @param (Integer) y the y coordinate of the tile
 * @param (Integer) z the zoom factor of the tile
 */
function requestTile(x, y, z, callback) {

    var travelOptions = r360.travelOptions();
    travelOptions.setServiceKey('uhWrWpUhyZQy8rPfiC7X');

    // if (document.location.hostname == "localhost")
        // travelOptions.setServiceUrl('http://localhost:8080/');
    // else
        travelOptions.setServiceUrl('https://dev.route360.net/mobie/');

    travelOptions.addSource(marker);
    travelOptions.setMaxRoutingTime(1200);
    travelOptions.setTravelType('car');
    travelOptions.setX(x);
    travelOptions.setY(y);
    travelOptions.setZ(z);
    r360.MobieService.getGraph(travelOptions, callback);
}

/**
 * draw all tiles from cache on the canvas overlay
 */
function drawGL() {

  /* only proceed if context is available */
  if (gl) {

    /* enable blending */
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    /* disable depth testing */
    gl.disable(gl.DEPTH_TEST);

    /* clear color buffer for redraw */
    gl.clear(gl.COLOR_BUFFER_BIT);

    /* set view port to canvas size */
    gl.viewport(0, 0, c.width, c.height);

    /* get map bounds and top left corner used for webgl translation later */
    var bounds = m.getBounds();
    var topLeft = new L.LatLng(bounds.getNorth(), bounds.getWest());

    /* precalculate map scale, offset and line width */
    var zoom = m.getZoom();
    var scale = Math.pow(2, zoom);
    var offset = latLonToPixels(topLeft.lat, topLeft.lng);
    var width = Math.max(zoom - 12.0, 1.0);

    /* define sizes of vertex and color buffer objects */
    var vtxSize = 2;
    var clrSize = 4;

    /* define model view matrix. here: identity */
    var uMatrix = new Float32Array([
      1,0,0,0,
      0,1,0,0,
      0,0,1,0,
      0,0,0,1
    ]);

    /* translate to move [0,0] to top left corner */
    translateMatrix(uMatrix, -1, 1);

    /* scale based on canvas width and height */
    scaleMatrix(uMatrix, 2.0 / c.width, -2.0 / c.height);

    /* scale based on map zoom scale */
    scaleMatrix(uMatrix, scale, scale);

    /* translate offset to match current map position (lat/lon) */
    translateMatrix(uMatrix, -offset.x, -offset.y);

    /* set model view */
    gl.uniformMatrix4fv(sp.uniformMatrix, false, uMatrix);

    /* adjust line width based on zoom */
    gl.lineWidth(width);

    /* loop all tile buffers in cache and draw each geometry */
    var tileBuffers = TILE_CACHE.getTileBufferCollection();
    for (var i = TILE_CACHE.getSize() - 1; i >= 0; i--) {

      /* create vertex buffer */
      var vtxBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, vtxBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, tileBuffers[i].getVertexBuffer(), gl.STATIC_DRAW);
      gl.vertexAttribPointer(sp.vertexPosition, vtxSize, gl.FLOAT, false, 0, 0);

      /* create color buffer */
      var clrBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, clrBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, tileBuffers[i].getColorBuffer(), gl.STATIC_DRAW);
      gl.vertexAttribPointer(sp.vertexColor, clrSize, gl.FLOAT, false, 0, 0);

      /* create index buffer */
      var idxBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, idxBuffer);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, tileBuffers[i].getIndexBuffer(), gl.STATIC_DRAW);

      /* draw geometry lines by indices */
      gl.drawElements(gl.LINES, tileBuffers[i].getIndexBuffer().length, gl.UNSIGNED_SHORT, idxBuffer);
    }
  }
}

/**
 * helper: simple translation along x/y (2D)
 *
 * @param {Float32Array} m the output matrix to be translated
 * @param {integer} x the translation factor along x
 * @param {integer} y the translation factor along y
 */
function translateMatrix(m, x, y) {
  m[12] += m[0] * x + m[4] * y;
  m[13] += m[1] * x + m[5] * y;
  m[14] += m[2] * x + m[6] * y;
  m[15] += m[3] * x + m[7] * y;
}

/**
 * helper: simple scaling along x/y (2D)
 *
 * @param {Float32Array} m the output matrix to be scaled
 * @param {integer} x the scaling factor along x
 * @param {integer} y the scaling factor along y
 */
function scaleMatrix(m, x, y) {
  m[0] *= x;
  m[1] *= x;
  m[2] *= x;
  m[3] *= x;
  m[4] *= y;
  m[5] *= y;
  m[6] *= y;
  m[7] *= y;
}

/**
 * Converts spherical web mercator to tile pixel X/Y at zoom level 0
 * for 256x256 tile size and inverts y coordinates. (EPSG: 3857)
 *
 * @param {L.point} p Leaflet point with web mercator coordinates
 * @return {L.point} Leaflet point with tile pixel x and y corrdinates
 */
function mercatorToPixels(p)  {
  var pixelX = (p.x + (EARTH_EQUATOR / 2.0)) / (EARTH_EQUATOR / TILE_SIZE);
  var pixelY = ((p.y - (EARTH_EQUATOR / 2.0)) / (EARTH_EQUATOR / -TILE_SIZE));
  return L.point(pixelX, pixelY);
}

/**
 * Converts latitude/longitude to tile pixel X/Y at zoom level 0
 * for 256x256 tile size and inverts y coordinates. (EPSG: 4326)
 *
 * @param {L.point} p Leaflet point in EPSG:3857
 * @return {L.point} Leaflet point with tile pixel x and y corrdinates
 */
function latLonToPixels(lat, lon) {
  var sinLat = Math.sin(lat * Math.PI / 180.0);
  var pixelX = ((lon + 180) / 360) * TILE_SIZE;
  var pixelY = (0.5 - Math.log((1 + sinLat) / (1 - sinLat)) / (Math.PI * 4)) * TILE_SIZE;
  return L.point(pixelX, pixelY);
}

/**
 * get random number between min (inclusive) and max (exclusive)
 *
 * @param {integer} min the lower bounds (inclusive)
 * @param {integer} max the upper bounts (exclusive)
 * @return the desired random number
 */
function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

/**
 * log to console with timestamps
 *
 * @param {string} s the string to log
 */
function log(s) {
  var n = new Date().getTime() / 1000.0;
  window.console.log('[' + n.toFixed(3) + '] ' + s);
}

/**
 * throw webgl errors
 *
 * @param {glEnum} e the webgl error
 * @param {string} f the name of the last function call
 * @param {object} args additional arguments
 * @throws webgl error
 */
function throwOnGLError(e, f, args) {
  throw WebGLDebugUtils.glEnumToString(e) + " was caused by call to " + f;
};
