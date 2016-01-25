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

		updateInfoPanel: function(numOfRegions, percentageRegions, population, complainPercentage){
			$('#numOfRegions')[0].innerHTML = numOfRegions;
			$('#regionPercentage')[0].innerHTML = percentageRegions;
			$('#populationValue')[0].innerHTML = population;
			$('#complaintPercentage')[0].innerHTML = complainPercentage

		},

		init: function(){
			var _this = this;
			//Set select borough menu functionality
			$('#applyBoroughs').on('click', function(){ return _this.updateSelectedBoroughs() })
			$('#applyGraph').on('click', function(){ return _this.generateNewParCoor() })
			$('#applyMatrix').on('click', function(){ return _this.generateNewSplom() })
			//Load field names
			var fieldNames = _this.loadDataFieldNames()

			//Add field names to drop down menu
			for (var key in fieldNames){
				$('#matrixDropdown > .dropdown-menu').append('<li><input type="checkbox" id=' + key + ' /> <label>' + fieldNames[key] + '</label></li>')
				$('#graphDropdown > .dropdown-menu').append('<li><input type="checkbox" id=' + key + ' /> <label>' + fieldNames[key] + '</label></li>')
			}
		},

		loadDataFieldNames: function(){
			var fieldNames = {}
			$.ajax({
				dataType: 'json',
				async: false,
				url: 'data/field_names.json',
				success: function(data){
					for (var key in data)
						fieldNames[key] = data[key] 
				}
			})
			return fieldNames
		},


		generateNewParCoor: function(){
			var newFields = []
			$.each($('#graphDropdown > .dropdown-menu > li > input[type="checkbox"'), function(i, d){
				if (d.checked)
					newFields.push(d.id)
			});

			app.vents.trigger('updateParCoorFields', {fields: newFields})
		},

		generateNewSplom: function(){
			var newFields = []
			$.each($('#matrixDropdown > .dropdown-menu > li > input[type="checkbox"'), function(i, d){
				if (d.checked)
					newFields.push(d.id)
			});

			app.vents.trigger('updateSplomFields', {fields: newFields})

		}
	}
})