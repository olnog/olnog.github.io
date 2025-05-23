class Game{	
	config = new Config();		
	loop = new Loop();
	map = new Map();
	op_food = null;	
	paused = false;
	ticks = 0;
	units = new Units();
	food_inventory = null
	constructor(){
		this.food_inventory = this.config.food_init;
		this.op_food = this.config.food_init;
		
	}
	init(){
		for (let n = 0; n < this.config.num_of_initial_ants; n++){
			this.units.reproduce(true, this.map.base.x, this.map.base.y, false );
			this.units.reproduce(false, this.map.op_base.x, this.map.op_base.y, false);
		}
	}

	pause(){
		this.paused = !this.paused;
	}
	
}
