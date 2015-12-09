require(['jquery', 
	     'backbone',
	     'models/Path'], 
	     function($, Backbone, Path){
		
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

})


// define(function (require){
	// var $ = require('./assets/jquery/jquery-2.1.4'),
		
// 	    d3 = require('./assets/d3/d3.min'),
// 	    _  = require('./assets/Backbone/underscore'),
// 	    Backbone = require('./assets/Backbone/backbone'),
// 	    Path = require('./models/Path'),
// 	    Map = require('./collections/Map'),
// 	    DataPoint = require('./models/DataPoint'),
// 	    DataPoints = require('./collections/DataPoints'),
// 	    MapView = require('./views/MapView'),
// 	    LegendView = require('./views/LegendView'),
// 	    SplomView = require('./views/SplomView');







	 //    <script type="text/javascript" src=""></script>
  // <script type="text/javascript" src=""></script>
  // <script type="text/javascript" src=""></script>
  // <script type="text/javascript" src="assets/bootstrap3.6/js/bootstrap.min.js"></script>

  // // <script type="text/javascript" src="namespacer.js"></script>
  // // <script type="text/javascript" src="app.js"></script>
  // // <script type="text/javascript" src="models/Path.js"></script>
  // // <script type="text/javascript" src="collections/Map.js"></script>
  // <script type="text/javascript" src="models/DataPoint.js"></script>
  // <script type="text/javascript" src="collections/DataPoints.js"></script>
  // <script type="text/javascript" src="views/MapView.js"></script>
  // <script type="text/javascript" src="views/LegendView.js"></script>
  // <script type="text/javascript" src="views/SplomView.js"></script>-->
// })


