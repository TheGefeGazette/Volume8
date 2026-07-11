import Link from "next/link";
import {
  Archive,
  Bot,
  Image as ImageIcon,
  Newspaper,
  Settings,
  Trophy
} from "lucide-react";

const items = [
  ["New Edition", "/offices/editions/new", Newspaper],
  ["Drafts & Archives", "/offices", Archive],
  ["Media Library", "/offices", ImageIcon],
  ["AI Newsroom", "/offices", Bot],
  ["Awards", "/offices", Trophy],
  ["Printing Press", "/offices/printing-press", Settings]
] as const;

export function OfficesNav() {
  return (
    <nav className="offices-nav" aria-label="Gazette Offices">
      <Link href="/" className="offices-brand">
        The Gefe Gazette
      </Link>
      <p>The Gazette Offices</p>

      <div>
        {items.map(([label, href, Icon]) => (
          <Link key={label} href={href}>
            <Icon size={18} />
            <span>{label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
