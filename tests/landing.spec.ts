import { expect, test, type Page } from '@playwright/test';

const VIEWPORTS = [
  { width: 1440, height: 900 },
  { width: 1024, height: 768 },
  { width: 768, height: 1024 },
  { width: 390, height: 844 },
];

/** Scrolls the whole page in viewport steps so lazy media and reveals are triggered. */
async function scrollThrough(page: Page) {
  const total = await page.evaluate(() => document.documentElement.scrollHeight);
  const step = page.viewportSize()!.height;
  for (let y = 0; y < total; y += step / 2) {
    await page.mouse.wheel(0, step / 2);
    await page.waitForTimeout(120);
  }
  await page.waitForTimeout(800);
}

for (const vp of VIEWPORTS) {
  test.describe(`${vp.width}px`, () => {
    test.use({ viewport: vp });

    test('loads without console errors, page errors or failed requests', async ({ page }) => {
      const problems: string[] = [];
      page.on('console', (m) => m.type() === 'error' && problems.push(`console: ${m.text()}`));
      page.on('pageerror', (e) => problems.push(`pageerror: ${e.message}`));
      page.on('requestfailed', (r) => problems.push(`requestfailed: ${r.url()}`));
      page.on('response', (r) => r.status() >= 400 && problems.push(`HTTP ${r.status()}: ${r.url()}`));
      await page.goto('/');
      await scrollThrough(page);
      expect(problems).toEqual([]);
    });

    test('has no horizontal page overflow', async ({ page }) => {
      await page.goto('/');
      await scrollThrough(page);
      const { scrollWidth, innerWidth } = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        innerWidth: window.innerWidth,
      }));
      expect(scrollWidth).toBeLessThanOrEqual(innerWidth);
    });

    test('every image loads', async ({ page }) => {
      await page.goto('/');
      await scrollThrough(page);
      // Services track is horizontally scrolled; swipe through it so each lazy card enters the viewport.
      const track = page.locator('#services ul');
      await track.scrollIntoViewIfNeeded();
      for (let i = 0; i < 16; i++) {
        await track.evaluate((el) => el.scrollBy({ left: el.clientWidth * 0.8 }));
        await page.waitForTimeout(250);
      }
      // Only rendered images: lazy images inside hidden slides/menus are legitimately not fetched yet.
      const broken = await page.evaluate(async () => {
        const rendered = Array.from(document.images).filter((i) => i.checkVisibility({ visibilityProperty: true, opacityProperty: false }));
        const settle = (i: HTMLImageElement) =>
          i.complete ? null : Promise.race([i.decode().catch(() => null), new Promise((r) => setTimeout(r, 4000))]);
        await Promise.all(rendered.map(settle));
        return rendered.filter((i) => !i.complete || i.naturalWidth === 0).map((i) => i.currentSrc || i.src);
      });
      expect(broken).toEqual([]);
    });
  });
}

test.describe('interactions (desktop)', () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test('section landmarks and headings are present in order', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
    const ids = await page.locator('main > section').evaluateAll((els) => els.map((e) => e.id || e.getAttribute('aria-label') || e.getAttribute('aria-labelledby')));
    expect(ids).toEqual(['hero-title', 'work', 'research', 'Latest research', 'services', 'testimonials-title', 'contact']);
    await expect(page.locator('footer#footer')).toBeVisible();
  });

  test('skip link is reachable by keyboard and moves focus to main', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Tab');
    const skip = page.getByRole('link', { name: 'Skip to content' });
    await expect(skip).toBeFocused();
    await expect(skip).toBeInViewport();
    await page.keyboard.press('Enter');
    await expect(page.locator('#main')).toBeFocused();
  });

  test('menu opens from the keyboard, traps focus, closes on Escape and restores focus', async ({ page }) => {
    await page.goto('/');
    const trigger = page.getByRole('button', { name: 'Open menu' });
    await trigger.focus();
    await page.keyboard.press('Enter');
    const dialog = page.getByRole('dialog', { name: 'Site menu' });
    await expect(dialog).toBeVisible();
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await expect(page.getByRole('button', { name: 'Close menu' })).toBeFocused();
    // Shift+Tab from the first element wraps to the last one inside the dialog.
    await page.keyboard.press('Shift+Tab');
    expect(await page.evaluate(() => !!document.activeElement?.closest('#site-menu'))).toBe(true);
    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
    await expect(trigger).toBeFocused();
  });

  test('theme toggle switches to dark and persists across reloads', async ({ page }) => {
    await page.goto('/');
    const toggle = page.getByRole('button', { name: 'Toggle dark mode' });
    await toggle.click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await expect(toggle).toHaveAttribute('aria-pressed', 'true');
    // Reference dark theme: background #06110e, text #f5f2f1 (after the 0.3s colour transition).
    await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(6, 17, 14)');
    await expect(page.locator('body')).toHaveCSS('color', 'rgb(245, 242, 241)');
    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  });

  test('nav gains its scrolled pill state', async ({ page }) => {
    await page.goto('/');
    const menuBtn = page.getByRole('button', { name: 'Open menu' });
    await expect(menuBtn).not.toHaveClass(/nav-pill/);
    await page.mouse.wheel(0, 600);
    await page.waitForTimeout(800);
    await expect(menuBtn).toHaveClass(/nav-pill/);
  });

  test('testimonial arrows page through slides and disable at the ends', async ({ page }) => {
    await page.goto('/');
    const section = page.locator('section[aria-roledescription="carousel"]');
    await section.scrollIntoViewIfNeeded();
    const prev = page.getByRole('button', { name: 'Previous testimonial' });
    const next = page.getByRole('button', { name: 'Next testimonial' });
    const total = await section.locator('figure').count();
    await expect(section.getByRole('heading')).toContainText(`[ 1 / ${total} ]`);
    await expect(prev).toBeDisabled();
    await next.click();
    await expect(section.getByRole('heading')).toContainText(`[ 2 / ${total} ]`);
    await expect(prev).toBeEnabled();
    for (let i = 2; i < total; i++) await next.click();
    await expect(next).toBeDisabled();
    await expect(section.locator('figure[aria-hidden="false"]')).toHaveCount(1);
  });

  test('email forms validate locally', async ({ page }) => {
    await page.goto('/');
    const form = page.locator('#hero-title ~ form');
    await form.getByLabel('Email address').fill('not-an-email');
    await form.getByRole('button', { name: 'Get in touch' }).click();
    await expect(form.getByRole('status')).toHaveText(/valid email/);
    await form.getByLabel('Email address').fill('hello@example.com');
    await form.getByRole('button', { name: 'Get in touch' }).click();
    await expect(form.getByRole('status')).toHaveText(/Thanks/);
  });

  test('custom cursor follows the pointer on fine pointers', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('html')).toHaveClass(/has-custom-cursor/);
    await page.mouse.move(400, 300);
    const cursor = page.locator('div[aria-hidden].fixed.top-0.left-0.z-\\[200\\]');
    await expect(cursor).toHaveCSS('opacity', '1');
    const transform = await cursor.evaluate((el) => (el as HTMLElement).style.transform);
    expect(transform).toContain('400px');
  });

  test('text reveals play when sections scroll into view', async ({ page }) => {
    await page.goto('/');
    await page.waitForFunction(() => document.documentElement.classList.contains('js-reveal'));
    const heading = page.locator('#services-title');
    const line = heading.locator('.reveal-line').first();
    await expect(line).toBeAttached();
    await heading.scrollIntoViewIfNeeded();
    await expect
      .poll(async () => line.evaluate((el) => new DOMMatrix(getComputedStyle(el).transform).m42), { timeout: 5000 })
      .toBeCloseTo(0, 0);
  });

  test('visible focus ring on interactive elements', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Tab'); // skip link
    await page.keyboard.press('Tab'); // logo
    const outline = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement;
      return getComputedStyle(el).outlineStyle + ' ' + getComputedStyle(el).outlineWidth;
    });
    expect(outline).toMatch(/solid 2px/);
  });
});

test.describe('reduced motion', () => {
  test.use({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });

  test('disables smooth scroll, reveals and the custom cursor; content stays visible', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(1500);
    await expect(page.locator('html')).not.toHaveClass(/lenis/);
    await expect(page.locator('html')).not.toHaveClass(/has-custom-cursor/);
    await expect(page.locator('html')).not.toHaveClass(/js-reveal/);
    await expect(page.locator('#services-title')).toBeVisible();
    expect(await page.locator('.reveal-line').count()).toBe(0);
  });
});

test.describe('mobile menu', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('opens full-screen with primary links and closes', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Open menu' }).click();
    const dialog = page.getByRole('dialog', { name: 'Site menu' });
    await expect(dialog).toBeVisible();
    for (const label of ['Work', 'Research', 'Contact']) {
      await expect(dialog.getByRole('link', { name: label, exact: true })).toBeVisible();
    }
    await dialog.getByRole('button', { name: 'Close menu' }).click();
    await expect(dialog).toBeHidden();
  });
});
