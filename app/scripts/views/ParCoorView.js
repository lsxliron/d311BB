define(['underscore', 'backbone', 'jquery', 'd3', 'auxFunctions'], function(_, Backbone, $, d3, aux){
	var ParCoorView = Backbone.View.extend({
		tagname: 'g',

		initialize: function(options){
			_.bindAll(this, 'transition');
			var _this = this;
			this.fieldsObj = options.options.fields;
			this.fields = options.options.fields;
			this.fieldNames = options.options.fieldNames;
			this.points = options.options.points;
			this.width = options.options.width;
			this.height = options.options.height
			this.minColor = options.options.minColor;
			this.maxColor = options.options.maxColor;
			this.axis = d3.svg.axis().orient('left');
			this.dimensions = [];
			this.colorPalette = null;
			this.graphGroup = null;
			this.foreground = null;
			this.backgroun = null;



			this.x = d3.scale.ordinal().rangePoints([0, this.width],1);
			this.y = {};
			this.line = d3.svg.line();
			this.dragging = {};






			//Setup SVG
			d3.select('#parCoorContainer')
			  .append('svg').attr('id', 'parCoorSVG')
			  .attr('width', _this.width)
			  .attr('height', _this.height)
			  .attr('fill','red')	// TODO: REMOVE FILL
			  .append('g')
			  .attr('id', 'parCoorRoot')


			this.svg = d3.select('#parCoorSVG')


			app.vents.on('pathIsSelected', this.updateParCoor, this);
			app.vents.on('updateParCoorFields', this.generateNewParCoor, this)

		    this.render()
		},

		render: function(){

			var _this = this;

			_this.x.domain(_this.dimensions = d3.keys(_this.points[0]).filter(function(d){
				return (_this.fields.indexOf(d) != -1) && (_this.y[d] = d3.scale.linear()
				.domain(d3.extent(_this.points, function(p){ 
					return +p[d]
				}))
				.range([_this.height, 0]))
			}));


			//Prepare the background gray lines
			_this.background = _this.svg.select('#parCoorRoot').append('g').attr('class', 'background')
 								    .selectAll('path')
 								    .data(_this.points)
 								    .enter()
 								    .append('path')
 								    .attr('d', function(d){
 								    	return _this.path(d)
 								    });
 								    
 			_this.setColorPalette(_this)

 			//Prepare the foreground colorful lines
			_this.foreground = _this.svg.select('#parCoorRoot').append('g').attr('class', 'foreground')
								     .selectAll('path')
								     .data(_this.points)
								     .enter()
								     .append('path')
								     .attr('id', function(d){ return 'Pc' + d.BoroCT2010 })
								     .attr('d', function(d){ return _this.path(d) })
								     .style('stroke', function(d){
									  	  return _this.colorPalette(d[_this.fields[0]])
									});



			//Add group element for each dimension
			_this.graphGroup = _this.svg.select('#parCoorRoot').selectAll('.dimensions').data(_this.dimensions)
						  .enter()
						  .append('g')
						  .attr('class', 'dimension')
						  .attr('transform', function(d){return 'translate('+ _this.x(d) + ')'; })
						  .call(d3.behavior.drag()
						  	.origin(function(d){ return {x: _this.x(d)}; })
							  	.on('dragstart', function(d){
							  	  	_this.dragging[d] = _this.x(d);
							  	  	_this.background.attr('visibility', 'hidden');
							  	})
							  	.on('drag', function(d){
									_this.dragging[d] = Math.min(_this.width, Math.max(0, d3.event.x));
							  	  	_this.foreground.attr('d', function(d){ return _this.path(d) });
							  	  	_this.dimensions.sort(function(a, b){ return _this.position(a) - _this.position(b); });
							  	  	_this.x.domain(_this.dimensions);
	  						  	  	_this.graphGroup.attr('transform', function(d){ return 'translate('  + _this.position(d) + ')' });
							  	})
							  	.on('dragend', function(d){	
								  	delete _this.dragging[d];
							  	  	_this.transition(d3.select(this)).attr('transform', 'translate(' + _this.x(d) + ')');
							  	  	_this.transition(_this.foreground).attr('d', function(d){ return _this.path(d) });
	  						  	  	_this.background.attr('d', function(d){ return _this.path(d) })
					  	  				.transition().delay(500).duration(0).attr('visibility', null);
							  	  	_this.colorByFirstAxis()

							  	  	var axisDomain = d3.extent(_this.points, function(p){return p[d]})

							  	  	app.vents.trigger('parCoorAxisDragged', {axisDomain:axisDomain})
							  	}));
			//Put axis
			_this.graphGroup.append('g')
					.attr('class', 'axis')
					.each(function(d){ 
						d3.select(this).call(_this.axis.scale(_this.y[d]).tickSize(5)); 
					})
					.append('text')
					.attr('class', 'parCoorAxis')
					.style('text-anchor', 'start')
					.attr('y', 0)
					.attr('dy', 0)
					.text(function(d){ 
						return _this.fieldNames[d]
						// return _this.fieldsObj[d] 
					});

			d3.selectAll('.parCoorAxis').call(function(d){
				aux.wrap(d, _this.x.rangeBand())
			})

			_this.colorByFirstAxis(d3.select('#parCoorRoot').selectAll('text')[0])


			//Put brushes
			_this.graphGroup.append('g')
						.attr('class', 'brush')
						.each(function(d){
							d3.select(this)
							  .call(_this.y[d].brush = d3.svg.brush().y(_this.y[d])
							  					         .on('brushstart', function(){ return _this.brushstart() })
							  					         .on('brush', function(){ return _this.brush(_this) })
							  							 .on('brushend', function(){return _this.brushend(_this)})

						//})
						)})
						.selectAll('rect').attr('x',-8).attr('width', 16)



			return this;


		},

		// Helper function to draw the path
		path: function(d){
			var _this = this;

			return _this.line(_this.dimensions.map(function(p) { 
				return [_this.position(p), _this.y[p](d[p])]; 
			}));
		},

		// Set the color pallete range according to the left most axis
		setColorPalette: function(context){
			var _this = context;
			_this.colorPalette = d3.scale.linear()
							   .domain(_this.y[_this.fields[0]].domain())
							   .range([_this.minColor, _this.maxColor])
			
		},

		// Setting the color pallet acoording to the given key {string}
		setColorPaletteWithKey: function(key){
			var _this = this;
			var colorPalette = d3.scale.linear()
				                 .domain(_this.y[key].domain())
								 .range([_this.minColor, _this.maxColor]);

			_this.colorPalette = colorPalette;
		},

		//Helper function for dragging the axes
		position: function(d){
			var _this = this;

			var v = _this.dragging[d];
			return v == null ? _this.x(d) : v;
		},


		// Colors the parcoor according to the left most axis
		colorByFirstAxis:  function(){
			var _this = this;
			var keysObj= {}
			d3.selectAll('.dimension').each(function(d){
				var transX = d3.transform(d3.select(this).attr('transform')).translate[0]
				keysObj[d] = transX
			});

			var minVal = 999999999;
			var minKey;
			var keys = _this.fields

			$.each(keys, function(i, d){
				if (keysObj[d] < minVal){
					minVal = keysObj[d];
					minKey = d;
				}
			});



			_this.setColorPaletteWithKey(minKey)
			d3.select('.foreground').selectAll('path').style('stroke', function(d){return _this.colorPalette(d[minKey])})
			app.vents.trigger('parCoorAxisChange', {axis: minKey})

		},

		//helper functions:
		transition: function(g){
			return this.graphGroup.transition().duration(500);
		},

		brushstart: function(){
			try{
				d3.event.sourceEvent.stopPropagation();
			}
			catch(err){
				console.log("");
			}
		},

		brush: function(context){
			var _this = context;
			var actives = _this.dimensions.filter(function(p){ return !_this.y[p].brush.empty(); });
			var extents = actives.map(function(p){ return _this.y[p].brush.extent() });
			_this.foreground.style('display', function(d){
				return actives.every(function(p, i){
					if(extents[i][0] <= d[p] && d[p] <= extents[i][1]){
						d.selected=true
						return true;
					}
					else{
						d.selected=false;
						return false;
					}


				}) ? null:'none';
			});
			
			if (actives.length == 0){
				$.each(_this.points, function(i, d){d.selected=true});

			}
		},

		brushend: function(context){
			var _this = context;
			var selectedPaths = [];
			var selectedPathsData = _this.points.filter(function(d){return d.selected == true})
			$.each(selectedPathsData, function(i, d){ selectedPaths.push(d.BoroCT2010.toString()) })
			app.vents.trigger('parCoorSelectionDone', {selectedPaths:selectedPaths})
			app.vents.trigger('pathIsSelected', {selectedPaths:selectedPaths})

		},

		//Updates parallel coordinates after region selection on map.
		updateParCoor: function(e){
			var _this = this;
			d3.select('.foreground').selectAll('path')
			.style('display', function(d){
				if (e.selectedPaths.indexOf(d.BoroCT2010.toString()) != -1)
					return null;
				return 'none';
			});

			//UPDATE INFORMATION PANEL
			var population = 0;
			var allComplaints = 129.35;//K
			var sumOfComplaints = 0;
			var selectedLinesData = _this.getVisibleLines()
			var allLines = (d3.select('#parCoorSVG')
						 			     .select('.foreground')
						 			     .selectAll('path')[0]).length
			var regionPercentage = ((parseFloat(selectedLinesData.length) / parseFloat(allLines)) * 100).toFixed(2)
			$.each(selectedLinesData, function(i, d){
				population += d['Pop']
				sumOfComplaints += d['All_sa']
			});

			var complainPercentage = ((parseFloat(sumOfComplaints) / parseFloat(allComplaints))*100).toFixed(2)
			aux.updateInfoPanel(selectedLinesData.length, regionPercentage, population, complainPercentage)
		},

		
		// Generates a new parcoor according to the fields in the {event} e
		generateNewParCoor: function(e){
			var _this = this;
			_this.fields = e.fields;
			d3.select('#parCoorRoot').selectAll('*').remove();
			_this.render()


		},

		//Returns the data of all the visible (selected) lines
		getVisibleLines: function(){
			return (d3.select('#parCoorSVG')
			   .select('.foreground')
			   .selectAll('path')
			   .filter(function(d){ return d3.select(this).style('display')!='none' }))
		.data()	
		}

	});	//END VIEW

	return ParCoorView;
})