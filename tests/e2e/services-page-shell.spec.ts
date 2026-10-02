import { expect, test } from "@playwright/test";

// NLM-213: /services/ renders inside the same layout as the fixed-iframe home page.
// `body { overflow: hidden }` exists for the home iframe, but it silently made the
// catalog unscrollable: all 10 cards, the CTA and the footer existed in the DOM and
// were unreachable for a visitor. Source/DOM presence is not proof of reachability,
// so this gate asserts actual scroll travel, not element counts.
test("сторінка послуг справді прокручується до кінця", async ({ page }) => {
  await page.goto("/services/");

  const geometry = await page.evaluate(() => {
    const scroller = document.scrollingElement ?? document.documentElement;
    const lastCard = document.querySelectorAll("main article");
    const footer = document.querySelector("footer");
    return {
      scrollHeight: scroller.scrollHeight,
      clientHeight: scroller.clientHeight,
      overflowY: getComputedStyle(document.body).overflowY,
      cardCount: lastCard.length,
      footerTop: footer ? footer.getBoundingClientRect().top + window.scrollY : null,
    };
  });

  expect(geometry.cardCount, "усі 10 карток мають бути в документі").toBe(10);
  expect(
    geometry.overflowY,
    "body не має блокувати вертикальний скрол на звичайних сторінках",
  ).not.toBe("hidden");
  expect(
    geometry.scrollHeight,
    "контент має бути вищим за viewport, інакше скрол не потрібен",
  ).toBeGreaterThan(geometry.clientHeight);

  // Real scroll travel, not just scrollability flags.
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await expect
    .poll(() => page.evaluate(() => window.scrollY))
    .toBeGreaterThan(100);

  const footerVisible = await page.locator("footer").isVisible();
  expect(footerVisible, "футер має бути видимим після прокрутки").toBe(true);
});

test("головна лишається fullscreen iframe після зміни layout overflow", async ({ page }) => {
  await page.goto("/");

  const home = await page.evaluate(() => {
    const frame = document.querySelector("iframe");
    const rect = frame?.getBoundingClientRect();
    return {
      hasFrame: Boolean(frame),
      frameWidth: rect?.width ?? 0,
      frameHeight: rect?.height ?? 0,
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight,
    };
  });

  expect(home.hasFrame, "головна має лишатись iframe-обгорткою").toBe(true);
  expect(home.frameWidth).toBeGreaterThanOrEqual(home.viewportWidth - 1);
  expect(home.frameHeight).toBeGreaterThanOrEqual(home.viewportHeight - 1);
});

// AGENTS.md, «Правило збалансованого переносу елементів»: у групі з 10 карток
// заборонено будь-яку схему з висячим одним елементом у рядку (3+3+3+1, 2+2+2+2+1…).
// Дозволено або 1+1+1…, або кожен рядок має щонайменше два елементи.
const balancedViewports = [
  { width: 390, height: 844 },
  { width: 768, height: 1024 },
  { width: 1024, height: 768 },
  { width: 1440, height: 900 },
  { width: 2560, height: 1080 },
];

for (const viewport of balancedViewports) {
  test(`сітка послуг не має висячого рядка на ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto("/services/");
    // Завершуємо вступні анімації: getBoundingClientRect() включає transform,
    // тому під час staggered-анимації сусідні картки одного рядка давали б різні
    // координати. offsetTop — це layout-позиція, яку transform не чіпає.
    await page.evaluate(async () => {
      await Promise.allSettled(
        document.getAnimations().map((animation) => animation.finished),
      );
      window.scrollTo(0, document.body.scrollHeight);
    });

    const rows = await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll("main article"));
      const tops = cards.map((card) => Math.round(card.offsetTop));
      const counts = new Map<number, number>();
      for (const top of tops) {
        counts.set(top, (counts.get(top) ?? 0) + 1);
      }
      return Array.from(counts.values()).sort((a, b) => a - b);
    });

    expect(rows.reduce((sum, count) => sum + count, 0), "усі 10 карток мають бути розміщені").toBe(10);
    const orphanRows = rows.filter((count) => count === 1);
    expect(
      orphanRows,
      `розподіл по рядках: ${rows.join("+")} — не можна залишати рядок з однією карткою`,
    ).toEqual([]);
  });
}
