// функции. Перед каждой функцией пишем export. Пример: export function one (){}
// так же не забываем в этот файл импортировать переменные, которые используем в функциях. Пример: import{btn, container} from './vars.js'


// модальное окно при необходимости авторизации
import { btnCloseRedirectionModal, getAuthorized, redirectionModal } from './vars.js';

export function showAlertNeedRegistration() {
    const isUserAuthenticated = window.localStorage.getItem('client'); // Получили id пользователя из бд
  if (!isUserAuthenticated) {
     redirectionModal.showModal();
      // закрытия модального окна через определенное время
  setTimeout(() => window.redirectionModal.close(), 8000);

btnCloseRedirectionModal.addEventListener("click",function () {
  window.redirectionModal.close();
});
 } 
 getAuthorized.addEventListener("click",function () {
  window.open('/registr.html');
});
}
