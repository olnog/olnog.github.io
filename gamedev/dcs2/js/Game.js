class Game{
	auto_spinning = false;
	config = new Config();
	credits = 1;
	enemy = new Character(false, 100);
	enemy_slots = new Slots(false, 'attack', 'defend', 'heal', 'attack');
	paused = false;
	player = new Character(true, 100);	
	slots = new Slots(true, 'attack', 'defend', 'attack', 'rest');
	

	auto_toggle(){
		this.auto_spinning = !this.auto_spinning;
	}

	change_credits(what){
		if (what == "more" && this.credits < this.config.max_credits){
			this.credits ++ ;
			return;
		} else if (what == "less" && this.credits > 1){
			this.credits -- ;
			return;
		}
	}

	attack(dmg, is_player){
		//console.log(dmg, is_player);
		let character = this.player;
		if (is_player){
			//console.log("yes");
			character = this.enemy;
		}
		//console.log(character);

		character.get_hit(dmg);
	}
	
	process_pay(pay, is_player){
		for (let what in pay){
			let quantity = pay[what];
			if (quantity == 0){
				continue;
			}
			let character = this.enemy;	
			if (is_player){
				character = this.player;
			}
			character.gain_skill(what);
			if (what == 'attack'){
				let dmg = quantity * character.fetch_skill("attack");
				console.log(is_player, dmg);
				ui.update_log("You attacked them for " + dmg + " damage.", is_player);
				this.attack(dmg, is_player);
				continue;
			}
			//console.log(character, what);
			character[what](quantity);
		}
	}

	spin(){

		if (this.player.energy >= this.credits && this.player.alive){			
			let pay = this.slots.spin(this.credits);
			this.process_pay(pay, true);
		}
		
		if (this.enemy.energy >= this.credits && this.enemy.alive){
			let enemy_pay = this.enemy_slots.spin(this.credits);
			this.process_pay(enemy_pay, false);
		}
		this.player.tick(this.credits);
		this.enemy.tick(this.credits)
	}
}
