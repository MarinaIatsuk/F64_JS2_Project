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
                "X-API-KEY": "4cb59c01-681c-4c05-bed7-5b173e7511c3",
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
    attachFilmButtonsEvent(); // Переход на карточку выбранного пользователем фильма
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
        <h3 class="content__title">${film.nameRu}</h3>
        <h3 class="content__original-title">${film.nameOriginal}</h3>
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
    return item;
}

// Обработчик события клика на кнопках для показа инфы о фильиах
function attachFilmButtonsEvent() {

    const buttonInfo = document.querySelectorAll('.content__btn')//находим все кнопки
    buttonInfo.forEach(function (button) { // проходим по каждой кнопке:

        button.addEventListener('click', function () {
            const filmId = button.getAttribute('id'); // Получаю id фильма из атрибута ID
            //console.log(filmId); //Проверка
            localStorage.setItem('selectedFilmId', filmId); // Сохранение id фильма в localStorage
            window.location.href = 'page-movie.html'; // Переход на страницу film.html
        });
    });
}

// Обработчик события клика на кнопках лайков
function attachLikeButtonsEvent() {
    const likeBtns = document.querySelectorAll('.likeBtn');
    likeBtns.forEach((btn) => {
        btn.addEventListener('click', function (event) {
            event.preventDefault();
            const filmId = btn.getAttribute('id');
            let target = event.target;
            // Проверка авторизации
            const objLS = window.localStorage.getItem('client');
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