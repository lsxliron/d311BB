define(['underscore',
	    'backbone', 
	    'jquery', 
	    'path', 
	    'hmap',
	    'datapoint', 
	    'datapoints', 
	    'mapview', 
	    'legendview',
	    'json!data/Final_Data.json',
	    'json!data/gj.json'], 

	    function(_, Backbone, $, Path, Hmap, DataPoint, DataPoints, MapView, LegendView, df, geoJson){

// define(['underscore', 'jquery', 'backbone', 'json!data/gj.json'], function(_, $, Backbone, geoJson){
	//Setup
	
	var paths = [];
	window.app={}
	app = window.app;
	app.vents = _.extend({}, Backbone.Events);
	app.helpers={};

	$.each(geoJson['features'], function(i,d){
		paths.push(new Path(d))
	});
	
	

	// // //Initialize Path Collection
	var map = new Hmap(paths)
	
	
	// // //Initialize data points
	var dataPoints = new DataPoints({options:{testingData:df}});


	var mapViewOptions = {
	  minColor: '#8EA6E8',
	  maxColor: '#F23A46',
	  sortBy: 'All_sa',
	  points: dataPoints.toJSON()
	};

	var legendViewOptions = {
	  minColor: '#8EA6E8',
	  maxColor: '#F23A46',
	  sortBy: 'All_sa',
	  points: dataPoints.toJSON(),
	  legendWidth: 30

	}
	
	mv = new MapView({model: map, options: mapViewOptions})
	lv = new LegendView({options: legendViewOptions})


	
	describe("Making sure data points are initialized", function(){
		it('Should not be empty', function(){
			expect(dataPoints.length).to.not.equal(undefined);
			expect(dataPoints.length).to.not.equal(0);
		});
	});

});
