import * as basemapUtils from './basemaps'
import { serviceUrls } from './config'

describe('basemaps utilities', () => {
    test('getBasemapList returns array of strings', () => {
        const expected = ["bright", "light", "dark", "blues", "basic"]
        expect(basemapUtils.getBasemapList()).toEqual(expect.arrayContaining(expected))
    })

    test('getGLStyle returns url', () => {
        const expected = `${serviceUrls.basemapStyleUrl}dark-matter-gl-style.json?key=fakeapikey`
        expect(basemapUtils.getGLStyle('dark', 'fakeapikey')).toEqual(expected)
    })
    
    test('getGLStyle requires valid basemap name', () => {
        expect(() => {
            basemapUtils.getGLStyle('dork', 'fakeapikey')
        }).toThrow()
    })

    test('getGLStyle requires apikey', () => {
        expect(() => {
            basemapUtils.getGLStyle('dark')
        }).toThrow()
    })
})