# Aki-Ola PDF extraction inventory

## Purpose

The two Aki-Ola PDFs are useful as source material for upgrading the eight draft modules to WASSCE standard. They should guide the question standard, diagram selection, answer checking, and explanation style before any new import is done.

The PDFs should not be imported directly as screenshots or copied question banks. Use them to identify WASSCE-style question types and matching diagram requirements, then write fresh platform questions with clean local diagrams.

## Source PDFs

| PDF | Pages | Main use |
| --- | ---: | --- |
| `Aki-Ola Core Mathematics.pdf` | 967 | Primary source for all eight draft modules |
| `Aki-Ola Elective Mathematics.pdf` | 854 | Supporting source for harder set, function, coordinate geometry, statistics, and probability questions |

Rendered inspection files are in `tmp/pdfs/akiola-module-samples/`. They are temporary working files, not final question assets.

## Usefulness decision

These PDFs are useful enough to continue.

They solve the main planning problem we had: we no longer need to guess the correct diagram styles for WASSCE-style questions. The Core Mathematics PDF gives clear examples for angle diagrams, circle-sector diagrams, solid-shape diagrams, statistical tables, grouped-data diagrams, probability spaces, and coordinate graphs.

The raw scanned diagrams are not good enough as final platform images in many cases. Some pages are tilted, stained, low contrast, or contain extra text. The better workflow is to redraw the needed diagrams cleanly and store them under `public/question-assets/<module-slug>/`.

Use raw screenshots only as temporary references unless permission and image quality are both acceptable.

## Module-by-module extraction map

### 1. Fractions and Percentages

Slug: `fractions-percentages`

Primary source:

- Core Mathematics, Unit 13: Percentages I, pages 359-388.

Useful exercise pages detected:

- 365, 368, 372, 374, 376, 380, 383.

Question types to select:

- Convert between fractions, decimals, and percentages.
- Find a percentage of a quantity.
- Percentage increase and decrease.
- Percentage error.
- Profit and loss.
- Discount.
- Commission.
- Simple interest.
- Hire purchase.
- Fraction spent, fraction left, and reverse percentage contexts.

Images/assets needed:

- 100-square percentage grid.
- Receipt or price-tag table for discount/profit questions.
- Simple interest ledger table.
- Hire-purchase payment table.
- Pie or bar model showing fractions of a whole.

Priority:

- Medium. The topic can be strong with mostly text/table questions. Diagrams are helpful but not mandatory for every question.

### 2. Number Sets

Slug: `number-sets`

Primary source:

- Core Mathematics, Unit 1: Sets and Operations on Sets, pages 1-47.

Supporting source:

- Elective Mathematics, Sets, pages 1-29.

Useful exercise pages detected:

- Core: 1, 2, 3, 4, 5, 6, 12, 22, 28, 46.
- Elective: 1, 2, 3, 4, 5, 6, 7.

Question types to select:

- Set notation and membership.
- Subsets and proper subsets.
- Universal set, complement, union, and intersection.
- Empty set and singleton set.
- Cardinality.
- Two-set Venn diagram interpretation.
- Three-set Venn diagram word problems.
- De Morgan's laws.
- Classification of real-number subsets where this overlaps with number systems.

Images/assets needed:

- Two-set Venn diagram with all regions labelled.
- Three-set Venn diagram with counts.
- Universal set rectangle with shaded complement.
- Venn diagrams for union and intersection.
- Venn diagrams for De Morgan's laws.
- Number-line classification diagram.
- Nested number-set diagram.

Priority:

- High. This module needs clean Venn diagrams because many strong questions depend on region interpretation.

### 3. Algebraic Expressions and Factorisation

Slug: `algebraic-expressions-factorisation`

Primary source:

- Core Mathematics, Unit 3: Algebraic Expressions, pages 85-109.

Useful exercise pages detected:

- 88, 92, 93, 94, 95, 97, 99, 101, 104, 106, 108, 109.

Question types to select:

- Simplify expressions by collecting like terms.
- Substitute values into expressions.
- Expand brackets.
- Factorise by common factor.
- Factorise by grouping.
- Factorise quadratic trinomials.
- Difference of two squares.
- Simplify algebraic fractions.
- Form expressions from word problems.

Images/assets needed:

- Area model for expanding brackets.
- Box method diagram for quadratic factorisation.
- Algebra tile or rectangle model for factorisation.
- Substitution table.

Priority:

- Medium-low for images. The questions need better algebraic reasoning more than many diagrams.

### 4. Linear Equations, Relations and Functions

Slug: `linear-equations-relations-functions`

Primary source:

- Core Mathematics, Unit 6: Relations, Mappings and Functions, pages 121-138.
- Core Mathematics, Unit 8: Formulas, Linear Equations and Inequalities, pages 224-273.

Supporting source:

- Elective Mathematics, Relations and Functions, pages 64-91.
- Elective Mathematics, Coordinate Geometry I, pages 232-256.

Useful exercise pages detected:

- Core functions: 124, 129, 132, 133, 136, 138.
- Core linear equations: 234, 243, 248, 249, 251, 254, 258, 261, 264, 269, 272.
- Elective functions: 67.
- Elective coordinate geometry: 235.

Question types to select:

- One-step and multi-step linear equations.
- Equations with brackets.
- Equations involving fractions.
- Formulas and change of subject.
- Forming equations from word problems.
- Ordered pairs.
- Mapping diagrams.
- Domain and range.
- Function notation.
- Tables of values.
- Straight-line graph interpretation.
- Gradient and intercept questions.

Images/assets needed:

- Mapping diagram with arrows.
- Function machine diagram.
- Table of values linked to a graph.
- Cartesian grid with a straight line.
- Two-line intersection graph.
- Gradient triangle on a line.
- Domain/range diagram.
- Balance-scale equation diagram.

Priority:

- High. The module needs graph and mapping images to feel like exam mathematics rather than plain arithmetic.

### 5. Angles and the Pythagorean Theorem

Slug: `angles-pythagorean-theorem`

Primary source:

- Core Mathematics, Unit 7: Plane Geometry I, pages 177-223.

Possible supporting source:

- Core Mathematics, Unit 9: Bearings and Vectors in a Plane, pages 274-310, only if we decide to include angle-bearing applications.

Useful exercise pages detected:

- 179, 180, 188, 194, 199, 201, 205, 210, 212, 220, 223.

Question types to select:

- Identify acute, right, obtuse, straight, reflex, and full-turn angles.
- Angles on a straight line.
- Angles at a point.
- Vertically opposite angles.
- Complementary and supplementary angles.
- Parallel lines and transversals.
- Interior and exterior angles of triangles.
- Isosceles and equilateral triangle angle problems.
- Quadrilateral angle problems.
- Polygon angle sums.
- Pythagorean theorem in right triangles.
- Pythagorean triples and missing side problems.

Images/assets needed:

- Protractor angle diagram.
- Straight-line angle diagram.
- Angles around a point.
- Vertically opposite angles.
- Parallel lines with transversal.
- Triangle with interior/exterior angles.
- Isosceles triangle.
- Quadrilateral with unknown angles.
- Regular polygon interior/exterior angle diagram.
- Right triangle with side labels.
- Ladder/wall or distance-context Pythagorean diagram.

Priority:

- Very high. This was the module where image-question mismatch became obvious. Do not write final questions until the diagram set is ready.

### 6. Perimeter, Area and Volume

Slug: `perimeter-area-volume`

Primary source:

- Core Mathematics, Unit 22: Mensuration I, pages 631-668.
- Core Mathematics, Unit 28: Mensuration II, pages 804-858.

Useful exercise pages detected:

- Mensuration I: 647, 651, 654, 656, 662, 667, 668.
- Mensuration II: 806, 814, 820, 829, 841, 844, 849.

Question types to select:

- Circumference and area of a circle.
- Arc length.
- Sector area.
- Segment area.
- Area and perimeter of triangles, rectangles, parallelograms, trapeziums, rhombuses, and kites.
- Compound plane shapes.
- Surface area of prisms.
- Surface area and volume of cylinders.
- Cones, pyramids, and spheres.
- Composite solids.
- Nets of solids.
- Conversion between units.

Images/assets needed:

- Circle with radius, diameter, chord, arc, sector, and segment.
- Sector and segment diagrams.
- Compound rectilinear shape.
- Composite circle-rectangle shape.
- Triangle, trapezium, parallelogram, rhombus, and kite diagrams.
- Cylinder with dimensions.
- Cone with slant height and radius.
- Rectangular prism/cuboid.
- Triangular prism.
- Sphere/hemisphere.
- Net of prism or cylinder.
- Composite solid.

Priority:

- Very high. This module should be image-rich.

### 7. Probability of Independent Events

Slug: `probability-independent-events`

Primary source:

- Core Mathematics, Unit 20: Probability, pages 565-585.

Supporting source:

- Elective Mathematics, Probability I, pages 304-337.

Useful exercise pages detected:

- Core: 566, 567, 581, 584.
- Elective: 304, 310.

Question types to select:

- Sample space listing.
- Probability scale.
- Simple probability.
- Complementary events.
- Mutually exclusive events.
- Independent events.
- Compound experiments.
- Coin, die, card, and selection-with-replacement contexts.
- Probability tables.
- Tree diagrams where useful.

Images/assets needed:

- Probability scale from 0 to 1.
- Venn diagram for mutually exclusive and overlapping events.
- Two-way probability table.
- Tree diagram for two-stage independent events.
- Sample-space grid for two dice.
- Spinner or bag-of-balls diagram.
- Deck/card or coin/die diagram if a visual stimulus improves the item.

Priority:

- High. Some probability questions can be text-only, but independent-event questions are clearer with tables, grids, and tree diagrams.

### 8. Data Organisation, Analysis and Presentation

Slug: `data-organisation-analysis-presentation`

Primary source:

- Core Mathematics, Unit 10: Statistics I, pages 311-343.
- Core Mathematics, Unit 19: Statistics II, pages 532-564.

Supporting source:

- Elective Mathematics, Statistics, pages 257-303.

Useful exercise pages detected:

- Core Statistics I: 314, 322, 326, 330, 336, 337, 338.
- Core Statistics II: 534, 535, 542, 547, 557.
- Elective Statistics: 264, 268, 269.

Question types to select:

- Frequency tables.
- Grouped frequency tables.
- Class intervals and class boundaries.
- Mean from raw data.
- Mean from frequency table.
- Median and mode.
- Pie chart interpretation.
- Bar chart interpretation.
- Histogram interpretation.
- Cumulative frequency table and curve.
- Quartiles and percentiles.
- Range, variance, and standard deviation.

Images/assets needed:

- Ungrouped frequency table.
- Grouped frequency table.
- Bar chart.
- Pie chart.
- Histogram.
- Cumulative frequency curve.
- Ogive with median/quartile readings.
- Data table for mean/median questions.

Priority:

- Very high. The statistics module should rely heavily on tables and charts, and the charts must be readable on mobile.

## Candidate selection rules

Use these rules before any final question writing:

1. Select more candidates than needed. Target 50-60 candidate items per module, then reduce to 40.
2. Do not copy full questions verbatim into the final bank. Use the PDFs to model the skill, difficulty, and diagram type.
3. For every selected question idea, record:
   - source PDF
   - source page
   - module slug
   - subtopic
   - diagram needed: yes/no
   - planned asset filename
   - answer key source or calculation check
   - difficulty: easy, medium, hard
4. Any question with a diagram must be matched to a local asset before import.
5. Any table/chart question must be checked visually at mobile width.
6. Do not import a module while its diagram assets are still placeholders.

## Asset creation rules

Store final assets here:

```text
public/question-assets/fractions-percentages/
public/question-assets/number-sets/
public/question-assets/algebraic-expressions-factorisation/
public/question-assets/linear-equations-relations-functions/
public/question-assets/angles-pythagorean-theorem/
public/question-assets/perimeter-area-volume/
public/question-assets/probability-independent-events/
public/question-assets/data-organisation-analysis-presentation/
```

For every final asset, create an entry in a module asset manifest with:

- filename
- source reference
- whether it was redrawn locally or externally sourced
- license/permission status
- alt text
- intended question IDs
- visual check status

Recommended naming examples:

```text
venn-three-sets-students-sports-01.png
parallel-lines-transversal-unknown-x-01.png
right-triangle-ladder-wall-01.png
circle-sector-arc-length-01.png
cylinder-open-top-volume-01.png
tree-independent-events-coins-01.png
histogram-grouped-marks-01.png
ogive-quartile-reading-01.png
linear-graph-gradient-intercept-01.png
```

## Immediate next work

1. Create `QUESTION_SOURCE_REGISTER.md` or a spreadsheet-style Markdown table.
2. Fill it with 50-60 candidate question ideas per module using the page ranges above.
3. Mark each candidate as text-only, table-based, or diagram-based.
4. Redraw the required diagram set for the highest-priority visual modules first:
   - `angles-pythagorean-theorem`
   - `perimeter-area-volume`
   - `data-organisation-analysis-presentation`
   - `probability-independent-events`
   - `linear-equations-relations-functions`
   - `number-sets`
5. Write only 8-10 final sample questions for one module first.
6. Visually check those questions in the browser.
7. If the sample quality is acceptable, complete the remaining questions for that module.
8. Import one module at a time with `--replace` only after browser review.

## AI execution prompt for the next pass

Use this prompt when continuing the work:

```text
You are upgrading the draft WASSCE mathematics modules in this repo. Read WASSCE_MODULE_UPGRADE_PLAN.md and AKI_OLA_PDF_EXTRACTION_INVENTORY.md first. Use Aki-Ola Core Mathematics.pdf as the primary source and Aki-Ola Elective Mathematics.pdf only as support for harder items.

Do not copy questions verbatim from the PDFs. Use them to identify the skill, structure, difficulty, and diagram type. For each module, create a candidate source register with 50-60 question ideas, including source PDF, page number, subtopic, diagram/table needed, planned local asset filename, answer-check note, and difficulty.

Prioritize diagram-heavy modules first: angles-pythagorean-theorem, perimeter-area-volume, data-organisation-analysis-presentation, probability-independent-events, linear-equations-relations-functions, and number-sets.

Before writing final JSON question banks, create or list all required local assets under public/question-assets/<module-slug>/ with alt text and source/permission notes. Use clean locally redrawn diagrams rather than blurry screenshots unless permission and quality are acceptable.

After drafting a module, run the app locally, visually inspect the quiz page on desktop and mobile, fix any mismatched or unreadable diagrams, then import that module with --replace only after review.
```
