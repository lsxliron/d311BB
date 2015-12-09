(function(app){

	app.models.DataPoint = Backbone.Model.extend({

	defaults:{},
	initialize:function(){
		this.selected=false;
	}

	})
	
	
})(this.app)