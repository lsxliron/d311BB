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


mv = new MapView({model: map, options: mapViewOptions})
lv = new LegendView({options: legendViewOptions})


describe("Making sure data points are initialized", function(){
	it('Should not be empty', function(){
		expect(dataPoints.length).to.not.equal(0);
	});
});