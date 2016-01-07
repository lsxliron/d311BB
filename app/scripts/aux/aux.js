define(['d3','jquery'], function(d3,$){
	return{
		
		/*
		* Wrap the labels of the graph
		* @param {string} text - The text to wrap.
		* @param {Number} width - The desired text width.
		*/
		wrap: function(text, width) {
			text.each(function() {
				var text = d3.select(this),
		        words = text.text().split(/\s+/).reverse(),
		        word,
		        line = [],
		        lineNumber = 0,
		        lineHeight = 1.1, // ems
		        y = text.attr("y"),
		        dy = parseFloat(text.attr("dy")),
		        tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
			    while (word = words.pop()) {
					line.push(word);
					tspan.text(line.join(" "));
					if (tspan.node().getComputedTextLength() > width) {
						line.pop();
						tspan.text(line.join(" "));
						line = [word];
						tspan = text.append("tspan").attr("x", 1).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
					}
			    }
			});
		},

		updateSelectedBoroughs: function(){
			var selectedBoroughs = [];
			var selectedPaths = []
			$.each($('#regionsDropdown > ul > li > input[type="checkbox"]'), function(i, d){
				if (d.checked)
					selectedBoroughs.push('.' + d.id.slice(0,2))
			});
			app.vents.trigger('clearMap');
			$.each(selectedBoroughs, function(i, d){
				d3.selectAll(d).each(function(d){
					selectedPaths.push(d.properties.BoroCT2010.toString())
				})

			})
			app.vents.trigger('boroughSelected', {selectedPaths: selectedPaths})
		},

		init: function(){
			var _this = this;
			$('#applyBoroughs').on('click', function(){ return _this.updateSelectedBoroughs() })
		}
	}
})