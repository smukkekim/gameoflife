import Gameboard from './Gameboard.js';

const gameboard = new Gameboard(1000, 800);

const automatic = true;

const livePattern = [
    [1,2], [2,2], [3,2],
    
    [15,15], [16,15], [17,15],
    [14,16], [15,16], [16,16],

    [50,50], [51,50],
    [51,50], [51,51],
    [52,52], [53,52],
    [53,52], [53,53]
]

gameboard.setupGrid(10, undefined, livePattern);

const setState = cell => {
    let liveNeighborCount = gameboard.getLiveNeighborCount(cell);
    if (cell.alive && (liveNeighborCount < 2 || liveNeighborCount > 3)) {
        cell.convict();
    } else if (!cell.alive && liveNeighborCount === 3) {
        cell.pardon();
    }
}

const advanceLifecycle = cell => {
    cell.advance();
}

const stepForward = () => {
    gameboard.cycleGrid(setState);
    gameboard.cycleGrid(advanceLifecycle);
    gameboard.drawGrid();
};

const addAdvanceButton = () => {
    var advanceButton = document.createElement('button');
    advanceButton.type = 'button';
    advanceButton.id = 'advanceButton';
    document.querySelector('body').appendChild(advanceButton);
    advanceButton.addEventListener('click', stepForward);
}

const animate = () => {
    stepForward();
    window.requestAnimationFrame(animate);
}

if (automatic) {
    //const timer = setInterval(stepForward, 100);
    window.requestAnimationFrame(animate);
} else {
    addAdvanceButton();
}

