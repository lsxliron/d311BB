// (function(){
	
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
			this.projection = d3.geo.albersUsa().translate([-13700, 3411]).scale(47000); //Desktop
			// this.projection = d3.geo.albers().translate([-11375, 2830]).scale(38900);	//iPhone5
			// this.projection = d3.geo.albers().translate([-11340, 2820]).scale(38900);	//iPhone6
			// this.projection = d3.geo.albers().translate([-12215, 3050]).scale(41900);//iPhone6Plus	

            this.path = d3.geo.path().projection(this.projection);
			
			this.colorPalette = d3.scale.linear()
						          .domain(this.getDomain())
						          .range([this.minColor, this.maxColor]);
			
			
			d3.select('#mapContainer').append('svg')
			  .attr('id','mapSVG')
			  .attr('height', this.svgHeight+'px')
			  .attr('width',this.svgWidth+'px')
			  .attr('viewBox','0,0,' + this.svgWidth + ',' + this.svgHeight)
			  .attr('preserveAspectRatio','xMidYMid meet')
			
			d3.select('#mapSVG').append('g').attr('id', 'mapLayer')

			this.render()

		},

		render: function(){
			
			var _this=this;

			d3.select('#mapLayer').selectAll('path').data(_this.model.toJSON())
			  .enter()
			  .append('path')
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
			  });


			  return _this;
		},

		getDomain: function(){
			var _this = this;
			var maxVal = d3.max(this.points, function(d){ return d[_this.sortBy] })
			var minVal = d3.min(this.points, function(d){ return d[_this.sortBy] })
			return [minVal, maxVal]
			// return [0,1]
		}

	})

	// new MapView({model:new Map()});
// })();