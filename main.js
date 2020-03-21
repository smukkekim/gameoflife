import Gameboard from './Gameboard.js';
import ColorSchemeHandler from './ColorSchemeHandler.js';

async function main() {
  const gameboard = new Gameboard(1000, 800);

  const state = {
    automatic: false,
  };

  const livePattern = [
    [1, 2],
    [2, 2],
    [3, 2],

    [15, 15],
    [16, 15],
    [17, 15],
    [14, 16],
    [15, 16],
    [16, 16],

    [50, 50],
    [51, 50],
    [51, 50],
    [51, 51],
    [52, 52],
    [53, 52],
    [53, 52],
    [53, 53],
  ];

  const setState = cell => {
    const liveNeighborCount = gameboard.getLiveNeighborCount(cell);
    if (cell.alive && (liveNeighborCount < 2 || liveNeighborCount > 3)) {
      cell.convict();
    } else if (!cell.alive && liveNeighborCount === 3) {
      cell.pardon();
    }
  };

  const advanceLifecycle = cell => {
    cell.advance();
  };

  const stepForward = () => {
    gameboard.cycleGrid(setState);
    gameboard.cycleGrid(advanceLifecycle);
    gameboard.drawGrid();
  };

  const animate = () => {
    stepForward();
    if (state.automatic) window.requestAnimationFrame(animate);
  };

  const addRunButton = () => {
    const runButton = document.createElement('button');
    runButton.type = 'button';
    runButton.classList.add('game-button', 'advance-button');
    runButton.textContent = 'Run';
    runButton.addEventListener('click', () => {
      state.automatic = !state.automatic;
      if (state.automatic) animate();
      runButton.textContent = state.automatic ? 'Stop' : 'Run';
    });
    return runButton;
  };

  const addStepButton = () => {
    const stepButton = document.createElement('button');
    stepButton.type = 'button';
    stepButton.classList.add('game-button', 'step-button');
    stepButton.textContent = 'Step';
    stepButton.addEventListener('click', stepForward);
    return stepButton;
  };

  const renderControlCenter = () => {
    let controlBoard = document.createElement('div');
    controlBoard.classList.add('control-center');
    controlBoard.append(addRunButton());
    controlBoard.append(addStepButton());
    document.querySelector('body').prepend(controlBoard);
  };

  renderControlCenter();

  const createSwatch = (name, colors) => {
    const container = document.createElement('div');
    container.dataset.name = name;
    container.classList.add('color-swatch');
    container.style.background = colors.board;

    const aliveColor = document.createElement('div');
    aliveColor.classList.add('color-swatch-part', 'alive');
    aliveColor.style.background = colors.alive;
    container.append(aliveColor);

    const rottingColor = document.createElement('div');
    rottingColor.classList.add('color-swatch-part', 'rotting');
    rottingColor.style.background = colors.rotting;
    container.append(rottingColor);

    const dustColor = document.createElement('div');
    dustColor.classList.add('color-swatch-part', 'dust');
    dustColor.style.background = colors.dust;
    container.append(dustColor);

    container.addEventListener('click', () => {
      gameboard.setColorScheme(colors);
    });

    return container;
  };

  const renderColorSelector = async () => {
    const colors = new ColorSchemeHandler();
    await colors.loadSchemes();
    const selector = document.createElement('div');
    selector.classList.add('color-selector');
    Object.keys(colors.schemes).forEach(name => {
      selector.append(createSwatch(name, colors.schemes[name]));
    });

    document.querySelector('body').append(selector);
  };

  await renderColorSelector();

  gameboard.setupGrid(10, undefined, livePattern);
}

main();
