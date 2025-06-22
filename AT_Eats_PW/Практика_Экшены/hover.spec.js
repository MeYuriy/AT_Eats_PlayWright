import { test, expect } from '@playwright/test';

test.describe('Базовые hover-эффекты', () => {
test.beforeEach(async ({ page }) => {
    await page.goto('https://osstep.github.io/action_hover');
});

test('Hover события логируются', async ({ page }) => {
    const hoverElement = page.locator('[id="simple-hover"]');
    const logHover = page.locator('[id="hover-state"]');

    await expect(logHover).toContainText('не наведено');

    await hoverElement.hover();

    await expect(logHover).toContainText('наведено');

    await page.mouse.move(0, 0); // убираем курсор с элемента, чтобы проверить, что логирования перейдет в статус "Не наведено"

    await expect(logHover).toContainText('не наведено');

    page.close()

});

test('Подсказка появляется при hover', async ({ page }) => {
    const elementText = page.getByText('Наведи чтобы увидеть подсказку');
    const tooltip = page.getByText('Это текст подсказки');

    await expect(tooltip).toBeHidden();

    await elementText.hover();

    await expect(tooltip).toBeVisible();
    await expect(tooltip).toHaveText('Это текст подсказки');

    await page.mouse.move(0, 0);

    await expect(tooltip).toBeHidden();

    page.close()

});

});