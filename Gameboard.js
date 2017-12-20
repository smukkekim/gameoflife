import Cell from './Cell.js';

export default class Gameboard {
    constructor (width, height, bgColor = '#000') {
        this.bgColor = bgColor;
        this.width = width;
        this.height = height;

        this.canvas = document.createElement('canvas');
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        let id = 1;
        while (document.getElementById('canvas' + id) !== null) id++;
        this.canvas.id = id;

        this.context = this.canvas.getContext('2d');

        document.querySelector('body').appendChild(this.canvas);

        this.clearCanvas();
    }

    clearCanvas() {
        this.context.fillStyle = this.bgColor;
        this.context.fillRect(0, 0, this.width, this.height);
    }

    setupGrid(resolution, state, liveSpots, deadSpots) {
        this.resolution = resolution;
        this.cols = Math.floor(this.width / this.resolution);
        this.rows = Math.floor(this.height / this.resolution);

        this.grid = new Array(this.cols);
        for (let i = 0; i < this.cols; i++) {
            this.grid[i] = new Array(this.rows);
            for (let j = 0; j < this.rows; j++) {
                this.grid[i][j] = new Cell(i, j, state);
            }
        }

        if (Array.isArray(liveSpots)) {
            liveSpots.forEach(spot => { this.grid[spot[0]][spot[1]].resurrect(); });
        }

        if (Array.isArray(deadSpots)) {
            deadSpots.forEach(spot => this.grid[spot[0]][spot[1]].kill());
        }

        this.drawGrid();
    }

    drawGrid() {
        this.cycleGrid(cell => { 
            this.context.fillStyle = cell.getColor() || this.bgColor;
            this.context.fillRect(cell.col * this.resolution, cell.row * this.resolution, this.resolution, this.resolution);
        });
    }

    cycleGrid(func) {
        this.grid.forEach(row => row.forEach(cell => func(cell)));
    }

    getLiveNeighborCount(cell) {
        let liveCount = 0;
        for (let x = -1; x < 2; x++) {
            const posX = (cell.col + x + this.cols) % this.cols;
            for (let y = -1; y < 2; y++) {
                const posY = (cell.row + y + this.rows) % this.rows;
                if (this.grid[posX][posY].alive) {
                    liveCount++;
                }
            }
        }
        if (cell.alive) {
            liveCount--;
        }
        
        this.context.font = "20px Arial";
        if (cell.alive) {
            this.context.fillStyle = '#080';
        } else {
            this.context.fillStyle = '#f00';
        }
        this.context.fillText(cell.col + 'x' + cell.row + ': ' + liveCount, (cell.col * this.resolution) + 15, (cell.row * this.resolution) + 50);
        return liveCount;
    }

    killCell(x,y) {
        this.grid[x][y].kill();
    }

    resurrectCell(x,y) {
        this.grid[x][y].resurrect();
    }
}