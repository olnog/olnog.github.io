$(document).on('click', '', function(e){

})
$(document).on('click', '#go', function(e){
	game.player_moves();
})

$(document).on('click', '.card', function(e){
	let hand_id = e.target.id.split('-')[1]
	
	if ($("#hand-" + hand_id).hasClass('discarding')){
		$("#hand-" + hand_id).removeClass("discarding");	
		game.discarding.splice(game.discarding.indexOf(hand_id), 1);	
	} else if (!$("#hand-" + hand_id).hasClass('discarding') ){ 
		game.discarding.push(hand_id)
		$("#hand-" + hand_id).addClass("discarding");
	}
	$("#go").html("discard");
	if (game.discarding.length == 0){
		$("#go").html("go");		
	} 		
	ui.disable_go();
	
})

$(document).on('click', 'button', function(e){
	ui.refresh()
})
