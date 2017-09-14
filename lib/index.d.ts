import * as basemapUtils from './modules/basemaps';
export declare const version = "v1.0.0";
export declare const config: {
    serviceVersion: string;
    pathSerializer: string;
    requestTimeout: number;
    maxRoutingTime: number;
    maxRoutingLength: number;
    bikeSpeed: number;
    bikeUphill: number;
    bikeDownhill: number;
    walkSpeed: number;
    walkUphill: number;
    walkDownhill: number;
    travelTimes: number[];
    travelType: string;
    logging: boolean;
    rushHour: boolean;
    defaultTravelTimeControlOptions: {
        travelTimes: {
            time: number;
            color: string;
            opacity: number;
        }[];
        position: string;
        label: string;
        initValue: number;
    };
    routeTypes: ({
        routeType: string;
        color: string;
        haloColor: string;
    } | {
        routeType: number;
        color: string;
        haloColor: string;
    })[];
    photonPlaceAutoCompleteOptions: {
        serviceUrl: string;
        position: string;
        reset: boolean;
        reverse: boolean;
        placeholder: string;
        maxRows: number;
        width: number;
    };
    defaultRadioOptions: {
        position: string;
    };
    defaultPolygonLayerOptions: {
        opacity: number;
        strokeWidth: number;
        tolerance: number;
        backgroundColor: string;
        backgroundOpacity: number;
        inverse: boolean;
        animate: boolean;
        animationDuration: number;
    };
};
export declare const getbasemapList: typeof basemapUtils.getBasemapList;
export declare const getGLStyle: typeof basemapUtils.getGLStyle;
