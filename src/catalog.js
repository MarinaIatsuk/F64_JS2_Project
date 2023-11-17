import "./db";
import * as db from './db';
import MD5 from "crypto-js/md5";

document.addEventListener('DOMContentLoaded', function () {
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

                setLike(accessObj, filmId, false) 
            }
        });
    });

    //лайкаем и добавляем в избранное Нужно ли выносить?
    function putLike(span) {
        span.classList.toggle('liked');
    }
}

    });

