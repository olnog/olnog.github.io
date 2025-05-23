class Character{
    energy = 100;
	health = null;
	alive = true;
	attack = 0;
	defense = 0;
	healing = 0;
	is_player = null;
	max_energy = 100;
	max_health = null;

	skills = {
		attack: 1,
		defend: 1,
		heal: 1,
		rest: 1,
	}

	constructor(is_player, max_health){
		this.is_player = is_player;
		this.health = max_health;
		this.max_health = max_health;
	}

	defend(quantity){

		this.defense += quantity * this.fetch_skill("defend");
	}

	die(){
		this.alive = false;
		ui.update_log("You died!", this.is_player);
		if (this.is_player){
			alert("You died!");
			game.paused = true;
		}
	}

	fetch_skill(which){
		return this.skills[which];
	}

	gain_skill (skill){
		let current_level = this.skills[skill];
		let rand = randNum(1, current_level * game.config.skill_train_factor);
		if (rand != 1){
			return;
		}
		
		this.skills[skill] ++;
		console.log(this.is_player, this.skills[skill]);
		ui.update_log("<b>You gained a level in " + skill + ". (" + this.skills[skill] + ")</b>", this.is_player);
	}

	get_hit(dmg){
		//console.log(dmg);
		let filtered_dmg = dmg;
		let defended_dmg = 0;
		let msg = "You got hit for " + dmg + " damage.";
		if (this.defense > 0){
			filtered_dmg = dmg - this.defense;
		}
		//console.log(this.defense, filtered_dmg);
		if (filtered_dmg <= 0){
			defended_dmg = this.defense + filtered_dmg
			this.defense = Math.abs(filtered_dmg);
			msg += " -" + defended_dmg + " defense "
			filtered_dmg = 0;
		}
		//console.log(this.defense, filtered_dmg);		
		if (filtered_dmg > 0){
			msg += " -" + filtered_dmg + " health"
		}
		ui.update_log("<span class='dmg'>" + msg + "</span>", this.is_player);
		this.health -= filtered_dmg;
		if (this.health < 1){
			this.die();
		}
	}

	add_heal(quantity){
		
		this.healing += quantity;
	}
	heal(quantity){
		this.health += quantity * this.fetch_skill("heal");
		ui.update_log("You healed for " + quantity + " health.", this.is_player);
		 
		if (this.health > this.max_health){
			this.health = this.max_health;
		}
	}

	rest(quantity){
		this.energy += quantity * this.fetch_skill("rest");
		ui.update_log("You rested and gained for " + quantity + " energy.", this.is_player);
		if (this.energy > this.max_energy){
			this.energy = this.max_energy;
		}
	}
	tick(credits){
		if (this.energy < credits){
			return;
			
		}
		/*
		if (this.healing > 0){
			this.heal_tick();
			this.healing --;
		}
			*/
		if (this.defense > 0){
			this.defense --;
		}
		if (this.energy > 0){
			this.energy -= credits;
			if (this.energy == 0){
				ui.update_log("You're tired!! Your ran out of energy!", this.is_player);
			}
		}
		
	}

}