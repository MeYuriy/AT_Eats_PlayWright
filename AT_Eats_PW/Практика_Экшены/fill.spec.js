import { test, expect } from '@playwright/test';

test.describe('Заполнение базовых полей формы', () => {
test.beforeEach(async ({ page }) => {
    await page.goto('https://osstep.github.io/action_fill');
});

test('Заполнение текстового поля', async ({ page }) => {
    const name = page.getByPlaceholder('Введите ваше имя');

    await name.fill('Юрок');

    await expect(name).toHaveValue('Юрок');

    page.close()
});

test('Заполнение email с валидацией', async ({ page }) => {
    const email = page.getByPlaceholder('example@mail.com');
    const alert = page.locator('[id="email-feedback"]');

    await expect(alert).toBeHidden();

    await email.fill('yurok');
    await email.blur(); // метод blur позволяет снять фокус с элемента. В данном случае с поля ввода, чтобы отобразился алерт

    await expect(alert).toBeVisible();
    await expect(alert).toContainText('Введите корректный email')
    
    await email.clear()
    await email.fill('yurok@ya.ru');
    await email.blur();

    await expect(alert).toBeHidden();

    page.close();
});

});
