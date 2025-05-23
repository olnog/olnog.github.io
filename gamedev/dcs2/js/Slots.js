class Slots {
    config = new SlotsConfig();
    contents = {};
	is_player = null;
	reel = null;
	reels = [];
	reel_ptrs = [];
	pay_template = {};
	payout_hits = [];
	constructor(is_player, first, second, third, fourth){
		this.is_player = is_player;
		this.reel = this.generate(first, second, third, fourth);
		for (let i = 0; i < this.config.payouts.length; i ++){
			this.payout_hits.push(0);
		}
		for (let i = 0; i < this.config.num_of_reels; i ++){
			this.reel_ptrs.push(0);
			this.reels.push(this.reel);
		}	
        
        for (let type of this.reel)	{
            if (this.pay_template[type] == undefined){
                this.pay_template[type] = 0;
            } 
        }
        /*
		let paid = structuredClone(this.pay_template);
		for (let i = 0; i < 10; i ++){
			this.spin();
			let pay = this.fetch_paylines();
			//console.log(pay);
			for (let type in pay){
				paid[type] += pay[type];
			}
		}
		
		console.log(paid);
		console.log(this.payout_hits);
        */
	}

	fetch_paylines(credits){
		let paying = structuredClone(this.pay_template);
		for (let payout_id = 0; payout_id < this.config.payouts.length - 1; payout_id ++){
			let payout = this.config.payouts[payout_id];
			let contents = [];
			for (let reel_id in payout ){
				let rel_pos = payout[reel_id];
				contents.push(this.fetch(reel_id, rel_pos));
			}
			//console.log(contents);
			let last_shit = null;
			let bad = false;
			for (let content of contents){
				if (last_shit == null){
					last_shit = content;
				} else if (last_shit != content){
					bad = true;
					break;
				}
			}
			if (!bad){
				//this.payout_hits[payout_id] ++;
				paying[last_shit] += this.config.payout_rewards[payout_id] * credits;
			}
		}
		//console.log(paying);
		let msg = "";
		for (let what in paying){
			let quantity = paying[what];
			if (quantity > 0 && msg == ""){
				msg = "<b>You won!";
			} 
			if (quantity > 0 && msg != ""){
				msg += " +" + quantity + " " + what + " ";
			}
		}
		if (msg != ""){
			msg += "</b>";
			ui.update_log(msg, this.is_player);
		}
		return paying;
	}

	fetch(reel_id, rel_pos){
		let pos = this.reel_ptrs[reel_id] + rel_pos;							
		if (rel_pos == -1 && pos < 0){
			pos = this.reel.length - 1;			
		} else if (rel_pos == 1 && pos > this.reel.length -1){
			pos = 0;
		}
        //console.log(reel_id, rel_pos, pos, this.reels[reel_id][pos]);
		return this.reels[reel_id][pos];
	}


	generate(first, second, third, fourth){

		let reel_arr = [first, second, third];
        if (fourth != null){
            reel_arr.push(fourth);
        }
		
		return reel_arr;
	}

	spin(credits){
		for (let i = 0; i < this.config.num_of_reels; i ++){
			let rand = randNum(0, this.reel.length - 1);
			this.reel_ptrs[i] = rand;
		}
        return this.fetch_paylines(credits);
	}
}