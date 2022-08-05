class UI{
  fadingInterval = null;
  statusMsg = "";
  constructor(){
    this.displayHand();

  }

  displayBlacksmith(){
    let html = "";
    for (let item in game.store){
      let disabledStatus = '';
      if (Object.keys(game.weapons).includes(item)){
        if (game.equippedWeapon == item){
          disabledStatus = " disabled ";
        }
        html += "<div class='ms-3'>" + item + " " + game.weapons[item].minAttack
          + "-" + game.weapons[item].maxAttack + " dmg - "
          + game.store[item] + " gp</div>"
          + "<div class='ms-3 mb-3'><button id='buy-" + item
          + "' class='buy btn btn-info' " + disabledStatus + ">buy</button></div>"
      }
    }
    $("#blacksmith").html(html);


    for (let item in game.store){
      $("#buy-" + item).attr('disabled', false);
      if ((game.gold < game.store[item])
        || game.inventory.length >= game.maxInventory && (item == 'potion' || item == 'recall')){
        $("#buy-" + item).attr('disabled', true);
      }

    }

    if (game.backpackEquipped){
      $("#buy-backpack").attr('disabled', true);
    }
  }

  displayDeck(){
    let html = "";
    let whereArr = ['deck', 'reserve'];
    for (let where of whereArr){
      html = "";

      for (let card of game.cards.types){
        let disabledClass = '', button = '';
        let count = game.cards.howMany(card, where);
        let howManyMovementCardsInDeck  = game.cards.howMany('move', 'deck') + game.cards.howMany('run', 'deck');
        if (where == 'reserve'){
          button += "<button id='addToDeck-" + card + "' class='addToDeck btn btn-success me-3'>+</button>";
        } else if (where == 'deck'){
          if ((card == 'move' || card == 'run') && howManyMovementCardsInDeck < 2){
            disabledClass = ' disabled ';
          }
          button += "<button id='removeFromDeck-" + card
            + "' class='removeFromDeck btn btn-danger me-3' " + disabledClass
            + ">-</button>";

        }
        if (count > 0){
          html += "<div>" + button + card + ": " + count +  " (" + Math.round(count / game.cards.deck.length * 100) + "%)</div>";
        }
      }
      $("#deckbuilding-" + where).html(html);
    }
    $(".deckbuilding-reserve").removeClass('d-none');
    if (game.cards.reserve.length < 1){
      $(".deckbuilding-reserve").addClass('d-none');
    }
  }

  displayHand(){
    let html = "<div class='row'>";
    for (let cardName of game.cards.hand){
      let noAttackClass = '';
      if (game.monsters.length < 1 && (cardName == 'attack' || cardName == 'bash' || cardName == 'slash')){
        noAttackClass = ' text-danger ';
      }
      html += "<div class='col border text-center p-5 " + noAttackClass
        + "'>" + cardName + "</div>"
    }
    html += "</div>";
    $("#hand").html(html);
  }

  displayMobs(){
    if (game.monsters.length < 1){
      $("#mobs").html('');
      return;
    }
    let text = "<span class='fw-bold'>In Combat:</span> " + game.monsters[0].name + " "
      + Math.round(game.monsters[0].health / game.monsters[0].maxHealth * 100)
      + "%"
    if (game.monsters.length > 1){
      text += "(+" + (game.monsters.length - 1) + " others behind them)";
    }
    $("#mobs").html(text);
  }

  fading(){
    $("#status").css('opacity', $("#status").css('opacity') - .02);
    if ($("#status").css('opacity') == 0){
      ui.stopFading();
    }

  }

  fadeOut(){
    this.fadingInterval = setInterval(this.fading, 100);
  }

  hide(id){
    $("#" + id).addClass('d-none');
    $("#show-" + id).removeClass('d-none');
    $("#hide-" + id).addClass('d-none');
  }

  generateInventory(){
    if (game.inventory.length < 1){
      $("#inventory").html("You have nothing in your inventory.");
      return;
    }
    let html = "<div class='row'>";
    for (let item in game.inventory ){
      let disabledStatus = ' disabled ';
      if ((item == 'recall' && game.enteringDungeon != null)
        || (item == 'potion' && game.health < game.maxHealth)){
        disabledStatus = '';
      }
      html += "<div class='col'>"
      + "<div>" + game.inventory[item] + "</div>"
      + "<div><button id='use-" + item
      + "' class='use btn btn-primary' " + disabledStatus + ">use</button></div>"
      + "</div>"
    }
    html += "</div>"
    $("#inventory").html(html);
  }

  loading(){
    let direction = 'exiting';
    if (game.enteringDungeon === true){
      direction = 'entering';
    }
    $("#" + direction + "-loading").html($("#" + direction + "-loading").html() + ".");
    if ($("#" + direction + "-loading").html().length > 3){
      $("#" + direction + "-loading").html('');
    }
  }

  refresh(){
    this.generateInventory();
    $("#entering").addClass('d-none');
    $("#exiting").addClass('d-none');
    if (game.enteringDungeon === true){
      $("#entering").removeClass('d-none');
    } else if (game.enteringDungeon === false){
      $("#exiting").removeClass('d-none');
    }
    $("#joinFighters").attr('disabled', true)
    if (game.gold >= 10){
      $("#joinFighters").attr('disabled', false)
    }
    if (game.questing.fighter.level > 0 && $("#joinedFighters").hasClass('d-none')){
      $(".joinFighters").addClass('d-none');
      $("#joinedFighters").removeClass('d-none');
    }
    this.displayMobs();
    $("#dive").removeClass('d-none');
    $("#exit").addClass('d-none');
    if (game.enteringDungeon === true){
      $("#dive").addClass('d-none');
      $("#exit").removeClass('d-none');
    }
    $("#discardSize").html(game.cards.discard.length);
    $("#deckSize").html(game.cards.deck.length)
    $("#dungeonSpaces").html(game.dungeonSpaces);
    $("#health").html(game.health);
    $("#defense").html(game.defense);
    if (this.statusMsg != ''){
      if (this.fadingInterval != null){
        this.stopFading();
      }

      $("#status").css('opacity', 1);
      $("#status").html(this.statusMsg);
      this.fadeOut();
    }
    $("#gold").html(game.gold);
    this.statusMsg = "";
    $(".quest").removeClass('d-none')
    $(".stopQuest").addClass('d-none')
    if (game.questing.active != null){
      $("#quest-" + game.questing.active).addClass('d-none')
      $("#stopQuest-" + game.questing.active).removeClass('d-none')
    }
    $("#menu").removeClass('d-none');
    if (game.loop != null){
      $("#menu").addClass('d-none');
    }
    $("#weaponName").html(game.equippedWeapon);
    $("#minAttack").html(game.minAttack);
    $("#maxAttack").html(game.maxAttack);
    $("#itemsInInventory").html(game.inventory.length);
    $("#inventorySize").html(game.maxInventory);
  }

  refreshQuest(){

    for (let questType in game.questing){
      if (questType == 'active'){
        continue;
      }
      $("#" + questType + "-level").html(game.questing[questType].level);
      $("#" + questType + "-progress").css('width', game.questing[questType].xp / game.questing[questType].max * 100 + "%");
    }

  }

  show(id){
    $("#" + id).removeClass('d-none');
    $("#show-" + id).addClass('d-none');
    $("#hide-" + id).removeClass('d-none');
  }

  status(msg){
    this.statusMsg += " " + msg;
  }

  stopFading(){
    clearInterval (this.fadingInterval);
    this.fadingInterval = null;
    $("#status").html('');
  }
}
