import { test, expect } from '@playwright/test';

test.describe('Поиск по частичному совпадению', () => {
    test.beforeEach(async ({ page }) => {
    await page.goto('https://osstep.github.io/locator_getbytext'); // общее предусловие для всех тк, открытие определенной страницы 
    });

    test('Найти по частичному совпадению', async ({ page }) => {
        const txt = page.getByText(/важную информацию/); // поиск по частичному совпадению текста
        await expect(txt).toHaveClass('partial-match');

        page.close()
    });

    test('Найти по части списка', async ({ page }) => {
        const listText =  page.locator('li').getByText(/Специальный/); //сначала ищем тег (список), а внутри него нужный текст, т.к. тегов несколько
        await expect(listText).toBeVisible();
        page.close()
    });
});