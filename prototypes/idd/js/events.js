$(document).on('click', '.addToDeck', function(e){
  game.cards.addToDeck(e.target.id.split('-')[1])
  ui.displayDeck();
});

$(document).on('click', '.buy', function(e){
  game.buy(e.target.id.split('-')[1])
  ui.displayBlacksmith();

});


$(document).on('click', '.removeFromDeck', function(e){
  game.cards.removeFromDeck(e.target.id.split('-')[1])
  ui.displayDeck();
});

$(document).on('click', '#joinFighters', function(e){
  if (game.gold >= 10){
    game.questing.fighter.level++;
    game.gold -= 10;
    game.cards.spawn('fighter');
  }
})

$(document).on('click', '#deck', function(e){
  ui.displayDeck();
})

$(document).on('click', '#dive', function(e){
  game.dive();
})

$(document).on('click', '#exit', function(e){
  game.exit();
})

$(document).on('click', '.hide', function(e){
  ui.hide(e.target.id.split('-')[1])
})

$(document).on('click', '.quest', function(e){
  game.quest(e.target.id.split('-')[1])
});

$(document).on('click', '.show', function(e){
  ui.show(e.target.id.split('-')[1])
})

$(document).on('click', '.stopQuest', function(e){
  game.stopQuest();
});

$(document).on('click', '.tab', function(e){
  $(".tab").removeClass('fw-bold');
  $("#" + e.target.id).addClass('fw-bold');
  $(".window").addClass('d-none');
  $("#window-" + e.target.id).removeClass('d-none');
})

$(document).on('click', '.use', function(e){
  game.use(game.inventory[e.target.id.split('-')[1]])
})


$(document).on('click', '#town', function(e){
  ui.displayBlacksmith();
});
$(document).on('click', 'button', function(e){
  ui.refresh()
})
