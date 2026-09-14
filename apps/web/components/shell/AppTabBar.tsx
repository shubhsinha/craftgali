"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChatIcon, GridIcon, HeartIcon, SearchIcon, StudioIcon } from "./icons";

/** Phone-only bottom rail. Off-screen above 1080px, where the header carries it. */
export function AppTabBar({ studioHref }: { studioHref: string }) {
  const pathname = usePathname();

  const TABS = [
    { href: "/discover", label: "Discover", Icon: GridIcon },
    { href: "/discover?focus=search", label: "Search", Icon: SearchIcon },
    { href: "/saved", label: "Saved", Icon: HeartIcon },
    { href: "/messages", label: "Chats", Icon: ChatIcon },
    { href: studioHref, label: "Studio", Icon: StudioIcon },
  ];

  return (
    <nav className="cg-tabbar cg-show-md" aria-label="Sections">
      {TABS.map(({ href, label, Icon }) => {
        const current = pathname === href || pathname.startsWith(`${href}/`);

        return (
          <Link
            key={href}
            href={href}
            className="cg-tab"
            aria-current={current ? "page" : undefined}
          >
            <span className="cg-tab__icon">
              <Icon size={19} />
            </span>
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
