import Image from "next/image";
import {
  ArrowRight,
  BadgeCheck,
  Camera,
  MapPin,
  Phone,
  Sparkles,
  MessageCircle,
  Send,
} from "lucide-react";

import roomPhoto from "../../photo_2026-06-23_13-38-32.jpg";

const facts = [
  {
    label: "Послуг",
    value: "10",
    hint: "усі напрямки з бізнес-опису",
  },
  {
    label: "Адреса",
    value: "58/3",
    hint: "Фонтанська дорога",
  },
  {
    label: "Запис",
    value: "обов’язковий",
    hint: "потрібно бронювати завчасно",
  },
];

const focusItems = [
  "Лікувальний, вісцеральний і спортивний напрямки",
  "Антицелюлітний, лімфодренажний і медовий курс",
  "Дитячий, вагітних, обличчя та вогняний масаж",
];

const highlights = [
  {
    icon: BadgeCheck,
    title: "10 напрямків без випадкових позицій",
    text: "Лікувальний, вісцеральний, антицелюлітний, лімфодренажний, медовий, дитячий, для вагітних, обличчя, спортивний і вогняний.",
  },
  {
    icon: Sparkles,
    title: "Попередній запис обов’язковий",
    text: "Людина одразу бачить телефон, адресу і розуміє, що час потрібно бронювати заздалегідь.",
  },
  {
    icon: MapPin,
    title: "Одна зрозуміла точка",
    text: "Одеса, Фонтанська дорога, 58/3. Без зайвих маршрутів і без порожнього місця на екрані.",
  },
];

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

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden pt-6 sm:pt-8 lg:pt-12">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(139,94,60,0.12),transparent_30%),radial-gradient(circle_at_top_right,rgba(215,175,69,0.14),transparent_24%),linear-gradient(180deg,#fffdfb_0%,#fff8ef_50%,#fffdf7_100%)]" />
      <div className="absolute left-6 top-20 -z-10 h-32 w-32 rounded-full bg-primary/15 blur-3xl animate-rise" />
      <div className="absolute right-8 top-14 -z-10 h-40 w-40 rounded-full bg-accent/20 blur-3xl animate-floaty" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#eadfd5] bg-white/85 px-4 py-2 text-sm font-semibold text-[#a57721] shadow-sm">
              <span className="h-2 w-2 rounded-full bg-primary" />
              Класичний one-page для BodyRes
            </div>

            <div className="space-y-5">
              <p className="max-w-fit rounded-full bg-[#f0e4d5] px-4 py-2 text-xs font-semibold uppercase tracking-[0.34em] text-[#8b5e3c]">
                Масаж в Одесі
              </p>

              <h1 className="max-w-2xl text-4xl font-normal leading-[0.92] tracking-[-0.03em] text-foreground sm:text-5xl lg:text-7xl">
                Масаж, який повертає{" "}
                <span className="text-primary">рух, легкість</span> і зібраний
                вигляд сторінки.
              </h1>

              <p className="max-w-2xl text-base leading-7 text-muted sm:text-lg sm:leading-8">
                Ваше тіло щодня працює для вас - подаруйте йому відпочинок,
                відновлення та турботу, на яку воно заслуговує. Попередній запис
                обов’язковий, а вся інформація вже зібрана в один щільний,
                читабельний екран.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <a
                href="tel:0968592465"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-4 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition hover:-translate-y-0.5 hover:bg-[#6f4228] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                Записатися на консультацію
                <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="#services"
                className="inline-flex items-center gap-2 rounded-full border border-[#eadfd5] bg-white/90 px-6 py-4 text-sm font-semibold text-foreground shadow-sm transition hover:-translate-y-0.5 hover:border-primary/35 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                Переглянути послуги
              </a>
            </div>

            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.34em] text-muted">
                Канали зв’язку
              </p>
              <div className="flex flex-wrap gap-3">
                {socialChannels.map((channel) => {
                  const Icon = channel.icon;

                  return (
                    <span
                      key={channel.label}
                      className="inline-flex items-center gap-3 rounded-full border border-[#eadfd5] bg-white/90 px-4 py-3 text-left shadow-sm"
                    >
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f0e4d5] text-primary">
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="leading-tight">
                        <span className="block text-sm font-semibold text-foreground">
                          {channel.label}
                        </span>
                        <span className="block text-xs text-muted">
                          {channel.detail}
                        </span>
                      </span>
                    </span>
                  );
                })}
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {facts.map((fact) => (
                <div
                  key={fact.label}
                  className="rounded-[1.5rem] border border-[#eadfd5] bg-white/95 p-4 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted">
                    {fact.label}
                  </p>
                  <p className="mt-2 text-2xl font-normal text-foreground">
                    {fact.value}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-muted">{fact.hint}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              {focusItems.map((item) => (
                <span
                  key={item}
                  className="inline-flex items-center gap-2 rounded-full border border-[#eadfd5] bg-[#fffaf2] px-4 py-2 text-sm font-medium text-[#6c4b2e]"
                >
                  <BadgeCheck className="h-4 w-4 text-primary" />
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 -z-10 rounded-[2.5rem] bg-[radial-gradient(circle_at_top,rgba(139,94,60,0.16),transparent_26%),radial-gradient(circle_at_bottom_right,rgba(215,175,69,0.16),transparent_24%)] blur-3xl" />
            <div className="rounded-[2rem] border border-[#eadfd5] bg-white p-3 shadow-[0_24px_80px_rgba(27,27,27,0.12)]">
              <div className="relative overflow-hidden rounded-[1.5rem]">
                <Image
                  src={roomPhoto}
                  alt="Кабінет BodyRes з масажним столом і світлим інтер’єром"
                  className="h-[28rem] w-full object-cover object-[center_55%] lg:h-[34rem]"
                  priority
                  sizes="(min-width: 1024px) 52vw, 100vw"
                />
                <div className="absolute inset-x-4 bottom-4 rounded-[1.25rem] border border-white/80 bg-white/92 px-4 py-3 shadow-lg backdrop-blur">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#f0e4d5] text-primary">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        Одеса, Фонтанська дорога, 58/3
                      </p>
                      <p className="text-sm leading-6 text-muted">
                        Запис лише заздалегідь, щоб отримати персональний час без
                        поспіху.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-[1.05fr_0.95fr]">
              <div className="rounded-[1.75rem] border border-[#eadfd5] bg-[#1b1b1b] p-5 text-white shadow-[0_18px_50px_rgba(27,27,27,0.16)]">
                <p className="text-xs font-semibold uppercase tracking-[0.34em] text-white/60">
                  Що важливо
                </p>
                <div className="mt-4 space-y-4">
                  {highlights.map((item) => {
                    const Icon = item.icon;

                    return (
                      <div key={item.title} className="flex gap-3">
                        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-accent">
                          <Icon className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-semibold text-white">{item.title}</p>
                          <p className="text-sm leading-6 text-white/[0.72]">
                            {item.text}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-[1.75rem] border border-[#eadfd5] bg-[#fffaf2] p-5 shadow-[0_18px_50px_rgba(27,27,27,0.08)]">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div className="space-y-3">
                    <p className="max-w-lg text-2xl font-normal leading-tight text-foreground sm:text-[2rem]">
                      Перший крок до здоров’я - запишіться на консультацію вже сьогодні!
                    </p>
                    <p className="text-sm leading-6 text-muted">
                      Працюємо не на порожню естетику, а на відчутний стан тіла:
                      легкість, рухливість, тонус і відновлення.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <a
              href="tel:0968592465"
              className="mt-4 flex items-center justify-between gap-4 rounded-[1.5rem] border border-[#eadfd5] bg-[#1b1b1b] px-5 py-4 text-white shadow-[0_20px_40px_rgba(27,27,27,0.16)] transition hover:-translate-y-0.5 hover:bg-primary"
            >
              <span>
                <span className="block text-xs font-semibold uppercase tracking-[0.34em] text-white/65">
                  Запис та консультація
                </span>
                <span className="mt-1 block text-xl font-semibold">
                  096 859 24 65
                </span>
              </span>
              <Phone className="h-6 w-6" />
            </a>
          </div>
        </div>

        <div className="mt-10 grid gap-4 rounded-[1.5rem] border border-[#eadfd5] bg-[#1b1b1b] px-5 py-4 text-white sm:grid-cols-3">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-white/[0.55]">
              Адреса
            </p>
            <p className="text-sm leading-6 text-white/[0.82]">
              Одеса, Фонтанська дорога, 58/3
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-white/[0.55]">
              Телефон
            </p>
            <a
              href="tel:0968592465"
              className="text-lg font-semibold text-white transition hover:text-accent"
            >
              096 859 24 65
            </a>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-white/[0.55]">
              Запис
            </p>
            <p className="text-sm leading-6 text-white/[0.82]">
              Попередній запис обов’язковий.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
