import { siteConfig } from "../../site.config";

type OrganizationSchema = {
  "@context": string;
  "@type": string;
  name: string;
  url: string;
  logo: string;
  sameAs: string[];
};

export function createOrganizationSchema(): OrganizationSchema {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.organizationName,
    url: siteConfig.siteUrl,
    logo: siteConfig.organizationLogo,
    sameAs: siteConfig.socialLinks,
  };
}

type ArticleInput = {
  title: string;
  description: string;
  datePublished: string;
  dateModified: string;
  url: string;
  image?: string;
};

export function createArticleSchema(article: ArticleInput) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    datePublished: article.datePublished,
    dateModified: article.dateModified,
    image: article.image,
    author: {
      "@type": "Organization",
      name: siteConfig.organizationName,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.organizationName,
      logo: {
        "@type": "ImageObject",
        url: siteConfig.organizationLogo,
      },
    },
    mainEntityOfPage: article.url,
  };
}

type BreadcrumbItem = {
  name: string;
  url: string;
};

export function createBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

type LocalBusinessInput = {
  name: string;
  telephone: string;
  streetAddress: string;
  addressLocality: string;
  addressCountry: string;
  image?: string;
  openingHours?: string[];
};

export function createLocalBusinessSchema(data: LocalBusinessInput) {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: data.name,
    url: siteConfig.siteUrl,
    telephone: data.telephone,
    image: data.image,
    address: {
      "@type": "PostalAddress",
      streetAddress: data.streetAddress,
      addressLocality: data.addressLocality,
      addressCountry: data.addressCountry,
    },
    openingHours: data.openingHours,
  };
}

type ServiceInput = {
  name: string;
  description?: string;
  areaServed?: string;
  url?: string;
};

export function createServiceSchema(data: ServiceInput) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: data.name,
    description: data.description,
    provider: {
      "@type": "LocalBusiness",
      name: siteConfig.organizationName,
    },
    areaServed: data.areaServed
      ? {
          "@type": "City",
          name: data.areaServed,
        }
      : undefined,
    url: data.url,
  };
}

type ProductInput = {
  name: string;
  description: string;
  image: string[];
  category?: string;
  price: string;
  priceCurrency: string;
  url: string;
  validFrom: string;
  priceValidUntil: string;
  googleCategoryCode?: string;
};

export function createProductSchema(data: ProductInput) {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: data.name,
    description: data.description,
    image: data.image,
    offers: {
      "@type": "Offer",
      url: data.url,
      priceCurrency: data.priceCurrency,
      price: data.price,
      availability: "https://schema.org/InStock",
      validFrom: data.validFrom,
      priceValidUntil: data.priceValidUntil,
    },
  };

  if (data.category) {
    schema.category = data.category;
  }

  if (data.googleCategoryCode) {
    (schema.offers as Record<string, unknown>).category = {
      "@type": "CategoryCode",
      inCodeSet:
        "https://www.google.com/basepages/producttype/taxonomy-with-ids.en-US.txt",
      codeValue: data.googleCategoryCode,
    };
  }

  return schema;
}
