var dataPoints
var map
(function(){

	$(document).ready(function(){


		var app = window.app;
		
		//Get paths data
		paths = [];
		$.ajax({
			dataType:'json', 
			async: false,
			url:'data/gj.json', 
			success:function(data){
				$.each(data['features'], function(i,d){
					paths.push(new app.models.Path(d))
				});
			}
		});


		//Initialize Path Collection
		map = new app.collections.Map(paths)

	    
	    //Initialize data points
		dataPoints = new app.collections.DataPoints();
	    

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


		mv = new app.views.MapView({model: map, options: mapViewOptions})
		lv = new app.views.LegendView({options: legendViewOptions})
	    sv = new app.views.SplomView({options: splomViewOptions})
	})
})()
	

