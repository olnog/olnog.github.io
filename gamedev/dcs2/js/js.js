game = new Game()
ui = new UI()
ui.refresh()
loop = new Loop();

function randNum(min, max) {
	return Math.round(Math.random() * (max - min) + min);
}