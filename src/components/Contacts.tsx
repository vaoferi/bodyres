import {
  ArrowRight,
  Camera,
  Clock,
  MapPin,
  Phone,
  MessageCircle,
  Send,
} from "lucide-react";

const socialChannels = [
  {
    label: "Instagram",
    detail: "@BODY_RESTORE_ODESA",
    icon: Camera,
  },
  {
    label: "Telegram",
    detail: "Швидкий меседж",
    icon: Send,
  },
  {
    label: "Facebook",
    detail: "Новини та відгуки",
    icon: MessageCircle,
  },
];

export default function Contacts() {
  const mapQuery = encodeURIComponent("Івана Фунтового 68/1, Одеса");
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${mapQuery}`;

  return (
    <footer id="contacts" className="scroll-mt-24 bg-[#1b1b1b] text-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr_1fr]">
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.34em] text-white/[0.55]">
              BodyRes
            </p>
            <h2 className="max-w-xl text-3xl font-normal leading-tight tracking-[-0.02em] text-white sm:text-4xl">
              Тут запис не губиться, а контакт не ховається в QR-картинку.
            </h2>
            <p className="max-w-xl text-sm leading-7 text-white/[0.72]">
              Одна адреса, один номер і зрозумілий маршрут. Якщо треба,
              можна відкрити мапу, подзвонити або перейти в соцмережі через іконки.
            </p>
          </div>

          <div className="space-y-5">
            <div className="rounded-[1.65rem] border border-white/10 bg-white/[0.06] p-5 backdrop-blur">
              <p className="text-xs font-semibold uppercase tracking-[0.34em] text-white/[0.55]">
                Адреса
              </p>
              <div className="mt-3 flex items-start gap-3">
                <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-accent">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-lg font-semibold text-white">
                    Івана Фунтового 68/1, Одеса
                  </p>
                  <p className="mt-2 text-sm leading-6 text-white/70">
                    Одна точка, без зайвих переходів і без розмитих орієнтирів.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[1.65rem] border border-white/10 bg-white/[0.06] p-5 backdrop-blur">
              <p className="text-xs font-semibold uppercase tracking-[0.34em] text-white/[0.55]">
                Телефон
              </p>
              <a
                href="tel:0968592465"
                className="mt-3 inline-flex items-center gap-2 text-2xl font-semibold tracking-[-0.02em] text-white transition hover:text-accent"
              >
                <Phone className="h-5 w-5" />
                096 859 24 65
              </a>
              <p className="mt-2 text-sm leading-6 text-white/70">
                Попередній запис обов’язковий.
              </p>
            </div>

            <div className="rounded-[1.65rem] border border-white/10 bg-white/[0.06] p-5 backdrop-blur">
              <p className="text-xs font-semibold uppercase tracking-[0.34em] text-white/[0.55]">
                Графік
              </p>
              <div className="mt-3 inline-flex items-center gap-2 text-lg font-semibold text-white">
                <Clock className="h-5 w-5 text-accent" />
                Пн-Пт 09:00-18:00
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <div className="rounded-[1.65rem] border border-white/10 bg-white/[0.06] p-5 backdrop-blur">
              <p className="text-xs font-semibold uppercase tracking-[0.34em] text-white/[0.55]">
                Соцмережі
              </p>
              <div className="mt-4 space-y-3">
                {socialChannels.map((channel) => {
                  const Icon = channel.icon;

                  return (
                    <div
                      key={channel.label}
                      className="rounded-[1.25rem] border border-white/10 bg-white/[0.05] p-4"
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-accent">
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-white">
                            {channel.label}
                          </p>
                          <p className="mt-1 text-sm leading-6 text-white/70">
                            {channel.detail}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-[1.65rem] border border-white/10 bg-white/[0.06] p-5 backdrop-blur">
              <p className="text-xs font-semibold uppercase tracking-[0.34em] text-white/[0.55]">
                Маршрут
              </p>
              <a
                href={mapsUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-foreground transition hover:-translate-y-0.5 hover:bg-accent"
              >
                <ArrowRight className="h-4 w-4" />
                Відкрити мапу
              </a>
              <p className="mt-3 text-sm leading-6 text-white/70">
                Якщо потрібно, маршрут можна відкрити одразу з цієї сторінки.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-5 text-sm text-white/[0.55] sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>&copy; {new Date().getFullYear()} BodyRes. Всі права захищені.</p>
          <a
            href="#top"
            className="inline-flex items-center gap-2 font-medium text-white transition hover:text-accent"
          >
            Вгору
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </footer>
  );
}
