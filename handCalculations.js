function calculatePlayerHands(){
  var bestHandRank = 0;
  app.players.forEach(function(player,i){
    app.players[i].handValue = calculatePlayerHand(player.hand);
  });
}

function calculatePlayerHand(playerHand){
  var cardList = playerHand.concat(app.board.cards);

  var flush = findFlush(cardList);
  if(flush){
    return flush;
  } 

  var straight = findStraight(cardList);
  if(straight){
    return straight;
  } 

  var trips = findTrips(cardList);
  if(trips){
    return trips;
  } 

  var twoPair = findTwoPair(cardList);
  if(twoPair){
    return twoPair;
  }

  var onePair = findOnePair(cardList);
  if(onePair){
    return onePair;
  }
  
  var highCard = findHighCard(cardList);
  return highCard;
}

function cardValueCompare(a,b) {
  if (a.value < b.value)
    return -1;
  if (a.value > b.value)
    return 1;

  if (a.value == b.value){
    if(a.suit < b.suit){
      return -1;
    } else {
      return 1;
    }
  }
}

function cardSuitCompare(a,b) {
  if(a.suit < b.suit){
    return -1;
  }
  if(a.suit > b.suit){
    return 1;
  }
  return 0;
}

function findFlush(cardList){
  var cardSearch = cardList.sort(cardSuitCompare);
  console.log(cardSearch);
  for (var i = 0; i < cardSearch.length - 5; i++){
    // We also don't have to find the best trips
    if (cardSearch[i].suit == cardSearch[i+1].suit &&
      cardSearch[i].suit == cardSearch[i+2].suit &&
      cardSearch[i].suit == cardSearch[i+3].suit &&
      cardSearch[i].suit == cardSearch[i+4].suit) {
        var sortedCards = [cardSearch[i], 
          cardSearch[i + 1], 
          cardSearch[i + 2], 
          cardSearch[i + 3], 
          cardSearch[i + 4]].sort(cardValueCompare);
        return {
          description: cardSearch[i].suit + ' Flush - ' + sortedCards[4].display + ' high',
          cards: sortedCards,
          value: sortedCards[4].value,
          rank: 5
        };
    }
  }
  return false;
}

function findStraight(cardList){
  // cardList.sort(cardValueCompare);
  // for (var i = 0; i < cardSearch.length - 2; i++){
  //   // We also don't have to find the best trips
  //   if (cardSearch[i + 2].value == cardSearch[i + 1].value &&  cardSearch[i + 1].value == cardSearch[i].value) {
  //       return {
  //         description: 'Trips',
  //         cards: [cardSearch[i], cardSearch[i + 1], cardSearch[i + 2]],
  //         value: cardSearch[i].value
  //       };
  //   }
  // }
  return false;
}

function findTrips(cardList){
  var cardSearch = cardList.sort(cardValueCompare);
  for (var i = 0; i < cardSearch.length - 2; i++){
    // We also don't have to find the best trips
    if (cardSearch[i + 2].value == cardSearch[i + 1].value &&  cardSearch[i + 1].value == cardSearch[i].value) {
        return {
          description: 'Trip ' + cardSearch[i].display + 's',
          cards: [cardSearch[i], cardSearch[i + 1], cardSearch[i + 2]],
          value: cardSearch[i].value,
          rank: 4
        };
    }
  }
  return false;
}

function findTwoPair(cardList){
  var cardSearch = cardList.sort(cardValueCompare);
  var bestValue = 0;
  var match1 = [];
  var match2 = [];
  for (var i = 0; i < cardSearch.length - 1; i++){
    // Find a pair
    if (cardSearch[i + 1].value == cardSearch[i].value) {
        if(match1.length > 0){
          match2 = [cardSearch[i],cardSearch[i + 1]];
        } else {
          match1 = [cardSearch[i],cardSearch[i + 1]]
        }
    }
  }
  if(match1.length > 0 && match2.length > 0){
    if(match1[0].value > match2[0].value){
      return {
        description: 'Two Pair: ' + match1[0].display + 's & ' + match2[0].display + 's',
        cards: [match1[0],match1[1],match2[0],match2[1]],
        value: bestValue,
        rank: 3
      };
    } else {
      return {
        description: 'Two Pair: ' + match2[0].display + 's & ' + match1[0].display + 's',
        cards: [match1[0],match1[1],match2[0],match2[1]],
        value: bestValue,
        rank: 3
      };
    }
  } else {
    return false;
  }
}


function findOnePair(cardList){
  var cardSearch = cardList.sort(cardValueCompare);
  var bestValue = 0;
  for (var i = 0; i < cardSearch.length - 1; i++){
    // You might think we need to find the best single pair
    // but if you are having to do that, then you have more
    // than one, and it'll get caught in the two pair.
    if (cardSearch[i + 1].value == cardSearch[i].value) {
        return {
          description: 'One Pair of '+cardSearch[i].display+'s',
          cards: [cardSearch[i], cardSearch[i + 1]],
          value: cardSearch[i].value,
          rank: 2
        };
    }
  }
  return false;
}

function findHighCard(cardList){
  var bestValue = 0;
  var bestCard = {};
  cardList.forEach(function(card, i){
    if(card.value > bestValue){
      bestCard = card;
    }
  });
  
  return {
    description: 'High Card: '+bestCard.display + ' of ' + bestCard.suit,
    cards: [bestCard],
    rank: 1
  }
}