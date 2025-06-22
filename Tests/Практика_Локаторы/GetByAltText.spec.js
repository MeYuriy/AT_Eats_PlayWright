import { test, expect } from '@playwright/test';

test.describe('Базовые тесты для getByAltText()', () => {
test.beforeEach(async ({ page }) => {
    await page.goto('https://osstep.github.io/locator_getbyalttext');
});

test('Найти изображение по точному alt-тексту', async ({ page }) => {

    const altimg = page.getByAltText("Красивый пейзаж с горами и озером");

    await expect(altimg).toBeVisible();

    page.close()

});

test('Найти логотип компании', async ({ page }) => {
    const logo = page.getByAltText('Логотип компании ТехноКорп');

    await expect(logo).toBeVisible();
    await expect(logo).toHaveAttribute('width', '150');

    page.close()

});

test('Найти динамически загруженное изображение', async ({ page }) => {
    const dynamicLogo = page.getByAltText('Динамически загруженное изображение');

    await expect(dynamicLogo).toBeVisible({timeout: 15000}) // увеличиваем время ожидания 

    page.close()

});

});