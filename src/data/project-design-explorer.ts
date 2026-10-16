export type ExplorerNode = {
  id: string;
  label: string;
  kind: string;
  detail: string;
};

export type ProjectDesign = {
  id: string;
  title: string;
  summary: string;
  statusNote?: string;
  overview: ExplorerNode[];
  services: { name: string; role: string }[];
  database: {
    label: string;
    note: string;
    schemaKey?: string;
    associations?: { id: string; from: string; fromColumn: string; to: string; toColumn: string; label: string }[];
  };
};

export const PROJECT_DESIGNS: ProjectDesign[] = [
  {
    id: "ai-lms",
    title: "AI Learning Management System",
    summary: "A guided study workflow that turns a topic into organized course material and practice.",
    overview: [
      { id: "learner", label: "Learner", kind: "Input", detail: "Chooses a topic, course type, and difficulty." },
      { id: "course", label: "Course outline", kind: "Planning", detail: "The application builds a chapter and topic structure for the selected study goal." },
      { id: "generation", label: "AI generation", kind: "Orchestration", detail: "Gemini generates notes, flashcards, quizzes, or question sets; Inngest coordinates longer jobs." },
      { id: "study", label: "Study workspace", kind: "Output", detail: "Generated material is stored and presented in a sample course preview." },
    ],
    services: [
      { name: "Web application", role: "Collects a study goal and presents courses and generated learning material." },
      { name: "Authentication", role: "Clerk provides sign-in for the full application." },
      { name: "Generation workflow", role: "Gemini creates study content while Inngest coordinates longer-running work." },
      { name: "Persistence", role: "Drizzle ORM stores application data in Neon PostgreSQL." },
    ],
    database: {
      label: "4 tables · 0 declared foreign keys",
      note: "Schema read from the project’s Drizzle definitions. courseId is used across content records, but the source does not declare database foreign keys.",
      schemaKey: "ai-learning-management",
      associations: [
        { id: "course-notes", from: "studyMaterial", fromColumn: "courseId", to: "chapterNotes", toColumn: "courseId", label: "Shared courseId · no declared FK" },
        { id: "course-content", from: "studyMaterial", fromColumn: "courseId", to: "studyTypeContent", toColumn: "courseId", label: "Shared courseId · no declared FK" },
      ],
    },
  },
  {
    id: "researchpaper-ai",
    title: "ResearchPaper AI",
    summary: "A document-to-answer workflow that retrieves paper passages and returns page-cited responses.",
    overview: [
      { id: "pdf", label: "PDF pages", kind: "Input", detail: "The backend extracts document text page by page." },
      { id: "chunks", label: "Chunks + embeddings", kind: "Preparation", detail: "Text is split into overlapping passages and embedded for semantic retrieval." },
      { id: "faiss", label: "FAISS retrieval", kind: "Search", detail: "Relevant passages are retrieved from the vector index for a reader’s question." },
      { id: "answer", label: "Cited response", kind: "Output", detail: "The model answers from retrieved passages and includes page citations; conversation history is stored in SQLite." },
    ],
    services: [
      { name: "FastAPI routes", role: "Expose document and question workflows to the application." },
      { name: "Document processing", role: "Extracts page-aware text, chunks it, and prepares embeddings." },
      { name: "Retrieval and generation", role: "Uses FAISS search to ground generated answers in retrieved passages." },
      { name: "Conversation persistence", role: "SQLite stores documents, conversations, and messages; the public preview uses prepared sample content." },
    ],
    database: {
      label: "3 tables · 1 documented relation",
      note: "SQLite conversation records are separate from the FAISS vector index. The project source documents messages.conversation_id referencing conversations.id.",
      schemaKey: "researchpaper-ai",
    },
  },
  {
    id: "foodfolk",
    title: "Foodfolk",
    summary: "A restaurant map with a separate persistent social API for accounts, reviews, friendships, photos, and saved places.",
    overview: [
      { id: "map", label: "Restaurant map", kind: "Explore", detail: "Visitors search and filter places on a Leaflet map using OpenStreetMap data." },
      { id: "place", label: "Place details", kind: "Discover", detail: "Restaurant information and reviews connect a place to recommendations." },
      { id: "social", label: "Social records", kind: "Backend", detail: "The Node API models accounts, friendships, reviews, saved places, and photos in SQLite." },
      { id: "passport", label: "Food passport", kind: "Revisit", detail: "The interface brings saved and reviewed places back into a personal history." },
    ],
    services: [
      { name: "Map interface", role: "Leaflet renders places and discovery filters using OpenStreetMap data." },
      { name: "Place search", role: "Photon and Overpass support restaurant and neighbourhood lookup." },
      { name: "Social API", role: "The Node server handles account, friendship, review, save, and photo records." },
      { name: "Persistence", role: "SQLite backs the full social API; the public preview uses seeded browser-local activity." },
    ],
    database: {
      label: "7 tables · 9 declared relations",
      note: "Source-defined SQLite schema for the persistent backend. The public Food Map preview uses sample activity in the browser.",
      schemaKey: "foodfolk",
    },
  },
  {
    id: "fieldnote-commerce-intelligence",
    title: "Fieldnote — Commerce Intelligence",
    summary: "A local analytics snapshot powers views of the order funnel, customer cohorts, category mix, and delivery timing.",
    statusNote: "The public page is a static visual preview; the repository dashboard runs locally with synthetic sample data.",
    overview: [
      { id: "source", label: "Synthetic source", kind: "Input", detail: "A compatible SQLite database supplies generated marketplace records. The source database itself is not bundled with the repository." },
      { id: "builder", label: "Snapshot builder", kind: "Aggregation", detail: "A Python script calculates order, customer, category, and delivery measures. Order-level delivery facts are aggregated before product joins." },
      { id: "snapshot", label: "Analytics snapshot", kind: "Data", detail: "The included JSON file holds the calculated measures and provenance for offline browsing." },
      { id: "dashboard", label: "Dashboard views", kind: "Interface", detail: "The repository application presents overview, funnel, cohort, fulfillment, and data-definition views. The public page shows a static visual preview." },
    ],
    services: [
      { name: "Snapshot builder", role: "Python reads a compatible SQLite source and writes the bundled analytics JSON." },
      { name: "Metric queries", role: "PostgreSQL reference SQL documents funnel, cohort, category, and delivery calculations with explicit filters and denominators." },
      { name: "Local data layer", role: "The repository dashboard reads a generated JSON snapshot; no live database connection or credentials are required to explore it." },
      { name: "Dashboard interface", role: "Next.js renders read-only analytics views, time and region controls, metric definitions, and filtered JSON export in the repository app." },
    ],
    database: {
      label: "5 query-referenced tables · 4 documented SQL joins",
      note: "The bundled snapshot lists nine synthetic source tables. This diagram shows the five tables and four joins verified in the supplied SQL; the full source DDL and declared foreign keys are unavailable.",
      schemaKey: "fieldnote-commerce-intelligence",
      associations: [
        { id: "orders-customers", from: "orders", fromColumn: "customer_id", to: "customers", toColumn: "customer_id", label: "Cohort query JOIN · no declared FK in source" },
        { id: "items-orders", from: "order_items", fromColumn: "order_id", to: "orders", toColumn: "order_id", label: "Category query JOIN · no declared FK in source" },
        { id: "items-products", from: "order_items", fromColumn: "product_id", to: "products", toColumn: "product_id", label: "Category query JOIN · no declared FK in source" },
        { id: "products-translations", from: "products", fromColumn: "product_category_name", to: "product_category_name_translation", toColumn: "product_category_name", label: "Category query LEFT JOIN · no declared FK in source" },
      ],
    },
  },
  {
    id: "ledgerline-credit-risk-scorecard",
    title: "Ledgerline — Credit Risk Scorecard",
    summary: "An illustrative analyst workspace for portfolio exposure, scorecard interpretation, scenario sensitivity, and hypothetical scoring.",
    statusNote: "The public demo uses synthetic examples; the training pipeline and SQL schema are separate repository foundations.",
    overview: [
      { id: "portfolio", label: "Portfolio overview", kind: "Explore", detail: "Review illustrative exposure, expected loss, default rate, application activity, and model-health indicators." },
      { id: "scorecard", label: "Scorecard studio", kind: "Interpret", detail: "Inspect feature information value, WOE bins, and a plain-language methodology panel." },
      { id: "stress", label: "Stress scenarios", kind: "Compare", detail: "Change interest-rate or unemployment assumptions to see illustrative expected-loss sensitivity." },
      { id: "decision", label: "Decision lab", kind: "Try", detail: "Enter a hypothetical profile to calculate a local example score and risk band; no real lending decision is made." },
    ],
    services: [
      { name: "Dashboard client", role: "Next.js renders the portfolio views, example application queue, scorecard studio, stress controls, and hypothetical scoring lab." },
      { name: "Modeling pipeline", role: "Separate Python scripts generate synthetic development data and train a logistic-regression scorecard with WOE/IV analysis." },
      { name: "Analytical SQL", role: "A PostgreSQL-style schema separates applications, matured outcomes, scorecard bins, and validation records; reference queries support reporting." },
      { name: "Reporting definitions", role: "Power BI DAX measures document portfolio calculations. The public dashboard does not connect to a lender system or production model." },
    ],
    database: {
      label: "4 tables · 1 declared foreign key",
      note: "The repository includes a PostgreSQL-style development schema. It declares performance_outcome.application_id as both primary key and foreign key to application.application_id. The live demo uses illustrative client data, not this database.",
      schemaKey: "ledgerline-credit-risk-scorecard",
    },
  },
  {
    id: "signal-telecom-churn-analytics",
    title: "Signal — Telecom Churn Analytics",
    summary: "A static, interactive sample-data workspace for churn, revenue risk, survival, cohorts, services, and example customers.",
    statusNote: "Representative dashboard values are defined in source; no verified subscriber dataset or live data connection is included.",
    overview: [
      { id: "metrics", label: "Retention overview", kind: "Scan", detail: "Read sample subscriber, churn, recurring revenue, and revenue-at-risk summaries." },
      { id: "trends", label: "Time-range controls", kind: "Compare", detail: "Change the local revenue and churn trend view across selectable periods." },
      { id: "segments", label: "Cohorts and services", kind: "Inspect", detail: "Explore contract comparisons, early-tenure survival, signup cohorts, and service mix." },
      { id: "customers", label: "Customer examples", kind: "Act", detail: "Search and filter representative profiles, inspect a customer detail drawer, and export visible sample rows." },
    ],
    services: [
      { name: "Static Next.js app", role: "The repository exports a responsive dashboard to GitHub Pages; the live page needs no database or API key." },
      { name: "Sample metrics", role: "Portfolio values, trends, cohorts, and example customer profiles are defined in app/page.tsx." },
      { name: "Local interactions", role: "React state drives time controls, navigation, customer search, contract filters, and detail selection." },
      { name: "CSV export", role: "The client downloads visible sample customer rows and portfolio summaries without a server request." },
    ],
    database: {
      label: "4 source data groups · no database",
      note: "The repository has no database or live subscriber dataset. This view documents the four sample-data structures defined in app/page.tsx; they are not persisted tables or a proposed production schema.",
      schemaKey: "signal-telecom-churn-analytics",
    },
  },
];
