//Setup
var paths = [];
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
var dataPoints = new DataPoints();


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


var mv = new MapView({model: map, options: mapViewOptions})
var lv = new LegendView({options: legendViewOptions})

describe('testing SPLOM object', function(){
	it('tests the x and y functions', function(){
		
	})
})