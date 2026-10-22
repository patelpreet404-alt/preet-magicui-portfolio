export default function BlogLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <div className="container-site max-w-3xl py-16">{children}</div>;
}
