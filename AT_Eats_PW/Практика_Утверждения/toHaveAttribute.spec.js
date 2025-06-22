import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
await page.goto('https://osstep.github.io/assertion_tohaveattribute');
});

test('1. Проверка атрибутов основной кнопки', async ({ page }) => {

    const ButtonSend = page.getByRole('button', {name: 'Отправить'});
    const buttonSwitch = page.getByRole('button', {name: 'Переключить атрибуты'});

    await expect(ButtonSend).toHaveAttribute('data-action', 'submit');
    await expect(ButtonSend).toHaveAttribute('title', 'Основная кнопка');

    await buttonSwitch.click()

    await expect(ButtonSend).toHaveAttribute('data-action', 'cancel');
    await expect(ButtonSend).toHaveAttribute('title', 'Отмена действия');

    page.close()
});

test('2. Проверка отключения кнопки', async ({ page }) => {
    const ButtonSend = page.getByRole('button', {name: 'Отправить'});
    const buttonCancel = page.getByRole('button', {name: 'Отключить кнопку'});

    await expect(ButtonSend).not.toHaveAttribute('disabled');

    await buttonCancel.click()

    await expect(ButtonSend).toHaveAttribute('disabled', '');

    await buttonCancel.click()

    await expect(ButtonSend).not.toHaveAttribute('disabled');

    page.close()
});