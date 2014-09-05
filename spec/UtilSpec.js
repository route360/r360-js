describe("the Route360° Util", function() {
  
    it("should return the current time including seconds", function() {

        var now = new Date();
        now = (now.getHours() * 3600) + (now.getMinutes() * 60) + now.getSeconds();

        expect(r360.Util.getTimeInSeconds()).toBe(now);
    });

    it("should return the current time not including seconds", function() {

        var now = new Date();
        now = (now.getHours() * 3600) + (now.getMinutes() * 60);

        expect(r360.Util.getHoursAndMinutesInSeconds()).toBe(now);
    });

    it("should return the current date in the correct format", function() {

        var date  = new Date();
        var year  = date.getFullYear();
        var month = (date.getMonth() + 1) < 10 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1); 
        var day   = date.getDate() < 10 ? "0" + date.getDate() : date.getDate(); 
        
        expect(r360.Util.getCurrentDate()).toBe(year + "" + month + "" + day);
    });

    it("should return the current date in the correct format", function() {

        r360.config.i18n.language = 'en';

        expect(r360.Util.getTimeFormat(0)).toEqual('a.m.');
        expect(r360.Util.getTimeFormat(3600)).toEqual('a.m.');
        expect(r360.Util.getTimeFormat(43200)).toEqual('p.m.');
        expect(r360.Util.getTimeFormat(86400)).toEqual('a.m.');

        r360.config.i18n.language = 'de';

        expect(r360.Util.getTimeFormat(0)).toEqual('Uhr');
        expect(r360.Util.getTimeFormat(3600)).toEqual('Uhr');
        expect(r360.Util.getTimeFormat(43200)).toEqual('Uhr');
        expect(r360.Util.getTimeFormat(86400)).toEqual('Uhr');        
    });

    it("should correctly translate seconds to h/m representation", function(){

        expect(r360.Util.secondsToHoursAndMinutes(0)).toBe("0min");
        expect(r360.Util.secondsToHoursAndMinutes(29)).toBe("0min");
        expect(r360.Util.secondsToHoursAndMinutes(30)).toBe("1min");
        expect(r360.Util.secondsToHoursAndMinutes(43200)).toBe("12h 0min");
        expect(r360.Util.secondsToHoursAndMinutes(43230)).toBe("12h 1min");
    });

    it("should transform seconds to the correct time", function(){

        expect(r360.Util.secondsToTimeOfDay(43200)).toBe("12:00:00");
        expect(r360.Util.secondsToTimeOfDay(40079)).toBe("11:07:59");
        expect(r360.Util.secondsToTimeOfDay(172800)).toBe("48:00:00");
    });

    it("should generate random strings", function(){

        expect(r360.Util.generateId().length).toBe(10);
        expect(r360.Util.generateId(5).length).toBe(5);
        expect(r360.Util.generateId(-1).length).toBe(0);
    });

    it("should create correct latlon arrays", function(){

        var latlons = [[0,1],[2,3],[4,5],[6,7],[8,9],[10,11]];
        expect(r360.Util.parseLatLonArray(latlons).length).toBe(6);
        expect(r360.Util.parseLatLonArray(latlons)[3].x).toBe(7);
        expect(r360.Util.parseLatLonArray(latlons)[4].y).toBe(8);
    });

    it("should generate valid polygons", function(){

        var multiPolygon = r360.Util.parsePolygons(transitPolygon);
        expect(multiPolygon.length).toBe(6); // we have travel times for [600, 1200, 1800, 2400, 3000, 3600]
        
        _.each(multiPolygon, function(polygons){
            // each multipolygon should contain many inner polygons
            expect(polygons.polygons.length).toBeGreaterThan(0);
            
            _.each(polygons.polygons, function(p){

                // each polygon should have a travel time
                expect(p.getTravelTime()).toBeGreaterThan(0);
                expect(p.getCenterPoint()).toBeDefined();
            })
        });
    });

    it("should generate valid routes", function(){

        var routes = r360.Util.parseRoutes(transitRoute);
        expect(routes).toBeDefined();
        expect(routes.length).toBe(1);

        var route = routes[0];
        expect(route.getSegments().length).toBe(5);
        expect(route.getTravelTime()).toBe(3112);
        expect(route.getDistance()).toBeGreaterThan(0);

        _.each(route.getSegments(), function(segment){

            // walk is the shortest type
            expect(segment.getType().length).toBeGreaterThan(3);
            expect(segment.getTravelTime()).toBeGreaterThan(0);
            expect(segment.getColor().length).toBeGreaterThan(0);

            if ( segment.getType() != 'TRANSFER' )
                expect(segment.getPoints().length).toBeGreaterThan(0);

            if ( segment.getType() == 'TRANSIT' ) {

                expect(segment.isTransit()).toBe(true);
                expect(segment.getDepartureTime()).toBeGreaterThan(0);
                expect(segment.getArrivalTime()).toBeGreaterThan(0);
                expect(segment.getTripHeadSign().length).toBeGreaterThan(0);
                expect(segment.getDistance()).toBeGreaterThan(0);
                expect(segment.getStartName().length).toBeGreaterThan(0);
                expect(segment.getEndName().length).toBeGreaterThan(0);
            }
        });
    });
});