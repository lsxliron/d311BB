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


describe('Testing MapView Functions', function(){
	it('should not not be empty', function(){
		expect(mv.getDomain().length).not.be.equal(0);
	});

	it('Should be [0,1] since testing All_sa normalized', function(){
		expect(mv.getDomain()[0]).to.equal(0);
		expect(mv.getDomain()[1]).to.equal(1);
	});

	it('should be the same as min and max colors', function(){
		expect(mv.minColor).to.be.equal(mapViewOptions.minColor)
		expect(mv.maxColor).to.be.equal(mapViewOptions.maxColor)
	});

	it('should not be undefined', function(){
		expect(mv.svgWidth).not.to.equal(undefined);
	});




})
