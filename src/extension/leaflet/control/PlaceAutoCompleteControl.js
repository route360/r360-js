r360.placeAutoCompleteControl = function (options) {
    return new r360.PlaceAutoCompleteControl(options);
};

r360.PlaceAutoCompleteControl = L.Control.extend({

    initialize: function(options){

        this.options = JSON.parse(JSON.stringify(r360.config.defaultPlaceAutoCompleteOptions));

        if ( typeof options !== "undefined" ) {
            
            if ( _.has(options, 'position'))      this.options.position      = options.position;
            if ( _.has(options, 'label'))         this.options.label         = options.label;
            if ( _.has(options, 'country'))       this.options.country       = options.country;
            if ( _.has(options, 'reset'))         this.options.reset         = options.reset;
            if ( _.has(options, 'reverse'))       this.options.reverse       = options.reverse;
            if ( _.has(options, 'placeholder'))   this.options.placeholder   = options.placeholder;
            if ( _.has(options, 'width'))         this.options.width         = options.width;
            if ( _.has(options, 'maxRows'))       this.options.maxRows       = options.maxRows;
            if ( _.has(options, 'showOnStartup')) this.options.showOnStartup = options.showOnStartup;
            if ( _.has(options, 'image'))         this.options.image         = options.image;
            if ( _.has(options, 'index'))         this.options.index         = options.index;
            if ( _.has(options, 'autoHide'))      this.options.autoHide      = options.autoHide;
            if ( _.has(options, 'options')) {

                 this.options.options    = options.options;
                 this.options.travelType = _.has(this.options.options, 'init') ? this.options.options.init : 'walk';
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

        // $(nameContainer).addClass("r360-box-shadow");

        map.on("resize", that.onResize.bind(that));          

        // calculate the width in dependency to the number of buttons attached to the field
        var width = that.options.width;
        // if ( that.options.reset ) width += 44;
        // if ( that.options.reverse ) width += 37;
        var style = 'style="width:'+ width +'px;"';

        that.options.input = 
            '<div class="input-group autocomplete r360-box-shadow" '+style+'> \
                <input id="autocomplete-'+that.options.id+'" style="color: black;widthe:'+width+'" \
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
                    <button id="'+that.options.id+'-options-btn" class="btn btn-autocomplete" type="button" title="' + i18n.get('settings') + '"><i class="fa fa-cog fa-fw"></i></button> \
                </span>';

            optionsHtml.push('<div id="'+that.options.id+'-options" class="text-center r360-box-shadoww" style="color: black;widtth:'+width+'; display: '+ (this.options.showOnStartup ? 'block' : 'none') +';">');
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
                    '" travel-type="transit"><span class="fa fa-bus travel-type-icon"></span> <span lang="en">Transit</span><span lang="no">TODO</span><span lang="de">ÖPNV</span></button>');
            
            if ( that.options.options && that.options.options.car ) 
                optionsHtml.push('<button type="button" class="btn btn-default travel-type-button '
                    + (this.options.travelType == 'car' ? 'active' : '') + 
                    '" travel-type="car"><span class="fa fa-car"></span> <span lang="en">Car</span><span lang="no">TODO</span><span lang="de">Auto</span></button>');
            
            optionsHtml.push('  </div>');
            optionsHtml.push('</div>');
        // }

        // add a reset button to the input field
        // if ( that.options.reset ) {

             that.options.input += 
                '<span id="'+that.options.id+'-reverse" ' + (!that.options.reverse ? 'style="display: none;"' : '') + '" class="input-group-btn"> \
                    <button id="'+that.options.id+'-reverse-button" class="btn btn-autocomplete" type="button" title="' + i18n.get('reverse') + '"><i class="fa fa-arrows-v fa-fw"></i></button> \
                </span>';

            that.options.input += 
                '<span id="'+that.options.id+'-reset" ' + (!that.options.reset ? 'style="display: none;"' : '') + '" class="input-group-btn"> \
                    <button id="'+that.options.id+'-reset-button" class="btn btn-autocomplete" type="button" title="' + i18n.get('reset') + '"><i class="fa fa-times fa-fw"></i></button> \
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

        if ( _.has(that.options, 'country' ) ) countrySelector += " AND country:" + that.options.country;

        $(nameContainer).find("#autocomplete-" + that.options.id).autocomplete({

            source: function( request, response ) {

                that.source = this;

                var requestElements = request.term.split(" ");
                var numbers = new Array();
                var requestString = "";
                var numberString = "";
                    
                for(var i = 0; i < requestElements.length; i++){
                    
                    if(requestElements[i].search(".*[0-9].*") != -1)
                        numbers.push(requestElements[i]);
                    else
                        requestString += requestElements[i] + " ";
                }

                if ( numbers.length > 0 ) {
                    numberString += " OR ";
                    
                    for(var j = 0; j < numbers.length; j++){
                        var n = "(postcode : " + numbers[j] + " OR housenumber : " + numbers[j] + " OR street : " + numbers[j] + ") ";
                        numberString +=  n;
                    }
                }

                // delay: 150,

                $.ajax({
                    url: that.options.serviceUrl, 
                    dataType: "jsonp",
                    jsonp: 'json.wrf',
                    async: false,
                    data: {
                      wt:'json',
                      indent : true,
                      rows: that.options.maxRows,
                      qt: 'en',
                      q:  "(" + requestString + numberString + ")" + countrySelector
                    }, 
                    success: function( data ) {

                        var places = new Array();
                        response( $.map( data.response.docs, function( item ) {

                            if ( item.osm_key == "boundary" ) return;

                            var latlng = item.coordinate.split(',');
                            var place           = {};
                            var firstRow        = [];
                            var secondRow       = [];
                            place.name          = item.name;
                            place.city          = item.city;
                            place.street        = item.street;
                            place.housenumber   = item.housenumber;
                            place.country       = item.country;
                            place.postalCode    = item.postcode;
                            if (place.name)       firstRow.push(place.name);
                            if (place.city)       firstRow.push(place.city);
                            if (place.street)     secondRow.push(place.street);
                            if (place.housenumber) secondRow.push(place.housenumber);
                            if (place.postalCode) secondRow.push(place.postalCode);
                            if (place.city)       secondRow.push(place.city);

                            // only show country if undefined
                            if ( !_.has(that.options, 'country') && place.country ) secondRow.push(place.country);

                            // if same looking object is in list already: return 
                            if ( _.contains(places, firstRow.join() + secondRow.join()) ) return; 
                            else places.push(firstRow.join() + secondRow.join());

                            return {
                                label       : firstRow.join(", "),
                                value       : firstRow.join(", "),
                                firstRow    : firstRow.join(", "),
                                secondRow   : secondRow.join(" "),
                                term        : request.term,
                                index       : that.options.index,
                                latlng      : new L.LatLng(latlng[0], latlng[1])
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

    updateI18n : function(source) {

        var that = this;
        $("#autocomplete-" + that.options.id).attr("placeholder", r360.config.i18n.get(source ? 'placeholderSrc' : 'placeholderTrg'));
        $('#' + that.options.id + '-reverse-button').attr('title', r360.config.i18n.get('reverse'));
        $('#' + that.options.id + '-reset-button').attr('title', r360.config.i18n.get('reset'));
        $('#' + that.options.id + '-options-btn').attr('title', r360.config.i18n.get('settings'));
        
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