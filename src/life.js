const board = document.querySelector('.board');
const startButton = document.querySelector('button#startButton');
const stopButton = document.querySelector('button#stopButton');
const clearButton = document.querySelector('button#clearButton');
const status = document.querySelector('span#status');

let cells = [];
const rows = 20;
const columns = 30;

function createCells() {
  for (let i = 0; i < rows; i++) {
    cells[i] = []
    for (let j = 0; j < columns; j++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.dataset.row = i;
      cell.dataset.column = j;
      cell.addEventListener('click', cellClickHandler);
      cells[i].push(cell);
    }
  }
  renderCells(cells);
}

function renderCells(cells) {
  while (board.firstChild) {
    board.removeChild(board.firstChild);
  }
  cells.forEach(row => {
    row.forEach(cell => {
      board.appendChild(cell);
    });
  });
}

function countNeighbors(cell) {
  let count = 0;
  let x = parseInt(cell.dataset.column);
  let y = parseInt(cell.dataset.row);
  const tests = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1]
  ]
  tests.forEach(test => {
    if (cells[y + test[0]] && cells[y + test[0]][x + test[1]] && cells[y + test[0]][x + test[1]].classList.contains('alive')) {
      console.log({ test, cell: cells[y + test[0]][x + test[1]] });
      count++;
    }
  });
  return count;
}

function cellClickHandler(e) {
  this.classList.toggle('alive');
}

function updateCells() {
  let newCells = [];
  cells.forEach(row => {
    let newRow = [];
    row.forEach(cell => {
      let aliveNeighbors = countNeighbors(cell);
      let newCell = cell.cloneNode();
      if (newCell.classList.contains('alive')) {
        if (aliveNeighbors < 2 || aliveNeighbors > 3) {
          newCell.classList.remove('alive');
        }
      } else {
        if (aliveNeighbors === 3) {
          newCell.classList.add('alive');
        }
      }
      newCell.addEventListener('click', cellClickHandler);
      newRow.push(newCell);
    });
    newCells.push(newRow);
  });
  cells = newCells;
  renderCells(cells);
}

createCells();

function setStatusMessage(text, color) {
  status.textContent = text;
  status.style.color = color;
}
startButton.addEventListener('click', () => {
  setStatusMessage('RUNNING', '#40d541');
  window.interval = setInterval(() => {
    updateCells();
  }, 1000 / 4);
});
stopButton.addEventListener('click', () => {
  setStatusMessage('STOPPED', 'red');
  clearInterval(window.interval);
});
clearButton.addEventListener('click', () => {
  setStatusMessage('STOPPED', 'red');
  clearInterval(window.interval);
  cells = [];
  createCells();
});
