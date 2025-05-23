class Game{
	config = new Config();
	deck = [];
	hand = [];
	discard = []
	discarding = [];
	enemy_deck = [];
	enemy_discard = [];
	enemy_hand = []
	player_discards_first = false;
	score = 0;	
	constructor(){
		this.deck = this.shuffle(this.create_deck());
		this.draw_hand(false);
		this.enemy_deck = this.shuffle(this.create_deck());
		this.draw_hand(true);
		this.enemy_moves();
	}

	create_deck(){
		let arr = [];
		for (let type of this.config.types){
			let max = this.config.init_deck[type];
			for (let i = 0; i < max; i++){
				arr.push(type);
			}
		}
		return arr;		
	}

	enemy_discarding (num_of_cards){
		if (this.enemy_hand.length < 1) {
			return;
		}
		let n = 0;
		while(n < num_of_cards){
			let rand_card_id = randNum(0, this.enemy_hand.length - 1);
			this.discard_card(true, rand_card_id);
			n++; 
		}
	}
	enemy_moves(){
		let chance = randNum(1, 100);
		if (this.player_discards_first){
			this.enemy_discarding(this.enemy_hand.length - this.hand.length );
			return;
		}
		if (chance < 11){
			return;
		} else if (chance > 15){
			this.enemy_discarding(1);
			return;
		} 
		this.enemy_discarding(randNum(2,4));
	}

	discard_card(enemy, id){
		if (enemy){
			this.enemy_discard.push(this.enemy_hand.splice(id, 1));
			return;
		}
		this.discard.push(this.hand.splice(id, 1));

	}

	discard_remaining(enemy){
		if (enemy){
			for (let card_id in this.hand){
				this.discard_card(enemy, card_id);
			}
			return;
		}
		for (let card_id in this.enemy_hand){
			this.discard_card(enemy, card_id);
		}

	}
	does_player_have_nuke(){
		return !this.hand.indexOf("nuke") == -1;
	}

	do_they_have(enemy, card){
		if (enemy){
			return !this.enemy_hand.indexOf(card) == -1
		}
		return !this.hand.indexOf(card) == -1
	}

	draw_hand(enemy){
		if (enemy){
			for (let i = 0; i < this.config.hand_size; i++){
				this.enemy_hand.push(this.enemy_deck.pop())
			}
			return;
		}
		for (let i = 0; i < this.config.hand_size; i++){
			this.hand.push(this.deck.pop())
		}
	}

	fetch_stats(enemy){
		let cent = {};
		let nums = {};
		for (let type of this.config.types){
			nums[type] = 0;
		}
		let deck_used = this.deck;
		if (enemy){
			deck_used = this.enemy_deck;
		}
		let hand_used = this.hand;
		if (enemy){
			hand_used = this.enemy_hand;
		}
		for (let card of deck_used){
			nums[card]++;
		}
		for (let card of hand_used){
			nums[card]++;
		}
		let total = deck_used.length + hand_used.length;
		
		for (let type of this.config.types){
			cent[type] = Math.round(nums[type] / total * 100);
		}
		return cent;
	}

	player_discards(){
		for(let hand_id of this.discarding){
			this.discard_card(false, hand_id);
		}
	}

	player_moves(){
		if (this.discarding.length > 0){
			this.player_discards();
		}
		if(this.enemy_moves){
			for (let card_id in this.enemy_hand){
				let card = this.enemy_hand[card_id];
				let card_beats = this.config.beats[card]
				this.discard_card(true, card_id);
				if (this.do_they_have(false, card_beats)){				
					this.discard_card(false, this.hand.indexOf(card_beats));
					score --;
				}
			}
			return;
		}
		for (let card_id in this.hand){
			let card = this.hand[card_id];
			let card_beats= this.config.beats[card];
			this.discard_card(false, card_id);
			if (this.do_they_have(false, card_beats)){				
				this.discard_card(true, this.enemy_hand.indexOf(card_beats));
				score ++;
			}
		}
	}

	shuffle(deck){
		let new_deck = [];
		while(deck.length > 0){
			let rand_card = randNum(0, deck.length - 1);
			new_deck.push(deck.splice(rand_card, 1));
		}
		return new_deck;
	}
}
