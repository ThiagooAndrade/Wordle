import palavrasSecretas from "./palavrasSecretas.js";

const state = {
    secret: palavrasSecretas[
        Math.floor(Math.random() * palavrasSecretas.length)
    ],
    grid: Array(6)
        .fill()
        .map(() => Array(5).fill("")),
    currentRow: 0,
    currentCol: 0,
};

function updateGrid() {
    for (let line = 0; line < state.grid.length; line++) {
        for (let column = 0; column < state.grid[line].length; column++) {
            const box = document.getElementById(`box${line}${column}`);
            box.textContent = state.grid[line][column];
        }
    }
}

function drawBox(container, row, col, letter = "") {
    const box = document.createElement("div");
    box.className = "box";
    box.id = `box${row}${col}`;
    box.textContent = letter;

    container.appendChild(box);
    return box;
}

function drawGrid(container) {
    const grid = document.createElement("div");
    grid.className = "grid";

    for (let line = 0; line < 6; line++) {
        for (let column = 0; column < 5; column++) {
            drawBox(grid, line, column);
        }
    }

    container.appendChild(grid);
}

function getCurrentWord() {
    return state.grid[state.currentRow].reduce((prev, curr) => prev + curr);
}

function registerKeyboardClicksEvents() {
    document.addEventListener("click", (event) => {
        const element = event.target;
        if (element.classList.contains("button-enter")) {
            if (state.currentCol === 5) {
                const word = getCurrentWord();
                console.log(word);
                if (isWordValid(word)) {
                    revealWord(word);
                    state.currentRow++;
                    state.currentCol = 0;
                } else {
                    alert("Essa palavra não é válida");
                }
                updateGrid();
            }
            return;
        }
        if (
            element.classList.contains("button-erase") ||
            element.classList.contains("erase")
        ) {
            removeLetter();
            updateGrid();
            return;
        }

        if (element.classList.contains("button")) {
            const elementValue = element.textContent.toLowerCase();
            if (isLetter(elementValue)) {
                console.log(elementValue);
                addLetter(elementValue);
            }
            updateGrid();
        }
    });
}

function registerKeyboardEvents() {
    document.body.onkeydown = (event) => {
        let key = event.key;

        if (key === "Enter") {
            if (state.currentCol === 5) {
                const word = getCurrentWord();
                if (isWordValid(word)) {
                    revealWord(word);
                    state.currentRow++;
                    state.currentCol = 0;
                } else {
                    alert("Essa palavra não é válida");
                }
            }
        }
        if (key === "Backspace") {
            removeLetter();
        }
        if (isLetter(key)) {
            key = event.key.toLowerCase();
            addLetter(key);
        }

        updateGrid();
    };
}

function isWordValid(word) {
    let repeats = 0;
    const arrWord = word.split("");

    for (let letter = 0; letter < 6; letter++) {
        for (let index = letter + 1; index < 6; index++) {
            if (arrWord[letter] == arrWord[index]) {
                repeats++;
            }
        }
        if (repeats >= 2) {
            return false;
        }
        repeats = 0;
    }
    return true;
}

function revealWord(guess) {
    const row = state.currentRow;
    const animation_duration = 500;
    for (let index = 0; index < 5; index++) {
        const box = document.getElementById(`box${row}${index}`);
        const letter = box.textContent;

        setTimeout(() => {
            if (letter === state.secret[index]) {
                box.classList.add("right");
            } else if (state.secret.includes(letter)) {
                box.classList.add("wrong");
            } else {
                box.classList.add("empty");
            }
        }, ((index + 1) * animation_duration) / 2);

        box.classList.add("animated");
        box.style.animationDelay = `${(index * animation_duration) / 2}ms`;
    }

    const isWinner = state.secret === guess;
    const isGameOver = state.currentRow === 5;

    setTimeout(() => {
        if (isWinner) {
            alert("Congratulations!");
        } else if (isGameOver) {
            alert(`Better luck next time! the word was ${state.secret}`);
        }
    }, 3 * animation_duration);
}

function isLetter(key) {
    return key.length === 1 && key.match(/[a-z]/i);
}

function addLetter(letter) {
    if (state.currentCol === 5) return;
    state.grid[state.currentRow][state.currentCol] = letter;
    state.currentCol++;
}

function removeLetter() {
    if (state.currentCol === 0) return;
    state.grid[state.currentRow][state.currentCol - 1] = "";
    state.currentCol--;
}

function startup() {
    const game = document.getElementById("game");
    drawGrid(game);
    registerKeyboardEvents();
    registerKeyboardClicksEvents();
}

startup();
