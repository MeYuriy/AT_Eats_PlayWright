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

  test('[Desktop] Выбор фильтра в глобальном поиске', async ({ page, context }) => { 
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

});