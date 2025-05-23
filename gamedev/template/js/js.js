game = new Game()
ui = new UI()
ui.refresh()

function randNum(min, max) {
	return Math.round(Math.random() * (max - min) + min);
}