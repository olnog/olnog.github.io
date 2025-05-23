class AntFighting {
    die(id, is_player){
        console.log("DIED");
        let ant = game.units.fetch(id, is_player);
        ant.alive = false;
    }

    enemy(id, is_player){;
        let ant = game.units.fetch(id, is_player);
        let enemy_search = this.search_for_enemies(id, is_player);
        if (enemy_search.quantity > 0){
            ant.memory = enemy_search;
        }
        let num_of_enemies = game.units.fetch_num(ant.x, ant.y, true) ;
        if (is_player){
            num_of_enemies = game.units.fetch_num(ant.x, ant.y, false) 
        }
        if (!ant.exploring || num_of_enemies < 1){
            return false;
        }                
        this.give_dmg(is_player, ant.attack, id);                                
        return true;        
    }
    
    give_dmg(is_player, dmg, id){
        let ant = game.units.fetch(id, is_player);
        let enemies = game.units.ants;
        if (is_player){
            enemies = game.units.ops;
        }
        let chance_to_upgrade = randNum(1, ant.attack * game.config.fight_exp_factor);
        if (chance_to_upgrade == 1){
            ant.attack ++;
            console.log("ATTACK UPGRADED!", is_player, id, ant.attack);
        }
        for (let enemy of enemies){
            if (enemy.x == ant.x && enemy.y == ant.y){
                enemy.going.fighting.take_dmg(dmg, id, is_player);
            }
        }
    }

    search_for_enemies(id, is_player){
        //does this work?
        let ant = game.units.fetch(id, is_player);
        let search = { x: null, y: null, quantity: 0 }
        let open_spots = game.map.fetch.open_spots(ant.x, ant.y, is_player);
        for (let spot of open_spots){
            let num_of_comrades = game.units.fetch_num(spot.x, spot.y, false)  
            let num_of_enemies = game.units.fetch_num(spot.x, spot.y, true);            
            if (is_player){
                num_of_comrades = game.units.fetch_num(spot.x, spot.y, true)  
                num_of_enemies = game.units.fetch_num(spot.x, spot.y, false);                 
            } 
            let combat_algo = num_of_comrades - num_of_enemies;
            if (num_of_enemies > 0 && combat_algo >= search.quantity){
                search.x = spot.x;
                search.y = spot.y;
                search.quantity = num_of_enemies;
            }

        }
        return search;
    }

    take_dmg(dmg, id, is_player){
        let ant = game.units.fetch(id, is_player);
        ant.health -= dmg;
        if (ant.health < 1){
            this.die(id, is_player);
            return;
        }
        let chance_to_upgrade_health = randNum(1, ant.health * game.config.fight_exp_factor);
        if (chance_to_upgrade_health == 1){
            ant.max_health ++;
            console.log("HEALTH UPGRADED!", is_player, id, ant.max_health);           
        }
        if (ant.exploring && ant.health != ant.max_health){
            ant.exploring = false;
            game.units.adjust_avg_distance(fetch_distance(ant.x, ant.y, ant.base.x, ant.base.y), is_player);
        }
    }
}