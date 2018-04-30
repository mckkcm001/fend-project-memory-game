/*
 * Initialization steps--global variables
 * cards array--these are the names of classes used to display
 * font awesome images in the <i class="fa fa-diamond"></i> elements.
 * openCards array--holds cards turned face up.
 * stars, moves, matches, and time are all counters set to zero.
 * firstCard is for starting the clock when the first cardis clicked. Can't use
 * time = 0 since a player may click another card before time increments.
 * clock--used to store reference to setInterval so setInterval can be stopped
 */
let cards = [
  "fa fa-diamond",
  "fa fa-diamond",
  "fa fa-paper-plane-o",
  "fa fa-paper-plane-o",
  "fa fa-anchor",
  "fa fa-anchor",
  "fa fa-bolt",
  "fa fa-bolt",
  "fa fa-cube",
  "fa fa-cube",
  "fa fa-leaf",
  "fa fa-leaf",
  "fa fa-bicycle",
  "fa fa-bicycle",
  "fa fa-bomb",
  "fa fa-bomb",
];

let openCards = [];
let stars = 3;
let moves = 0;
let matches = 0;
let time = 0;
let firstCard = true;
let clock;

/*
 * Shuffle function from http://stackoverflow.com/a/2450976.
 * Called in restart.
 */
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
 * Called by restart to update the stars display.
 * Displayed stars have className of 'fa fa-star'.
 */
function updateStarsDisplay(stars){
  const starElements = document.querySelectorAll('.stars i');

  for (let i = 0; i < 3; i++){
    starElements[i].className = i < stars ? 'fa fa-star' : 'nostar';
  }
}

/*
 * Called by restart to update the moves display.
 */
function updateMovesDisplay(moves){
  document.querySelector('.moves').innerText = moves;
}

/*
 * Called by restart to update the timer display.
 */
function updateTimeDisplay(time){
  $('.timer').text(time);
}

/*
 * Function to start clock. Called when first card is clicked. Time is
 * incremented now so that when updateTime is called, time is correct and
 * a new clock is not started.
 */
function startClock(){
  clock = setInterval(() => {
    time++;
    updateTimeDisplay(time);
  },1000);
}

/*
 * Function to stop clock. Called by gameEnd and restart.
 */
function stopClock(){
  clearInterval(clock);
}

/*
 * Resets the game to intial conditions. Called at the end of this script,
 * when restart is clicked, and when modal closes.
 */
function restart(){
  // Needed for restart click.
  stopClock();

  openCards = [];
  matches = 0;
  stars = 3;
  moves = 0;
  time = 0;
  firstCard = true;
  updateTimeDisplay(time);
  updateStarsDisplay(stars);
  updateMovesDisplay(moves);

  //Shuffle cards and display face down by setting className to 'card'.
  cards = shuffle(cards);
  const cardElements = document.querySelectorAll('.card');
  for (let i=0; i<cards.length; i++){
      cardElements[i].className = 'card';
      cardElements[i].querySelector('i').className = cards[i];
  }
}

/*
 * Called when all matches are made. The clock is stopped, the modal is
 * displayed, and the game is reset when the modal closes.
 */
function endGame(){
  stopClock();
  $('.modal-title').text(`You matched all cards in ${time} seconds!!`);
  $('.modal-body').text(`${moves} moves is a ${stars} star rating!`);
  $('#myModal').modal();
  $('#myModal').on('hidden.bs.modal', function (e) {
    restart();
  });
}

/*
 * Called when two cards match. To indicate a match and prevent click selection,
 * the className is changed to 'card match'. The openCards array is
 * cleared, and the matches counter is incremented.
 * If the matches are complete, endGame is called.
 */
function match(){
  openCards.forEach(item => {
    item.className = 'card match';
  });
  openCards = [];
  matches++;
  if (matches === 8){
    endGame();
  }
}

/*
 * Called when two cards are showing. If the two cards match,
 * call match. Otherwise, do nothing until player clicks on
 * a new face down card. Also, moves and stars are updated.
 */
function testMatch(){
  updateMoves();
  const card1 = openCards[0].querySelector('i').className;
  const card2 = openCards[1].querySelector('i').className;
  if (card1 === card2){
    match();
  }
}

/*
 * Increment moves, and set stars based on moves.
 * It can take up to 15 moves to find all matches, so anything above that
 * is two stars, and anything above 17 moves is one star.
 * Called by showCard.
 */
function updateMoves() {
  moves++;
  updateMovesDisplay(moves);
  stars = moves > 17 ? 1 : moves > 15 ? 2 : 3;
  updateStarsDisplay(stars);
}

/*
 * Add card just turned over to openCards array and show card by changing class.
 * Called by showCard.
 */
function addCard(cardElement) {
  openCards.push(cardElement);
  cardElement.className = 'card open show';
}

/*
 * Called when clickHandler() detects a click on a face down card. updateMoves
 * is called to handle moves and stars changes.
 * The number of cards showing determines what action is to be taken.
 * All branches call addCard.
 */
function showCard(cardElement){
  switch(openCards.length){
    // If this is the first card turned over, put it in the openCards array.
    case 0:
      addCard(cardElement);
      break;

    // If this is the second card turned over, put it in the openCards array
    // and call testMatch().
    case 1:
      addCard(cardElement);
      testMatch();
      break;

    // Two unmatched cards are showing, so turn them face down by changing
    // className, clear the openCards array, and put the new card in the
    // openCards array.
    case 2:
      openCards.forEach(item => {
        item.className = 'card';
      });
      openCards = [];
      addCard(cardElement);
  }
}

/*
 * If a click on the deck list is on a down facing card, call showCard. If this
 * is the first card (time = 0) then start clock.
 */
function clickHandler(e){
  const cardElement = e.target;
  if (cardElement.className === 'card'){
    if (firstCard){
      startClock();
      firstCard = false;
    }
    showCard(cardElement);
  }
}

/*
 * Add click listeners to .deck and .restart elements and start game by calling
 * restart.
 */
document.querySelector('.deck').addEventListener('click',clickHandler,false);
document.querySelector('.restart').addEventListener('click',restart,false);
restart();
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
