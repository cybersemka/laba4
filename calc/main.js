"use strict";

let screenElement = null;

function priority(operation) {
    if (operation == '+' || operation == '-') {
        return 1;
    } else {
        return 2;
    }
}


function isNumeric(str) {
    return /^\d+(.\d+){0,1}$/.test(str);
}


function isDigit(str) {
    return /^\d{1}$/.test(str);
}


function isOperation(str) {
    return /^[\+\-\*\/]{1}$/.test(str);
}


function tokenize(str) {
    let tokens = [];
    let lastNumber = '';
    for (let char of str) {
        if (isDigit(char) || char == '.') {
            lastNumber += char;
        } else {
            if (lastNumber.length > 0) {
                tokens.push(lastNumber);
                lastNumber = '';
            }
        } 
        if (isOperation(char) || char == '(' || char == ')') {
            tokens.push(char);
        } 
    }
    if (lastNumber.length > 0) {
        tokens.push(lastNumber);
    }
    return tokens;
}


function compile(str) {
    let out = [];
    let stack = [];
    for (let token of tokenize(str)) {
        if (isNumeric(token)) {
            out.push(token);
        } else if (isOperation(token)) {
            while (stack.length > 0 && 
                   isOperation(stack[stack.length - 1]) && 
                   priority(stack[stack.length - 1]) >= priority(token)) {
                out.push(stack.pop());
            }
            stack.push(token);
        } else if (token == '(') {
            stack.push(token);
        } else if (token == ')') {
            while (stack.length > 0 && stack[stack.length - 1] != '(') {
                out.push(stack.pop());
            }
            stack.pop();
        }
    }
    while (stack.length > 0) {
        out.push(stack.pop());
    }
    return out.join(' ');
}


function evaluate(str) {
    console.log(str);

    let elements = String(str).split(' ');

    let stack = [];
    let l1, l2;
    for (let char of elements) {
        console.log(stack, char);
        if (['+', '-', '*', '/'].includes(char)) {
            if (stack.length < 2) {
                console.log('Evaluation error. Stack is too small');
                
                return "NaN";
            }
            l2 = stack.pop();
            l1 = stack.pop();
        } else {
            char = parseFloat(char);
        }

        switch (char) {
        case '+':
            char = l1 + l2;
            break;
        case '-':
            char = l1 - l2;
            break;
        case '*':
            char = l1 * l2;
            break;
        case '/':
            char = l1 / l2;
            break;
        }
        stack.push(char);
    };

    return stack.pop().toFixed(2);
}

function addToScreen(data) {
    screenElement.textContent += data;
}

function textClickHandler(event) {
    addToScreen(event.target.textContent);
}

function resultClickHandler(event) {
    let rpn = compile(screenElement.textContent);

    screenElement.textContent = evaluate(rpn);
}

function clearClickHandler(event) {
    screenElement.textContent = '';
}


window.onload = function () {
    screenElement = document.querySelector('.screen');
    screenElement.textContent = '';

    document.querySelectorAll('.digit').forEach((element) => {
        element.addEventListener('click', textClickHandler);
    });
    document.querySelectorAll('.operation').forEach((element) => {
        element.addEventListener('click', textClickHandler);
    });
    document.querySelectorAll('.bracket').forEach((element) => {
        element.addEventListener('click', textClickHandler);
    });

    document
        .querySelector('.result')
        .addEventListener('click', resultClickHandler);

    document
        .querySelector('.clear')
        .addEventListener('click', clearClickHandler);
};