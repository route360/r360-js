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
        _.each(that.options.buttons, function(button){

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