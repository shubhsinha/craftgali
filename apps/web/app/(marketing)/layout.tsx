// Marketing layout — public nav + footer
export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header>{/* Marketing nav */}</header>
      <main>{children}</main>
      <footer>{/* Footer */}</footer>
    </>
  );
}
