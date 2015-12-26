require.config({

	paths: {
		"jquery": "vendor/jquery/dist/jquery",
		"underscore": "vendor/underscore/underscore",
		"backbone": "vendor/backbone/backbone",
		"d3": "vendor/d3/d3",
		"bootstrap": "vendor/bootstrap/dist/js/bootstrap",
		"path": "models/Path",
		"datapoint": "models/DataPoint",
		"auxFunctions": "aux/aux"
	},

	shim: {
		"bootstrap" : { "deps" :['jquery'] }
	}
});


//Main function
require(['jquery', 
	     'bootstrap',
	     'underscore',
		 'path',
	     'datapoint',
	     'collections/DataPoints',
	     'collections/Map',
	     'views/MapView',
	     'views/LegendView',
	     'views/SplomView',
	     'views/ParCoorView',
	     'auxFunctions'], 
	     function($, bootstrap, _, Path, DataPoint, DataPoints, Map, MapView, LegendView, SplomView, ParCoorView,aux){
	
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
	      numOfBins: 10,
	      pointRadius: 2,
	      yNumOfTicks: 4,
	      xNumOfTicks: 3,
	      numberFormat: '.1f',
	      points: dataPoints.toJSON()
	    };

	    var parCoorFields = {
	    	"All_sa":"Sewer Complaints",
			"All311":"Sewer Comp. N_311.",
			"All_DEP":"Sewer Comp. N_DEP.",
			"R":"Rainfall Correlation",
			"Elevation":"Elevation (ft)",
			"Slope":"Slope",
			"Flow":"Flow Accumulation",
			"Race_White":"White Race (%)",
			"Race_Black":"African American (%)",
	    };
	    var parCoorOptions = {
	    	fields: parCoorFields,
	    	width: $('#parCoorContainer').width(),
	    	height: screen.width * .1,
	    	minColor: '#8EA6E8',
	        maxColor: '#F23A46',
	    	points: dataPoints.toJSON()
	    };


		mv = new MapView({model: map, options: mapViewOptions})
		lv = new LegendView({options: legendViewOptions})
	    sv = new SplomView({options: splomViewOptions})
	    pc = new ParCoorView({options: parCoorOptions})
})