game = new Game()
game.init();
ui = new UI()
ui.refresh()

setInterval(game.loop.go.bind(game.loop), game.config.interval_cycle)
function randNum(min, max) {
	return Math.round(Math.random() * (max - min) + min);
}

function fetch_distance (from_x, from_y, to_x, to_y){
	let distance = Math.sqrt(Math.pow(from_x - to_x, 2) + Math.pow(from_y - to_y, 2))
	return Math.abs(distance)
}