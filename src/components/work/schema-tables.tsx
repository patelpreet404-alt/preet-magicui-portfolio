import { ArrowUpRight } from "lucide-react";
import type { ProjectSchema } from "@/data/project-schemas";

const KEY_TITLES: Record<string, string> = {
  PK: "Primary key",
  FK: "Foreign key",
  UQ: "Unique constraint",
  IDX: "Index",
  JOIN: "Field used in a SQL join; no database key constraint verified",
};

/** Plain, readable tables for a project's schema: one table block per database table, then relations. */
export function SchemaTables({ schema, associations }: { schema: ProjectSchema; associations?: readonly { id: string; from: string; fromColumn: string; to: string; toColumn: string; label: string }[] }) {
  const sourceData = schema.modelKind === "source-data";
  const relations = [...schema.relations, ...(associations ?? [])];
  return (
    <div>
      <p className="type-prose measure-prose text-ink">{schema.summary}</p>
      <a
        href={schema.source.href}
        target="_blank"
        rel="noopener noreferrer"
        className="type-meta mt-3 inline-flex min-h-11 items-center gap-1 text-link underline decoration-rule underline-offset-4 hover:decoration-link"
      >
        {schema.source.label}
        <ArrowUpRight className="size-3.5" aria-hidden="true" />
        <span className="sr-only"> (opens in a new tab)</span>
      </a>

      <div className="mt-6 grid gap-x-8 gap-y-10 md:grid-cols-2">
        {schema.tables.map((table) => (
          <div key={table.id} className="min-w-0">
            <h4 className="break-all font-mono text-sm font-medium text-ink">{table.name}</h4>
            <p className="type-meta mt-1 font-normal text-graphite">{table.description}</p>
            <div className="mt-3 overflow-x-auto" tabIndex={0} role="region" aria-label={`${table.name} ${sourceData ? "fields" : "columns"}`}>
              <table className="w-full min-w-[18rem] border-t border-rule text-left">
                <thead className="sr-only">
                  <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Type</th>
                    <th scope="col">Keys</th>
                  </tr>
                </thead>
                <tbody>
                  {table.columns.map((column) => (
                    <tr key={column.name} className="border-b border-rule align-baseline">
                      <th scope="row" className="py-2 pr-3 font-mono text-[0.8125rem] font-normal text-ink">
                        {column.name}
                      </th>
                      <td className="py-2 pr-3 font-mono text-[0.75rem] text-graphite">{column.type}</td>
                      <td className="py-2 text-right text-[0.75rem] font-medium text-graphite">
                        {column.keys?.map((key) => (
                          <abbr key={key} title={KEY_TITLES[key]} className="ml-1 no-underline">
                            {key}
                          </abbr>
                        ))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {table.totalColumns && table.totalColumns > table.columns.length && (
              <p className="type-meta mt-2 font-normal text-graphite">
                Showing {table.columns.length} of {table.totalColumns} columns.
              </p>
            )}
            {table.constraints?.map((constraint) => (
              <p key={constraint} className="type-meta mt-2 font-normal text-graphite">
                {constraint}
              </p>
            ))}
          </div>
        ))}
      </div>

      {relations.length > 0 && (
        <div className="mt-8">
          <h4 className="type-body font-semibold text-ink">{schema.associationKind === "query-joins" ? "SQL joins (no declared foreign keys)" : "Relations"}</h4>
          <ul className="mt-2 divide-y divide-rule border-y border-rule">
            {relations.map((relation) => (
              <li key={relation.id} className="type-meta py-2 font-normal text-ink">
                <span className="break-all font-mono text-[0.8125rem]">
                  {relation.from}.{relation.fromColumn} → {relation.to}.{relation.toColumn}
                </span>
                <span className="block text-graphite">{relation.label}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {schema.notes.length > 0 && (
        <ul className="type-meta mt-6 space-y-1 font-normal text-graphite">
          {schema.notes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
