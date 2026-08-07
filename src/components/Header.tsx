import { Phone, Sparkles } from "lucide-react";

const navItems = [
  { href: "#services", label: "Послуги" },
  { href: "#results", label: "Результат" },
  { href: "#approach", label: "Підхід" },
  { href: "#gallery", label: "Галерея" },
  { href: "#contacts", label: "Контакти" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-[#eadfd5] bg-white/82 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <a href="#top" className="group flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#1b1b1b] text-[#d7af45] shadow-lg shadow-black/10 transition duration-300 group-hover:-rotate-6 group-hover:scale-105">
            <Sparkles className="h-5 w-5" />
          </span>
          <span className="leading-tight">
            <span className="block text-[0.62rem] font-semibold uppercase tracking-[0.38em] text-[#b98c34]">
              BodyRes
            </span>
            <span className="block text-sm font-medium text-foreground sm:text-base">
              Масаж в Одесі
            </span>
          </span>
        </a>

        <nav className="hidden flex-1 items-center justify-center md:flex">
          <div className="flex items-center gap-1 rounded-full border border-[#eadfd5] bg-white/90 p-1 shadow-sm">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="rounded-full px-4 py-2 text-sm font-medium text-muted transition hover:bg-[#f0e4d5] hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                {item.label}
              </a>
            ))}
          </div>
        </nav>

        <a
          href="tel:0968592465"
          className="ml-auto inline-flex items-center gap-2 rounded-full bg-[#1b1b1b] px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-black/10 transition hover:-translate-y-0.5 hover:bg-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <Phone className="h-4 w-4" />
          <span className="hidden sm:inline">096 859 24 65</span>
          <span className="sm:hidden">Дзвінок</span>
        </a>
      </div>
    </header>
  );
}
