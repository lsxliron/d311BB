// (function(app){

	// app.collections.DataPoints = Backbone.Collection.extend({
	// 	model: app.models.DataPoint,
	// 	url: 'data/Final_Data.json',

	// 	initialize: function(options){
	// 		this.fetch({async: false});
	// 		return this;
	// 	}
	// })
// })(this.app);


define(['underscore', 'jquery', 'backbone', 'datapoint'], function(_, $, Backbone, DataPoint){
		var DataPoints = Backbone.Collection.extend({
		model: DataPoint,
		url: 'data/Final_Data.json',
		
		initialize: function(){
			
			this.fetch({async: false});
			return this;
		}
	});

	return DataPoints;
})