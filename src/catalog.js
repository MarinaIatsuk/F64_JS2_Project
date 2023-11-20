import "./db";
import * as db from './db';
import MD5 from "crypto-js/md5";
import {
    get
} from './db'; // для работы с БД. Импорт функции из db

document.addEventListener("DOMContentLoaded", function () {
    let currentPage = 1;

    // Обработчик события клика на кнопку поиска
    document.querySelector(".btn").addEventListener("click", function (event) {
        event.preventDefault(); // Остановить перезагрузку страницы
        // Вызвать функцию для получения данных с текущей страницы
        getData(currentPage);
    });

    // Функция для выполнения запроса к API
    async function getData(page) {
        const genre = document.getElementById("genre").value;
        const country = document.getElementById("country").value;
        const movieSerial = document.getElementById("movie-serial").value;

        try {
            const response = await fetch(`https://kinopoiskapiunofficial.tech/api/v2.2/films?countries=${country}&genres=${genre}&order=RATING&type=${movieSerial}&ratingFrom=0&ratingTo=10&yearFrom=1000&yearTo=3000&page=${page}`, {
                method: "GET",
                headers: {
                    'content-type': "application/json",
                    "X-API-KEY": "4cb59c01-681c-4c05-bed7-5b173e7511c3",
                },
            });
            const data = await response.json();
            console.log(data);
            updateContainer(data);
            currentPage = page; // Установить текущую страницу после успешного запроса
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    // Функция, которая отрисовывает список фильмов
    function updateContainer(data) {
        // Очищаем предыдущие данные
        const container = document.querySelector(".container__content");
        container.textContent = "";

        // Проходимся по массиву фильмов и добавляем информацию в контейнер
        data.items.forEach((film) => {
            const item = document.createElement("div");
            item.classList.add("content__item");
            const template =
                `
                    <div class="content__poster">
                        <img src="${film.posterUrlPreview}" alt="poster" class="poster__img">
                    </div>
                    <div class="content__info">
                        <h3 class="content__title">${film.nameRu}</h3>
                        <div class="content__year">Год выхода фильма: ${film.year}</div>
                        <div class="content__rating">Рейтинг по кинопоиску: ${film.ratingKinopoisk}</div>
                        <div class="content__ratingImdb">Рейтинг по Imdb: ${film.ratingImdb}</div>
                        <div class="filmFavContainer">
                            <button class="content-button likeBtn" id="${film.kinopoiskId}">
                                <span class="likeIcon"></span>
                            </button>
                        </div>
                    </div>
                    <div class="content-btn">
                        <button class="content__btn btn" id="${film.kinopoiskId}">
                            Показать информацию о фильме
                        </button>
                    </div>
            `;
            item.innerHTML = template;
            container.appendChild(item);
        });

        // Добавить элементы управления страницами, если их нет
        if (!document.querySelector(".prev-page-btn") || !document.querySelector(".next-page-btn")) {

            const paginationContainer = document.querySelector(".container-pagination");
            
            const templateBtn=
            `
            <button class="prev-page-btn btn">Предыдущая страница</button>
                <button class="next-page-btn btn">Следующая страница</button>
            `
            paginationContainer.innerHTML=templateBtn

            //Нашли новые кнопки:
            const prevPageBtn = document.querySelector(".prev-page-btn")
            const nextPageBtn = document.querySelector(".next-page-btn")

            // Обработчик события клика на кнопку "Следующая страница"
            nextPageBtn.addEventListener("click", function (event) {
                event.preventDefault();
                getData(currentPage + 1);
            });

            // Обработчик события клика на кнопку "Предыдущая страница"
            prevPageBtn.addEventListener("click", function (event) {
                event.preventDefault();
                if (currentPage > 1) {
                    getData(currentPage - 1);
                }
            });
        }

        //при нажатии на кнопку, переходим на страницу с фильмрм и id выбранного фильма сохраняем в local storage, чтобы по нему отрисовать инфу о фильме:

    //находим все кнопки
    const buttonInfo = document.querySelectorAll('.content__btn')

    // проходим по каждой кнопке:
    buttonInfo.forEach(function (button) {
        
        button.addEventListener('click', function () {
            // Получаю id фильма из атрибута ID
            const filmId = button.getAttribute('id');
            console.log(filmId);

            // Сохранение id фильма в localStorage
            localStorage.setItem('selectedFilmId', filmId);

            // Переход на страницу film.html
            window.location.href = 'page-movie.html';
        });
    });


    //функция для лайков
    // выбираем все лайки
    const likeBtns = document.querySelectorAll('.likeBtn');
    likeBtns.forEach((btn) => {
        btn.addEventListener('click', function (event) {
            event.preventDefault()
            // Получаю id фильма из каждого "лайка"
            const filmId = btn.getAttribute('id');
            let target = event.target; //это «целевой» элемент, на котором произошло событие
            if (target.tagName === 'SPAN') {
                putLike(target);
                console.log(filmId); //Проверка
                  // Получаю id пользователя из Local storage
    const objLS = window.localStorage.getItem('client');
    const accessObj = JSON.parse(objLS).id;
                console.log(accessObj); //Проверка
               setLike(accessObj, filmId, true) 
        }
                       });
        });


    //лайкаем и добавляем в избранное Нужно ли выносить?
    function putLike(span) {
        span.classList.toggle('liked');
    }
}
 async function setLike(user_id, film_id, state) {
    const data = {};
    data[`likes.${film_id}`] = state;
    await db.update("users", user_id, data);
    
};
    

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
     <h3 class="content__title">${data.nameRu}</h3> 
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


