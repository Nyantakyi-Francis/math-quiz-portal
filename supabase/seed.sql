insert into public.modules (
  slug,
  title,
  description,
  difficulty,
  question_count,
  topic_order,
  legacy_data_path,
  legacy_quiz_path
)
values
  ('binary-sets-binomial', 'Binary Operations, Sets & Binomial', 'Foundational structures, notation, and pattern fluency for early Elective Maths confidence.', 'Intermediate', 40, 1, 'data/binary-sets-binomial.json', 'quizzes/binary-sets-binomial.html'),
  ('surds-indices-logs', 'Surds, Indices & Logarithm', 'Simplification, transformation, and laws of indices with exam-style algebraic reasoning.', 'Intermediate', 40, 2, 'data/surds-indices-logs.json', 'quizzes/surds-indices-logs.html'),
  ('sequences-functions', 'Sequences & Functions', 'Patterns, mappings, and formal relationships that connect algebra to graph thinking.', 'Intermediate', 30, 3, 'data/sequences-functions.json', 'quizzes/sequences-functions.html'),
  ('straight-lines', 'Straight Lines', 'Coordinate geometry techniques for slope, intercepts, and line equations under time pressure.', 'Intermediate', 40, 4, 'data/straight-lines.json', 'quizzes/straight-lines.html'),
  ('vectors', 'Vectors', 'Magnitude, direction, and geometric interpretation for accurate vector manipulation.', 'Intermediate', 40, 5, 'data/vectors.json', 'quizzes/vectors.html'),
  ('trigonometry', 'Trigonometry', 'Identities, ratios, and angle reasoning with stronger emphasis on exam stamina.', 'Hard', 40, 6, 'data/trigonometry.json', 'quizzes/trigonometry.html'),
  ('limits-differentiation', 'Limits & Differentiation', 'Core calculus transition topics with step-based algebra and interpretation practice.', 'Hard', 40, 7, 'data/limits-differentiation.json', 'quizzes/limits-and-differentiation.html'),
  ('coordinate-geometry', 'Coordinate Geometry II: Circles', 'Circle geometry in coordinate form, with focus on equations, tangents, and interpretation.', 'Intermediate', 40, 8, 'data/coordinate-geometry.json', 'quizzes/coordinate-geometry-ii-circles.html'),
  ('matrices', 'Matrices', 'Matrix arithmetic, transformations, and determinant intuition for high-accuracy problem solving.', 'Intermediate', 40, 9, 'data/matrices.json', 'quizzes/matrices.html'),
  ('combinations-probability', 'Combinations, Permutations & Probability', 'Counting strategies and probability modelling for more demanding exam questions.', 'Hard', 40, 10, 'data/combinations-probability.json', 'quizzes/combinations-permutations-and-probability.html'),
  ('statistics', 'Statistics', 'Interpretation, grouped data, and applied statistical reasoning in test conditions.', 'Intermediate', 40, 11, 'data/statistics.json', 'quizzes/statistics.html')
on conflict (slug) do update
set
  title = excluded.title,
  description = excluded.description,
  difficulty = excluded.difficulty,
  question_count = excluded.question_count,
  topic_order = excluded.topic_order,
  legacy_data_path = excluded.legacy_data_path,
  legacy_quiz_path = excluded.legacy_quiz_path;
