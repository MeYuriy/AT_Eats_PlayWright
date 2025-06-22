import { test, expect, Locator } from '@playwright/test';

test.describe('Работа с базовыми select элементами', () => {
test.beforeEach(async ({ page }) => {
    await page.goto('https://osstep.github.io/action_selectOptions');
});

test('Выбор страны по значению', async ({ page }) => {
    const select = page.getByLabel('Страна');
    const status = page.locator('[id="country-feedback"]');

    await expect(status).toHaveText('Не выбрано');

    await select.selectOption('ru');

    await expect(status).toContainText('Россия');
    
    page.close();

});
});