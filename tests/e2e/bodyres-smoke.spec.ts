import { expect, test, type Frame, type Page } from '@playwright/test';

async function bodyFrame(page: Page): Promise<Frame> {
  const frame = page.frames().find((candidate) =>
    candidate.url().includes('/sharp-template/Sharp/index.html'),
  );
  if (!frame) {
    throw new Error('Body Restore iframe was not found');
  }
  return frame;
}

async function openMobileMenuIfNeeded(frame: Frame, isMobile: boolean): Promise<void> {
  if (!isMobile) {
    return;
  }

  const nav = frame.locator('#navbarDefault');
  if (await nav.evaluate((element) => element.classList.contains('show'))) {
    return;
  }

  await frame.locator('.navbar-toggler').click();
  await frame.locator('#navbarDefault.show').waitFor();
}

test.describe('Body Restore static site smoke', () => {
  test('navigation and CTA buttons scroll to expected sections without horizontal layout break', async ({ page, isMobile }) => {
    await page.goto('/');
    const frame = await bodyFrame(page);

    await expect(frame.locator('#about')).toBeAttached();
    await expect(frame.locator('#service')).toBeAttached();
    await expect(frame.locator('#review')).toBeAttached();
    await expect(frame.locator('#price')).toBeAttached();
    await expect(frame.locator('#contact')).toBeAttached();

    await openMobileMenuIfNeeded(frame, isMobile);
    await frame.getByRole('link', { name: /контакти/i }).click();
    await expect(frame.locator('#contact')).toBeInViewport();

    await openMobileMenuIfNeeded(frame, isMobile);
    await frame.getByRole('link', { name: 'Послуги', exact: true }).click();
    await expect(frame.locator('#service')).toBeInViewport();

    await frame.getByRole('link', { name: /записатися/i }).first().click();
    await expect(frame.locator('#contact')).toBeInViewport();

    const layout = await frame.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }));
    expect(layout.scrollWidth).toBeLessThanOrEqual(layout.clientWidth + 2);
  });

  test('mobile menu opens without its own scrollbar', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'mobile menu behavior is tested only on mobile viewport');

    await page.goto('/');
    const frame = await bodyFrame(page);
    await frame.locator('.navbar-toggler').click();
    await frame.locator('#navbarDefault.show').waitFor();

    const navState = await frame.locator('#navbarDefault').evaluate((nav) => {
      const styles = window.getComputedStyle(nav);
      return {
        overflowY: styles.overflowY,
        maxHeight: styles.maxHeight,
        hasOwnScrollbar: nav.scrollHeight > nav.clientHeight + 1,
      };
    });

    expect(navState.overflowY).toBe('visible');
    expect(navState.maxHeight).toBe('none');
    expect(navState.hasOwnScrollbar).toBe(false);
  });

  test('contact form posts expected data and shows success state', async ({ page }) => {
    await page.goto('/');
    const frame = await bodyFrame(page);

    let postedBody = '';
    await page.route('**/mail.php', async (route) => {
      postedBody = route.request().postData() ?? '';
      await route.fulfill({
        status: 200,
        contentType: 'text/plain; charset=UTF-8',
        body: 'Тестова заявка прийнята',
      });
    });

    await frame.locator('#contact').scrollIntoViewIfNeeded();
    await frame.locator('#form_name').fill('Тест Body Restore');
    await frame.locator('#form_contact').fill('book@body-re.store');
    await frame.locator('#form_message').fill('Перевірка форми запису');
    await frame.locator('#contact-form').getByRole('button', { name: /надіслати запит/i }).click();

    await expect(frame.locator('.form-message')).toHaveText('Тестова заявка прийнята');
    await expect(frame.locator('.form-message')).toHaveClass(/success/);
    await expect(frame.locator('#form_name')).toHaveValue('');
    await expect(frame.locator('#form_contact')).toHaveValue('');
    await expect(frame.locator('#form_message')).toHaveValue('');
    expect(postedBody).toContain('name=%D0%A2%D0%B5%D1%81%D1%82+Body+Restore');
    expect(postedBody).toContain('contact=book%40body-re.store');
    expect(postedBody).toContain('message=%D0%9F%D0%B5%D1%80%D0%B5%D0%B2%D1%96%D1%80%D0%BA%D0%B0+%D1%84%D0%BE%D1%80%D0%BC%D0%B8+%D0%B7%D0%B0%D0%BF%D0%B8%D1%81%D1%83');
  });

  test('contact and footer action links point to callable destinations', async ({ page }) => {
    await page.goto('/');
    const frame = await bodyFrame(page);

    await expect(frame.locator('a[href="tel:+380968592465"]').first()).toBeVisible();
    await expect(frame.locator('a[href="mailto:book@body-re.store"]').first()).toBeVisible();
    await expect(frame.locator('a[aria-label*="Google Maps"]').first()).toHaveAttribute('href', /google\.com\/maps/);
    await expect(frame.locator('a[aria-label="Instagram"]').first()).toHaveAttribute('href', /instagram\.com\/body_restore_odesa/);
    await expect(frame.locator('a[aria-label="Telegram"]').first()).toHaveAttribute('href', /t\.me/);
  });

  test('service cards reveal descriptions on tap for touch layouts', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'tap behavior is tested only on mobile viewport');

    await page.goto('/');
    const frame = await bodyFrame(page);

    const firstCard = frame.locator('.single-services-item').first();
    const secondCard = frame.locator('.single-services-item').nth(1);

    await firstCard.scrollIntoViewIfNeeded();
    await firstCard.click();
    await expect(firstCard).toHaveClass(/is-touch-open/);
    await expect(firstCard).toHaveAttribute('aria-expanded', 'true');
    await expect(firstCard.locator('.single-services-hover')).toHaveCSS('opacity', '1');

    await secondCard.click();
    await expect(secondCard).toHaveClass(/is-touch-open/);
    await expect(firstCard).not.toHaveClass(/is-touch-open/);
    await expect(firstCard).toHaveAttribute('aria-expanded', 'false');
  });

  test('reviews show only one rating row under the reviewer name', async ({ page }) => {
    await page.goto('/');
    const frame = await bodyFrame(page);

    const reviewState = await frame.locator('#review').evaluate((review) => ({
      topRatingRows: review.querySelectorAll('.testimonial-content .review-stars').length,
      bioRatingRows: review.querySelectorAll('.testimonial-bio .bio-stars').length,
      activeBottomStars: Array.from(review.querySelectorAll('.owl-item.active .testimonial-bio .bio-stars')).map(
        (stars) => stars.querySelectorAll('i.fa-star').length,
      ),
    }));

    expect(reviewState.topRatingRows).toBe(0);
    expect(reviewState.bioRatingRows).toBeGreaterThanOrEqual(5);
    expect(reviewState.activeBottomStars.every((count) => count === 5)).toBe(true);
  });

  test('review section has Google rating CTA', async ({ page }) => {
    await page.goto('/');
    const frame = await bodyFrame(page);

    const reviewCta = frame.locator('#review .review-google-cta');
    await expect(reviewCta.getByText(/були у body restore/i)).toBeVisible();
    await expect(reviewCta.getByRole('link', { name: /оцінити body restore у google/i })).toHaveAttribute(
      'href',
      /google\.com\/maps\/search/,
    );
  });
});
