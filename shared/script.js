/**
 * Centralized JavaScript Utilities using CONFIG object
 */

/**
 * Display the current year in footer/nav elements
 * Reads from #year, #nav-year, and #footer-year elements
 */
function displayCurrentYear() {
    const year = new Date().getFullYear();
    
    const yearElement = document.getElementById('year') || document.getElementById('nav-year');
    if (yearElement) {
        yearElement.textContent = year;
    }
    
    const footerYear = document.getElementById('footer-year');
    if (footerYear) {
        footerYear.textContent = year;
    }
}

/**
 * Initialize year display on page load
 */
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', displayCurrentYear);
} else {
    displayCurrentYear();
}

/**
 * Save a completed quiz to recent quizzes localStorage
 * Uses CONFIG.storage.recentQuizzesKey and maxRecentQuizzes
 * 
 * @param {string} title - Quiz title
 * @param {string} link - Quiz URL
 * @param {string} score - Score summary (e.g., "10/40 (25%)")
 */
function saveRecentQuiz(title, link, score) {
    try {
        const storageKey = CONFIG.storage.recentQuizzesKey;
        const maxRecent = CONFIG.storage.maxRecentQuizzes;
        
        let recent = JSON.parse(localStorage.getItem(storageKey)) || [];
        
        // Add new quiz attempt at the beginning
        recent.unshift({
            title: title,
            link: link,
            score: score,
            timestamp: new Date().toISOString()
        });
        
        // Keep only the configured number of recent quizzes
        recent = recent.slice(0, maxRecent);
        
        localStorage.setItem(storageKey, JSON.stringify(recent));
    } catch (error) {
        console.error('Error saving to recent quizzes:', error);
    }
}

/**
 * Retrieve recent quizzes from localStorage
 * 
 * @returns {Array} Array of recent quiz objects
 */
function getRecentQuizzes() {
    try {
        const storageKey = CONFIG.storage.recentQuizzesKey;
        return JSON.parse(localStorage.getItem(storageKey)) || [];
    } catch (error) {
        console.error('Error retrieving recent quizzes:', error);
        return [];
    }
}