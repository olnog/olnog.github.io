class Card{
  adventurer = ['attack', 'defend', 'move', 'run', 'heal'];
  fighter = ['medic', 'dodge', 'parry', 'slash', 'bash'];
  count = {
    adventurer: 10,
    fighter: 0,

  }

  hand = [];
  deck = [];
  discard = [];
  reserve = [];
  numToDraw = 5;

  starter = ['attack', 'attack', 'attack', 'attack', 'move',
    'defend', 'defend', 'defend', 'defend', 'move'];
  types = [];

  constructor (){
    this.deck = this.starter;
    this.shuffle();
    this.types = this.adventurer.slice();
    for (let card of this.fighter ){
      this.types.push(card);
    }
  }

  addToDeck(name){
    if (!this.reserve.includes(name)){
      return;
    }
    this.deck.push(this.reserve.splice(this.reserve.indexOf(name), 1));
  }

  removeFromDeck (name){
    if (!this.deck.includes(name)){
      return;
    }
    this.reserve.push(this.deck.splice(this.deck.indexOf(name), 1));
  }
  draw (){
    if (this.deck.length < 1){
      this.deck = this.discard;
      this.discard = [];
      this.shuffle();
    }
    for (let i = 0; i < this.numToDraw; i++){
      this.hand.push( this.deck.pop());
    }

  }

  howMany(name, where){
    let n = 0;
    for (let cardName of this[where]){
      if (cardName == name){
        n++;
      }
    }
    return n;
  }


  reset(){
    for (let card of this.hand){
      this.discard.push(card);
    }
    this.hand = [];
    for (let card of this.discard){
      this.deck.push(card);
    }
    this.discard = [];
    this.shuffle();
  }

  shuffle(){
    let newDeck = [], shuffling = true;
    while (shuffling){
      let cardPos = Math.round(Math.random() * ((this.deck.length - 1) - 0) + 0)
      if (!newDeck.includes(cardPos)){
        newDeck.push(cardPos);
      }
      if (newDeck.length >= this.deck.length){
        shuffling = false;
      }
    }
    let newNew = [];

    for (let cardPos of newDeck){
      newNew.push(this.deck[cardPos]);
    }
    this.deck = newNew;
  }

  spawn(type){
    let randomCard = this[type][Math.round(Math.random() * ((this[type].length - 1) - 0) + 0)]
    this.reserve.push(randomCard);
    ui.status ("You were promoted in the " + type
      + " guild and they gave you a '" + randomCard + "' card for your deck.");
  }
}
