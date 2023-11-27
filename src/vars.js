//Здесь переменные. Перед каждой переменной пишем export. Пример: export const=a

//Получаем элементы из html, главная страница

export const upperPosters = document.getElementById('upper-posters');
export const downPosters = document.getElementById('down-posters');
export const div = document.createElement('div');
export const divTwo = document.createElement('div');

// получаем кнопку для вывода цитат и блок куда будем помещать
export const blockTextQuote = document.getElementById('subtext-quote');
export const button = document.getElementById('btn-quote');

//  модальное окно при необходимости авторизации
export const btnCloseRedirectionModal = document.querySelector(
  "#btnCloseRedirectionModal")
export const getAuthorized = document.querySelector('#btnRedirectToAuth');
export const redirectionModal = window.redirectionModal;