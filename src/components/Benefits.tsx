import { BadgeCheck, Sparkles } from "lucide-react";

const benefits = [
  "Зменшення болю та м’язової напруги.",
  "Покращення постави, рухливості та загального самопочуття.",
  "Зменшення набряків і відчуття важкості в тілі.",
  "Покращення кровообігу та лімфотоку.",
  "Підтягнуті контури тіла та зменшення проявів целюліту.",
  "Покращення травлення та роботи внутрішніх органів.",
  "Глибоке розслаблення, зниження стресу та покращення сну.",
  "Більше енергії, легкості та гармонії у тілі.",
  "Свіжий вигляд, покращення тонусу та природне омолодження обличчя.",
  "Відновлення після фізичних навантажень і покращення спортивної форми.",
  "Покращення настрою, підвищення життєвого тонусу та відчуття внутрішньої гармонії.",
  "Турбота про себе, яка позитивно впливає не лише на тіло, а й на емоційний стан.",
];

const keyEffects = [
  {
    title: "Біль і напруга",
    text: "Менше болю в спині, шиї, попереку та менше скутості в м’язах.",
  },
  {
    title: "Набряки і застій",
    text: "Лімфа, рідина та важкість у тілі перестають тиснути так сильно.",
  },
  {
    title: "Форма і тонус",
    text: "Підтягнутіші контури, краща постава і більш живий вигляд тіла.",
  },
  {
    title: "Стан і енергія",
    text: "Більше легкості, сну, спокою, настрою та відчутної життєвої сили.",
  },
];

export default function Benefits() {
  return (
    <section id="results" className="scroll-mt-24 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#eadfd5] bg-white/90 px-4 py-2 text-sm font-semibold text-[#b98c34] shadow-sm">
              <Sparkles className="h-4 w-4 text-primary" />
              Що змінюється після курсу
            </div>

            <h2 className="max-w-xl text-3xl font-normal leading-tight tracking-[-0.02em] text-foreground sm:text-4xl">
              Вже після перших сеансів ви відчуєте
            </h2>

            <p className="max-w-xl text-base leading-7 text-muted">
              Це не абстрактний wellness-текст. Тут зібрані реальні наслідки
              курсу з бізнес-опису, щоб людина одразу бачила, що отримає для тіла
              і самопочуття.
            </p>

            <div className="rounded-[2rem] border border-[#eadfd5] bg-[#1b1b1b] p-6 text-white shadow-[0_18px_50px_rgba(27,27,27,0.16)]">
              <p className="text-xs font-semibold uppercase tracking-[0.34em] text-white/60">
                Ключові ефекти
              </p>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {keyEffects.map((effect) => (
                  <div
                    key={effect.title}
                    className="rounded-[1.35rem] border border-white/10 bg-white/[0.06] p-4"
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-accent">
                        <BadgeCheck className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-semibold text-white">{effect.title}</p>
                        <p className="mt-1 text-sm leading-6 text-white/[0.72]">
                          {effect.text}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              {benefits.map((benefit) => (
                <div
                  key={benefit}
                  className="group rounded-[1.5rem] border border-[#eadfd5] bg-white/95 p-4 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(27,27,27,0.1)]"
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-[#f0e4d5] text-primary">
                      <BadgeCheck className="h-4 w-4" />
                    </div>
                    <p className="text-sm leading-6 text-foreground">{benefit}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-[1.75rem] border border-[#eadfd5] bg-[#fffaf2] p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.34em] text-[#b98c34]">
                Фінальний акцент
              </p>
              <p className="mt-3 max-w-3xl text-xl leading-8 text-[#6c4b2e]">
                Масаж — це не лише приємна процедура, а й інвестиція у ваше здоров’я,
                красу та якість життя. Дозвольте собі відчути легкість, енергію та
                гармонію вже сьогодні!
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
