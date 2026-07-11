import { OfficesNav } from "@/components/offices-nav";

export default function OfficesLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="offices-shell">
      <OfficesNav />
      <main className="offices-main">{children}</main>
    </div>
  );
}
