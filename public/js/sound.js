// here we are creating a instrument, and tomaster makes sure that the sound goes to the computer
// how to make it not sound like a gameboy ?
var synthOne = new Tone.Synth({
  oscillator:{
    type: 'square8'   //pick this type of oscillator
  },
  envelope: {
    // parameters for each notes - these are the y values of the note graph
                                  // time is the x value
    attack: 0.1,  //sharp attack - amount of time it takes to reach the maximum intensity
    decay: 2,       // how long it holds up
    sustain: 0      // where it stops it 
    // release  --- will take care of how long the release takes
  }
}).toMaster();

var synthTwo = new Tone.MonoSynth({
  oscillator: {
    type: 'fatsawtooth4'
  },
  filter: {
    type: "peaking"
  },
  envelope: {
    // parameters for each notes - these are the y values of the note graph
                                  // time is the x value
    attack: 2,  //sharp attack - amount of time it takes to reach the maximum intensity
    decay: 1,       // how long it holds up
    sustain: 4,      // where it stops it 
    release: 16  // will take care of how long the release takes
  },
  filterEnvelope: {
    attack: 2,  //sharp attack - amount of time it takes to reach the maximum intensity
    decay: 1,       // how long it holds up
    sustain: 1,      // where it stops it 
    release: 10,  // will take care of how long the release takes
    baseFrequency: 100,
    octave: 2,
    exponent: 4
  }

}).toMaster();

var notes = ['A2', 'C2', 'D2', 'E2', 'G2'];




//synthTwo.triggerAttackRelease('E5', 4, 0);

// call this method with the note as the first parameter, the length and the starting point
// attack - the peak of sound in synthesis
// release - the drop later in synthesis
// synthOne.triggerAttackRelease('C4', 1, 1);
// synthOne.triggerAttackRelease('G5', 1, 2);
// synthOne.triggerAttackRelease('A5', 1, 3);

//create a call back function -- anonomous funct, so that the 
var loop = new Tone.Loop(function(time){
  // call the synth inside the call back function
  synthOne.triggerAttackRelease('C5', 0.25, time);
  synthOne.triggerAttackRelease('G5', 0.25, time + 1);
  synthOne.triggerAttackRelease('A5', 0.25, time + 2);
});


//loop.start(0);

Tone.Transport.start();

// This will stop the tone without killing the Tone.Transport
// loop.stop();
// This will stop the Tone
//Tone.Transport.stop();

var socket = io();

socket.on('note', function(tweetText, userHandle, friendsCount) {
  var tweetWithHandle = '@' + userHandle + ":" + tweetText;

  
  triggerNote('low', tweetWithHandle, synthOne, synthTwo);

  }

  console.log(tweetText);
});


var tweetCount = 0;

function triggerNote(type, tweet, _synthOne, _synthTwo){

  // getting tweet position on the page radomally
  var height = Math.floor(Math.random() * 80);
  var width = Math.floor(Math.random() * 50);

  // adding html tags to tweet
  var tweetHtml = '<div class="tweet" id="' + tweetCount + '" style="top:' + height + 'vh; left:' + width + 'vw"><p>' + tweet + '</p></div>';

  // coloring the relevant hashtags
  tweetHtml = tweetHtml.replace('#thishashtag', '<span id="hashtag">#thishashtag</span>');

  // getting note randomally
  var note = notes[Math.round(Math.random()*notes.length - 1)];
  console.log(note);

  // playing the note
  // using 'regular' synth
  if (type === 'high') {
    _synthOne.triggerAttackRelease(note, 0.5);

  // using 'rare' synth
  } else {
    _synthTwo.triggerAttackRelease(note, 5);
  }

  // adding the tweet to the page
  $('.container').append(tweetHtml);

  // making tweet disappear gradually
  var id = '#' + tweetCount;

    $(id).delay(500).animate({
      'opacity': 0
    }, 4000, function(){
      $(id).remove();
    });


  // incrementing tweetCount
  tweetCount++;

}
