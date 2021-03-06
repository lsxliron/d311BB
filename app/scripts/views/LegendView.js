define(['backbone', 'jquery', 'd3'], function(Backbone, $, d3){

	var LegendView = Backbone.View.extend({

		tagName: 'g',

		initialize: function(options){
			this.points = options.options.points;
			this.svgHeight = screen.height*.5;
			this.maxColor = options.options.maxColor
			this.minColor = options.options.minColor
			this.sortBy = options.options.sortBy
			this.legendWidth = options.options.legendWidth
			this.legendHeight = this.svgHeight-10;

			this.colorPalette = d3.scale.linear()
							      .domain(this.getDomain())
							      .range([this.minColor, this.maxColor]);


			d3.selectAll('#legendContainer').append('svg')
			  .attr('id', 'legendSVG')
			  .attr('height',this.svgHeight)
			  .attr('preserveAspectRatio', 'xMidYMid meet')
			d3.select('#legendSVG').append('g').attr('id', 'legendGroup').attr('transform','translate(0,0)')

			app.vents.on('parCoorAxisDragged', this.updateLegend, this)
			this.render()
		},

		/*
		* Returns the domain of the current dataset (one dimension)
		* @return {Array} The min and max values ([min, max]).
		*/
		getDomain: function(){
			var _this = this;
			var maxVal = d3.max(this.points, function(d){ return d[_this.sortBy] });
			var minVal = d3.min(this.points, function(d){ return d[_this.sortBy] });
			return [minVal, maxVal]
		},

		render: function(){
			var _this = this;

			//Define colors
			var gradient = d3.select('#legendGroup').append("defs")
						        .append('linearGradient')
						        .attr('id', 'gradient')
						        .attr('x1', '0%')
						        .attr('y1', '100%')
						        .attr('x2', '0%')
						        .attr('y2', '0%')
						        .attr('spreadMethod', 'pad');

	        gradient.append('stop')
	                .attr('offest', '0%')
	                .attr('stop-color', _this.colorPalette.range()[0])
	                .attr('stop-opacity', '1');

	        gradient.append('stop')
	                .attr('offset', '100%')
	                .attr('stop-color', _this.colorPalette.range()[1])
	                .attr('stop-opacity', '1');


	        // Add legend
	        d3.select('#legendGroup').append('rect')
	             .attr('x', _this.legendWidth * 0.01)
	             .attr('y', 0)
	             .attr('width', _this.legendWidth * 0.9)
	             .attr('height', _this.legendHeight)
	             .style('fill', 'url(#gradient)');

	        
	        // Create legend ticks
	        d3.select('#legendGroup').selectAll('text').remove()
	        
	        d3.select('#legendGroup').append('text')
	             .attr('y',_this.legendHeight)
	             .attr('x',_this.legendWidth)
	             .attr('id', 'bottomLabel')
	             .text((_this.colorPalette.domain()[0]).toFixed(3));

	        d3.select('#legendGroup').append('text')
	             .attr('y', _this.legendHeight * 0.02)
	             .attr('x',_this.legendWidth)
	             .attr('id', 'topLabel')
	             .text((_this.colorPalette.domain()[1]).toFixed(3));

	        d3.select('#legendGroup').append('text')
	             .attr('y', ((_this.legendHeight)+(_this.legendHeight*0.02)) / 2)
	             .attr('x',_this.legendWidth)
	             .attr('id', 'middleLabel')
	             .text(((_this.colorPalette.domain()[0] + _this.colorPalette.domain()[1]) / 2).toFixed(3));

	        return this;
		},

		/*
		* Updates the text of the legend ticks
		* @param {Event} e - A click event with an array which contains the data domain
		*/
		updateLegend: function(e){
			d3.select('#bottomLabel').text(e.axisDomain[0].toFixed(3))
			d3.select('#topLabel').text(e.axisDomain[1].toFixed(3))
			d3.select('#middleLabel').text(((e.axisDomain[0]+e.axisDomain[1])/2).toFixed(3))
		},
	});

	return LegendView;

});