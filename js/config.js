/**
 * Centralized configuration for the Math Quiz Portal
 * All hardcoded values and settings should be defined here
 */

const CONFIG = {
    /**
     * Application identification
     */
    app: {
        name: 'Math Quiz Portal',
        instructor: 'Nyantakyi Francis',
        instructorEmail: 'your-email@example.com', // Update with actual email
        instructorPortfolio: 'https://nyantakyi-francis.github.io/portfolio/index.html',
        instructorInitials: 'NF'
    },

    /**
     * Form submission configuration
     */
    form: {
        formspreeEndpoint: 'https://formspree.io/f/xvzbgroo', // Update with your Formspree ID
        submissionSubjectTemplate: '{quizTitle} Quiz Score: {score} | {studentName}',
        submissionConfirmationTemplate: 'Your score is {score}\n\nClick OK to submit to {instructorName}.'
    },

    /**
     * KaTeX/Math rendering configuration
     */
    katex: {
        enabled: true,
        delimiters: [
            { left: "$$", right: "$$", display: true },
            { left: "$", right: "$", display: false }
        ],
        throwOnError: false,
        errorColor: "#cc0000",
        renderAttempts: [
            { delay: 0, label: 'immediate' },
            { delay: 150, label: 'delayed' },
            { delay: 500, label: 'final' }
        ]
    },

    /**
     * UI/UX Configuration
     */
    ui: {
        primaryColor: 'indigo',
        animationDuration: 300, // milliseconds
        notificationDuration: 3000 // milliseconds
    },

    /**
     * Quiz modules
     */
    modules: [
        {
            id: 'binary-sets-binomial',
            title: 'Binary Operations, Sets & Binomial',
            link: 'quizzes/binary-sets-binomial.html',
            color: 'blue',
            moduleNum: 1,
            questions: 40,
            difficulty: 'Intermediate',
            formTopic: 'Binary Operations, Sets and Binomial'
        },
        {
            id: 'surds-indices-logs',
            title: 'Surds, Indices & Logarithm',
            link: 'quizzes/surds-indices-logs.html',
            color: 'purple',
            moduleNum: 2,
            questions: 40,
            difficulty: 'Intermediate',
            formTopic: 'Surds, Indices and Logarithm'
        },
        {
            id: 'sequences-functions',
            title: 'Sequences & Functions',
            link: 'quizzes/sequences-functions.html',
            color: 'rose',
            moduleNum: 3,
            questions: 40,
            difficulty: 'Intermediate',
            formTopic: 'Sequences and Functions'
        },
        {
            id: 'straight-lines',
            title: 'Straight Lines',
            link: 'quizzes/straight-lines.html',
            color: 'amber',
            moduleNum: 4,
            questions: 40,
            difficulty: 'Intermediate',
            formTopic: 'Straight Lines'
        },
        {
            id: 'vectors',
            title: 'Vectors',
            link: 'quizzes/vectors.html',
            color: 'cyan',
            moduleNum: 5,
            questions: 40,
            difficulty: 'Intermediate',
            formTopic: 'Vectors'
        },
        {
            id: 'trigonometry',
            title: 'Trigonometry',
            link: 'quizzes/trigonometry.html',
            color: 'indigo',
            moduleNum: 6,
            questions: 40,
            difficulty: 'Hard',
            formTopic: 'Trigonometry'
        },
        {
            id: 'limits-differentiation',
            title: 'Limits & Differentiation',
            link: 'quizzes/limits-and-differentiation.html',
            color: 'fuchsia',
            moduleNum: 7,
            questions: 40,
            difficulty: 'Hard',
            formTopic: 'Limits and Differentiation'
        },
        {
            id: 'coordinate-geometry',
            title: 'Coordinate Geometry II: Circles',
            link: 'quizzes/coordinate-geometry-ii-circles.html',
            color: 'emerald',
            moduleNum: 8,
            questions: 40,
            difficulty: 'Intermediate',
            formTopic: 'Coordinate Geometry II - Circles'
        },
        {
            id: 'matrices',
            title: 'Matrices',
            link: 'quizzes/matrices.html',
            color: 'sky',
            moduleNum: 9,
            questions: 40,
            difficulty: 'Intermediate',
            formTopic: 'Matrices'
        },
        {
            id: 'combinations-probability',
            title: 'Combinations, Permutations & Probability',
            link: 'quizzes/combinations-permutations-and-probability.html',
            color: 'orange',
            moduleNum: 10,
            questions: 40,
            difficulty: 'Hard',
            formTopic: 'Combinations, Permutations and Probability'
        },
        {
            id: 'statistics',
            title: 'Statistics',
            link: 'quizzes/statistics.html',
            color: 'red',
            moduleNum: 11,
            questions: 40,
            difficulty: 'Intermediate',
            formTopic: 'Statistics'
        }
    ],

    /**
     * localStorage configuration
     */
    storage: {
        recentQuizzesKey: 'recentQuizzes',
        maxRecentQuizzes: 5
    },

    /**
     * Helper methods
     */
    getModuleById(moduleId) {
        return this.modules.find(m => m.id === moduleId);
    },

    getModuleByLink(link) {
        return this.modules.find(m => m.link === link);
    },

    getTotalQuestions() {
        return this.modules.reduce((sum, m) => sum + m.questions, 0);
    },

    getTotalModules() {
        return this.modules.length;
    }
};

// Freeze the object to prevent accidental modifications in development
Object.freeze(CONFIG);
