function AutomataGame(containerSelector, canvas) {
	this.Constants = new AutomataConstants();
	// Set this up to render our page
	this.artist = new GameArtist();
	this.cellController = new CellController();
	this.controller = new GameController();

	// TODO: color available logic

	this.speed = 600;

	this.addBrood('#000000');
	this.grid = new Grid(
		this,
		this.Constants.GRID_WIDTH,
		this.Constants.GRID_HEIGHT,
		containerSelector
	);

	this.generation = 0;

	this.game.play();
}