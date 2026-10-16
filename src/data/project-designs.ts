import type { PortfolioProject } from "./resume";

export interface DesignNode {
  id: string;
  title: string;
  kind: string;
  description: string;
  input?: string;
  output?: string;
  decision?: string;
  source?: { label: string; href: string };
}

export interface DesignEdge {
  from: string;
  to: string;
  label: string;
}

export interface DesignGraph {
  summary: string;
  nodes: readonly DesignNode[];
  edges: readonly DesignEdge[];
}

export interface ProjectDesign {
  overview: DesignGraph;
  services: DesignGraph;
  notes: readonly string[];
}

const learningSource = { label: "Source repository", href: "https://github.com/patelpreet404-alt/ai-learning-management-system" };
const foodSource = { label: "Source repository", href: "https://github.com/patelpreet404-alt/foodfolk-discovery-map" };
const subbieSource = { label: "Public case study", href: "https://subbieguard-portfolio-public.vercel.app" };
const fieldnoteSource = { label: "Source repository", href: "https://github.com/patelpreet404-alt/olist-ecommerce-analytics" };
const ledgerlineSource = { label: "Source repository", href: "https://github.com/patelpreet404-alt/credit-risk-scorecard" };
const signalSource = { label: "Source repository", href: "https://github.com/patelpreet404-alt/telecom-churn-analytics" };

export const PROJECT_DESIGNS: Readonly<Record<string, ProjectDesign>> = {
  "ledgerline-credit-risk-scorecard": {
    overview: {
      summary: "The interactive demo guides a visitor from illustrative portfolio views through scorecard inspection, sensitivity scenarios, and hypothetical scoring.",
      nodes: [
        { id: "overview", title: "Portfolio overview", kind: "Demo interface", description: "Shows example exposure, expected loss, applications, and model-health indicators.", source: ledgerlineSource },
        { id: "scorecard", title: "Scorecard studio", kind: "Interpretation", description: "Exposes WOE bins, feature information value, and methodology notes.", source: ledgerlineSource },
        { id: "stress", title: "Stress scenarios", kind: "Sensitivity", description: "Compares illustrative expected loss under documented scenario multipliers.", decision: "The scenario comparison is not a macroeconomic forecast.", source: ledgerlineSource },
        { id: "lab", title: "Decision lab", kind: "Local sandbox", description: "Calculates an example score and band for a hypothetical application in the browser.", decision: "No real applicant data is sent or stored; this is not a lending decision.", source: ledgerlineSource }
      ],
      edges: [{ from: "overview", to: "scorecard", label: "Inspect model" }, { from: "scorecard", to: "stress", label: "Explore assumptions" }, { from: "stress", to: "lab", label: "Try an example" }]
    },
    services: {
      summary: "The dashboard, local modeling scripts, SQL schema, and DAX measures are repository components. They are not connected production services.",
      nodes: [
        { id: "client", title: "Next.js demo", kind: "Application", description: "Renders the interactive analyst workspace using illustrative values.", source: { label: "Dashboard source", href: `${ledgerlineSource.href}/blob/main/app/page.tsx` } },
        { id: "generator", title: "Synthetic generator", kind: "Development script", description: "Produces local sample application records for pipeline development.", source: { label: "Generator source", href: `${ledgerlineSource.href}/blob/main/modeling/generate_synthetic_data.py` } },
        { id: "training", title: "Scorecard training", kind: "Development script", description: "Runs logistic-regression training and holdout validation on the supplied or generated CSV.", source: { label: "Training source", href: `${ledgerlineSource.href}/blob/main/modeling/train_scorecard.py` } },
        { id: "schema", title: "Analytical SQL", kind: "Data design", description: "Defines application, outcome, scorecard-bin, and validation tables with one declared foreign key.", source: { label: "SQL schema", href: `${ledgerlineSource.href}/blob/main/sql/schema.sql` } },
        { id: "dax", title: "Power BI measures", kind: "Reporting definitions", description: "Documents portfolio calculations as DAX measures.", source: { label: "DAX measures", href: `${ledgerlineSource.href}/blob/main/powerbi/measures.dax` } }
      ],
      edges: [{ from: "generator", to: "training", label: "Synthetic CSV" }, { from: "schema", to: "dax", label: "Reporting definitions" }]
    },
    notes: ["The public demo uses synthetic examples and illustrative values, not connected lender data.", "Demo model-health figures are not independently reproduced from a verified portfolio dataset."]
  },
  "signal-telecom-churn-analytics": {
    overview: {
      summary: "The public site is a static Next.js export with interactive controls over representative, source-defined sample values.",
      nodes: [
        { id: "metrics", title: "Retention overview", kind: "Sample view", description: "Presents illustrative churn, subscriber, recurring revenue, and revenue-at-risk summaries.", source: signalSource },
        { id: "trends", title: "Trend controls", kind: "Interaction", description: "Time-range selection changes the local revenue and churn chart values.", source: signalSource },
        { id: "segments", title: "Cohorts and services", kind: "Analysis view", description: "Shows contract, survival, cohort, and service comparisons using representative values.", source: signalSource },
        { id: "customers", title: "Customer examples", kind: "Interaction", description: "Searches and filters sample profiles, opens details, and exports visible rows to CSV.", source: signalSource }
      ],
      edges: [{ from: "metrics", to: "trends", label: "Choose period" }, { from: "trends", to: "segments", label: "Inspect segments" }, { from: "segments", to: "customers", label: "Review examples" }]
    },
    services: {
      summary: "A single static client application contains the sample data and interactions. No API, database, or live subscriber feed is present.",
      nodes: [
        { id: "sample", title: "In-app sample data", kind: "Local data", description: "Representative metrics, trends, cohorts, and customer profiles are defined in app/page.tsx.", source: { label: "Application source", href: `${signalSource.href}/blob/main/app/page.tsx` } },
        { id: "state", title: "React controls", kind: "Client interaction", description: "State drives time windows, navigation, search, contract filters, and selected customer details.", source: signalSource },
        { id: "views", title: "Dashboard views", kind: "Static application", description: "Next.js renders responsive overview, revenue, survival, segment, and service sections.", source: signalSource },
        { id: "export", title: "CSV download", kind: "Client output", description: "Exports the visible sample customers and portfolio summary without a server request.", source: signalSource }
      ],
      edges: [{ from: "sample", to: "state", label: "Representative values" }, { from: "state", to: "views", label: "Selected view" }, { from: "state", to: "export", label: "Filtered sample" }]
    },
    notes: ["The live site uses representative sample data and is not connected to a subscriber database.", "Figures from the supplied project brief have not been independently reproduced from source data."]
  },
  "fieldnote-commerce-intelligence": {
    overview: {
      summary: "The repository dashboard reads a bundled analytics snapshot built from synthetic source data. The public page is a static visual preview.",
      nodes: [
        { id: "source", title: "Synthetic SQLite source", kind: "Input", description: "A compatible source database supplies marketplace records; the database file is not bundled.", source: fieldnoteSource },
        { id: "builder", title: "Python snapshot builder", kind: "Aggregation", description: "Calculates funnel, cohort, category, and delivery measures with documented definitions.", input: "Compatible SQLite records", output: "Aggregate measures", decision: "Delivery is counted at order grain before joining line items.", source: { label: "Snapshot builder", href: `${fieldnoteSource.href}/blob/main/scripts/build_data.py` } },
        { id: "snapshot", title: "Bundled analytics JSON", kind: "Local data", description: "Stores calculated measures and provenance for offline exploration.", input: "Aggregate measures", output: "Read-only snapshot", source: { label: "Analytics snapshot", href: `${fieldnoteSource.href}/blob/main/public/analytics.json` } },
        { id: "dashboard", title: "Dashboard views", kind: "Interface", description: "The local application presents overview, funnel, cohort, fulfillment, and data-definition views.", input: "Read-only snapshot", output: "Inspectable analytics", source: fieldnoteSource }
      ],
      edges: [{ from: "source", to: "builder", label: "Source records" }, { from: "builder", to: "snapshot", label: "Calculated measures" }, { from: "snapshot", to: "dashboard", label: "Read-only data" }]
    },
    services: {
      summary: "Source components in one local application; no hosted analytics service or live database connection is claimed.",
      nodes: [
        { id: "queries", title: "Reference SQL", kind: "Documentation", description: "PostgreSQL queries show funnel, retention, category, and delivery calculations.", source: { label: "SQL references", href: `${fieldnoteSource.href}/tree/main/sql` } },
        { id: "builder", title: "Snapshot builder", kind: "Build component", description: "Python reads compatible SQLite rows and writes the JSON snapshot.", source: { label: "Python source", href: `${fieldnoteSource.href}/blob/main/scripts/build_data.py` } },
        { id: "data", title: "Analytics JSON", kind: "Local data", description: "Bundled synthetic sample aggregates keep the dashboard available offline.", source: fieldnoteSource },
        { id: "client", title: "Next.js dashboard", kind: "Application", description: "Renders read-only views, time and region controls, and filtered JSON export in the source app.", source: fieldnoteSource }
      ],
      edges: [{ from: "queries", to: "builder", label: "Metric definitions" }, { from: "builder", to: "data", label: "Generated snapshot" }, { from: "data", to: "client", label: "Read-only analytics" }]
    },
    notes: ["The bundled sample is synthetic and does not represent actual marketplace performance.", "The linked public page presents a static visual preview of the dashboard."]
  },
  "ai-learning-management": {
    overview: {
      summary: "The full application connects a learner’s topic to generated course material. The public preview opens a prepared sample course.",
      nodes: [
        { id: "learner", title: "Learner workspace", kind: "Interface", description: "Collect a topic, course type, and difficulty; browse a chapter plan and study material.", input: "Learning goal", output: "Course request", source: learningSource },
        { id: "outline", title: "Course outline", kind: "Generation", description: "Gemini shapes a chapter-by-chapter course outline from the request.", input: "Topic and course preferences", output: "Course layout", source: learningSource },
        { id: "jobs", title: "Material generation", kind: "Background work", description: "Inngest coordinates longer generation tasks for notes and study content.", input: "Course outline", output: "Generated study material", decision: "Generation progress stays visible while work is pending.", source: learningSource },
        { id: "storage", title: "Course records", kind: "Persistence", description: "Neon PostgreSQL and Drizzle ORM store course layouts, chapter notes, and study content.", input: "Generated content", output: "Saved course material", source: { label: "Drizzle schema", href: `${learningSource.href}/blob/main/configs/schema.js` } },
        { id: "study", title: "Study session", kind: "Interface", description: "Read chapter notes and explore flashcards, quizzes, and question-and-answer sets.", input: "Saved course material", output: "Learner interactions", source: learningSource }
      ],
      edges: [{ from: "learner", to: "outline", label: "Course request" }, { from: "outline", to: "jobs", label: "Chapter plan" }, { from: "jobs", to: "storage", label: "Generated material" }, { from: "storage", to: "study", label: "Load course" }]
    },
    services: {
      summary: "Application components and external integrations; this view does not imply independently deployed microservices.",
      nodes: [
        { id: "ui", title: "Next.js application", kind: "Application", description: "Course creation and learner views organize the study workflow.", source: learningSource },
        { id: "identity", title: "Clerk identity", kind: "Integration", description: "Handles sign-in in the configured application.", decision: "Exploring the prepared preview does not require creating an account.", source: learningSource },
        { id: "model", title: "Gemini generation", kind: "Integration", description: "Produces course outlines and study content from the requested plan.", source: learningSource },
        { id: "jobs", title: "Inngest workflows", kind: "Background component", description: "Coordinates longer AI and database work.", source: learningSource },
        { id: "data", title: "Drizzle and Neon", kind: "Data component", description: "Stores course and study records in PostgreSQL.", source: { label: "Drizzle schema", href: `${learningSource.href}/blob/main/configs/schema.js` } }
      ],
      edges: [{ from: "identity", to: "ui", label: "Identity" }, { from: "ui", to: "model", label: "Outline generation" }, { from: "ui", to: "jobs", label: "Material requests" }, { from: "jobs", to: "model", label: "Generate content" }, { from: "jobs", to: "data", label: "Persist results" }, { from: "data", to: "ui", label: "Course content" }]
    },
    notes: ["The diagram describes the configured source application. The public preview uses a sample course."]
  },
  "foodfolk": {
    overview: {
      summary: "Restaurant discovery joins a map, friends’ recommendations, and personal food history. Public preview changes remain in the browser.",
      nodes: [
        { id: "map", title: "Food Map", kind: "Interface", description: "Explore Mumbai restaurants and filter sample activity, friends’ picks, and saved places.", source: foodSource },
        { id: "search", title: "Place search", kind: "External data", description: "Photon and Overpass support restaurant and neighbourhood search with OpenStreetMap data.", input: "Search or map area", output: "Place results", source: foodSource },
        { id: "place", title: "Restaurant profile", kind: "Interface", description: "Inspect a place, reviews, ratings, dishes, and photos.", source: foodSource },
        { id: "activity", title: "Save and review", kind: "Workflow", description: "Save a place or record a meal; the full application includes visibility choices.", decision: "Browser-local preview activity is separate from persistent social data.", source: foodSource },
        { id: "passport", title: "Food passport", kind: "Interface", description: "Revisit reviewed places and remembered meals.", source: foodSource }
      ],
      edges: [{ from: "map", to: "search", label: "Find a place" }, { from: "search", to: "place", label: "Select result" }, { from: "place", to: "activity", label: "Save or review" }, { from: "activity", to: "passport", label: "Food history" }, { from: "passport", to: "map", label: "Revisit places" }]
    },
    services: {
      summary: "The source includes a persistent social backend; the public preview uses seeded activity and browser-local changes.",
      nodes: [
        { id: "client", title: "React client", kind: "Application", description: "TypeScript interface for restaurant discovery, social views, and food history.", source: foodSource },
        { id: "maps", title: "Leaflet map", kind: "Interface component", description: "Renders the map with OpenStreetMap data and selected place information.", source: foodSource },
        { id: "search", title: "Search providers", kind: "Integration", description: "Photon and Overpass supply place and neighbourhood search data.", source: foodSource },
        { id: "api", title: "Node.js social API", kind: "Backend component", description: "The source API supports accounts, friendships, reviews, saved places, and photo access.", decision: "Persistent operation requires a Node server and durable storage.", source: foodSource },
        { id: "db", title: "SQLite records", kind: "Data component", description: "Stores social and restaurant records with declared keys and relationships.", source: { label: "SQLite schema", href: `${foodSource.href}/blob/main/server/schema.sql` } }
      ],
      edges: [{ from: "client", to: "maps", label: "Map interactions" }, { from: "maps", to: "search", label: "Place queries" }, { from: "client", to: "api", label: "Full-app social requests" }, { from: "api", to: "db", label: "Persistent records" }]
    },
    notes: ["The deployment opens on Cook Along; Food Map is available in navigation.", "The public preview is not a launched social network."]
  },
  "crypto-ransomware-research": {
    overview: {
      summary: "Research direction for early identification using separate behavioral and known-signature signals. No operational deployment or validated accuracy is claimed.",
      nodes: [
        { id: "sandbox", title: "Sandbox observations", kind: "Research input", description: "Collect behavior observed through Cuckoo Sandbox.", output: "Behavioral observations" },
        { id: "features", title: "Feature extraction", kind: "Research analysis", description: "Explore signals that may help distinguish ransomware activity.", input: "Sandbox observations", output: "Behavioral features" },
        { id: "classifier", title: "Random Forest evaluation", kind: "Research model", description: "Evaluate classification using extracted behavioral features.", input: "Behavioral features", decision: "No validated detection accuracy is available." },
        { id: "signature", title: "SHA-256 matching", kind: "Separate signal", description: "Explore matching known files by their SHA-256 signatures.", decision: "Known-signature matching is described separately from behavioral classification." }
      ],
      edges: [{ from: "sandbox", to: "features", label: "Observed behavior" }, { from: "features", to: "classifier", label: "Extracted features" }]
    },
    services: {
      summary: "Research components described in the portfolio, not verified production services. No source repository is public.",
      nodes: [
        { id: "observations", title: "Cuckoo Sandbox", kind: "Research tool", description: "Provides the behavioral observations being investigated." },
        { id: "analysis", title: "Python analysis", kind: "Research component", description: "Supports behavioral feature analysis and classifier evaluation." },
        { id: "classification", title: "Random Forest", kind: "Research model", description: "The selected classification approach for behavioral features." },
        { id: "signatures", title: "SHA-256 checks", kind: "Research component", description: "A second signal for identifying known files." }
      ],
      edges: [{ from: "observations", to: "analysis", label: "Behavior data" }, { from: "analysis", to: "classification", label: "Feature evaluation" }]
    },
    notes: ["Ongoing research. Public demo and source repository are unavailable.", "MySQL is listed among the research tools; its schema and role are not verified here."]
  },
  "subbieguard": {
    overview: {
      summary: "Development design for keeping an instructed variation’s sources, evidence, and next actions connected. Later stages do not imply completed hosted functionality.",
      nodes: [
        { id: "instruction", title: "Capture the change", kind: "Development workflow", description: "Bring the instruction and context into a reviewable variation record.", source: subbieSource },
        { id: "sources", title: "Contract and evidence", kind: "Development workflow", description: "Keep contract sources, versions, site evidence, and labour notes visible together.", source: subbieSource },
        { id: "review", title: "Human review", kind: "Guardrail", description: "Ambiguous rules and unsupported dates require a person’s review.", decision: "Operational acknowledgment is not legal approval.", source: subbieSource },
        { id: "notice", title: "Notice preparation", kind: "Development design", description: "Organize a draft for review with the supporting variation context.", decision: "A draft or reported-send record does not establish valid legal service.", source: subbieSource },
        { id: "history", title: "Commercial history", kind: "Development design", description: "Keep estimates, claims, assessments, invoices, and payments as distinct records.", decision: "Distinct records prevent repeated counting of the same variation.", source: subbieSource }
      ],
      edges: [{ from: "instruction", to: "sources", label: "Variation context" }, { from: "sources", to: "review", label: "Review evidence" }, { from: "review", to: "notice", label: "Reviewed next action" }, { from: "notice", to: "history", label: "Commercial record" }]
    },
    services: {
      summary: "The documented development foundation uses role-aware access and private records. Real customer document handling remains gated.",
      nodes: [
        { id: "workspace", title: "Next.js workspace", kind: "Development application", description: "TypeScript workspace for reviewing variation context and next actions.", source: subbieSource },
        { id: "access", title: "Role-aware access", kind: "Development foundation", description: "Supabase Auth and role-aware access support the development foundation.", source: subbieSource },
        { id: "records", title: "Postgres records", kind: "Development foundation", description: "Versioned migrations support the record model; exact table definitions are not presented here.", source: subbieSource },
        { id: "evidence", title: "Private evidence storage", kind: "Development foundation", description: "Private Storage is part of the documented technical foundation.", decision: "Real customer document handling remains gated.", source: subbieSource },
        { id: "review", title: "Human review boundary", kind: "Guardrail", description: "The workspace organizes context and does not decide legal entitlement.", source: subbieSource }
      ],
      edges: [{ from: "access", to: "workspace", label: "Role-aware access" }, { from: "workspace", to: "records", label: "Variation records" }, { from: "workspace", to: "evidence", label: "Supporting evidence" }, { from: "workspace", to: "review", label: "Review required" }]
    },
    notes: ["M0–M3 verified using synthetic development data.", "M4 prepared but not through hosted acceptance.", "M5–M6 future work."]
  }
};

export function getProjectDesign(project: { slug?: string; architecture?: PortfolioProject["architecture"] }): ProjectDesign | undefined {
  if (project.slug === "fieldnote-commerce-intelligence" || project.slug === "ledgerline-credit-risk-scorecard" || project.slug === "signal-telecom-churn-analytics") return PROJECT_DESIGNS[project.slug];
  if (!project.architecture) return project.slug ? PROJECT_DESIGNS[project.slug] : undefined;

  const nodes = project.architecture.stages.map((stage): DesignNode => ({
    id: stage.id,
    title: stage.title,
    kind: "Workflow stage",
    description: stage.action,
    input: stage.input,
    output: stage.output,
    decision: stage.contribution,
    source: stage.source
  }));
  const edges = nodes.slice(1).map((node, index): DesignEdge => ({ from: nodes[index].id, to: node.id, label: nodes[index].output || "Next stage" }));
  return {
    overview: { summary: project.architecture.summary, nodes, edges },
    services: {
      summary: project.slug === "optilang"
        ? "Compiler modules share explicit intermediate representations. The separate Clang / LLVM exercises are outside this pipeline."
        : "Focused source components handle PDF ingestion, indexing, retrieval, response generation, and citation history. These are application modules, not separate microservices.",
      nodes: nodes.map((node) => ({ ...node, title: node.source?.label || node.title, kind: project.slug === "optilang" ? "Compiler module" : "Application component" })),
      edges
    },
    notes: project.slug === "optilang"
      ? ["The custom compiler ends at optimized three-address code.", "The browser preview illustrates the compiler pipeline; LLVM examples are a separate Clang exercise."]
      : ["The source workflow requires the configured backend and API access.", "The public preview uses a prepared document and answers; uploads and live AI responses are unavailable there."]
  };
}
