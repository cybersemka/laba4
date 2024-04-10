"use strict";

let board = null;
let def_state = {
    c: false,
    false: 0b000000000,
    true: 0b000000000
};
let state = {};

function reset_gameboard() {
    state = {};
    Object.assign(state, def_state);

    if (board === null) {
        board = document.getElementById('board');
        for (let step = 0; step < 9; step++) {
            let cell = document.createElement('div');
            cell.className = "cell";
            cell.textContent = '';
            cell.setAttribute("data-num", step);
            cell.addEventListener('click', cellClick);

            board.append(cell);
        }
    }

    board.querySelectorAll('.cell').forEach((cell) => {
        cell.textContent = '';
    });
}

function cellClick(event) {
    const cell = event.target;

    if (cell.textContent !== "") {
        return;
    }
    cell.textContent = {false: "X", true: "O"}[state.c];

    state[state.c] |= (1 << cell.dataset.num);
    let p = state[state.c];

    let m_diagonal = 0b100010001;
    let s_diagonal = 0b001010100;
    let is_winner =
        (p & m_diagonal) == m_diagonal
        || (p & s_diagonal) == s_diagonal;

    let row = 0b000000111;
    let column = 0b001001001;
    for (let i = 0; i < 3; i++) {
        is_winner = is_winner || (p & row) == row || (p & column) == column;

        row = row << 3;
        column = column << 1;
    }

    if (is_winner) {
        alert(cell.textContent);
        reset_gameboard();

        return;
    }

    if ((state.true | state.false) == 0b111111111) {
        alert("Draw");
        reset_gameboard();

        return;
    }

    state.c = !state.c;
}

reset_gameboard();

document.getElementById('reset').addEventListener('click', reset_gameboard);