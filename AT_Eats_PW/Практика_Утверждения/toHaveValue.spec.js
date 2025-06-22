import { test, expect } from '@playwright/test';
import { ADDRGETNETWORKPARAMS } from 'dns';

test.beforeEach(async ({ page }) => {
await page.goto('https://osstep.github.io/assertion_tohavevalue');
});

test('1. Проверка начальных значений полей', async ({ page }) => {
    const userName = page.getByLabel('Имя пользователя:');
    const email = page.getByLabel('Электронная почта:');
    const phone = page.getByLabel('Телефон:');
    const comment = page.getByLabel('Комментарии:');
    const country = page.getByLabel('Страна:');

    await expect(userName).toHaveValue('Гость');
    await expect(email).toHaveValue('');
    await expect(phone).toHaveValue('+7');
    await expect(comment).toHaveValue('');
    await expect(country).toHaveValue('ru')

    page.close()
});

test('2. Проверка изменения значений полей', async ({ page }) => {
    const userName = page.getByLabel('Имя пользователя:');
    const email = page.getByLabel('Электронная почта:');
    const phone = page.getByLabel('Телефон:');
    const comment = page.getByLabel('Комментарии:');
    const country = page.getByLabel('Страна:');

    await userName.clear();
    await userName.fill('Юрок');
    await email.fill('yurok@test.com');
    await phone.clear()
    await phone.fill('+79999999999');
    await comment.fill('test 123');
    await country.selectOption('kz');

    await expect(userName).toHaveValue('Юрок');
    await expect(email).toHaveValue('yurok@test.com');
    await expect(phone).toHaveValue('+79999999999');
    await expect(comment).toHaveValue('test 123');
    await expect(country).toHaveValue('kz');

    page.close()
});