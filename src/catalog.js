import * as db from './db'; // для работы с БД
import { showAlertNeedRegistration } from './functions';

let currentPage = 1; // Флаг для пагинации
let loading = false; // Флаг для загрузки данных
let dataLoaded = false;
const mainPicture=document.querySelector('.catalog__image')

// Обработчик события клика на кнопку поиска
document.querySelector(".btn").addEventListener("click", function (event) {
    mainPicture.style.display = "none"
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
                "X-API-KEY": "4cb59c01-681c-4c05-bed7-5b173e7511c3",
            },
        });
        const data = await response.json();
        //console.log(data); //Проверка
        updateContainer(data); // отрисовка списка
        attachLikeButtonsEvent()
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

   
    const filmTitle = film.nameRu || film.nameOriginal; 

   
    if (filmTitle !== null && filmTitle !== undefined) {  // Проверка на null или undefined для filmTitle
        titleLink = `<a class="content__title" href="page-movie.html?id=${film.kinopoiskId}">${filmTitle}</a>`;
    }

    
    
    const imdbRating = film.ratingImdb !== null ? film.ratingImdb : '-'; // Проверка на null для рейтинга по IMDb

    const template =
        `
        <div class="content__poster">
            <img src="${film.posterUrlPreview}" alt="poster" class="content__img">
        </div>
        <div class="content__info">
            ${titleLink}
            <div class="content__year">Год выхода фильма: ${film.year}</div>
            <div class="content__rating">Рейтинг по кинопоиску: ${film.ratingKinopoisk}</div>
            <div class="content__ratingImdb">Рейтинг по Imdb: ${imdbRating}</div>
        </div>
        <div class="filmFavContainer">
                            <button class="content-button likeBtn" id="${film.kinopoiskId}">
                                <span class="likeIcon"></span>
                            </button>
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

        showAlertNeedRegistration();  // Проверка авторизации 

            const filmId = btn.getAttribute('id');
            let target = event.target;
   
            const objLS = window.localStorage.getItem('client');
            const accessObj = JSON.parse(objLS).id;  

            if (target.tagName === 'SPAN') {
                target.classList.toggle('liked'); // Меняем класс на "Лайк"  
                console.log(accessObj); //Проверка
                setLike(accessObj, filmId, target.classList.contains('liked')); //добавляем в БД в зависимости от наличия класса 'liked'
                console.log(filmId);
             }
        });
    });
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


