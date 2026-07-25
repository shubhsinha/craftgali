// App layout — authenticated marketplace shell (sidebar/nav)
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-shell">
      <aside>{/* Sidebar */}</aside>
      <main>{children}</main>
    </div>
  );
}
