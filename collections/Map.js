(function(app){

	app.collections.Map = Backbone.Collection.extend({
		model: app.models.Path,
});

})(this.app);