import { Activity, BadgeCheck, Droplets, HeartPulse, Sparkles } from "lucide-react";

const reasons = [
  {
    title: "Коли болить спина, шия або поперек",
    text: "Лікувальний масаж допомагає зменшити м’язову напругу і повертає тілу нормальний рух.",
    icon: HeartPulse,
  },
  {
    title: "Коли тіло набрякає і стає важким",
    text: "Лімфодренажний масаж працює з рідиною, набряками та відчуттям застою.",
    icon: Droplets,
  },
  {
    title: "Коли хочеться підтягнути форму",
    text: "Антицелюлітний і медовий масаж підтримують тонус, контури та кровообіг.",
    icon: Sparkles,
  },
  {
    title: "Коли потрібно відновитися",
    text: "Спортивний, дитячий, вагітних та вогняний масаж закривають різні сценарії турботи про тіло.",
    icon: Activity,
  },
];

const values = [
  "Індивідуальний підхід",
  "Комфортна атмосфера",
  "Працюю на результат",
  "Попередній запис обов’язковий",
];

export default function Testimonials() {
  return (
    <section id="approach" className="scroll-mt-24 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.34em] text-[#b98c34]">
            Чому BodyRes
          </p>
          <h2 className="max-w-3xl text-3xl font-normal leading-tight tracking-[-0.02em] text-foreground sm:text-4xl">
            Сайт має одразу показувати людині, чи потрапила вона за адресою, де вирішують саме її запит.
          </h2>
          <p className="max-w-3xl text-base leading-7 text-muted">
            Тут не потрібна декоративна картка, що висить збоку і ламає ритм.
            Потрібно одразу показати сценарії, у яких BodyRes справді допомагає.
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {reasons.map((reason) => {
            const Icon = reason.icon;

            return (
              <article
                key={reason.title}
                className="rounded-[1.65rem] border border-[#eadfd5] bg-white/95 p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(27,27,27,0.1)]"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f0e4d5] text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-xl font-normal tracking-[-0.02em] text-foreground">
                  {reason.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-muted">{reason.text}</p>
              </article>
            );
          })}
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          {values.map((value) => (
            <span
              key={value}
              className="inline-flex items-center gap-2 rounded-full border border-[#eadfd5] bg-white px-4 py-2 text-sm font-medium text-foreground shadow-sm"
            >
              <BadgeCheck className="h-4 w-4 text-primary" />
              {value}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
