// Select the deck
let deck = $('.deck');

// Select the restart button
let restart = $('.restart');
restart.on('click', function( evt ) {
  evt.preventDefault();
  newGame();
});

// Select the moves indicator
let moves = $('.moves');

// Select the star score indicator
let stars = $('.stars');

// Select the timer indicator
let clockDisplay = $('.clock');
let clockMinutes = 0;
let clockSeconds = 0;
let clockTimer;
let clockTimerRunning = false;

// Select Win Screen
let winScreen = $('#winModal');

/*
 * Create a list that holds all of your cards
 */
let cardValues = [
  "fa fa-diamond", "fa fa-paper-plane-o", "fa fa-anchor", "fa fa-bolt",
  "fa fa-cube", "fa fa-anchor", "fa fa-leaf", "fa fa-bicycle",
  "fa fa-diamond", "fa fa-bomb", "fa fa-leaf", "fa fa-bomb",
  "fa fa-bolt", "fa fa-bicycle", "fa fa-paper-plane-o", "fa fa-cube"
];

let filledStar = '<li class="star"><i class="fa fa-star"></i></li>';
let openStar = '<li><i class="fa fa-star-o"></i></li>';
/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

function newGame() {
  //shuffle cards
  shuffle(cardValues);
  //remove handlers
  deck.off('click', 'li');
  //clear deck
  deck.empty();
  //deal new cards
  cardValues.forEach(function(card) {
    let newCard = "";
    newCard += '<li class="card"><i class="';
    newCard += card;
    newCard += '"></i></li>';
    deck.append(newCard);
  });
  //reset moves counter
  moves.text(0);
  //reset score
  stars.empty();
  stars.append(filledStar);
  stars.append(filledStar);
  stars.append(filledStar);
  //create setup listeners
  setupCardListeners();
  openCardList.length = 0;
  //clear clock
  clockMinutes = 0;
  clockSeconds = 0;
  clearInterval(clockTimer);
  clockDisplay.text("0:00");
  clockTimerRunning = false;
}

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}


/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
let openCardList = [];

function setupCardListeners() {
  deck.on('click', 'li', function(evt) {
    if( !clockTimerRunning ) {
      //start clock
      clockTimer = setInterval(function() {
        //increment clock
        clockSeconds += 1;
        if( clockSeconds == 60 ) {
          clockSeconds = 0;
          clockMinutes += 1;
        }

        //display new value
        let value = clockMinutes + ":" + ((clockSeconds>=10)?"":"0") + clockSeconds;
        clockDisplay.text(value);
      },1000);
      clockTimerRunning = true;
    }
    //ignore clicks on already matched cards and open cards
    if( $(this).attr("class") == "card match" || $(this).attr("class") == "card open show") {
      return;
    }
    //display card
    flipCard(this);
    //add to open card list
    addCardToList(this);

    //handle matches
    if( openCardList.length == 2 ) {
      if( match() ) {
        cardsMatch();
      } else {
        cardsDontMatch();
      }
    }
  });
}

function flipCard(card) {
  $(card).addClass("open show");
}

function addCardToList(card) {
  openCardList.push(card);
}

function match() {
  if( $(openCardList[0]).children().attr("class") == $(openCardList[1]).children().attr("class") ) {
    return true;
  } else {
    return false;
  }
}

function cardsMatch() {
  setTimeout(function(){
    $(openCardList[0]).removeClass("open show").addClass("match");
    $(openCardList[1]).removeClass("open show").addClass("match");
    openCardList.shift();
    openCardList.shift();
    //add move
    incMoves();
    //determine if everything matches
    if( deck.children(".match").length == 16 ) {
      gameOver();
    }
  }, 1000);
}

function cardsDontMatch() {
  setTimeout(function(){
    $(openCardList[0]).removeClass("open show");
    $(openCardList[1]).removeClass("open show");
    openCardList.shift();
    openCardList.shift();
    //add move
    incMoves();
  }, 1000);
}

function incMoves() {
  //grab current moves
  let current = $(moves).text();
  //convert to number
  current -= 0;
  //increment
  current += 1;
  //determine star breakpoints
  if( current > 18 ) {
    stars.empty();
    stars.append(filledStar);
    stars.append(openStar);
    stars.append(openStar);
  } else if( current > 12 ) {
    stars.empty();
    stars.append(filledStar);
    stars.append(filledStar);
    stars.append(openStar);
  }
  //display current moves
  $(moves).text(current);
}

// restart game after win
$("#playagain").click(function(evt) {
  winScreen.css("display", "none");
  newGame();
});

function gameOver() {
  clearInterval(clockTimer);
  clockTimerRunning = false;
  $(".winningMoves").text($(moves).text());
  $(".winningStars").text(stars.children(".star").length);
  $(".winningTime").text($(clockDisplay).text());
  winScreen.css("display", "inline");
}
