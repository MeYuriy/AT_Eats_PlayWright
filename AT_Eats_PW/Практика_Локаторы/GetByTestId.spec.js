import { test, expect } from '@playwright/test';

test.describe('Базовые тесты для getByTestId()', () => {
test.beforeEach(async ({ page }) => {
    await page.goto('https://osstep.github.io/locator_getbytestid');
});

test('Найти заголовок страницы', async ({ page }) => {
    const header = page.getByTestId('page-header');

    await expect(header).toContainText('Практика локатора getByTestId()');

    page.close()
});

test('Найти все кнопки добавления в корзину', async ({ page }) => {
    const cartButton = page.getByTestId('add-to-cart-btn');

    await expect(cartButton).toHaveCount(2);
    await expect(cartButton.nth(0)).toHaveText('В корзину');

    page.close();
});

test('Заполнение формы заказа', async ({ page }) => {
    const name = page.getByTestId('name-input');
    const email = page.getByTestId('email-input');
    const button = page.getByTestId('submit-order-btn');

    await name.fill('Yurok');
    await email.fill('yurok@mail.ru');

    await expect(name).toHaveValue('Yurok');
    await expect(email).toHaveValue('yurok@mail.ru');

    await button.click();
    
    page.close();
});


});