export const owner = {
  name: "Ayan Kawlekar",
  positioning:
    "Sophomore at Berkeley studying applied math and data science. Interested in AI agents and infrastructure. Strong data science and backend fundamentals with previous experience as a swe @ seed chip-design startup and @ pe fund. Looking to join fast-paced teams working on building innovative agentic products.",
  availability: "Open to working Winter & Summer 2027.",
  location: "Berkeley, California",
  interests: "AI/ML · robotics · finance · startups",
  currently: "PM intern @ Oracle — agentic demos on the 26ai database",
  forFun: "Learning to golf",
  email: "ayan_kawlekar@berkeley.edu",
  github: "https://github.com/AYANKAWLEKAR",
  linkedin: "https://www.linkedin.com/in/ayan-kawlekar",
};

export type ExperienceEntry = {
  role: string;
  organization: string;
  dates: string;
  summary: string;
  detail: string;
};

export const experience: ExperienceEntry[] = [
  {
    role: "Product Management Intern",
    organization: "Oracle",
    dates: "Jun 2026 — Present",
    summary:
      "Formulating a demo AI agent on the 26ai database — context engineering through multi-hop traversal and three memory modalities.",
    detail:
      "In-database semantic retrieval with DBMS_VECTOR and ONNX MiniLM embeddings over a 50,000+ document career corpus, wrapped with observability for a React/Next.js demo planned for 50+ sales calls.",
  },
  {
    role: "AI Intern",
    organization: "Origo Capital",
    dates: "May 2026 — Present",
    summary:
      "Developing Python AI agents that automate sourcing and screening of 100+ lower-middle-market buyout targets ($1–5M EBITDA).",
    detail:
      "Support financial diligence — drafting CIMs and internal investment decks — and maintain KPI tracking across the existing portfolio.",
  },
  {
    role: "Product Development Intern",
    organization: "ChipChop (Antler backed)",
    dates: "Feb 2026 — Present",
    summary:
      "Architecting a multi-agent workflow for FPGA design that transforms user requests and initial documents into RTL code.",
    detail:
      "Designed a proprietary debugging agent that assesses evidence and routes custom tests across agents (70% bug coverage); orchestrate containerized RTL simulations on Kubernetes with shared agent memory over a custom data store.",
  },
  {
    role: "Machine Learning Research Assistant",
    organization: "Berkeley Nanotechnology Lab",
    dates: "Sep 2025 — May 2026",
    summary:
      "Designed PyTorch models to classify lithography manufacturing data and optimize machine parameters.",
    detail:
      "Built a SEMI SECS/GEM extraction protocol standardizing tool output, and fine-tuned Llama-3 on 9,000+ lab samples for an internal agent that onboards members and queries past trials.",
  },
  {
    role: "Software Engineer, Contract",
    organization: "Visa",
    dates: "Sep 2025 — Dec 2025",
    summary:
      "Created AI web-scraping tools validating 1,600+ VCIS financial institutions against European regulators.",
    detail:
      "Playwright and Pydantic backend scripts with OpenAI-assisted validation, plus a Dockerized ETL workflow ingesting Excel exports and generating JSON/XLSX reconciliation reports.",
  },
  {
    role: "Robotics Research Assistant",
    organization: "Rutgers PRACSYS Lab",
    dates: "Jun 2024 — Jan 2025",
    summary:
      "Deployed a multimodal computer-vision pipeline for industrial decision-making across 340K+ RGB, depth, and segmentation scenes.",
    detail:
      "Trained and ablated MultiMAE visual encoders on AWS SageMaker; exported via TorchScript to benchmark inference latency for ROS-based deployment.",
  },
];

export type ProjectEntry = {
  index: string;
  title: string;
  thesis: string;
  stack: string;
  outcome: string;
  link: string;
};

export const projects: ProjectEntry[] = [
  {
    index: "01",
    link: "https://github.com/AYANKAWLEKAR/RL",
    title: "StockSmart",
    thesis:
      "A retail restocking system that pairs a Temporal Fusion Transformer forecaster with a reinforcement-learning ordering policy.",
    stack: "Python · PyTorch · Stable-Baselines",
    outcome:
      "DQN agent trained across five product categories to time restock order placement against forecasted demand.",
  },
  {
    index: "02",
    link: "https://github.com/AYANKAWLEKAR/SourcingEngine",
    title: "Private Equity Sourcing Engine",
    thesis:
      "A tool-calling LLM agent and pgvector RAG retriever that convert natural-language buy-boxes into executable filter rulesets.",
    stack: "Python · DuckDB · pgvector",
    outcome:
      "Queries 4.4M corporate records in under 15ms; entity resolution reaches 95% ABN match accuracy, feeding a 3-tier scoring pipeline with Claude moat judging.",
  },
  {
    index: "03",
    link: "https://github.com/AYANKAWLEKAR/MemCache",
    title: "Memcache API",
    thesis:
      "Episodic memory infrastructure for long-running personal agents, improving context quality at retrieval time.",
    stack: "FastAPI · Celery · Redis · Neo4j",
    outcome:
      "Celery-driven summarization with Redis conversation caching and a Neo4j graph of entity and episode relations.",
  },
];

export type Favorite = {
  label: string;
  /** Drop a file in /public and set the path here to fill the frame. */
  image?: string;
  alt?: string;
  /** Focal point for the square crop, as an object-position value. */
  focus?: string;
};

export const favorites: Favorite[] = [
  {
    label: "My favorite artist",
    image: "/favorites/tame-impala-currents.jpeg",
    alt: "Tame Impala, Currents album art",
  },
  {
    label: "My favorite show",
    image: "/favorites/game-of-thrones.jpeg",
    alt: "Game of Thrones artwork: Jon Snow with the direwolf Ghost",
    focus: "center 28%",
  },
  {
    label: "My favorite video game",
    image: "/favorites/warframe.jpeg",
    alt: "Warframe artwork: an armored warframe on a hillside",
    focus: "center 21%",
  },
];

export const about = {
  paragraphs: [
    "Placeholder: background and technical direction — where you come from mathematically and what kinds of problems pull you in.",
    "Placeholder: the kinds of systems and products you build — agents, ML/data systems, full-stack tools — and how you approach building them.",
    "Placeholder: current intellectual interests — what you are reading, studying, or circling right now.",
  ],
  now: [
    "Placeholder: a current project or experiment.",
    "Placeholder: something you are learning or researching.",
    "Placeholder: something you are reading.",
  ],
};
