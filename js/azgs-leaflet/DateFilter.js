DateFilter = L.Class.extend({
	initialize: function(dateFieldName, startDate, endDate, options) {
		L.Util.setOptions(this, options || {});
		
		function ISODateString(d){
			 function pad(n){return n<10 ? '0'+n : n;}		 
			 return d.getUTCFullYear()+'-' + pad(d.getUTCMonth()+1)+'-' + pad(d.getUTCDate())+'T' + pad(d.getUTCHours())+':' + pad(d.getUTCMinutes())+':' + pad(d.getUTCSeconds())+'Z';
		}
		
		this.fldName = dateFieldName;
		this.startDate = startDate instanceof Date ? startDate : new Date(startDate);
		this.endDate = endDate instanceof Date ? endDate : new Date(endDate);
		this.cql = escape(this.fldName + " AFTER " + ISODateString(this.startDate) + " AND " + this.fldName + " BEFORE " + ISODateString(this.endDate));	
	}
});