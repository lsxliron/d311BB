// (function(app){
define(['backbone', 'jquery', 'd3'], function(Backbone, $, d3){
	
	var MapView = Backbone.View.extend({
		tagName: 'g',


		initialize: function(options){
			this.points = options.options.points
			this.svgHeight = screen.height*.5;
			this.svgWidth = $('#mapContainer').width();
			this.maxColor = options.options.maxColor
			this.minColor = options.options.minColor
			this.sortBy = options.options.sortBy
			// this.maxColor = "#F23A46";
			// this.minColor = "#8EA6E8";
			// this.sortBy = 'All_sa'
			
			//TODO: Add Ipad and other tablets projections.
			// this.projection = d3.geo.albersUsa().translate([-13700, 3411]).scale(47000); //Desktop
			// this.projection = d3.geo.albers().translate([-11375, 2830]).scale(38900);	//iPhone5
			// this.projection = d3.geo.albers().translate([-11340, 2820]).scale(38900);	//iPhone6
			this.projection = d3.geo.albers().translate([-12215, 3050]).scale(41900);//iPhone6Plus	

            this.path = d3.geo.path().projection(this.projection);
			
			this.colorPalette = d3.scale.linear()
						          .domain(this.getDomain())
						          .range([this.minColor, this.maxColor]);

			//Listen if meta key clicked
			$(document).keydown(function(e){
				if (e.ctrlKey || e.metaKey)
					app.helpers.meta = true
			});

			$(document).keyup(function(e){
					app.helpers.meta = false;
			});


			
			
			d3.select('#mapContainer').append('svg')
			  .attr('id','mapSVG')
			  .attr('height', this.svgHeight+'px')
			  .attr('width',this.svgWidth+'px')
			  .attr('viewBox','0,0,' + this.svgWidth + ',' + this.svgHeight)
			  .attr('preserveAspectRatio','xMidYMid meet')
			
			d3.select('#mapSVG').append('g').attr('id','pathMagnifier')
			d3.select('#mapSVG').append('g').attr('id', 'mapLayer')


			app.vents.on('pathClicked', this.selectPath, this)
			app.vents.on('pointHovered', this.inflateRegion, this)
			app.vents.on('pointHoverEnded', this.deflateReagion, this)
			app.vents.on('parCoorAxisChange', this.recolorMap, this)
			this.render()



		},

		render: function(){
			
			var _this = this;

			d3.select('#mapLayer').selectAll('path').data(_this.model.toJSON())
			  .enter()
			  .append('path')
			  .classed('active', true)
			  .attr('d', _this.path)
			  .attr('id', function(d){return 'Pa' + d.properties.BoroCT2010; })
			  .attr('fill', function(d){
			  	var currentPath = _this.points.filter(function(p){
			  		return p.BoroCT2010 == d.properties.BoroCT2010
			  	});
			  	if (currentPath[0])
			  		return _this.colorPalette(currentPath[0][_this.sortBy]);
			  	else
			  		return _this.colorPalette(_this.colorPalette.domain()[0]);
			  })

			  //Set event listeners
			  .on('click', function(){
				  app.vents.trigger('pathClicked', {id:this.id.slice(2)})
			  })
			  .on('mouseenter', function(){
			  	app.vents.trigger('pathHovered', {id:this.id.slice(2)})
			  })
			  .on('mouseleave', function(){
			  	app.vents.trigger('pathHoverEnded', {id:this.id.slice(2)})
			  })
			  .every(function(d){ d.selected = true; })


			  return _this;
		},

		getDomain: function(){
			var _this = this;
			var maxVal = d3.max(this.points, function(d){ return d[_this.sortBy] })
			var minVal = d3.min(this.points, function(d){ return d[_this.sortBy] })
			return [minVal, maxVal]
			// return [0,1]
		},

		selectPath: function(e){



			var pathId = '#Pa'+e.id;

			var isActive = !d3.select(pathId).classed('active')

			//Update model
			this.model.filter(function(d){return d.BoroCT2010 == e.id})[0].selected = isActive;

			if (app.helpers.meta == true){	
				d3.select(pathId).classed('active', isActive)
			}

			else{
				
				this.model.filter(function(d){ return d.selected == true })
				    .every(function(d){
				    	if (d.BoroCT2010 != e.id)
							d.selected=false
						return d;
				});
				
				d3.select('#mapLayer').selectAll('path').classed('active', false)
				d3.select(pathId).classed('active', true)
			}


			var selectedPaths = [];

			this.model.filter(function(d){
						return d.selected==true
				    })
				    .every(function(d){
				    	selectedPaths.push(d.BoroCT2010)
				    	return d;
				    })



			app.vents.trigger('pathIsSelected', {id: e.id ,selectedPaths: selectedPaths})

		},



		inflateRegion: function(e){
			var pathId = '#Pa' + e.id
			var currentPathData = d3.select(pathId).attr('d');
			var origDims = $(pathId)[0].getBoundingClientRect(); //Bounding box without scale
			var zoomScale = 8;
			var pathOrigColor = d3.select(pathId).attr('fill')
			


			// d3.select('#pathMagnifier').selectAll('path').remove()

			d3.select('#pathMagnifier').append('path')
			  .attr('d', currentPathData)
			  .attr('id', 'zoomedPath')
			  .style('fill', 'red')
			  .style('opacity', 0)//CHANGE TO 0

			d3.select('#zoomedPath').attr('transform', 'scale(' + zoomScale + ')');
			var zoomedDims = $('#zoomedPath')[0].getBoundingClientRect();
			d3.select('#zoomedPath').attr('transform', 'scale(1)');
			
			
			var xTrans = ((origDims.left-zoomedDims.left) * 1.0)/ zoomScale;
			var yTrans = ((origDims.top-zoomedDims.top)*1.0 / zoomScale);
			


			d3.select('#pathMagnifier')
			  .select('#zoomedPath')
			  .style('opacity', 1)
			  .transition()
			  .delay(1000)
			  .duration(500)
			  .attr('transform', 'scale(' + zoomScale + ') translate(' + xTrans.toString() + ', ' + yTrans.toString() + ')')
			  // .style('fill', 'red')
			  .each('end', function(){
					d3.select(this)
					  .transition()
					  .duration(500)
					  // .style('opacity',0.0)
					  .attr('transform', 'scale(1) translate(0,0)');
			  });

		},

		deflateReagion: function(e){
			d3.select('#pathMagnifier').selectAll('path').remove()
		},

		recolorMap: function(e){
			var _this = this;
			var sortByParam = e.axis;
			var newDomain = d3.extent(_this.points, function(d){return d[sortByParam]});
			_this.colorPalette.domain(newDomain)
			
			d3.select('#mapLayer').selectAll('path')
			  .attr('fill', function(d){
			  	var currentPath = _this.points.filter(function(p){
			  		return d.properties.BoroCT2010 == p.BoroCT2010
			  	});

			  	if(currentPath[0]) 
				  	return _this.colorPalette(currentPath[0][sortByParam])
				else
					return _this.colorPalette(0);
		});



		
		

	}

});

	// new MapView({model:new Map()});
	return MapView;
});