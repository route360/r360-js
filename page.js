        $(document).ready(function(){

            $('#polygonservice-nav').click(function(){
                $('#api-menu > li').removeClass('active');
                $('#polygonservice-nav').parent().addClass('active');
                $('#api-content').html($('#polygonservice-api').html());
            });
            $('#routeservice-nav').click(function(){

                $('#api-menu > li').removeClass('active');
                $('#routeservice-nav').parent().addClass('active');
                $('#api-content').html($('#routeservice-api').html());
            });
            $('#timeservice-nav').click(function(){
                $('#api-menu > li').removeClass('active');
                $('#timeservice-nav').parent().addClass('active');
                $('#api-content').html($('#timeservice-api').html());
            });
            $('#controls-nav').click(function(){
                $('#api-menu > li').removeClass('active');
                $('#controls-nav').parent().addClass('active');
                $('#api-content').html($('#controls-api').html());
            });
            $('#polygons-nav').click(function(){
                $('#api-menu > li').removeClass('active');
                $('#polygons-nav').parent().addClass('active');
                $('#api-content').html($('#polygons-api').html());
            });
            $('#routes-nav').click(function(){
                $('#api-menu > li').removeClass('active');
                $('#routes-nav').parent().addClass('active');
                $('#api-content').html($('#routes-api').html());
            });
            $('#polygonlayer-nav').click(function(){
                $('#api-menu > li').removeClass('active');
                $('#polygonlayer-nav').parent().addClass('active');
                $('#api-content').html($('#polygonlayer-api').html());
            });
            $('#util-nav').click(function(){
                $('#api-menu > li').removeClass('active');
                $('#util-nav').parent().addClass('active');
                $('#api-content').html($('#util-api').html());
            });

// ----------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------

    var mapOne = L.map('map-one').setView([47.050314, 8.307765], 13);
    var mapTwo = L.map('map-two').setView([47.050314, 8.307765], 13);
    var attribution = "&copy; <a href='http://osm.org/copyright'>OpenStreetMap</a> contributors | designed by <a href='http://www.route360.net/de/' target='_blank'>Route360°</a> | <a href='https://www.mapbox.com/'>MapBox</a>";

    L.tileLayer('https://a.tiles.mapbox.com/v3/mi.0ad4304c/{z}/{x}/{y}.png', { maxZoom: 18, attribution: attribution }).addTo(mapOne);
    L.tileLayer('https://a.tiles.mapbox.com/v3/mi.0e455ea3/{z}/{x}/{y}.png', { maxZoom: 18, attribution: attribution }).addTo(mapTwo);

// ----------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------

             $('#googlemaps-nav').click(function(){

                $('#tutorial-menu > li').removeClass('active');
                $('#googlemaps-nav').parent().addClass('active');

                $('#tutorial-content').html(' \
                        <h3>Adding polygons to Google Maps</h3> \
                        <p class="text-justify lead">The methodology to insert polygons to Google Maps is very similar to the one with Leaflet! You need to insert <code>r360-google.js</code> \
                            library to your imports (after the <code>r360-core.js</code>). In this example \
                            we will add a regular colored and a monochrom version of the travel time polygons to \
                            two different maps. You can click on each map and the corresponding polygons will be \
                            updated. \
                        </p> \
                        <div id="google-maps-color-map"></div> \
                        <div id="google-maps-bw-map"></div> \
                        <p class="text-justify lead">And the code with explanations:</p> \
                        <pre class="prettyprint" id="googlemapsExample"></pre>');

                googlemapsExample();
                $('#googlemapsExample').text(googlemapsExample.toString());
                !function ($) { $(function(){ window.prettyPrint && prettyPrint() })}(window.jQuery);
            });


            $('#travelTimecontrol-nav').click(function(){

                $('#tutorial-menu > li').removeClass('active');
                $('#travelTimecontrol-nav').parent().addClass('active');

                $('#tutorial-content').html(' \
                        <h3>Adding a travel time control</h3> \
                        <p class="text-justify lead">In this tutorial, we will show you how to add a <code>TravelTimeControl</code> to the map and add behaviour to it, so that users can select different travel times and the map is automatically updated with larger or smaller (timely speaking) polygons. This tutorial builds up on the getting started section, so if you haven\'t done this already, go ahead and show some polygons! In any case, enjoy!</p> \
                        <div id="map-addTravelTimeControlExample"></div> \
                        <p class="text-justify lead">And the code with explanations:</p> \
                        <pre class="prettyprint" id="addTravelTimeControlExample"></pre>');

                addTravelTimeControl();
                $('#addTravelTimeControlExample').text(addTravelTimeControl.toString());
                !function ($) { $(function(){ window.prettyPrint && prettyPrint() })}(window.jQuery);
            });

            $('#traveltypecontrol-nav').click(function(){

                $('#tutorial-menu > li').removeClass('active');
                $('#traveltypecontrol-nav').parent().addClass('active');

                $('#tutorial-content').html(' \
                        <h3>Adding a travel type control</h3> \
                        <p class="text-justify lead">In this tutorial, we will show you how to add a <code>RadioButtonControl</code> to the map and add behaviour to it, so that users can select different travel type, like bike, car or walk, and the map is automatically updated with the calculated polygons. You can use this <code>RadioButtonControl</code> for anything you want, e.g. select different travel speeds for fast or slow bikers.</p> \
                        <div id="map-addTravelTypeControlExample"></div> \
                        <p class="text-justify lead">And the code with explanations:</p> \
                        <pre class="prettyprint" id="addTravelTypeControlExample"></pre>');

                addTravelTypeControl();
                $('#addTravelTypeControlExample').text(addTravelTypeControl.toString());
                !function ($) { $(function(){ window.prettyPrint && prettyPrint() })}(window.jQuery);
            });

            $('#travelstartdatecontrol-nav').click(function(){

                $('#tutorial-menu > li').removeClass('active');
                $('#travelstartdatecontrol-nav').parent().addClass('active');

                $('#tutorial-content').html(' \
                        <h3>Adding a travel start date and time control for public transportation</h3> \
                        <p class="text-justify lead">I this tutorial, we will examplify how to display polygons for public transportation. Since public transportation is time and date dependent, it follows a given schedule, we need a way to select the time and date the user wants to travel. There are two controls, the  <code>TravelStartTimeControl</code> and <code>TravelStartDateControl</code> which are able to do just that. Since those polygon request, especially for routing times close to 2 hours, might take some time, we also add a <code>WaitControl</code> to the map. So here is the result of this tutorial: </p> \
                        <div id="map-addTravelStartDateControlExample"></div> \
                        <p class="text-justify lead">And the code with explanations:</p> \
                        <pre class="prettyprint" id="addTravelStartDateControlExample"></pre>');

                addTravelStartDateControl();
                $('#addTravelStartDateControlExample').text(addTravelStartDateControl.toString());
                !function ($) { $(function(){ window.prettyPrint && prettyPrint() })}(window.jQuery);
            });

            $('#strokewidthcontrol-nav').click(function(){

                    $('#tutorial-menu > li').removeClass('active');
                    $('#strokewidthcontrol-nav').parent().addClass('active');

                    $('#tutorial-content').html(' \
                        <h3>Adding a polygon stroke width control</h3> \
                        <p class="text-justify lead">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmodtempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodoconsequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p> \
                        <div id="map-addStrokeWidthControlExample"></div> \
                        <p class="text-justify lead">And the code with explanations:</p> \
                        <pre class="prettyprint" id="addStrokeWidthControlExample"></pre>');

                    addStrokeWidthControl();
                    $('#addStrokeWidthControlExample').text(addStrokeWidthControl.toString());
                    !function ($) { $(function(){ window.prettyPrint && prettyPrint() })}(window.jQuery);
            });

            $('#geocodingcontrol-nav').click(function(){

                $('#tutorial-menu > li').removeClass('active');
                $('#geocodingcontrol-nav').parent().addClass('active');

                $('#tutorial-content').html(' \
                        <h3>Adding place autocompletion for variable source points</h3> \
                        <p class="text-justify lead">In this tutorial we will show you how to use the Route360° geocoding service to be able to let users enter for example there home address. We will add a <code>PlaceAutoCompleteControl</code> to the map and bind an action to add or move the marker as well as clearing already shown polygons. The <code>PlaceAutoCompleteControl</code> also offers the ability to add to buttons to it. One button is used to delete already made user inputs and the other should be used to switch source and target for a routing request. The latter will be covered in another tutorial. We will also show you how to update the input field in case the user drags a marker on the map. This can be done through reverse geocoding, which the Route360° API makes really easy.<br/>To not loose track which autocomplete belongs to which marker on the map, we also show how you can use a marker image to visualize the connection.</p><p class="text-justify lead">This service is based on <code>Photon</code>, an open source geocoder built for OpenStreetMap data that you can setup yourself. Checkout and star the project on <a href="https://github.com/komoot/photon">github</a>!</p> \
                        <div id="map-addPlaceAutoCompleteControlExample"></div> \
                        <p class="text-justify lead">And the code with explanations:</p> \
                        <pre class="prettyprint" id="addPlaceAutoCompleteControlExample"></pre>');

                addPlaceAutoCompleteControl();
                $('#addPlaceAutoCompleteControlExample').text(addPlaceAutoCompleteControl.toString());
                !function ($) { $(function(){ window.prettyPrint && prettyPrint() })}(window.jQuery);
            });

            $('#routing-nav').click(function(){

                $('#tutorial-menu > li').removeClass('active');
                $('#routing-nav').parent().addClass('active');

                $('#tutorial-content').html(' \
                        <h3>Routing to targets</h3> \
                        <p class="text-justify lead">In this tutorial we will show you how you can use the <code>RouteService</code> to get routing information for a specific target. You can even specify a list of targets and the service will return you travel information for all of them. Please note that you can specify different routing result granularity levels (see API documentation). We will use the default level in this example. To summerize, we will add a source and two target markers and use public transportation to get from A to B. We will also add a little circle if people have to switch rides on their travel.</p> \
                        <div id="map-routingExample"></div> \
                        <p class="text-justify lead">And the code with explanations:</p> \
                        <pre class="prettyprint" id="routingExample"></pre>');

                routingExample();
                $('#routingExample').text(routingExample.toString());
                !function ($) { $(function(){ window.prettyPrint && prettyPrint() })}(window.jQuery);
            });

            $('#filter-nav').click(function(){

                $('#tutorial-menu > li').removeClass('active');
                $('#filter-nav').parent().addClass('active');

                $('#tutorial-content').html(' \
                        <h3>Filter points of interest by travel time</h3> \
                        <p class="text-justify lead">In this tutorial we will show you how you can use the <code>TimeService</code> to filter a list of your entities by travel time, starting from a source location. In our case we will use all museums from OpenStreetMaps which have a none empty <i>name</i> and <i>website</i>. The marker for these museums will be scaled with respect to the travel time from the source. With this feature users can instantly see which points of interest are closest to them, with respect to the actual travel time and not just beeline. Note that this would not be possible with traditional routing services like Google Maps, since you would have to make one request per place of interest.</p> \
                        <div id="map-filterExample"></div> \
                        <p class="text-justify lead">And the code with explanations:</p> \
                        <pre class="prettyprint" id="filterExample"></pre>');

                filterExample();
                $('#filterExample').text(filterExample.toString());
                !function ($) { $(function(){ window.prettyPrint && prettyPrint() })}(window.jQuery);
            });

            $('#multiple-nav').click(function(){

                $('#tutorial-menu > li').removeClass('active');
                $('#multiple-nav').parent().addClass('active');

                $('#tutorial-content').html(' \
                        <h3>Multiple travel time polygons</h3> \
                        <p class="text-justify lead">Sometimes it might be useful to visual multiple travel time polygons on the same map. For example consider the use case where three friends want to meet in a certain beer pouring establishment, a.k.a bar or pub. You can select three different starting points and get polygons for all three points in a single request. Additionally you can select the method on how the server intersects the polygons. With this method you can generate polygons which only show areas that all users can reach in a given time. Please see the <code>PolygonService API</code> for a complete list of available intersection methods.</p> \
                        <div id="map-multipleExample"></div> \
                        <p class="text-justify lead">And the code with explanations:</p> \
                        <pre class="prettyprint" id="multipleExample"></pre>');

                multipleExample();
                $('#multipleExample').text(multipleExample.toString());
                !function ($) { $(function(){ window.prettyPrint && prettyPrint() })}(window.jQuery);
            });

            $('#inverse-nav').click(function(){

                $('#tutorial-menu > li').removeClass('active');
                $('#inverse-nav').parent().addClass('active');

                $('#tutorial-content').html(' \
                        <h3>Displaying polygons in black and white </h3> \
                        <p class="text-justify lead"> \
                            Sometimes it might be helpful to not display the colored areas that can be reached from a certain location \
                            but to hide areas that are not reachable. In order to do that we created the black and white polygons, or inverse \
                            polygonization as we call it. If you only request a single travel time, and this is probably the most common use case \
                            for this feature (but you can specify as much as you want, see the example below), you can dramatically decrease \
                            processing time on the server side and as a side effect decrease the size of the returned polygon. This might be \
                            especially helpful in mobile environments, where bandwidth is the limit. Additionally, this also helps on slower \
                            machines (mobile phones aren\'t super computers, yet) to convert the returned polygon to SVG. Zooming and panning \
                            should be much smoother with this setting. <br> \
                            You can also adjust the surrounding background color and its opacity as the example shows. \
                        </p> \
                        <div id="map-inverseExample"></div> \
                        <p class="text-justify lead">And the code with explanations:</p> \
                        <pre class="prettyprint" id="inverseExample"></pre>');

                inverseExample();
                $('#inverseExample').text(inverseExample.toString());
                !function ($) { $(function(){ window.prettyPrint && prettyPrint() })}(window.jQuery);
            });

            $('#color-route-nav').click(function(){

                $('#tutorial-menu > li').removeClass('active');
                $('#color-route-nav').parent().addClass('active');

                $('#tutorial-content').html(' \
                        <h3>Customizing route styles</h3> \
                        <p class="text-justify lead"> \
                            This should be pretty straightforward. Below is a list of supported options. Should this not be enough for your \
                            use case, please drop us a line! \
                        </p> \
                        <div id="map-colorRouteExample"></div> \
                        <p class="text-justify lead">And the code with explanations:</p> \
                        <pre class="prettyprint" id="colorRouteExample"></pre>');

                colorRouteExample();
                $('#colorRouteExample').text(colorRouteExample.toString());
                !function ($) { $(function(){ window.prettyPrint && prettyPrint() })}(window.jQuery);
            });

            $('#htmlControl-nav').click(function(){

                $('#tutorial-menu > li').removeClass('active');
                $('#htmlControl-nav').parent().addClass('active');

                $('#tutorial-content').html(' \
                        <h3>Displaying html content on the map</h3> \
                        <p class="text-justify lead">In case you have a map only view, it sometimes might help to have the ability to display results on the map. Consider the example where you are searching for an apartments and click on a marker. You probably want to show the routes from the source points to the target apartment. You can use a simple HTML leaflet control to display this. (or in our demo case to show some kittens :)</p> \
                        <div id="map-htmlControlExample"></div> \
                        <p class="text-justify lead">And the code with explanations:</p> \
                        <pre class="prettyprint" id="htmlControlExample"></pre>');

                htmlControlExample();
                $('#htmlControlExample').text(htmlControlExample.toString());
                !function ($) { $(function(){ window.prettyPrint && prettyPrint() })}(window.jQuery);
            });

            $('#errorHandling-nav').click(function(){

                $('#tutorial-menu > li').removeClass('active');
                $('#errorHandling-nav').parent().addClass('active');

                $('#tutorial-content').html(' \
                        <h3>Handling errors returned from the server</h3> \
                        <div class="row"> \
                            <div class="col-md-12"> \
                                <p class="lead"> \
                                    Each of the Route360° web services take a success and error callback function as parameters. Since we also support \
                                    older version if Internet Explorer we issue all our requests via JSONP. Unfortuneatly this makes it very hard \
                                    to catch server side errors or exceptions. We walkaround this limitation by returning a 200 Request Ok and return \
                                    a JSON Object that looks like this: <code>{ data : [], status : "", message : "" }</code>. We can the evaluate the \
                                    given errors at least after the timeout defined for the <code>jQuery.ajax()</code> call. The currently possbile error codes \
                                    are: \
                                </p>\
                            </div> \
                        </div> \
                        <div class="row"> \
                            <div class="col-md-6"> \
                                <h4 style="text-transform: lowercase;"><i class="fa fa-angle-double-right"></i> service-not-available</h4> \
                                <p class="text-justify"> \
                                    This exceptions happens if the hole Route360° web service is not available. This might be due to a service \
                                    restart/update or a complete outage. We are closely monitoring our service availablity, so should you receive \
                                    this message for longer than a short period of minutes and you are sure you configured the service url correct, \
                                    please don\'t hesitate to contact us. \
                                </p> \
                                <h4 style="text-transform: lowercase;"><i class="fa fa-angle-double-right"></i> no-route-found</h4> \
                                <p class="text-justify"> \
                                    This exception is thrown if there is no route between a given source and target point. This can happen, if for \
                                    example the target point is on an island and therefore no direct connection to the main network exists. \
                                </p> \
                                <h4 style="text-transform: lowercase;"><i class="fa fa-angle-double-right"></i> travel-time-exceeded</h4> \
                                <p class="text-justify"> \
                                    This exception happens if the travel time between a given source and target point exceeds the server side \
                                    limitation of 12 hours.\
                                </p> \
                            </div> \
                            <div class="col-md-6"> \
                                <h4 style="text-transform: lowercase;"><i class="fa fa-angle-double-right"></i> wrong-configuration</h4> \
                                <p class="text-justify"> \
                                    This exception is thrown if the configuration of each service is incorrect, for example if a travel type \
                                    that is not supported or a transit date not covered by the server is given. \
                                </p> \
                                <h4 style="text-transform: lowercase;"><i class="fa fa-angle-double-right"></i> could-not-connect-point-to-network</h4> \
                                <p class="text-justify"> \
                                    The service connects the given source and target points to the underlying OSM network. Therefore we calculate \
                                    the closest edge to the given point that matches the given travel type. If we can\'t find such an edge this \
                                    exception is returned. \
                                </p> \
                            </div> \
                        </div> \
                        <p class="text-justify lead">The code should produce an error message:</p> \
                        <div id="r360-error" class="alert alert-danger" style="display: none;" role="alert"></div> \
                        <pre class="prettyprint" id="errorHandlingExample"></pre>');

                errorHandlingExample();
                $('#errorHandlingExample').text(errorHandlingExample.toString());
                !function ($) { $(function(){ window.prettyPrint && prettyPrint() })}(window.jQuery);
            });

// ------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------

            var url = $(window.location).attr("href");
            // some link on the page was clicked
            if ( url.lastIndexOf('#') > 0 ) {

                // get the link
                var segment = url.substring(url.lastIndexOf('#') + 1);

                // api section
                if ( _.contains(['polygonservice', 'routeservice', 'timeservice', 'util', 'polygonlayer', 'routes', 'polygons', 'controls'], segment) ) {
                    
                    $('#'+segment+'-nav').trigger( "click" );
                    $('html, body').animate({ scrollTop: $('#api').offset().top }, 1000);
                }
                // tutorial section
                else {

                    $('#'+segment+'-nav').trigger( "click" );
                    $('html, body').animate({ scrollTop: $('#tutorials').offset().top }, 1000);
                }
            } 

            !function ($) { $(function(){ window.prettyPrint && prettyPrint() })}(window.jQuery);

// -------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------
            
            $("#create-user-form").validate({
                rules: {
                    first_name: {
                        required: true
                    },
                    last_name: {
                        required: true
                    },
                    phone : {
                        required: true  
                    },
                    email: {
                        required:   true,
                        email:      true,
                        remote: {
                            url: r360.config.serviceUrl + r360.config.serviceVersion + '/apiKey/check?key=' + r360.config.serviceKey,
                            type: "get",
                            data: {
                                email : function() {
                                    return $( "#email" ).val();
                                }
                            }
                        }
                    },
                    company: {
                        required: false
                    },
                    URL: {
                        required: false
                    },
                    region: {
                        required: true
                    },
                    description: {
                        required: true
                    }
                },
                messages : {
                    email : {
                        remote : "This email address is already registered for the Route360° API."
                    }
                },
                highlight: function (element) {

                    $(element).closest('.form-group').removeClass('has-success').addClass('has-error');
                },
                success: function (element) {
                    
                    element.addClass('valid').closest('.form-group').removeClass('has-error').addClass('has-success');
                }
            });

            $('#api-submit').on('click', function(){
                
                if ( $('#create-user-form').valid() ) {

                    $('#api-submit').prop('disabled', true);

                    var params = ['firstname=' + $("#first_name").val(), 
                                  'lastname=' + $("#last_name").val(), 
                                  'email=' + $("#email").val()];

                    $.getJSON(r360.config.serviceUrl + r360.config.serviceVersion + '/apiKey?' + params.join("&") + '&key=' + r360.config.serviceKey, 
                        function(result){   

                            $("#api-key").html(result.apiKey);
                            $("#api-key-result-success").show();
                            $("#api-key-result-error").hide();

                            $.post("sendmail.php", 
                                { 
                                    to      : ["developers@route360.net", result.email].join(", "), 
                                    from    : "developers@route360.net", 
                                    subject : "Route360° API Key", 
                                    message : generateEmail(result.apiKey, $("#country").val(), $("#00N20000007VCHL").val(), $("#phone").val())
                                }
                            )
                            .done(function( data ) {
                                
                                document.getElementById('create-user-form').submit();                                
                            });
                        })
                        .fail(function(jqXHR, status, error){

                            $.post("sendmail.php", 
                                { 
                                    to      : "developers@route360.net", 
                                    from    : "developers@route360.net", 
                                    subject : "Error while creating new user", 
                                    message : "The user with " + $("#email").val() + " could not register!"
                                }
                            );

                            $("#api-key-result-success").hide();
                            $("#api-key-result-error").show();
                        });
                }
            });

            function generateEmail(key, region, description, phone) {

                return "<html><head></head><body> \
                    <p>Congratulations, you have successfully generated your Route360° API key. Your account is now activated. Your API key is <b>"+key+"</b>. The <i>r360.config.serviceUrl</i> for this developer preview is <b>http://api.route360.net/api_dev/</b>. <br>This preview is limited to the Berlin/Brandenburg area for now. If you need a different area please drop us a mail.<br>If you have any further questions please don't hesitate to contact us at <a href='mailto:developers@route360.net'>developers@route360.net</a>.</p> \
                    <h4>Phone/Skype</h4> \
                    <p>" + phone + "</p> \
                    <h4>Region</h4> \
                    <p>" + region + "</p> \
                    <h4>Description</h4> \
                    <p>" + description + "</p> \
                    </body></html>";
            }
        });