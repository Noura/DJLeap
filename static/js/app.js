window.onload = function() {
    console.log('app.js loaded');

    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');

    var $window = $(window);
    var $document = $(document);
    // TODO why do window and document have different heights? and does this differ between Chrome and Firefox?
    var w = $document.width();
    var h = $document.height();

    // TODO resize (and redraw black) canvas when window resizes
    canvas.setAttribute('width', w);
    canvas.setAttribute('height', h);
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, w, h);

    // TODO make these numbers not sketchy/magical
    var leap_bounds = {
        x: { min: -250, max: 250 },
        y: { min: 30,   max: 400 },
        z: { min: -200, max: 200 },
    };

    var canvas_bounds = {
        x: { min: 0, max: w },
        y: { min: 0, max: h },
        z: { min: -200, max: 200 },
    };

    var linear_map = function(from, to) {
        var map = function(x) {
            return to.min + (x - from.min)/(from.max - from.min)*(to.max-to.min);
        };
        return map;
    };

    var canvas_point = {
        x: linear_map(leap_bounds.x, canvas_bounds.x),
        y: linear_map(leap_bounds.y, canvas_bounds.y),
        z: linear_map(leap_bounds.z, canvas_bounds.z),
    };

    var options = { enableGestures: true };
    Leap.loop(options, function(frame) {
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, w, h);
        for (var i = 0; i < frame.hands.length; i++) {
            var hand = frame.hands[i];

            //console.log('w', w, 'h', h, 'LeapX', parseInt(hand.palmPosition[0]), 'LeapY', parseInt(hand.palmPosition[1]), 'canvasX', parseInt(canvas_point.x(hand.palmPosition[0])), 'canvasY', parseInt(canvas_point.y(hand.palmPosition[1])));

            ctx.fillStyle = '#FFFFFF';
            if (hand.pinchStrength > 0.5)
                ctx.fillStyle = '#FFFF00';
            if (hand.grabStrength > 0.5)
                ctx.fillStyle = '#0000FF';
            if (hand.pinchStrength > 0.5 && hand.grabStrength > 0.5)
                ctx.fillStyle = '#00FF00';
            var x = canvas_point.x(hand.palmPosition[0]);
            var y = h - canvas_point.y(hand.palmPosition[1]);
            if (hand.type === 'right') {
                ctx.fillRect(x, y, 50, 50);
            } else if (hand.type === 'left') {
                ctx.beginPath();
                ctx.arc(x, y, 25, 0, 2*Math.PI);
                ctx.fill();
            }
        }
    });
};
