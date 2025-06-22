import { test, expect } from '@playwright/test';

test.describe('Тестирование видимости элементов с toBeVisible()', () => {
    test.beforeEach(async ({ page }) => {
    await page.goto('https://osstep.github.io/assertion_tobevisible');
    });

    test('Базовый тест видимости элемента', async ({ page }) => {

    const visibleElement = page.getByText('Всегда видимый элемент');

    await expect(visibleElement).toBeVisible();
    await expect(visibleElement).toHaveText('Всегда видимый элемент');

    page.close()
    });

});