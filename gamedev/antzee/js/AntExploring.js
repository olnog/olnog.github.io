class AntExploring {
    world(id, is_player, clear_history){
        let ant = game.units.fetch(id, is_player);
        let spots = {memory: [], memory_any: [], farther: [], same: []};        
        let distance_to_memory = null;
        //console.log('exploring');
        if (ant.memory != null){
            distance_to_memory = fetch_distance (ant.x, ant.y, ant.memory.x, ant.memory.y);
        }
        if (ant.memory != null && distance_to_memory < 2){
            //console.log("memory", ant.memory)
            ant.going.moving.add_to_history(ant.memory.x, ant.memory.y);
            return { x: ant.memory.x, y: ant.memory.y };
        }
        let average_distance = game.units.average_distance.ants;
        if (is_player){
            average_distance = game.units.average_distance.ops;
        }
        let distance_to_base = fetch_distance (ant.x, ant.y, ant.base.x, ant.base.y)                    
        let open_spots = game.map.fetch.open_spots(ant.x, ant.y, is_player);
        //console.log(open_spots);
        for (let open_spot of open_spots){
            let direction = game.map.fetch.direction(ant.x, ant.y, open_spot.x, open_spot.y);            
            let possible_distance_to_base = fetch_distance (open_spot.x, open_spot.y, ant.base.x, ant.base.y)
            
            let go_further_out = true;
            if (distance_to_base > average_distance){
                go_further_out = randNum(1, distance_to_base - average_distance) == 1;
            }
            //console.log(go_further_out);
            if (ant.memory != null && ant.going.moving.is_in_direction_of_memory(ant.x, ant.y, ant.memory, direction)){
                spots.memory.push(open_spot);
            }   else if 
                (ant.memory 
                != null && ant.going.moving.is_in_any_direction_of_memory(ant.x, ant.y, ant.memory, direction)){
                spots.memory_any.push(open_spot);
            }
            if (go_further_out && possible_distance_to_base > distance_to_base){            
                spots.farther.push(open_spot);
            } else if (possible_distance_to_base > distance_to_base){            
                spots.same.push(open_spot);
            }
        }        
        if (spots.farther.length > 0){
            //console.log(spots.farther);
        }
        for (let type in spots){            
            if (spots[type].length > 0){
                //console.log(type);
                let n = 0;
                while (n < spots[type].length * 3){
                    let rand = randNum(0, spots[type].length - 1);
                    let spot = spots[type][rand]
                    if (!ant.going.moving.have_they_been_here(spot.x, spot.y)){
                        ant.going.moving.add_to_history( spot.x, spot.y)
                        return { x: spot.x, y: spot.y }
                    }
                    n++;
                }
            }
        }
        if (open_spots.length < 1){
            //console.log("EXPLORE BAD");
            return;
        }
        //console.log('random open spot');
        let rand = randNum(0, open_spots.length - 1);
        let spot = open_spots[rand]
        ant.going.moving.add_to_history(spot.x, spot.y);
        return { x: spot.x, y: spot.y }
        
    }
}