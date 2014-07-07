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