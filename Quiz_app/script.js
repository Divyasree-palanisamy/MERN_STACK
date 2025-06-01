const questions = [
    {
        question: "What is the main purpose of React?",
        options: ["To style web pages", "To build user interfaces", "To handle databases", "To add animations"],
        answer: "To build user interfaces"
    },
    {
        question: "Which keyword is used to create a component in React?",
        options: ["function", "component", "create", "build"],
        answer: "function"
    },
    {
        question: "What hook is used for state management in functional components?",
        options: ["useRef", "useEffect", "useState", "useContext"],
        answer: "useState"
    },
    {
        question: "What does JSX stand for?",
        options: ["JavaScript Extension", "Java Syntax Expression", "JavaScript XML", "JavaScript Xpath"],
        answer: "JavaScript XML"
    },
    {
        question: "Which method is used to render React content to the DOM?",
        options: ["ReactDOM.render()", "React.render()", "DOM.render()", "render()"],
        answer: "ReactDOM.render()"
    },
    {
        question: "Which hook is used for performing side effects in functional components?",
        options: ["useFetch", "useEffect", "useState", "useReducer"],
        answer: "useEffect"
    },
    {
        question: "How do you pass data from parent to child component in React?",
        options: ["Using hooks", "Using props", "Using state", "Using context"],
        answer: "Using props"
    },
    {
        question: "Which of the following is not a valid React hook?",
        options: ["useFetch", "useEffect", "useRef", "useMemo"],
        answer: "useFetch"
    },
    {
        question: "Which tool is commonly used to create a new React app?",
        options: ["npm init react-app", "create-react-app", "npx create-react-app", "react-start"],
        answer: "npx create-react-app"
    },
    {
        question: "What is the purpose of `key` in a list rendering in React?",
        options: ["To set style", "To improve performance", "To identify each element uniquely", "To bind state"],
        answer: "To identify each element uniquely"
    }
];


let currentQuestion = 0;
let score = 0;
let shuffledQuestions = shuffleArray([...questions]);
let userAnswers = new Array(questions.length).fill(null);
let timeLeft = 60;
let timer;

let highScore = localStorage.getItem("highScore") || 0;

const timerE1 = document.getElementById("timer");
const progressBar = document.getElementById("progressBar");
const questionE1 = document.getElementById("question");
const optionsE1 = document.getElementById("options");
const nextBtn = document.getElementById("nextBtn");
const scoreE1 = document.getElementById("score");
const resetBtn = document.getElementById("resetBtn");
const correctSound = document.getElementById("correctSound");
const wrongSound = document.getElementById("wrongSound");
const completedSound = document.getElementById("completedSound");

function loadQuestion() {
    questionE1.textContent = shuffledQuestions[currentQuestion].question;
    optionsE1.innerHTML = "";

    shuffledQuestions[currentQuestion].options.forEach(optionText => {
        const option = document.createElement('div');
        option.className = 'option';
        option.textContent = optionText;
        option.addEventListener('click', () => selectOption(option, optionText));
        optionsE1.appendChild(option);
    });

    const previousAnswer = userAnswers[currentQuestion];
    if (previousAnswer) {
        const correctAnswer = shuffledQuestions[currentQuestion].answer;
        Array.from(optionsE1.children).forEach(option => {
            option.style.pointerEvents = 'none';
            option.classList.add(option.textContent === correctAnswer ? 'correct' : 'incorrect');
            if (option.textContent === previousAnswer) {
                nextBtn.disabled = false;
            }
        });
    } else {
        nextBtn.disabled = true;
    }

    updateProgressBar();
}

function selectOption(selectedE1, selectedAnswer) {
    const correctAnswer = shuffledQuestions[currentQuestion].answer;
    const prevAnswer = userAnswers[currentQuestion];

    const isCorrect = selectedAnswer === correctAnswer;

    if (prevAnswer === null) {
        if (isCorrect) {
            score++;
            correctSound.play();
        } else {
            wrongSound.play();
        }
    } else {
        const wasCorrect = prevAnswer === correctAnswer;
        if (wasCorrect && !isCorrect) {
            score--;
            wrongSound.play();
        } else if (!wasCorrect && isCorrect) {
            score++;
            correctSound.play();
        }
       
    }

    userAnswers[currentQuestion] = selectedAnswer;

    Array.from(optionsE1.children).forEach(option => {
        option.style.pointerEvents = 'none';
        if (option.textContent === correctAnswer) {
            option.classList.add('correct');
        } else {
            option.classList.add('incorrect');
        }
    });

    nextBtn.disabled = false;
}

nextBtn.addEventListener('click', () => {
    currentQuestion++;

    if (currentQuestion < questions.length) {
        loadQuestion();
    } else {
        showScore();
        completedSound.play(); 
    }
});

resetBtn.addEventListener('click', () => {
    currentQuestion = 0;
    score = 0;
    scoreE1.textContent = "";
    nextBtn.style.display = 'block';
    resetBtn.style.display = 'none';
    shuffledQuestions = shuffleArray([...questions]);
    userAnswers = new Array(questions.length).fill(null);
    loadQuestion();
    startTimer();
});

function showScore() {
    questionE1.textContent = `Quiz completed`;
    optionsE1.innerHTML = "";
    resetBtn.style.display = 'inline-block';  
    nextBtn.style.display='none';

    let message = "";
    if (score === shuffledQuestions.length) {
        message = "🔥🔥Perfect Score! Great job!";
    } else if (score < shuffledQuestions.length / 2) {
        message = "🫠🫠 Better luck next time";
    } else {
        message = "💫💫Good Effort!";
    }

    scoreE1.innerHTML = `    <div style="font-size: 1.5rem; font-weight: bold; color: #333;">
Your score: ${score} out of ${shuffledQuestions.length}</div><br>    <div style="font-size: 1.2rem; margin-top: 10px;">
${message}</div>`;

    if (score > highScore) {
        localStorage.setItem('highScore', score);
        highScore = score;
        scoreE1.innerHTML += `<br><div style="font-size: 1.2rem;"> New high score</div>`;
    } else {
        scoreE1.innerHTML += `<br><div style="font-size: 1.2rem; ">HighScore: ${highScore}</div>`;
    }

    progressBar.style.width = "100%";
    progressBar.textContent = "Done";
    clearInterval(timer);
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function updateProgressBar() {
    const progress = ((currentQuestion + 1) / shuffledQuestions.length) * 100;
    progressBar.style.width = `${progress}%`;
    progressBar.textContent = `${currentQuestion + 1}/${shuffledQuestions.length}`;
}

function startTimer() {
    timeLeft = 60;
    timerE1.textContent = `Time Left: ${timeLeft}`;
    clearInterval(timer);
    timer = setInterval(() => {
        timeLeft--;
        timerE1.textContent = `Time Left: ${timeLeft}s`;
        if (timeLeft <= 0) {
            clearInterval(timer);
            showScore();
            completedSound.play(); 
        }
    }, 1000); 
}
resetBtn.style.display = 'none';  

loadQuestion();
startTimer();
