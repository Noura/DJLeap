// Create the audio context
window.onload = function() {

    console.log('javascript file started');
    var context = init();

    var bufferSize = 4096;

    var hand = {
        pinch: 0,
        x: 0,
        y: 0,
    };
    Leap.loop({ enableGestures: true }, function(frame) {
        // left and right hands
        for (var i = 0; i < frame.hands.length; i++) {
            var h = frame.hands[i];
            hand.pinch = h.pinchStrength;
            hand.x = h.palmPosition[0];
            hand.y = h.palmPosition[1];
        }
        console.log('hand x', hand.x, 'y', hand.y, 'pinch', hand.pinch);
    });

    function init() {
      try {
        // Fix up for prefixing
        window.AudioContext = window.AudioContext||window.webkitAudioContext;
        context = new AudioContext();
      }
      catch(e) {
        console.log('Web Audio API is not supported in this browser');
      }
      
      console.log('Context created');
      return context;
    }

    // Code to load the MP3
    var mp3Buffer = null;

    function loadMP3(url) {
      console.log('loadMP3');
      var request = new XMLHttpRequest();
      request.open('GET', url, true);
      request.responseType = 'arraybuffer';

      // Decode asynchronously
      request.onload = function() {
        context.decodeAudioData(request.response,
            function(buffer) {
                mp3Buffer = buffer;
                playSound(mp3Buffer);
            },
            function(e) {console.log("Error with decoding audio data" + e.err);}
        );
      }
      request.send();
      
      console.log('MP3 request sent');
    }

    // Code to play the MP3
    function playSound(buffer) {
      console.log('About to start playing');
      var source = context.createBufferSource(); // creates a sound source
      source.buffer = buffer;                    // tell the source which sound to play
      source.connect(empty_effect);
      empty_effect.connect(context.destination);
      source.start(0);                           // play the source now
    }

    var empty_effect = (function() {
        var node = context.createScriptProcessor(bufferSize, 1, 1);
        node.onaudioprocess = function(e) {
            var input = e.inputBuffer.getChannelData(0);
            var output = e.outputBuffer.getChannelData(0);
            for (var i = 0; i < bufferSize; i++) {
                var vol = Math.pow(1.01, hand.y)/150.0;
                output[i] = input[i] * vol;
            }
        };
        return node;
    })();

    // Now actually load and play the MP3
    loadMP3('robyn_call_your_girlfriend.m4a');
};
