let secretNumber = Math.trunc(Math.random() * 20) + 1;
let score = 20;
let highScore = 0;

const displayMsg = function(msg) {
    document.querySelector('.message').textContent = msg;
}

const displayScore = function(score) {
    document.querySelector('.score').textContent = score;
}

const displayCorrectNumber = function(number, width, bgColor) {
    document.querySelector('body').style.backgroundColor = bgColor;
    document.querySelector('.number').textContent = number;
    document.querySelector('.number').style.width = width;
}

document.querySelector('.check').addEventListener('click', function () {
    const guess = Number(document.querySelector('.guess').value);

    if (!guess) {
        displayMsg('⛔ No number! ⛔');
    } else if (guess === secretNumber) {
        displayMsg('🎊 Correct number! 🎊');
        displayCorrectNumber(secretNumber, '30rem', '#60b347');
        if (score > highScore) {
            highScore = score;
            document.querySelector('.highscore').textContent = highScore;
        }
    } else if (guess !== secretNumber) {
        if (score > 1) {
            displayMsg(guess > secretNumber ? '⛔ Too high! ⛔' : '⛔ Too low! ⛔');
            score--;
            displayScore(score);
        } else {
            displayMsg('⛔ You lost  ⛔');
            displayScore(0);
        }
    }
})

document.querySelector('.again').addEventListener('click', function () {
    score = 20;
    secretNumber = Math.trunc(Math.random() * 20) + 1;

    displayMsg('Start guessing...');
    displayScore(score);
    displayCorrectNumber('?', '15rem', '#222');
    document.querySelector('.guess').value = '';
})