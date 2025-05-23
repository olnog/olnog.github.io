class UI{
	constructor(){
		this.display_map()
		$("#min_harvest").val(game.config.min_harvest);
	}
	
	
	refresh(){
		this.display_map();
		this.display_ant_range();
		$("#food_inventory").html(game.food_inventory)
		let txt = "";
		for(let ant of game.units.ants){
			txt += "<div>(" + ant.x + ", " + ant.y 
			+ ") <span id='ant-carrying-" + ant.id + "'>carrying: "+ ant.carrying + "/" + ant.max_carrying 
			+ "</span> food debt: " + ant.moves + " growing: " + ant.growing + " " 
			+ " health: <span id='ant-health-" + ant.id + "'>" + ant.health + "/" + ant.max_health + "</span> attack: "+ ant.attack + " alive: "  + ant.alive + " </div>"
		}
		
		$("#ants").html(txt)
		for (let ant of game.units.ants){
			
			if (ant.carrying == ant.max_carrying){
				$("#ant-carrying-" + ant.id).addClass("bold");
			}		
			if (ant.health < ant.max_health){
				$("#ant-health-" + ant.id).addClass("hurt");
			}
		}
		$("#upgrade_menu").html(this.generate_buttons());
		$("#num_of_ants").html(game.units.ants.length);
		let cost_to_reproduce = game.units.fetch_cost_to_reproduce(true);
		$("#reproduce_cost").html(cost_to_reproduce);
		if (game.food_inventory < cost_to_reproduce){
			$("#reproduce").prop('disabled', true);
		} else if (game.food_inventory >= cost_to_reproduce) {
			$("#reproduce").prop('disabled', false);
		}
		let metabolic_cost = game.units.fetch_metabolic_cost();
		$("#metabolic_cost").html("-" + metabolic_cost);
		$("#food_minus_metabolism").html(game.food_inventory - metabolic_cost);
		$("#ticks").html(game.ticks);
	}

	display_map(){
		let map_txt = ""
		let class_txt = ""
		for (let y = 0; y < Map.max_y; y++){
			map_txt += "<div class='row'>"
			for (let x = 0; x < Map.max_x; x++){				
				class_txt = "";

				let cell_txt = "&nbsp";
				let farm_class = "";
				let num_of_ants_here = game.units.fetch_num(x, y, true)				
				let num_of_ops_here = game.units.fetch_num(x, y, false)
				
				if (game.map.blocked[x][y] == 1){
					class_txt = " blocked ";
				}
				if (game.map.revealed[x][y] == 0){
					class_txt = " hidden"					
				} else if (game.map.op_base.x == x && game.map.op_base.y == y){
					class_txt = " op_base ";
					cell_txt = num_of_ops_here;
				} else if (game.map.base.x == x && game.map.base.y == y){
					class_txt = " base "
					cell_txt = num_of_ants_here 
				} else if (num_of_ants_here > 0){
					let type_of_ant = game.units.fetch_type_here(x, y, true);
					class_txt = type_of_ant;
					cell_txt = num_of_ants_here 
				} else if (num_of_ops_here > 0){
					let type_of_op = game.units.fetch_type_here(x, y, false);
					class_txt = type_of_op;
					cell_txt = num_of_ops_here 
				} else if (game.map.food[x][y] > 0 && game.map.food[x][y] < game.config.min_harvest){
					class_txt = " food_low ";
				} else if (game.map.food[x][y] >= game.config.min_harvest){
					class_txt = " food ";
					cell_txt = game.map.food[x][y];
				} else if (game.map.trail[x][y] == 1){
					class_txt = " ant_trail ";
				} else if (game.map.trail[x][y] == -1){
					class_txt = " op_trail ";
				} else if (game.map.scent[x][y] > 0){
					//class_txt = " scent ";
				} else if (game.map.scent[x][y] < 0){
					//class_txt = " op_scent ";
				}
				if (game.map.grow_ticks[x][y] != null){
					farm_class = " farmed ";
				}
				map_txt += "<div class='cell " + class_txt + farm_class + " ' id='map-" + x + "-" + y 
					+ "'>" + cell_txt + "</div>"			
				
			}	
			map_txt += "</div>"
		}
		$("#map").html(map_txt)
	}
	
	display_ant_range(){
		let units = ['ants'];
		for (let type of units){
			for (let ant of game.units[type]){
				let range = ant.see_range;
				for (let x = ant.x - range; x <= ant.x + range; x ++){
					for (let y = ant.y - range; y <= ant.y + range; y ++){
						if (Map.is_not_valid_space(x, y)){
							continue;							
						}
						//console.log("#map-" + x + "-" + y)
						let direction = game.map.fetch.direction(ant.x, ant.y, x, y);
						if (direction.x == -1){
							$("#map-" + x + "-" + y).addClass("a-right");
						} else if (direction.x == 1){
							$("#map-" + x + "-" + y).addClass("a-left");
						}
						if (direction.y == -1){
							$("#map-" + x + "-" + y).addClass("a-bottom");
						} else if (direction.y == 1){
							$("#map-" + x + "-" + y).addClass("a-top");
						}
					}	
				}
			}
		}
	}
	generate_buttons (){
		let txt = "";
		for (let upgrade in game.config.upgrade_costs){
			let cost = game.config.upgrade_costs[upgrade] * game.config.upgrade_levels[upgrade];
			let increment = game.config.upgrade_increments[upgrade];
			let disabled_prop = "";
			if (game.food_inventory < cost){
				disabled_prop = " disabled ";
			}
			txt += "<button id='upgrade-" + upgrade + "' class='upgrade'" + disabled_prop + ">+" + increment + " " + upgrade + " (-" + cost + " food)</button>";
		}
		return txt;		
	}
}
