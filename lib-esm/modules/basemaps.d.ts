/**
 * [getBasemapList returns an array of basemap names. ]
 * @return {basemapList} Array [returns array of basemaps names]
 */
export declare function getBasemapList(): string[];
/**
 * [getGLStyle returns style url for mapbox-gl style. ]
 * @param  {stylename} String [accepts string of valid style name]
 * @param  {apikey} String    [accepts string of apikey]
 * @return {styleUrl} String  [returns url for mapbox-gl style]
 */
export declare function getGLStyle(stylename: string, apikey: string): string;
