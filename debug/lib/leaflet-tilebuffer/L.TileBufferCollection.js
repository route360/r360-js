/*
  Geometry tile buffer object cache for leaflet,
  storing all loaded tile buffers on current zoom level.

  ** Requires **
    - Leaflet 0.7.3 or later
    - L.TileBuffer

  ** Copyright & License **
  (C) 2015 Alexander Schoedon <schoedon@uni-potsdam.de>

  All rights reserved.

  Redistribution and use in source and binary forms, with or without modification,
  are permitted provided that the following conditions are met:

     1. Redistributions of source code must retain the above copyright notice,
        this list of conditions and the following disclaimer.

     2. Redistributions in binary form must reproduce the above copyright notice,
        this list of conditions and the following disclaimer in the documentation
        and/or other materials provided with the distribution.

  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
  ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
  WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
  DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
  ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
  (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
  LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
  ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
  SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

  ** Credits **
  Inspired by Stanislav Sumbera's Leaflet Canvas Overlay.
    - http://blog.sumbera.com/2014/04/20/leaflet-canvas/

  Inspired by Vladimir Agafonkin's Leaflet Heat Maps.
    - https://github.com/Leaflet/Leaflet.heat
*/

/**
 * Leaflet tile buffer collection class
 */
L.TileBufferCollection = L.Class.extend({

  /* Public member variables for the collection size and current zoom */
  size : 0,           /* number of tiles at this zoom level    */
  zoom : -1,          /* current zoom level                    */

  /* Actual tile buffer objects collection */
  collection : [],

  /* Default options (blank on purpose) */
  options : {},

  /**
   * Initialize a new leaflet tile buffer collection object
   *
   * @param {Integer} zoom the current zoom level for this collection
   * @param {Array} options an array of options for the tile (none)
   */
  initialize : function(zoom, options) {
    this.zoom = zoom;
    L.setOptions(this, options);
  },

  /**
   * Updates the leaflet tile buffer collection object
   *
   * @param {Integer} zoom the current zoom level for this collection
   * @param {Array} options an array of options for the tile (none)
   * @return {Object} the updated tile buffer collection object
   */
  params : function(zoom, options) {
    this.zoom = zoom;
    L.setOptions(this, options);
    return this;
  },

  /**
   * Adds a tile buffer object to the collection
   *
   * @param {L.TileBuffer} tileBuffer the tile buffer object
   * @return {Boolean} true if it was added correctly
   */
  addTile : function(tileBuffer) {

    /* only proceed if tileBuffer looks valid */
    if (tileBuffer.isSane() && tileBuffer.getZoom() == this.zoom) {
      this.size += 1;
      this.collection.push(tileBuffer);
      return true;
    } else {
      return false;
    }
  },

  /* @TODO prepared structure */
  updateTile : function(tileBuffer) { /* @TODO */ },
  removeTile : function(x, y, zoom) { /* @TODO */ },

  /**
   * Gets the size of the tile buffer collection
   *
   * @return {Integer} the size of the tile buffer collection
   */
  getSize : function() {
    return this.size;
  },

  /**
   * Gets the zoom factor of the tile buffer collection
   *
   * @return {Integer} the zoom factor of the tile buffer collection
   */
  getZoom : function() {
    return this.zoom;
  },

  /**
   * Gets the complete tile buffer collection
   *
   * @return {Array} the complete tile buffer collection
   */
  getTileBufferCollection : function() {
    return this.collection;
  },

  /**
   * Checks if the collection matches the desired zoom level.
   *
   * @param {Integer} zoom the zoom factor of the collection
   * @return {Boolean} true if zoom level is valid
   */
  isZoomLevel : function(zoom) {
    if (this.zoom == zoom) {
      return true;
    } else {
      return false;
    }
  },

  /**
   * Checks if collection is empty.
   *
   * @return {Boolean} true collection is empty
   */
  isEmpty : function() {
    if (this.size < 1 || this.collection.length < 1) {
      return true;
    } else {
      return false;
    }
  },

  /**
   * Checks if this is a valid collection. Use with caution.
   *
   * @return {Boolean} true if collection parameters look sane.
   */
  isSane : function() {
    if (this.size < 1 || this.zoom < 0) {
      return false;
    } else {

      /* careful!!! */
      return true;
    }
  },


  /**
   * Clears the collection on zoom level change.
   *
   * @param {Integer} zoom the new zoom level for this collection
   */
  resetOnZoom : function(zoom) {
    this.size = 0;
    this.zoom = zoom;
    this.collection = [];
  },

  /**
   * Hard reset! Clears all collection objects. Don't use it.
   */
  resetHard : function() {
    this.size = 0;
    this.zoom = -1,
    this.collection = [];
  },

  /**
   * Creates a string representation of the tile buffer collection
   *
   * @return {String} a string representation of the tile buffer collection
   */
  toString : function() {
    return "L.TileBufferCollection: Zoom(" + this.zoom + "), Size(" + this.size + ").";
  },
});

/**
 * A wrapper function to create a tile buffer collection.
 *
 * @param {Integer} zoom the current zoom level for this collection
 * @param {Array} options an array of options for the tile (none)
 * @return {Object} a tile buffer collection object
 */
L.tileBufferCollection = function (zoom, options) {
  return new L.TileBufferCollection(zoom, options);
};
