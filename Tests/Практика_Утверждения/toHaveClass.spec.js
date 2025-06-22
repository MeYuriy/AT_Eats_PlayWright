import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
await page.goto('https://osstep.github.io/assertion_tohaveclass');
});

test('1. Проверка начальных классов элементов', async ({ page }) => {
    const box_1 = page.locator('[id="box1"]');
    const box_2 = page.locator('[id="box2"]');
    const box_3 = page.locator('[id="box3"]');

    await expect(box_1).toHaveClass(/active/);
    await expect(box_1).not.toHaveClass(/error/);
    await expect(box_2).toHaveClass(/error/);
    await expect(box_3).toHaveClass(/hidden/);

    page.close()
});

