# Math Quiz Portal | Elective Mathematics Prep

A premium, interactive web platform designed for students preparing for the **Elective Mathematics** component of the WASSCE examinations. Curated and maintained by **Nyantakyi Francis**, this portal serves as a centralized hub for rigorous mathematical testing and student outreach.

---

## 🚀 General Information

The Math Quiz Portal provides a structured environment for students to master complex mathematical concepts through high-fidelity, real-time quizzes. The platform is built with a focus on:

* **Examination Standards:** Questions modeled after WASSCE elective math requirements.
* **Instant Feedback:** Real-time scoring and corrections within each module.
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

## 📂 Project Structure

```text
/
├── index.html                   # Main portal landing page
├── README.md                    # Project documentation
└── quizzes/                     # Individual quiz modules
    ├── binary-sets-binomial.html
    ├── surds-indices-logs.html
    ├── sequences-functions.html
    └── matrices.html

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

**Maintained by Nyantakyi Francis** *Empowering students through digital mathematical excellence.*

