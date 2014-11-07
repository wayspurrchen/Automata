function GameUILayer(game) {
	function idealTextColor(bgColor) {
	   var nThreshold = 105;
	   var components = getRGBComponents(bgColor);
	   var bgDelta = (components.R * 0.299) + (components.G * 0.587) + (components.B * 0.114);
	   return ((255 - bgDelta) < nThreshold) ? "#000000" : "#ffffff";   
	}
	function getRGBComponents(color) {       

	    var r = color.substring(1, 3);
	    var g = color.substring(3, 5);
	    var b = color.substring(5, 7);

	    return {
	       R: parseInt(r, 16),
	       G: parseInt(g, 16),
	       B: parseInt(b, 16)
	    };
	}
	var me = this;
	this.game = game;
	this.canvas = this.game.artist.canvas;
	var $canvas = $(this.canvas);
	var $picker = this.game.$view.find('#brood-picker');
	var $speed = this.game.$view.find('#speed-input');
	var $broodSpans = this.game.$view.find('.brood-counters');

	var broodTemplate = _.template($('#broods-template').html());
	this.renderBroodSquares = function(distributions) {
		for (var i = 0; i < distributions.length; i++) {
			var color = idealTextColor(distributions[i].brood);
			distributions[i].text = color
		}

		var $compiled = $(broodTemplate({
			broods: distributions
		}));
		$broodSpans.empty().append($compiled);
	};
	
	this.game.$view.find('#play').on('click', function() {
		me.game.controller.play();
	});
	this.game.$view.find('#pause').on('click', function() {
		me.game.controller.pause();
	});
	this.game.$view.find('#submit-speed').on('click', function() {
		var speed = parseInt($speed.val(), 10);
		me.game.controller.setSpeed(speed);
	})
	var elemLeft = this.canvas.offsetLeft;
	var elemTop = this.canvas.offsetTop;

	this.updatePickerColor = function(hex) {
		this.game.selectedColor = hex;
		$picker.css('background-color', hex);
		hex = hex.substring(1);
	}

	var defaultColor = '#ff00ff';
	this.updatePickerColor(defaultColor);

	// Default color
	$picker.colpick({
		color: defaultColor.substring(1),
		onChange:function(hsb, hex, rgb, el, bySetColor) {
			me.updatePickerColor('#' + hex);
		}
	});

	function paintCell(e) {
		var rect = me.canvas.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        x = Math.floor(x / me.game.Constants.GRID_CELL_SIZE);
        y = Math.floor(y / me.game.Constants.GRID_CELL_SIZE);

        // Grab space, exit if not available
        var spaceClicked = me.game.grid.getSpace(x, y);
        if (!spaceClicked) return;

        // Grab brood or create if color not used before
        var color = me.game.selectedColor;
        var brood = me.game.controller.getBrood(color);
        if (!brood) {
        	brood = me.game.controller.addBrood(color);
        }
        // Create the cell!
        me.game.cellController.createCell(brood, spaceClicked, true);
        // Draw it
        me.game.artist.draw();
	}

	// Mouse interactions
	var isDragging = false;
	$canvas.on('mousedown', function() {
	    $(window).on('mousemove', function(e) {
	    	paintCell(e);
	        isDragging = true;
	    });
	})
	.on('mouseup', function() {
	    var wasDragging = isDragging;
	    isDragging = false;
	    $(window).off("mousemove");
	});
}