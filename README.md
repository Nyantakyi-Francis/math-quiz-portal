# Math Quiz Portal | Elective Mathematics Prep

A premium, interactive web platform designed for students preparing for the **Elective Mathematics** component of the WASSCE examinations. Curated and maintained by **Nyantakyi Francis**, this portal serves as a centralized hub for rigorous mathematical testing and student outreach.

---

## 🚀 General Information

The Math Quiz Portal provides a structured environment for students to master complex mathematical concepts through high-fidelity, real-time quizzes. The platform is built with a focus on:

* **Examination Standards:** Questions modeled after WASSCE elective math requirements.
* **Instant Feedback:** Real-time scoring and corrections within each module.
* **Progress Tracking:** Recent quiz attempts saved locally for continued learning.
* **Accessibility:** A fully responsive design optimized for mobile phones, tablets, and desktops.

---

## 🛠️ Technical Stack

| Component | Technology |
| --- | --- |
| **Frontend** | HTML5, Tailwind CSS |
| **Typography** | Plus Jakarta Sans (Google Fonts) |
| **Icons** | SVG-based iconography |
| **Logic** | Vanilla JavaScript |
| **Math Rendering** | LaTeX-style syntax |
| **Contact Handling** | Formspree |

---

## ✨ Key Features

* **11 Interactive Modules** covering all major Elective Mathematics topics
* **440+ Practice Questions** with randomized answer options
* **Search Functionality** to quickly find specific topics
* **Progress Tracking** with localStorage for recent quiz attempts
* **Responsive Design** optimized for all device sizes
* **Math Rendering** with KaTeX for beautiful mathematical expressions
* **Modular Architecture** for easy maintenance and expansion

---

```text
/
├── index.html                   # Main portal landing page
├── README.md                    # Project documentation
├── style.css                    # Shared stylesheets
├── dp.PNG                       # Profile image
├── js/                          # JavaScript utilities
│   ├── config.js                # Centralized configuration
│   └── quiz-engine.js           # Quiz rendering and scoring logic
├── shared/                      # Shared components and utilities
│   └── script.js                # Common JavaScript functions
├── data/                        # Quiz question data
│   ├── binary-sets-binomial.json
│   ├── combinations-probability.json
│   ├── coordinate-geometry.json
│   ├── limits-differentiation.json
│   ├── matrices.json
│   ├── sequences-functions.json
│   ├── statistics.json
│   ├── straight-lines.json
│   ├── surds-indices-logs.json
│   ├── trigonometry.json
│   └── vectors.json
└── quizzes/                     # Individual quiz modules
    ├── binary-sets-binomial.html
    ├── combinations-permutations-and-probability.html
    ├── coordinate-geometry-ii-circles.html
    ├── limits-and-differentiation.html
    ├── matrices.html
    ├── sequences-functions.html
    ├── statistics.html
    ├── straight-lines.html
    ├── surds-indices-logs.html
    ├── trigonometry.html
    └── vectors.html
```

---

## 🔧 Maintenance & Future Updates

### Adding New Quiz Modules

The portal is modular and can be expanded easily:

1. **Create File:** Add a new quiz file in the `/quizzes` folder (e.g., `trigonometry.html`).
2. **Add Card:** Open `index.html` and duplicate an existing "Module Block" (`<a>` tag).
3. **Update Info:** Change the `href` to point to your new file; update the module number, title, and description.
4. **Counters:** Update the "Modules Online" text in the **Hero section** of `index.html` to reflect the total count.

### Design Customization

* **Branding:** The primary theme uses the Tailwind `indigo` palette. To change it, search and replace `indigo` with another Tailwind color (e.g., `blue`, `emerald`, or `rose`).
* **Dynamic Dates:** The navigation bar and footer copyright years update automatically via JavaScript. No manual editing is required for year-to-year rollovers.

---

## 📋 Deployment Checklist

* [ ] Verify that all quiz file paths in `index.html` match the physical files in `/quizzes`.
* [ ] Ensure all math formulas are wrapped in LaTeX delimiters ( or 

) for proper rendering.
* [ ] Test the **"Contact Instructor"** modal to ensure the form submits to your linked ID.

---
TO DO
1. ✅ Create a shared style.css file
This will keep your design consistent across index.html and all quiz pages instead of repeating styling in many files.

2. ✅ Create a shared script.js file
This will allow you to centralize common JavaScript features like navigation, scoring, timers, and saved progress.

3. ✅ Add a data/ folder for quiz questions
Moving quiz questions into separate JavaScript or JSON-like files will make the project easier to manage and update than keeping everything inside each HTML file.

4. 🔄 Redesign index.html into a dashboard homepage
Your homepage should feel like a real learning platform by showing progress, quick actions, and featured modules before the topic list.

5. Add a “Take Random Mock Exam” feature
This will make the site feel more advanced by generating a full mixed-topic test instead of only topic-by-topic quizzes.

6. Add a results page or results section to every quiz file
Students should see their score, percentage, corrections, and feedback immediately after completing a quiz.

7. Add a “Review Mistakes” feature
This will turn the app from a simple testing website into a learning tool by allowing students to revisit questions they got wrong.

8. ✅ Use localStorage to save progress
Saving scores, completed quizzes, and last-attempted topics will make the site feel smarter and more professional.

9. Add performance analytics on the homepage
Showing best topic, weakest topic, total attempts, and average score will make the project much stronger for your portfolio.

10. ✅ Add a reusable navigation/header component pattern
Keeping the same header, footer, and buttons across pages will improve user experience and make the site look more polished.

11. ✅ Improve the module cards on index.html
Each topic card should show the number of questions, difficulty, and progress so users can choose what to study faster.

12. Add a dedicated assets/ folder
This will help organize images like dp.PNG, icons, and future screenshots instead of leaving them in the root folder.

13. ✅ Rename files for consistency
Using a cleaner naming pattern for all quiz files will make the project easier to maintain and more professional to present.

14. 🔄 Add a footer with project information
A footer can show your name, portfolio link, GitHub link, and project purpose, which strengthens it as a portfolio item.

15. ✅ Improve the README.md
A strong README will explain what the project does, its features, tech stack, screenshots, and future improvements for recruiters or collaborators.

16. Add mobile responsiveness improvements
The site should be easier to use on phones since many students will likely access it on mobile devices.

17. Add question explanations or hints
This will make the platform more educational by helping students understand why an answer is correct.

18. Add a timer option for quizzes
A timer will simulate real exam conditions and make the platform more engaging and realistic.

19. Add a progress bar inside quizzes
Showing question progress like “Question 4 of 20” will improve user experience and reduce confusion.

20. ✅ Create a separate folder for reusable utilities
This will make future upgrades easier by separating helper logic such as scoring, shuffle functions, and storage functions from page-specific code.
---

**Maintained by Nyantakyi Francis** *Empowering students through digital mathematical excellence.*

