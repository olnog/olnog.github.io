class Loop{
    go(){
        if (game.paused){
            return;
        }
        let entities = ['ants', 'ops'];
        for (let entity of entities){
            for (let ant_id in game.units[entity]){
                let ant = game.units[entity][ant_id];
                ant.going.go(ant_id, ant.player);
                if (!ant.alive){
                    game.units[entity].splice(ant_id, 1);
                }
            }
        }
		if (game.op_food >= game.units.fetch_cost_to_reproduce(false)){
			game.units.reproduce(false, game.map.op_base.x, game.map.op_base.y, true);
		}
        game.map.scent_decays()
        game.map.food_grows();
        ui.refresh()
        game.ticks ++;
    }
}