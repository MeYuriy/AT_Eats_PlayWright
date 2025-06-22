import { test, expect } from '@playwright/test';

test.describe('Поиск элементов по роли "button"', () => {
test.beforeEach(async ({ page }) => {
    await page.goto('https://osstep.github.io/locator_getbyrole');
});

test('Найти основную кнопку по роли и тексту', async ({ page }) => {
    const button = page.getByRole('button', {name: 'Основное действие'});

    await expect(button).toBeVisible();
    await expect(button).toHaveClass('primary-btn');

    page.close()
});

test('Найти неактивную кнопку по роли и состоянию', async ({ page }) => {
    const disableBtn = page.getByRole("button", {name: 'Неактивная кнопка'});

    await expect(disableBtn).toBeVisible();
    await expect(disableBtn).toBeDisabled();

    page.close();
});

test('Найти поля формы по их ролям', async ({ page }) => {
    const userName = page.getByRole("textbox", {name: 'Имя пользователя'});

    await userName.fill('Yurok');
    await expect(userName).toHaveValue('Yurok');

    page.close()
});


});