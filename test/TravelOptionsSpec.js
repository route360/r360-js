describe("the TravelOptions object", function() {
  
    it("should return the current time including seconds", function() {

        var travelOptions = r360.travelOptions();
        travelOptions.addSource({ lat : 52.21 , lon : 13.37 });
        travelOptions.addSource({ lat : 52.21 , lon : 13.37 });
        travelOptions.addSource({ lat : 52.21 , lon : 13.37 });
        travelOptions.addTarget({ lat : 52.21 , lon : 13.37 });
        travelOptions.addTarget({ lat : 52.21 , lon : 13.37 });
        travelOptions.setTravelTimes([600, 1200, 1800, 2400, 3000, 3600, 4200]);
        travelOptions.setTravelType('transit');
        travelOptions.setDate('20140904');
        travelOptions.setTime('43200');
        travelOptions.setIntersectionMode('average');
        travelOptions.setPathSerializer('compact');
        travelOptions.setMaxRoutingTime(3600);
        travelOptions.setMaxRoutingLength(100000);
        travelOptions.setBikeSpeed(4);
        travelOptions.setBikeUphill(5);
        travelOptions.setBikeDownhill(6);
        travelOptions.setWalkSpeed(1);
        travelOptions.setWalkUphill(2);
        travelOptions.setWalkDownhill(3);

        expect(travelOptions.getSources()).toBeArrayOfSize(3);
        expect(travelOptions.getTargets()).toBeArrayOfSize(2);
        expect(travelOptions.getTravelTimes()).toEqual([600, 1200, 1800, 2400, 3000, 3600, 4200]);
        expect(travelOptions.getTravelType()).toBe('transit');
        expect(travelOptions.getDate()).toBe('20140904');
        expect(travelOptions.getTime()).toBe('43200');
        expect(travelOptions.getIntersectionMode()).toBe('average');
        expect(travelOptions.getPathSerializer()).toBe('compact');
        expect(travelOptions.getMaxRoutingTime()).toBe(3600);
        expect(travelOptions.getMaxRoutingLength()).toBe(100000);
        expect(travelOptions.getBikeSpeed()).toBe(4);
        expect(travelOptions.getBikeUphill()).toBe(5);
        expect(travelOptions.getBikeDownhill()).toBe(6);
        expect(travelOptions.getWalkSpeed()).toBe(1);
        expect(travelOptions.getWalkUphill()).toBe(2);
        expect(travelOptions.getWalkDownhill()).toBe(3);
        expect(travelOptions.isValidPolygonServiceOptions()).toBe(true);
        expect(travelOptions.isValidRouteServiceOptions()).toBe(true);
        expect(travelOptions.isValidTimeServiceOptions()).toBe(true);
        expect(travelOptions.getErrors()).toBeArrayOfSize(0);     
    });
});