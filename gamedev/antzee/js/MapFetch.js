class MapFetch{
    	direction(x1, y1, x2, y2){
		let x_dir = x1 - x2;
		let y_dir = y1 - y2;
		if (x_dir > 0){
			x_dir = 1;
		} else if (x_dir < 0){
			x_dir = -1;
		} else {
			x_dir = 0;
		}
		if (y_dir > 0){
			y_dir = 1;
		} else if (y_dir < 0){
			y_dir = -1;
		} else {
			y_dir = 0;
		}
		return { x: x_dir, y: y_dir }
	}

	num_of_adjacent_farms(x, y){
		let n = 0;
		for (let poss_x = x - 1; poss_x <= x + 1; poss_x ++){
			for (let poss_y = y - 1; poss_y <= y + 1; poss_y	 ++){
				
				if (Map.is_not_valid_space(poss_x, poss_y)){
					continue;
				}
				if (game.map.grow_ticks[poss_x][poss_y] != null){
					n ++;
				}

			}
		}
		return n;
	}	
    open_spots (x, y, is_player){
		let open_spots = [];
		for (let poss_x = x -1 ; poss_x <= x + 1; poss_x ++){			
			for (let poss_y = y -1 ; poss_y <= y + 1; poss_y ++){
				if (Map.is_not_valid_space(poss_x, poss_y) || (poss_x == x && poss_y == y) 
					|| (is_player && game.map.scent < -game.config.scent_add) 
					|| (is_player && game.map.trail < 0)
					|| (!is_player && game.map.scent > game.config.scent_add)
					|| (!is_player && game.map.trail > 0)){
					continue;
				} else if (game.map.blocked[poss_x][poss_y] == 0){
					open_spots.push({x: poss_x, y: poss_y})
				}
			}
		}		
		return open_spots;
	}

}