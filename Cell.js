export default class Cell {
    constructor(x,y,state) {
        if (state === undefined) { state = Math.random() >= 0.5; }
        this.alive = state;
        this.farpast = undefined;
        this.past = undefined;
        this.future = undefined;
        this.col = x;
        this.row = y;
    }

    getColor() {
        return this.alive ? '#fd0' : this.past ? '#f80' : this.farpast ? '#800' : null;
    }

    kill() {
        this.alive = false;
    }

    resurrect() {
        this.alive = true;
    }

    convict() {
        this.future = false;
    }

    pardon() {
        this.future = true;
    }

    advance() {
        this.farpast = this.past;
        this.past = this.alive;
        this.alive = this.future === undefined ? this.alive : this.future;
        this.future = undefined;
    }
}
