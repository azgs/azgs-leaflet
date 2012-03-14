L.TileLayer.ESRI = L.TileLayer.extend({
	initialize: function(url, options) {
		this._baseUrl = url;
		this._loadMetadata();
		this._url = url + "/tile/{z}/{y}/{x}.png";
		
		L.Util.setOptions(this, options);
	},
	
	_loadMetadata: function() {
		this._callbackId = "esri_tilelayer_" + (L.TileLayer.Bing._callbackId++);
		that = this;
	    window[this._callbackId] = function() { L.TileLayer.ESRI.processMetadata.apply(that, arguments); };
	    
	    var url = this._baseUrl + L.Util.getParamString({ f: "json", callback: this._callbackId }),
        	script = document.createElement("script");
	        
	    script.type = "text/javascript";
	    script.src = url;
	    script.id = this._callbackId;
	    document.getElementsByTagName("head")[0].appendChild(script);	    	
	},
	
	_onMetadataLoaded: function() {},
	
	onAdd: function(map, insertAtTheBottom) {
		this._map = map;
	    if (!this.metadata) {
	    	this._onMetadataLoaded = L.Util.bind(function() {
	    		L.TileLayer.prototype.onAdd.call(this, map, insertAtTheBottom);
	    	}, this);
	    } else {
	    	L.TileLayer.prototype.onAdd.call(this, map, insertAtTheBottom);
	    }
	 },
	  
	onRemove: function(map) {
	   if (this._map.attributionControl) {
	     this._map.attributionControl.removeAttribution(this.attribution);
	   }
	}
});

L.TileLayer.ESRI._callbackId = 0;

L.TileLayer.ESRI.processMetadata = function(metadata) {
	  this.metadata = metadata;
	  this.attribution = metadata.copyrightText;
	  if (this._map.attributionControl) { this._map.attributionControl.addAttribution(this.attribution); }
	  this._onMetadataLoaded();
};