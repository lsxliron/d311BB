define(['d3','jquery', 'pnotify'], function(d3, $, PNotify){
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

		/*
		* Updates the map, splom and parcoor when the user selectes
		* a borugh from the region list in the navbar.
		*/
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

		/*
		* Updates the information panel on the bottom of the page.
		* @param {Number} numOfRegions - The total number of regions in the map,
		* @param {Number} precentageRegions - The percentage of the selected regions.
		* @param {Number} population - The total number of population.
		* @param {number} complainPercentage - The percentage of complaints in the selected regions.
		*/
		updateInfoPanel: function(numOfRegions, percentageRegions, population, complainPercentage){
			$('#numOfRegions')[0].innerHTML = numOfRegions;
			$('#regionPercentage')[0].innerHTML = percentageRegions;
			$('#populationValue')[0].innerHTML = population;
			$('#complaintPercentage')[0].innerHTML = complainPercentage

		},


		/*
		* Initialize the navbar and menus.
		* @param {Array} fieldNames - an array of strings which contains all the variable names.
		*/
		init: function(fieldNames){
			var _this = this;
			//Set select borough menu functionality
			$('#applyBoroughs').on('click', function(){ return _this.updateSelectedBoroughs() })
			$('#applyGraph').on('click', function(){ return _this.generateNewParCoor() })
			$('#applyMatrix').on('click', function(){ return _this.generateNewSplom() })

			//Add field names to drop down menu
			for (var key in fieldNames){
				$('#matrixDropdown > .dropdown-menu').append('<li><input type="checkbox" id=' + key + ' /> <label>' + fieldNames[key] + '</label></li>')
				$('#graphDropdown > .dropdown-menu').append('<li><input type="checkbox" id=' + key + ' /> <label>' + fieldNames[key] + '</label></li>')
			}
		},

		/*
		* Load the file which contains the variable names.
		* @return {Array} An array which variables names.
		*/
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


		/*
		* Generates a new parallel coordinates graph with the variables
		* the user selected in the navbar dropdown.
		*/
		generateNewParCoor: function(){
			var newFields = []
			$.each($('#graphDropdown > .dropdown-menu > li > input[type="checkbox"'), function(i, d){
				if (d.checked)
					newFields.push(d.id)
			});
			if ((newFields.length < 2) || (newFields.length >10)){
				new PNotify({
					title: 'Too many fields selected!',
					text: 'Please choose up to 10 fields',
					type: 'error',
					animate_speed: "slow",
					animation: "fade",
					delay: 3000,
					shadow: true,
					mouse_reset:true
				});
			}
			else
				app.vents.trigger('updateParCoorFields', {fields: newFields})
		},


		/*
		* Generates a new matrix of scatter plot with the variables
		* the user selected in the navbar dropdown.
		*/
		generateNewSplom: function(){
			var newFields = []
			$.each($('#matrixDropdown > .dropdown-menu > li > input[type="checkbox"'), function(i, d){
				if (d.checked)
					newFields.push(d.id)
			});

			if (newFields.length != 3){
				new PNotify({
					title: 'Too many fields selected!',
					text: 'Please exactly 3 fields',
					type: 'error',
					animate_speed: "slow",
					animation: "fade",
					delay: 3000,
					shadow: true,
					mouse_reset:true
				});
			}
			else
				app.vents.trigger('updateSplomFields', {fields: newFields})

		}
	}
})