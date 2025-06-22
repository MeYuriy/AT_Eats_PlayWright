import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
await page.goto('https://osstep.github.io/assertion_tohavetext');
});

test('1. Проверка точного соответствия текста', async ({ page }) => {
    const txt = page.locator('[id="exact-text"]');

    await expect(txt).toHaveText('This text must match exactly, including punctuation! (100%)');

    page.close();
});

test('2. Проверка работы счетчика', async ({ page }) => {
    const counter = page.locator('[id="counter"]');
    const buttonInc = page.getByRole('button', {name: 'Increment'});
    const buttonReset = page.getByRole('button', {name: 'Reset'});

    await expect(counter).toHaveText('0');

    await buttonInc.click();

    await expect(counter).toHaveText('1');

    await buttonReset.click();

    await expect(counter).toHaveText('0')

    page.close()
});
