import { setLike } from "./index.js"; //я импортирую функцию из index.js, которую использую здесь.  Эта функция внизу, где функция с лайками функция для лайков (после 88 строки)

// Обработчик события клика на кнопку поиска
document.querySelector(".btn").addEventListener("click", getData);

// Функция для выполнения запроса к API
async function getData() {
    const genre = document.getElementById("genre").value;
    const country = document.getElementById("country").value;
    const movieSerial = document.getElementById("movie-serial").value;

    try {
        const response = await fetch(`https://kinopoiskapiunofficial.tech/api/v2.2/films?countries=${country}&genres=${genre}&order=RATING&type=${movieSerial}&ratingFrom=0&ratingTo=10&yearFrom=1000&yearTo=3000&page=1`, {
            method: "GET",
            headers: {
                'content-type': "application/json",
                "X-API-KEY": "4cb59c01-681c-4c05-bed7-5b173e7511c3",
            },
        });
        const data = await response.json();
        console.log(data);
        updateContainer(data)
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

//Функция, которая отрисовывает список фильмов
function updateContainer(data) {
    // Очищаем предыдущие данные
    const container = document.querySelector(".container__content");
    container.textContent = ""; /* container.innerHTML = ""; для новых данных, а не для полного очищения контейнера. Более безопасно  container.textContent */

    // Проходимся по массиву фильмов и добавляем информацию в контейнер
    data.items.forEach((film) => {
        const item = document.createElement("div");
        item.classList.add("content__item");
        const template =
            `
                <div class="content__poster">
                    <img src=" ${film.posterUrlPreview}" alt="poster" class="poster__img">
                </div>
                <div class="content__info">
                    <h3 class="content__title">${film.nameRu}</h3>
                    <div class="content__year">Год выхода фильма: ${film.year}</div>
                    <div class="content__rating">Рейтинг по кинопоиску: ${film.ratingKinopoisk}</div>
                    <div class="content__ratingImdb">Рейтинг по Imdb: ${film.ratingImdb}</div>
                    <div class="filmFavContainer">
                        <button  class="content-button likeBtn id=${film.kinopoiskId}"> <!--Этот id здесь вставлен коряво, сделала для проверки, работает ли. Потом убрать!!-->
                            <span  class="likeIcon"></span>
                        </button>
                    </div>
                </div>
                <div class="content-btn">
                    <button  class="content__btn btn" id=${film.kinopoiskId}>
                        Показать информацию о фильме
                    </button>
                </div>
        `

        item.innerHTML = template;
        container.appendChild(item);
    });



//при нажатии на кнопку, переходим на страницу с фильмрм и id выбранного фильма сохраняем в local storage, чтобы по нему отрисовать инфу о фильме:

    //находим все кнопки
    const buttonInfo = document.querySelectorAll('.infoBTN')

    // проходим по каждой кнопке:
    buttonInfo.forEach(function (button) {
        button.addEventListener('click', function () {
            // Получаю id фильма из атрибута ID
            const filmId = button.getAttribute('id');

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
            let target = event.target; //это «целевой» элемент, на котором произошло событие
            if (target.tagName === 'SPAN') {
                putLike(target);

                // Получаю id фильма из каждого "лайка"
                const filmId = btn.getAttribute('id');
                // Получаю id пользователя из Local storage
                const objLS = window.localStorage.getItem('client');
                const accessObj = JSON.parse(objLS).id;
                console.log(accessObj); //Проверка

                setLike(accessObj, filmId, true) //ВОТ ТА САМАЯ функция  для переноса id в бд, которую импортировала из index.js
            }
        });
    });

    //лайкаем и добавляем в избранное Нужно ли выносить?
    function putLike(span) {
        span.classList.toggle('liked');
    }
}

import {sum} from "./index";
console.log(sum());