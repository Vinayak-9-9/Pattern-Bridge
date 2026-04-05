# PatternBridge

PatternBridge is a lightweight, data-driven frontend app for learning how to map real-world engineering scenarios to classic algorithmic patterns.

## Motivation
In interviews and practical engineering work, the hardest part is often not coding syntax - it is recognizing the right abstraction. PatternBridge is designed to train that transfer skill intentionally:

- Start from a software-flavored problem statement.
- Infer the hidden algorithmic template.
- Reveal guidance progressively.    
- Compare your mental model with the canonical pattern.

## Why This Is Relevant To AI Evaluation
AI systems are frequently tested on whether they can generalize reasoning across domains, not just repeat known prompts. PatternBridge mirrors this challenge by framing standard algorithm problems in realistic engineering language.

This makes the project relevant for:

- AI evaluation design focused on reasoning transfer
- Prompt and benchmark design for abstraction quality
- Software engineering interview preparation with scenario-based framing

## Core Features
- Multi-problem selector with integrated search (title/category/pattern/technique/difficulty)
- Data-driven rendering from a single JavaScript problem array
- Progressive reveal workflow for hints and solution layers
- Reveal progress tracking (`Revealed X / 6 sections`)
- `Reveal All Sections` and `Collapse All Hints` controls
- Dynamic transfer-note panel explaining real-world to algorithm mapping
- Difficulty labels for quick cognitive load estimation
- Responsive layout for desktop and mobile

## Algorithmic Patterns Covered
- Unweighted Shortest Path (BFS)
- Topological Ordering (Indegree + Queue)
- Binary Search on Answer (Monotonic Feasibility)
- Duplicate Detection (Hash Set)
- Longest Valid Window (Sliding Window)

## Tech Stack
- HTML5 (semantic structure)
- CSS3 (responsive layout, design tokens, accessibility-friendly focus states)
- Vanilla JavaScript (state + render flow, no frameworks)

## Project Structure

```txt
PatternBridge/
├── index.html   # App shell, landmarks, footer/about
├── style.css    # Design system, layout, responsive styles
├── script.js    # Problem data, state management, rendering logic
└── README.md
```

## How To Run Locally
1. Clone or download this repository.
2. Open `index.html` in any modern browser.
3. No install step, build step, or server setup required.

## How To Add A New Problem
1. Open `script.js`.
2. Add a new object to the `problems` array with the same schema:
   - `id`, `title`, `category`, `difficulty`
   - `patternName`, `coreTechnique`, `transferNote`
   - `problemStatement`, `constraints`, `example`
   - `topicHint`, `standardProblem`, `mappingExplanation`, `solutionApproach`
   - `codeSolution`, `complexity`, `edgeCases`
3. Save and refresh the page.
4. The selector, metadata chips, reveal flow, and search will work automatically.

## Why This Is A Strong Software-Engineering Challenge Design Sample
- Demonstrates clear decomposition between data model, UI state, and rendering helpers
- Shows thoughtful UX for educational progression rather than visual noise
- Balances extensibility with implementation simplicity (no overengineering)
- Uses deterministic frontend behavior suitable for evaluator-facing demos
- Presents algorithmic reasoning in a practical product context

## Future Improvements (Intentionally Lightweight)
- Add optional category quick-filters alongside search
- Add URL hash support for shareable deep links to specific problems
- Add a compact "session summary" of which sections were revealed
- Add optional dark theme while preserving accessibility contrast

## Professional Highlights
- Built as a static, framework-free educational interface with maintainable architecture
- Emphasizes reasoning transfer, a key competency for both interviews and AI benchmark design
- Designed with accessibility and readability as first-class UX goals
