var app = {};
// Global Settings
app.numberOfPlayers = 8;
app.numberOfHands = 1;
app.playerName = 'Trey Reynolds';
app.playerBuyIn = 40;
app.computerBuyIn = 40;

// Global variables
// If I were doing more complicated things we wouldn't have these,
// but pramatism not idealism as the Radiohead song says.
app.cards = [];
app.unpickedCards = [];
app.players = [];
app.board = {
  cards: []
};

/**
 * Generates the Deck, duh
 * @return void
 */
function generateDeck(){
  // Generate a card number holder so we never re-use cards
  for(i=0;i<52;i++){
    app.unpickedCards.push({cardNumber:i});
  }

  var suits = [
    { name:'S','display':'Spades'},
    { name:'H','display':'Hearts'},
    { name:'D','display':'Diamonds'},
    { name:'C','display':'Clubs'},
  ];

  var facecards = [
    {'name':'J','display':'Jack','value':11},
    {'name':'Q','display':'Queen','value':12},
    {'name':'K','display':'King','value':13},
    {'name':'A','display':'Ace','value':14},
  ]

  suits.forEach(function(suit){
    for(i=2; i<11; i++){
      app.cards.push({
          'name':i+suit.name,
          'display':i,
          'suit':suit.display,
          'value':i,
          'ownerId':null
      });
    }
    facecards.forEach(function(facecard){
      app.cards.push({
        'name':facecard.name+suit.name,
        'display':facecard.display,
        'suit':suit.display,
        'value':facecard.value,
        'ownerId':null
      });
    });
  });
}

function assignPlayers(){
  var playerAssignment = Math.floor(Math.random() * app.numberOfPlayers);
  var computerNumber = 1;

  for(i=0; i<app.numberOfPlayers; i++){
    app.players.push({
      'id':'player'+i,
      'order': i,
      'position':i,
      'name': (playerAssignment == i) ? app.playerName : 'Computer '+computerNumber,
      'stack': app.playerBuyIn,
      'hand': [],
      'handValue': {}
    });
    if(playerAssignment != i){
      computerNumber++;
    }
  }
  
}

function pickCardIndex(){
  var randomIndex = Math.floor(Math.random() * app.unpickedCards.length);
  var number = app.unpickedCards[randomIndex].cardNumber;
  app.unpickedCards.splice(randomIndex,1);
  return number;
}

function dealHands(){
  // To make it extra poker like, we deal one card at time
  // Order 0 is dealer, position at the table is set
  app.players.forEach(function(player, i){
    // Pick a random card
    app.players[i].hand.push(app.cards[pickCardIndex()]);
  });

  app.players.forEach(function(player, i){
    // Pick a random card
    app.players[i].hand.push(app.cards[pickCardIndex()]);
  });
}

// Flop Three Cards
function dealFlop(){
  for(i=0; i<3; i++){
    app.board.cards.push(app.cards[pickCardIndex()]);
  }
}

// Flip One Card
function dealTurn(){
  app.board.cards.push(app.cards[pickCardIndex()]);
}

// Flip One Card
function dealRiver(){
  app.board.cards.push(app.cards[pickCardIndex()]);
}

function showPlayers(){
  app.players.forEach(function(player, i){
    $('#players').append(
      '<div class="col-md-3">' + 
        '<div class="panel panel-default">' +
          '<div class="panel-heading">' + player.name + "</div>" +
          '<div class="panel-body" id="'+player.id+'">' +
            '<dl>' +
              '<dt>Hand:</dt><dd>'+ player.hand[0].name+' + '+player.hand[1].name +'</dd>' +
            '</dl>' +
          '</div>' +
        '</div>' +
      '</div>'
    );
  });
}

function showFlop(){
  for(i=0; i<3; i++){
    $('#flop').append('<div class="card">'+
        app.board.cards[i].display + ' of ' +
        app.board.cards[i].suit +
      '</div>');
  }
}

function showTurn(){
  $('#turn').append('<div class="card">'+
        app.board.cards[3].display + ' of ' +
        app.board.cards[3].suit +
      '</div>');
}

function showRiver(){
  $('#river').append('<div class="card">'+
        app.board.cards[4].display + ' of ' +
        app.board.cards[4].suit +
      '</div>');
}

function showPlayerHandCalculation(){
  app.players.forEach(function(player,i){
    $('#'+player.id).append(player.handValue.description);
  });
}

$(function() {

  generateDeck();
  assignPlayers();
  dealHands();
  showPlayers();

  // TODO: Sim betting

  dealFlop();
  showFlop();

  // TODO: Sim betting

  dealTurn();
  showTurn();

  // TODO: Sim betting

  dealRiver();
  showRiver();


  // Display the results of the stuff
  calculatePlayerHands();
  showPlayerHandCalculation();

});






















