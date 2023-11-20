import * as db from './db'; // для работы с БД

let currentPage = 1; // Флаг для пагинации
let loading = false; // Флаг для загрузки данных

// Обработчик события клика на кнопку поиска
document.querySelector(".btn").addEventListener("click", function (event) {
    event.preventDefault(); // Остановить перезагрузку страницы
    currentPage = 1; // Сбрасываем текущую страницу при новом поиске
    const container = document.querySelector(".content");
    container.innerHTML = ""; // Очищаем содержимое контейнера перед загрузкой новых данных
    getData(currentPage); // Вызов функции для получения данных с текущей страницы

     window.scrollTo({ // Возвращаем скролл в начало страницы
        top: 0,
        behavior: 'smooth' // плавный эффект прокрутки
    });
});

// Обработчик события прокрутки страницы
window.addEventListener('scroll', function () {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight && !loading) { //проверяем, достиг ли пользователь конца документа
        loading = true; // Достигнут конец страницы, загружаем следующую порцию данных
        getData(currentPage + 1);
    }
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
                "X-API-KEY": "24b15cb0-02d2-47d4-83c9-c601d49f2256",
            },
        });
        const data = await response.json();
        //console.log(data); //Проверка
        updateContainer(data); // отрисовка списка
        currentPage = page;
        loading = false; // разрешаем загрузку следующей порции данных

    } catch (error) {
        console.error("Ошибка загрузки:", error);
        loading = false; // обработка ошибки, разрешаем загрузку следующей порции данных
    }
}

// Функция, которая отрисовывает список фильмов
function updateContainer(data) {
    const container = document.querySelector(".content");

    if (data && data.items && Array.isArray(data.items)) {
        data.items.forEach((film) => {
            const item = createFilmItem(film); // Создает элемент фильма
            container.appendChild(item);
        });
    } else {
        console.error('Неверный формат данных:', data);
    }
}

// Создает элемент фильма. Проходимся по массиву фильмов и добавляем информацию в контейнер
function createFilmItem(film) {
    const item = document.createElement("div");
    item.classList.add("content__item");

    let titleLink = '';
    let originalTitleLink = '';

    // Проверка на null или undefined для film.nameRu
    if (film.nameRu !== null && film.nameRu !== undefined) {
        titleLink = `<a class="content__title" href="page-movie.html?id=${film.kinopoiskId}">${film.nameRu}</a>`;
    }

    // Проверка на null или undefined для film.nameOriginal
    if (film.nameOriginal !== null && film.nameOriginal !== undefined) {
        originalTitleLink = `<a class="content__original-title" href="page-movie.html?id=${film.kinopoiskId}">${film.nameOriginal}</a>`;
    }

    const template =
        `
        <div class="content__poster">
            <img src="${film.posterUrlPreview}" alt="poster" class="content__img">
        </div>
        <div class="content__info">
            ${titleLink}
            ${originalTitleLink}
            <div class="content__year">Год выхода фильма: ${film.year}</div>
            <div class="content__rating">Рейтинг по кинопоиску: ${film.ratingKinopoisk}</div>
            <div class="content__ratingImdb">Рейтинг по Imdb: ${film.ratingImdb}</div>
        </div>
        `;

    item.innerHTML = template;
    return item;
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
