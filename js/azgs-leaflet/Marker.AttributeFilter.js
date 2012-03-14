L.Marker.AttributeFilter = L.Marker.extend({
	initialize: function(latlng, fieldname, options) {
		this._property = fieldname;
		this._rules = options.rules || {};
		L.Marker.prototype.initialize.call(this, latlng, options);
	},
	
	setIcon: function(feature) {
		var value = feature.properties[this._property];
		for (ruleValue in this._rules) {
			if (value == ruleValue) {
				L.Marker.prototype.setIcon.call(this, this._rules[ruleValue]);
				return;
			}
		}
	}
});

/*
case "State Park":
	e.layer.setIcon(new L.Icon({ 
		iconUrl: "style/images/azpark.png",
		iconSize: new L.Point(iconHeight * (258/454),iconHeight),
		shadowUrl: "style/images/azpark-shadow.png",
		shadowSize: new L.Point(iconHeight * (258/454),iconHeight)
	})); 					
	break;
*/