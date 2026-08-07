import {
  Activity,
  Baby,
  Droplets,
  Flame,
  Flower2,
  HeartPulse,
  SunMedium,
  Sparkles,
  Target,
  Waves,
  type LucideIcon,
} from "lucide-react";

const services: {
  title: string;
  description: string;
  outcome: string;
  icon: LucideIcon;
}[] = [
  {
    title: "Лікувальний масаж",
    description: "При болях у спині, шиї, попереку, м’язовій напрузі та втомі.",
    outcome: "Знімає напругу і допомагає тілу рухатися вільніше.",
    icon: HeartPulse,
  },
  {
    title: "Вісцеральний масаж живота",
    description:
      "Для покращення роботи внутрішніх органів, травлення та загального самопочуття.",
    outcome: "Повертає відчуття легкості всередині тіла.",
    icon: Target,
  },
  {
    title: "Антицелюлітний масаж",
    description:
      "Для зменшення проявів целюліту, покращення тонусу шкіри та корекції контурів тіла.",
    outcome: "Фокус на формі, тонусі та видимому результаті.",
    icon: Sparkles,
  },
  {
    title: "Лімфодренажний масаж",
    description:
      "Для зменшення набряків, виведення зайвої рідини та відчуття легкості в тілі.",
    outcome: "Підходить, коли тіло відчувається важким і набряклим.",
    icon: Droplets,
  },
  {
    title: "Медовий масаж",
    description:
      "Для очищення організму, покращення кровообігу та відновлення енергії.",
    outcome: "Після нього тіло відчуває себе живішим і теплішим.",
    icon: Flame,
  },
  {
    title: "Дитячий масаж та гімнастика",
    description:
      "Для гармонійного фізичного розвитку, покращення постави та зміцнення організму.",
    outcome: "М’яка робота для росту, руху і стабільності.",
    icon: Baby,
  },
  {
    title: "Глибокий масаж обличчя",
    description:
      "Для покращення тонусу шкіри, розслаблення м’язів та природного омолодження.",
    outcome: "Дає відчуття свіжості без зайвих обіцянок.",
    icon: SunMedium,
  },
  {
    title: "Масаж для вагітних",
    description:
      "Для зменшення напруги, набряків та покращення самопочуття майбутньої мами.",
    outcome: "Працює дуже делікатно й по-справжньому уважно.",
    icon: Flower2,
  },
  {
    title: "Спортивний масаж",
    description:
      "Для відновлення після фізичних навантажень, профілактики травм та покращення працездатності м’язів.",
    outcome: "Підтримує відновлення і допомагає повертатися в форму.",
    icon: Activity,
  },
  {
    title: "Вогняний масаж",
    description:
      "Для глибокого розслаблення, покращення кровообігу та відновлення життєвого тонусу.",
    outcome: "Надає тілу виразного тепла й активного перезапуску.",
    icon: Waves,
  },
];

export default function Services() {
  return (
    <section id="services" className="scroll-mt-24 bg-[#fff8ef] py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.34em] text-[#b98c34]">
              Послуги BodyRes
            </p>
            <h2 className="max-w-3xl text-3xl font-normal leading-tight tracking-[-0.02em] text-foreground sm:text-4xl">
              Десять напрямків, які закривають біль, набряки, втому та запит на форму.
            </h2>
          </div>

          <p className="max-w-2xl text-base leading-7 text-muted">
            Усі послуги взяті з бізнес-опису і подані без зайвих прикрас.
            Кожна картка одразу пояснює, для чого вона потрібна і який ефект
            людина отримує.
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {services.map((service, index) => {
            const Icon = service.icon;

            return (
              <article
                key={service.title}
                className="group relative overflow-hidden rounded-[1.65rem] border border-[#e9ddd3] bg-white p-5 shadow-[0_3px_20px_rgba(27,27,27,0.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(27,27,27,0.12)]"
              >
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-[#a57440] to-accent" />
                <div className="flex items-start justify-between gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f0e4d5] text-primary">
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="rounded-full bg-[#fff6e6] px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.3em] text-[#a57518]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                <h3 className="mt-5 text-xl font-normal tracking-[-0.02em] text-foreground">
                  {service.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-muted">
                  {service.description}
                </p>

                <div className="mt-5 border-t border-[#f2e8df] pt-4">
                  <p className="text-sm font-medium leading-6 text-[#4f4541]">
                    {service.outcome}
                  </p>
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-4 rounded-[1.5rem] border border-[#eadfd5] bg-white px-5 py-5 shadow-sm lg:flex-row lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#b98c34]">
              Швидкий запис
            </p>
            <p className="mt-2 text-base leading-7 text-muted">
              Коли вже зрозуміло, який масаж потрібен, простіше одразу зателефонувати і
              забронювати час.
            </p>
          </div>

          <a
            href="tel:0968592465"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-4 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition hover:-translate-y-0.5 hover:bg-[#6f4228]"
          >
            Записатися на консультацію
            <Activity className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
