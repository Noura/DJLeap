var canvas_w = 800;
var canvas_h = 500;
var hand_y_min = 0;
var hand_y_max = 600;
var hand_x_min = -300;
var hand_x_max = 300;

function setup() {
    createCanvas(800, 500);
    strokeWeight(0);
    background(0);
}

function draw() {
    background(0);
    fill(255);
    rect(canvas_x(hand.x), canvas_y(hand.y), 50, 50);
}

function canvas_x(hand_x) {
    return map(hand_x, hand_x_min, hand_x_max, 0, canvas_w);
}

function canvas_y(hand_y) {
    return map(hand_y, hand_y_min, hand_y_max, canvas_h, 0);
}
