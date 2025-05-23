class UI{
	constructor(){

	}
	refresh(){
		this.display_map();
	}

	display_map(){
		let txt = "";
		for (let y = 0; y < game.config.map.max.y; y ++){
			txt += "<div class='row'>";
			for (let x = 0; x < game.config.map.max.x; x ++){
				let txt_class = "";
				if (game.map.revealed[x][y] == 0){
					txt_class = ' hidden ';
				} else if (x == game.player.x && y == game.player.y){
					txt_class = ' player ';
				} else if (game.map.water[x][y] == 1){
					txt_class = ' water ';
				}
				txt += "<div class='cell " + txt_class + "'>&nbsp;</div>";
			}
			txt += "</div>";
		}
		$("#map").html(txt);
	}
}
