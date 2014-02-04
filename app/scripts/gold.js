// namespace my App (might use later)
var App = Object.create(null);

var Fire = Object.create(null);

// Initialize gold firebase
Fire.goldRef = new Firebase('https://flip-coin.firebaseio.com/');


// Creates canvas at #gold-canvas
var paper = Raphael('gold-canvas');

var coins = [];

var createCoins = function(x, y, numCoins) {
    for (var i=0; i<numCoins; i+=1) {
      // Creates gold circle
      var circle = paper.circle(x, (y + (i * 40)),20);

      // Sets the fill attribute of circle
      circle.attr({fill: '#fbb05a'});


      // create hover event handlers on each coin
      circle.hover(
        function() {
          this.attr({fill: '#ff3'});
          return;
        },
        function() {
          this.attr({fill: '#fbb05a'});
          return;
        });

      coins.push(circle);
    }
  return;
};

var showGold = function() {
  console.log(coins);
}

var headsOrTails = function() {
  var result = Math.floor(Math.random() * 2);
  return result;
};

var flipCoin = function(endX, endY, coinNum) {
  // determine which color RED or BLUE
  var result = headsOrTails();
  
  // instantiate coin (off screen)
  var coin = paper.circle(240, 350, 40);

  var drawCoin = function (color) {
      // color should be a string with HEX COLOR
      
      // pick color
      coin.attr({fill: color});
      return;
  };

  if(result === 0) {
    // color is BLUE
    drawCoin('#79b1b3');
  } else if (result === 1) {
    // color is RED
    drawCoin('#bf4c40');
  } else {
    console.log('oops ERROR');
  }

  console.log(coinNum * 100);

  // coin animations callback function
  var animateYo = function() {
    coin.animate({cx: endX, cy: endY},500, 'easeOut');
    return;
  };
  
  // animate coin coming up and flipping
  // interval increases based on coin number so animations cascade and it looks nice
  window.setTimeout(animateYo, coinNum * 100);

  // save result to firebase

  return;
};



// initialize app
$(document).ready(function () {
  var lastY = 50,
      lastX = 50,
      numCoins = 0,
      selectedColor;
  // Get gold coins from firebase

  //

  // call createCoins test 5
  // createCoins(250, 100, 5);

  // Need to say how many gold coins


  $('#reset-button').on('click', function() {
    // Reset Gold
    Fire.goldRef.set({'gold': 25});

    // reset screen
    paper.clear();
    lastY = 50;
    lastX = 50;
    numCoins = 0;
  });

  // Event handler on 'Play Game'- Flips 25 coins
  $('#play-game').on('click', function() {
    // Flip 25 coins

    // if coin
    
    // Clear screen, reset number of coins
    paper.clear();
    // Make sure color is selected

    for (var i=0; i<25; i+=1) {
      // if 5 coins in a column make new column (aka move starting x coordinate for now)
      if (i % 5 == 0) {
        lastX += 100;
        lastY  = 50;
        flipCoin(lastX, lastY, i);
      } else {
        lastY += 30;
        flipCoin(lastX, lastY, i);
        
      }
    }

    // reset lastY and lastX
    lastY = 50;
    lastX = 50;
  });

  /* Ignore this, not doing individual flips for now
  
  $('#flip-coin').on('click', function() {
    // Flips a coin

    // if 5 coins in a column make new column
    if (numCoins > 0 && numCoins % 5 == 0 && numCoins < 25) {
      lastX += 100;
      lastY  = 50;
      flipCoin(lastX, lastY);
      lastY += 30;
      numCoins += 1;


    } else if (numCoins < 25) {
      flipCoin(lastX, lastY);
      lastY += 30;
      numCoins += 1;
      console.log(lastX, lastY, numCoins);

      // have 25 coins, canvas is full game is over
    } else {
      console.log('NO MORE FLIP');
      // function to resolve game
      // function should get called when last coin is set
    }
  });
  
  */

});