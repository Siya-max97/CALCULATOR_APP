const display = document.getElementById('display');
let expression = ''; // NEW: holds full typed expression
let current = '0';

function updateDisplay() {
  display.textContent = expression || current;
}

function handleNumber(num) {
  if (current === '0' && expression === '') {
    expression = num;
  } else {
    expression += num;
  }
  current = num;
}

function handleOperator(op) {
  const lastChar = expression.slice(-1);
  if (['+', '-', '*', '/'].includes(lastChar)) {
    expression = expression.slice(0, -1) + op;
  } else {
    expression += op;
  }
  current = op;
}

function handleAction(action) {
  switch (action) {
    case 'clear':
      expression = '';
      current = '0';
      break;
    case 'sign':
      // Optional: add sign toggling (a bit complex with full expression view)
      break;
    case 'percent':
      try {
        expression = String(eval(expression + "/100"));
        current = expression;
      } catch {
        expression = 'Error';
      }
      break;
    case '=':
      try {
        expression = String(eval(expression));
        current = expression;
      } catch {
        expression = 'Error';
      }
      break;
  }
}

document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', () => {
    if (btn.hasAttribute('data-number')) {
      handleNumber(btn.dataset.number);
    } else if (btn.hasAttribute('data-action')) {
      const action = btn.dataset.action;
      if (['+', '-', '*', '/'].includes(action)) {
        handleOperator(action);
      } else {
        handleAction(action);
      }
    }
    updateDisplay();
  });
});

document.addEventListener('keydown', e => {
  const keys = '0123456789+-*/.=EnterBackspace';
  if (!keys.includes(e.key)) return;

  if (!isNaN(e.key) || e.key === '.') {
    handleNumber(e.key);
  } else if (['+', '-', '*', '/'].includes(e.key)) {
    handleOperator(e.key);
  } else if (e.key === '=' || e.key === 'Enter') {
    handleAction('=');
  } else if (e.key === 'Backspace') {
    expression = expression.slice(0, -1);
  }

  updateDisplay();
});
const { Expression, Equation } = require('algebra.js');
let equationInput = ''; // New variable to store algebraic expression input

function updateDisplay() {
  display.textContent = current;
}

// Modify handleNumber to support letters like 'x'
function handleInput(char) {
  if (current === '0' || current === previous) {
    current = char;
  } else {
    current += char;
  }
  equationInput = current;
  updateDisplay();
}

function solveForX() {
  try {
    const [lhs, rhs] = equationInput.split('=');
    const expr = algebra.parse(lhs.trim());
    const eq = new algebra.Equation(expr, algebra.parse(rhs.trim()));
    const result = eq.solveFor('x');

    display.textContent = 'x = ' + result.toString();
    current = result.toString();
  } catch (err) {
    display.textContent = 'Invalid equation';
    current = '0';
  }
}
