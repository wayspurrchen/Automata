function setup() {
	var $owners = $('#owners');
	for (var i in owners) {
		var $picker = $('<span class="owner-picker">');
		$owners.append($picker);
		$picker.css('background-color', owners[i]);
		var color = owners[i].substring(1);
		$picker.colpick({
			color: color
		});
	}
	makeCells();
}

var game = new AutomataGame('container', $('#canvas')[0]);
game.start();

turn();