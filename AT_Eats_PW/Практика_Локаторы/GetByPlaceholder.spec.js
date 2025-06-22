import { test, expect } from '@playwright/test';

test.describe('Базовые тесты для getByPlaceholder()', () => {
test.beforeEach(async ({ page }) => {
    await page.goto('https://osstep.github.io/locator_getplaceholder');
});

test('Найти и заполнить поле по placeholder', async ({ page }) => {
    const name = page.getByPlaceholder('Введите ваше имя');

    await name.fill('Юрец Огурец');
    await expect(name).toHaveValue('Юрец Огурец');

    page.close()
});

test('Найти поле по части placeholder', async ({ page }) => {
    const email = page.getByPlaceholder('example').nth(0);

    await expect(email).toHaveAttribute('type', 'email');

    page.close()
});

});