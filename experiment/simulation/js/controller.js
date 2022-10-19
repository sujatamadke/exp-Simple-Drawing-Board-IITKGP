/**
 * 
 *  Document     : controller.js
 *  Created on   : 20 Jun, 2016, 4:45:25 PM
 *  Author       : Pabitra K Jana, Mitrajit Samanta
 *  Organization : IIT Kharagpur
 *  
 */
var drawingMode, drawingItem;
var mouseUpPos, mouseDownPos, tempMouseDownPos;
var gridSize = 50;
var tempObjectList = [];
var finalObjectList = [];
var pointList = [];
// Initialize Simulation on page load
function initializeDrawingBoard() {
    DBScene.init();
    //Tabs Initialize
    $("#tabs").tabs({
        create: function (event, ui) {
            drawingMode = $(this).tabs('option', 'active');
            instruction();
        },
        activate: function (event, ui) {
            drawingMode = $(this).tabs('option', 'active');
            instruction();
        }
    });
    $("#more-tabs-1").tabs({
        create: function (event, ui) {
            drawingItem = $(this).tabs('option', 'active');
            instruction();
        },
        activate: function (event, ui) {
            drawingItem = $(this).tabs('option', 'active');
            instruction();
        }
    });
    $("#more-tabs-2").tabs({
        create: function (event, ui) {
            drawingItem = $(this).tabs('option', 'active');
            instruction();
        },
        activate: function (event, ui) {
            drawingItem = $(this).tabs('option', 'active');
            instruction();
        }
    });
    $("#more-tabs-3").tabs({
        create: function (event, ui) {
            drawingItem = $(this).tabs('option', 'active');
            instruction();
        },
        activate: function (event, ui) {
            drawingItem = $(this).tabs('option', 'active');
            instruction();
        }
    });
    $("#drawing-canvas").mousedown(function (evt) {
        mouseDownPos = getMousePos(this, evt);
    });
    $("#drawing-canvas").mouseup(function (evt) {
        mouseUpPos = getMousePos(this, evt);
        var color = document.getElementById("html5-color-picker").value;
        if (drawingMode === 1 && drawingItem === 0) {
            $("#x-21").val(mouseUpPos.x);
            $("#y-21").val(mouseUpPos.y);
            drawPoint(mouseUpPos, color);
            var obj = {"pos": mouseUpPos, "color": color, "type": "point"};
            tempObjectList.push(obj);
        }
        if (drawingMode === 1 && drawingItem === 1) {
            $("#x1-22").val(mouseDownPos.x);
            $("#y1-22").val(mouseDownPos.y);
            $("#x2-22").val(mouseUpPos.x);
            $("#y2-22").val(mouseUpPos.y);
            $("#length-22").val(lineLength(mouseDownPos, mouseUpPos));
            drawLine(mouseDownPos, mouseUpPos, color);
            var obj = {"pos1": mouseDownPos, "pos2": mouseUpPos, "color": color, "type": "line"};
            tempObjectList.push(obj);
        }
        if (drawingMode === 1 && drawingItem === 2) {
            var radius = lineLength(mouseDownPos, mouseUpPos);
            $("#xcenter-23").val(mouseDownPos.x);
            $("#ycenter-23").val(mouseDownPos.y);
            $("#radius-23").val(radius);
            drawCircle(mouseDownPos, radius, color);
            var obj = {"pos": mouseDownPos, "radius": radius, "color": color, "type": "circle"};
            tempObjectList.push(obj);
        }
        if (drawingMode === 1 && drawingItem === 3) {
            if (!tempMouseDownPos) {
                tempMouseDownPos = mouseDownPos;
            } else {
                var startAngle = Math.atan2(mouseDownPos.y - tempMouseDownPos.y, mouseDownPos.x - tempMouseDownPos.x);
                var endAngle = Math.atan2(mouseUpPos.y - tempMouseDownPos.y, mouseUpPos.x - tempMouseDownPos.x);
                var radius = lineLength(mouseDownPos, tempMouseDownPos);
                if ((-Math.PI < startAngle) && (0.0 > startAngle)) {
                    startAngle = 2 * Math.PI + startAngle;
                }
                if ((-Math.PI < endAngle) && (0.0 > endAngle)) {
                    endAngle = 2 * Math.PI + endAngle;
                }

                var arcextent = endAngle - startAngle;
                var arcType = $('input:radio[name=radio-24]:checked').val();
                var counterClockwise;
                if (arcType === 'smaller') {
                    counterClockwise = true;
                    if ((arcextent > 0.0) && (arcextent > Math.PI)) {
                        endAngle = -(2 * Math.PI - endAngle);
                    }
                    if ((arcextent < 0.0) && (arcextent < -Math.PI)) {
                        startAngle = -(2 * Math.PI - startAngle);
                    }
                }
                if (arcType === 'larger') {
                    counterClockwise = false;
                    if ((arcextent > 0.0) && (arcextent < Math.PI)) {
                        endAngle = -(2 * Math.PI - endAngle);
                    }
                    if ((arcextent < 0.0) && (arcextent > -Math.PI)) {
                        startAngle = -(2 * Math.PI - startAngle);
                    }
                }
                //Set value
                $("#xcenter-24").val(tempMouseDownPos.x);
                $("#ycenter-24").val(tempMouseDownPos.y);
                $("#stang-24").val(startAngle);
                $("#edang-24").val(endAngle);
                $("#radius-24").val(radius);
                drawArc(tempMouseDownPos, radius, startAngle, endAngle, counterClockwise, color);
                var obj = {"pos": tempMouseDownPos, "radius": radius, "sa": startAngle, "ea": endAngle, "cc": counterClockwise, "color": color, "type": "arc"};
                tempObjectList.push(obj);
                tempMouseDownPos = undefined;
            }
        }
    });
    $("#drawing-canvas").mousemove(function (evt) {
        var mousePos = getMousePos(this, evt);
        $("#instruction").text("Mouse Position: [ " + mousePos.x + ',' + mousePos.y + " ]");
    });
    $("#drawing-canvas").mouseout(function (evt) {
        instruction();
    });
    /**
     * Mouse DOMMouseScroll for Firefox and mousewheel for IE9, Chrome, Safari, Opera
     */
    $("#drawing-canvas").bind('mousewheel DOMMouseScroll', function (evt) {
        gridController(evt);
    });
    $("#drawing-canvas").dblclick(function (evt) {
        var color = document.getElementById("html5-color-picker").value;
        var mousePos = getMousePos(this, evt);
        pointList.push(mousePos);
        if (drawingMode === 2 && drawingItem === 0 && pointList.length === 1) {
            var mpos = pointList.pop();
            $("#x-31").val(mpos.x);
            $("#y-31").val(mpos.y);
            drawCircle(mpos, 5, color);
        }
        if (drawingMode === 2 && drawingItem === 1 && pointList.length === 2) {
            var mpos1 = pointList.pop();
            var mpos2 = pointList.pop();
            drawCircle(mpos1, 5, color);
            drawCircle(mpos2, 5, color);
            drawLine(mpos1, mpos2, color);
            $("#x1-32").val(mpos1.x);
            $("#y1-32").val(mpos1.y);
            $("#x2-32").val(mpos2.x);
            $("#y2-32").val(mpos2.y);
            $("#distance-32").val(lineLength(mpos1, mpos2));
        }
        if (drawingMode === 2 && drawingItem === 2 && pointList.length === 3) {
            var mpos3 = pointList.pop();
            var mpos2 = pointList.pop();
            var mpos1 = pointList.pop();
            drawCircle(mpos1, 5, color);
            drawCircle(mpos2, 5, color);
            drawCircle(mpos3, 5, color);
            drawLine(mpos2, mpos3, color);
            $("#xp-33").val(mpos1.x);
            $("#yp-33").val(mpos1.y);
            $("#x1-33").val(mpos2.x);
            $("#y1-33").val(mpos2.y);
            $("#x2-33").val(mpos3.x);
            $("#y2-33").val(mpos3.y);
            $("#distance-33").val(pointLineLenght(mpos1, mpos2, mpos3));
        }
        if (drawingMode === 2 && drawingItem === 3 && pointList.length === 4) {
            var mpos4 = pointList.pop();
            var mpos3 = pointList.pop();
            var mpos2 = pointList.pop();
            var mpos1 = pointList.pop();
            drawCircle(mpos1, 5, color);
            drawCircle(mpos2, 5, color);
            drawCircle(mpos3, 5, color);
            drawCircle(mpos4, 5, color);
            drawLine(mpos1, mpos2, color);
            drawLine(mpos3, mpos4, color);
            var slope1 = Math.atan2(mpos2.y - mpos1.y, mpos2.x - mpos1.x);
            var slope2 = Math.atan2(mpos4.y - mpos3.y, mpos4.x - mpos3.x);
            if ((-Math.PI < slope1) && (0.0 > slope1)) {
                slope1 = 2 * Math.PI + slope1;
            }
            if ((-Math.PI < slope2) && (0.0 > slope2)) {
                slope2 = 2 * Math.PI + slope2;
            }
            var angle = slope2 - slope1;
            angle = Math.abs(angle);
            if (angle > Math.PI / 2) {
                angle = Math.abs(Math.PI - angle);
            }
            var angle_deg = (angle * 180) / Math.PI;
            $("#x1-34").val(mpos1.x);
            $("#y1-34").val(mpos1.y);
            $("#x2-34").val(mpos2.x);
            $("#y2-34").val(mpos2.y);
            $("#x3-34").val(mpos3.x);
            $("#y3-34").val(mpos3.y);
            $("#x4-34").val(mpos4.x);
            $("#y4-34").val(mpos4.y);
            $("#distance-34").val(angle_deg);
        }
    });
    $("#update-canvas").click(function () {
        updateCanvas();
    });
    $("#clear-canvas").click(function () {
        if (confirm("Do you want to destoroy the drawing!")) {
            tempObjectList = [];
            updateCanvas();
        }
    });
    $("#undo-obj").click(function () {
        if (tempObjectList.length > 0) {
            tempObjectList.pop();
        } else {
//            $(this).attr('disabled', 'disabled');
//            $(this).removeAttr('disabled');
            alert("Canvas is cleared!");
        }
        updateCanvas();
    });
    $("#axis").change(function () {
        updateCanvas();
    });
    $("#grid").change(function () {
        updateCanvas();
    });
}




//  action will take place when windo resize
function onWindowResize() {
    console.log(Date() + " resize")
}
if (window.addEventListener) {
    window.addEventListener('load', initializeDrawingBoard, false);
    //    window.addEventListener('resize', onWindowResize, false);
} else if (window.attachEvent) {
    window.attachEvent('onload', initializeDrawingBoard);
} else {
    window.onload = initializeDrawingBoard;
}

var gridController = function (evt) {
    if ($("#grid").is(":checked")) {
        if (gridSize > 4 && gridSize < DBScene.canvas.width / 2) {
            gridSize = gridSize + 10;
        } else {
            gridSize = 50;
        }
//console.log("Grid Scale: " + gridSize);
    }
    updateCanvas();
}

function updateCanvas() {
//    Clear canvas 
    clearCanvas();
//    Draw the object again
    for (var i = 0; i < tempObjectList.length; i++) {
        var obj = tempObjectList[i];
        var type = obj.type;
        if (type === "point") {
            drawPoint(obj.pos, obj.color);
        }
        if (type === "line") {
            drawLine(obj.pos1, obj.pos2, obj.color);
        }
        if (type === "circle") {
            drawCircle(obj.pos, obj.radius, obj.color);
        }
        if (type === "arc") {
            drawArc(obj.pos, obj.radius, obj.sa, obj.ea, obj.cc, obj.color);
        }
    }
    if ($("#axis").is(":checked")) {
        DBScene.drawAxis();
    }
    if ($("#grid").is(":checked")) {
        DBScene.drawGrid(gridSize);
    }
}

function  instruction() {
    var instructionmsg = null;
    if (drawingMode === 0 && drawingItem === 0) {
        instructionmsg = "Draw Point by entering data";
    }
    if (drawingMode === 0 && drawingItem === 1) {
        instructionmsg = "Draw Line by entering data";
    }
    if (drawingMode === 0 && drawingItem === 2) {
        instructionmsg = "Draw Circle by entering data";
    }
    if (drawingMode === 0 && drawingItem === 3) {
        instructionmsg = "Draw Arc by entering data";
    }
    if (drawingMode === 1 && drawingItem === 0) {
        instructionmsg = "Draw point by single click on canvas";
    }
    if (drawingMode === 1 && drawingItem === 1) {
        instructionmsg = "Drag and draw line on canvas";
    }
    if (drawingMode === 1 && drawingItem === 2) {
        instructionmsg = "Drag and draw circle on canvas";
    }
    if (drawingMode === 1 && drawingItem === 3) {
        instructionmsg = "Single click on canvas then left mouse press and drag then release mouse button";
    }
    if (drawingMode === 2 && drawingItem === 0) {
        instructionmsg = "Measure a point by single clicking on canvas";
    }
    if (drawingMode === 2 && drawingItem === 1) {
        instructionmsg = "Measure a line by double clicking on canvas two times in different places";
    }
    if (drawingMode === 2 && drawingItem === 2) {
        instructionmsg = "Measure a distance of a line";
    }
    if (drawingMode === 2 && drawingItem === 3) {
        instructionmsg = "Measure a angle";
    }
    $("#instruction").text(instructionmsg);
}


var jQ = jQuery.noConflict();
jQ(document).ready(function () {

//This function will execute when someone will choose mode options from the "DRAW-Line" tabs
    jQ("#mode-12").change(function () {
        var val = jQ(this).val();
        if (val == "tpf") {
            jQ(".psfClass").hide();
            jQ(".tpfClass").show();
        } else if (val == "psf") {
            jQ(".tpfClass").hide();
            jQ(".psfClass").show();
            var var_seg = jQ('input[name=radio-12]:checked', '#form-12').val();
            if (var_seg == "full") {
                jQ("#length-12,.span-12").hide();
            } else {
                jQ("#length-12,.span-12").show();
            }
        } else {
            jQ(".tpfClass,.psfClass").hide();
        }
    });
    jQ(".radio-12").click(function () {
        var val = jQ('input[name=radio-12]:checked', '#form-12').val();
        if (val == "full") {
            jQ("#length-12,.span-12").hide();
        } else {
            jQ("#length-12,.span-12").show();
        }
    });
    /**
     * Draw Point
     * 
     */

    jQ("#draw-point").click(function () {
        var pos = {x: $("#x11").val(), y: $("#y11").val()};
        var color = document.getElementById("html5-color-picker").value;
        drawPoint(pos, color);
        var obj = {"pos": pos, "color": color, "type": "point"};
        tempObjectList.push(obj);
    });
    /**
     * Draw Line
     * Two Point Form
     * Point Slope Form
     */

    jQ("#draw-line").click(function () {
        var lineDrawingMode = $("#mode-12").val();
        var line = $('input:radio[name=radio-12]:checked').val();
        var color = document.getElementById("html5-color-picker").value;
        var dlsegtpfx1, dlsegtpfy1, dlsegtpfx2, dlsegtpfy2;
        var pos1, pos2;
        if (lineDrawingMode === "0") {
            $("#instruction").text("Select draw line mode!");
            return;
        } else if (lineDrawingMode === "tpf") {
            dlsegtpfx1 = $("#x1-12").val();
            dlsegtpfy1 = $("#y1-12").val();
            dlsegtpfx2 = $("#x2-12").val();
            dlsegtpfy2 = $("#y2-12").val();
            if (line === "segment") {
                pos1 = {x: dlsegtpfx1, y: dlsegtpfy1};
                pos2 = {x: dlsegtpfx2, y: dlsegtpfy2};
            }
            if (line === "full") {
                var xmin = -DBScene.canvas.width / 2.0;
                var ymin = (xmin - dlsegtpfx1) * (dlsegtpfy2 - dlsegtpfy1) / (dlsegtpfx2 - dlsegtpfx1) + dlsegtpfy1;
                var xmax = DBScene.canvas.width / 2.0;
                var ymax = (xmax - dlsegtpfx1) * (dlsegtpfy2 - dlsegtpfy1) / (dlsegtpfx2 - dlsegtpfx1) + dlsegtpfy1;
                //console.log("xmin:" + xmin + " ymin " + ymin);
                pos1 = {x: xmin, y: ymin};
                pos2 = {x: xmax, y: ymax};
            }
        } else if (lineDrawingMode === "psf") {
            var dlsegpsfx = $("#x-12").val();
            var dlsegpsfy = $("#y-12").val();
            var theta_deg = $("#theta-12").val();
            var theta_rad = theta_deg * Math.PI / 180;
            //draw full line            
            if (line === "full") {
                var x1 = DBScene.canvas.width / 2.0;
                var y1 = (DBScene.canvas.width / 2.0 - dlsegpsfx) * Math.tan(theta_rad) + dlsegpsfy;
                var x2 = -DBScene.canvas.width / 2.0;
                var y2 = (-DBScene.canvas.width / 2.0 - dlsegpsfx) * Math.tan(theta_rad) + dlsegpsfy;
                pos1 = {x: x1, y: y1};
                pos2 = {x: x2, y: y2};
            }
            if (line === "segment") {
                var psf_length = $("#length-12").val();
                var x2 = psf_length * Math.cos(theta_rad) + dlsegpsfx;
                var y2 = psf_length * Math.sin(theta_rad) + dlsegpsfy;
                pos1 = {x: dlsegpsfx, y: dlsegpsfy};
                pos2 = {x: x2, y: y2};
            }
        }
        drawLine(pos1, pos2, color);
        var obj = {"pos1": pos1, "pos2": pos2, "color": color, "type": "line"};
        tempObjectList.push(obj);
    });

    /**
     * Draw Circle
     * 
     */

    jQ("#draw-circle").click(function () {
        var color = document.getElementById("html5-color-picker").value;
        var centerX = $("#xcenter-13").val();
        var centerY = $("#ycenter-13").val();
        var radius = $("#radius-13").val();
        var pos = {x: centerX, y: centerY};
        drawCircle(pos, radius, color);
        var obj = {"pos": pos, "radius": radius, "color": color, "type": "circle"};
        tempObjectList.push(obj);
    });
    /**
     * Draw Arc
     * 
     */

    jQ("#draw-arc").click(function () {
        var color = document.getElementById("html5-color-picker").value;
        var centerX = $("#xcenter-14").val();
        var centerY = $("#ycenter-14").val();
        var pos = {x: centerX, y: centerY};
        var radius = $("#radius-14").val();
        var startAngle = $("#start-ang-14").val() * Math.PI / 180;
        var endAngle = $("#end-ang-14").val() * Math.PI / 180;
        var counterClockwise = false;
        drawArc(pos, radius, startAngle, endAngle, counterClockwise, color);
        var obj = {"pos": pos, "radius": radius, "sa": startAngle, "ea": endAngle, "cc": counterClockwise, "color": color, "type": "arc"};
        tempObjectList.push(obj);
    });
    /** 
     * The event handler for the download image button onclick event. 
     */
    jQ("#download-image").click(function () {
        updateCanvas();
        //downloadCanvas(this, 'canvas', 'test.png');
        downloadCanvas();
    });
});


