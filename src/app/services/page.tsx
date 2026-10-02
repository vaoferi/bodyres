import type { Metadata } from "next";

import { massageServices } from "@/data/services";

import styles from "./services.module.css";

export const metadata: Metadata = {
  title: "Послуги масажу в Одесі",
  description: "Каталог послуг Body Restore в Одесі: лікувальний, вісцеральний, лімфодренажний, спортивний та інші види масажу.",
  alternates: { canonical: "/services/" },
};

export default function ServicesPage() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <a className={styles.brand} href="/">
            <img alt="" aria-hidden="true" className={styles.brandLogo} height={44} src="/icon.svg" width={44} />
            <span>Body Restore</span>
          </a>
          <nav aria-label="Основна навігація" className={styles.nav}>
            <a href="/">Головна</a>
            <a aria-current="page" href="/services/">Послуги</a>
            <a href="tel:+380968592465">Запис</a>
          </nav>
        </div>
      </header>

      <main className={styles.main}>
        {/* NLM-213: eyebrow над H1 прибрано — заголовок несе власну вагу сам. */}
        <section className={styles.section}>
          <h1 className={styles.sectionHeading}>Послуги масажу в Одесі</h1>
          <p className={styles.lead}>
            Оберіть процедуру, про яку хочете дізнатися більше. Формат, тривалість і вартість уточнюємо під час попереднього запису — без універсальних обіцянок для всіх.
          </p>
          <ul className={styles.grid}>
            {massageServices.map((service) => (
              <li key={service.slug}>
                <article className={styles.card}>
                  <div className={styles.cardMedia}>
                    <img alt="" className={styles.cardImage} loading="lazy" src={service.image} />
                  </div>
                <div className={styles.cardBody}>
                  <h2>{service.name}</h2>
                  <p>{service.shortDescription}</p>
                  <div className={styles.cardActions}>
                    <span aria-hidden="true" className={styles.cardFocus}>
                      {service.focus[0]}
                    </span>
                    <span className={styles.cardCta}>
                      Детальніше
                      <svg aria-hidden="true" className={styles.cardArrow} viewBox="0 0 20 20">
                        <path d="M4 10h11m-4.5-4.5L15 10l-4.5 4.5" />
                      </svg>
                    </span>
                  </div>
                </div>
                </article>
                <a aria-label={`Детальніше: ${service.name}`} className={styles.cardLink} href={`/services/${service.slug}/`} />
              </li>
            ))}
          </ul>
        </section>
        <section className={styles.cta}>
          <div>
            <h2>Не впевнені, що обрати?</h2>
            <p>Зателефонуйте або напишіть перед записом. Уточнимо ваш запит і комфортний формат процедури.</p>
          </div>
          <div className={styles.actions}>
            <a className={styles.button} href="tel:+380968592465">Зателефонувати</a>
            <a className={styles.buttonSecondary} href="mailto:book@body-re.store">Написати</a>
          </div>
        </section>
      </main>
     <footer className={styles.footer}>
       <div className={styles.footerInner}>
          <span>Івана Фунтового 68/1, Одеса</span>
         <a href="tel:+380968592465">096 859 24 65</a>
        </div>
      </footer>
    </div>
  );
}
