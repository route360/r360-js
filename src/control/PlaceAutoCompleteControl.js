r360.placeAutoCompleteControl = function (options) {
    return new r360.PlaceAutoCompleteControl(options);
};

r360.PlaceAutoCompleteControl = L.Control.extend({

    initialize: function(options){

        this.options = JSON.parse(JSON.stringify(r360.config.defaultPlaceAutoCompleteOptions));

        if ( typeof options !== "undefined" ) {
            
            if ( _.has(options, 'position'))    this.options.position    = options.position;
            if ( _.has(options, 'label'))       this.options.label       = options.label;
            if ( _.has(options, 'country'))     this.options.country     = options.country;
            if ( _.has(options, 'reset'))       this.options.reset       = options.reset;
            if ( _.has(options, 'reverse'))     this.options.reverse     = options.reverse;
            if ( _.has(options, 'placeholder')) this.options.placeholder = options.placeholder;
            if ( _.has(options, 'width'))       this.options.width       = options.width;
            if ( _.has(options, 'maxRows'))     this.options.maxRows     = options.maxRows;
        }
    },

    onAdd: function(map){
        
        var that = this;
        var countrySelector =  "";

        var nameContainer = L.DomUtil.create('div', this._container);

        that.options.map = map;
        var mapId = $(map._container).attr("id");
        map.on("resize", this.onResize.bind(this));          

        var i18n = r360.config.i18n;   

        // calculate the width in dependency to the number of buttons attached to the field
        var width = this.options.width;
        if ( that.options.reset ) width += 44;
        if ( that.options.reverse ) width += 37;
        var style = 'style="width:'+ width +'px;"';

        that.options.input = 
            '<div class="input-group autocomplete" '+style+'> \
                <input id="autocomplete-'+mapId+'" style="color: black;width:'+width+'" \
                type="text" class="form-control" placeholder="' + this.options.placeholder + '" onclick="this.select()">';

        // add a reset button to the input field
        if ( that.options.reset ) {

            that.options.input += 
                '<span class="input-group-btn"> \
                    <button class="btn btn-autocomplete" onclick="this.onReset()" type="button" title="' + i18n.get('reset') + '"><i class="fa fa-times"></i></button> \
                </span>'
        }
        if ( that.options.reverse ) {

            this.options.input += 
                '<span class="input-group-btn"> \
                    <button class="btn btn-autocomplete" onclick="this.onReverse()" type="button" title="' + i18n.get('reverse') + '"><i class="fa fa-arrows-v"></i></button> \
                </span>'
        }

        that.options.input += '</div>';

        // add the control to the map
        $(nameContainer).append(that.options.input);        
        
        // no click on the map, if click on container        
        L.DomEvent.disableClickPropagation(nameContainer);      

        if ( _.has(that.options, 'country' ) ) countrySelector += " AND country:" + that.options.country;

        $(nameContainer).find("#autocomplete-"+mapId).autocomplete({

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
                            _.each(places, function(pastPlace){
                                if ( pastPlace == "" + firstRow.join() + secondRow.join() ) return;
                            })

                            places.push("" + firstRow.join()+secondRow.join());

                            return {
                                label       : firstRow.join(", "),
                                value       : firstRow.join(", "),
                                firstRow    : firstRow.join(", "),
                                secondRow   : secondRow.join(" "),
                                term        : request.term,
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

            var matchItem = "<a><span class='address-row1'>"+ item.firstRow + "</span><br/><span class='address-row2'>  " + item.secondRow + "</span></a>";

            var html = item.term ? ('' + matchItem).replace(new RegExp(escapeRegexp(item.term), 'gi'), '<strong>$&</strong>') : matchItem;

            return $( "<li>" )
                .append(html)
                .appendTo( ul );
            };
            this.onResize();     

        return nameContainer;
    },

    onReset: function(onReset){
        var that = this;   

        $(that.options.resetButton).click(onReset);
        $(that.options.resetButton).click(function(){
            $(that.options.input).val("");
        });
    },

    onReverse: function(onReverse){
       
       $(this.options.reverseButton).click(onReverse);
    },

    onResize: function(){
        var that = this;
        if(this.options.map.getSize().x < 550){
            $(that.options.input).css({'width':'45px'});
        }else{
            $(that.options.input).css({'width':''});
        }
    },

    onSelect: function(onSelect){

        var that = this;
        that.options.onSelect = onSelect;       
    },

    setFieldValue : function(val){

        var mapId = $(this.options.map._container).attr("id");
        $("#autocomplete-"+mapId).val(val.firstRow);
        $(this.options.input).val(val);
    },

    getFieldValue : function(){
        return $(this.options.input).val();
    },

    setValue : function(value){
        this.options.value = value;
    },

    getValue : function(){
        return this.options.value;
    }

})