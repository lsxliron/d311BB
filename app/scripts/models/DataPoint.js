// (function(app){

// 	app.models.DataPoint = Backbone.Model.extend({

// 	defaults:{},
// 	initialize:function(){
// 		this.selected=false;
// 	}

// 	})
	
	
// })(this.app)

define(['jquery', 'backbone'], function($, Backbone){
	var DataPoint = Backbone.Model.extend({

		defaults:{},
		initialize:function(){
			this.selected=false;
		}
	});

	return DataPoint;
});