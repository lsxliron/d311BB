// (function(){

var Path = Backbone.Model.extend({
	defaults: {},
	events: {},
	// url:'data/gj.json',
	initialize: function(){
		this['selected'] = false;
		return this;
	}
});