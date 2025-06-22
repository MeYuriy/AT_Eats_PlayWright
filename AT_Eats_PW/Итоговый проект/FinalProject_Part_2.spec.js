import { test, expect } from '@playwright/test';
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({ 
  use: {
    // Эмулирует локаль пользователя. По дефолту тестовая Еда открывается на английской локали
    locale: 'ru-RU',
    permissions: [],
  },
  expect: {
    // Максимальное время, которое expect() должен ждать, чтобы условие было выполнено. Тестовая Еда иногда загружается дольше дефолтных 5 секунд, из-за чего тесты падают
    timeout: 50000
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        // Важно определить свойство `viewport` после деструктуризации `devices`,
        // так как устройства также определяют `viewport` для этого устройства.
        viewport: { width: 1280, height: 720 },
      },
    },
  ]
});

test.describe('Итоговый проект_часть_1', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://testing.eda.tst.yandex.ru/moscow?shippingType=delivery');
  });
  test.use({ viewport: { width: 1820, height: 1000 } });
  test.use({
    locale: 'ru-RU',
  });
  test.use({permissions: []}) // блокировка уведомлений/запросов от браузера, к примеру, доступ к гео

  test('[Desktop] Выбор языка 55470', async ({ page, context }) => { //по мотиван тк https://tms.yandex-team.ru/projects/yandex_eats/testcases/55470
    const buttonLanguage = page.locator('[class="LanguageButton_name_ny358sc"]');
    const selectLanguage = page.getByText('English');
  
    await expect(buttonLanguage).toHaveText('Русский');
  
    await buttonLanguage.click();
    await selectLanguage.click();
  
    await expect(buttonLanguage).toHaveText('English');
  
    page.close()
  });
  
  test('[Desktop] отображение баллов Плюса', async ({ page, context }) => {
    // 1. Загружаем куки
    const fs = require('fs');
    const cookies = JSON.parse(fs.readFileSync('D:/PlayWright/Cookie/cookiesauth.json'));
    await context.addCookies(cookies);
  
    const logoUser = page.getByTestId('avatar');
    const PlusScore = page.getByTestId('desktop-profile-popup-menu-list-item');
  
    await logoUser.click()
  
    await expect(PlusScore.nth(0)).toContainText('Ваши баллы плюса:');
  
    page.close()
  });
  
  // практика пекреключения фокуса на новую вкладку 
  test('[Desktop] Переход по кнопке Партнерская сеть', async ({ page, context }) => {
    // 1. Загружаем куки
    const fs = require('fs');
    const cookies = JSON.parse(fs.readFileSync('D:/PlayWright/Cookie/cookiesauth.json'));
    await context.addCookies(cookies);
  
    const logoUser = page.getByTestId('avatar');
    const helpNerby = page.getByText('Партнёрская сеть');
  
    await logoUser.click();
    
    await helpNerby.click(); // нажатие на кнопку, которая откроет новую вкладку
    const newPage = await context.waitForEvent('page'); //что-то типа ожидания открытия новой вкладки и переключение фокуса на нее
  
  // Взаимодействуйте с новой вкладкой как обычно.
    await expect(newPage).toHaveURL(/affiliate/);
  
    const pages = await context.pages(); // не придумал ничего лучше, чем закрыть все вкладки через цикл for (метод context.pages возвращает количество открытых вкладок)
  for (const page of pages) {
    await page.close();
  }
  });
  
  test('[Desktop]Переход по кнопке Плюса из меню профиля - пользователь с активной подпиской', async ({ page, context }) => { // по мотивам тк https://tms.yandex-team.ru/projects/yandex_eats/testcases/53136
    // 1. Загружаем куки
    const fs = require('fs');
    const cookies = JSON.parse(fs.readFileSync('D:/PlayWright/Cookie/cookiesauth.json'));
    await context.addCookies(cookies);
  
    const logoUser = page.getByTestId('avatar');
    const PlusScore = page.getByText('Ваши баллы плюса:');
  
    await logoUser.click()
    await PlusScore.click()
    const newPage = await context.waitForEvent('page'); //что-то типа ожидания открытия новой вкладки и переключение фокуса на нее
  
    // Взаимодействуйте с новой вкладкой как обычно.
    await expect(newPage).toHaveURL(/plus/);
  
    const pages = await context.pages(); // не придумал ничего лучше, чем закрыть все вкладки через цикл for (метод context.pages возвращает количество открытых вкладок)
    for (const page of pages) {
      await page.close();
    }
  });

});