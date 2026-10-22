import "./demos.css";

export default function DemosLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <div className="site-content">{children}</div>;
}
