"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Database, Layers3 } from "lucide-react";
import type { ProjectSchema, SchemaRelation } from "@/data/project-schemas";

const COLORS = ["#27c7f3", "#a78bfa", "#f5ae64", "#49d5ab", "#ef839c", "#84a9ff", "#e4c773"];
const EMPTY_ASSOCIATIONS: readonly SchemaRelation[] = [];

type Association = SchemaRelation;
type Connection = { id: string; path: string; from: string; to: string; color: string; conceptual: boolean };

export default function ProjectSchemaDiagram({ schema, zoom, associations = EMPTY_ASSOCIATIONS }: { schema: ProjectSchema; zoom: number; associations?: readonly Association[] }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [selectedRelation, setSelectedRelation] = useState<string | null>(null);
  const [diagram, setDiagram] = useState<{ width: number; height: number; connections: Connection[] }>({ width: 0, height: 0, connections: [] });
  const activeTable = schema.tables.find((table) => table.id === selectedTable);
  const activeRelation = [...schema.relations, ...associations].find((relation) => relation.id === selectedRelation);
  const activeAssociation = associations.some((relation) => relation.id === selectedRelation);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const measure = () => {
      const bounds = stage.getBoundingClientRect();
      const scale = bounds.width / stage.offsetWidth || 1;
      const getPoint = (relation: SchemaRelation, endpoint: "from" | "to") => {
        const id = relation[endpoint];
        const column = endpoint === "from" ? relation.fromColumn : relation.toColumn;
        const card = Array.from(stage.querySelectorAll<HTMLElement>("[data-schema-table]")).find((item) => item.dataset.schemaTable === id);
        const row = card && Array.from(card.querySelectorAll<HTMLElement>("[data-schema-column]")).find((item) => item.dataset.schemaColumn === column);
        const rect = (row ?? card)?.getBoundingClientRect();
        if (!rect) return null;
        return { x: (rect.left + rect.width / 2 - bounds.left) / scale, y: (rect.top + rect.height / 2 - bounds.top) / scale, card };
      };
      const connections = [...schema.relations, ...associations].flatMap((relation, index) => {
        const a = getPoint(relation, "from");
        const b = getPoint(relation, "to");
        if (!a || !b || !a.card || !b.card) return [];
        const leftToRight = a.x < b.x;
        const aCard = a.card.getBoundingClientRect();
        const bCard = b.card.getBoundingClientRect();
        const sameColumn = Math.abs(a.x - b.x) < 80;
        const x1 = sameColumn ? a.x : ((leftToRight ? aCard.right : aCard.left) - bounds.left) / scale;
        const x2 = sameColumn ? b.x : ((leftToRight ? bCard.left : bCard.right) - bounds.left) / scale;
        const y1 = sameColumn ? ((a.y < b.y ? aCard.bottom : aCard.top) - bounds.top) / scale : a.y;
        const y2 = sameColumn ? ((a.y < b.y ? bCard.top : bCard.bottom) - bounds.top) / scale : b.y;
        const bend = Math.max(36, Math.abs(x2 - x1) * 0.48);
        const path = sameColumn
          ? `M ${x1} ${y1} C ${x1 + 24 + index * 4} ${(y1 + y2) / 2}, ${x2 + 24 + index * 4} ${(y1 + y2) / 2}, ${x2} ${y2}`
          : `M ${x1} ${y1} C ${x1 + (leftToRight ? bend : -bend)} ${y1}, ${x2 - (leftToRight ? bend : -bend)} ${y2}, ${x2} ${y2}`;
        const tableIndex = schema.tables.findIndex((table) => table.id === relation.from);
        return [{ id: relation.id, path, from: relation.from, to: relation.to, color: COLORS[tableIndex % COLORS.length], conceptual: associations.some((item) => item.id === relation.id) }];
      });
      setDiagram({ width: stage.offsetWidth, height: stage.offsetHeight, connections });
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(stage);
    stage.querySelectorAll("[data-schema-table]").forEach((node) => observer.observe(node));
    window.addEventListener("resize", measure);
    return () => { observer.disconnect(); window.removeEventListener("resize", measure); };
  }, [schema, zoom, associations]);

  return (
    <div className="design-explorer__schema-wrap">
      <div className="design-explorer__schema-topline">
        <p><strong>{schema.tables.length} {schema.modelKind === 'source-data' ? 'source data groups' : 'tables'}</strong><span aria-hidden="true"> · </span><strong>{schema.modelKind === 'source-data' ? 'no database relationships' : `${schema.relations.length} declared ${schema.relations.length === 1 ? 'relation' : 'relations'}`}</strong></p>
        <a href={schema.source.href} target="_blank" rel="noreferrer">{schema.source.label}<ArrowUpRight aria-hidden="true" /></a>
      </div>
      <p className="design-explorer__schema-summary">{schema.summary}</p>
      <div className="design-explorer__schema-scroll" role="region" tabIndex={0} aria-label={schema.modelKind === 'source-data' ? 'Sample data structure diagram; scroll sideways to see all groups' : 'Database diagram; scroll sideways to see all tables'}>
        <div ref={stageRef} className="design-explorer__schema-stage" data-table-count={schema.tables.length} style={{ zoom: `${zoom}%` }}>
          {diagram.width > 0 && <svg className="design-explorer__schema-lines" width={diagram.width} height={diagram.height} viewBox={`0 0 ${diagram.width} ${diagram.height}`} aria-hidden="true">
            {diagram.connections.map((connection) => {
              const active = selectedRelation === connection.id || selectedTable === connection.from || selectedTable === connection.to;
              const dimmed = (selectedRelation || selectedTable) && !active;
              return <path key={connection.id} d={connection.path} fill="none" stroke={connection.color} strokeWidth={active ? 2.5 : 1.6} strokeDasharray={connection.conceptual ? "6 5" : undefined} opacity={dimmed ? 0.12 : active ? 0.95 : 0.58} />;
            })}
          </svg>}
          {schema.tables.map((table, index) => {
            const connected = [...schema.relations, ...associations].some((relation) => (relation.from === selectedTable && relation.to === table.id) || (relation.to === selectedTable && relation.from === table.id));
            const relationActive = activeRelation?.from === table.id || activeRelation?.to === table.id;
            const active = selectedTable === table.id || connected || relationActive;
            return <article key={table.id} className="design-explorer__schema-table" data-schema-table={table.id} data-active={active} style={{ "--schema-accent": COLORS[index % COLORS.length] } as React.CSSProperties}>
              <button type="button" className="design-explorer__schema-table-head" aria-pressed={selectedTable === table.id} onClick={() => { setSelectedRelation(null); setSelectedTable((current) => current === table.id ? null : table.id); }}>
                {schema.modelKind === 'source-data' ? <Layers3 aria-hidden="true" /> : <Database aria-hidden="true" />}<span>{table.name}</span><small>{table.totalColumns && table.totalColumns > table.columns.length ? `${table.columns.length}/${table.totalColumns} fields` : `${table.columns.length} ${schema.modelKind === 'source-data' ? 'fields' : 'columns'}`}</small>
              </button>
              <ul>{table.columns.map((column) => <li key={column.name} data-schema-column={column.name}>
                <span className="design-explorer__schema-keys">{column.keys?.map((key) => <abbr key={key} className={`design-explorer__schema-key design-explorer__schema-key--${key.toLowerCase()}`} title={{ PK: "Primary key", FK: "Foreign key", UQ: "Unique constraint", IDX: "Index", JOIN: "Field used in a SQL join; no database key constraint verified" }[key]}>{key}</abbr>)}</span>
                <span className="design-explorer__schema-field">{column.name}</span><span className="design-explorer__schema-type">{column.type}</span>
              </li>)}</ul>
            </article>;
          })}
        </div>
      </div>
      <p className="design-explorer__schema-pan-hint">Scroll inside the diagram to explore every table.</p>
      {(schema.relations.length > 0 || associations.length > 0) && <div className="design-explorer__schema-relations"><h4>{schema.associationKind === 'query-joins' ? "SQL query joins · no declared foreign keys" : schema.relations.length > 0 ? "Declared connections" : "Shared fields · application-level links"}</h4><div>
        {[...schema.relations, ...associations].map((relation) => <button key={relation.id} type="button" aria-pressed={selectedRelation === relation.id} onClick={() => { setSelectedTable(null); setSelectedRelation((current) => current === relation.id ? null : relation.id); }}>
          <span>{relation.from}.{relation.fromColumn}</span><span aria-hidden="true">→</span><span>{relation.to}.{relation.toColumn}</span><small>{relation.label}</small>
        </button>)}
      </div></div>}
      {(activeTable || activeRelation) && <div className="design-explorer__schema-inspector" aria-live="polite">
        {activeTable ? <><h4>{activeTable.name}</h4><p>{activeTable.description}</p>{activeTable.constraints?.map((constraint) => <p key={constraint}>{constraint}</p>)}<ul>{activeTable.columns.filter((column) => column.note).map((column) => <li key={column.name}><strong>{column.name}</strong> · {column.note}</li>)}</ul></> : activeRelation && <><h4>{activeRelation.from} → {activeRelation.to}</h4><p>{activeRelation.from}.{activeRelation.fromColumn} {activeAssociation ? schema.associationKind === 'query-joins' ? "is joined to" : "shares a course identifier with" : "references"} {activeRelation.to}.{activeRelation.toColumn}. {activeRelation.label}</p></>}
      </div>}
      {schema.modelKind !== 'source-data' && <div className="design-explorer__schema-legend" aria-label="Schema key legend"><span><b className="design-explorer__schema-key--pk">PK</b> Primary key</span><span><b className="design-explorer__schema-key--fk">FK</b> Foreign key</span><span><b className="design-explorer__schema-key--uq">UQ</b> Unique</span><span><b className="design-explorer__schema-key--idx">IDX</b> Index</span>{schema.associationKind === 'query-joins' && <span><b className="design-explorer__schema-key--join">JOIN</b> SQL join field, no verified key constraint</span>}{associations.length > 0 && <span><i className="design-explorer__schema-dash" aria-hidden="true" /> {schema.associationKind === 'query-joins' ? 'SQL join, not a declared FK' : 'Shared value, no declared FK'}</span>}</div>}
      <div className="design-explorer__schema-notes">{schema.notes.map((note) => <p key={note}>{note}</p>)}</div>
    </div>
  );
}
