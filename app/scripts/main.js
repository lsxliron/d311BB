require.config({
	paths: {
		"jquery": "vendor/jquery/dist/jquery",
		"underscore": "vendor/underscore/underscore",
		"backbone": "vendor/backbone/backbone",
		"d3": "vendor/d3/d3",
		"bootstrap": "vendor/bootstrap/dist/js/bootstrap",
		"path": "models/Path",
		"datapoint": "models/DataPoint"
	}
});


//Main function
require(['underscore',
		 'path',
	     'datapoint',
	     'collections/DataPoints',
	     'collections/Map',
	     'views/MapView',
	     'views/LegendView',
	     'views/SplomView'], function(_, Path, DataPoint, DataPoints, Map, MapView, LegendView, SplomView){

	window.app = {};
	app.vents = _.extend({}, Backbone.Events);
	app.helpers = {};

	paths = [];
		$.ajax({
			dataType:'json', 
			async: false,
			url:'data/gj.json', 
			success:function(data){
				$.each(data['features'], function(i,d){
					paths.push(new Path(d))
				});
			}
		});

		//Initialize Path Collection
		var map = new Map(paths)

	    
	    //Initialize data points
		dataPoints = new DataPoints();
	    

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
	    };

	    var splomViewOptions = {
	      fields: ['All_sa', 'Pop', 'Flow'],
	      points: dataPoints.toJSON()
	    };


		mv = new MapView({model: map, options: mapViewOptions})
		lv = new LegendView({options: legendViewOptions})
	    sv = new SplomView({options: splomViewOptions})
})