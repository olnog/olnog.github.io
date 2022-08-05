class Game{
  backpackEquipped = false;
  cards = new Card();
  damageBonus = 1;
  dodge = 0;
  equippedWeapon = 'unarmed';
  gold = 0;
  health = 100;
  healthBonus = 1;
  defense = 0;
  loop = null;
  inventory = [];
  maxInventory = 1;
  dungeonSpaces = 0;
  minAttack = 1;
  maxAttack = 2;
  maxHealth = 100;
  monsters = [];
  parried = false;
  questing = {
    active: null,
    adventurer: {
      level: 1,
      xp: 0,
      max: 10,
    },
    fighter: {
      level: 0,
      xp: 0,
      max: 10,
    },
  }
  store = {

    backpack: 5,
    club:5,
    dagger: 5,
    greatsword: 50,
    mace: 20,
    potion: 5,
    recall: 25,
    sword: 20,
    warhammer: 50,
  }
  weapons = {
    dagger: {
      minAttack: 2,
      maxAttack: 5,
      type: 'blade',
    },
    sword: {
      minAttack: 5,
      maxAttack: 10,
      type: 'blade',
    },
    greatsword: {
      minAttack: 10,
      maxAttack: 15,
      type: 'blade',
    },
    club: {
      minAttack: 2,
      maxAttack: 5,
      type: 'blunt',
    },
    mace: {
      minAttack: 5,
      maxAttack: 10,
      type: 'blunt',
    },
    warhammer: {
      minAttack: 10,
      maxAttack: 15,
      type: 'blunt',
    },
  }
  weaponType = null;

  enteringDungeon = null;
  constructor(){
  }

  attack(){
    if (this.monsters.length < 1){
      return;
    }
    let dmg = Math.round(Math.random() * (this.maxAttack - this.minAttack)
      + this.minAttack)* this.damageBonus;
    this.damageBonus = 1;
    this.monsters[0].getHit(dmg);
    ui.status ("You hit " + this.monsters[0].name + " for " + dmg
      + " damage. They are now at "
      + Math.round(this.monsters[0].health / this.monsters[0].maxHealth * 100) + "%");
    if (this.monsters[0].health < 1){
      ui.status (this.monsters[0].name + " died and you got " + this.monsters[0].gold + " gold!");
      this.gold += this.monsters[0].gold;
      this.monsters.shift();
    }
  }

  buy(item){
    if (!Object.keys(this.store).includes(item)){
      console.log("not being sold");
      return;
    } else if (this.gold < this.store[item]){
      console.log("not enough gold");
      return;
    } else if (this.backpackEquipped && item == 'backpack'){
      console.log('you already own a backpack');
      return;
    } else if (!Object.keys(this.weapons).includes(item) && item != 'backpack'
      && this.inventory.length >= this.maxInventory){
      console.log('your inventory is full');
      return;
    }
    this.gold -= this.store[item];
    if (Object.keys(this.weapons).includes(item)){
      this.equippedWeapon = item;
      this.minAttack = this.weapons[item].minAttack;
      this.maxAttack = this.weapons[item].maxAttack;
      this.weaponType = this.weapons[item].type;
      return;
    }
    if (item == 'backpack'){
      this.backpackEquipped = true;
      this.maxInventory = 10;
      return;
    }
    this.inventory.push(item);
    //TODO:make it to where old weapons are put in inventory

  }

  die(){
    this.gold = Math.round(this.gold * .5);
    ui.status("You died. Oh no! You lost half of your gold.");

    this.leaveDungeon();
  }

  dive(){
    if (this.enteringDungeon == null){
      game.dungeonSpaces = 1;
      this.startDungeon();
    }
    this.enteringDungeon = true;
  }

  exit(){
    this.enteringDungeon = false;
  }

  dungeonLoop(){
    ui.loading();
    if (game.cards.hand.length < 1){
      game.cards.draw();
      ui.displayHand();
      if (game.monsters.length > 0){
        for (let mob of game.monsters){
          mob.attack();
        }
      }
      game.defense = Math.floor(game.defense * .5);
      game.parried = false;
    } else {
      game.playCard();
    }

    if (game.dungeonSpaces < 1){
      game.leaveDungeon();
    }

    ui.refresh();
  }

  heal(){
    if (this.health >= this.maxHealth){
      ui.status ("You tried to heal but you're not hurt.");
      return;
    }
    this.health += this.healthBonus;
    if (this.health >= this.maxHealth ){
      this.health = this.maxHealth;
    }
    ui.status("You healed for " + this.healthBonus
      + " points and now you're at " + (this.health / this.maxHealth * 100) + "%");
  }

  leaveDungeon(){
    ui.status("You escaped the dungeon! ")
    game.enteringDungeon = null;
    game.stopGameLoop();
    game.monsters = [];
    game.cards.reset();
    ui.displayHand();
    game.dungeonSpaces = 0;
    this.health = 100;
    this.defense = 0;
    this.parried = false;
    this.dodge = 0;
  }

  moveOrRun (which){
    if (which == 'move' && this.monsters.length > 0 && Math.round(Math.random() * (2 - 1)  + 1) == 1){
      ui.status('You tried to move but were stopped by the ' + this.monsters[0].name + " attacking you.");
      return;
    }
    let i = 1;
    if (which == 'run' && this.monsters.length < 1){
      i = 2;
    }
    if (this.enteringDungeon === true){
      this.dungeonSpaces += i;
      ui.status ("You " + which + " further into the dungeon. (" + this.dungeonSpaces + ") " );

      this.spawn (2)

    } else if (this.enteringDungeon === false){
      this.dungeonSpaces -= i;
      ui.status ("You " + which + " out of the dungeon. (" + this.dungeonSpaces + ") " );

      this.spawn (4)
    }

  }

  playCard(){

    let cardName = this.cards.hand.shift();
    this.cards.discard.push(cardName);
    if (cardName == 'attack'){
      this.attack();
    } else if (cardName == 'bash'){

      if (this.weaponType == 'blunt'){
        this.damageBonus = 2;
      }
      this.attack();
    } else if (cardName == 'defend'){

      this.defense ++;
      ui.status ("Your defense is now at " + this.defense);
    } else if (cardName == 'dodge'){
      this.dodge ++;
      ui.status ("You now have a 1 in " + (this.dodge + 1) + " chance of dodging the next attack.");
    } else if (cardName == 'heal'){
      this.heal();
    } else if (cardName == 'medic'){
      ui.status ("You're now twice as effective at healing.");
      this.healthBonus *= 2;
    } else if (cardName == 'move'){
      this.moveOrRun('move');
    } else if (cardName == 'parry' && this.monsters.length > 0){
      ui.status ("You prepare yourself for the next attack from the " + this.monsters[0].name);
      this.parried = true;
    } else if (cardName == 'run'){
      this.moveOrRun('run');
    } else if (cardName == 'slash'){
      if (this.weaponType == 'blade'){
        this.damageBonus = 2;
      }
      this.attack();
    }
    ui.displayHand();
  }

  quest(type){
    this.questing.active = type;
    this.loop = setInterval(this.questLoop, 1500);
  }

  questLoop(){
    game.questing[game.questing.active].xp ++;

    if (game.questing[game.questing.active].xp >= game.questing[game.questing.active].max ){
      game.questing[game.questing.active].level++;
      let cardType = game.cards.spawn(game.questing.active);

      game.questing[game.questing.active].xp = 0;
      game.questing[game.questing.active].max *= 1.5;
    }
    ui.refreshQuest();
    ui.refresh();
  }
  spawn (baseSpawnRate){

    let spawnRate =  baseSpawnRate * (this.monsters.length  + 1);
    let didTheySpawn = Math.round(Math.random() * (spawnRate - 1) + 1) == 1;
    let monsterSpawn = Math.round(Math.random() * (100 - 1)  + 1);
    let monsterType = 'skeleton';
    let orcSpawnRate = 1;
    let ratSpawnRate = 10;
    if (this.dungeonSpaces > 10){
      orcSpawnRate = 5;
      ratSpawnRate = 25;
    } else if (this.dungeonSpaces > 50){
      orcSpawnRate = 10;
      ratSpawnRate = 60;
    } else if (this.dungeonSpaces > 100){
      orcSpawnRate = 20;
      ratSpawnRate = 80;
    } else if (this.dungeonSpaces > 200){
      orcSpawnRate = 40;
      ratSpawnRate = 90;
    } else if (this.dungeonSpaces > 500){
      orcSpawnRate = 50;
      ratSpawnRate = 100;
    } else if (this.dungeonSpaces > 1000){
      orcSpawnRate = 98;
      ratSpawnRate = 100;
    }
    if (monsterSpawn <= orcSpawnRate){
      monsterType = 'orc';
    } else if (monsterSpawn >= ratSpawnRate){
      monsterType = 'rat'
    }
    if (didTheySpawn){
      this.monsters.push(new Mob(monsterType));
      ui.status(monsterType + " appears from the shadows to attack you!");
    }
  }

  startDungeon(){

    this.loop = setInterval(this.dungeonLoop, 1500);
  }
  stopGameLoop(){
    clearInterval(this.loop);
    this.loop = null;
  }

  stopQuest(){
    this.stopGameLoop();
    this.questing.active = null;
    ui.refresh();
  }

  use(item){
    if (!this.inventory.includes(item)){
      console.log("You don't have this item.");
      return;
    }
    if (item == 'potion'){
      let healing = Math.round(Math.random() * (50 - 25)
        + 25);
      if (this.health > this.maxHealth){
        this.health = this.maxHealth;
      }
      ui.status("You healed for " + healing + " points. You're now at " + Math.round(this.health / this.maxHealth * 100) + "%");
    } else if (item == 'recall'){
      this.leaveDungeon();
    }
    this.inventory.splice(this.inventory.indexOf(item), 1);
  }
}
