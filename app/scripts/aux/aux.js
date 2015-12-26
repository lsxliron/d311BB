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



		
	}
})