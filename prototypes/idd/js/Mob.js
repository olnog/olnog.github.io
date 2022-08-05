class Mob{
  health = null;
  maxHealth = null;
  gold = null;

  minAttack = {rat: 1, skeleton: 5, orc: 10};
  maxAttack = {rat:5, skeleton: 10, orc: 20};
  minHealth = {rat: 5, skeleton: 20, orc: 100};
  maxHealth = {rat: 10, skeleton: 50, orc: 200};
  minGold = {rat:1, skeleton: 5, orc: 20};
  maxGold = {rat: 3, skeleton: 10, orc: 50}
  name = null;

  constructor(type){
    this.health = Math.round(Math.random() * (this.maxHealth[type]
      - this.minHealth[type]) + this.minHealth[type]);
    this.maxHealth = this.health;

    this.gold = Math.round(Math.random() * (this.maxGold[type]
      - this.minGold[type]) + this.minGold[type]);
    this.name = type;
  }

  attack(){
    let dmg = Math.floor(Math.random() * (this.maxAttack[this.name]
      - this.minAttack[this.name]) + this.minAttack[this.name]);
    let initShield = game.defense;

    if (game.dodge > 0){
      if ( Math.round(Math.random() * (game.dodge + 1 - 1) + 1) == 1){
        game.dodge--;
        ui.status ("You dodged the attack from the " + this.name + ".");
        return;
      }
      game.dodge--;
      ui.status ("You tried to dodge the attack from the " + this.name + " but failed. ");
    }
    if (game.parried){
      ui.status("You successfully parried the attack from the " + this.name + ". ");
      return;
      game.parried = false;
    }


    game.defense -= dmg
    if (game.defense < 0){
      game.health += game.defense
      game.defense = 0;
    }

    ui.status(this.name + " attacked you for " + dmg
      + " damage. Your shield went from " + initShield + " to " + game.defense
      + ".  You are now at " + Math.round(game.health));
    if (game.health < 1){
      game.die();
    }
  }

  getHit(dmg){
    this.health -= dmg;
    if (this.health < 0){
      this.health = 0;
    }
  }
}
