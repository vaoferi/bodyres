import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getMassageService, massageServices } from "@/data/services";

import styles from "../services.module.css";

type ServicePageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return massageServices.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const service = getMassageService((await params).slug);

  if (!service) {
    return {};
  }

  return {
    title: service.name,
    description: service.metaDescription,
    alternates: { canonical: `/services/${service.slug}/` },
    openGraph: {
      title: `${service.name} | Body Restore`,
      description: service.metaDescription,
      url: `/services/${service.slug}/`,
      images: [{ url: service.image }],
    },
  };
}

export default async function ServicePage({ params }: ServicePageProps) {
  const service = getMassageService((await params).slug);

  if (!service) {
    notFound();
  }

  const canonicalUrl = `https://body-re.store/services/${service.slug}/`;
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    description: service.metaDescription,
    url: canonicalUrl,
    areaServed: {
      "@type": "City",
      name: "Одеса",
    },
    provider: {
      "@type": "HealthAndBeautyBusiness",
      name: "Body Restore",
      telephone: "+380968592465",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Фонтанська дорога, 58/3",
        addressLocality: "Одеса",
        addressCountry: "UA",
      },
    },
  };

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

      <main>
        <section className={styles.hero}>
          <img alt="" className={styles.heroImage} src={service.image} />
          <div className={styles.heroContent}>
            <p className={styles.eyebrow}>Body Restore · Одеса</p>
            <h1>{service.name}</h1>
            <p className={styles.heroText}>{service.shortDescription}</p>
          </div>
        </section>

        <div className={styles.main}>
          <section className={styles.section}>
            <h2 className={styles.sectionHeading}>Коли ця процедура може бути доречною</h2>
            <ul className={styles.list}>
              {service.focus.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </section>

          <section className={`${styles.section} ${styles.detailGrid}`}>
            <article className={styles.detailCard}>
              <h2>Як проходить запис і сеанс</h2>
              <ul className={styles.list}>
                {service.flow.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </article>
            <aside className={styles.notice}>
              <h2>Важливо врахувати</h2>
              <p>{service.important}</p>
            </aside>
          </section>

          <section className={styles.cta}>
            <div>
              <h2>Запис за попередньою домовленістю</h2>
              <p>Вартість і тривалість залежать від вашого запиту. Зателефонуйте або напишіть, щоб узгодити зручний формат.</p>
            </div>
            <div className={styles.actions}>
              <a className={styles.button} href="tel:+380968592465">Зателефонувати</a>
              <a className={styles.buttonSecondary} href="mailto:book@body-re.store">Написати</a>
            </div>
          </section>
        </div>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <span>Одеса, Фонтанська дорога, 58/3</span>
          <a href="/services/">Усі послуги</a>
        </div>
      </footer>
      <script dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema).replace(/</g, "\\u003c") }} type="application/ld+json" />
    </div>
  );
}
