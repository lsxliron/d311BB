

// (function(app){

	// app.models.Path = Backbone.Model.extend({
	// 	defaults: {},
	// 	events: {},
	// 	// url:'data/gj.json',
	// 	initialize: function(){

	// 		this['selected'] = false;
	// 		this.BoroCT2010 = this.attributes.properties.BoroCT2010
	// 		return this;
	// 	}
	// });
// })(this.app)


define(['jquery', 'backbone'], function($, Backbone){
	
	var Path = Backbone.Model.extend({
		defaults: {},
		events: {},
		// url:'data/gj.json',
		initialize: function(){

			this['selected'] = false;
			this.BoroCT2010 = this.attributes.properties.BoroCT2010
			return this;
		}
	});

	return Path;

});