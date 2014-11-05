// Create the audio context
var context = init();

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

// Code to load the MP3
var mp3Buffer = null;

function loadMP3(url) {
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
                function(e) {
                    console.log("Error with decoding audio data" + e.err)}
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
    source.connect(context.destination);       // connect the source to the context's destination (the speakers)
    source.start(0);                           // play the source now
}

// Now actually load and play the MP3
loadMP3('robyn_call_your_girlfriend.m4a');
