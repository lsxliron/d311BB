// (function(app){

// 	app.collections.Map = Backbone.Collection.extend({
// 		model: app.models.Path,
// });

// })(this.app);

define(['backbone', 'path'], function(Backbone, Path){
		var Map = Backbone.Collection.extend({
			model: Path,
	});

	return Map;
});