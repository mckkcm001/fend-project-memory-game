/*
 * Create a list that holds all of your cards
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
/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

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

function updateStars(stars){
  const starElements = document.querySelectorAll('.stars i');
  for (let i=0; i<3; i++){
    if (i<stars){
      starElements[i].className = 'fa fa-star';
    }
    else {
      starElements[i].className = 'nostar';
    }
  }
}

function updateMoves(moves){
  document.querySelector('.moves').innerText = moves;
}

function restart(){
  openCards = [];
  stars = 3;
  moves = 0;
  matches = 0;
  updateStars(stars);
  updateMoves(moves);

  cards = shuffle(cards);
  const cardElements = document.querySelectorAll('.card');
  for (let i=0; i<cards.length; i++){
      cardElements[i].className = "card";  //reset all cards facedown
      cardElements[i].querySelector('i').className = cards[i];
  }
}

function match(){
  openCards.forEach(item => {
    item.className = 'card match';
  });
  openCards = [];
  matches++;
  if (matches === 8){
    $('.modal-body').text(`${moves} moves is a ${stars} star rating`)
    $('#myModal').modal()
  }
}

function testMatch(){
  const card1 = openCards[0];
  const card2 = openCards[1];
  if (card1.querySelector('i').className === card2.querySelector('i').className){
    match();
  }
}

function showCard(cardElement){
  cardElement.className = 'card open show';
  moves++;
  updateMoves(moves);
  if (moves > 32){
    stars = 0;
  }
  else if (moves > 28){
    stars = 1;
  }
  else if (moves > 24){
    stars = 2;
  }
  updateStars(stars);
  switch(openCards.length){
    case 0:
      openCards.push(cardElement);
      break;
    case 1:
      openCards.push(cardElement);
      testMatch();
      break;
    case 2:
      openCards.forEach(item => {
        item.className = 'card';
      });
      openCards = [];
      openCards.push(cardElement);
  }
}

function clickHandler(e){
  const cardElement = e.target;
  if (cardElement.className === 'card'){
    showCard(cardElement);
  }
}

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
