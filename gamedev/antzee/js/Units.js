class Units {
    ants = []
	ops = []
	average_distance = { ants:  2, ops: 2 };
	
	constructor(){
		
	}

	adjust_avg_distance (distance, is_player){
		if (is_player){
			this.average_distance.ants = Math.round((this.average_distance.ants + distance) / 2);
			//console.log(this.average_distance, is_player);
			return;
		}
		this.average_distance.ops = Math.round((this.average_distance.ops + distance) / 2);
		//console.log(this.average_distance, is_player);
	}

    fetch(id, is_player){
		let ant = game.units.ops[id];
        if (is_player){
            ant = game.units.ants[id];
        }
		return ant;
	}

	fetch_cost_to_reproduce(is_player){
		let num_of_ants = this.ops.length;
		if (is_player){
			num_of_ants = this.ants.length;
		}
		return Math.round(game.config.reproduction_cost + (num_of_ants * game.config.reproduction_cost * .5));
	}

	fetch_metabolic_cost(){
		let sum = 0;
		for(let ant of this.ants){
			sum += ant.moves;
		}
		return sum;
	}

	fetch_num(x, y, is_player){
        let units = this.ops;
        if (is_player){
            units = this.ants;
        }
		let n = 0;
		for (let unit of units){
			if (unit.x == x && unit.y == y){ 
				n++;
			}
		}
		return n
	}

	fetch_type_here(x, y, is_player){
		let type = null;
		if (is_player){
            for (let ant of this.ants){
                if (ant.x != x && ant.y != y){
                    continue;
                }
                if (ant.exploring && type == null){ 
                    type = "ant_explores";
                } else if (!ant.exploring && type == null){ 
                    type = "ant_returns";
                } else if ((ant.exploring && type == "ant_returns") || (!ant.exploring && type == "ant_explores")){ 
                    type == "ant_both";
                }
            }	
            return type;
		}
        for (let op of this.ops){
            if (op.x != x && op.y != y){
                continue;
            }
            if (op.exploring && type == null){ 
                type = "op_explores";
            } else if (!op.exploring && type == null){ 
                type = "op_returns";
            } else if ((op.exploring && type == "op_returns") || (!op.exploring && type == "op_explores")){ 
                type == "op_both";
            }
        }	
        return type;
		
	}


	reproduce(is_player, x, y, pay){
		let food = "op_food";
		let cost = this.fetch_cost_to_reproduce(is_player);
		if (is_player){
			food = "food_inventory";
		}
		if (pay && ((!is_player && game.op_food < this.fetch_cost_to_reproduce(false)) 
			|| (is_player && game.food_inventory < this.fetch_cost_to_reproduce(true)))){
			return;
		}
		if (pay){
			game[food] -= cost;
		}
		if (is_player){            
		    this.ants.push( new Ant(this.ants.length, x, y, true))						
			return
		}
        this.ops.push( new Ant(this.ops.length, x, y, false))
			
		
		
		
	}

	upgrade(what){
		let cost = game.config.upgrade_costs[what] * game.config.upgrade_levels[what];
		if (cost > game.food_inventory){
			return;
		}
		
		game.food_inventory -= cost;
		game.config.upgrade_levels[what] ++;
		for (let ant of this.ants){
			if (what == 'carrying'){				
				ant.max_carrying += game.config.upgrade_increments.carrying;				
			} else if (what == 'growing'){
				ant.growing += game.config.upgrade_increments.growing;
			} else if (what == 'seeing'){
				ant.see_range += game.config.upgrade_increments.seeing;				
			}
		}
		if (what == 'carrying'){				
			Ant.default_max_carrying += game.config.upgrade_increments.carrying;		
			
		} else if (what == 'growing'){
			Ant.default_growing += game.config.upgrade_increments.growing;
		} else if (what == 'seeing'){
			Ant.default_see_range += game.config.upgrade_increments.seeing;	
		}
		
	}
}