/**
 * 
 *  Document     : axis.js
 *  Created on   : 20 Jun, 2016, 4:40:25 PM
 *  Author       : Pabitra K Jana
 *  Organization : IIT Kharagpur
 *  
 */


function drawAxis() {
    var ch = DBScene.canvas.height;
    var cw = DBScene.canvas.width;
    DBScene.context.beginPath();
    DBScene.context.moveTo(0, (ch / 2) + 0.5);
    DBScene.context.lineTo(cw + 0.5, (ch / 2) + 0.5);

    DBScene.context.moveTo((cw / 2) + 0.5, 0);
    DBScene.context.lineTo((cw / 2) + 0.5, ch + 0.7);
    DBScene.context.closePath();

    DBScene.context.strokeStyle = "#ff0000";
    DBScene.context.stroke();

}
var axisGenerator = function () {
    var ch = DBScene.canvas.height;
    var cw = DBScene.canvas.width;
    DBScene.context.moveTo(-cw / 2, 0);
    DBScene.context.lineTo(cw / 2, 0); //X axis
    DBScene.context.moveTo(0, -cw / 2);
    DBScene.context.lineTo(0, cw / 2); //Y axis
//    g.drawOval(-10, -10, 20, 20);
//    g.drawString("(" + 0 + "," + 0 + ")", 20, 20);
}
function drawGrid() {
    var ch = DBScene.canvas.height;
    var cw = DBScene.canvas.width;
    DBScene.context.strokeStyle = "#0000ff";
//    context.lineWidth = 0.5;

    //context.beginPath();
    for (var x = 0; x <= cw; x += 40) {
        DBScene.context.beginPath();
//        context.moveTo(x, 0);
//        context.lineTo(x, ch);
        DBScene.context.moveTo(x + 0.5, 0);
        DBScene.context.lineTo(x + 0.5, ch);
        DBScene.context.stroke();
    }
    for (var y = 0; y <= ch; y += 40) {
        DBScene.context.beginPath();
//        context.moveTo(0, y);
//        context.lineTo(cw, y);
        DBScene.context.moveTo(0, y + 0.5);
        DBScene.context.lineTo(cw, y + 0.5);
        DBScene.context.stroke();
    }
    DBScene.context.closePath();
}