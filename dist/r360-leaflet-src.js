/*
 Route360° JavaScript API v0.2.1 (212dc08), a JS library for leaflet maps. http://route360.net
 (c) 2014 Henning Hollburg and Daniel Gerber, (c) 2014 Motion Intelligence GmbH
*/
(function (window, document, undefined) {r360.photonPlaceAutoCompleteControl = function (options) {
    return new r360.PhotonPlaceAutoCompleteControl(options);
};

r360.PhotonPlaceAutoCompleteControl = L.Control.extend({

    initialize: function(options){

        this.options = JSON.parse(JSON.stringify(r360.config.photonPlaceAutoCompleteOptions));

        if ( typeof options !== "undefined" ) {
            
            if ( r360.has(options, 'position'))    this.options.position    = options.position;
            if ( r360.has(options, 'label'))       this.options.label       = options.label;
            if ( r360.has(options, 'country'))     this.options.country     = options.country;
            if ( r360.has(options, 'reset'))       this.options.reset       = options.reset;
            if ( r360.has(options, 'serviceUrl'))  this.options.serviceUrl  = options.serviceUrl;
            if ( r360.has(options, 'reverse'))     this.options.reverse     = options.reverse;
            if ( r360.has(options, 'placeholder')) this.options.placeholder = options.placeholder;
            if ( r360.has(options, 'width'))       this.options.width       = options.width;
            if ( r360.has(options, 'maxRows'))     this.options.maxRows     = options.maxRows;
            if ( r360.has(options, 'image'))       this.options.image       = options.image;
            if ( r360.has(options, 'index'))       this.options.index       = options.index;
            if ( r360.has(options, 'autoHide'))    this.options.autoHide      = options.autoHide;
            if ( r360.has(options, 'options')) {

                 this.options.options    = options.options;
                 this.options.travelType = r360.has(this.options.options, 'init') ? this.options.options.init : 'walk';
            }   
        }
    },

    toggleOptions : function(container){

        var that = this;

        if ( typeof container == 'undefined' )
            $('#' + that.options.id + '-options').slideToggle();
        else 
            $(container).find('#' + that.options.id + '-options').slideToggle();
    },

    onAdd: function(map){
        
        var that = this;
        var i18n            = r360.config.i18n;   
        var countrySelector =  "";
        var nameContainer   = L.DomUtil.create('div', that._container);
        that.options.map    = map;
        that.options.id     = $(map._container).attr("id") + r360.Util.generateId(10);

        map.on("resize", that.onResize.bind(that));          

        // calculate the width in dependency to the number of buttons attached to the field
        var width = that.options.width;
        // if ( that.options.reset ) width += 44;
        // if ( that.options.reverse ) width += 37;
        var style = 'style="width:'+ width +'px;"';

        that.options.input = 
            '<div class="input-group autocomplete" '+style+'> \
                <input id="autocomplete-'+that.options.id+'" style="color: black;width:'+width+'" \
                type="text" class="form-control r360-autocomplete" placeholder="' + that.options.placeholder + '" onclick="this.select()">';

        if ( that.options.image ) {

            that.options.input += 
                '<span id="'+that.options.id+'-image" class="input-group-addon btn-autocomplete-marker"> \
                    <img style="height:22px;" src="'+that.options.image+'"> \
                 </span>';
        }

        var optionsHtml = [];
        // if ( that.options.options ) {

            that.options.input += 
                '<span id="'+that.options.id+'-options-button" class="input-group-btn travel-type-buttons" ' + (!that.options.options ? 'style="display: none;"' : '') + '> \
                    <button class="btn btn-autocomplete" type="button" title="' + i18n.get('settings') + '"><i class="fa fa-cog fa-fw"></i></button> \
                </span>';

            optionsHtml.push('<div id="'+that.options.id+'-options" class="text-center" style="color: black;width:'+width+'; display: none;">');
            optionsHtml.push('  <div class="btn-group text-center">');

            if ( that.options.options && that.options.options.walk ) 
                optionsHtml.push('<button type="button" class="btn btn-default travel-type-button ' 
                    + (this.options.travelType == 'walk' ? 'active' : '') + 
                    '" travel-type="walk"><span class="fa fa-male travel-type-icon"></span> <span lang="en">Walk</span><span lang="no">Gå</span><span lang="de">zu Fuß</span></button>');
            
            if ( that.options.options && that.options.options.bike ) 
                optionsHtml.push('<button type="button" class="btn btn-default travel-type-button '
                    + (this.options.travelType == 'bike' ? 'active' : '') + 
                    '" travel-type="bike"><span class="fa fa-bicycle travel-type-icon"></span> <span lang="en">Bike</span><span lang="no">Sykle</span><span lang="de">Fahrrad</span></button>');

            if ( that.options.options && that.options.options.rentbike ) 
                optionsHtml.push('<button type="button" class="btn btn-default travel-type-button '
                    + (this.options.travelType == 'rentbike' ? 'active' : '') + 
                    '" travel-type="rentbike"> \
                            <span class="fa fa-bicycle travel-type-icon"></span> <span lang="en">Hire Bike</span><span lang="no">Bysykkel</span><span lang="de">Leihfahrrad</span>\
                        </button>');

            if ( that.options.options && that.options.options.rentandreturnbike ) 
                optionsHtml.push('<button type="button" class="btn btn-default travel-type-button '
                    + (this.options.travelType == 'rentandreturnbike' ? 'active' : '') + 
                    '" travel-type="rentandreturnbike"> \
                            <span class="fa fa-bicycle travel-type-icon"></span> <span lang="en">Hire & Return Bike</span><span lang="no">Bysykkel</span><span lang="de">Leihfahrrad</span>\
                        </button>');
            
            if ( that.options.options && that.options.options.ebike ) 
                optionsHtml.push('<button type="button" class="btn btn-default travel-type-button '
                    + (this.options.travelType == 'ebike' ? 'active' : '') + 
                    '" travel-type="ebike"><span class="fa fa-bicycle travel-type-icon"></span> <span lang="en">E-Bike</span><span lang="no">Elsykkel</span><span lang="de">E-Fahrrad</span></button>');
            
            if ( that.options.options && that.options.options.transit ) 
                optionsHtml.push('<button type="button" class="btn btn-default travel-type-button '
                    + (this.options.travelType == 'transit' ? 'active' : '') + 
                    '" travel-type="transit"><span class="map-icon-train-station travel-type-icon"></span> <span lang="en">Transit</span><span lang="de">ÖPNV</span></button>');
            
            if ( that.options.options && that.options.options.car ) 
                optionsHtml.push('<button type="button" class="btn btn-default travel-type-button '
                    + (this.options.travelType == 'car' ? 'active' : '') + 
                    '" travel-type="car"><span class="fa fa-car"></span> <span lang="en">Car</span><span lang="de">Auto</span></button>');
            
            optionsHtml.push('  </div>');
            optionsHtml.push('</div>');
        // }

        // add a reset button to the input field
        // if ( that.options.reset ) {

             that.options.input += 
                '<span id="'+that.options.id+'-reverse" ' + (!that.options.reverse ? 'style="display: none;"' : '') + '" class="input-group-btn"> \
                    <button class="btn btn-autocomplete" type="button" title="' + i18n.get('reverse') + '"><i class="fa fa-arrows-v fa-fw"></i></button> \
                </span>';

            that.options.input += 
                '<span id="'+that.options.id+'-reset" ' + (!that.options.reset ? 'style="display: none;"' : '') + '" class="input-group-btn"> \
                    <button class="btn btn-autocomplete" type="button" title="' + i18n.get('reset') + '"><i class="fa fa-times fa-fw"></i></button> \
                </span>';
        // }
        // if ( that.options.reverse ) {

           
        // }

        that.options.input += '</div>';
        if ( that.options.options ) that.options.input += optionsHtml.join('');

        // add the control to the map
        $(nameContainer).append(that.options.input);

        $(nameContainer).find('#' + that.options.id + '-reset').click(function(){ that.options.onReset(); });
        $(nameContainer).find('#' + that.options.id + '-reverse').click(function(){ that.options.onReverse(); });
        $(nameContainer).find('#' + that.options.id + '-options-button').click(
            function(){ 
                // slide in or out on the click of the options button
                $('#' + that.options.id + '-options').slideToggle();
            });

        $(nameContainer).find('.travel-type-button').click(function(){

            $(nameContainer).find('.travel-type-button').removeClass('active');
            $(this).addClass('active');

            if ( that.options.autoHide ) {

                setTimeout(function() {
                    $('#' + that.options.id + '-options').slideToggle();
                }, 300);
            }

            that.options.travelType = $(this).attr('travel-type');
            that.options.onTravelTypeChange();
        });

        // no click on the map, if click on container        
        L.DomEvent.disableClickPropagation(nameContainer);      

        if ( r360.has(that.options, 'country' ) ) countrySelector += " AND country:" + that.options.country;

        $(nameContainer).find("#autocomplete-" + that.options.id).autocomplete({

            source: function( request, response ) {

                that.source = this;

                //var requestElements = request.term.split(" ");
                //var numbers = new Array();
                var requestString = request.term;
                //var numberString = "";
                    
                // for(var i = 0; i < requestElements.length; i++){
                    
                //     if(requestElements[i].search(".*[0-9].*") != -1)
                //         numbers.push(requestElements[i]);
                //     else
                //         requestString += requestElements[i] + " ";
                // }

                // if ( numbers.length > 0 ) {
                //     numberString += " OR ";
                    
                //     for(var j = 0; j < numbers.length; j++){
                //         var n = "(postcode : " + numbers[j] + " OR housenumber : " + numbers[j] + " OR street : " + numbers[j] + ") ";
                //         numberString +=  n;
                //     }
                // }

                $.ajax({
                    url: "https://service.route360.net/geocode/api/", 
                    // dataType: "jsonp",
                    // jsonp: 'json.wrf',
                    async: false,
                    data: {
                      // wt:'json',
                      // indent : true,
                      // rows: that.options.maxRows,
                      // qt: 'en',
                      // q:  "(" + requestString + numberString + ")" + countrySelector
                      q : requestString,
                      limit : that.options.maxRows
                      // lat : that.options.map.getCenter().lat,
                      // lon : that.options.map.getCenter().lng
                    }, 
                    success: function( data ) {

                        var places = new Array();
                        response( $.map( data.features, function( feature ) {

                            if ( feature.osm_key == "boundary" ) return;

                            var place           = {};
                            var firstRow        = [];
                            var secondRow       = [];
                            place.name          = feature.properties.name;
                            place.city          = feature.properties.city;
                            place.street        = feature.properties.street;
                            place.housenumber   = feature.properties.housenumber;
                            place.country       = feature.properties.country;
                            place.postalCode    = feature.properties.postcode;
                            if (place.name)       firstRow.push(place.name);
                            if (place.city)       firstRow.push(place.city);
                            if (place.street)     secondRow.push(place.street);
                            if (place.housenumber) secondRow.push(place.housenumber);
                            if (place.postalCode) secondRow.push(place.postalCode);
                            if (place.city)       secondRow.push(place.city);

                            // only show country if undefined
                            // if ( !r360.has(that.options, 'country') && place.country ) 
                                secondRow.push(place.country);

                            // if same looking object is in list already: return 
                            if ( r360.contains(places, firstRow.join() + secondRow.join()) ) return; 
                            else places.push(firstRow.join() + secondRow.join());

                            return {
                                label       : firstRow.join(", "),
                                value       : firstRow.join(", "),
                                firstRow    : firstRow.join(", "),
                                secondRow   : secondRow.join(" "),
                                term        : request.term,
                                index       : that.options.index,
                                latlng      : new L.LatLng(feature.geometry.coordinates[1], feature.geometry.coordinates[0])
                            }
                        }));
                    }
                });
            },
            minLength: 2,
              
            select: function( event, ui ) {
                that.options.value = ui.item;
                that.options.onSelect(ui.item);
            }
        })
        .data("ui-autocomplete")._renderItem = function( ul, item ) {

            // this has been copied from here: https://github.com/angular-ui/bootstrap/blob/master/src/typeahead/typeahead.js
            // thank you angular bootstrap team
            function escapeRegexp(queryToEscape) {
                return queryToEscape.replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1');
            }

            var highlightedFirstRow = 
                item.term ? (item.firstRow).replace(new RegExp(escapeRegexp(item.term), 'gi'), '<strong>$&</strong>') : item.firstRow;

            var highlightedSecondRow = 
                item.term ? (item.secondRow).replace(new RegExp(escapeRegexp(item.term), 'gi'), '<strong>$&</strong>') : item.secondRow;

            var html = "<a><span class='address-row1'>"+ highlightedFirstRow + "</span><br/><span class='address-row2'>  " + highlightedSecondRow + "</span></a>";

            return $( "<li>" ).append(html).appendTo(ul);
        };
        
        this.onResize();     

        return nameContainer;
    },

    updateI18n : function(source) {

        var that = this;
        $("#autocomplete-" + that.options.id).attr("placeholder", r360.config.i18n.get(source ? 'placeholderSrc' : 'placeholderTrg'));
        $('#' + that.options.id + '-reverse-button').attr('title', r360.config.i18n.get('reverse'));
        $('#' + that.options.id + '-reset-button').attr('title', r360.config.i18n.get('reset'));
        $('#' + that.options.id + '-options-btn').attr('title', r360.config.i18n.get('settings'));
        
    },

    onSelect: function(onSelect){

        this.options.onSelect = onSelect;
    },

    onReset: function(onReset){

        this.options.onReset = onReset;
    },

    onReverse: function(onReverse){
       
       this.options.onReverse = onReverse;
    },

    onTravelTypeChange: function(onTravelTypeChange){

        this.options.onTravelTypeChange = onTravelTypeChange;
    },

    reset : function(){

        this.options.value = {};
        this.setFieldValue("");
    },

    update : function(latLng, fieldValue) {

        this.setLatLng(latLng);
        this.setFieldValue(fieldValue);
    },

    setLatLng : function(latLng) {

        this.options.value.latlng = latLng
    },

    setFieldValue : function(value){

        var that = this;
        $("#autocomplete-" + that.options.id).val(value);
    },

    getFieldValue : function(){

        var that = this;
        return $("#autocomplete-" + that.options.id).val();
    },

    getTravelType : function(){

        return this.options.travelType;
    },

    setValue : function(value){
        this.options.value = value;
    },

    getValue : function(){
        return this.options.value;
    },

    getIndex : function(){
        return this.options.index;
    },

    onResize: function(){
        
        var that = this;
        if ( this.options.map.getSize().x < 550) $(that.options.input).css({'width':'45px'});
        else $(that.options.input).css({'width':''});
    }
})

/*
 *
 */
r360.TravelStartDateControl = L.Control.extend({
    
    options: {
        position: 'topright',
        dateFormat: "yy-mm-dd",
        minDate: 0
    },

    initialize: function (options) {
        L.Util.setOptions(this, options);
    },

    onChange: function (func){
        this.options.onChange = func;
    },

    onAdd: function (map) {
        var that = this;
        that.options.map = map;
       
        var dateContainer = L.DomUtil.create('div', 'startDatePicker', this._container);

        that.datepicker = $('<div/>');

        $(dateContainer).append(that.datepicker);

        var options = {

            onSelect: function() { that.options.onChange(that.getValue()); },
            firstDay: 1
        }

        var i18n = r360.config.i18n;

        if ( i18n.language != 'en' ) {

            options.monthNames  = i18n.monthNames[i18n.language];
            options.dayNames    = i18n.dayNames[i18n.language];
            options.dayNamesMin = i18n.dayNamesMin[i18n.language];
        }

        $(that.datepicker).datepicker(options);    

        L.DomEvent.disableClickPropagation(dateContainer);         
       
        return dateContainer;
    },

    getValue : function() {   
        var that = this;
        var date = $(that.datepicker).datepicker({ dateFormat: 'dd-mm-yy' }).val()
        var splitDate = date.split('/');
        var yyyymmdd = splitDate[2] + '' + splitDate[0] + '' + splitDate[1];
        return yyyymmdd;
    }
});

r360.travelStartDateControl = function () {
    return new r360.TravelStartDateControl();
};

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
            
            if ( r360.has(travelTimeControlOptions, "position") )    this.options.position     = travelTimeControlOptions.position;
            if ( r360.has(travelTimeControlOptions, "unit") )        this.options.unit         = travelTimeControlOptions.unit;
            if ( r360.has(travelTimeControlOptions, "initValue") )   this.options.initValue    = travelTimeControlOptions.initValue;
            if ( r360.has(travelTimeControlOptions, "label") )       this.options.label        = travelTimeControlOptions.label;
            if ( r360.has(travelTimeControlOptions, "travelTimes") ) this.options.travelTimes  = travelTimeControlOptions.travelTimes;
            if ( r360.has(travelTimeControlOptions, "icon") )        this.options.icon         = travelTimeControlOptions.icon;
        }

        this.options.maxValue   = r360.max(this.options.travelTimes, function(travelTime){ return travelTime.time; }).time / 60;
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

        if ( r360.has(this.options, 'icon') && this.options.icon !== 'undefined' ) this.options.iconHTML = $('<img/>', {"src" : this.options.icon})

        this.options.travelTimeSpan = $('<span/>', {"text" : this.options.initValue });
        var unitSpan = $('<span/>', {"text" : this.options.unit});

        $(this.options.sliderContainer).append(this.options.miBox);
        this.options.miBox.append(this.options.travelTimeInfo);
        this.options.miBox.append(this.options.travelTimeSlider);
        this.options.travelTimeSlider.append(travelTimeSliderHandle);
        this.options.travelTimeInfo.append(this.options.iconHTML).append(this.options.labelSpan).append(": ").append(this.options.travelTimeSpan).append(unitSpan);

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

        return r360.max(this.getValues());
    }
});

r360.travelTimeControl = function (options) {
    return new r360.TravelTimeControl(options);
};

r360.waitControl = function (options) {
    return new L.Control.WaitControl(options);
};

L.Control.WaitControl = L.Control.extend({
    
    options: {
        position : 'topleft'
    },

    initialize: function (options) {
        L.Util.setOptions(this, options);
    },

    onAdd: function (map) {
        this.options.map = map;
        this.options.mapId = $(map._container).attr("id");
       
        var waitContainer = L.DomUtil.create('div', 'leaflet-control-wait');
        $(waitContainer).append(
            '<div id="wait-control-'+this.options.mapId+'" class="mi-box waitControl"> \
                <i class="fa fa-spinner fa-spin"></i> '+ (typeof this.options.text != 'undefined' ? this.options.text : r360.config.i18n.get('wait') ) +  '\
            </div>');

        return waitContainer;
    },

    updateText : function(html) {

        $('#wait-control-'+this.options.mapId).html('<i class="fa fa-spinner fa-spin"></i> ' + html);
        $("span[lang][lang!='"+r360.config.i18n.language+"']").hide();
    },

    show : function(){

        $('#wait-control-'+this.options.mapId).show();
    },

    hide : function(){
        
        $('#wait-control-'+this.options.mapId).hide();  
    }
});

r360.htmlControl = function (options) {
    return new L.Control.HtmlControl(options);
};

L.Control.HtmlControl = L.Control.extend({
    
    options: {
        position: 'topleft',
    },

    initialize: function (options) {
        L.Util.setOptions(this, options);
    },

    onAdd: function (map) {

        // in case of multiple maps per page
        this.options.id  = $(map._container).attr("id") + r360.Util.generateId();
       
        var htmlContainer = L.DomUtil.create('div', 'leaflet-control-html');
        $(htmlContainer).append('<div id="html-control-'+this.options.id+'" class="html-control '+ this.options.classes +'"></div>');

        $(htmlContainer).on('mouseover', function(){ map.scrollWheelZoom.disable(); });
        $(htmlContainer).on('mouseout' , function(){ map.scrollWheelZoom.enable(); });      

        return htmlContainer;
    },

    setHtml : function(html) {
        $('#html-control-'+this.options.id).html(html);        
    },

    show : function(){

        $('#html-control-'+this.options.id).show();
    },

    hide : function(){
        
        $('#html-control-'+this.options.id).hide();  
    },

    toggle : function(){
        
        $('#html-control-'+this.options.id).toggle();  
    }
});

r360.RadioButtonControl = L.Control.extend({

    initialize: function (options) {

        this.options = JSON.parse(JSON.stringify(r360.config.defaultRadioOptions));

        if ( typeof options !== 'undefined') { 
            
            if ( typeof options.position !== 'undefined' ) this.options.position = options.position;
            if ( typeof options.buttons  !== 'undefined' ) this.options.buttons  = options.buttons;
            if ( typeof options.onChange !== 'undefined' ) this.options.onChange = options.onChange;
        }
        else alert("No buttons supplied!");
    },

    onAdd: function (map) {

        var that = this;

        this.options.map    = map;
        var buttonContainer = L.DomUtil.create('div', this._container);
        this.options.input  = this.getRadioButtonHTML();
        $(buttonContainer).append(this.options.input);

        $(this.options.input).buttonset({}).change(function(){

            that.options.checked = $("input[name='r360_radiobuttongroup_" + that.options.buttonGroupId + "']:checked").attr("key");
            that.options.onChange(that.options.checked);
        });  

        $(this.options.input).each(function(index){

            $(this).tooltip({
                open: function( event, ui ) {
                    $("[lang='de'], [lang='en'], [lang='no']").hide();
                    $("[lang='"+r360.config.i18n.language+"']").show();
                },
                content: function () {
                      return $(this).attr('title');
                },
                position: {
                    my: "center top+10",
                    at: "center bottom",
                    using: function( position, feedback ) {
                        $( this ).css( position );
                        $( "<div>" )
                        .addClass( "arrow top" )
                        .addClass( feedback.vertical )
                        .addClass( feedback.horizontal )
                        .appendTo( this );
                    }
                }
            });
        }); 

        // prevent map click when clicking on slider
        L.DomEvent.addListener(buttonContainer, 'click', L.DomEvent.stopPropagation);

        return buttonContainer;
    },

    onChange: function (func){
        this.options.onChange = func;      
    },

    setValue: function(key) {

        $("input[name='r360_radiobuttongroup_" + this.options.buttonGroupId + "']:checked").next().removeClass("ui-state-active");
        var a = $("input[name='r360_radiobuttongroup_" + this.options.buttonGroupId + "'][key='"+key+"']");
        a.attr("checked", true);
        a.addClass('checked');
        a.next().addClass( "ui-state-active" );
        this.options.checked = key;
    },

    getValue: function(){

        return this.options.checked;
    },

    getRadioButtonHTML: function(){

        var that = this; 

        // generate an ID for the complete button group
        that.options.buttonGroupId = r360.Util.generateId(5);

        var div = $('<div/>', { id : that.options.buttonGroupId });
        div.addClass('r360-box-shadow');

        // add each button to the group
        r360.each(that.options.buttons, function(button){

            // generate a unique id for each button
            var id = r360.Util.generateId();

            var input = $('<input/>', { 
                "type" : 'radio', 
                "id"   : 'r360_' + id, 
                "value": button.key, 
                "key"  : button.key, 
                "name" : 'r360_radiobuttongroup_' + that.options.buttonGroupId
            });

            var label = $('<label/>', { 
                "for"  : 'r360_' + id, 
                "html" : button.label
            });

            // make the button selected (default buttin)
            if ( button.checked ) {

                that.options.checked = button.key;
                input.attr({"checked" : "checked"})
            };
            // add a tooltip if one was provided
            if ( typeof button.tooltip != 'undefined' ) 
                label.attr({"title" : button.tooltip});//
                //{

            //     label.tooltip({
            //         content: "asd",
            //         position: {
            //             my: "center top+10",
            //             at: "center bottom",
            //             using: function( position, feedback ) {
            //                 $( this ).css( position );
            //                 $( "<div>" )
            //                 .addClass( "arrow top" )
            //                 .addClass( feedback.vertical )
            //                 .addClass( feedback.horizontal )
            //                 .appendTo( this );
            //             }
            //         }
            //     });
            // }
                

            div.append(input);
            div.append(label);
        });

        return div;
    },
});

r360.radioButtonControl = function (options) {
    return new r360.RadioButtonControl(options);
};

r360.CheckboxButtonControl = L.Control.extend({

    initialize: function (options) {

        this.options = JSON.parse(JSON.stringify(r360.config.defaultRadioOptions));
        this.options.checked = {};

        if ( typeof options !== 'undefined') { 
            
            if ( typeof options.position !== 'undefined' ) this.options.position = options.position;
            if ( typeof options.buttons  !== 'undefined' ) this.options.buttons  = options.buttons;
            if ( typeof options.onChange !== 'undefined' ) this.options.onChange = options.onChange;
        }
        else alert("No buttons supplied!");
    },

    onAdd: function (map) {

        var that = this;

        this.options.map    = map;
        var buttonContainer = L.DomUtil.create('div', this._container);
        this.options.input  = this.getCheckboxButtonHTML();
        $(buttonContainer).append(this.options.input);

        $(this.options.input).buttonset({}).change(function(){

            $("input:checkbox[name='r360_checkboxbuttongroup_" + that.options.buttonGroupId + "']").each(function() {

                if ( $(this).is(':checked') ) that.options.checked[$(this).attr('key')] = true;
                else  that.options.checked[$(this).attr('key')] = false;
            });

            that.options.onChange(that.options.checked);
        });  

        $(this.options.input).each(function(){

            $(this).tooltip({
                open: function( event, ui ) {
                    $("[lang='de'], [lang='en'], [lang='no']").hide();
                    $("[lang='"+r360.config.i18n.language+"']").show();
                },
                content: function () {
                      return $(this).attr('title');
                },
                position: {
                    my: "center top+10",
                    at: "center bottom",
                    using: function( position, feedback ) {
                        $( this ).css( position );
                        $( "<div>" )
                        .addClass( "arrow top" )
                        .addClass( feedback.vertical )
                        .addClass( feedback.horizontal )
                        .appendTo( this );
                    }
                }
            });
        }); 

        // prevent map click when clicking on slider
        L.DomEvent.addListener(buttonContainer, 'click', L.DomEvent.stopPropagation);

        return buttonContainer;
    },

    onChange: function (func){

        this.options.onChange = func;      
    },

    getValue: function(){

        return this.options.checked;
    },

    getId: function(){

        return this.id;
    },

    getCheckboxButtonHTML: function(){

        var that = this; 

        // generate an ID for the complete button group
        that.options.buttonGroupId = r360.Util.generateId(5);
        that.id = that.options.buttonGroupId;

        var div = $('<div/>', { id : that.options.buttonGroupId });
        div.addClass('r360-box-shadow');

        // add each button to the group
        r360.each(that.options.buttons, function(button){

            // generate a unique id for each button
            var id = r360.Util.generateId();

            var input = $('<input/>', { 
                "type" : 'checkbox', 
                "id"   : 'r360_' + id, 
                "value": button.key, 
                "key"  : button.key, 
                "name" : 'r360_checkboxbuttongroup_' + that.options.buttonGroupId
            });

            var label = $('<label/>', { 
                "for"  : 'r360_' + id, 
                "html" : !r360.isUndefined(button.icon) ? button.icon + " " + button.label : "" + button.label
            });

            // make the button selected (default buttin)
            if ( button.checked ) {

                that.options.checked[button.key] = true;
                input.attr({"checked" : "checked"})
            };
            // add a tooltip if one was provided
            if ( typeof button.tooltip != 'undefined' ) label.attr({"title" : button.tooltip});

            div.append(input);
            div.append(label);
        });

        return div;
    },
});

r360.checkboxButtonControl = function (options) {
    return new r360.CheckboxButtonControl(options);
};

/*
 *
 */
r360.LeafletPolygonLayer = L.Class.extend({

    /**
      * This methods initializes the polygon layer's stroke width and polygon opacity.
      * It uses the default values, and in case the options contain other values, the
      * default values are overwritten.
      *
      * @method send
      *
      * @param {Object} [options] The typical JS options array.
      * @param {Number} [options.opacity] Defines the opacity of the polygons.
      *     Higher values mean that the polygon is less opaque.
      * @param {Number} [options.strokeWidth] Defines the strokewidth of the polygons boundaries.
      *     Since we have degenerated polygons (they can have no area), the stroke width defines the
      *     thickness of a polygon. Thicker polygons are not as informative as thinner ones.
      */
    initialize: function (options) {

        // set default parameters
        this.opacity           = r360.config.defaultPolygonLayerOptions.opacity;
        this.strokeWidth       = r360.config.defaultPolygonLayerOptions.strokeWidth;
        this.tolerance         = r360.config.defaultPolygonLayerOptions.tolerance;
        this.extendWidthX      = r360.config.defaultPolygonLayerOptions.strokeWidth / 2;
        this.extendWidthY      = r360.config.defaultPolygonLayerOptions.strokeWidth / 2;
        this.backgroundColor   = r360.config.defaultPolygonLayerOptions.backgroundColor;
        this.backgroundOpacity = r360.config.defaultPolygonLayerOptions.backgroundOpacity;

        // overwrite defaults with optional parameters
        if ( typeof options != 'undefined' ) {

            if ( typeof options.opacity        != 'undefined') this.opacity      = options.opacity;
            if ( typeof options.strokeWidth    != 'undefined') this.strokeWidth  = options.strokeWidth;
            if ( typeof options.inverse        != 'undefined') this.inverse      = options.inverse;
            if ( typeof options.tolerance      != 'undefined') this.tolerance    = options.tolerance;
            if ( typeof options.extendWidthX   != 'undefined') this.extendWidthX = options.extendWidthX;
            if ( typeof options.extendWidthY   != 'undefined') this.extendWidthY = options.extendWidthY;
        }
    },

    /**
     * [setInverse Sets this layer to the inverse representation, meaning only reachable parts are displayed
     *     and the rest is greyed out.]
     * @param {[type]} inverse [true or false]
     */
    setInverse: function(inverse){
        this.inverse = inverse;
    },

    /**
     * @return {[type]} [returns the current state of this layer]
     */
    getInverse: function(){
        return this.inverse;
    },

    /**
     * [getBoundingBox3857 returns a boundingbox (in web mercator) from the left bottom to the top right of this layer]
     * @return {[type]} [description]
     */
    getBoundingBox3857 : function(){

        return this.multiPolygons[0].getBoundingBox3857();
    },

    /**
     * [getBoundingBox4326 returns a boundingbox (in wgs84) from the left bottom to the top right of this layer]
     * @return {[type]} [description]
     */
    getBoundingBox4326 : function(){

        return this.multiPolygons[0].getBoundingBox4326();
    },

    /*
     *
     */
    onAdd: function (map) {

        this.map = map;

        this.id = r360.Util.generateId();

        // create a DOM element with a unique ID to have multiple maps on one page
        this.element = L.DomUtil.create('div', 'r360-leaflet-polygon-layer-' + $(map._container).attr("id") + '-' + this.id + ' leaflet-zoom-hide');
        $(this.element).attr("id", "canvas" + $(this.map._container).attr("id") + '-' + this.id);

        // we append the layer to the overlay pane at the last position
        this.map.getPanes().overlayPane.appendChild(this.element);

        // add a view redraw event listener for updating layer's position
        // zoom in/out, panning
        this.map.on('moveend', this.draw, this);

        // repaint layer
        this.draw();
    },

    /**
     * [fitMap adjust the map to fit the complete polygon with maximum zoom level]
     * @return {[type]} [description]
     */
    fitMap: function(options){

        // we have to transform the r360.latLngBounds to a L.latLngBounds since the map object
        // only knows the leaflet version
        var bounds = this.getBoundingBox4326();
        var sw = bounds.getSouthWest(), ne = bounds.getNorthEast();

        this.map.fitBounds(
            L.latLngBounds(L.latLng({ lat : sw.lat, lng : sw.lng}), L.latLng({ lat : ne.lat, lng : ne.lng})), options);
    },

    /**
     * [clearAndAddLayers clears the polygons from this layer and adds the new ones. If fitMap is not undefined wesvg
     *     also adjust the map bounds/zoom to show the polygons as big as possible.]
     * @param  {[type]} multiPolygons [description]
     * @return {[type]}                  [description]
     */
    clearAndAddLayers : function(multiPolygons, fitMap, options){

        this.clearLayers();
        this.addLayer(multiPolygons);

        if ( typeof fitMap !== 'undefined' && fitMap === true ) this.fitMap(options);

        return this;
    },

    /**
     * [addLayer description]
     * @param {[type]} multiPolygons [description]
     */
    addLayer : function(multiPolygons) {

        this.multiPolygons = multiPolygons;

        // paint them
        this.draw();
    },

    /**
     * [addTo Adds this layer to the given map]
     * @param {[type]} map [the leaflet map on which the layer should be drawn]
     */
    addTo: function (map) {

        map.addLayer(this);
        return this;
    },

    /**
     * [onRemove description]
     * @param  {[type]} map [description]
     * @return {[type]}     [description]
     */
    onRemove: function (map) {

        // remove layer's DOM elements and listeners
        map.getPanes().overlayPane.removeChild(this.element);
        map.off('viewreset', this.draw, this);
    },

    /**
     * [createSvgData Creates the SVG representation of a given polygon]
     * @param  {[type]} polygon [description]
     * @return {[type]}         [description]
     */
    createSvgData: function(polygon){

        var bounds = r360.PolygonUtil.extendBounds(this.getMapPixelBounds(), this.extendWidthX, this.extendWidthY);
        return r360.SvgUtil.createSvgData(polygon, {
            bounds      : bounds,
            scale       : Math.pow(2, this.map._zoom) * 256,
            tolerance   : this.tolerance,
            pixelOrigin : this.map.getPixelOrigin(),
            offset      : this.offset
        });
    },

    /**
     * [getMapPixelBounds description]
     * @return {[type]} [description]
     */
    getMapPixelBounds : function(){

        var bounds = this.map.getPixelBounds();
        return { max : { x : bounds.max.x, y : bounds.max.y }, min : { x : bounds.min.x, y : bounds.min.y } };
    },

    /**
     * [clearLayers Remove all child nodes of this layer from the DOM and initializes the layer.]
     */
    clearLayers: function(){

        this.multiPolygons = undefined;
        $('#canvas'+ $(this.map._container).attr("id") + '-' + this.id).empty();
    },

    setStrokeWidth: function(strokeWidth){

        this.strokeWidth = strokeWidth;
    },

    /*
     *
     */
    draw: function () {

        if ( typeof this.multiPolygons !== 'undefined' ) {

            this.svgWidth  = this.map.getSize().x + this.extendWidthX;
            this.svgHeight = this.map.getSize().y + this.extendWidthY;

            // calculate the offset in between map and svg in order to translate
            var svgPosition    = $('#svg_'+ $(this.map._container).attr("id") + '-' + this.id).offset();
            var mapPosition    = $(this.map._container).offset();

            if ( typeof this.offset == 'undefined' )
                this.offset = { x : 0 , y : 0 };

            // adjust the offset after map panning / zooming
            if ( svgPosition ) {
                this.offset.x += (mapPosition.left - svgPosition.left) - this.extendWidthX/2;
                this.offset.y += (mapPosition.top - svgPosition.top) - this.extendWidthY/2;
            }

            // clear layer from previous drawings
            $('#canvas'+ $(this.map._container).attr("id") + '-' + this.id).empty();

            var gElements = [];

            // go through each multipolygon (represents each travel time)
            for ( var i = 0 ; i < this.multiPolygons.length ;  i++){

                var multiPolygon = this.multiPolygons[i], svgData = [];

                // add each polygon for the given travel time
                for ( var j = 0; j < multiPolygon.polygons.length; j++)
                    svgData.push(this.createSvgData(multiPolygon.polygons[j]));

                if ( svgData.length != 0 )
                    gElements.push(r360.SvgUtil.getGElement(svgData, {
                        color             : !this.inverse ? multiPolygon.getColor() : 'black',
                        opacity           : !this.inverse ? 1 : multiPolygon.getOpacity(),
                        strokeWidth       : this.strokeWidth
                    }));
            }

            var options = {
                id                : $(this.map._container).attr("id") + '-' + this.id,
                offset            : this.offset,
                svgHeight         : this.svgHeight,
                svgWidth          : this.svgWidth,
                backgroundColor   : this.backgroundColor,
                backgroundOpacity : this.backgroundOpacity,
                opacity           : this.opacity,
                strokeWidth       : this.strokeWidth
            };

            // add the svg string to the container
            $('#canvas'+ $(this.map._container).attr("id") + '-' + this.id).append(!this.inverse ? r360.SvgUtil.getNormalSvgElement(gElements, options)
                                                                                 : r360.SvgUtil.getInverseSvgElement(gElements, options));
        }
    }
});

r360.leafletPolygonLayer = function (options) {
    return new r360.LeafletPolygonLayer(options);
};


/*
 *
 */
r360.LeafletUtil = {

    /*
     * Convenients method to generate a Leaflet marker with the 
     * specified marker color. For available colors look at 'dist/images'
     * 
     * @method getMarker
     * @param {Object} [latlon] The coordinate
     * @param {Number} [latlon.lat] The latitude of the coordinate.
     * @param {Number} [latlon.lng] The longitude of the coordinate.
     * @param {Object} [options] The options for the marker
     * @param {Number} [options.color] The color for the marker icon.
     */
    getMarker : function(latlng, options){

        var color = r360.has(options, 'color') ? '-' + options.color : '-blue';

        options.icon = L.icon({
            iconSize     : [25, 41], // size of the icon
            iconUrl      : options.iconPath + 'marker-icon' + color + '.png',
            iconAnchor   : [12, 41], // point of the icon which will correspond to marker's location
            
            shadowSize   : [41, 41], // size of the shadow
            shadowUrl    : options.iconPath + 'marker-shadow.png',
            shadowAnchor : [41 / 3, 41], // point of the shadow which will correspond to marker's location
            
            popupAnchor  : [0, -35]  // point from which the popup should open relative to the iconAnchor
        });

        return L.marker(latlng, options);
    },

    fadeIn : function(layer, route, drawingTime, fadingType, options, onClick){

        if ( typeof drawingTime == 'undefined' ) drawingTime = 0;
        if ( typeof fadingType  == 'undefined')  fadingType  = 'travelTime';

        fadePathSegment(0);        

        function fadePathSegment(z){

            // calculate fading time for segment
            segment = route.routeSegments[z];
            percent = fadingType == "travelTime" ? segment.getTravelTime() / route.getTravelTime() : segment.getDistance() / route.getDistance();

            timeToDraw = percent * drawingTime;

            // transfer don't have a linestring, just a point
            if ( segment.getType() != "TRANSFER" ) {
                fader(segment, timeToDraw, options, z); 
            }
            else {
                
                if ( typeof options === 'undefined' || options.paintTransfer || (typeof options !== 'undefined' && !r360.has(options, 'paintTransfer') )) 
                    addTransferSegment(segment, options); 

                if(++z < route.routeSegments.length)
                    fadePathSegment(z);
            }          
        }

        function addTransferSegment(segment, options){

            addCircularMarker(segment.points[0], segment, options);     

            // if inter station transfer -> involves two stops -> we need a second circle
            if( segment.points.length > 1 && segment.points[0].lat !=  segment.points[1].lat && segment.points[0].lng !=  segment.points[1].lng )
                 addCircularMarker(segment.points[1], segment, options);
        }

        function addCircularMarker(latLng, segment, options) {
            var marker = L.circleMarker(latLng, { 
                    color:          !r360.isUndefined(options) && r360.has(options, 'transferColor')      ? options.transferColor       : segment.getColor(), 
                    fillColor:      !r360.isUndefined(options) && r360.has(options, 'transferHaloColor')  ? options.transferHaloColor   : typeof segment.getHaloColor() !== 'undefined' ? segment.getHaloColor() : '#9D9D9D', 
                    fillOpacity:    !r360.isUndefined(options) && r360.has(options, 'transferFillOpacity')? options.transferFillOpacity : 1, 
                    opacity:        !r360.isUndefined(options) && r360.has(options, 'transferOpacity')    ? options.transferOpacity     : 1, 
                    stroke:         !r360.isUndefined(options) && r360.has(options, 'transferStroke')     ? options.transferStroke      : true, 
                    weight:         !r360.isUndefined(options) && r360.has(options, 'transferWeight')     ? options.transferWeight      : 4, 
                    radius:         !r360.isUndefined(options) && r360.has(options, 'transferRadius')     ? options.transferRadius      : 8 
                });         
    
            var popup = !r360.isUndefined(options) && r360.has(options, 'popup') ? options.popup : "INSERT_TEXT";

            if ( typeof segment !== 'undefined') {

                var variable = !r360.contains(['walk', 'transit', 'source', 'target', 'bike', 'car'], segment.startname) ? segment.startname : '';
                variable = variable == '' && !r360.contains(['walk', 'transit', 'source', 'target', 'bike', 'car'], segment.endname) ? segment.endname : variable;

                popup = popup.replace('INSERT_TEXT', variable);
            }

            if ( !r360.isUndefined(options) && r360.has(options, 'popup') ) {

                marker.bindPopup(popup)
                marker.on('mouseover', function(){ marker.openPopup(); })
            }

            marker.addTo(layer);
            marker.bringToFront();
        }
        

        function fader(segment, millis, options, z){

            var polylineOptions         = {};
            polylineOptions.color       = !r360.isUndefined(options) && r360.has(options, 'color')    ? options.color   : segment.getColor();
            polylineOptions.opacity     = !r360.isUndefined(options) && r360.has(options, 'opacity' ) ? options.opacity : 0.8;
            polylineOptions.weight      = !r360.isUndefined(options) && r360.has(options, 'weight' )  ? options.weight  : 5;

            if ( segment.getType() != "TRANSIT" && (segment.getType() == "WALK") )  {
                
                polylineOptions.color     = !r360.isUndefined(options) && r360.has(options, 'walkColor' )     ? options.walkColor     : '#006F35';
                polylineOptions.weight    = !r360.isUndefined(options) && r360.has(options, 'walkWeight' )    ? options.walkWeight : 7;
                polylineOptions.dashArray = !r360.isUndefined(options) && r360.has(options, 'walkDashArray' ) ? options.walkDashArray : "1, 10";
            }

            var polylineHaloOptions     = {};
            polylineHaloOptions.weight  = !r360.isUndefined(options) && r360.has(options, 'haloWeight' )  ? options.haloWeight  : 10;
            polylineHaloOptions.opacity = !r360.isUndefined(options) && r360.has(options, 'haloOpacity' ) ? options.haloOpacity : 0.7;
            polylineHaloOptions.color   = !r360.isUndefined(options) && r360.has(options, 'haloColor')    ? options.haloColor   : typeof segment.getHaloColor() !== 'undefined' ? segment.getHaloColor() : '#9D9D9D';

            // 15ms for one peace. So if we want do draw the segment in 1 sec we need 66 pieces
            var pieces      = millis / 15;
            var choppedLine = chopLineString(segment.getPoints(), pieces);
            var haloLine    = L.polyline(choppedLine[0], polylineHaloOptions).addTo(layer);
            var polyLine    = L.polyline(choppedLine[0], polylineOptions).addTo(layer);

            // add event listener
            haloLine.on('click', onClick);
            polyLine.on('click', onClick);

            fadeLine(polyLine, haloLine, choppedLine, 1, z)
        };

        /*
        function is recalling itself every 25ms
        if you want the line to be drawn in one second you need to add a chopped line in (roughly) 40 pieces
        When line is drawn fadePathSegment is called in order to draw the next segment. 
        */

        function fadeLine(polyLine, haloLine, choppedLine, i, z){

            var latlngs = polyLine.getLatLngs();

            for ( var j = 0 ; j < choppedLine[i].length ; j++ ) 
                latlngs.push(choppedLine[i][j])
            
            
            if ( latlngs.length != 0 ) {
                haloLine.setLatLngs(latlngs);
                polyLine.setLatLngs(latlngs);
            } 

            if ( ++i < choppedLine.length ) {
                setTimeout(function(){ 
                    fadeLine(polyLine, haloLine, choppedLine, i, z); 
                }, 15);
            }else{               
                if(++z < route.routeSegments.length)
                   fadePathSegment(z);
            }
        }

        /*
        chops a linestring in a chosen number of equal pieces
        */

        function chopLineString(latlngs, pieces){

            var length          = 0;
            var steps           = 1 / pieces;        
            var percentSoFar    = 0;
            var segmentDistance;
            var segmentPercent;
            var newLatLngs  = new Array();
           
            for(var i = 1; i < latlngs.length; i++){
                length += latlngs[i-1].distanceTo(latlngs[i]);
            }

            var part        = new Array(); 

            for(var i = 0; i < latlngs.length -1; i++){

                
                part.push(latlngs[i]);
               
                segmentDistance  = latlngs[i].distanceTo(latlngs[i + 1]);
                segmentPercent   = segmentDistance / length;
                percentSoFar    += segmentPercent;

                if(percentSoFar >= steps){
                    while(percentSoFar >= steps){
                        percent = ((steps - (percentSoFar - segmentPercent))/segmentPercent);
                        part.push(interpolatePoint(latlngs[i],latlngs[i + 1],percent));
                        steps += 1 / pieces;

                        newLatLngs.push(part);
                        part        = new Array();
                    } 
                }
            }

            newLatLngs.push(part);
            part    = new Array();
            part.push(latlngs[latlngs.length -1]);
            newLatLngs.push(part);
            return newLatLngs;
        };

        function interpolatePoint(latlng1, latlng2, percent){

            var tempmap;

            /*
                ugly hack. shall be redone when working with projected coordinates
            */
            if(typeof layer.project != "undefined"){
                tempmap = layer;
            }else{
                tempmap = layer._map;
            }
            var p1 = tempmap.project(latlng1);
            var p2 = tempmap.project(latlng2);

            var xNew = (p2.x - p1.x) * percent + p1.x;
            var yNew = (p2.y - p1.y) * percent + p1.y;
            var newPoint = new r360.point(xNew, yNew);

            var latlng = tempmap.unproject(L.point(newPoint.x, newPoint.y));

            return latlng;          
        };
    }
};

}(window, document));

