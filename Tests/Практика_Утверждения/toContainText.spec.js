import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
await page.goto('https://osstep.github.io/assertion_tocontaintext');
});

test('1. Проверка статического текста', async ({ page }) => {
    const staticTxt = page.locator('[id="static-text"]');

    await expect(staticTxt).toContainText('static text block');
    await expect(staticTxt).toContainText('important information');
    await expect(staticTxt).not.toContainText('dynamic content');

    page.close();
});

test('2. Проверка динамически изменяемого текста', async ({ page }) => {
    const dynamicTxt = page.locator('[id="dynamic-text"]');
    const buttonTxt = page.getByRole('button', {name: 'Change Text'});
    const buttonAdd = page.getByRole('button', {name: 'Add Part'});

    await expect(dynamicTxt).toContainText('Initial dynamic text');

    await buttonTxt.click();

    await expect(dynamicTxt).toContainText('Text was changed at');

    await buttonAdd.click()

    await expect(dynamicTxt).toContainText('(additional part)');

    page.close();

});