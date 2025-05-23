$(document).on('click', '', function(e){

})

$(document).on('click', '#pause', function(e){
	game.pause();
})

$(document).on('click', '#reproduce', function(e){
	game.units.reproduce(true, game.map.base.x, game.map.base.y, true);
})

$(document).on('click', '.upgrade', function(e){
	game.units.upgrade(e.target.id.split('-')[1])
})

$(document).on('click', 'button', function(e){
	ui.refresh()
})
