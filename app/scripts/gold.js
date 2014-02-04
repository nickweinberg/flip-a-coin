// namespace App (might use later)
var App = Object.create(null);

var CoinPouch = Object.create(null);
CoinPouch.blueCoins = 0;
CoinPouch.redCoins  = 0;
CoinPouch.gold      = 25;

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

var moveSimiliar = function(color, yMovement) {
  // for each coin in coins
  // if coins[i].attrs.fill = 
  $('circle').each( function( index, element ){
    if ($(this).attr('fill') === color) {
      var newYPosition = Number($(this).attr('cy')) + yMovement;
      $(this).attr('cy', newYPosition);
    }
  });

  return;
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

/* This is borked for now Feb 03, 2014 */
  var addHoverHandler = function (color) {
    coin.mousedown(
      function(){
        console.log(this);
        moveSimiliar(color, -20);
        this.attr({fill: '#fff999'});
      });
    coin.mouseup(
      function() {
        moveSimiliar(color, 20);
        this.attr({fill: color});
      });
    coins.push(coin);
  };

  if(result === 0) {
    // color is BLUE
    CoinPouch.blueCoins += 1;
    drawCoin('#79b1b3');
    addHoverHandler('#79b1b3');
  } else if (result === 1) {
    // color is RED
    CoinPouch.redCoins += 1;
    drawCoin('#bf4c40');
    addHoverHandler('#bf4c40');
  } else {
    console.log('oops ERROR');
  }

  

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


  


  // call createCoins test 5
  // createCoins(250, 100, 5);

  // Need to say how many gold coins


  $('#reset-button').on('click', function() {
    // Reset Gold
    Fire.goldRef.set({'gold': CoinPouch.gold});

    // reset screen
    paper.clear();
    lastY = 50;
    lastX = 50;
    numCoins = 0;

    // reset CoinPouch
    CoinPouch.blueCoins = 0;
    CoinPouch.redCoins  = 0;

    // maybe dont reset gold
    CoinPouch.gold      = 0;
  });

  // Event handler on 'Play Game'- Flips 25 coins
  $('#play-game').on('click', function() {
    // Flip 25 coins

    
    // Clear screen, reset number of coins
    paper.clear();
    // Make sure color is selected
    var selected = $('input[type="radio"][name="colorChoice"]:checked');
    if (selected.length > 0) {
      selectedColor = selected.val();
    } else {
      console.log('pick a color first');
      return;
    }

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

    // count up wins/losses
    if (selectedColor === 'blue') {
      // count up blue
      CoinPouch.gold += CoinPouch.blueCoins;
      CoinPouch.gold -= CoinPouch.redCoins;
      console.log(CoinPouch.gold);

    } else if (selectedColor === 'red') {
      // count up red
      CoinPouch.gold -= CoinPouch.blueCoins;
      CoinPouch.gold += CoinPouch.redCoins;
      console.log(CoinPouch.gold);

    } else {
      // something terrible happened!
      console.log('error!');
    }

    // reset CoinPouch
    CoinPouch.blueCoins = 0;
    CoinPouch.redCoins  = 0;

    // update Gold count display
    $('#gold-amount').text(CoinPouch.gold);

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