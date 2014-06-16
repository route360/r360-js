r360.placeAutoCompleteControl = function () {
    return new r360.PlaceAutoCompleteControl();
};

r360.PlaceAutoCompleteControl = L.Control.extend({

    initialize: function(options){

            this.options = MiConfig.defaultNamePickerOptions;

           
            if ( typeof options != "undefined" ) {
                
                if(typeof options.position != "undefined") this.options.position = options.position;
                if(typeof options.label != "undefined") this.options.label = options.label;
                if(typeof options.country != "undefined") this.options.country = options.country;
                if(typeof options.reset != "undefined") this.options.reset = options.reset;
                if(typeof options.reset != "undefined")this.options.reverse = options.reverse;
                if(typeof options.placeholder != "undefined") this.options.placeholder = options.placeholder;
            }

            L.Util.setOptions(this);
    },

    onAdd: function(map){
        var that = this;
        var countrySelector =  "";

        var nameContainer = L.DomUtil.create('div', this._container);
        var miBox = $('<div/>', {"class" : "mi-box"});

        that.options.input = $('<input/>', {"placeholder" : that.options.placeholder, "onclick" : "this.select()"});
        that.options.map = map;
        map.on("resize", this.onResize.bind(this));          

        $(nameContainer).append(miBox);        
        $(miBox).append(that.options.input);

        if(that.options.reset){
            that.options.resetButton = $('<button/>', {"text": "reset", "style": "width:22px; height:22px; bottom: 2px;"});

            $(miBox).append(that.options.resetButton);    

            $(this.options.resetButton).button({
                icons: {
                    primary: "ui-icon-close"
                },
            text: false}
            );
        }        

        if(that.options.reverse){
            that.options.reverseButton = $('<button/>', {"text": "reverse", "style": "width:22px; height:22px; bottom: 2px;"});

            $(miBox).append(that.options.reverseButton);    

            $(this.options.reverseButton).button({
                icons: {
                    primary: "ui-icon-transferthick-e-w"
                },
            text: false}
            );
        }        
         
       
        L.DomEvent.disableClickPropagation(nameContainer);         

        if(typeof that.options.country != 'undefined')
            countrySelector += " AND country:" + that.options.country;

        $(that.options.input).autocomplete({

           

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

                if(numbers.length > 0){
                    numberString += " OR ";
                    for(var j = 0; j < numbers.length; j++){
                        var n = "(postcode : " + numbers[j] + " OR housenumber : " + numbers[j] + " OR street : " + numbers[j] + ") ";
                        numberString +=  n;
                    }
                }


                delay: 150,

                $.ajax({
                  url: that.options.serviceUrl, 
                  dataType: "jsonp",
                  jsonp: 'json.wrf',
                  data: {
                    wt:'json',
                    indent : true,
                    rows: 10,
                    qt: 'en',
                    q:  "(" + requestString + numberString + ")" + countrySelector
                  }, 
                  success: function( data ) {

                    var pastArrays = new Array();
                    response( $.map( data.response.docs, function( item ) {

                        if(item.osm_key == "boundary")
                            return;

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

                        /*only show country if undefined*/
                        if(typeof that.options.country == 'undefined')
                            if (place.country)    secondRow.push(place.country);

                        /*if same looking object is in list already: return*/
                        for(var i = 0; i < pastArrays.length; i++)
                            if(pastArrays[i] == ""+firstRow.join()+secondRow.join())
                                return;

                        pastArrays.push(""+firstRow.join()+secondRow.join());

                      return {
                        label: firstRow.join(", "),
                        value: firstRow.join(", "),
                        firstRow: firstRow.join(", "),
                        secondRow: secondRow.join(" "),
                        latlng: new L.LatLng(latlng[0], latlng[1])
                      }
                    }));
                  }
                });
              },
              minLength: 1,
              select: function( event, ui ) {
                that.options.value = ui.item;
                that.options.onEnter(ui.item);
              },
              open: function() {
                $( this ).removeClass( "ui-corner-all" ).addClass( "ui-corner-top" );
              },
              close: function() {
                $( this ).removeClass( "ui-corner-top" ).addClass( "ui-corner-all" );
              },
               create: function() {
                $( this ).addClass( "ui-corner-all" );
             }
            }).data( "ui-autocomplete" )._renderItem = function( ul, item ) {
            /*Styling in two rows would be nice. Looks ugly in JQuery though*/
            return $( "<li>" )
                .append( "<a><span class='address-row1'>"+ item.firstRow + "</span><span class='address-row2'>  " + item.secondRow + "</span></a>" )
                .appendTo( ul );
            };
            this.onResize();     

        return nameContainer;
    },

    onReset: function(onReset){
        var that = this;   

        $(this.options.resetButton).click(onReset);
        $(this.options.resetButton).click(function(){
            $(that.options.input).val("");
        });
    },

    onReverse: function(onReverse){
       var that = this;  
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

    onEnter: function(onEnter){
        var that = this;
        that.options.onEnter = onEnter;       
    },

    setFieldValue : function(val){
         $(this.options.input).val(val);
    },

    getFieldValue : function(){
        return $(this.options.input).val();
    },

    getValue : function(){
        return this.options.value;
    }

})