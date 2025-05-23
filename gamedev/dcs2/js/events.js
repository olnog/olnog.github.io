$(document).on('click', '', function(e){

})

$(document).on('click', '#auto_spin', function(e){
	
	game.auto_toggle();
	console.log(game.auto_spinning);
})
$(document).on('click', '.credit', function(e){
	let what = e.target.id.split('_')[1];
	game.change_credits(what);
})
$(document).on('click', '#spin', function(e){
	game.spin();
})


$(document).on('click', 'button', function(e){
	ui.refresh()
})
