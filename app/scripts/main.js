



$(document).ready(function () {
    var chatRef = new Firebase('https://flip-coin.firebaseio.com/');
    chatRef.set('Hello World!');

    var auth    = new FirebaseSimpleLogin(chatRef, function(error, user) {
      // additional settings?
    });

    auth.login('anonymous', {
      rememberMe: true
    });

    // add click handler on send button
    $('#send-chat-box button').on('click', function() {

      // get value from text box
      var chatMessage = $('#text-box').val();
      var name        = $('#name-input').val();
      console.log(chatMessage);

      // send the message
      chatRef.push({name: name, text: chatMessage});

      // reset text box
      $('text-box').val('');

    });

    // event handler for new messages!
    // takes 2 parameters event type and callback function
    chatRef.on('child_added', function(snapshot) {
      var message = snapshot.val();
      displayChatMessage(message.name, message.text);
    });

    function displayChatMessage(name, text) {
      $('<div/>').text(text).prepend($('<em/>').text(name+': ')).appendTo($('#chat-box'));
      $('#chat-box')[0].scrollTop = $('#chat-box')[0].scrollHeight;
    };

    var paper = new Raphael('drawing-board');


   
});