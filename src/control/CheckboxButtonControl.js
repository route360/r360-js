r360.CheckboxButtonControl = L.Control.extend({

    initialize: function (options) {

        this.options = JSON.parse(JSON.stringify(r360.config.defaultRadioOptions));
        this.options.checked = {};

        if ( typeof options !== 'undefined') { 
            
            if ( typeof options.position !== 'undefined' ) this.options.position = options.position;
            if ( typeof options.buttons  !== 'undefined' ) this.options.buttons  = options.buttons;
            else alert("No buttons supplied!");
        }
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

    getCheckboxButtonHTML: function(){

        var that = this; 

        // generate an ID for the complete button group
        that.options.buttonGroupId = r360.Util.generateId(5);

        var div = $('<div/>', { id : that.options.buttonGroupId });

        // add each button to the group
        _.each(that.options.buttons, function(button){

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
                "html" : button.label
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