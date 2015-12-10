define(['underscore',
	    'backbone', 
	    'jquery', 
	    'path', 
	    'hmap',
	    'datapoint', 
	    'datapoints', 
	    'mapview', 
	    'legendview',
	    'splomview',
	    'json!data/Final_Data.json',
	    'json!data/gj.json'], 

		function(_, Backbone, $, Path, Hmap, DataPoint, DataPoints, MapView, LegendView, SplomView, df, geoJson){
			//Setup
			var paths = [];
			window.app={}
			app = window.app;
			app.vents = _.extend({}, Backbone.Events);
			app.helpers={};

			$.each(geoJson['features'], function(i,d){
				paths.push(new Path(d))
			});


			//Initialize Path Collection
			var map = new Hmap(paths)


			//Initialize data points
			var dataPoints = new DataPoints(df);


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

			 var splomViewOptions = {
			      fields: ['All_sa', 'Pop', 'Flow'],
			      points: dataPoints.toJSON()
			    };


			var mv = new MapView({model: map, options: mapViewOptions})
			var lv = new LegendView({options: legendViewOptions})
			var sv = new SplomView({options: splomViewOptions})


			describe('testing SPLOM object', function(){
				it('tests the x and y functions', function(){
					sv.x.domain([0,1]);
					sv.y.domain([0,1]);
					sv.x.range([0,10]);
					sv.y.range([0,10]);
					expect(sv.x(0)).to.equal(0);
					expect(sv.x(1)).to.equal(10);
					expect(sv.x(0.5)).to.equal(5);
					expect(sv.y(0)).to.equal(0);
					expect(sv.y(1)).to.equal(10);
					expect(sv.y(0.5)).to.equal(5);
				});

				it('should not be empty dataset', function(){
					expect(sv.points.length).not.to.equal(0);
				});


				it('Should contain a cross product of the complaints', function(){
					var comps = ['a','b','c']
					var crossComps = sv.cross(comps, comps)
					var item = 0

					//Test function executed
					expect(crossComps.length).to.equal(9)
					
					//Test result content
					for (var i=0; i<comps.length; i++){
						expect(crossComps[item]['x']).to.be.equal(comps[i])
						expect(crossComps[item]['i']).to.be.equal(i)
						for (var j=0; j<comps.length; j++){
							expect(crossComps[item]['y']).to.be.equal(comps[j])
							expect(crossComps[item]['j']).to.be.equal(j)
							item+=1;
					}
			}	
		});
	});
});