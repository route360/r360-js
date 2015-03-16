/*
 *
 */
r360.TravelTimeControl = L.Control.extend({
   
    /**
      * ...
      * 
      * @param {Object} [options] The typical JS options array.
      * @param {Number} [options.position] 
      * @param {Number} [options.initValue] 
      * @param {Number} [options.label] 
      * @param {Array}  [options.travelTimes] Each element of this arrays has to contain a "time" and a "color" field.
      *     An example would be: { time : 600  , color : "#006837"}. The color needs to be specified in HEX notation.
      * @param {Number} [options.icon] 
      */
    initialize: function (travelTimeControlOptions) {
        
        // use the default options
        this.options = JSON.parse(JSON.stringify(r360.config.defaultTravelTimeControlOptions));

        // overwrite default options if possible
        if ( typeof travelTimeControlOptions !== "undefined" ) {
            
            if ( _.has(travelTimeControlOptions, "position") )    this.options.position     = travelTimeControlOptions.position;
            if ( _.has(travelTimeControlOptions, "unit") )        this.options.unit         = travelTimeControlOptions.unit;
            if ( _.has(travelTimeControlOptions, "initValue") )   this.options.initValue    = travelTimeControlOptions.initValue;
            if ( _.has(travelTimeControlOptions, "label") )       this.options.label        = travelTimeControlOptions.label;
            if ( _.has(travelTimeControlOptions, "travelTimes") ) this.options.travelTimes  = travelTimeControlOptions.travelTimes;
            if ( _.has(travelTimeControlOptions, "icon") )        this.options.icon         = travelTimeControlOptions.icon;
        }

        this.options.maxValue   = _.max(this.options.travelTimes, function(travelTime){ return travelTime.time; }).time / 60;
        this.options.step       = (this.options.travelTimes[1].time - this.options.travelTimes[0].time)/60;
    },

    /*
     *
     */
    onAdd: function (map) {
        var that = this;
        this.options.map = map;
        map.on("resize", this.onResize.bind(this));          

        var sliderColors = "";
        var percent = 100 / this.options.travelTimes.length;
        for(var i = 0; i < this.options.travelTimes.length; i++){
            if(i == 0)
                sliderColors += '<div style="position: absolute; top: 0; bottom: 0; left: ' + i * percent + '%; right: ' + (100 - (i + 1)* percent )+ '%; background-color: ' + this.options.travelTimes[i].color + '; -moz-border-top-left-radius: 8px;-webkit-border-radius-topleft: 8px; border-top-left-radius: 8px; -moz-border-bottom-left-radius: 8px;-webkit-border-radius-bottomleft: 8px; border-bottom-left-radius: 8px;"></div>';
            else if(i < this.options.travelTimes.length -1)
                sliderColors += '<div style="position: absolute; top: 0; bottom: 0; left: ' + i * percent + '%; right: ' + (100 - (i + 1)* percent )+ '%; background-color: ' + this.options.travelTimes[i].color + ';"></div>';
            else if(i == this.options.travelTimes.length -1)
                sliderColors += '<div style="position: absolute; top: 0; bottom: 0; left: ' + i * percent + '%; right: ' + (100 - (i + 1)* percent )+ '%; background-color: ' + this.options.travelTimes[i].color + '; -moz-border-top-right-radius: 8px;-webkit-border-radius-topright: 8px; border-top-right-radius: 8px; -moz-border-bottom-right-radius: 8px;-webkit-border-radius-bottomright: 8px; border-bottom-right-radius: 8px;"></div>';
        }

        // started to remove jQuery dependency here
        // this.options.miBox = L.DomUtil.create("r360-box", "mi-box");
        // this.options.travelTimeInfo = L.DomUtil.create("travelTimeInfo");
        // this.options.travelTimeControl = L.DomUtil.create("travelTimeControl", "no-border");
        // this.options.travelTimeControlHandle = L.DomUtil.create("travelTimeControlHandle", "ui-slider-handle");

        // this.options.labelSpan = L.DomUtil.create("labelSpan");
        // this.options.labelSpan.innerHTML = this.options.label;

        // if ( this.options.icon != 'undefined' ) {

        //     this.options.iconHTML = new Image;
        //     this.options.iconHTML.src = "picture.gif";
        // }

        // this.options.travelTimeSpan = L.DomUtil.create("travelTimeSpan");
        // this.options.travelTimeSpan.innerHTML = this.options.initValue;
        // var unitSpan = L.DomUtil.create("unitSpan");
        // unitSpan.innerHTML = "min";


        // this.options.sliderContainer.innerHTML += this.options.miBox;
        // this.options.miBox.innerHTML += this.options.travelTimeInfo;
        // this.options.miBox.innerHTML += this.options.travelTimeControl;
        // this.options.travelTimeControl.innerHTML =+ travelTimeControlHandle;

        // Create a control sliderContainer with a jquery ui slider
        this.options.sliderContainer = L.DomUtil.create('div', this._container);

        this.options.miBox = $('<div/>', {"class" : "mi-box"});
        this.options.travelTimeInfo = $('<div/>');
        this.options.travelTimeSlider = $('<div/>', {"class" : "no-border"}).append(sliderColors);
        var travelTimeSliderHandle = $('<div/>', {"class" : "ui-slider-handle"});
        this.options.labelSpan = this.options.label;

        if ( this.options.icon != 'undefined' ) this.options.iconHTML = $('<img/>', {"src" : this.options.icon})

        this.options.travelTimeSpan = $('<span/>', {"text" : this.options.initValue });
        var unitSpan = $('<span/>', {"text" : this.options.unit});

        $(this.options.sliderContainer).append(this.options.miBox);
        this.options.miBox.append(this.options.travelTimeInfo);
        this.options.miBox.append(this.options.travelTimeSlider);
        this.options.travelTimeSlider.append(travelTimeSliderHandle);
        this.options.travelTimeInfo.append(this.options.iconHTML).append(this.options.labelSpan).append(this.options.travelTimeSpan).append(unitSpan);

        $(this.options.travelTimeSlider).slider({
            range:  false,
            value:  that.options.initValue,
            min:    0,
            max:    that.options.maxValue,
            step:   that.options.step,
            
            slide: function (e, ui) {
                if ( ui.value == 0) return false;
                $(that.options.travelTimeSpan).text(ui.value);
            },
            stop: function(e, ui){
                var travelTimes = new Array()
                for(var i = 0; i < ui.value; i+= that.options.step)
                    travelTimes.push(that.options.travelTimes[i/that.options.step]);
                that.options.onSlideStop(travelTimes);
            }
        });
        this.onResize();

        /*
        prevent map click when clicking on slider
        */
        L.DomEvent.disableClickPropagation(this.options.sliderContainer);  

        return this.options.sliderContainer;
    },

    /*
     *
     */
    onResize: function(){
        
        if ( this.options.map.getSize().x < 550 ){
            this.removeAndAddClass(this.options.miBox, 'leaflet-traveltime-slider-container-max', 'leaflet-traveltime-slider-container-min');
            this.removeAndAddClass(this.options.travelTimeInfo, 'travel-time-info-max', 'travel-time-info-min');
            this.removeAndAddClass(this.options.travelTimeSlider, 'leaflet-traveltime-slider-max', 'leaflet-traveltime-slider-min');
        }
        else {

            this.removeAndAddClass(this.options.miBox, 'leaflet-traveltime-slider-container-min', 'leaflet-traveltime-slider-container-max');
            this.removeAndAddClass(this.options.travelTimeInfo, 'travel-time-info-min', 'travel-time-info-max');
            this.removeAndAddClass(this.options.travelTimeSlider, 'leaflet-traveltime-slider-min', 'leaflet-traveltime-slider-max');
        }
    },

    /*
     *
     */
    removeAndAddClass: function(id,oldClass,newClass){
        $(id).addClass(newClass);
        $(id).removeClass(oldClass);
    },

    /*
     *
     */
    onSlideStop: function (onSlideStop) {
        var options = this.options;
        options.onSlideStop = onSlideStop;  
    },

    /**
     * [setValue description]
     * @param {[type]} value [description]
     */
    setValue: function(value) {

        $(this.options.travelTimeSlider).slider('value', value);
        $(this.options.travelTimeSpan).text(value);
    },

    /*
     *
     */
    getValues : function() {
        var options = this.options;
        var travelTimes = new Array()

        for(var i = 0; i < $(this.options.travelTimeSlider).slider("value"); i+= options.step) 
            travelTimes.push(options.travelTimes[i/options.step].time);
            
        return travelTimes;
    },

    /**
     * [getMaxValue Returns the maximum selected value in seconds, 
     *              internally it used the getValues method and returns the maximum.]
     *              
     * @return {[Number]}
     */ 
    getMaxValue : function() {

        return _.max(this.getValues());
    }
});

r360.travelTimeControl = function (options) {
    return new r360.TravelTimeControl(options);
};