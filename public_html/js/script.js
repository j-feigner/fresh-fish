window.onload = main;

function main() {
    var canvas = document.getElementById("game");
    var ctx = canvas.getContext("2d");

    ctx.fillStyle = "rgb(120, 120, 120)";
    ctx.fillRect(0, 0, 800, 800);
}