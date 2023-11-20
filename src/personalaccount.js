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
        console.log(clientInfo); //Проверка, тут мы видим, что получаем объект по пользователю, из которого можно получить id фильмов из likes
        // Получаем ключи объекта likes
        const likesKeys = Object.keys(clientInfo.likes); //получили ключи необходимого объекта, так они являются id выбранных пользователем фильмов
        console.log(likesKeys); //Проверили
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
                'X-API-KEY': "ee5367e9-c264-44b7-93b8-dab17fafadc7",
                               },
        });
        const data = await response.json();
       console.log(data); // Проверка. Здесь можно увидеть, что нам выдает АПИ
       makeList(data); // функция отрисовка списка, которая ниже
       
    }
   
} catch (error) {
    console.error("Ошибка загрузки:", error);
}

}


let likeList = window.document.querySelector('.list__movieList');
function makeList(data) {
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
         <span class="likeIcon"></span>
     </button>
 </div>
 </div>
 <div class="content-btn">
 <button class="content__btn btn" id="${data.kinopoiskId}">
     Показать информацию о фильме
 </button>
 </div>
       ` 

   item.innerHTML = template; //вставляем карточку в item
   
   likeList.appendChild(item); // добавляем элемент в контейнер
} 
})
