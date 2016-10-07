if (typeof L === 'object') {
  L.Control.Route360Attribution = L.Control.Attribution.extend({
      options: {
        emblem: '<div class="emblem-wrap">' +
        '<?xml version="1.0" encoding="utf-8"?>' +
        '<svg version="1.1" id="Ebene_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 20 20" xml:space="preserve">' +
        '<style type="text/css">.st0{fill:#56BA64;}</style>' +
        '<g><path class="st0" d="M10,14.3c0,0,2.6-3.1,2.6-5.1c0-1.5-1.2-2.8-2.6-2.8c-1.4,0-2.6,1.3-2.6,2.8C7.4,11.2,10,14.3,10,14.3' +
        'M19.1,14.8C19.1,14.8,19.1,14.8,19.1,14.8c1.2,1.2,1.2,3.1,0,4.3c-1.2,1.2-3.1,1.2-4.3,0c0,0,0,0,0,0h0L10,14.3l-4.8,4.8' +
        'c0,0,0,0,0,0c-1.2,1.2-3.1,1.2-4.3,0c-1.2-1.2-1.2-3.1,0-4.3L5.7,10L0.9,5.2v0c-1.2-1.2-1.2-3.1,0-4.3c1.2-1.2,3.1-1.2,4.3,0' +
        'c0,0,0,0,0,0L10,5.7l4.8-4.8l0,0c0,0,0,0,0,0c1.2-1.2,3.1-1.2,4.3,0c1.2,1.2,1.2,3.1,0,4.3c0,0,0,0,0,0L14.3,10L19.1,14.8"/></g>' +
        '</svg>' +
        '</div>',
        prefix: '<a href="https://www.route360.net/" title="Travel time analysis by Motion Intelligence">route360&deg;</a> | <a href="http://leafletjs.com" title="A JS library for interactive maps">Leaflet</a>'
      },
      onAdd: function(map) {

        var vMaj = parseInt(L.version.split('.')[0], 10);

        if (vMaj >= 1) {
          map.attributionControl = this;
        }

        this._container = L.DomUtil.create('div', 'leaflet-control-attribution');
        if (L.DomEvent) {
          L.DomEvent.disableClickPropagation(this._container);
        }

        for (var i in map._layers) {
          if (map._layers[i].getAttribution) {
            this.addAttribution(map._layers[i].getAttribution());
          }
        }

        if (vMaj < 1) {
          // Leaflet sub 1
          map
            .on('layeradd', this._onLayerAdd, this)
            .on('layerremove', this._onLayerRemove, this);
        }

        this._update();

        L.DomUtil.addClass(this._container, 'leaflet-condensed-attribution');

        return this._container;
      },
      _update: function() {
        if (!this._map) {
          return;
        }

        var attribs = [];

        for (var i in this._attributions) {
          if (this._attributions[i]) {
            attribs.push(i);
          }
        }

        var prefixAndAttribs = [];

        if (this.options.prefix) {
          prefixAndAttribs.push(this.options.prefix);
        }
        if (attribs.length) {
          prefixAndAttribs.push(attribs.join(', '));
        }

        this._container.innerHTML = '<div class="attributes-body">' +
          prefixAndAttribs.join(' | ') +
          '</div><div class="attributes-emblem">' +
          this.options.emblem + '</div>';
      }
    });

    L.Map.mergeOptions({
      attributionControl: false,
      r360AttributionControl: true
    });

    L.Map.addInitHook(function() {
      if (this.options.r360AttributionControl) {
        new L.Control.Route360Attribution().addTo(this);
      }
    });

    L.control.route360Attribution = function(options) {
      return new L.Control.Route360Attribution(options);
    };
  }
