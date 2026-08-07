import { expect, test } from "@playwright/test";

const services = [
  ["likuvalnyi-masazh", "Лікувальний масаж в Одесі"],
  ["visceralnyi-masazh", "Вісцеральний масаж живота в Одесі"],
  ["antytseliulitnyi-masazh", "Антицелюлітний масаж в Одесі"],
  ["limfodrenazhnyi-masazh", "Лімфодренажний масаж в Одесі"],
  ["medovyi-masazh", "Медовий масаж в Одесі"],
  ["dytiachyi-masazh", "Дитячий масаж та гімнастика в Одесі"],
  ["masazh-oblychchia", "Глибокий масаж обличчя в Одесі"],
  ["masazh-dlia-vahitnykh", "Масаж для вагітних в Одесі"],
  ["sportyvnyi-masazh", "Спортивний масаж в Одесі"],
  ["vohnianyi-masazh", "Вогняний масаж в Одесі"],
] as const;

test("каталог послуг веде до всіх підтверджених процедур", async ({ page }) => {
  const response = await page.goto("/services/");

  expect(response?.status()).toBe(200);
  await expect(page.getByRole("heading", { level: 1, name: "Послуги масажу в Одесі" })).toBeVisible();
  await expect(page.locator("main a[href^='/services/']")).toHaveCount(10);

  for (const [slug] of services) {
    await expect(page.locator(`a[href='/services/${slug}/']`).first()).toBeVisible();
  }
});

test("каталог переходить між статичними сторінками без RSC 404", async ({ page }) => {
  const failedRscRequests: string[] = [];
  page.on("response", (response) => {
    if (response.status() === 404 && response.url().includes("__next.services")) {
      failedRscRequests.push(response.url());
    }
  });

  await page.goto("/services/", { waitUntil: "networkidle" });
  await page.locator("a[href='/services/likuvalnyi-masazh/']").first().click();

  await expect(page).toHaveURL(/\/services\/likuvalnyi-masazh\/$/);
  await expect(page.getByRole("heading", { level: 1, name: "Лікувальний масаж в Одесі" })).toBeVisible();
  expect(failedRscRequests).toEqual([]);
});

for (const [slug, heading] of services) {
  test(`${heading} має canonical metadata, Service JSON-LD і запис`, async ({ page }) => {
    const response = await page.goto(`/services/${slug}/`);

    expect(response?.status()).toBe(200);
    await expect(page.getByRole("heading", { level: 1, name: heading })).toBeVisible();
    await expect(page.locator("link[rel='canonical']")).toHaveAttribute(
      "href",
      `https://body-re.store/services/${slug}/`,
    );
    const serviceSchema = await page.locator("script[type='application/ld+json']").evaluate(
      (element) => JSON.parse(element.innerHTML),
    );
    expect(serviceSchema).toMatchObject({
      "@type": "Service",
      name: heading,
    });
    await expect(page.getByRole("link", { name: /записатися|зателефонувати/i })).toBeVisible();
  });
}

test("внутрішній iframe-шаблон не індексується окремо", async ({ page }) => {
  const response = await page.goto("/sharp-template/Sharp/index.html");

  expect(response?.status()).toBe(200);
  await expect(page.locator("meta[name='robots']")).toHaveAttribute("content", "noindex,follow");
});
