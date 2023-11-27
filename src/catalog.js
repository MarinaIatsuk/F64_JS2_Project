import {
    get
} from './db'; // для работы с БД. Импорт функции из db
import {
    setLike,
    showAlertNeedRegistration
} from './functions'

let currentPage = 1; // Флаг для пагинации
let loading = false; // Флаг для загрузки данных
let dataLoaded = false;
const mainPicture = document.querySelector('.catalog__image');

// Обработчик события клика на кнопку поиска
document.querySelector(".btn").addEventListener("click", function (event) {
    mainPicture.style.display = "none";
    event.preventDefault(); // Остановить перезагрузку страницы
    currentPage = 1; // Сбрасываем текущую страницу при новом поиске
    const container = document.querySelector(".content");
    container.innerHTML = ""; // Очищаем содержимое контейнера перед загрузкой новых данных
    getData(currentPage); // Вызов функции для получения данных с текущей страницы

    window.scrollTo({ // Возвращаем скролл в начало страницы
        top: 0,
        behavior: 'smooth' // плавный эффект прокрутки
    });
    dataLoaded = true;
});

// Обработчик события прокрутки страницы
window.addEventListener('scroll', function () {
    if (!dataLoaded) { // Если не были загружены данные, останавливаем функцию
        return;
    }
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
                //  "X-API-KEY": "4cb59c01-681c-4c05-bed7-5b173e7511c3",
                "X-API-KEY": "6e01b98a-32ba-41c9-b64f-a2a9582aafa5",
            },
        });
        const data = await response.json();

        await updateContainer(data); // отрисовка списка
        currentPage = page;
        loading = false; // разрешаем загрузку следующей порции данных

    } catch (error) {
        console.error("Ошибка загрузки:", error);
        loading = false; // обработка ошибки, разрешаем загрузку следующей порции данных
    }
}

// Функция, которая отрисовывает список фильмов (здесь костыль для отрисовки карточек. Если пользователь авторизован, то находится id пользователя и с ним отрисовывается карточка фильма, для того, чтобы сохранялись лайки, которые он ставил. Если он не авторизован, то карточка отрисовывается в стандартном размере)
async function updateContainer(data) {
    const container = document.querySelector(".content");

    if (data && data.items && Array.isArray(data.items)) {
        let likes = [];

        if (window.localStorage.getItem('client')) {
            const clientId = window.localStorage.getItem('client');
            const userId = JSON.parse(clientId).id;
            let user = await get("users", userId);
            likes = user.likes;
        }

        data.items.forEach((film) => {
            const item = createFilmItem(film, likes);
            container.appendChild(item);
        });
    }
}


// Создает элемент фильма. Проходимся по массиву фильмов и добавляем информацию в контейнер
function createFilmItem(film, likes) {
    const item = document.createElement("div");
    item.classList.add("content__item");

    let titleLink = '';

    const filmTitle = film.nameRu || film.nameOriginal;

    if (filmTitle !== null && filmTitle !== undefined) {
        titleLink = `<a class="content__title" href="page-movie.html?id=${film.kinopoiskId}">${filmTitle}</a>`;
    }

    const imdbRating = film.ratingImdb !== null ? film.ratingImdb : '-';

    const likedClass = likes && film.kinopoiskId in likes ? 'liked' : '';

    const template = `
        <div class="content__poster">
            <img src="${film.posterUrlPreview}" alt="poster" class="content__img">
        </div>
        <div class="content__info">
            ${titleLink}
            <div class="content__year">Год выхода фильма: ${film.year}</div>
            <div class="content__rating">Рейтинг по кинопоиску: ${film.ratingKinopoisk}</div>
            <div class="content__rating-imdb">Рейтинг по Imdb: ${imdbRating}</div>
        </div>
        <div class="content__favorite">
            <button class="content-button like" id="${film.kinopoiskId}">
                <span class="like__icon ${likedClass}"></span>
            </button>
        </div>
    `;

    item.innerHTML = template;
    return item;
}

document.querySelector(".content").addEventListener("click", function (event) {
    const likeBtn = event.target.closest('.content-button');

    if (likeBtn) {
        event.preventDefault();
        showAlertNeedRegistration(); // Проверка авторизации

        const filmId = likeBtn.getAttribute('id');
        const target = likeBtn.querySelector('.like__icon');

        if (target) {
            target.classList.toggle('liked'); // Меняем класс на "Лайк"  
            const objLS = window.localStorage.getItem('client');
            const accessObj = JSON.parse(objLS).id;
            setLike(accessObj, filmId, target.classList.contains('liked')); // Добавляем в БД в зависимости от наличия класса 'liked'
        }
    }
});