L.Control.Panel = L.Control.extend({
	initialize: function(options) {
		L.Control.prototype.initialize.call(this, null, options);
		L.Util.setOptions(this, options);
	},
	
	onAdd: function(map) {
		this.hidden = true;
		map.activePanel = this;
		
		this._initLayout();
		
		return this._container;
	},
	
	show: function(feature) {
		var closeHTML = "<div id='close-" + this._container.id + "' class='close-panel'></div>";
		this._container.innerHTML = closeHTML + this.options.template.generateContent(feature);
		$("#" + this._container.id).removeClass("panel-control-hidden");
		this.hidden = false;
		
		if (this.options.onShow) { this.options.onShow(); }
	},
	
	hide: function(feature) {
		this._container.innerHTML = "";
		$("#" + this._container.id).addClass("panel-control-hidden");
		this.hidden = true;
	},
	
	_initLayout: function() {
		var mapHeight = this._map.getSize().y;
		var panelHeight = mapHeight;
		var panelWidth = this.options.width || 200;
		var panelId = this.options.id || 'panel-control';
		
		this._container = L.DomUtil.create('div', 'panel-control-hidden');
		this._container.id = panelId;
		this._container.style.height = panelHeight + "px";
		this._container.style.width = panelWidth + "px";
		this._container.style.margin = "0px";
		
		if (!L.Browser.touch) {
			L.DomEvent.disableClickPropagation(this._container);
		} else {
			L.DomEvent.addListener(this._container, 'click', L.DomEvent.stopPropagation);
		}
	}
	
});