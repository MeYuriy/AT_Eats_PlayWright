import { test, expect } from '@playwright/test';
import { defineConfig, devices } from '@playwright/test';
import { log } from 'console';

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

test.describe('Итоговый проект', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://testing.eda.tst.yandex.ru/moscow?shippingType=delivery');
  });
  test.use({ viewport: { width: 1820, height: 1000 } });
  test.use({
    locale: 'ru-RU',
  });
  test.use({permissions: []}) // блокировка уведомлений/запросов от браузера, к примеру, доступ к гео

test('[Desktop] Сброс фильтров при клике на лого в шапке - 53200', async ({ page }) => { // по мотивам тк https://tms.yandex-team.ru/projects/yandex_eats/testcases/53200
    const Pickup = page.getByText('Самовывоз');
    const header = page.getByRole('link', { name: 'Логотип Яндекс Еды' })

    await expect(Pickup).toHaveAttribute('aria-selected', 'false');
    await Pickup.click();
    await expect(Pickup).toHaveAttribute('aria-selected', 'true');

    await header.click();
    await expect(Pickup).toHaveAttribute('aria-selected', 'false');
    
    page.close()
  
  });

  // практика использования моков 
test('[Desktop] Пустой ответ каталога - 53131', async ({ page }) => { // по мотивам тк https://tms.yandex-team.ru/projects/yandex_eats/testcases/53131
    // 1. Мокируем тело ответа сервера нужной ручки файлом json с пк
    const fs = require('fs');
    await page.route('**/eats/v1/layout-constructor/v1/layout', async (route) => {
      const mockData = JSON.parse(fs.readFileSync('D:/PlayWright/mocks/EmptyLayout.json'));
      await route.fulfill({
        json: mockData,
      });
    });
    const text = page.getByText('Нас тут ещё нет :(');
    const btn = page.getByRole("button", {name: 'Сообщить мне'});
    // 2. Убеждаемся, что мок встал путем проверки текста в пустом лейауте
    await expect(text).toContainText('Нас тут ещё нет :('); // глупая проверка -__-
    await expect(btn).toHaveText('Сообщить мне');

    page.close();
  });

  // практика подгрузки куков 
test('Проверка, что пользователь авторизован (авторизация через подгрузку куки)', async ({ page, context }) => {
  // 1. Загружаем куки
  const fs = require('fs');
  const cookies = JSON.parse(fs.readFileSync('D:/PlayWright/Cookie/cookiesauth.json'));
  await context.addCookies(cookies);

  // 2. Проверка авторизациир
  const profileIcon = page.locator('[aria-label="Профиль"]');
  const profileName = page.locator('[class="njj7xdl"]');

  await profileIcon.click();
  await expect(profileName).toContainText('Юрок');

  page.close()
});

test('[Desktop] Выбор языка 55470', async ({ page, context }) => { //по мотиван тк https://tms.yandex-team.ru/projects/yandex_eats/testcases/55470
  // 1. Загружаем куки
  const fs = require('fs');
  const cookies = JSON.parse(fs.readFileSync('D:/PlayWright/Cookie/cookiesauth.json'));
  await context.addCookies(cookies);

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

test('[Desktop] Выбор фильтра в глобальном поиске', async ({ page, context }) => { 
  const fs = require('fs');
  const cookies = JSON.parse(fs.readFileSync('D:/PlayWright/Cookie/cookiesauth.json'));
  await context.addCookies(cookies);

  const buttonRestaraunt = page.getByRole('button', {name: 'Рестораны'})

  await page.getByRole('button', { name: 'Укажите адрес доставки' }).click()
  await page.getByTestId('address-input').fill('Ленинский проспект 37а');
  await page.getByLabel('Ленинский проспект, 37АМосква').click();
  await page.getByTestId('desktop-location-modal-confirm-button').click();

  await page.getByPlaceholder('Найти ресторан, блюдо или товар').fill('Вода'); // ввода запроса 
  await page.getByRole('button', {name:'Найти'}).click();

  await expect(buttonRestaraunt).toHaveAttribute('aria-current', 'false');

  await buttonRestaraunt.click();

  await expect(buttonRestaraunt).toHaveAttribute('aria-current', 'true');

  page.close()
});

test('[Desktop] [Главная] Удаление адреса из строки в модальном окне выбора адреса', async ({ page, context }) => { // по мотивам тк https://tms.yandex-team.ru/projects/yandex_eats/testcases/52706
  const fs = require('fs');
  const cookies = JSON.parse(fs.readFileSync('D:/PlayWright/Cookie/cookiesauth.json'));
  await context.addCookies(cookies);

  await page.getByRole('button', { name: 'Укажите адрес доставки' }).click(); // вводим адрес
  await page.getByTestId('address-input').fill('Ленинский проспект 37а');
  await page.getByLabel('Ленинский проспект, 37АМосква').click();
  await page.getByTestId('desktop-location-modal-confirm-button').click();

  await page.getByRole('button', { name: 'Бду адреса' }).click(); // открываем окно выбора адреса и сбрасываем выбранный адрес
  await page.getByRole('button', { name: 'Куда доставить?' }).click();

  await expect(page.getByTestId('address-input')).toHaveAttribute('value', 'Ленинский проспект, 37А'); // убеждаемся, что поле ввода адреса не пустое
  
  await page.getByTestId('address-input-reset').click(); // сбрасываем заполненный адрес

  await page.getByTestId('address-input').toHaveAttribute('value', ''); //убеждаемся, что поле ввода адреса пустое

  page.close()
});

test('[Desktop] [Поиск] Очистка инпута поиска с помощью крестика', async ({ page, context }) => { // по мотивам тк https://tms.yandex-team.ru/projects/yandex_eats/testcases/52430

  const searchBar = page.locator('[id="id_1"]');
  const buttonClear = page.getByTestId('input-clear-button');

  await expect(searchBar).toHaveAttribute('value', '');

  await searchBar.fill('сыр');

  await expect(searchBar).toHaveAttribute('value', 'сыр');

  await buttonClear.click()

  await expect(searchBar).toHaveAttribute('value', '');

  page.close()
});

test('[Desktop] Дерево тематик. Главная', async ({ page, context }) => { // по мотивам тк https://tms.yandex-team.ru/projects/yandex_eats/testcases/50032
const supportButton = page.getByTitle('Служба поддержки');
const title = page.getByText('Чем вам помочь?');
const promocodes = page.getByText('Оплата и промокоды');
const cooperation = page.getByText('Сотрудничество');

await supportButton.click();

await expect(title).toContainText('Чем вам помочь?');
await expect(promocodes).toContainText('Оплата и промокоды');
await expect(cooperation).toContainText('Сотрудничество');

page.close()
});

}); // test123321