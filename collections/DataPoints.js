(function(app){

	app.collections.DataPoints = Backbone.Collection.extend({
		model: app.models.DataPoint,
		url: 'data/Final_Data.json',

		initialize: function(options){
			this.fetch({async: false});
			return this;
		}
	})
})(this.app);