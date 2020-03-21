export default class Cell {
  constructor(x, y, state = Math.random() >= 0.6) {
    this.alive = state;
    this.dust = undefined;
    this.rotting = undefined;
    this.future = undefined;
    this.col = x;
    this.row = y;
    this.colorScheme = {
      alive: '#fd0',
      rotting: '#f80',
      dust: '800',
    };
  }

  getColor() {
    if (this.alive) {
      return this.colorScheme.alive;
    }
    if (this.rotting) {
      return this.colorScheme.rotting;
    }
    if (this.dust) {
      return this.colorScheme.dust;
    }
    return null;
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
    this.dust = this.rotting;
    this.rotting = this.alive;
    this.alive = this.future === undefined ? this.alive : this.future;
    this.future = undefined;
  }
}
