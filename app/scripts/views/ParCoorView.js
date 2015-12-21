define(['underscore', 'backbone', 'jquery', 'd3'], function(_, Backbone, $, d3){
	var ParCoorView = Backbone.View.extend({
		tagname: 'g',

		initialize: function(options){
			_.bindAll(this, 'transition');
			var _this = this;
			this.fieldsObj = options.options.fields;
			this.fields = d3.keys(this.fieldsObj);
			this.points = options.options.points;
			this.width = options.options.width;
			this.height = options.options.height
			this.minColor = options.options.minColor;
			this.maxColor = options.options.maxColor;
			this.axis = d3.svg.axis().orient('left');
			this.dimensions = [];
			this.colorPalette = null;
			this.graphGroup = null;



			this.x = d3.scale.ordinal().rangePoints([0, this.width],1);
			this.y = {};
			this.line = d3.svg.line();
			this.dragging = {};






			//Setup SVG
			d3.select('#parCoorContainer')
			  .append('svg').attr('id', 'parCoorSVG')
			  .attr('width', _this.width)
			  .attr('height', _this.height)
			  .attr('fill','red')
			  .append('g')
			  .attr('id', 'parCoorRoot')


			this.svg = d3.select('#parCoorSVG')


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
							  	}));
			//Put axis
			_this.graphGroup.append('g')
					.attr('class', 'axis')
					.each(function(d){ 
						d3.select(this).call(_this.axis.scale(_this.y[d]).tickSize(5)); 
					})
					.append('text')
					.style('text-anchor', 'start')
					.attr('y', 0)
					.attr('dy', 0)
					.text(function(d){ 
						return _this.fieldsObj[d] 
					});

			
			_this.colorByFirstAxis(d3.select('#parCoorRoot').selectAll('text')[0])



			return this;


		},

		path: function(d){
			var _this = this;

			return _this.line(_this.dimensions.map(function(p) { 
				return [_this.position(p), _this.y[p](d[p])]; 
			}));
		},

		setColorPalette: function(context){
			var _this = context;
			_this.colorPalette = d3.scale.linear()
							   .domain(_this.y[_this.fields[0]].domain())
							   .range([_this.minColor, _this.maxColor])
			
		},

		setColorPaletteWithKey: function(key){
			var _this = this;
			var colorPalette = d3.scale.linear()
				                 .domain(_this.y[key].domain())
								 .range([_this.minColor, _this.maxColor]);

			_this.colorPalette = colorPalette;
		},

		position: function(d){
			var _this = this;

			var v = _this.dragging[d];
			return v == null ? _this.x(d) : v;
		},



		colorByFirstAxis:  function(){
			var _this = this;
			var keysObj= {}
			d3.selectAll('.dimension').each(function(d){
				var transX = d3.transform(d3.select(this).attr('transform')).translate[0]
				keysObj[d] = transX
			});

			var minVal = 999999999;
			var minKey;
			var keys = d3.keys(keysObj)

			$.each(keys, function(i, d){
				if (keysObj[d] < minVal){
					minVal = keysObj[d];
					minKey = d;
				}
			});



			_this.setColorPaletteWithKey(minKey)
			// map.drawMap(_this.map.dataFilePath, _this.map.minColor, _this.map.maxColor, minKey);
			d3.select('.foreground').selectAll('path').style('stroke', function(d){return _this.colorPalette(d[minKey])})
			app.vents.trigger('parCoorAxisChange', {axis: minKey})

		},

		transition: function(g){
			return this.graphGroup.transition().duration(500);
		},

	});	//END VIEW

	return ParCoorView;
})