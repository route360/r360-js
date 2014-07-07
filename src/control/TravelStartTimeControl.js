/*
 *
 */
r360.TravelStartTimeControl = L.Control.extend({
    options: {
        position    : 'topright',
        range       : false,
        min         : 0,
        max         : 1440 * 60, // start time is now in seconds
        step        : 10 * 60, // start time is now in seconds
        initValue   : 480 * 60, // start time is now in seconds
        value       : 0
    },

    /*
     *
     */
    initialize: function (options) {

        this.options.value = r360.Util.getHoursAndMinutesInSeconds();
        L.Util.setOptions(this, options);
    },

    /*
     *
     */
    onSlideStop: function (func){

        this.options.slideStop = func;
    },

    /*
     *
     */
    minToString: function(minutes){

        minutes = minutes / 60;
        var hours = Math.floor(minutes / 60);
        var min = minutes - (hours * 60);
        if ( hours > 24 ) hours -= 24;
        if ( hours < 10 ) hours = '0' + hours;
        if ( min < 10 ) min = '0' + min;
        if ( min == 0 ) min = '00';
        return ( hours + ':' + min);
    },

    /*
     *
     */
    onAdd: function (map) {

        var that = this;

        that.options.map = map;
        that.options.mapId = $(map._container).attr("id");

        map.on("resize", this.onResize.bind(this));
        // Create a control sliderContainer with a jquery ui slider
        var sliderContainer = L.DomUtil.create('div', 'startTimeSlider', this._container);

        that.miBox = $('<div/>', {"class" : "mi-box"});
        that.startTimeInfo = $('<div/>');
        that.label = $('<span/>');
        that.slider = $('<div/>');

        $(sliderContainer).append(that.miBox.append(that.startTimeInfo.append(that.label)).append(that.slider))

        $(that.label).text(r360.config.i18n.get('departure') + ': '+ 
            that.minToString(this.options.value) + ' ' + r360.Util.getTimeFormat(that.options.value));

        $(that.slider).slider({
            range:  that.options.range,
            value:  that.options.value,
            min:    that.options.min,
            max:    that.options.max,
            step:   that.options.step,
            
            slide: function (e, ui) {

                $(that.label).text(r360.config.i18n.get('departure') + ': ' +
                    that.minToString(ui.value) + ' ' + r360.Util.getTimeFormat(ui.value));
                
                that.options.value = ui.value;
            },
            stop: function(e, ui){

                that.options.slideStop(ui.value);
            }
        });
    
        this.onResize();
       /*
        prevent map click when clicking on slider
        */
        L.DomEvent.disableClickPropagation(sliderContainer);  

        return sliderContainer;
    },

    /*
     *
     */
    onResize: function(){

        if ( this.options.map.getSize().x < 550 ) {

            this.removeAndAddClass(this.miBox, 'leaflet-traveltime-slider-container-max', 'leaflet-traveltime-slider-container-min');
            this.removeAndAddClass(this.startTimeInfo, 'travel-time-info-max', 'travel-time-info-min');
            this.removeAndAddClass(this.slider, 'leaflet-traveltime-slider-max', 'leaflet-traveltime-slider-min');
        }
        else {
            this.removeAndAddClass(this.miBox, 'leaflet-traveltime-slider-container-min', 'leaflet-traveltime-slider-container-max');
            this.removeAndAddClass(this.startTimeInfo, 'travel-time-info-min', 'travel-time-info-max');
            this.removeAndAddClass(this.slider, 'leaflet-traveltime-slider-min', 'leaflet-traveltime-slider-max');
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
    getValue : function() {    
        return this.options.value;
    }
});

r360.travelStartTimeControl = function () {
    return new r360.TravelStartTimeControl();
};