# Book diagram candidates

## Decision

Use diagrams from the Aki-Ola books only when they are readable, clean enough, and matched to the exact question being written.

Do not rely on AI-generated freehand diagrams for final assets. If a book diagram is not good enough as a final image, drop that diagram-based candidate. Diagrams are useful, but they are not compulsory because the books contain many strong exercises that do not require diagrams.

Allowed fallbacks:

1. Use a cleaner diagram from another page in the same books if it supports the same skill.
2. Use a text-only or table-only exercise from the books.
3. Drop the candidate question.

Do not spend time recreating a weak diagram unless the user explicitly asks for that later.

## Use rules

Before a book diagram becomes a platform asset, it must pass these checks:

- The diagram matches the exact question, values, labels, and unknowns.
- The crop contains only the diagram and necessary labels.
- The image is readable on mobile.
- There are no irrelevant neighbouring questions, answers, page stains, or page edges.
- The asset has source notes: PDF name, page number, and crop location.
- The final file is stored locally under `public/question-assets/<module-slug>/`.

If there is uncertainty about permission to reuse scanned book diagrams publicly, treat the crop as a private drafting reference and recreate it cleanly with a non-AI tool before publishing.

## Candidate status meanings

| Status | Meaning |
| --- | --- |
| `usable-crop` | The book diagram can likely be cropped and cleaned for direct use |
| `reference-only` | The book diagram is useful for understanding the topic, but should not become a final asset |
| `reject` | The image is too unclear, crowded, or mismatched |
| `pending-check` | Needs visual inspection before a decision |

## Candidate register

| Module | Source | Page | Diagram type | Likely use | Status | Notes |
| --- | --- | ---: | --- | --- | --- | --- |
| `angles-pythagorean-theorem` | Core | 177-178 | angle types, straight angle, reflex angle | early angle identification questions | `reference-only` | Use only if a clean crop is possible; otherwise prefer text-only exercises. |
| `angles-pythagorean-theorem` | Core | 178-179 | adjacent angles, supplementary angles, angles around a point | unknown angle equations | `reference-only` | Use only if the diagram and question values match exactly; otherwise drop. |
| `angles-pythagorean-theorem` | Core | 180 | vertically opposite angles and perpendicular lines | unknown angle questions | `reference-only` | Useful for screening; final use depends on crop quality. |
| `perimeter-area-volume` | Core | 631-634 | circle parts, circumference, arc length, sector area | circle and sector questions | `reference-only` | Very useful, but scanned page contains several diagrams and formula text. Drop any crop that is not clean. |
| `perimeter-area-volume` | Core | 804-807 | prism, cylinder, pipe cross-section | surface area and volume questions | `pending-check` | Some diagrams look usable, but need individual crop inspection. |
| `probability-independent-events` | Core | 565-567 | sample space, event set, simple probability diagrams | sample space and probability scale questions | `reference-only` | Mostly text/table style; prefer exercises that do not need image assets. |
| `data-organisation-analysis-presentation` | Core | 311-312 | frequency tables and grouped frequency tables | table-reading questions | `usable-crop` | Tables are clearer than many diagrams; still need crop and mobile check. |
| `data-organisation-analysis-presentation` | Core | 532-564 | grouped data, cumulative frequency, dispersion | grouped statistics questions | `pending-check` | Need render/crop pass for charts and ogives. |
| `linear-equations-relations-functions` | Core | 175-176 | coordinate graph and table of values | straight-line graph questions | `usable-crop` | Initial render shows a large graph and table; good candidate if cropped cleanly. |
| `linear-equations-relations-functions` | Elective | 232-234 | coordinate geometry points, distance, midpoint | graph and coordinate questions | `reference-only` | Use only if the graph crop is clean; otherwise choose text/table questions. |
| `number-sets` | Core | 14-16 | Venn diagrams and De Morgan shading | set operation questions | `reference-only` | Strong content, but scan quality/page staining may make final use unsuitable. |
| `number-sets` | Elective | 1-7 | set notation and operations | harder set questions | `pending-check` | Needs visual pass for diagrams. |

## Next extraction order

1. `angles-pythagorean-theorem`: identify 12-15 diagram candidates from Core pages 177-223.
2. `perimeter-area-volume`: identify 15-20 diagram candidates from Core pages 631-668 and 804-858.
3. `data-organisation-analysis-presentation`: identify 10-15 chart/table candidates from Core pages 311-343 and 532-564.
4. `probability-independent-events`: identify 6-10 table/tree/sample-space candidates from Core pages 565-585 and Elective pages 304-337.
5. `linear-equations-relations-functions`: identify 8-12 graph/mapping candidates from Core pages 121-138 and 224-273.
6. `number-sets`: identify 8-12 Venn/number-line candidates from Core pages 1-47 and Elective pages 1-29.

## Practical workflow

For each candidate diagram:

1. Render the source page to a high-resolution PNG in `tmp/pdfs/`.
2. Crop only the needed diagram.
3. Save a draft crop in `tmp/pdfs/crops/<module-slug>/`.
4. Inspect it at mobile-like size.
5. Mark it as `usable-crop`, `reference-only`, or `reject`.
6. Move only accepted final assets into `public/question-assets/<module-slug>/`.
7. If the crop fails, drop the diagram-based question and choose a text-only or table-only exercise instead.
8. Write the question after the diagram decision, not before.
