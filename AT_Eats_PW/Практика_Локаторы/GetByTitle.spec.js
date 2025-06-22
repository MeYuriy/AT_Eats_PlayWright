import { test, expect } from '@playwright/test';

test.describe('Базовые тесты для getByTitle()', () => {
test.beforeEach(async ({ page }) => {
    await page.goto('https://osstep.github.io/locator_getbytitle');
});

test('Найти элемент по точному title', async ({ page }) => {
    const title = page.getByTitle('Это простая подсказка');

    await expect(title).toHaveClass('tooltip');
    await expect(title).toHaveText('Наведи на меня');

    page.close();

});
test('Найти кнопку по title', async ({ page }) => {
    const button = page.getByTitle('Кнопка с подсказкой');

    await expect(button).toHaveText('Нажми меня');

    page.close()

});

test('Найти ссылку по title', async ({ page }) => {
    const link = page.getByTitle('Перейти на главную страницу');

    await expect(link).toHaveClass('link-with-title');
    await expect(link).toHaveText('Главная');

    page.close()

});

test('Динамически загружаемый элемент', async ({ page }) => {
    const newElement = page.getByTitle('Кнопка добавленная динамически');

    await expect(newElement).toBeVisible({timeout: 10000});
    await expect(newElement).toHaveText('Новая кнопка');

    page.close()

});

test('Поиск изображения', async ({ page }) => {
    const img = page.getByTitle('Изображение с подсказкой');

    await expect(img).toHaveCSS('line-height', '25.6px');  // проверка соответствия размера изображения заданному значению

    page.close()

});

});