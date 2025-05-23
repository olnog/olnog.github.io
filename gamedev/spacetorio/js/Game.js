class Game{
	config = new Config();
	player = { x: null, y: null };
	map = { revealed: [], water: [] }
	constructor(){
		this.player.x = this.config.start.x;
		this.player.y = this.config.start.y;
		this.generate_map();
	}
	generate_map(){
		for (let x = 0; x < this.config.map.max.x; x ++){
			let revealed_arr = [];
			let water_arr = []
			for (let y = 0; y < this.config.map.max.x; y ++){
				let revealed = 0;
				let water = 0;
				let is_there_water_here = randNum(1, this.config.water_every) == 1;
				if (x >= this.player.x - this.config.radar_range && x <= this.player.x + this.config.radar_range 
					&&  y >= this.player.y - this.config.radar_range && y <= this.player.y + this.config.radar_range ){
					revealed = 1;
				} 
				if (is_there_water_here){
					water = 1;
				}
				water_arr.push(water);
				revealed_arr.push(revealed);			
			}	
			this.map.revealed.push(revealed_arr);
			this.map.water.push(water_arr);
		}
	}
}
