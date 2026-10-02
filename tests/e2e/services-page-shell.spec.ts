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
