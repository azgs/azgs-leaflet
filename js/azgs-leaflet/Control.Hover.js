L.Control.Hover = L.Control.extend({
	options: {
		position: "hover",
		offset: new L.Point(30,-16)
	},
	
	initialize: function(point, content, options) {
		this._point = point;
		this._content = content;
				
		L.Util.setOptions(this, options);
	},
	
	onAdd: function (map) {
		if (!map._controlCorners.hasOwnProperty("hover")) {
			map._controlCorners["hover"] = L.DomUtil.create("div", "custom-hover", map._controlContainer);
		}
		this._container = L.DomUtil.create('div', 'custom-control-hover-label');
		this._container.innerHTML = this._content;
		
		if (this.options.position == "hover") {
			this._container.style.top = this._point.y + this.options.offset.y + "px";
			this._container.style.left = this._point.x + this.options.offset.x + "px";
		}
		
		return this._container;
	}
});