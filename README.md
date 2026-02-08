# EVALUATORR
Evaluation for french essays in Collège, 12-15yo
Live demo: https://thvermot-wq.github.io/EVALUATORR/

---

## Versioning

- **v1.0**: initial prototype (single-file evaluator, basic heuristics)
- **v2.0**: strict “two-pass” system + teacher feedback + hard gates
- **v2.1**: home screen + navigation + UX improvements
- **v2.2**: reports/export and/or history (depending on build)
- **v2.3**: `segUnits` (literary segmentation), 3rd-person POV signals, Pass 3 “Excellence” bonus

See `CHANGELOG.md` for details.

---

## Limitations (Important)

- Evaluatorr cannot truly “understand” a story the way a human teacher does.
- Heuristics may misjudge:
  - very experimental styles,
  - dialogues-heavy texts,
  - extremely short/long submissions,
  - unusual vocabulary or names.
- The tool is best used as:
  - a **consistent baseline**,  
  - a **feedback accelerator**,  
  - a **training aid** for revision,
  not as an unquestionable authority.

---

## Roadmap Ideas

- Calibration mode (compare tool score vs. teacher reference scores)
- Batch evaluation (multi-text import/export)
- Optional rubric customization per teacher/class
- Better dialogue handling and paragraph inference
- Safer spelling proxies and improved false-positive control

  ---

## Summary
I would start from a problem that already exists in our classrooms—ordinary, recurring, exhausting, and quietly toxic to everything else: the difficulty of getting students to work on language and writing with regularity, precision, and immediate feedback, without condemning the teacher to evenings of correcting piles of papers or turning assessment into a lottery. What I would like to solve with AI is not “writing in place of students,” nor a magic corrector that spits out a grade and a little comment. What I want is a machine that helps students improve—a pedagogical prosthesis that makes more frequent, more targeted, and fairer practice possible, while preserving the core of the profession: intention, voice, and attention to language and the real.

The idea is simple: build a teacher-centered writing and revision assistant, usable in class (offline if needed), that works like a driving lesson rather than a chauffeur. Concretely, a student writes a short text, then the tool offers structured feedback in three levels—never a full rewritten text, but guidance. First, formal alerts (punctuation, sentence boundaries, agreement, tense consistency). Second, content-level signals (presence of time/place anchors, clarity of pronouns, logical progression). Third, a small set of revision paths—two or three at most—phrased as author’s tasks: “rewrite this passage by adding a concrete action,” “replace two weak verbs with action verbs,” “insert a sentence that locates the scene in time.” The tool should not deliver a “ready” text, but levers: diagnose, orient, train.

Technically, the project breaks into very concrete components, which is precisely why it is feasible at the scale of a school. The first component is reliable, rule-based linguistic analysis—patterns and checks (end punctuation, sentence length, repetition, lexical variety, sensory vocabulary, time/place markers, tense coherence). This layer alone can generate a large portion of feedback—stable and explainable—without using a language model at all. The second component is a lightweight probabilistic layer that learns, from examples annotated by the teacher, to recognize a few families of drafts: description that never moves, narration that jumps, reported speech handled poorly, and so on. This could be k-nearest neighbors, a small classifier, or a linear model; the goal isn’t research, but a categorization good enough to route the right kind of feedback. The third component is the generative layer, used sparingly and only for what it does best: turning diagnostic signals into clear, student-friendly instructions and producing tailored practice prompts. The generative model does not write for the student; it helps the teacher generate good constraints, and it reformulates a diagnosis into an actionable revision task.

In the classroom, the decisive issue is orchestration. If the tool is just “a chatbot,” it quickly becomes a toy—or a cheating machine. My idea therefore requires a precise pedagogical frame that makes AI a training device, not an authority. A typical session might look like this: ten minutes of writing from a short prompt; fifteen minutes of guided revision with a rule—students must choose one of the suggested paths and justify the choice (“I added an action,” “I clarified the pronoun,” “I improved sentence boundaries”), and they must produce a visible before/after on two passages. Then five minutes of sharing: we project two anonymous revisions and discuss what actually improved the text. Here, the tool exists to enable what we all want but time prevents: a regular practice of rewriting with concrete criteria.

The value of AI in this project is therefore not to replace teacher correction, but to make it more strategic. Instead of correcting everything, I focus on what has human value: intention, precision, ambition, and the relationship between a student and their text. The tool takes care of the repetitive mechanics—not because they are beneath us, but because they are costly and they reduce practice frequency. The teacher recovers time for close reading, short one-to-one conferences, and running a real workshop.

The major question remains: the risk of overfitting—less in the strict statistical sense than in the pedagogical sense. If we train students to “tick boxes” (add a time marker, add a place, include a sensory field), we produce bad texts that score well. So the tool must be designed as an instrument of tension, not a point dispenser. The solution is twofold: first, clearly separate what is a minimal safeguard (readable segmentation, clear pronouns, tense coherence) from what belongs to style (rhythm, choice, voice), where the tool should not judge but open possibilities; second, keep a portion of human evaluation for criteria that cannot be automated: relevance, originality, overall coherence, the effect produced. In the interface, that translates into “closed” feedback for technical matters and “open” feedback for writing: questions rather than verdicts, options rather than prescriptions.

Finally, any AI project in a school setting must incorporate administrative and ethical reality: student data, transparency, explainability. My idea assumes strict data minimization: no names, anonymized texts, local storage if possible, and if an external service is used, a clear protocol. Students must understand what the tool does and does not do. Teachers must be able to enable/disable modules, adjust thresholds, and above all see what was suggested to the student. We must avoid the “oracle effect”: the AI is not right; it helps us verify.

If I had to summarize the idea in one practical sentence: I want an AI that turns French class into a frequent, tool-supported, explicit rewriting workshop—making viable what is most missing in our classrooms, not inspiration, but intelligent repetition. The goal is not perfect texts; it is to show students that writing is a sequence of learnable moves, that revision is part of the craft, and that quality is not a gift but a construction. In that frame, AI becomes an accelerator of practice, not a cognitive crutch. That is what I find most exciting: using a recent technology to restore an old pedagogical demand - the patient work on language—and making that work viable again in the real time of a classroom.
---

## License

Apache-2.0

---

## Author

**Evaluatorr** — created by *Thibault Vermot* (teacher & author).  
Feel free to open issues or propose improvements.
