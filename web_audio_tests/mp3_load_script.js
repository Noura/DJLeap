// Create the audio context
window.onload = function() {

    console.log('javascript file started');
    var context = init();
    var reverbBuffer;
    var mp3Buffer;

    // Load audio
    loadAudio('irHall.ogg', reverbBuffer, false);
    loadAudio('robyn_call_your_girlfriend.m4a', mp3Buffer, true);

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

    function loadAudio(url, buf, play_after) {
      console.log('loadAudio');
      var request = new XMLHttpRequest();
      request.open('GET', url, true);
      request.responseType = 'arraybuffer';

      // Decode asynchronously
      request.onload = function() {
        context.decodeAudioData(request.response,
            function(buffer) {
                buf = buffer;
                if (play_after) {
                    playSound();
                }
            },
            function(e) {console.log("Error with decoding audio data" + e.err);}
        );
      }
      request.send();
      console.log('Audio request sent');
    }

    // Code to play the MP3
    function playSound() {
      console.log('About to start playing');
      console.log('mp3Buffer: ', mp3Buffer);
      console.log('volume_effect: ', volume_effect);
      

      // Create audio source
      var source = context.createBufferSource(); // creates a sound source
      source.buffer = mp3Buffer;                    // tell the source which sound to play

      // Reverb
      //var reverb = context.createConvolver();
      //reverb.buffer = reverbBuffer;

      // Connect up effects
      source.connect(volume_effect);
      volume_effect.connect(context.destination);
      //reverb.connect(context.destination);

      source.start(0);                           // play the source now
    }

    var volume_effect = (function() {
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
    
};
