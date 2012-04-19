L.GeoJSON.WFS.ClickResponder = L.Class.extend({
	initialize: function(options) {
		L.Util.setOptions(this, options);
		this.getFeatureBaseUrl = this.options.url + "?request=GetFeature&outputformat=json&typename=" + this.options.featureType + "&version=" + this.options.version || "1.1.0";
		
		this.options.map.wfsClickResponse = this;
		this.options.map.on("click", this.getFeature);
	},

	getFeature: function(event) {
		var that = this.wfsClickResponse;
 		var cqlFilter = "&cql_filter=CONTAINS(" + that.options.geomFieldName + ", POINT (" + event.latlng.lng + " " + event.latlng.lat + "))";
		var getFeatureUrl = that.getFeatureBaseUrl + cqlFilter;	
		
		$.ajax({
			url: getFeatureUrl,
			type: "GET",
			success: function(response) {
				if (response.type && response.type == "FeatureCollection") {
					if (response.features.length > 0) {
						that.highlightFeature(response.features[0]);
					}
				}
			},
			dataType: "json"
		});
	},
	
	highlightFeature: function(feature) {
		var options = this.options;
		var map = options.map; 
		if (map.highlightedFeature) { map.removeLayer(map.highlightedFeature); }
		map.highlightedFeature = featureLayer = new L.GeoJSON();
		featureLayer.on("featureparse", function(f) {
			f.layer.setStyle({ stroke: true, color: "#FFF000", weight: 3, opacity: 1.0, fill: false });
			
			if (options.popupObj && options.popupOptions) {
				map.openPopup(options.popupObj.generatePopup(f, options.popupOptions));
				if (options.popupFn) { options.popupFn(f); }
			}
			
			if (options.panelObj) {
				options.panelObj.show(f);
			}
		});
		featureLayer.addGeoJSON(feature);
		map.addLayer(featureLayer);
	}
});