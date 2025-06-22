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

  test('[Desktop] Переход в Мои Адреса', async ({ page, context }) => { // по мотивам тк https://tms.yandex-team.ru/projects/yandex_eats/testcases/53135
    // 1. Загружаем куки
    const fs = require('fs');
    const cookies = JSON.parse(fs.readFileSync('D:/PlayWright/Cookie/cookiesauth.json'));
    await context.addCookies(cookies);
  
    const logoUser = page.getByTestId('avatar');
    const myAdresses = page.getByRole('button', {name: 'Мои адреса'});
  
    await logoUser.click();
    await myAdresses.click();
  
    await expect(page.locator('[class="DesktopAddressModal_header_hwjtx1x"]')).toHaveText('Адреса');
  
    page.close()
  
  });
  
  test('[Desktop] [Главная] Выбор адреса через поиск в модальном окне с картой', async ({ page, context }) => { // по мотивам тк https://tms.yandex-team.ru/projects/yandex_eats/testcases/52704
    const fs = require('fs');
    const cookies = JSON.parse(fs.readFileSync('D:/PlayWright/Cookie/cookiesauth.json'));
    await context.addCookies(cookies);
  
    await page.getByRole('button', { name: 'Укажите адрес доставки' }).click()
    await page.getByTestId('address-input').fill('Ленинский проспект 37а');
    await page.getByLabel('Ленинский проспект, 37АМосква').click();
    await page.getByTestId('desktop-location-modal-confirm-button').click();
  
    await expect(page.getByRole('button', { name: 'Бду адреса' })).toHaveText('Бду адреса');
  
    page.close()
  });
  
  test('[Desktop] Закрытие расширенной карточки товара по крестику', async ({ page, context }) => { // по мотивам тк https://tms.yandex-team.ru/projects/yandex_eats/testcases/52840
    const fs = require('fs');
    const cookies = JSON.parse(fs.readFileSync('D:/PlayWright/Cookie/cookiesauth.json'));
    await context.addCookies(cookies); // подгрузка куков в этом тесте необязательна, но пусть будет
  
    await page.route('**/eats/v1/full-text-search/v1/search', async (route) => { // мокаю ручку глобального поиска, т.к. выдача там рандомна и может не быть указанного товара 
        const mockData = JSON.parse(fs.readFileSync('D:/PlayWright/mocks/FullTextSearch.json'));
        await route.fulfill({
          json: mockData,
        });
      });
  
    await page.getByRole('button', { name: 'Укажите адрес доставки' }).click() // перестал подтягиваться адрес через куки, поэтому указываю его вручкую 
    await page.getByTestId('address-input').fill('Ленинский проспект 37а');
    await page.getByLabel('Ленинский проспект, 37АМосква').click();
    await page.getByTestId('desktop-location-modal-confirm-button').click();
  
    await page.getByPlaceholder('Найти ресторан, блюдо или товар').fill('Вода'); // ввода запроса 
    await page.getByRole('button', {name:'Найти'}).click();
  
    await page.getByRole('button', { name: 'Вода минеральная природная питьевая столовая Vita Архыз газированная пэт 1,5' }).click(); //клик по карточке товара
  
    await expect(page.getByTestId('full-card-page')).toBeVisible(); //проверка открытия расширенной карточки товара
  
    await page.getByTestId('ui-button').click(); // закрытие расширенной карточки товара
  
    await expect(page.getByTestId('full-card-page')).not.toBeVisible(); //проверка, что карточка закрыта
  
    page.close()
  });

});