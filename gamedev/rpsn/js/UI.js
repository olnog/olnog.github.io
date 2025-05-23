class UI{
	constructor(){

	}
	refresh(){
		this.display_enemy();
		this.display_hand();
		this.disable_go();

	}
	disable_go(){
		console.log(game.does_player_have_nuke(), game.hand.length - game.discarding.length == game.enemy_hand.length)
		if (game.does_player_have_nuke() 
			|| game.hand.length - game.discarding.length == game.enemy_hand.length){
			$("#go").prop('disabled', false);	
			return;
		}
		$("#go").prop('disabled', true);
	}
	display_enemy(){
		let cents = game.fetch_stats(true);
		let txt = "<div class='center'>Deck: " + game.enemy_deck.length + " Hand:" + game.enemy_hand.length + " Discard:" + game.enemy_discard.length + " </div><div class='center'>";
		for (let cent_id in cents){
			txt += cent_id + ":" + cents[cent_id] + "% "
		}
		txt += "</div>";
		$("#enemy").html(txt);
	}

	display_hand(){
		let txt = ""
		for (let hand_id = 0 ; hand_id < game.hand.length; hand_id++){
			txt += "<div class='card col' id='hand-" + hand_id + "' > "
			+ game.hand[hand_id] 
			+ "</div>";
		}
		$("#hand").html(txt);
	}
}
