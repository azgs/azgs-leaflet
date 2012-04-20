L.Popup.Centered = L.Popup.extend({
	initialize: function(options, source) {
		options = options || {};
		options.autoPan = false;
		options.className = options.className ? options.className + " " : "";
		options.className += "centered-popup";
		L.Popup.prototype.initialize.call(this, options, source);
	},
	
	_initLayout: function() {
		L.Popup.prototype._initLayout.call(this);
		this._container.removeChild(this._tipContainer);
	},
	
	_updatePosition: function() {
		var mapSize = this._map.getSize(),
			pos = this._map.containerPointToLayerPoint(new L.Point(Math.round(mapSize.x / 2),Math.round(mapSize.y / 2)));
		
		this._containerHeight = this._container.clientHeight;
		
		this._containerTop = pos.y - Math.round(this._containerHeight / 2) - this.options.offset.y;
		this._containerLeft = pos.x - Math.round(this._containerWidth / 2) + this.options.offset.x;
		
		this._container.style.top = this._containerTop + 'px';
		this._container.style.left = this._containerLeft + 'px';
	}
});