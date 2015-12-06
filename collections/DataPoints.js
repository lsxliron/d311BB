// (function(){

	var DataPoints = Backbone.Collection.extend({
		model: DataPoint,
		url: 'data/Final_Data.json',

		initialize: function(options){
			this.fetch({async: false});
			return this;
		}
	})
// })();