// Create the audio context
var context = init();
var buffers = {
    song: null,
    reverb: null,
};
var bufferSize = 4096;
var gain1 = context.createGain();
gain1.gain.value = 0.5;
var gain2 = context.createGain();
gain2.gain.value = 0.5;

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
    gain2.gain.value = Math.abs(hand.x)/300.0;
    gain1.gain.value = 1.0 - gain2.gain.value;

    console.log('hand x', hand.x, 'y', hand.y, 'pinch', hand.pinch);
});

function init() {
    try {
        // Fix up for prefixing
        window.AudioContext = window.AudioContext||window.webkitAudioContext;
        context = new AudioContext();
    }
    catch(e) {
        alert('Web Audio API is not supported in this browser');
    }

    console.log('Context created');
    return context;
}

function loadMP3(url, buffer_key) {
    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.responseType = 'arraybuffer';

    // Decode asynchronously
   request.onload = function() {
       console.log('request.onload');
       context.decodeAudioData(request.response,
               function(buffer) {
                   buffers[buffer_key] = buffer;
                   var bs = Object.keys(buffers);
                   var play = true;
                   for (var i = 0; i < bs.length; i++) {
                       if (buffers[bs[i]] === null) {
                           play = false;
                           break;
                       }
                   }
                   if (play) {
                       playSound();
                   }
               },
               function(e) {console.log("Error with decoding audio data" + e.err);}
               );
   };
    request.send();

    console.log('audio request sent');
}

// Code to play the MP3
function playSound() {
    console.log('About to start playing');
    var source = context.createBufferSource();
    source.buffer = buffers.song;

    var reverb = context.createConvolver();
    reverb.buffer = buffers.reverb;

    source.connect(gain1);
    source.connect(reverb);
    reverb.connect(gain2);
    gain1.connect(volume_effect);
    gain2.connect(volume_effect);
    volume_effect.connect(context.destination);

    source.start(0);
}

var volume_effect = (function() {
    var node = context.createScriptProcessor(bufferSize, 1, 1);
    node.onaudioprocess = function(e) {
        var input = e.inputBuffer.getChannelData(0);
        var output = e.outputBuffer.getChannelData(0);
        for (var i = 0; i < bufferSize; i++) {
            var vol = Math.pow(1.01, hand.y - 50.0)/150.0;
            output[i] = input[i] * vol;
        }
    };
    return node;
})();

// Now actually load and play the MP3
loadMP3('robyn_call_your_girlfriend.m4a', 'song');
loadMP3('irHall.ogg', 'reverb');
