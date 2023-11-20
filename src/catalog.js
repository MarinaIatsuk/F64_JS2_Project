import * as db from './db'; // для работы с БД

let currentPage = 1; //Для пагинации
let prevPageBtn, nextPageBtn; //объявление переменных для кнопок переключения страниц здесь, чтобы они работали в функции

// Обработчик события клика на кнопку поиска
document.querySelector(".btn").addEventListener("click", function (event) {
    event.preventDefault(); // Остановить перезагрузку страницы
    currentPage = 1;  // для того, чтобы вернуть пользователя на первую страницу, при его новом поиске на любой другой
    getData(currentPage); // Вызов функцию для получения данных с текущей страницы
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
                "X-API-KEY": "ee5367e9-c264-44b7-93b8-dab17fafadc7",
            },
        });
        const data = await response.json();
        //console.log(data); //Проверка
        updateContainer(data); //отрисовка списка
        currentPage = page;
        
    } catch (error) {
        console.error("Ошибка загрузки:", error);
    }
}

// Функция, которая отрисовывает список фильмов
function updateContainer(data) {
    const container = document.querySelector(".content");
    container.textContent = "";

    data.items.forEach((film) => {
        const item = createFilmItem(film); // Создает элемент фильма
        container.appendChild(item);
    });

    managePageButtons(); //Управление кнопками предыдущая/следующая страницы
    // attachFilmButtonsEvent(); // Переход на карточку выбранного пользователем фильма
    attachLikeButtonsEvent(); // Передача id фильма в БД при нажатии на лайк
}

// Создает элемент фильма. Проходимся по массиву фильмов и добавляем информацию в контейнер
function createFilmItem(film) {
    const item = document.createElement("div");
    item.classList.add("content__item");
    const template =
        `
        <div class="content__poster">
        <img src="${film.posterUrlPreview}" alt="poster" class="content__img">
    </div>
    <div class="content__info">
        <a class="content__title" href="page-movie.html?id=${film.kinopoiskId}">${film.nameRu}</a>
        <a class="content__original-title" href="page-movie.html?id=${film.kinopoiskId}">${film.nameOriginal}</a>
        <div class="content__year">Год выхода фильма: ${film.year}</div>
        <div class="content__rating">Рейтинг по кинопоиску: ${film.ratingKinopoisk}</div>
        <div class="content__ratingImdb">Рейтинг по Imdb: ${film.ratingImdb}</div>
        <div class="filmFavContainer">
            <button class="content-button likeBtn" id="${film.kinopoiskId}">
                <span class="likeIcon"></span>
            </button>
        </div>
   
        `;
    item.innerHTML = template;
    return item;
}

// // Обработчик события клика на кнопках для показа инфы о фильиах
// function attachFilmButtonsEvent() {

//     const buttonInfo = document.querySelectorAll('.content__btn')//находим все кнопки
//     buttonInfo.forEach(function (button) { // проходим по каждой кнопке:

//         button.addEventListener('click', function () {
//             const filmId = button.getAttribute('id'); // Получаю id фильма из атрибута ID
//             //console.log(filmId); //Проверка
//             window.location.href = `page-movie.html?id=${filmId}`; // Переход на страницу film.html
//         });
//     });
// }

// Обработчик события клика на кнопках лайков
function attachLikeButtonsEvent() {
    const likeBtns = document.querySelectorAll('.likeBtn');
    likeBtns.forEach((btn) => {
        btn.addEventListener('click', function (event) {
            event.preventDefault();
            const filmId = btn.getAttribute('id');
            let target = event.target;
            // Проверка авторизации
            const objLS = window.localStorage.getItem('client'); // Получили id пользователя из бд
            if (!objLS) {// Если пользователь не авторизован, останавливаем функцию
                return;
            }

            const accessObj = JSON.parse(objLS).id;

            if (target.tagName === 'SPAN') {
                putLike(target);
                setLike(accessObj, filmId, true);
                console.log(filmId);
                
            }
        });
    });
}

// Лайкаем и добавляем в избранное
function putLike(span) {
    span.classList.toggle('liked');
}

// Функция для работы с БД
 async function setLike(user_id, film_id, state) {
    let subfield = `likes.${film_id}`;
    if (state) {
        const data = {};
        data[subfield] = true;
        await db.update("users", user_id, data);
    } else {
        await db.removeSubfield("users", user_id, subfield);
    }
}

// Управление кнопками страниц
function managePageButtons() {
    const paginationContainer = document.querySelector(".pagination");

    if (!document.querySelector(".pagination__prev-page-btn") || !document.querySelector(".pagination__next-page-btn btn")) { // Добавить элементы управления страницами, если их нет
        const templateBtn =
            `
        <button class="pagination__prev-page-btn btn">Предыдущая страница</button>
        <button class="pagination__next-page-btn btn">Следующая страница</button>
        `
        paginationContainer.innerHTML = templateBtn;

        prevPageBtn = document.querySelector(".pagination__prev-page-btn");
        nextPageBtn = document.querySelector(".pagination__next-page-btn");

        nextPageBtn.addEventListener("click", function (event) { //Обработчик события на кнопку "Следующая страница"
            event.preventDefault();
            getData(currentPage + 1);
        });

        prevPageBtn.addEventListener("click", function (event) { //Обработчик события на кнопку "Предыдущая страница"
            event.preventDefault();
            if (currentPage > 1) {
                getData(currentPage - 1);
            }
        });
    }
    // Убрать кнопку "предыдущая" страница на первой и "Следующая" на послндней
    prevPageBtn.style.display = (currentPage === 1) ? "none" : "block";
    nextPageBtn.style.display = (currentPage === 4) ? "none" : "block"; //Апи выдает 5 страниц, но кнопка пропадает на 5-й только если здесь 4
}














import { get } from './db';

document.addEventListener("DOMContentLoaded", function () {
    getMovieId();

    // Получаем id фильма из бд у пользователя:
    async function getMovieId() {
        try {
            // Получаем id пользователя из бд:
            // const clientId = window.localStorage.getItem('client');
            // const clientInfo = JSON.parse(clientId);
            // const userId = clientInfo.id;

            // const userData = await get("users", userId);

            // console.log(userData);
const ex={
    "name": "Михаил",
    "email": "bulka12121@gmail.com",
    "secret": "8586446755a81d800522bacda9fcf9c2",
    "likes": {
        "326": true,
        "361": true,
        "389": true,
        "435": true,
        "351771": true,
        "460089": true,
        "568016": true,
        "909720": true,
        "1201206": true,
        "1252447": true,
        "1309325": true,
        "5260016": true
    },
    "password": "1ac217343c079c21859c159049731109",
    "id": "WAdKgR1PYL9r3fzKk03d"
}
            const likesKeys = Object.keys(ex.likes);
            console.log(likesKeys);
            await getMovies(likesKeys);
        } catch (error) {
            console.error('Ошибка при получении данных:', error);
        }
    }

    async function getMovies(likesKeys) {
        console.log("я срабатываю");
        try {
            const moviePromises = likesKeys.map(async (id) => {
                const response = await fetch(`https://kinopoiskapiunofficial.tech/api/v2.2/films/${id}`, {
                    method: "GET",
                    headers: {
                        'content-type': "application/json",
                        "X-API-KEY": 'b5f46c64-de46-487e-b427-0ecc0ce121a5'
                    },
                });
                const data = await response.json();
                console.log(data);
                // updateContainer(data);
                return data; // возвращаем результат запроса
            });

            const moviesData = await Promise.all(moviePromises);
            console.log(moviesData); // массив данных по фильмам
        } catch (error) {
            console.error("Ошибка загрузки:", error);
        }
    }
});
