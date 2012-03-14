var jade = require("jade");

JadeContent = L.Class.extend({
	options: {
		maxWidth: 600
	},
	
	initialize: function(templateUrl, options) {
		L.Util.setOptions(this, options || {});
		
		var that = this;
		$.ajax({
			url: templateUrl,
			async: false,
			success: function(result) { that.jadeFn = jade.compile(result); }
		});
	},
	
	generateContent: function(feature) {
		return this.jadeFn(feature.properties);
	},
	
	generatePopup: function(feature, options) {		
		if (options.centered) { popup = new L.Popup.Centered(options); }
		else { popup = new L.Popup(options); }
		
		popup.setLatLng(feature.layer._latlng);
		popup.setContent(this.generateContent(feature));
		return popup;
	}
});