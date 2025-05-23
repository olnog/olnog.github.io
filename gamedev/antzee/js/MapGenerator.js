class MapGenerator{
    static blocked_every = 5;
    static food_every = 3;
    static food_growth_rate = 1.1;    
    static food_max = 30;
    static food_min = 10;
    static op_min_distance_from_base = 10;

    
    static clear_base (base_x, base_y, map){
		for (let x = base_x - 1; x <= base_x + 1; x++){
			for (let y = base_y - 1; y <= base_y + 1; y++){
				if (Map.is_not_valid_space(x, y)){
					continue;
				}
				map.blocked[x][y] = 0;
				map.food[x][y] = 0;
			}
		}
        return map;
	}
    static fill_in_blocked_spots(map){
		for (let x=0; x < Map.max_x; x++){
			for (let y=0; y < Map.max_y; y++){				
				if (map.blocked[x][y] == 1){
					continue;
				}
				if ((x-1 >= 0 && x + 1 < Map.max_x && map.blocked[x-1][y] == 1 && map.blocked[x + 1][y] == 1)
				|| (y-1 >= 0 && y + 1 < Map.max_y && map.blocked[x][y-1] == 1 && map.blocked[x][y+1] == 1)
				|| (x-1 >= 0 && y + 1 < Map.max_y && map.blocked[x-1][y] == 1 && map.blocked[x][y+1] == 1)
				|| (x + 1 < Map.max_x && y + 1 < Map.max_y && map.blocked[x+1][y] == 1 && map.blocked[x][y+1] == 1)
				){
					map.blocked[x][y] = 1;
					map.food[x][y] = 0;
				}
			}
		}
		return map;
	}

    static generate(){
		let num_of_food = 0;
        let output = { 
                map: {
                    blocked: [],   	
                    food: [],
                    grow_ticks: [],
                    revealed: [],
                    scent: [],
                    trail: [],
                }, 
                base: { x: null, y: null },
                op_base: { x: null, y: null },
            }
		for (let x=0; x < Map.max_x; x++){
			let food_arr = [];
			let grow_arr = [];
			let map_arr = [];
			let reveal_arr = [];
			let scent_arr = []
			let trail_arr = [];
			for (let y=0; y < Map.max_y; y++){
				grow_arr.push(null);
				let map_val = 0;
				if (randNum(1, MapGenerator.blocked_every) == 1){
					map_val = 1
				}
				scent_arr.push(0)
				map_arr.push(map_val);
				reveal_arr.push(0);
				trail_arr.push(0);

				let num_of_food_here = 0;
				let is_there_food_here = randNum(1, MapGenerator.food_every)
				if (is_there_food_here == 1 && map_val == 0){
					num_of_food ++;
					num_of_food_here = randNum(MapGenerator.food_min, MapGenerator.food_max)
				}
				food_arr.push(num_of_food_here)
			}
            output.map.blocked.push(map_arr)
			output.map.food.push(food_arr)
			output.map.grow_ticks.push(grow_arr);						
			output.map.revealed.push(reveal_arr)
			output.map.scent.push(scent_arr)
			output.map.trail.push(trail_arr);
		}
		output.map = this.fill_in_blocked_spots(output.map);
		let rand_x = randNum(Math.round(Map.max_x * .33), Math.round(Map.max_x * .66))
		let rand_y = randNum(Math.round(Map.max_y * .33), Math.round(Map.max_y * .66))
		output.base.x = rand_x;
		output.base.y = rand_y;
		output.map = this.clear_base(rand_x, rand_y, output.map);

		while(true){
			rand_x = randNum(0, Map.max_x)
			rand_y = randNum(0, Map.max_y)
			let distance = fetch_distance(rand_x, rand_y, output.base.x, output.base.y);
			if (distance >= MapGenerator.op_min_distance_from_base){				
				output.op_base.x = rand_x
				output.op_base.y = rand_y
				output.map = this.clear_base(rand_x, rand_y, output.map);
				break;
			}
		}
        return output;
	}
}