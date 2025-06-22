import { test, expect } from '@playwright/test';

test.describe('Базовые тесты для getByLabel()', () => {
    test.beforeEach(async ({ page }) => {
    await page.goto('https://osstep.github.io/locator_getbylabel');
    });

    test('Найти текстовое поле по label', async ({ page }) => {
        const username = page.getByLabel('Имя пользователя');
        await username.fill('yurok');
        await expect(username).toHaveValue('yurok'); // проверка, что поле содержит введенное значение

        page.close();
    });

    test('Найти email поле по label', async ({ page }) => {
        const email = page.getByLabel('Электронная почта');
        await expect(email).toHaveAttribute('placeholder','example@mail.com'); // проверка, что атрибут (placeholder), содержит определеннуб заглушку (example@mail.com)

        page.close()
    });
});

test.describe('Тесты для чекбоксов и радиокнопок', () => {
    test.beforeEach(async ({ page }) => {
    await page.goto('https://osstep.github.io/locator_getbylabel');
    });

    test('Работа с чекбоксами', async ({ page }) => {
        const checkMusic = page.getByLabel('Музыка');
        await expect(checkMusic).toBeChecked();

        page.close()
    });

    test('Радиобаттоны', async ({ page }) => {
        const radioFemale = page.getByLabel('Женский');
        const radioMale = page.getByLabel('Мужской');

        await expect(radioFemale).toBeChecked();
        await expect(radioMale).not.toBeChecked();

        page.close()
    });

});