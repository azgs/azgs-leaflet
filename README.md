# AZGS Customized Leaflet map application
This provides some extensions of existing Leaflet classes that are helpful 
for our relatively simple web maps. It also provides a framework on which to 
build a mapping application. This can be used by making adjustments to the 
`js/Main.js` file. Here you can specify what layers you'd like to add, and some
of the functionality of those layers. Examples of different types of layers
are laid out in the existing `js/Main.js`.

## Highlights
- Provides layers for tiled ESRI services and for Bing Maps
- Provides an asynchronous WFS layer for WFS servers capable of providing a GeoJSON outputFormat
- Use [Jade Templates](http://jade-lang.com/) to render popup content based on GeoJSON features
- Bundled with [Less.js](http://lesscss.org) for better stylesheets

## Custom Classes
### L.TileLayer.Bing
- Purpose: Provide a Bing Map as an L.TileLayer.
- Usage Example: 

		var bingLayer = new L.TileLayer.Bing(<<Your Bing Maps API Key>>, "Road");
		var map = new L.Map("map");
		map.addLayer(bingLayer);
		
- Options: You can specify which map you want, by chosing from `"Road", "Aerial", "AerialWithLabels"`

### L.TileLayer.ESRI
- Purpose: Provides a tiled ESRI service as an L.TileLayer.
- Usage Example:

		var esriLayer = new L.TileLayer.ESRI("http://services.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer")
		var map = new L.Map("map");
		map.addLayer(esriLayer);
		
- Options: You only need to specify the MapServer URL for the Tiled ESRI Service.
- Note: This will not work with ESRI Services that are not provided in a Web Mercator Projection. 
	ArcGIS Desktop calls this `Web Mercator (Auxiliary Sphere)`. ArcGIS Server will list the service's spatial reference as `102100 (3857)`

### L.GeoJSON.WFS
- Purpose: Provide access to a WFS server capable of providing GeoJSON as an output format.
- Usage Example:

		var geojsonWfsLayer = new L.GeoJSON.WFS("http://opengis.azexperience.org/geoserver/wfs", "vae:azhistoricmines", {
			pointToLayer: function(latlng) { return new L.CircleMarker(latlng); },
			popupObj: new JadeContent("templates/example.jade"),
			popupOptions: { maxWidth: 530, centered: false },
			hoverFld: "name"
		});
		var map = new L.Map("map");
		map.addLayer(geojsonWfsLayer); 
		
- Options: You must provide a WFS URL and a FeatureType when making a new L.GeoJSON.WFS, and can specify other options:
	- popupObj: An instance of `JadeContent` that will be used to provide a formatted popup
	- popupOptions: Options that should be applied to the L.Popup itself
	- popupFld: The name of a specific property of your GeoJSON features that should provide the popup's content
	- popupFn: A function to call when a popup is shown. The function will be passed the feature that belongs to the popup
	- hoverObj: An instance of `JadeContent` that will be used to provide a formatted hover box
	- hoverFld: The name of a specific property of your GeoJSON features that should provide the hover control's content
	- inputCrs: The CRS name (e.g. "EPSG:4326") of the data provided by the WFS. Defaults to "EPSG:900913"

### JadeContent
- Purpose: Render a [Jade Template](http://jade-lang.com/) and optionally provide the content as an L.Popup
- Usage Example:
	1. Make a Jade template file and save it at `templates/example.jade`. The file is a Jade template, and looks like this:
	
			#popup-content
				h3#popup-title= name
				#description-container!= description
	
	2. Create a new instance of the JadeContent class:
		
			jadeObj = new JadeContent("templates/example.jade");
			
	3. Get the rendered content by passing a GeoJSON feature to `JadeContent.generateContent`:
	
			feature = { 
				type: "feature", 
				properties: { 
					name: "Hello World!", 
					description: "My first popup!" 
				}, 
				geometry: {
					type:"Point",
					coordinates: [-1.2563517558699999E7,3812198.1224000007]
				}
			};
			htmlContent = jadeObj.generateContent(feature);
			
		*Note that the feature's properties become the context for rendering the Jade template*
	
	4. Get an L.Popup or L.Popup.Centered object containing the rendered content:
		
			map.openPopup(jadeObj.generatePopup(options));
			
		... where `options` is an object that specifies if the popup should be centered on the page or not:
		
			options = { centered: true } // Popup will be centered rather than tied to the feature

### L.Control.Hover
- Purpose: Provide a control that can be shown when the user hovers over a GeoJSON feature
- Usage Example: 
		
		hoverPoint = new L.Point(150,200);
		hoverContent = "<p>Hello World!</p>";
		control = new L.Control.Hover(hoverPoint, hoverContent, options)
		
- Options: You need to provide the controls content as a string (hoverContent) and the control's anchor point as an L.Point (hoverPoint).
	You can also specify the following options in the `options` object:
	- position: Inherited from L.Control, this defaults to "hover", which places it in a DOM element separated from 
		other controls. Overriding this option will simply place the hover control in the standard DOM position, and
		hoverPoint / offset will be ignored.
	- offset: an instance of L.Point describing how the control should be offset from the hoverPoint. Defaults to 
		L.Point(30,-16), which generally places a single line of text  to the right of the given hoverPoint.

### DateFilter
- Purpose: Filter a GeoJSON.WFS layer by specifying a date range.
- Usage Example:

		var start = new Date("01 01 2012 00:00:00");
		var end = new Date(["02 01 2012 00:00:00");
		var theFilter = new DateFilter("timedate", start, end);
		var wfsLayer = new GeojsonWfsLayer(wfsUrl, featureTypeName, popupContent, theFilter);
		
- Options: You must specify the name of the GeoJSON object's property which contains date information. You must also specify a start and
	end date.	

### L.Marker.AttributeFilter
- Purpose: Provide information about how to symbolize features in a GeoJSON.WFS layer based on the value of a particular feature attribute.
- Usage Example:
		
		var symbolRules = {
			"State Park": new L.Icon({ 
		    	iconUrl: "style/images/azpark.png",
		    	iconSize: new L.Point(60,60),
				shadowUrl: "style/images/azpark-shadow.png",
				shadowSize: new L.Point(60,60)
			}),
			"National Park": new L.Icon({ 
		    	iconUrl: "style/images/nps-logo.png",
		    	iconSize: new L.Point(60,60),
		    	shadowUrl: "style/images/nps-logo-shadow.png",
				shadowSize: new L.Point(60,60)
			})
		};
		
		var wfsLayer = new L.GeoJSON.WFS("http://opengis.azexperience.org/geoserver/wfs", "vae:azparks", {
			pointToLayer: function(latlng) { return new L.Marker.AttributeFilter(latlng, "type", { rules: symbolRules }); }
		}); 
		
- Options: You must specify the L.LatLng of the marker and the name of the attribute that will be used for filtering. If you want it to
	do anything, you should also provide the following in your options object:
	- rules: An object that defines what Icons to use depending on the value of the filter attribute. The object's properties should be
		one possible value for the filter attribute, and the property's value should be the L.Icon instance to use.

## Dependencies / Thanks
- [jQuery](http://jquery.com/)
- [Less.js](http://lesscss.org/)
- [Jade](http://jade-lang.com/)
- [pagameba's Bing layer](https://gist.github.com/1221998)
