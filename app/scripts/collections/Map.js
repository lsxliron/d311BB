define(['backbone', 'path'], function(Backbone, Path){
		var Map = Backbone.Collection.extend({
			model: Path,
	});

	return Map;
});