class AntReturning {
    home(id, is_player){
        let ant = game.units.fetch(id, is_player);
        let distance_to_base = fetch_distance (ant.x, ant.y, ant.base.x, ant.base.y)
        //console.log('returning');
        if(distance_to_base < 2){            
            return { x: ant.base.x, y: ant.base.y };
        }
        let open_spots = game.map.fetch.open_spots(ant.x, ant.y, is_player);
        let spots = { nearer: [], same: [], open: [] }
        for (let open_spot of open_spots){            
            let poss_distance_to_base = fetch_distance (open_spot.x, open_spot.y, ant.base.x, ant.base.y)                    
            spots.open.push(open_spot);
            if (poss_distance_to_base < distance_to_base){
                spots.nearer.push(open_spot);
            } else if (poss_distance_to_base == distance_to_base){
                spots.same.push(open_spot);
            }
        }
        for (let type in spots){
            if (spots[type].length > 0){
                let n = 0;
                while (n < spots[type].length * 3){
                    let rand = randNum(0, spots[type].length - 1);
                    let spot = spots[type][rand];
                    if (!ant.going.moving.have_they_been_here(spot.x, spot.y)){
                        ant.going.moving.add_to_history(spot.x, spot.y);
                        return { x: spot.x , y: spot.y };
                    }
                    n++;
                }
            }
        }

        let rand = randNum(0, open_spots.length - 1);
        let spot = open_spots[rand]
        ant.going.moving.add_to_history(spot.x, spot.y);
        return { x: spot.x, y: spot.y }

    }

}