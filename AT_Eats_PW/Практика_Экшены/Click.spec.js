import { test, expect } from '@playwright/test';

test.describe('Базовые действия с кликами', () => {
test.beforeEach(async ({ page }) => {
    await page.goto('https://osstep.github.io/action_click');
});

test('Обычный клик по кнопке увеличивает счетчик', async ({ page }) => {
    const button = page.getByRole('button', {name: 'Кликни меня'});
    const score = page.locator('[id="click-result"]');

    await expect(score).toContainText('0'); // проверяем, что перед кликом счетким кликов равен 0

    await button.click(); 

    await expect(score).toContainText('1'); // проверяем, что после кнлика счетки стал 1

    page.close()
});

test('Двойной клик увеличивает специальный счетчик', async ({ page }) => {
    const button = page.locator('[id="dblclick-area"]');
    const score = page.locator('[class="click-counter"]');

    await expect(score).toContainText('0');

    await button.dblclick()

    await expect(score).toContainText('1');

    page.close()

});
});