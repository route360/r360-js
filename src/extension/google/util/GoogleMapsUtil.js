r360.GoogleMapsUtil = {

    /**
    * @param {google.maps.Map} map
    * @param {google.maps.LatLng} latlng
    * @param {int} z
    * @return {google.maps.Point}
    */
    googleLatlngToPoint : function(map, latlng, z){
        var normalizedPoint = map.getProjection().fromLatLngToPoint(latlng); // returns x,y normalized to 0~255
        var scale = Math.pow(2, z);
        return new google.maps.Point(normalizedPoint.x * scale, normalizedPoint.y * scale); 
    },

    /**
    * @param {google.maps.Map} map
    * @param {google.maps.Point} point
    * @param {int} z
    * @return {google.maps.LatLng}
    */
     googlePointToLatlng : function(map, point, z){
        var scale = Math.pow(2, z);
        var normalizedPoint = new google.maps.Point(point.x / scale, point.y / scale);
        var latlng = map.getProjection().fromPointToLatLng(normalizedPoint);
        return latlng; 
    }
};