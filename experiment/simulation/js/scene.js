/**
 * 
 *  Document     : scene.js
 *  Created on   : 20 Jun, 2016, 4:47:25 PM
 *  Author       : Pabitra K Jana
 *  Organization : IIT Kharagpur
 *  
 */
var pos1, pos2;
var color;
var DBScene = {
    container: null,
    canvas: null,
    context: null,
    CONTAINER_WIDTH: null,
    CONTAINER_HEIGHT: null,
    init: function () {
        this.container = document.getElementById("canvas2d-view");
        this.CONTAINER_WIDTH = this.container.offsetWidth;
        this.CONTAINER_HEIGHT = this.container.offsetHeight;

        this.canvas = document.createElement("canvas");
        this.context = this.canvas.getContext("2d");

        this.canvas.setAttribute('width', this.CONTAINER_WIDTH);
        this.canvas.setAttribute('height', this.CONTAINER_HEIGHT);
        this.canvas.setAttribute('id', 'drawing-canvas');
        this.container.appendChild(this.canvas);

        this.canvas.oncontextmenu = function (e) {
            e.preventDefault();
            return false;
        }
        this.context.translate(this.canvas.width / 2, this.canvas.height / 2);

        this.context.scale(1, -1);

        color = document.getElementById("html5-color-picker").value;
    },
    drawAxis: function () {

        //this.context.lineWidth = 0.5;

        this.context.beginPath();
//        For X-Axis
        this.context.moveTo(-(this.canvas.width / 2.0) + 0.5, 0 + 0.5);
        this.context.lineTo((this.canvas.width / 2.0) + 0.7, 0 + 0.5);
//        For Y - Axis
        this.context.moveTo(0 + 0.5, (this.canvas.width / 2.0) + 0.5);
        this.context.lineTo(0 + 0.5, -(this.canvas.width / 2.0) + 0.7);
        this.context.closePath();

        this.context.strokeStyle = "#00f";
        this.context.stroke();

    },
    drawGrid: function (gridSize) {       

        //this.context.lineWidth = 0.5;
        this.context.beginPath();

        for (var x = -this.canvas.width / 2; x < this.canvas.width / 2; x += gridSize) {
            this.context.moveTo(x + 0.5, this.canvas.height / 2 + 0.5);
            this.context.lineTo(x + 0.5, -this.canvas.height / 2 + 0.5);
        }

        for (var y = this.canvas.height / 2; y > -this.canvas.height / 2; y -= gridSize) {
            this.context.moveTo(-this.canvas.width / 2 + 0.5, y + 0.5);
            this.context.lineTo(this.canvas.width / 2 + 0.5, y + 0.5);
        }
        this.context.closePath();

        this.context.strokeStyle = "#000";
        this.context.stroke();
    }

};

var getMousePos = function (canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left - canvas.width / 2,
        y: canvas.height / 2 - (evt.clientY - rect.top)
    };
};
var drawPoint = function (pos, color) {
    var radius = 3;
    DBScene.context.fillStyle = color;
    DBScene.context.strokeStyle = color;
    DBScene.context.beginPath();
    DBScene.context.arc(pos.x, pos.y, radius, 0, 2 * Math.PI);
    DBScene.context.closePath();
    DBScene.context.fill();
    DBScene.context.stroke();
};
var drawLine = function (pos1, pos2, color) {
    DBScene.context.strokeStyle = color;
    DBScene.context.beginPath();
    DBScene.context.moveTo(pos1.x, pos1.y);
    DBScene.context.lineTo(pos2.x, pos2.y);
    DBScene.context.stroke();
};
var drawCircle = function (pos, radius, color) {
    DBScene.context.strokeStyle = color;
    DBScene.context.beginPath();
    DBScene.context.arc(pos.x, pos.y, radius, 0, 2 * Math.PI, false);
    DBScene.context.stroke();
};
/**
 * 
 * @param {type} pos
 * @param {type} radius
 * @param {type} startAngle
 * @param {type} endAngle
 * @param {type} counterClockwise
 * @param {type} color
 * @returns {undefined}
 */
var drawArc = function (pos, radius, startAngle, endAngle, counterClockwise, color) {
    DBScene.context.strokeStyle = color;
    DBScene.context.beginPath();
    DBScene.context.arc(pos.x, pos.y, radius, startAngle, endAngle, counterClockwise);
    DBScene.context.stroke();
};

/**
 * Clears the canvas
 * 
 * @param {type} canvas
 * @returns {undefined}
 */

var clearCanvas = function () {
//    DBScene.context.clearRect(0, 0, canvas.width, canvas.height);
    DBScene.context.clearRect(-DBScene.canvas.width / 2, DBScene.canvas.height / 2, DBScene.canvas.width, -DBScene.canvas.height);
};

/**
 * 
 * This function will take care of image extracting and
 * setting proper filename for the download dhen you click on a link.
 * parameter link reference of anchore<a> tag
 * 
 * @param {type} link
 * @param {type} filename 
 * @returns {undefined}
 */

var downloadCanvas = function (link, filename) {
    link.href = DBScene.canvas.toDataURL();
    link.download = filename;
};
/**
 * 
 * @returns {undefined}
 */
var downloadCanvas = function () {
    // save canvas image as data url (png format by default)
    var dataURL = DBScene.canvas.toDataURL();
    var win = window.open(dataURL, '_blank');
    win.focus();
};
/**
 * 
 * @param {type} point1
 * @param {type} point2
 * @returns {Number}
 */
var lineLength = function (point1, point2) {
    var xs = 0;
    var ys = 0;

    xs = point2.x - point1.x;
    xs = xs * xs;

    ys = point2.y - point1.y;
    ys = ys * ys;

    return Math.sqrt(xs + ys);
};
/**
 * If the line passes through two points point2=(x1,y1) and 
 * point3=(x2,y2) then the distance of point1=(x0,y0) from the line is
 * https://en.wikipedia.org/wiki/Distance_from_a_point_to_a_line
 * @param {type} point1 
 * @param {type} point2
 * @param {type} point3
 * @returns {undefined}
 */
var pointLineLenght = function (point1, point2, point3) {
    var len = lineLength(point2, point3);
    if (len === 0)
        return lineLength(point1, point2);
    return  Math.abs((point3.y - point2.y) * point1.x - (point3.x - point2.x) * point1.y + point3.x * point2.y - point3.y * point2.x) / len;
};
