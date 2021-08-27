window.onload = main;

function main() {
    var game = new FreshFish();
    game.start();

    tileSelect();

    DFS(game.game_grid);

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

function FreshFish() {
    this.canvas = document.getElementById("game");
    this.ctx = this.canvas.getContext("2d");

    this.game_grid;

    this.checkBuildings = function() {
        this.game_grid.cells.forEach(cell => {
            if(cell.type === "building") {
                var available_adj = 0;
    
                cell.adjacencies.forEach(adj_cell => {
                    if(!adj_cell.is_developed) {
                        available_adj++;
                    }
                })
    
                if(available_adj === 1) {
                    cell.adjacencies.forEach(adj_cell => {
                        if(!adj_cell.is_developed) {
                            adj_cell.draw("black", "brown");
                            adj_cell.type = "road";
                        }
                    })
                }
            }
        })
    }

    this.expropriation = function() {
        this.game_grid.forEach(cell => {
            // If cell is not developed and is not a road
            if(!cell.is_developed && cell.type != "road") {
                // Assume this cell was developed 
                cell.is_developed = true;

                // Check if all other undeveloped cells are connected
                this.game_grid.forEach(cell => {

                })

                // If false, revert cell to undeveloped and set as road

                // If true, revert cell and check recursively for all other undeveloped cells
            }
        })
    }

    this.setEvents = function() {
        this.canvas.addEventListener("click", event => {
            var mouse_x = event.offsetX;
            var mouse_y = event.offsetY;
    
            this.game_grid.cells.forEach((cell, index) => {
                if(pointInRect(mouse_x, mouse_y, cell.rect)) {
                    cell.draw("black", current_tile_color);
                    cell.type = "building";
                    cell.is_developed = true;
                    cell.adjacencies.forEach(adj => {
                        var index = adj.adjacencies.indexOf(cell);
                        if(index != -1) {
                            adj.adjacencies.splice(index, 1);
                        }
                    })
                    this.game_grid.cells.splice(index, 1);
                    DFS(this.game_grid);
                    //this.checkBuildings(this.game_grid);
                    //this.expropriation();
                }
            })
        })
    }

    this.setCanvasScale = function(width, height) {
        this.canvas.width = width;
        this.canvas.height = height;
    }

    this.start = function() {
        this.setCanvasScale(900, 900);
        this.game_grid = new CanvasGrid(this.canvas, 10, 10, 8);
        this.game_grid.start();
        this.setEvents();
    }
}

function CanvasGrid(canvas, rows, columns, line_width) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext("2d");

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

        // Create array of GridCell objects
        for(var i = 0; i < rows; i++) {
            for(var j = 0; j < columns; j++) {
                var cell_rect = {
                    x: this.rect.x + (j * column_width),
                    y: this.rect.y + (i * row_height),
                    width: column_width,
                    height: row_height
                }
                var new_cell = new CanvasGridCell(canvas, cell_rect, line_width);
                new_cell.id = (i * this.rows) + j;
                this.cells.push(new_cell);
            }
        }
    }

    this.createCellConnections = function() {
        // Set adjecency relationships for all cells
        // This effectively turns the grid into an undirected graph
        this.cells.forEach((cell, index) => {
            // If cell isn't in the top row, set up adjacency
            if(!(index < this.columns)) {
                cell.adjacencies.push(this.cells[index - this.columns]);
            }
            // If cell isn't in the rightmost column, set right adjecency
            if(!(index % this.columns === this.columns - 1)) {
                cell.adjacencies.push(this.cells[index + 1]);
            }
            // If cell isn't in the bottom row, set down adjacency
            if(!(index >= (this.columns * (this.rows - 1)))) {
                cell.adjacencies.push(this.cells[index + this.columns]);
            }
            // If cell isn't in the leftmost column, set left adjecency
            if(!(index % this.columns === 0)) {
                cell.adjacencies.push(this.cells[index - 1]);
            }
        })
    }

    this.drawCells = function() {
        this.cells.forEach(cell => {
            cell.draw("black", "gray");
        });
    }

    // Displays adjacency relationships between cells
    this.drawCellConnections = function() {
        this.ctx.strokeStyle = "red";

        this.cells.forEach(cell => {
            cell.adjacencies.forEach(adj_cell => {
                this.ctx.beginPath();
                this.ctx.moveTo(cell.center_point.x, cell.center_point.y);
                this.ctx.lineTo(adj_cell.center_point.x, adj_cell.center_point.y);
                this.ctx.stroke();
                this.ctx.closePath();
            })
        })
    }

    this.DFS = function() {

    }

    this.start = function() {
        this.createCells();
        this.createCellConnections();
        this.drawCells();
        //this.drawCellConnections();
    }
}

function CanvasGridCell(canvas, rect, line_width) {
    this.ctx = canvas.getContext("2d");

    this.id = null;
    this.adjacencies = [];

    this.type = null;
    this.is_developed = false;

    this.rect = {
        x: rect.x,
        y: rect.y,
        width: rect.width,
        height: rect.height
    }

    this.center_point = {
        x: this.rect.x + (this.rect.width / 2),
        y: this.rect.y + (this.rect.height / 2)
    }

    this.line_width = line_width;

    this.draw = function(stroke_color, fill_color) {
        this.ctx.lineWidth = this.line_width;
        this.ctx.strokeStyle = stroke_color;
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
function pointInRect(x, y, rect) {
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

function DFS(graph) {
    var disc = new Array(graph.cells.length);
    var low = new Array(graph.cells.length);
    var parent = new Array(graph.cells.length);
    var visited = new Array(graph.cells.length).fill(false);
    var articulation_points = new Array(graph.cells.length).fill(false);

    DFSRecursiveHelper.time = 0;
    DFSRecursiveHelper(graph.cells, 0, disc, low, visited, parent, articulation_points);

    articulation_points.forEach((ap, index) => {
        if(ap) {
            graph.cells[index].draw("black", "white");
        }
    })
}

function DFSRecursiveHelper(vertices, v, disc, low, visited, parent, articulation_points) {
    visited[v] = true;
    disc[v] = DFSRecursiveHelper.time++;
    low[v] = disc[v];
    var children = 0;

    vertices[v].adjacencies.forEach(adj => {                                                    // Search all adjacent vertices of given vertex.
        var u = vertices.indexOf(adj);

        if(!visited[u]) {                                                                   // IF adjacent vertex has NOT been visited:
            children++;
            parent[u] = v;                                                              // Set current vertex as parent of adjacent.
            DFSRecursiveHelper(vertices, u, disc, low, visited, parent, articulation_points);    // Continue search from adjacent.
            low[v] = Math.min(low[v], low[u]);                                      // Set highest back-edge of current vertex to either its current highest back-edge
                                                                                                    // or to a higher back-edge of one of its descendants.
            
                                                                                                    // Articulation Point Check:
            if(v === 0 && children >= 2) {                                                      // Case 1 (current vertex is root): if current vertex has 2 or more children, it is an AP
                articulation_points[v] = true;                                              
            } else if(v != 0 && low[u] >= disc[v]) {                                // Case 2 (current vertex is NOT root): if there are no adjacent vertices that can reach
                articulation_points[v] = true;                                                  // a higher vertex than the current, than it is an AP
            }

        } else if(parent[v] != u) {                                                     // IF adjecent vertex HAS been visited and is NOT the parent of the current vertex:
            low[v] = Math.min(low[v], disc[u]);                                     // Set highest back-edge of current vertex to either its current highest back-edge
                                                                                                    // or to the discovery number of adjacent vertex, whichever is lower.
        }
    })
} 