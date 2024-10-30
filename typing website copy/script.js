const textDisplay = document.getElementById('text-display');
const wpmDisplay = document.getElementById('wpm');
const accuracyDisplay = document.getElementById('accuracy');
const submitBtn = document.getElementById('submit-btn');
const timerDisplay = document.getElementById('timer-display');
const resultPage = document.getElementById('result-page');
const resultWpm = document.getElementById('result-wpm');
const resultAccuracy = document.getElementById('result-accuracy');
const resultConsistency = document.getElementById('result-consistency');
const resultCharacters = document.getElementById('result-characters');
const resultTime = document.getElementById('result-time');

let currentTextArray = [];
let typedTextArray = [];
let startTime;
let wordLimit = 30;
let includePunctuation = false;
let includeNumbers = false;
let currentMode = 'normal';
let timer;
let timeRemaining = 60;
let errorCount = 0;

function generateText() {
    const normalTexts = [
        "India’s heritage is a rich tapestry of cultures, languages, and traditions spanning over millennia.",
        "From the architectural marvels like the Taj Mahal...",
    ];
    let words = normalTexts.join(' ').split(' ');
    if (includeNumbers) {
        words = words.concat(Array.from({ length: 10 }, (_, i) => i.toString()));
    }
    if (includePunctuation) {
        const punctuation = ',.!?;:';
        words = words.map(word => word + punctuation[Math.floor(Math.random() * punctuation.length)]);
    }
    words = words.sort(() => Math.random() - 0.5);
    return words.slice(0, wordLimit).join(' ');
}

function updateDisplay() {
    const text = generateText();
    currentTextArray = text.split('');
    textDisplay.innerHTML = currentTextArray.map(char =>
        `<span class="pending">${char}</span>`
    ).join('');
    typedTextArray = [];
    resetTimer();
}

function handleTyping(event) {
    const key = event.key;
    if (key.length > 1 && key !== 'Backspace') return;
    if (key === 'Backspace') {
        typedTextArray.pop();
    } else {
        typedTextArray.push(key);
    }
    checkInput();
}

function checkInput() {
    let correctCount = 0;
    errorCount = 0;
    currentTextArray.forEach((char, index) => {
        const span = textDisplay.querySelectorAll('span')[index];
        const typedChar = typedTextArray[index];
        if (typedChar == null) {
            span.className = 'pending';
        } else if (typedChar === char) {
            span.className = 'correct';
            correctCount++;
        } else {
            span.className = 'incorrect';
            errorCount++;
        }
    });
    const wordsTyped = typedTextArray.join('').trim().split(/\s+/).length;
    const elapsedTime = (Date.now() - startTime) / 1000 / 60;
    const wpm = Math.floor((wordsTyped / elapsedTime) || 0);
    wpmDisplay.textContent = wpm;
    const accuracy = ((correctCount / currentTextArray.length) * 100).toFixed(2);
    accuracyDisplay.textContent = `${accuracy}%`;
}

function resetTimer() {
    clearInterval(timer);
    startTime = Date.now();
    timeRemaining = 60;
    timerDisplay.textContent = timeRemaining;
    timer = setInterval(() => {
        if (timeRemaining <= 0) {
            clearInterval(timer);
            calculateResults();
        } else {
            timeRemaining--;
            timerDisplay.textContent = timeRemaining;
        }
    }, 1000);
}

function calculateResults() {
    const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
    const wpm = parseInt(wpmDisplay.textContent, 10);
    const accuracy = parseFloat(accuracyDisplay.textContent);
    const consistency = Math.floor(((wpm / 60) * 100) || 0);
    const charactersTyped = typedTextArray.length;

    resultWpm.textContent = wpm;
    resultAccuracy.textContent = `${accuracy}%`;
    resultConsistency.textContent = `${consistency}%`;
    resultCharacters.textContent = `${charactersTyped}`;
    resultTime.textContent = `${elapsedSeconds}s`;

    resultPage.style.display = 'block';
}

document.getElementById('punctuation-toggle').addEventListener('click', function() {
    includePunctuation = !includePunctuation;
    this.classList.toggle('active');
    updateDisplay();
});

document.getElementById('numbers-toggle').addEventListener('click', function() {
    includeNumbers = !includeNumbers;
    this.classList.toggle('active');
    updateDisplay();
});

document.querySelectorAll('.word-limit-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        wordLimit = parseInt(this.getAttribute('data-limit'));
        document.querySelectorAll('.word-limit-btn').forEach(button => button.classList.remove('active'));
        this.classList.add('active');
        updateDisplay();
    });
});

document.getElementById('mode-select').addEventListener('change', function() {
    currentMode = this.value;
    updateDisplay();
});

document.addEventListener('keydown', handleTyping);

updateDisplay();
function showResultPage() {
    const wpm = document.getElementById('wpm').textContent;
    const accuracy = document.getElementById('accuracy').textContent;
    // Save results in session storage to display on result page
    sessionStorage.setItem('wpm', wpm);
    sessionStorage.setItem('accuracy', accuracy);
    // Redirect to result page
    window.location.href = 'result.html';
}
