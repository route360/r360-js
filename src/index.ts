import { defaults } from './modules/config'
import * as basemapUtils from './modules/basemaps'

export const version = 'v1.0.0'
export const config = defaults
export const getbasemapList = basemapUtils.getBasemapList
export const getGLStyle = basemapUtils.getGLStyle

