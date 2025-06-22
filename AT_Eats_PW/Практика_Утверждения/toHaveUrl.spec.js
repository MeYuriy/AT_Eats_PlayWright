import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
await page.goto('https://osstep.github.io/assertion_tohaveurl');
});

test('1. Проверка изменения URL при навигации', async ({ page }) => {
    const aboutUs = page.locator('[id="about-link"]');
    const contacts = page.locator('[id="contacts-link"]');
    const main = page.locator('[id="home-link"]');

    await aboutUs.click();
    await expect(page).toHaveURL(/#about/);

    await contacts.click();
    await expect(page).toHaveURL(/#contacts/);

    await main.click();
    await expect(page).toHaveURL(/#home/);

    page.close()
});