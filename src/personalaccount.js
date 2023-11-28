import "./db";
import * as db from './db';
import MD5 from "crypto-js/md5";

import {
  get
} from './db'; // для работы с БД. Импорт функции из db


document.addEventListener("DOMContentLoaded", function () {


  
const listInput = document.querySelector("#listInput");
const listItem = document.querySelector(".list__title");
let createListBtn = document.querySelector(".lk__btn");
let modal = document.querySelector('.lk__modalList');
const modalBox = document.getElementById('modal-box');
const modalListBtn = document.querySelector('.modalList__btn');


//открытие модалки
let isModalOpen = false
createListBtn .addEventListener('click', (e) => {
  modal.showModal()
  isModalOpen = true
  e.stopPropagation()
})

modalListBtn .addEventListener('click', () => {
  modal.close()
  isModalOpen = false
})

document.addEventListener('click', (e) => {
  if (isModalOpen && !modalBox.contains(e.target)) {
    modal.close()
  }
})

// создание элемента списка

function createListItem(){
  let inputValue = listInput.value.trim();
  if ( inputValue !==''){
  let liItem = document.createElement('li');
  let linkItem = document.createElement('a');
  linkItem.href = '#'; 
 linkItem.innerHTML = inputValue;
  liItem.appendChild(linkItem);
   listItem.appendChild(liItem);
   listInput.value = '';
}
}
modalListBtn.addEventListener('click',createListItem);

listInput.addEventListener('keyup', (event) => {
//если нажать enter, то создастся список и закроется модалка 
  if (event.key === 'Enter' ) {
    createListItem();
    modal.close()
  }
});


const clientId = window.localStorage.getItem('client')
const clientInfo = JSON.parse(clientId); // Парсим строку JSON в объект
const userId = clientInfo.id; // Получаем id из объекта

get("users", userId) //Вызываем функцию get, которая возвращает промис users-это base, userId-это id
    .then(clientInfo => {
        // console.log(clientInfo); //Проверка, тут мы видим, что получаем объект по пользователю, из которого можно получить id фильмов из likes, у которых значение равно true
        // Получаем ключи объекта likes
        const likesKeys = Object.keys(clientInfo.likes)
        .filter(key => clientInfo.likes[key] === true); //получили ключи необходимого объекта, так они являются id выбранных пользователем фильмов
   
        // console.log(likesKeys); //Проверили
        getMovies(likesKeys) //Функция для получения фильмов из АПИ
       
    })
    .catch(error => {
        console.error('Ошибка при получении данных из БД:', error);
    });

//тут мы проходим по массиву и по id в массиве и находим в АПИ инфу по этому id
 async function getMovies(likesKeys) {
try {
    for (const id of likesKeys) { //Проходим по массиву и получаем инфу от АПИ
        const response = await fetch(`https://kinopoiskapiunofficial.tech/api/v2.2/films/${id}`, {
            method: "GET",
            headers: {
                'content-type': "application/json",
                'X-API-KEY': "4cb59c01-681c-4c05-bed7-5b173e7511c3",
                               },
        });
        const data = await response.json();
      //  console.log(data); // Проверка. Здесь можно увидеть, что нам выдает АПИ
       makeList(data); // функция отрисовка списка, которая ниже
       
    }
   
} catch (error) {
    console.error("Ошибка загрузки:", error);
}

}



let likeList = window.document.querySelector('.list__movieList');

function makeList(data) {
  const emptyList = document.querySelector(".list__empty");

  const item = document.createElement("div"); //создаем, например, див
item.classList.add("content__item"); //здесь пишем необходимый класс этого дива


const template =  `
<div class="content__poster">
<img src="${data.posterUrlPreview}" alt="poster" class="poster__img">
</div>
<div class="content__info">
 <h3 class="content__title"><a href="page-movie.html?id=${data.kinopoiskId}" class="favorites_title">${data.nameRu}</a></h3> 
 <div class="content__year">Год выхода фильма: ${data.year}</div>
 <div class="content__rating">Рейтинг по кинопоиску: ${data.ratingKinopoisk}</div>
 <div class="content__ratingImdb">Рейтинг по Imdb: ${data.ratingImdb}</div>
 <div class="filmFavContainer">
     <button class="content-button likeBtn" id="${data.kinopoiskId}">
         <span class="liked"></span>
     </button>
 </div>
 </div>
       ` 

   item.innerHTML = template; //вставляем карточку в item
  likeList.appendChild(item); // добавляем элемент в контейнер

  emptyList.style.display = "none";


  
    // выбираем все лайки

    likeList.addEventListener('click', async function (event) {
            event.preventDefault()
           
             // Проверка является ли выбранный элемент кнопкой с классом  'likeBtn'
    const likeBtn = event.target.closest('.likeBtn');
    if (likeBtn) {
        const filmId = likeBtn.getAttribute('id');
        const objLS = window.localStorage.getItem('client');
        const accessObj = JSON.parse(objLS).id;

        likeBtn.querySelector('span').classList.toggle('liked');
        // console.log(filmId);
        // console.log(accessObj);
      
// Находим родительский элемент лайка и удаляем его
const movieRemove = likeBtn.closest('.content__item');
if (movieRemove) {
    movieRemove.remove();
}
setLike(accessObj, filmId, false);
        }
 // Проверяем, является ли выбранный элемент ссылкой с классом 'favorites_title'
 const linkItem = event.target.closest('.favorites_title');
 if (linkItem) {
  //.log('Ссылка была кликнута:', linkItem.href);
  window.location.href = linkItem.href;
 }

     });
    
  }
  });
  
async function updateFavoritesList(user_id) {
  // Получаем актуальные данные из базы
  const updatedClientInfo = await db.get("users", user_id);

  // Получаем ключи объекта likes, у которых значение равно true
  const likesKeys = Object.keys(updatedClientInfo.likes)
      .filter(key => updatedClientInfo.likes[key] === true);
      
  // Очищаем текущий список в избранном
  likeList.textContent = "";
  // Обновляем список фильмов в избранном
  await getMovies(likesKeys);
}


async function setLike(user_id, film_id, state) {
  let subfield = `likes.${film_id}`;
  if (state) {
      const data = {};
      data[subfield] = true;
      await db.update("users", user_id, data);
  } else {
      await db.removeSubfield("users", user_id, subfield);
  }
  updateFavoritesList(user_id);  // Обновление интерфейса после изменения данных в БД */
}


 
     








