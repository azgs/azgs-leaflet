# AZGS Customized Leaflet map application
This provides some extensions of existing Leaflet classes that are helpful 
for our relatively simple web maps. It also provides a framework on which to 
build a mapping application. This can be used by making adjustments to the 
`js/Main.js` file. Here you can specify what layers you'd like to add, and some
of the functionality of those layers. Examples of different types of layers
are laid out in the existing `js/Main.js`.

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
	- ArcGIS Desktop calls this `Web Mercator (Auxiliary Sphere)`
	- ArcGIS Server will list the service's spatial reference as `102100 (3857)`

### L.GeoJSON.WFS
- Purpose: Provide access to a WFS server capable of providing GeoJSON as an output format.
- Usage Example:

		var geojsonWfsLayer = new L.GeoJSON.WFS("http://opengis.azexperience.org/geoserver/wfs", "vae:azhistoricmines", {
			pointToLayer: function(latlng) { return new L.CircleMarker(latlng); },
			popupObj: new JadeContent("templates/popup.jade"),
			popupOptions: { maxWidth: 530, centered: true },
			hoverFld: "name"
		});
		var map = new L.Map("map");
		map.addLayer(geojsonWfsLayer); 
		
- Options: You must provide a WFS URL and a FeatureType when making a new L.GeoJSON.WFS, and can specify other options:
	- popupObj: An instance of `JadeContent` that will be used to provide a formatted popup
	- popupOptions: Options that should be applied to the L.Popup itself
	- popupFld: The name of a specific property of your GeoJSON features that should provide the popup's content
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
		
			jadeObj = new JadeContent("templates/popup.jade");
			
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
			
		Note that the feature's properties become the context for rendering the Jade template
	
	4. Get an L.Popup or L.Popup.Centered object containing the rendered content:
		
			map.openPopup(jadeObj.generatePopup(options));
			
		Where `options` is an object that specifies if the popup should be centered on the page or not:
		
			options = { centered: true } // Popup will be centered rather than tied to the feature

### L.Control.Hover

### L.DateFilter