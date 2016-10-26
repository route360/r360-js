#r360-js#angular-ready

## Angular Ready
The angular-ready branch of r360 does not include jquery and jquery ui. There are no control components included in this branch. It is designed to be used with angular 1. We started to develop an [angular module](https://github.com/route360/r360-angular) for r360 including controls as angular components. However this module is still in development and is subject to change on any given day. We are working on making a stable build and write the documentation, but this will take some time. :/

You may have a look at some (undocumented) examples on how to implement r360 in angular [here](http://codepen.io/collection/DNzZEv/)

## API-Key
Get your API key [here ](https://developers.route360.net/apikey.html).

The Route360° JavaScript API is a modern open-source JavaScript library designed for Leaflet's mobile-friendly interactive maps. It is developed by Henning Hollburg and Daniel Gerber from the Motion Intelligence GmbH.


# Features

* Generate polygons which represent the area which is reachable from a given source point
* Supported for **walk**, **car**, **bike** and **transit** routing
* A number of predefined map controls (travel time slider, date and time chooser, travel type chooser, etc.)
* Detailed routing information from source to target (travel time, transit trips, etc.)
* Get routing information for hundreds of POIs in a single request in milliseconds
* Support for elevation data

# Demonstration and Usage
A demonstration of the library's features, as well as detailed coding examples can be found [here](http://developers.route360.net). You can see what the service is capable of at the technology [demo](http://apps.route360.net/demo), just select the country you want to test.

<img src="http://i1284.photobucket.com/albums/a576/gerbsen/gif_zps7710423c.gif" alt="Route360°" />


# Bower
You can use our project in bower

    bower install route360#angular-ready --save
