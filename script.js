const problems = [
  {
    id: "service-to-service-routing",
    title: "Service-to-Service Routing",
    category: "Graphs / Shortest Path",
    difficulty: "Medium",
    patternName: "Unweighted Shortest Path",
    coreTechnique: "BFS",
    transferNote:
      "This problem hides a standard graph shortest-path task inside a microservices communication scenario. The challenge is to recognize that \"minimum hops between services\" is the same abstraction as \"minimum edges between nodes\" in an unweighted graph.",
    problemStatement:
      "A distributed system consists of multiple microservices. Each service can directly communicate with certain other services. Communication between directly connected services takes exactly 1 unit of time.\n\nGiven a list of service-to-service connections, determine the minimum number of hops required for a request to travel from a source service to a target service.\n\nIf no path exists, return -1.",
    constraints: [
      "1 <= number of services <= 10^5",
      "connections are unweighted",
      "graph may contain cycles",
      "graph is not necessarily fully connected"
    ],
    example:
      "Services: Auth, API, Cache, DB, Worker\n\nConnections:\nAuth -> API\nAPI -> Cache\nCache -> DB\nAuth -> Worker\nWorker -> DB\n\nSource: Auth\nTarget: DB\n\nOutput: 2\n\nExplanation: Auth -> Worker -> DB is the shortest path with 2 hops.",
    topicHint: "Graph Traversal",
    standardProblem: "Shortest path in an unweighted graph using Breadth-First Search (BFS)",
    mappingExplanation: [
      "each service = node in a graph",
      "each connection = edge",
      "each hop = distance of 1",
      "need minimum hops = shortest path in unweighted graph",
      "BFS guarantees shortest path when all edges have equal weight"
    ],
    solutionApproach: [
      "Use BFS starting from the source service.",
      "Maintain a queue and track distance for each node.",
      "Push the source node with distance 0.",
      "For each node, visit all unvisited neighbors and assign distance = current distance + 1.",
      "Stop when target is reached.",
      "If queue becomes empty before reaching target, return -1."
    ],
    codeSolution: `from collections import deque

def shortest_path(graph, start, target):
    queue = deque([(start, 0)])
    visited = set([start])

    while queue:
        node, dist = queue.popleft()

        if node == target:
            return dist

        for neighbor in graph[node]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append((neighbor, dist + 1))

    return -1`,
    complexity: {
      time: "O(V + E)",
      space: "O(V)"
    },
    edgeCases: [
      "source equals target",
      "no path exists",
      "graph contains cycles",
      "graph is disconnected",
      "multiple shortest paths exist",
      "service appears with no outgoing edges"
    ]
  },
  {
    id: "dependency-build-order",
    title: "Dependency Build Order",
    category: "Graphs",
    difficulty: "Medium",
    patternName: "Topological Ordering",
    coreTechnique: "Indegree + Queue",
    transferNote:
      "This problem turns a classic DAG ordering task into a build-system scenario. The key transfer is recognizing that build prerequisites form directed edges, and a valid compile order is exactly a topological sort.",
    problemStatement:
      "A build system must compile several modules. Some modules depend on others being built first.\nGiven a set of modules and dependency relationships, determine a valid order to build all modules. If no valid order exists, return that the dependency graph contains a cycle.",
    constraints: [
      "modules form a directed graph",
      "there may be multiple valid orders",
      "cycles are possible"
    ],
    example:
      "Modules: Parser, Lexer, AST, CodeGen\n\nDependencies:\nLexer -> Parser\nParser -> AST\nAST -> CodeGen\n\nOutput:\nLexer, Parser, AST, CodeGen",
    topicHint: "Directed Graphs",
    standardProblem: "Topological Sorting in a Directed Acyclic Graph",
    mappingExplanation: [
      "each module = node",
      "dependency A -> B means A must come before B",
      "need a valid build order = topological ordering",
      "cycle means impossible build order"
    ],
    solutionApproach: [
      "Compute indegree of each node.",
      "Push all nodes with indegree 0 into a queue.",
      "Repeatedly remove one, add it to the result, and reduce indegree of its outgoing neighbors.",
      "If all nodes are processed, return the ordering.",
      "Otherwise, a cycle exists."
    ],
    codeSolution: `from collections import deque, defaultdict

def topo_sort(modules, edges):
    graph = defaultdict(list)
    indegree = {m: 0 for m in modules}

    for u, v in edges:
        graph[u].append(v)
        indegree[v] += 1

    queue = deque([m for m in modules if indegree[m] == 0])
    order = []

    while queue:
        node = queue.popleft()
        order.append(node)

        for neighbor in graph[node]:
            indegree[neighbor] -= 1
            if indegree[neighbor] == 0:
                queue.append(neighbor)

    return order if len(order) == len(modules) else None`,
    complexity: {
      time: "O(V + E)",
      space: "O(V + E)"
    },
    edgeCases: [
      "cycle exists",
      "multiple valid orders",
      "disconnected components",
      "module with no dependencies",
      "module with no outgoing edges"
    ]
  },
  {
    id: "load-threshold-discovery",
    title: "Load Threshold Discovery",
    category: "Binary Search",
    difficulty: "Easy",
    patternName: "Binary Search on Answer",
    coreTechnique: "Monotonic Feasibility",
    transferNote:
      "This problem wraps binary search inside system-performance tuning. The main abstraction is that the system response changes monotonically with load, allowing us to search for the maximum feasible value efficiently.",
    problemStatement:
      "A backend team wants to find the maximum number of concurrent requests their service can handle while keeping latency within an SLA.\nThey have a function canHandle(x) that returns true if the system remains within the SLA at load x, and false otherwise.\nDetermine the maximum feasible load.",
    constraints: [
      "canHandle(x) is monotonic",
      "if system can handle x requests, it can handle all smaller values",
      "answer lies in a known integer range"
    ],
    example:
      "Search range: 1 to 100\nLargest load satisfying canHandle(x): 73\nOutput: 73",
    topicHint: "Binary Search on Answer",
    standardProblem: "Find maximum feasible value under a monotonic condition",
    mappingExplanation: [
      "load value = search space candidate",
      "canHandle(x) = feasibility function",
      "monotonic pass/fail behavior enables binary search",
      "need maximum valid x"
    ],
    solutionApproach: [
      "Binary search over the answer range.",
      "If canHandle(mid) is true, record mid and move right.",
      "Otherwise move left.",
      "Continue until the search range is exhausted."
    ],
    codeSolution: `def max_feasible_load(low, high, canHandle):
    ans = -1

    while low <= high:
        mid = (low + high) // 2
        if canHandle(mid):
            ans = mid
            low = mid + 1
        else:
            high = mid - 1

    return ans`,
    complexity: {
      time: "O(log N) feasibility checks",
      space: "O(1)"
    },
    edgeCases: [
      "no feasible load",
      "all loads feasible",
      "answer at lower bound",
      "answer at upper bound"
    ]
  },
  {
    id: "event-deduplication",
    title: "Event Deduplication",
    category: "Hashing",
    difficulty: "Easy",
    patternName: "Duplicate Detection",
    coreTechnique: "Hash Set",
    transferNote:
      "This problem reframes a standard duplicate-checking task as an event-processing reliability problem. The transferable idea is that duplicate detection becomes repeated membership checking, which a hash set handles efficiently.",
    problemStatement:
      "A logging pipeline receives a high volume of event IDs. Some events may be duplicated due to retries.\nDetermine whether any duplicate event ID appears in the stream.",
    constraints: [
      "event IDs may be strings or integers",
      "input may be large",
      "expected fast lookups"
    ],
    example:
      "Event IDs: [101, 203, 451, 203]\nOutput: true\nExplanation: Event ID 203 appears more than once.",
    topicHint: "Hash-Based Lookup",
    standardProblem: "Detect duplicates using a hash set",
    mappingExplanation: [
      "event stream = sequence of elements",
      "duplicate check = membership test",
      "hash set provides average O(1) lookup and insertion"
    ],
    solutionApproach: [
      "Iterate through the event IDs.",
      "If an ID is already in the set, return true.",
      "Otherwise insert it.",
      "If iteration completes, return false."
    ],
    codeSolution: `def has_duplicate(events):
    seen = set()

    for event in events:
        if event in seen:
            return True
        seen.add(event)

    return False`,
    complexity: {
      time: "O(n) average",
      space: "O(n)"
    },
    edgeCases: [
      "empty stream",
      "one element",
      "all unique",
      "duplicates far apart",
      "non-integer IDs"
    ]
  },
  {
    id: "error-burst-monitoring",
    title: "Error Burst Monitoring",
    category: "Sliding Window",
    difficulty: "Medium",
    patternName: "Longest Valid Window",
    coreTechnique: "Sliding Window",
    transferNote:
      "This problem expresses a subarray-optimization pattern as a monitoring task over request outcomes. The central transfer is seeing that \"longest contiguous period with at most k failures\" is the same as a bounded sliding-window problem.",
    problemStatement:
      "A monitoring system records whether each request in a timeline was successful (0) or failed (1).\nFind the longest contiguous time window containing at most k failures.",
    constraints: [
      "input is a binary array",
      "need contiguous segment",
      "optimize better than O(n^2)"
    ],
    example:
      "Errors: [0,1,0,0,1,1,0,0,0]\nk = 2\nOutput: 7\nExplanation: The longest valid window with at most 2 failures has length 7.",
    topicHint: "Two Pointers / Sliding Window",
    standardProblem: "Longest subarray with at most k bad values",
    mappingExplanation: [
      "timeline = array",
      "contiguous monitoring period = subarray",
      "failures = constrained bad values",
      "maximize valid segment length under a limit"
    ],
    solutionApproach: [
      "Use two pointers to maintain a window.",
      "Expand the right pointer.",
      "Track number of failures in the current window.",
      "While failures exceed k, move the left pointer forward.",
      "Update the best window length throughout."
    ],
    codeSolution: `def longest_window(errors, k):
    left = 0
    failures = 0
    best = 0

    for right in range(len(errors)):
        if errors[right] == 1:
            failures += 1

        while failures > k:
            if errors[left] == 1:
                failures -= 1
            left += 1

        best = max(best, right - left + 1)

    return best`,
    complexity: {
      time: "O(n)",
      space: "O(1)"
    },
    edgeCases: [
      "k = 0",
      "all successes",
      "all failures",
      "empty array",
      "longest window at the end"
    ]
  }
];

const revealConfig = [
  {
    buttonLabel: "Show Mapping Explanation",
    title: "Mapping Explanation",
    field: "mappingExplanation",
    type: "list"
  },
  {
    buttonLabel: "Show Solution Approach",
    title: "Solution Approach",
    field: "solutionApproach",
    type: "list"
  },
  { buttonLabel: "Show Code", title: "Code", field: "codeSolution", type: "code" },
  {
    buttonLabel: "Show Complexity & Edge Cases",
    title: "Complexity & Edge Cases",
    type: "complexityEdgeCases"
  }
];

const state = {
  selectedProblemId: problems[0].id,
  revealedByProblem: {},
  searchQuery: ""
};

function init() {
  bindSearch();
  ensureRevealState(state.selectedProblemId);
  renderApp();
}

function bindSearch() {
  const searchInput = document.getElementById("problem-search");
  if (!searchInput) return;

  searchInput.addEventListener("input", (event) => {
    state.searchQuery = event.target.value.trim().toLowerCase();
    ensureValidSelectionForFilter();
    renderApp();
  });
}

function ensureRevealState(problemId) {
  if (!problemId) return;
  if (!state.revealedByProblem[problemId]) {
    state.revealedByProblem[problemId] = new Set();
  }
}

function getFilteredProblems() {
  if (!state.searchQuery) return allProblems;

  return allProblems.filter((problem) => {
    const searchable = [
      problem.title,
      problem.category,
      problem.patternName,
      problem.coreTechnique,
      problem.difficulty
    ]
      .join(" ")
      .toLowerCase();

    return searchable.includes(state.searchQuery);
  });
}

function ensureValidSelectionForFilter() {
  const filtered = getFilteredProblems();

  if (filtered.length === 0) {
    state.selectedProblemId = null;
    return;
  }

  const isCurrentVisible = filtered.some((problem) => problem.id === state.selectedProblemId);
  if (isCurrentVisible) return;

  state.selectedProblemId = filtered[0].id;
  state.revealedByProblem[state.selectedProblemId] = new Set();
}

function getSelectedProblem() {
  if (!state.selectedProblemId) return null;
  return allProblems.find((problem) => problem.id === state.selectedProblemId) || null;
}

function getRevealedSet() {
  ensureRevealState(state.selectedProblemId);
  return state.revealedByProblem[state.selectedProblemId] || new Set();
}

function renderApp() {
  renderProblemList();
  renderProblemDetail();
}

function renderProblemList() {
  const listRoot = document.getElementById("problem-list-root");
  if (!listRoot) return;

  const filtered = getFilteredProblems();

  if (filtered.length === 0) {
    listRoot.innerHTML = '<p class="no-results">No problems match this search.</p>';
    return;
  }

  const list = document.createElement("ul");
  list.className = "problem-list";

  filtered.forEach((problem) => {
    const item = document.createElement("li");

    const button = document.createElement("button");
    button.type = "button";
    button.className = "problem-select";

    const isSelected = problem.id === state.selectedProblemId;
    button.classList.toggle("active", isSelected);
    button.setAttribute("aria-pressed", String(isSelected));
    button.setAttribute("aria-current", isSelected ? "true" : "false");
    button.setAttribute("aria-label", `Open problem: ${problem.title}`);

    const title = document.createElement("p");
    title.className = "problem-select-title";
    title.textContent = problem.title;

    const chipRow = document.createElement("div");
    chipRow.className = "problem-chip-row";

    const category = document.createElement("span");
    category.className = "category-pill";
    category.textContent = problem.category;

    const difficulty = buildDifficultyChip(problem.difficulty);

    chipRow.append(category, difficulty);
    button.append(title, chipRow);
    button.addEventListener("click", () => setSelectedProblem(problem.id));

    item.appendChild(button);
    list.appendChild(item);
  });

  listRoot.innerHTML = "";
  listRoot.appendChild(list);
}

function setSelectedProblem(problemId) {
  if (problemId === state.selectedProblemId) return;

  state.selectedProblemId = problemId;
  state.revealedByProblem[problemId] = new Set();
  renderApp();
}

function renderProblemDetail() {
  const detailRoot = document.getElementById("problem-detail-root");
  if (!detailRoot) return;

  const problem = getSelectedProblem();

  if (!problem) {
    detailRoot.innerHTML =
      '<p class="empty-detail">No problem selected. Adjust the search to see available problems.</p>';
    return;
  }

  const container = document.createElement("article");

  container.appendChild(buildProblemHeader(problem));
  container.appendChild(buildControlRow());
  container.appendChild(buildStaticSection("Problem Statement", problem.problemStatement));
  container.appendChild(buildStaticSection("Constraints", formatList(problem.constraints)));
  container.appendChild(buildStaticSection("Example", problem.example));
  container.appendChild(buildTransferBox(problem.transferNote));
  container.appendChild(buildRevealList(problem));

  detailRoot.innerHTML = "";
  detailRoot.appendChild(container);
}

function buildProblemHeader(problem) {
  const wrapper = document.createElement("section");

  const header = document.createElement("div");
  header.className = "problem-header";

  const title = document.createElement("h2");
  title.className = "problem-title";
  title.textContent = problem.title;

  const categoryPill = document.createElement("span");
  categoryPill.className = "category-pill";
  categoryPill.textContent = problem.category;

  header.append(title, categoryPill);

  const metaRow = document.createElement("div");
  metaRow.className = "meta-row";

  metaRow.appendChild(buildDifficultyChip(problem.difficulty));
  metaRow.appendChild(buildMetaChip("Pattern", problem.patternName));
  metaRow.appendChild(buildMetaChip("Technique", problem.coreTechnique));
  metaRow.appendChild(buildMetaChip("Standard", problem.standardProblem));

  wrapper.append(header, metaRow);
  return wrapper;
}

function buildMetaChip(label, value) {
  const chip = document.createElement("span");
  chip.className = "meta-chip";
  chip.textContent = `${label}: ${value}`;
  return chip;
}

function buildDifficultyChip(level) {
  const chip = document.createElement("span");
  chip.className = `difficulty-chip is-${level.toLowerCase()}`;
  chip.textContent = `Difficulty: ${level}`;
  return chip;
}

function buildControlRow() {
  const row = document.createElement("section");
  row.className = "controls-row";

  const revealAllBtn = document.createElement("button");
  revealAllBtn.type = "button";
  revealAllBtn.className = "control-btn";
  revealAllBtn.textContent = "Reveal All Sections";
  revealAllBtn.setAttribute("aria-label", "Reveal all hint sections for this problem");
  revealAllBtn.addEventListener("click", revealAllSections);

  const resetBtn = document.createElement("button");
  resetBtn.type = "button";
  resetBtn.className = "control-btn";
  resetBtn.textContent = "Collapse All Hints";
  resetBtn.setAttribute("aria-label", "Collapse all revealed hint sections for this problem");
  resetBtn.addEventListener("click", resetHints);

  row.append(revealAllBtn, resetBtn);
  return row;
}

function revealAllSections() {
  const set = new Set();
  for (let i = 0; i < revealConfig.length; i += 1) {
    set.add(i);
  }

  state.revealedByProblem[state.selectedProblemId] = set;
  renderProblemDetail();
}

function resetHints() {
  state.revealedByProblem[state.selectedProblemId] = new Set();
  renderProblemDetail();
}

function buildStaticSection(headingText, contentText) {
  const section = document.createElement("section");
  section.className = "section-group";

  const heading = document.createElement("h3");
  heading.className = "section-title";
  heading.textContent = headingText;

  const content = document.createElement("p");
  content.className = "content-block";
  content.textContent = contentText;

  section.append(heading, content);
  return section;
}

function buildTransferBox(transferNote) {
  const box = document.createElement("section");
  box.className = "transfer-box";

  const title = document.createElement("h3");
  title.className = "box-title";
  title.textContent = "Why This Is A Transfer Problem";

  const content = document.createElement("p");
  content.className = "box-content";
  content.textContent = transferNote;

  box.append(title, content);
  return box;
}

function buildRevealList(problem) {
  const wrapper = document.createElement("section");
  wrapper.className = "toggle-list";
  wrapper.setAttribute("aria-label", "Progressive reveal sections");

  revealConfig.forEach((config, index) => {
    const panelId = `${problem.id}-reveal-${index}`;
    const content = getRevealContent(problem, config);
    wrapper.appendChild(buildRevealItem(config.buttonLabel, config.title, panelId, content, index));
  });

  return wrapper;
}

function getRevealContent(problem, config) {
  if (config.type === "complexityEdgeCases") {
    const complexityText =
      typeof problem.complexity === "string"
        ? problem.complexity
        : `Time: ${problem.complexity.time}\nSpace: ${problem.complexity.space}`;

    return {
      type: "text",
      value: `Complexity:\n${complexityText}\n\nEdge Cases:\n${formatList(problem.edgeCases)}`
    };
  }

  if (config.type === "list") {
    return { type: "text", value: formatList(problem[config.field]) };
  }

  if (config.type === "code") {
    return { type: "code", value: problem[config.field] };
  }

  return { type: "text", value: problem[config.field] };
}

function buildRevealItem(buttonLabel, sectionTitle, panelId, content, revealIndex) {
  const wrapper = document.createElement("article");
  wrapper.className = "toggle-item";

  const button = document.createElement("button");
  button.type = "button";
  button.className = "toggle-btn";
  button.setAttribute("aria-controls", panelId);
  button.setAttribute("aria-label", `${buttonLabel} for ${getSelectedProblem().title}`);

  const label = document.createElement("span");
  label.className = "toggle-label";
  label.textContent = buttonLabel;

  const symbol = document.createElement("span");
  symbol.className = "toggle-symbol";

  button.append(label, symbol);

  const contentWrap = document.createElement("div");
  contentWrap.className = "toggle-content";

  const contentInner = document.createElement("div");
  contentInner.className = "toggle-content-inner";

  const body = document.createElement("div");
  body.className = "toggle-body";
  body.id = panelId;

  const heading = document.createElement("h3");
  heading.className = "section-title";
  heading.textContent = sectionTitle;

  body.appendChild(heading);

  if (content.type === "code") {
    const pre = document.createElement("pre");
    pre.className = "code-block";

    const code = document.createElement("code");
    code.textContent = content.value;

    pre.appendChild(code);
    body.appendChild(pre);
  } else {
    const paragraph = document.createElement("p");
    paragraph.className = "content-block";
    paragraph.textContent = content.value;
    body.appendChild(paragraph);
  }

  contentInner.appendChild(body);
  contentWrap.appendChild(contentInner);

  const isExpanded = getRevealedSet().has(revealIndex);
  syncRevealUI(wrapper, button, symbol, isExpanded);

  button.addEventListener("click", () => {
    const set = getRevealedSet();
    if (set.has(revealIndex)) {
      set.delete(revealIndex);
    } else {
      set.add(revealIndex);
    }
    renderProblemDetail();
  });

  wrapper.append(button, contentWrap);
  return wrapper;
}

function syncRevealUI(wrapper, button, symbol, isExpanded) {
  button.setAttribute("aria-expanded", String(isExpanded));
  symbol.textContent = isExpanded ? "-" : "+";
  wrapper.classList.toggle("expanded", isExpanded);
}

function formatList(items) {
  if (typeof items === "string") return items;
  return items.map((item) => `- ${item}`).join("\n");
}

const additionalProblems = [
  {
    id: "ring-buffer-index-normalization",
    title: "Ring Buffer Index Normalization",
    category: "Math / Modulo Arithmetic",
    difficulty: "Easy",
    patternName: "Cyclic Index Mapping",
    coreTechnique: "Modulo Normalization",
    topicHint: "Modulo Arithmetic",
    standardProblem: "Normalize a signed index into a circular array",
    problemStatement: `A telemetry service stores events in a fixed-size ring buffer of length n.
Given a current cursor position and a signed jump offset (which may be very large), return the final cursor index after wrapping around the ring.`,
    constraints: `- 1 <= n <= 10^9
- -10^18 <= offset <= 10^18
- 0 <= cursor < n`,
    example: `n = 8
cursor = 2
offset = -11

Output: 7`,
    mappingExplanation: `- ring positions form a cycle
- movement with wraparound is modular arithmetic
- normalize signed movement into [0, n-1]`,
    solutionApproach: `Use modular arithmetic on cursor + offset.
Return ((cursor + offset) % n + n) % n when needed.
In Python, (cursor + offset) % n is already normalized for positive n.`,
    codeSolution: `def normalized_index(n, cursor, offset):
    return (cursor + offset) % n`,
    complexity: { time: "O(1)", space: "O(1)" },
    edgeCases: ["n = 1", "very large negative offset", "offset = 0"],
    transferNote: `A practical ring-buffer cursor update maps directly to cyclic index normalization with modulo arithmetic.`
  },
  {
    id: "oauth-scope-subset-validation",
    title: "OAuth Scope Subset Validation",
    category: "Bit Masking / Security",
    difficulty: "Easy",
    patternName: "Subset Check With Bitmask",
    coreTechnique: "Bitwise AND",
    topicHint: "Bit Operations",
    standardProblem: "Check if one bitset is a subset of another",
    problemStatement: `An API gateway encodes granted OAuth scopes as a bitmask.
A request declares required scopes as another bitmask.
Return true if the token includes all required scopes, otherwise false.`,
    constraints: `- masks fit in unsigned 64-bit integers
- 0 <= requiredMask, tokenMask < 2^64`,
    example: `requiredMask = 0b010101
tokenMask    = 0b110111

Output: true`,
    mappingExplanation: `- each scope is one bit
- required scopes are set A
- token scopes are set B
- need A subset of B => (B & A) == A`,
    solutionApproach: `Compute tokenMask & requiredMask.
If result equals requiredMask, all required scopes exist.
Otherwise one or more required scopes are missing.`,
    codeSolution: `def has_required_scopes(requiredMask, tokenMask):
    return (tokenMask & requiredMask) == requiredMask`,
    complexity: { time: "O(1)", space: "O(1)" },
    edgeCases: ["requiredMask = 0", "tokenMask = 0", "exact match", "extra token scopes"],
    transferNote: `Policy validation in auth systems maps cleanly to a constant-time subset check over bitsets.`
  },
  {
    id: "ledger-range-netflow-queries",
    title: "Ledger Range Netflow Queries",
    category: "Prefix Sums / Analytics",
    difficulty: "Easy",
    patternName: "Range Sum Query",
    coreTechnique: "1D Prefix Sum",
    topicHint: "Prefix Sums",
    standardProblem: "Static range sum over an array",
    problemStatement: `A billing ledger stores daily netflow values (positive revenue, negative refunds).
You must answer many queries of the form [l, r]: total netflow between day l and day r inclusive.`,
    constraints: `- 1 <= n, q <= 2 * 10^5
- -10^6 <= netflow[i] <= 10^6
- 0 <= l <= r < n`,
    example: `netflow = [5, -2, 4, -1, 3]
queries = [(0, 2), (1, 4)]

Output: [7, 4]`,
    mappingExplanation: `- daily values form an array
- each query is a contiguous range sum
- prefix sums reduce each query to one subtraction`,
    solutionApproach: `Precompute prefix[i+1] = prefix[i] + netflow[i].
For each query [l, r], return prefix[r+1] - prefix[l].`,
    codeSolution: `def range_netflow(netflow, queries):
    prefix = [0]
    for x in netflow:
        prefix.append(prefix[-1] + x)
    return [prefix[r + 1] - prefix[l] for l, r in queries]`,
    complexity: { time: "O(n + q)", space: "O(n)" },
    edgeCases: ["single-day range", "all negative values", "range starts at 0"],
    transferNote: `Cumulative accounting tasks often hide range-sum query patterns that are best solved with prefix sums.`
  },
  {
    id: "deployment-workflow-cycle-alert",
    title: "Deployment Workflow Cycle Alert",
    category: "Graph Traversal / Reliability",
    difficulty: "Medium",
    patternName: "Directed Cycle Detection",
    coreTechnique: "DFS Color Marking",
    topicHint: "Graph Traversal",
    standardProblem: "Cycle detection in a directed graph",
    problemStatement: `A release orchestrator stores directed workflow dependencies between deployment stages.
If any cycle exists, the workflow can deadlock.
Given all stage dependencies, return true if a cycle exists, otherwise false.`,
    constraints: `- up to 10^5 stages
- up to 2 * 10^5 directed edges
- graph may be disconnected`,
    example: `stages = ["Build", "Scan", "Deploy"]
edges = [("Build", "Scan"), ("Scan", "Deploy"), ("Deploy", "Build")]

Output: true`,
    mappingExplanation: `- stages are nodes and dependencies are directed edges
- deadlock risk corresponds to a directed cycle
- DFS back-edge detection solves it`,
    solutionApproach: `Use DFS with states: unvisited, visiting, done.
If DFS reaches a visiting node, a cycle exists.
Run DFS from every unvisited node.`,
    codeSolution: `from collections import defaultdict

def has_cycle(stages, edges):
    idx = {s: i for i, s in enumerate(stages)}
    g = defaultdict(list)
    for u, v in edges:
        g[idx[u]].append(idx[v])

    state = [0] * len(stages)

    def dfs(u):
        if state[u] == 1:
            return True
        if state[u] == 2:
            return False
        state[u] = 1
        for v in g[u]:
            if dfs(v):
                return True
        state[u] = 2
        return False

    for i in range(len(stages)):
        if state[i] == 0 and dfs(i):
            return True
    return False`,
    complexity: { time: "O(V + E)", space: "O(V + E)" },
    edgeCases: ["self-loop", "disconnected graph", "no edges"],
    transferNote: `A release-management scenario maps directly to directed cycle detection in dependency graphs.`
  },
  {
    id: "consistent-hash-owner-lookup",
    title: "Consistent Hash Owner Lookup",
    category: "Binary Search / Distributed Systems",
    difficulty: "Medium",
    patternName: "Lower Bound With Wraparound",
    coreTechnique: "Binary Search on Sorted Ring",
    topicHint: "Binary Search",
    standardProblem: "Lower bound lookup with circular wrap",
    problemStatement: `A distributed cache uses consistent hashing with sorted token positions on a ring.
For each request hash h, return the first token >= h, or the first token if none is >= h.`,
    constraints: `- 1 <= tokens, queries <= 2 * 10^5
- tokens are sorted and unique`,
    example: `tokens = [10, 25, 60, 88]
queries = [5, 60, 77, 99]

Output: [10, 60, 88, 10]`,
    mappingExplanation: `- ownership means next clockwise token
- next clockwise token is lower_bound on sorted tokens
- if missing, wrap to index 0`,
    solutionApproach: `Use binary search (bisect_left) for each query.
If index equals length, wrap to 0.
Return token at resolved index.`,
    codeSolution: `from bisect import bisect_left

def owner_lookup(tokens, queries):
    n = len(tokens)
    out = []
    for h in queries:
        i = bisect_left(tokens, h)
        if i == n:
            i = 0
        out.append(tokens[i])
    return out`,
    complexity: { time: "O(q log n)", space: "O(1)" },
    edgeCases: ["query below minimum", "query above maximum", "exact token hit", "single token"],
    transferNote: `This looks like infrastructure routing, but the core logic is a lower-bound binary search with circular fallback.`
  },
  {
    id: "sharded-backoff-power-mod",
    title: "Sharded Backoff Power Mod",
    category: "Binary Exponentiation / Systems",
    difficulty: "Medium",
    patternName: "Fast Modular Exponentiation",
    coreTechnique: "Exponentiation by Squaring",
    topicHint: "Binary Exponentiation",
    standardProblem: "Compute a^b mod m efficiently",
    problemStatement: `A retry scheduler computes backoff slots as (base^attempt) mod modValue.
attempt can be extremely large.
Return the modular power efficiently.`,
    constraints: `- 0 <= attempt <= 10^18
- 1 <= modValue < 2^63`,
    example: `base = 7
attempt = 13
modValue = 1000

Output: 407`,
    mappingExplanation: `- direct multiplication is too slow
- exponent bits define which powers contribute
- repeated squaring gives logarithmic exponent handling`,
    solutionApproach: `Maintain result and current base modulo modValue.
If exponent bit is set, multiply result.
Square base each step and shift exponent right.`,
    codeSolution: `def mod_pow(base, attempt, modValue):
    result = 1
    base %= modValue
    while attempt > 0:
        if attempt & 1:
            result = (result * base) % modValue
        base = (base * base) % modValue
        attempt >>= 1
    return result`,
    complexity: { time: "O(log attempt)", space: "O(1)" },
    edgeCases: ["attempt = 0", "base = 0", "modValue = 1"],
    transferNote: `A production retry formula hides a classic fast-power computation problem.`
  },
  {
    id: "permission-toggle-audit-stream",
    title: "Permission Toggle Audit Stream",
    category: "Bit Masking / State Tracking",
    difficulty: "Medium",
    patternName: "Bit-State Updates",
    coreTechnique: "XOR Toggle + Subset Validation",
    topicHint: "Bitmask State Representation",
    standardProblem: "Online bit toggles with subset checks",
    problemStatement: `A platform stores permissions as a bitmask.
You receive toggle operations (flip one bit).
After each toggle, report whether all bits in requiredMask are still enabled.`,
    constraints: `- q up to 2 * 10^5
- bit index in [0, 63]`,
    example: `initialMask = 0b1110
requiredMask = 0b0110
toggles = [0, 1, 3]

Output: [true, false, false]`,
    mappingExplanation: `- permission state is bitset
- toggle is XOR with one-bit mask
- validity check is subset test with bitwise AND`,
    solutionApproach: `Update current mask with XOR per toggle.
After each update, evaluate (current & requiredMask) == requiredMask.
Collect boolean outputs.`,
    codeSolution: `def permission_audit(initialMask, requiredMask, toggles):
    current = initialMask
    out = []
    for b in toggles:
        current ^= (1 << b)
        out.append((current & requiredMask) == requiredMask)
    return out`,
    complexity: { time: "O(q)", space: "O(1)" },
    edgeCases: ["requiredMask = 0", "same bit toggled repeatedly", "initially invalid state"],
    transferNote: `A policy-audit stream maps to incremental bitset updates with constant-time checks.`
  },
  {
    id: "campaign-balance-interval-checks",
    title: "Campaign Balance Interval Checks",
    category: "Prefix Sums / Finance Analytics",
    difficulty: "Medium",
    patternName: "Interval Comparison via Prefix Sums",
    coreTechnique: "Net Prefix Accounting",
    topicHint: "Prefix Sums",
    standardProblem: "Interval sum threshold checks",
    problemStatement: `An ad platform tracks daily spend and credited revenue.
For each query [l, r], determine whether revenue - spend over that interval is at least targetMargin.`,
    constraints: `- 1 <= n, q <= 2 * 10^5
- 0 <= l <= r < n`,
    example: `spend   = [7, 3, 6, 2]
revenue = [9, 1, 8, 4]
queries = [(0, 1, -1), (1, 3, 2)]

Output: [true, true]`,
    mappingExplanation: `- per-day net is revenue - spend
- each query asks interval net >= threshold
- prefix sums make interval net O(1)`,
    solutionApproach: `Build net and its prefix sums.
For each query, compute prefix[r+1] - prefix[l].
Compare result with target margin.`,
    codeSolution: `def campaign_margin_checks(spend, revenue, queries):
    net = [r - s for s, r in zip(spend, revenue)]
    prefix = [0]
    for x in net:
        prefix.append(prefix[-1] + x)
    return [(prefix[r + 1] - prefix[l]) >= m for l, r, m in queries]`,
    complexity: { time: "O(n + q)", space: "O(n)" },
    edgeCases: ["negative target margin", "single-day interval", "all negative net"],
    transferNote: `Financial interval checks hide a standard prefix-sum comparison pattern.`
  },
  {
    id: "blast-radius-articulation-analysis",
    title: "Blast Radius Articulation Analysis",
    category: "Graph Traversal / Infrastructure",
    difficulty: "Hard",
    patternName: "Articulation Point Detection",
    coreTechnique: "DFS Low-Link Values",
    topicHint: "Graph Traversal",
    standardProblem: "Find articulation points in an undirected graph",
    problemStatement: `An internal service mesh is an undirected graph.
A service is critical if removing it increases disconnected components.
Return all critical services.`,
    constraints: `- 1 <= V <= 2 * 10^5
- 0 <= E <= 3 * 10^5
- graph may be disconnected`,
    example: `V = 5
edges = [(0,1), (1,2), (2,0), (1,3), (3,4)]

Output: [1, 3]`,
    mappingExplanation: `- critical services correspond to articulation points
- low-link DFS identifies whether child subtree can bypass parent`,
    solutionApproach: `Run DFS with discovery and low arrays.
Apply articulation rules for root and non-root nodes.
Collect all nodes that satisfy articulation conditions.`,
    codeSolution: `from collections import defaultdict

def articulation_points(v, edges):
    g = defaultdict(list)
    for a, b in edges:
        g[a].append(b)
        g[b].append(a)

    disc = [-1] * v
    low = [0] * v
    parent = [-1] * v
    timer = 0
    cut = set()

    def dfs(u):
        nonlocal timer
        disc[u] = low[u] = timer
        timer += 1
        children = 0
        for w in g[u]:
            if disc[w] == -1:
                parent[w] = u
                children += 1
                dfs(w)
                low[u] = min(low[u], low[w])
                if parent[u] != -1 and low[w] >= disc[u]:
                    cut.add(u)
            elif w != parent[u]:
                low[u] = min(low[u], disc[w])
        if parent[u] == -1 and children > 1:
            cut.add(u)

    for i in range(v):
        if disc[i] == -1:
            dfs(i)
    return sorted(cut)`,
    complexity: { time: "O(V + E)", space: "O(V + E)" },
    edgeCases: ["no edges", "single node", "fully connected graph", "multiple components"],
    transferNote: `Resilience analysis in service meshes maps to articulation-point theory in graph algorithms.`
  },
  {
    id: "parallel-rebuild-batch-sizing",
    title: "Parallel Rebuild Batch Sizing",
    category: "Binary Search / Scheduling",
    difficulty: "Hard",
    patternName: "Minimize Maximum Partition Sum",
    coreTechnique: "Binary Search + Greedy Partition",
    topicHint: "Binary Search on Answer",
    standardProblem: "Split array into k contiguous parts minimizing largest sum",
    problemStatement: `A platform rebuilds shards in fixed order.
Each shard has rebuild time t[i].
With k workers, each worker gets one contiguous shard block.
Find the minimum possible maximum worker time.`,
    constraints: `- 1 <= n <= 2 * 10^5
- 1 <= k <= n
- 1 <= t[i] <= 10^9`,
    example: `t = [7, 2, 5, 10, 8]
k = 2

Output: 18`,
    mappingExplanation: `- contiguous assignment implies array partitioning
- objective is minimize largest partition sum
- feasibility of candidate max load is monotonic`,
    solutionApproach: `Binary search on max allowed partition sum.
Greedily count partitions needed for each candidate.
If partitions <= k, candidate is feasible and search left.
Else search right.`,
    codeSolution: `def min_max_rebuild_time(t, k):
    def feasible(limit):
        workers = 1
        current = 0
        for x in t:
            if current + x <= limit:
                current += x
            else:
                workers += 1
                current = x
                if workers > k:
                    return False
        return True

    lo, hi = max(t), sum(t)
    ans = hi
    while lo <= hi:
        mid = (lo + hi) // 2
        if feasible(mid):
            ans = mid
            hi = mid - 1
        else:
            lo = mid + 1
    return ans`,
    complexity: { time: "O(n log(sum(t)))", space: "O(1)" },
    edgeCases: ["k = 1", "k = n", "one shard dominates", "uniform shard times"],
    transferNote: `A scheduling optimization task maps to partition minimization with monotonic feasibility and binary search.`
  }
];

const allProblems = [...problems, ...additionalProblems];

init();
