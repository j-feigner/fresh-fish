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

    var game_grid = new CanvasGrid(canvas, 10, 10, 2);
    game_grid.start();

    tileSelect();

    canvas.addEventListener("click", event => {
        var mouse_x = event.offsetX;
        var mouse_y = event.offsetY;

        game_grid.cells.forEach(cell => {
            if(isInBounds(mouse_x, mouse_y, cell.rect)) {
                cell.draw(current_tile_color);
                cell.is_developed = true;
            }
        })


    })

    var stopper = 0;
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

function CanvasGrid(canvas, rows, columns, line_width) {
    this.ctx = canvas.getContext("2d");

    this.rect = {
        x: line_width / 2,
        y: line_width / 2,
        width: canvas.width - line_width,
        height: canvas.height - line_width
    }

    this.rows = rows;
    this.columns = columns;

    this.cells = [];

    this.createCells = function() {
        var row_height = this.rect.height / this.rows;
        var column_width = this.rect.width / this.columns;

        for(var i = 0; i < rows; i++) {
            for(var j = 0; j < columns; j++) {
                var cell_rect = {
                    x: this.rect.x + (j * column_width),
                    y: this.rect.y + (i * row_height),
                    width: column_width,
                    height: row_height
                }
                this.cells.push(new CanvasGridCell(canvas, cell_rect, line_width));
            }
        }
    }

    this.drawCells = function() {
        this.cells.forEach(cell => cell.draw());
    }

    this.events = function() {
        canvas.addEventListener("click", event => {
            var mouse_x = event.offsetX;
            var mouse_y = event.offsetY;

            this.cells.forEach(cell => {
                if(isInBounds(mouse_x, mouse_y, cell.rect)) {
                    cell.draw(current_tile_color);
                }
            })
        })
    }

    this.expropriation = function() {
        this.cells.forEach(cell => {
            if(!cell.is_developed) {
                
            }
        })
    }

    this.start = function() {
        this.createCells();
        this.drawCells("gray");
        this.events();
    }
}

function CanvasGridCell(canvas, rect, line_width) {
    this.ctx = canvas.getContext("2d");

    this.is_developed = false;

    this.rect = {
        x: rect.x,
        y: rect.y,
        width: rect.width,
        height: rect.height
    }

    this.line_width = line_width;

    this.draw = function(fill_color) {
        this.ctx.lineWidth = this.line_width;
        this.ctx.strokeStyle = "black";
        this.ctx.fillStyle = fill_color;

        this.ctx.beginPath();
        this.ctx.rect(this.rect.x, this.rect.y, this.rect.width, this.rect.height);
        this.ctx.fill();
        this.ctx.stroke();
        this.ctx.closePath();
    }
}

// Checks if x,y pair falls within bounds of rect object
// Expects rect = {x: , y: , width: , height: };
function isInBounds(x, y, rect) {
    var x_lower = rect.x
    var x_upper = rect.x + rect.width;
    var y_lower = rect.y;
    var y_upper = rect.y + rect.height;
    if(x > x_lower && x < x_upper && y > y_lower && y < y_upper) {
        return true;
    } else {
        return false;
    }
}

function tileSelect() {
    var tile_select = document.querySelector(".tile-select");

    var red = tile_select.querySelector(".tile-color#red");
    var green = tile_select.querySelector(".tile-color#green");
    var blue = tile_select.querySelector(".tile-color#blue");
    var yellow = tile_select.querySelector(".tile-color#yellow");

    red.addEventListener("click", () => {
        current_tile_color = "red";
    })
    green.addEventListener("click", () => {
        current_tile_color = "green";
    })
    blue.addEventListener("click", () => {
        current_tile_color = "blue";
    })
    yellow.addEventListener("click", () => {
        current_tile_color = "yellow";
    })
}