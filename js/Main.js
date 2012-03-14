function init(){
	var map = new L.Map("map");
	
	/* Tilestream Layer example: */
	var historicUrl = "http://opengis.azexperience.org/tiles/v2/azHistoric1880/{z}/{x}/{y}.png",
		historicLayer = new L.TileLayer(historicUrl, {maxZoom: 10}); 
	
	/* ESRI tiled service example: */
	var natGeoLayer = new L.TileLayer.ESRI("http://services.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer");
	
	/* Bing maps example: 
	var bingLayer = new L.TileLayer.Bing(<<Bing Maps API Key>>, "Road"); */
	
	/* WMS layer example: */
	var wmsUrl = "http://opengis.azexperience.org/geoserver/wms",
		wmsLayer = new L.TileLayer.WMS(wmsUrl, { 
			maxZoom: 10, 
			layers: "vae:azhistoricmines", 
			format: "image/png", 
			transparent: true 
		}); 
	
	/* WFS GeoJSON layer example: */
	var wfsLayer = new L.GeoJSON.WFS("http://opengis.azexperience.org/geoserver/wfs", "vae:azhistoricmines", {
		pointToLayer: function(latlng) { return new L.CircleMarker(latlng); },
		popupObj: new JadeContent("templates/example.jade"),
		popupOptions: { maxWidth: 530, centered: false },
		hoverFld: "name"
	}); 
	
	var center = new L.LatLng(34.1618, -111.53332);
	map.setView(center, 7).addLayer(natGeoLayer);
}