define(['backbone', 'jquery', 'd3'], function(Backbone, $, d3){

	var SplomView = Backbone.View.extend({


		tagName: 'g',

		//TODO: Change SPLOM size according to device
		initialize: function(options){
			this.points = options.options.points;
			this.fields = options.options.fields;
			this.pointRadius = options.options.pointRadius;
			this.padding = 19.5
			this.size = 120
			this.width = 960
			this.yNumOfTicks = options.options.yNumOfTicks
			this.xNumOfTicks = options.options.xNumOfTicks
			this.numberFormat = options.options.numberFormat
			this.domainByComplaints = {};
			this.complaints = [];
			this.numOfBins = options.options.numOfBins;
			this.x = d3.scale.linear().range([this.padding/2, this.size - this.padding/2]);
			this.y = d3.scale.linear().range([this.size - this.padding/2, this.padding/2]);
			this.xAxis = d3.svg.axis()
						   .scale(this.x)
						   .orient('bottom')
						   .ticks(this.xNumOfTicks)
						   .tickFormat(d3.format(this.numberFormat));

			this.yAxis = d3.svg.axis()
						   .scale(this.y)
						   .orient('left')
						   .ticks(this.yNumOfTicks)
						   .tickFormat(d3.format(this.numberFormat));

			this.svgSplom = d3.select('#splomContainer').append('svg').attr('id','splomSVG')
			
			app.vents.on('pathHovered', this.inflatePoints, this);
			app.vents.on('pathHoverEnded', this.deflatePoints, this);
			app.vents.on('pathIsSelected', this.updateSplom, this);
			app.vents.on('pointHovered', this.inflatePoints, this);
			app.vents.on('pointHoverEnded', this.deflatePoints, this);
			this.render();
		},

		render: function(){
			var _this = this;

			this.complaints = d3.keys(_this.points[0]).filter(function(d){
						return _this.fields.indexOf(d) != -1;
			});

			// number of dimensions
			var n = _this.complaints.length;

			_this.complaints.forEach(function(complaint){
				_this.domainByComplaints[complaint] = d3.extent(_this.points, function(d){ return d[complaint]; });
			});

			_this.xAxis.tickSize(_this.size * n);
			_this.yAxis.tickSize(-_this.size * n);

			//Sets the SVG size
			_this.svgSplom = _this.svgSplom.attr('width', _this.size * n + _this.padding + 80)
		 	     		          .attr('height', _this.size * n + _this.padding + 10)
						 		  .append('g')
							 	  .attr("transform", "translate(" + (_this.padding+10)+"," + ((_this.padding / 2)) + ")");

			//Insert x axis
			_this.svgSplom.selectAll('.x.axis')
				 .data(_this.complaints)
				 .enter().append('g')
				 .attr('class', 'x axis')
				 .attr("transform", function(d, i) { return "translate(" + (n - i - 1) * _this.size + ",0)"; })
				 .each(function(d){ 
				 	    _this.x.domain(_this.domainByComplaints[d]); 
				 	    d3.select(this).call(_this.xAxis); 
		 	});

			//Insert y axis
			_this.svgSplom.selectAll('.y.axis')
				 .data(_this.complaints)
				 .enter().append('g')
				 .attr('class', 'y axis')
				 .attr("transform", function(d, i) { return "translate(0," + i * _this.size + ")"; })
				 .each(function(d){ 
			 	    _this.y.domain(_this.domainByComplaints[d]); 
			 	    d3.select(this).call(_this.yAxis); 
		 	});


			//Creates cells for the matrix
			var cell = _this.svgSplom.selectAll('.cell')
		    			    .data(_this.cross(_this.complaints, _this.complaints))
						    .enter().append('g')
							.attr('class', 'cell')
							.attr("transform", function(d) { 
								return "translate(" + (n - d.i - 1) * _this.size + "," + d.j * _this.size + ")"; 
							})
							.each(function(d){
						  		if (d.i!=d.j)
								  	_this.plotScatter(this, d, _this.domainByComplaints);
							  	else
							  		_this.plotHist(this, d, 10);
							});

			return this;
		},//END RENDER



		plotScatter:function(cellElement, p){
			var _this = this;
	    
			var cell = d3.select(cellElement);
			_this.x.domain(_this.domainByComplaints[p.x]);
			_this.y.domain(_this.domainByComplaints[p.y]);
			// _this.pointsData = _this.getCurrentPointsData();
			

			cell.append('rect')
			    .attr('class', 'frame')
			    .attr('x', _this.padding/2)
			    .attr('y', _this.padding/2)
			    .attr('width', _this.size - _this.padding/2)
			    .attr('height', _this.size - _this.padding/2);

			cell.selectAll('circle')
		        .data(_this.points)
			    .enter()
			    .append('circle')
		    	.attr('cx', function(d){ 
			    	return _this.x(d[p.x]); 
			    })
			    .attr('cy', function(d){ 
			    	return _this.y(d[p.y]); 
			    })
			    .attr('r', _this.pointRadius)
			    .attr('opacity', 0.5)
			    .attr('class', function(d){ return 'Pt' + d.BoroCT2010; })
			    .attr('visibility', 'visible')
			    .on('mouseenter', function(d){
			    	app.vents.trigger('pointHovered', {id:this.classList[0].slice(2)})
			    })
			    .on('mouseleave', function(d){
			    	app.vents.trigger('pointHoverEnded', {id:this.classList[0].slice(2)})
			    })
		    
			    // .on('mouseenter', function(d){ _this.magnifyPointMapToSplomIn(d); })
			    // .on('mouseout', function(d){ _this.magnifyPointMapToSplomOut(d); });

		},

		plotHist: function(cellElement, p, numOfBins){
			var _this = this;
			
			var numOfBins = 10;
			
			var cell = d3.select(cellElement);
			_this.x.domain(_this.domainByComplaints[p.x]);
			_this.y.domain(_this.domainByComplaints[p.y]);
		

			cell.append('rect')
			    .attr('class', 'frame')
			    .attr('x', _this.padding/2)
			    .attr('y', _this.padding/2)
			    .attr('width', _this.size - _this.padding/2)
			    .attr('height', _this.size - _this.padding/2);

			var values=[];
		

			_this.points.forEach(function(d){ values.push(d[p.x]); });

			_this.histData = d3.layout.histogram()
				 			   .bins(numOfBins)
							    (values);

			_this.histY = d3.scale.linear()
				 .domain([0, d3.max(_this.histData, function(d){ return d.y; })])
				 .range([_this.size - _this.padding/2, _this.padding/2]);


			var bar = cell.selectAll('.bar')
						  .data(_this.histData)
						  .enter().append('g')
						  .attr('class', 'bar')
						  .attr("transform", function(d) { 
						  	return "translate(" + _this.x(d.x) + "," + _this.histY(d.y) + ")"; 
						});

			bar.append('rect')
			   .attr('x', 1)
			   .attr('width', (_this.size - _this.padding/2)/(numOfBins * 1.7))
			   .attr('height', function(d){ return _this.size - _this.histY(d.y); });	    	
		},


		cross: function(a,b){
			var c = [];
			var n = a.length;
			var m = b.length;
			var i;
			var j;

			for (i=-1; ++i<n;)
				for (j=-1; ++j<m;)
					c.push({x:a[i], i:i, y:b[j], j:j});
			return c;
		},

		inflatePoints: function(e){
			var pointsClass = '.Pt' + e.id;
			d3.select('#splomSVG').selectAll(pointsClass).transition().duration(100)
			.attr('r', 10)
			.attr('opacity', 0.5)
			.style('fill','#FF0000')

		},

		deflatePoints: function(e){
			var pointsClass = '.Pt' + e.id;
			d3.select('#splomSVG').selectAll(pointsClass).transition().duration(100)
			.attr('r', this.pointRadius)
			.style('fill', '#565D56')
			.attr('opacity', 1)
		},

		updateSplom: function(e){
			var _this = this;

			//Get selected path data
			var selectedPaths = e.selectedPaths;
			var selectedPathsData = this.points.filter(function(d){
				if (selectedPaths.indexOf(d.BoroCT2010.toString()) != -1)
					return d;
			});

			//Remove all points from SPLOM if only one region is selected
			if (selectedPathsData.length == 1){
					d3.selectAll('#splomContainer').selectAll('circle').remove();
			}

			var cell = d3.selectAll('.cell');
			var c = cell.data(_this.cross(_this.complaints, _this.complaints)).each(function(p){
				if (p.i != p.j){
					//Set axes domains
					var xDomain = d3.extent(selectedPathsData, function(d){ return d[p.x]; })
					var yDomain = d3.extent(selectedPathsData, function(d){ return d[p.y]; })
					
					if (xDomain[0]==xDomain[1])
						xDomain[0]=0
					
					if (yDomain[0]==yDomain[1])
						yDomain[0] = 0

					_this.x.domain(xDomain)
					d3.select('.x.axis').call(_this.xAxis)
				
				
					_this.y.domain(yDomain)				
					d3.select('.y.axis').call(_this.yAxis)

					// Plot new points
					d3.select(this).selectAll('circle').data(selectedPathsData)
					.enter().append('circle')
					//TODO: Add mouse events
					// .on('mouseover', function(d){_this.magnifyPointMapToSplom(d)})
					// .on('mouseenter', function(d){ _this.magnifyPointMapToSplomIn(d); })
					// .on('mouseout', function(d){ _this.magnifyPointMapToSplomOut(d); })
					
					.attr('cx', function(d){ 
						return _this.x(parseFloat(d[p.x])); 
					})
				    .attr('cy', function(d){ 
				    	return _this.y(parseFloat(d[p.y])); 
				    })
				    .attr('class', function(d){
				    	return 'Pt'+ d.BoroCT2010;
				    })
				    .attr('r', 0)
				    .on('mouseenter', function(d){
				    	app.vents.trigger('pointHovered', {id:d.BoroCT2010})
				    })
				    .on('mouseleave', function(d){
				    	app.vents.trigger('pointHoverEnded')
				    })
				    .transition().duration(500)
				    .attr('visibility', 'visible')
				    .each('end', function(){
				    	d3.select(this).transition().duration(500)
	    				  .attr('r', 5)
				          .each('end', function(){
				    	  		d3.select(this).transition().duration(500)
				    			  .attr('r', _this.pointRadius) 
				    	});
					});
				}
				//update Histogram
				else{
					_this.updateHist(this, p, selectedPaths)
				}
			}).call(function(){
				if (e.selectedPaths.length>1)
					_this.scaleGraph(e)
			});
		},

		updateHist: function(cellElement, p, selectedPaths){
			var _this = this;
			var values = [];

			var pointsData = _this.points.filter(function(d){
				if (selectedPaths.indexOf(d.BoroCT2010.toString()) != -1)
					return d;
			});

			pointsData.forEach(function(d){ values.push(d[p.x]); });

			_this.complaints.forEach(function(complaint){
				_this.domainByComplaints[complaint] = d3.extent(pointsData, function(d){ return d[complaint]; });
			});

			_this.y.domain(_this.domainByComplaints[p.y]);
			_this.x.domain(d3.extent(values));
			_this.histData = d3.layout.histogram()
							   .bins(_this.numOfBins)
							   (values);

			_this.histY.domain([0, d3.max(_this.histData, function(d){ return d.y; })]);

			var bar = d3.select(cellElement).selectAll('.bar')
						.data(_this.histData)
						.transition().duration(1000)
						.attr("transform", function(d) { 
							var xTrans = _this.x(d.x) ? _this.x(d.x) : 0;
							return "translate(" + xTrans + "," + _this.histY(d.y) + ")"; 		  	 	
			});

			d3.select(cellElement).selectAll('.bar rect').data(_this.histData)
			  .attr('y', 0)	//for animation
			  .transition().duration(1000)
			  .attr('width', (_this.size - _this.padding/2)/17)
			  .attr('height', function(d){ 
			  		if(d.y==0){ return 0; }; return _this.size - _this.histY(d.y);
			  });

		},

		scaleGraph: function(e){
			var _this = this;
			var allDomains = {};
			var allXDomains = {};
			var yDomains = [];
			var xDomains = [];

			
			var pointsData = _this.points.filter(function(d){
				if ((e.selectedPaths).indexOf(d.BoroCT2010.toString()) != -1)
					return d;
			});

			$.each(_this.cross(_this.complaints, _this.complaints), function(i, p){

				//Get Y axis domain
				var tempDomain = d3.extent(pointsData, function (d){ return d[p.y]; })
				allDomains[p.i + ',' + p.j] = tempDomain
				
				//Get X axis domain
				tempDomain = d3.extent(pointsData, function (d){ return d[p.x]; });
					allXDomains[p.i + ',' + p.j] = tempDomain;
			});

			//Find X axis domain
			for (var m=0; m<3; m++){
				var tempXDomain=[999,0];
				for (var n=0; n<3; n++){
					if (n != m){
						key = m + ',' + n
					
					if (allXDomains[key][0] < tempXDomain[0])
						tempXDomain[0] = allXDomains[key][0];

					if (allXDomains[key][1] > tempXDomain[1])
						tempXDomain[1] = allXDomains[key][1];
					}
				}
				xDomains.push(tempXDomain);
			}

			//Find Y axis domain
			for (var m=0; m<3; m++){
		
				var tempYDomain = [999,0];
		
				for (var n=0; n<3; n++){
		
				if (n != m){
					key = n + ',' + m;
				if (allDomains[key][0] < tempYDomain[0])
					tempYDomain[0] = allDomains[key][0];

				if (allDomains[key][1] > tempYDomain[1])
					tempYDomain[1] = allDomains[key][1];
				}
			}
			yDomains.push(tempYDomain);
		}

		//Scale the graph
		var cells = d3.selectAll('.cell').data(_this.cross(_this.complaints,_this.complaints));
		
		cells.filter(function(q){return q.i != q.j}).each(function (p){
		
			//Scale the axes
			_this.y.domain(yDomains[p.j]);
			_this.x.domain(xDomains[p.i]);
			
			// Get the axis to redraw
			var tempYaxis = d3.selectAll('.y.axis')[0][p.j];
			var tempXaxis = d3.selectAll('.x.axis')[0][p.i];
			
			// Redraw the axes
			d3.select(tempYaxis).call(_this.yAxis);
			d3.select(tempXaxis).call(_this.xAxis);
			

			// Redraw the points with the new scale
			d3.select(this).selectAll('circle').data(pointsData)
				.transition()
				.duration(500)
				.attr('cy', function (d){ return _this.y(d[p.y]); })
				.attr('cx', function (d){ return _this.x(d[p.x]); })
				.attr('class', function(d){return 'Pt'+d.BoroCT2010})
				.attr('r', _this.pointRadius)
	});





		},





	})//END VIEW

	return SplomView;



});