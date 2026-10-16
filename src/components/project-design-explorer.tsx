"use client";

import { useMemo, useState } from "react";
import { ArrowDownRight, ArrowRight, Database, Layers3, Waypoints } from "lucide-react";
import { getProjectDesign, type DesignGraph, type DesignNode } from "@/data/project-designs";
import { PROJECT_SCHEMAS, type ProjectSchema, type SchemaTable } from "@/data/project-schemas";

type ExplorerTab = "overview" | "services" | "schema";

const TABS: { id: ExplorerTab; label: string; Icon: typeof Layers3 }[] = [
  { id: "overview", label: "System Overview", Icon: Layers3 },
  { id: "services", label: "Service Breakdown", Icon: Waypoints },
  { id: "schema", label: "DB Schema", Icon: Database }
];

export function ProjectDesignExplorer({ project }: { project: Parameters<typeof getProjectDesign>[0] & { title: string } }) {
  const design = getProjectDesign(project);
  const schema = project.slug ? PROJECT_SCHEMAS[project.slug] : undefined;
  const [tab, setTab] = useState<ExplorerTab>("overview");
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const tabRefs = useMemo(() => new Map<ExplorerTab, HTMLButtonElement>(), []);

  if (!design && !schema) return null;

  const graph = tab === "services" ? design?.services : design?.overview;
  const node = graph?.nodes.find((item) => item.id === selectedNode) ?? graph?.nodes[0];
  const table = schema?.tables.find((item) => item.id === selectedTable) ?? schema?.tables[0];
  const relationCount = schema?.relations.length ?? 0;

  const selectTab = (next: ExplorerTab) => {
    setTab(next);
    setSelectedNode(null);
    setSelectedTable(null);
  };

  const handleTabKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    let next = index;
    if (event.key === "ArrowRight") next = (index + 1) % TABS.length;
    else if (event.key === "ArrowLeft") next = (index + TABS.length - 1) % TABS.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = TABS.length - 1;
    else return;
    event.preventDefault();
    selectTab(TABS[next].id);
    tabRefs.get(TABS[next].id)?.focus();
  };

  return <section className="design-explorer" aria-labelledby="design-explorer-title">
    <div className="design-explorer__intro">
      <div>
        <p className="design-explorer__eyebrow">Under the hood</p>
        <h3 id="design-explorer-title">Design explorer</h3>
        <p>Explore how {project.title} is put together, one layer at a time.</p>
      </div>
      <span className="design-explorer__mark" aria-hidden="true"><Layers3 size={20} /></span>
    </div>

    <div className="design-explorer__tabs" role="tablist" aria-label={`${project.title} design explorer`}>
      {TABS.map(({ id, label, Icon }, index) => <button key={id} ref={(element) => { if (element) tabRefs.set(id, element); }} type="button" role="tab" id={`design-tab-${id}`} aria-controls={`design-panel-${id}`} aria-selected={tab === id} tabIndex={tab === id ? 0 : -1} onClick={() => selectTab(id)} onKeyDown={(event) => handleTabKeyDown(event, index)}><Icon size={15} aria-hidden="true" /><span>{label}</span></button>)}
    </div>

    {tab !== "schema" && graph && node ? <GraphPanel graph={graph} selected={node} onSelect={(next) => setSelectedNode(next)} tab={tab} /> : null}
    {tab === "schema" ? <SchemaPanel schema={schema} table={table} selectedId={table?.id} onSelect={(next) => setSelectedTable(next)} /> : null}
  </section>;
}

function GraphPanel({ graph, selected, onSelect, tab }: { graph: DesignGraph; selected: DesignNode; onSelect: (id: string) => void; tab: "overview" | "services" }) {
  const selectedEdges = graph.edges.filter((edge) => edge.from === selected.id || edge.to === selected.id);
  return <div className="design-explorer__panel" role="tabpanel" id={`design-panel-${tab}`} aria-labelledby={`design-tab-${tab}`}>
    <p className="design-explorer__summary">{graph.summary}</p>
    <div className="design-explorer__graph" role="group" aria-label={`${tab === "overview" ? "System overview" : "Service breakdown"} components`}>
      {graph.nodes.map((item, index) => <div className="design-explorer__graph-item" key={item.id}>
        <button type="button" className="design-explorer__node" data-active={selected.id === item.id} aria-pressed={selected.id === item.id} onClick={() => onSelect(item.id)}>
          <span className="design-explorer__node-number">{String(index + 1).padStart(2, "0")}</span>
          <span className="design-explorer__node-copy"><span>{item.kind}</span><strong>{item.title}</strong></span>
          <ArrowDownRight size={16} aria-hidden="true" />
        </button>
      </div>)}
    </div>
    {graph.edges.length > 0 && <div className="design-explorer__edge-map" role="group" aria-label="Verified component connections">
      <p>Connections in this design</p>
      <ul>{graph.edges.map((edge) => <li key={`${edge.from}-${edge.to}`} data-active={selected.id === edge.from || selected.id === edge.to}>
        <button type="button" onClick={() => onSelect(edge.from)}>{graph.nodes.find((item) => item.id === edge.from)?.title}</button>
        <ArrowRight size={13} aria-hidden="true" /><span>{edge.label}</span><ArrowRight size={13} aria-hidden="true" />
        <button type="button" onClick={() => onSelect(edge.to)}>{graph.nodes.find((item) => item.id === edge.to)?.title}</button>
      </li>)}</ul>
    </div>}
    <div className="design-explorer__detail" aria-live="polite" aria-atomic="false">
      <div className="design-explorer__detail-title"><span>{selected.kind}</span><h4>{selected.title}</h4></div>
      <p>{selected.description}</p>
      {(selected.input || selected.output) && <dl className="design-explorer__io">{selected.input && <div><dt>Input</dt><dd>{selected.input}</dd></div>}{selected.output && <div><dt>Output</dt><dd>{selected.output}</dd></div>}</dl>}
      {selected.decision && <p className="design-explorer__decision"><strong>Engineering note</strong>{selected.decision}</p>}
      {selectedEdges.length > 0 && <div className="design-explorer__connections"><span>Connections</span>{selectedEdges.map((edge) => <p key={edge.from + edge.to}><span>{graph.nodes.find((entry) => entry.id === edge.from)?.title}</span><ArrowRight size={13} aria-hidden="true" /><span>{edge.label}</span><ArrowRight size={13} aria-hidden="true" /><span>{graph.nodes.find((entry) => entry.id === edge.to)?.title}</span></p>)}</div>}
      {selected.source && <a className="design-explorer__source" href={selected.source.href} target="_blank" rel="noopener noreferrer">{selected.source.label}<ArrowRight size={14} aria-hidden="true" /></a>}
    </div>
    <ol className="design-explorer__list" aria-label="Diagram components">{graph.nodes.map((item) => <li key={item.id}><button type="button" aria-current={selected.id === item.id ? "step" : undefined} onClick={() => onSelect(item.id)}><span>{item.kind}</span>{item.title}</button></li>)}</ol>
  </div>;
}

function SchemaPanel({ schema, table, selectedId, onSelect }: { schema?: ProjectSchema; table?: SchemaTable; selectedId?: string; onSelect: (id: string) => void }) {
  if (!schema) return <div className="design-explorer__panel design-explorer__unavailable" role="tabpanel" id="design-panel-schema" aria-labelledby="design-tab-schema">
    <Database size={21} aria-hidden="true" /><div><h4>Schema details are not verified</h4><p>This project lists MySQL among its tools, but its table definitions and relationships are not available. No schema has been inferred.</p></div>
  </div>;

  return <div className="design-explorer__panel" role="tabpanel" id="design-panel-schema" aria-labelledby="design-tab-schema">
    <div className="design-explorer__schema-head"><div><p className="design-explorer__summary">{schema.summary}</p><a className="design-explorer__source" href={schema.source.href} target="_blank" rel="noopener noreferrer">Inspect source schema<ArrowRight size={14} aria-hidden="true" /></a></div><span className="design-explorer__count">{schema.tables.length} {schema.tables.length === 1 ? "table" : "tables"}<i aria-hidden="true">·</i>{schema.relations.length} {schema.relations.length === 1 ? "relation" : "relations"}</span></div>
    <div className="design-explorer__schema-layout">
      <div className="design-explorer__schema-canvas" role="group" aria-label="Database tables and declared relations">
        <div className="design-explorer__tables">{schema.tables.map((item) => <TableCard key={item.id} table={item} selected={item.id === selectedId} relationCount={schema.relations.filter((relation) => relation.from === item.id || relation.to === item.id).length} onClick={() => onSelect(item.id)} />)}</div>
        {schema.relations.length > 0 && <div className="design-explorer__relations" aria-label="Declared relationships">{schema.relations.map((relation) => <div key={relation.id}><span>{schema.tables.find((entry) => entry.id === relation.from)?.name}.{relation.fromColumn}</span><ArrowRight size={15} aria-hidden="true" /><span>{relation.toColumn === "id" ? schema.tables.find((entry) => entry.id === relation.to)?.name : `${schema.tables.find((entry) => entry.id === relation.to)?.name}.${relation.toColumn}`}</span><small>{relation.label}</small></div>)}</div>}
        <KeyLegend />
      </div>
      {table && <aside className="design-explorer__table-detail" aria-live="polite" aria-atomic="true">
        <div><span>Selected table</span><h4>{table.name}</h4><p>{table.description}</p></div>
        <ul>{table.columns.map((column) => <li key={column.name}><code>{column.name}</code><span>{column.type}</span><div>{column.keys?.map((key) => <em key={key} data-key={key}>{key}</em>)}</div>{column.note && <small>{column.note}</small>}</li>)}</ul>
        {table.constraints?.length ? <div className="design-explorer__constraints"><strong>Constraints</strong>{table.constraints.map((constraint) => <p key={constraint}>{constraint}</p>)}</div> : null}
      </aside>}
    </div>
    <ul className="design-explorer__schema-notes">{schema.notes.map((note) => <li key={note}>{note}</li>)}</ul>
  </div>;
}

function TableCard({ table, selected, relationCount, onClick }: { table: SchemaTable; selected: boolean; relationCount: number; onClick: () => void }) {
  return <button type="button" className="design-explorer__table-card" data-active={selected} aria-pressed={selected} aria-label={`Select ${table.name} table, ${table.columns.length} columns, ${relationCount} declared relations`} onClick={onClick}>
    <span className="design-explorer__table-title"><strong>{table.name}</strong><small>{table.columns.length} columns{relationCount ? ` · ${relationCount} relations` : ""}</small></span>
    <span className="design-explorer__table-columns">{table.columns.map((column) => <span key={column.name}><span>{column.keys?.map((key) => <em key={key} data-key={key}>{key}</em>)}</span><code>{column.name}</code><small>{column.type}</small></span>)}</span>
  </button>;
}

function KeyLegend() {
  return <div className="design-explorer__legend" aria-label="Database key legend">{(["PK", "FK", "UQ", "IDX"] as const).map((key) => <span key={key}><em data-key={key}>{key}</em>{({ PK: "Primary", FK: "Foreign", UQ: "Unique", IDX: "Index" })[key]}</span>)}</div>;
}
