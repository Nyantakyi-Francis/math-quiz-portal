// js/quiz-engine.js - Fixed KaTeX rendering for dynamic content

class QuizEngine {
    constructor(questions, quizTitle, quizLink) {
        this.questions = questions;
        this.quizTitle = quizTitle;
        this.quizLink = quizLink;
        this.container = document.getElementById('questions-container');
        this.form = document.getElementById('quizForm');
    }

    renderQuestions() {
        this.container.innerHTML = '';

        this.questions.forEach((item, index) => {
            const div = document.createElement('div');
            div.className = "question-card bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mb-6";

            let optionsHTML = item.options.map((opt, i) => `
                <label class="flex items-center p-4 border border-slate-200 rounded-xl cursor-pointer hover:border-indigo-200 hover:bg-indigo-50 transition-all">
                    <input type="radio" name="q${index}" value="${i}" class="h-5 w-5 text-indigo-600 focus:ring-indigo-500">
                    <span class="ml-4 text-slate-700 leading-relaxed">${opt}</span>
                </label>
            `).join('');

            div.innerHTML = `
                <div class="flex items-start gap-4 mb-5">
                    <span class="bg-indigo-600 text-white font-bold text-sm w-7 h-7 flex items-center justify-center rounded-lg flex-shrink-0 mt-0.5">
                        ${index + 1}
                    </span>
                    <div class="text-lg font-medium text-slate-800 leading-tight">${item.q}</div>
                </div>
                <div class="grid grid-cols-1 gap-3">
                    ${optionsHTML}
                </div>
            `;

            this.container.appendChild(div);
        });

        // Improved KaTeX rendering with multiple attempts and delay
        this.renderKaTeX();
    }

    renderKaTeX() {
        if (typeof renderMathInElement !== 'function') {
            console.warn("KaTeX auto-render not loaded");
            return;
        }

        const renderOptions = {
            delimiters: [
                { left: "$$", right: "$$", display: true },
                { left: "$", right: "$", display: false }
            ],
            throwOnError: false,
            errorColor: "#cc0000"
        };

        // First attempt
        renderMathInElement(this.container, renderOptions);

        // Second attempt after a short delay (helps with complex content)
        setTimeout(() => {
            renderMathInElement(this.container, renderOptions);
        }, 150);

        // Final safety attempt
        setTimeout(() => {
            renderMathInElement(this.container, renderOptions);
        }, 500);
    }

    calculateScore() {
        let score = 0;
        this.questions.forEach((item, index) => {
            const selected = document.querySelector(`input[name="q${index}"]:checked`);
            if (selected && parseInt(selected.value) === item.correct) {
                score++;
            }
        });

        const percent = ((score / this.questions.length) * 100).toFixed(1);
        return {
            score: score,
            total: this.questions.length,
            percent: percent,
            summary: `${score}/${this.questions.length} (${percent}%)`
        };
    }

    saveToRecent(scoreSummary) {
        if (typeof window.saveRecentQuiz === 'function') {
            window.saveRecentQuiz(this.quizTitle, this.quizLink, scoreSummary);
        }
    }

    init() {
        this.renderQuestions();

        this.form.onsubmit = (e) => {
            e.preventDefault();
            const result = this.calculateScore();
            const scoreSummary = result.summary;

            document.getElementById('score_field').value = scoreSummary;
            document.getElementById('email_subject').value = 
                `${this.quizTitle} Quiz Score: ${scoreSummary} | ${document.getElementsByName('student_name')[0].value || 'Student'}`;

            this.saveToRecent(scoreSummary);

            if (confirm(`Your score is ${scoreSummary}\n\nClick OK to submit to Mr. Nyantakyi Francis.`)) {
                this.form.submit();
            }
        };
    }
}

window.QuizEngine = QuizEngine;