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
            <span aria-hidden="true" className={styles.brandMark}>BR</span>
            <span>Body Restore</span>
          </a>
          <nav aria-label="Основна навігація" className={styles.nav}>
            <a href="/">Головна</a>
            <a href="/services/">Послуги</a>
            <a href="tel:+380968592465">Запис</a>
          </nav>
        </div>
      </header>

      <main className={styles.main}>
        <section className={styles.section}>
          <p className={styles.eyebrow}>Body Restore · Одеса</p>
          <h1 className={styles.sectionHeading}>Послуги масажу в Одесі</h1>
          <p className={styles.lead}>
            Оберіть процедуру, про яку хочете дізнатися більше. Формат, тривалість і вартість уточнюємо під час попереднього запису — без універсальних обіцянок для всіх.
          </p>
          <div className={styles.grid}>
            {massageServices.map((service) => (
              <article className={styles.card} key={service.slug}>
                <img alt="" className={styles.cardImage} src={service.image} />
                <div className={styles.cardBody}>
                  <h2>{service.name}</h2>
                  <p>{service.shortDescription}</p>
                  <div className={styles.cardActions}>
                    <a className={styles.textLink} href={`/services/${service.slug}/`}>
                      Детальніше
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
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
          <span>Одеса, Фонтанська дорога, 58/3</span>
          <a href="tel:+380968592465">096 859 24 65</a>
        </div>
      </footer>
    </div>
  );
}
