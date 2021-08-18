window.onload = main;

function main() {
    // Get Canvas and 2D Canvas Rendering Context
    var canvas = document.getElementById("game");
    var ctx = canvas.getContext("2d");

    // Set scale of Canvas
    var width = 900;
    var height = 900;
    canvas.width = width;
    canvas.height = height;

    // Set background color
    ctx.fillStyle = "rgb(120, 120, 120)";
    ctx.fillRect(0, 0, width, height);

    grid(canvas, ctx, 14, 20, 4, "black");
}

function grid(canvas, ctx, rows, columns, line_width, line_color) {
    ctx.strokeStyle = line_color;
    ctx.lineWidth = line_width;

    var width_modified = canvas.width - ctx.lineWidth;
    var height_modified = canvas.height - ctx.lineWidth;
    var padding = ctx.lineWidth / 2;

    for(var i = 0; i <= rows; i++) { // Horizontal lines
        ctx.beginPath();
        ctx.moveTo(padding, (i * height_modified / rows) + padding);
        ctx.lineTo(canvas.width, (i * height_modified / rows) + padding);
        ctx.closePath();

        ctx.stroke();
    }
    for(var i = 0; i <= columns; i++) { // Vertical lines
        ctx.beginPath();
        ctx.moveTo((i * width_modified / columns) + padding, 0);
        ctx.lineTo((i * width_modified / columns) + padding, canvas.height);
        ctx.closePath();

        ctx.stroke();
    }
}