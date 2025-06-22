import { test, expect } from '@playwright/test';

test.describe('Работа с базовыми чекбоксами', () => {
test.beforeEach(async ({ page }) => {
    await page.goto('https://osstep.github.io/action_check');
});

test('Изменение состояния чекбокса', async ({ page }) => {
    const checkbox = page.getByLabel('Подписаться на рассылку');
    const status = page.locator('[id="newsletter-status"]');
    
    await expect(checkbox).not.toBeChecked();

    await checkbox.check();

    await expect(status).toHaveText('Подписаны');

    await checkbox.uncheck();

    await expect(status).toHaveText('Не подписаны');

    page.close()

});

test('Работа с обязательным чекбоксом', async ({ page }) => {
    const checkbox = page.getByLabel('Я принимаю условия соглашения');

    await expect(checkbox).toHaveAttribute('required');

    await checkbox.check();

    await expect(checkbox).toBeChecked();

    page.close()

});

test('Работа с кастомным чекбоксом после скролла', async ({ page }) => {
    const checkbox = page.getByLabel('Я прочитал и согласен с условиями');

    await checkbox.scrollIntoViewIfNeeded();

    await checkbox.check();

    await expect(checkbox).toBeChecked();

    page.close()

});

});