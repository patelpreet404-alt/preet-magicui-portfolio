import { PROJECT_DESIGNS as GRAPH_DESIGNS } from "@/data/project-designs";
import { PROJECT_DESIGNS as EXPLORER_DESIGNS } from "@/data/project-design-explorer";
import { PROJECT_SCHEMAS } from "@/data/project-schemas";
import type { Project } from "@/content";
import { SchemaTables } from "./schema-tables";

/** True when there is system-design data to show for this project. */
export function hasSystemDesign(project: Project) {
  return Boolean((project.designExplorerId && EXPLORER_DESIGNS.some((design) => design.id === project.designExplorerId)) || GRAPH_DESIGNS[project.slug]);
}

function Sub({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-10 first:mt-0">
      <h3 className="type-body font-semibold text-ink">{title}</h3>
      <div className="mt-4">{children}</div>
    </div>
  );
}

/**
 * Overview, services and data model, ported from the old "design explorer" data. Projects with
 * explorer data get all three; others (research, prototype) get their component graph.
 */
export function SystemDesign({ project }: { project: Project }) {
  const explorer = EXPLORER_DESIGNS.find((design) => design.id === project.designExplorerId);
  const graph = GRAPH_DESIGNS[project.slug];

  if (explorer) {
    const schema = explorer.database.schemaKey ? PROJECT_SCHEMAS[explorer.database.schemaKey] : undefined;
    return (
      <div>
        <p className="type-prose measure-prose text-ink">{explorer.summary}</p>
        {explorer.statusNote && <p className="type-meta mt-3 font-normal text-graphite">{explorer.statusNote}</p>}

        <Sub title="Overview">
          <ol className="divide-y divide-rule border-y border-rule">
            {explorer.overview.map((node, index) => (
              <li key={node.id} className="grid gap-x-6 gap-y-1 py-4 sm:grid-cols-[2rem_9rem_1fr]">
                <span className="type-meta tabular-nums text-graphite">{index + 1}</span>
                <span className="type-meta text-ink">
                  {node.label}
                  <span className="block font-normal text-graphite">{node.kind}</span>
                </span>
                <span className="type-body text-ink">{node.detail}</span>
              </li>
            ))}
          </ol>
        </Sub>

        <Sub title="Services">
          <dl className="divide-y divide-rule border-y border-rule">
            {explorer.services.map((service) => (
              <div key={service.name} className="grid gap-x-6 gap-y-1 py-4 sm:grid-cols-[11rem_1fr]">
                <dt className="type-meta text-ink">{service.name}</dt>
                <dd className="type-body text-ink">{service.role}</dd>
              </div>
            ))}
          </dl>
        </Sub>

        <Sub title={schema?.modelKind === "source-data" ? "Sample data structure" : "Data model"}>
          <p className="type-meta mb-4 font-normal text-graphite">
            {explorer.database.label}. {explorer.database.note}
          </p>
          {schema ? <SchemaTables schema={schema} associations={explorer.database.associations} /> : null}
        </Sub>
      </div>
    );
  }

  if (graph) {
    return (
      <div>
        <p className="type-prose measure-prose text-ink">{graph.overview.summary}</p>
        <Sub title="Overview">
          <ol className="divide-y divide-rule border-y border-rule">
            {graph.overview.nodes.map((node, index) => (
              <li key={node.id} className="grid gap-x-6 gap-y-1 py-4 sm:grid-cols-[2rem_11rem_1fr]">
                <span className="type-meta tabular-nums text-graphite">{index + 1}</span>
                <span className="type-meta text-ink">
                  {node.title}
                  <span className="block font-normal text-graphite">{node.kind}</span>
                </span>
                <span className="type-body text-ink">
                  {node.description}
                  {node.decision && <span className="mt-1 block text-graphite">{node.decision}</span>}
                </span>
              </li>
            ))}
          </ol>
        </Sub>
        <Sub title="Components">
          <p className="type-meta mb-4 font-normal text-graphite">{graph.services.summary}</p>
          <dl className="divide-y divide-rule border-y border-rule">
            {graph.services.nodes.map((node) => (
              <div key={node.id} className="grid gap-x-6 gap-y-1 py-4 sm:grid-cols-[11rem_1fr]">
                <dt className="type-meta text-ink">
                  {node.title}
                  <span className="block font-normal text-graphite">{node.kind}</span>
                </dt>
                <dd className="type-body text-ink">
                  {node.description}
                  {node.decision && <span className="mt-1 block text-graphite">{node.decision}</span>}
                </dd>
              </div>
            ))}
          </dl>
        </Sub>
        {graph.notes.length > 0 && (
          <ul className="type-meta mt-6 space-y-1 font-normal text-graphite">
            {graph.notes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        )}
      </div>
    );
  }

  return null;
}
