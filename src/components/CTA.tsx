import Image from "next/image";
import {
  ArrowRight,
  BadgeCheck,
  Camera,
  MapPin,
  Phone,
  Send,
  MessageCircle,
  Sparkles,
} from "lucide-react";

import roomPhoto from "../../photo_2026-06-23_13-38-32.jpg";

const chips = ["Лікування", "Краса", "Відновлення"];

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

export default function CTA() {
  const mapQuery = encodeURIComponent("Одеса, Фонтанська дорога, 58/3");
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${mapQuery}`;

  return (
    <section id="gallery" className="scroll-mt-24 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <div className="space-y-5">
            <p className="text-xs font-semibold uppercase tracking-[0.34em] text-[#b98c34]">
              Галерея та запис
            </p>
            <h2 className="max-w-3xl text-3xl font-normal leading-tight tracking-[-0.02em] text-foreground sm:text-4xl">
              Тут немає порожнього фіналу. Є простір, контакт і прямий шлях до консультації.
            </h2>
            <p className="max-w-2xl text-base leading-7 text-muted">
              Ось як виглядає сам кабінет і як швидко з ним зв’язатися. Без QR-постерів,
              без зайвих картинок з текстом, без довгих кроків.
            </p>

            <div className="flex flex-wrap gap-3">
              {chips.map((chip) => (
                <span
                  key={chip}
                  className="inline-flex items-center gap-2 rounded-full border border-[#eadfd5] bg-[#fffaf2] px-4 py-2 text-sm font-medium text-[#6c4b2e]"
                >
                  <BadgeCheck className="h-4 w-4 text-primary" />
                  {chip}
                </span>
              ))}
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {socialChannels.map((channel) => {
                const Icon = channel.icon;

                return (
                  <div
                    key={channel.label}
                    className="rounded-[1.35rem] border border-[#eadfd5] bg-white p-4 shadow-sm"
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#f0e4d5] text-primary">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">
                          {channel.label}
                        </p>
                        <p className="mt-1 text-sm leading-6 text-muted">
                          {channel.detail}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="rounded-[1.75rem] border border-[#eadfd5] bg-[#1b1b1b] p-6 text-white shadow-[0_18px_50px_rgba(27,27,27,0.16)]">
              <p className="text-xs font-semibold uppercase tracking-[0.34em] text-white/60">
                Перший крок до здоров’я
              </p>
              <p className="mt-3 text-2xl font-normal leading-tight tracking-[-0.02em] text-white sm:text-[2rem]">
                Запишіться на консультацію вже сьогодні.
              </p>
              <p className="mt-3 max-w-xl text-sm leading-7 text-white/[0.72]">
                Попередній запис обов’язковий, тому краще одразу подзвонити і
                забронювати свій час.
              </p>
              <div className="mt-5 flex flex-wrap gap-4">
                <a
                  href="tel:0968592465"
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition hover:-translate-y-0.5 hover:bg-[#6f4228]"
                >
                  <Phone className="h-4 w-4" />
                  Подзвонити
                </a>
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.05] px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-white/10"
                >
                  <ArrowRight className="h-4 w-4" />
                  Відкрити маршрут
                </a>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="overflow-hidden rounded-[1.65rem] border border-[#eadfd5] bg-white shadow-[0_10px_30px_rgba(27,27,27,0.08)] sm:row-span-2">
              <Image
                src={roomPhoto}
                alt="Кабінет BodyRes"
                className="h-full min-h-[20rem] w-full object-cover object-[center_54%]"
                sizes="(min-width: 1024px) 48vw, 100vw"
              />
            </div>

            <div className="rounded-[1.65rem] border border-[#eadfd5] bg-[#fffaf2] p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.34em] text-[#b98c34]">
                Локація
              </p>
              <div className="mt-4 flex items-start gap-3">
                <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-lg font-semibold text-foreground">
                    Одеса, Фонтанська дорога, 58/3
                  </p>
                  <p className="mt-2 text-sm leading-6 text-muted">
                    Одна точка, без зайвих маршрутів і без розмитих орієнтирів.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[1.65rem] border border-[#eadfd5] bg-[#1b1b1b] p-5 text-white shadow-[0_10px_30px_rgba(27,27,27,0.08)]">
              <p className="text-xs font-semibold uppercase tracking-[0.34em] text-white/60">
                Контакт
              </p>
              <a
                href="tel:0968592465"
                className="mt-4 block text-2xl font-semibold tracking-[-0.02em] text-white transition hover:text-accent"
              >
                096 859 24 65
              </a>
              <p className="mt-2 text-sm leading-6 text-white/[0.72]">
                Запис і консультація лише за попереднім дзвінком.
              </p>
            </div>

            <div className="overflow-hidden rounded-[1.65rem] border border-[#eadfd5] bg-white shadow-[0_10px_30px_rgba(27,27,27,0.08)]">
              <Image
                src={roomPhoto}
                alt="Кабінет BodyRes, інший ракурс"
                className="h-full min-h-[18rem] w-full object-cover object-[center_42%]"
                sizes="(min-width: 1024px) 24vw, 100vw"
              />
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-[2rem] bg-[#1b1b1b] p-6 text-white shadow-[0_24px_70px_rgba(27,27,27,0.16)]">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.34em] text-white/60">
                Швидка дія
              </p>
              <p className="mt-3 max-w-3xl text-2xl font-normal leading-tight tracking-[-0.02em] text-white sm:text-[2rem]">
                Якщо вам вже відомий потрібний формат, просто подзвоніть і забронюйте час.
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <a
                href="tel:0968592465"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition hover:-translate-y-0.5 hover:bg-[#6f4228]"
              >
                <Phone className="h-4 w-4" />
                Подзвонити
              </a>
              <a
                href="#contacts"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.05] px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-white/10"
              >
                <Sparkles className="h-4 w-4" />
                До контактів
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
