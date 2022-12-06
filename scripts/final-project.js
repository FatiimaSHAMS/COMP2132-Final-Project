////popup//////////
const popup = document.querySelector('.popup-about');
const overlay = document.querySelector('.overlay');
const btnCloseAbout = document.querySelector('.close-about');
const btnsOpenAbout = document.querySelectorAll('#show-about');

// Open About Game
const openPopup = function () {
  popup.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

// Close About Game
const closeAbout = function () {
  popup.classList.add('hidden');
  overlay.classList.add('hidden');
};

// Add eventListener to about game 
btnsOpenAbout[0].addEventListener('click', openPopup);

// Close About game when clicking outside or pressing escape
btnCloseAbout.addEventListener('click', closeAbout);
overlay.addEventListener('click', closeAbout);

document.addEventListener('keydown', function (e) {
  // console.log(e.key);
  if (e.key === 'Escape' && !popup.classList.contains('hidden')) {
    closeAbout();
  }
});


// Image Path 
const imagesPath    = 'images/';
const hangmanPath  = imagesPath + 'hangman/';

// Elements
const $alphabetButtons  = $('#alphabet-buttons');
const $hangmanWord      = $('#hangman-word');
const $hangmanHint      = $('#hangman-hint');
const $hangmanGuess     = $('#hangman-guesses');
const $hangmanImage     = $('#hangman-img');


// Hangman Data
const wordHintDic = { "hangman" : "A game for two in which one player tries to guess the letters of a word",
                      "egg": "A white food from chickens",
                       "build": "construct (something) by putting parts or material together",
                       "end": "Get through",
                       "burn": "Fire something and make it burn",
                       "mother": "Woman with a child",
                       "exhibition": "Show, introduce",
                       "traffic": "All pedestrians and vehicles on the roads",
                       "trust" : "Do not doubt someone",
                       "ugly" : "Not beautiful",
                       "umbrella" : "Tool used to protect from rain and sun",
                       "unhealthy" : "Not in good health",
                       "win" : "Ensuring a positive and good result",
                       "young" : "Who is out of childhood",
                     };


/* Basic Functions */
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
};



/* Game Object */
class HangmanGame {
  constructor(wordHintDictionary){
    this.foundTheWord = false;
    this.wordHintDictionary = wordHintDictionary;
    this.alphabetLetters = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
    this.guessedLetters = [];
    this.guessesLeft = 6;
    this.resetGame();
    this.updateImage();
    this.insertAlphabetLetters();
    this.updateHiddenWord();
  };

  resetGame(){
    this.foundTheWord = false;
    this.word = Object.keys(this.wordHintDictionary)[Math.floor(Math.random() * Object.keys(this.wordHintDictionary).length)]
    this.hint = this.wordHintDictionary[this.word];
    this.guessedLetters = [];
    this.guessesLeft = 6;
    $alphabetButtons.empty();
    this.insertAlphabetLetters();
    this.updateHiddenWord();
    this.updateImage();
    $hangmanHint.text(`Word hint: ${this.hint}`);
    this.updateGuessesLeft();
  };

  winGame(){
    
    $hangmanHint.text(`You Win! Congratulations!`);
    this.insertResetButton();
    
  };

  loseGame(){
    $hangmanHint.text(`You Lose! The word was: ${this.word}`);
    this.insertResetButton();
  };

  updateGuessesLeft(){
    $hangmanGuess.html(`You have <b>${this.guessesLeft}</b> guesses left.`);
  };

  updateImage(isWin){
    if (isWin){
      $hangmanImage.attr('src', hangmanPath + "hangman-win.png");
    } else {
      $hangmanImage.attr('src', hangmanPath + "hangman-0" + String(this.guessesLeft) + ".png");
    };
  };


  disableLetterButtons(){
    this.alphabetLetters.forEach((letter)=>{
      if (this.guessedLetters.includes(letter) != true){
        $('#btn_' + letter).addClass('btn-disabled-override-colored'); // Disable unused buttons
      };
    });
  };

  updateHiddenWord(){
    // Update Hidden Word
    let hiddenWord = '';
    Array.from(this.word).forEach((letter)=>{
      if (this.guessedLetters.includes(letter) == true){
        hiddenWord += letter;
      } else {
        hiddenWord += '_';
      };
      hiddenWord += ' ';
    });
    $hangmanWord.text(hiddenWord);

    // Check if the user won
    if (hiddenWord.replace(/ /g, "") == this.word){
      this.foundTheWord = true;
    } 
  };

  guessLetter(letter){ 
    $('#btn_' + letter).addClass('btn-disabled-override'); 
    this.guessedLetters.push(letter);

    if (this.word.includes(letter) == false){
      this.guessesLeft--;
    }
    this.updateCurrentWordStatus()
  };

  //Update HTML
  updateCurrentWordStatus(){
    this.updateGuessesLeft();
    this.updateHiddenWord();
    this.updateImage(false);

    // Update Hidden Word and Check if the user won
    if (this.foundTheWord) {
      this.disableLetterButtons()
      this.winGame();
      this.updateImage(true);
      return true;
    }

    // Overall Status
    if(this.guessesLeft === 0){
      this.disableLetterButtons()
      this.loseGame();
      return false
    };
  };

  insertAlphabetLetters(){
    $alphabetButtons.empty();
    this.alphabetLetters.forEach((letter)=>{
        $alphabetButtons.append(`<button class="btn-alphabet-letter" id="btn_${letter}" onClick="guess('${letter}')">${letter.toUpperCase()}</button>`);
    });
  };

  insertResetButton(){
    $hangmanGuess.html(`<button class="btn-reset action-button" onClick="resetGame()">Play Again!</button>`);
  };
};


/* Create a game and initialize it */
const hangmanGame = new HangmanGame(wordHintDic);

/* Guess function (Used by the letters) */
function guess(string){
  hangmanGame.guessLetter(string);
};

/* Guess function (Used by the letters) */
function resetGame(){
  hangmanGame.resetGame();
};


