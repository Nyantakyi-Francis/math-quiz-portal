// Centralized JavaScript Utilities

// Function to display the current year in the footer
function displayCurrentYear() {
    const year = new Date().getFullYear();
    document.getElementById('year').textContent = year;
}

// Function to initialize the quiz
function initQuiz(questions) {
    // Logic to initialize quiz with questions
}

// Function to track progress of the quiz
function trackProgress(currentQuestion, totalQuestions) {
    const progress = (currentQuestion / totalQuestions) * 100;
    document.getElementById('progress').style.width = progress + '%';
}

// Function to manage localStorage
function manageLocalStorage(key, value) {
    if (value) {
        localStorage.setItem(key, JSON.stringify(value));
    } else {
        return JSON.parse(localStorage.getItem(key));
    }
}

// Timer functionality
let timer;
function startTimer(duration, display) {
    let time = duration;
    timer = setInterval(function () {
        const minutes = parseInt(time / 60, 10);
        const seconds = parseInt(time % 60, 10);

        display.textContent = minutes + ':' + (seconds < 10 ? '0' : '') + seconds;

        if (--time < 0) {
            clearInterval(timer);
            // Handle timer end
        }
    }, 1000);
}

// Scoring function
function calculateScore(correctAnswers, totalQuestions) {
    return (correctAnswers / totalQuestions) * 100;
}

// Form validation
function validateForm(form) {
    // Logic to validate form
    // Return true if valid, false otherwise
}

// Function to show modals
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = 'block';
}

// Function to show notifications
function showNotification(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    document.body.appendChild(notification);

    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}