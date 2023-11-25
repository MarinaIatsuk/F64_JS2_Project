import * as db from "./db";
import { get_query } from "./db"; // Импорт функции из db для работы с БД
import "./reviews-tabs";

// Прописываем локаль и опции для форматирования даты
const formatter = new Intl.DateTimeFormat("ru-RU", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: false,
    timeZone: "UTC",
    timeZoneName: "short",
});

// Функция создания разметки поста с рецензией
// (получает на вход объект поста и возвращает строку HTML-разметки)
function createPostMarkup(post) {
    const maxTextLength = 1400;
    const originalDescription = post.description;
    let remainingDescription = "";
    let description;
    let btn = "";
    let classModifier = "";
    
    if (originalDescription.length > maxTextLength) {
        description = originalDescription.slice(0, maxTextLength);
        remainingDescription = originalDescription.slice(maxTextLength);
        classModifier = ` review-post__body_collapsed`
        btn = `<button class="review-post__expand-button">... &#10230;</button>`;
        // btn = `<button class="review-post__expand-button expand-button">... Развернуть</button>`;
    } else {
        description = originalDescription;
    }

    let typeOfReview;
    if (post.type == "POSITIVE") {
        typeOfReview = "review-post_type_positive";
    } else if (post.type == "NEGATIVE") {
        typeOfReview = "review-post_type_negative";
    } else {
        typeOfReview = "review-post_type_neutral";
    }

    let title;
    if (post.title === null) {
        title = "&#10077";
    } else {
        title = post.title;
    }

    const template = `
    <article class="review-post ${typeOfReview}">
        <h3 class="review-post__title">${title}</h3>
        <p class="review-post__body${classModifier}">${description}<span class="review-post__remaining-text _hidden">${remainingDescription}</span>${btn}</p>
        <div class="review-post__usefulness usefulness">
            <div class="usefulness__positive">Полезно ${post.positiveRating}</div>
            <div class="usefulness__negative">Нет ${post.negativeRating}</div>
        </div>
    </article>
    `;
    return template;
}

// Функция создания разметки поста с отзывом
function createCommentMarkup(post) {
    const maxTextLength = 200;
    const originalText = post.text;
    let remainingText = "";
    let text;
    let btn = "";
    let classModifier = "";

    if (originalText.length > maxTextLength) {
        text = originalText.slice(0, maxTextLength);
        remainingText = originalText.slice(maxTextLength);
        classModifier = ` comment-post__text_collapsed`
        btn = `<button class="comment-post__expand-button">... &#10230;</button>`;
        // btn = `<button class="comment-post__expand-button expand-button">... Развернуть</button>`;
    } else {
        text = originalText;
    }

    let title;
    if (post.title === undefined) {
        title = "&#10077";
    } else {
        title = post.title;
    }

    const template = `
    <article class="comments-container__comment-post comment-post">
        <h3 class="comment-post__title">${title}</h3>
        <p class="comment-post__text${classModifier}">${text}<span class="comment-post__remaining-text _hidden">${remainingText}</span>${btn}</p>
        <p class="comment-post__author">Автор отзыва: ${post.name}</p>
        <time class="comment-post__date">${formatter.format(post.date)}</time>
    </article>
    `;

    return template;
}

// Функция развертывания текста отзыва
function expandCommentText(event) {
    const body = event.target.closest('.comment-post__text');
    const remainingTextElement = body.querySelector('.comment-post__remaining-text');
    if (body.classList.contains('comment-post__text_collapsed')) {
        body.classList.remove('comment-post__text_collapsed');
        remainingTextElement.classList.remove("_hidden");
        remainingTextElement.classList.add('_visible');
        event.target.innerHTML = `&nbsp;&nbsp;&nbsp;&#10229; Свернуть`;
    } else {
        body.classList.add('comment-post__text_collapsed');
        remainingTextElement.classList.remove("_visible");
        remainingTextElement.classList.add("_hidden");
        event.target.innerHTML = `... Развернуть &#10230;`;
    }
}

// Функция развертывания текста рецензии
function expandReviewText(event) {
    const body = event.target.closest('.review-post__body');
    const remainingTextElement = body.querySelector('.review-post__remaining-text');
    if (body.classList.contains('review-post__body_collapsed')) {
        body.classList.remove('review-post__body_collapsed');
        remainingTextElement.classList.remove("_hidden");
        remainingTextElement.classList.add('_visible');
        event.target.innerHTML = `&nbsp;&nbsp;&nbsp;&nbsp;&#10229; Свернуть`;
    } else {
        body.classList.add('review-post__body_collapsed');
        remainingTextElement.classList.remove("_visible");
        remainingTextElement.classList.add("_hidden");
        event.target.innerHTML = `... Развернуть &#10230;`;
    }
}

// Делегирование событий для управления развертыванием и сворачиванием текста
document.addEventListener('click', function(event) {
    if (event.target.matches('.comment-post__expand-button')) {
        expandCommentText(event);
    } else if (event.target.matches('.review-post__expand-button')) {
        expandReviewText(event);
    }
});

// Функция добавления разметки в контейнер
function addMarkupToContainer(markup, container) {
    container.innerHTML += markup;
}

// Функция добавления кол-ва отзывов в контейнер
function addTotalToContainer(posts, container) {
    const totalContainer = document.createElement("div");
    totalContainer.classList.add("reviews-container__total-wrapper", "total-wrapper");
    const totalReviwesTemplate = `
    <div class="total-wrapper__total total">
        <div class="total__count count-text">Всего <span class="count-number count-number_type_all">${posts.total}</span></div>
        <div class="total__positive count-text">Положительные <span class="count-number count-number_type_positive">${posts.totalPositiveReviews}</span></div>
        <div class="total__neutral count-text">Нейтральные <span class="count-number count-number_type_neutral">${posts.totalNeutralReviews}</span></div>
        <div class="total__negative count-text">Отрицательные <span class="count-number count-number_type_negative">${posts.totalNegativeReviews}</span></div>
    </div>
    `;
    container.before(totalContainer);
    totalContainer.innerHTML = totalReviwesTemplate;
}

// Функция, которая делает GET-запрос и добавляет посты на страницу
async function getPosts() {
    try {
        // const selectedFilmId = window.localStorage.getItem("selectedFilmId");
        let selectedFilmId = new URLSearchParams(window.location.search).get('id');
        const response = await fetch(
            `https://kinopoiskapiunofficial.tech/api/v2.2/films/${selectedFilmId}/reviews`,
            {
                method: "GET",
                headers: {
                    // 'X-API-KEY': '94ca834b-5c22-427c-af84-610eb7685d60', //tech
                    "X-API-KEY": "ea3a683d-e344-4f44-98e9-1e6b0bb1d8b1", //tech Nat's
                    "Content-Type": "application/json",
                },
            }
        );

        const posts = await response.json();
        console.log(posts);

        const postsContainer = document.querySelector(".posts-wrapper");

        posts.items.forEach((item) => {
            const postMarkup = createPostMarkup(item);
            addMarkupToContainer(postMarkup, postsContainer);
        });
        addTotalToContainer(posts, postsContainer);
    } catch (error) {
        console.error(
            "%c%s",
            "padding: 0 .5rem; background: #d14758; font: 1.125rem Arial; color: white;",
            error
        );
    }
}

// Функция для получения отзывов из БД
async function getComments() {
    try {
        // const selectedFilmId = "1234"; // Для теста
        // const selectedFilmId = window.localStorage.getItem("selectedFilmId");
        let selectedFilmId = new URLSearchParams(window.location.search).get('id');
        const key = "film_id";
        const comments = await get_query("comments", key, selectedFilmId);
        console.log(comments);

        const commentsContainer = document.querySelector(".comments-container");
        comments.forEach((comment) => {
            const commentMarkup = createCommentMarkup(comment);
            addMarkupToContainer(commentMarkup, commentsContainer);
        });
    } catch (error) {
        console.error("Ошибка при получении данных из БД:", error);
    }
}

// Функции открытия и закрытия модальных окнон

const btnCloseRedirectionModal = document.querySelector(
    "#btnCloseRedirectionModal"
);

// Получаем данные пользователя из Local Storage
let client = localStorage.getItem("client");
client = client ? JSON.parse(client) : null;

// Функция открытия окна успешной отправки отзыва на 4 секунды
function openSuccessModal() {
    window.successModal.showModal();
    setTimeout(() => window.successModal.close(), 4000);
}

function closeRedirectionModal() {
    window.redirectionModal.close();
}

btnCloseRedirectionModal.addEventListener("click", closeRedirectionModal);

// Функция добавления отзыва в БД

async function addReview(user_id, user_name, film_id, title, text, date) {
    const data = {};
    data.title = title;
    data.text = text;
    // data.date = Date.now();
    data.date = date;
    data.name = user_name;
    data.user_id = user_id;
    data.film_id = film_id;
    const id = await db.add("comments", data);

    // Открываем окно успешного отправления отзыва на несколько секунд
    openSuccessModal();
    console.log("Отзыв успешно отправлен!");

    // Очищаем поля
    reviewTitleInput.value = "";
    reviewTextInput.value = "";

    // Обновляем отзывы на странице
    getComments()
    return id;
}

// Получаем элементы
// const reviewTitleInput = document.getElementById("reviewTitle");
// const reviewTextInput = document.getElementById("reviewText");
const reviewForm = document.forms.reviewForm;
const reviewTitleInput = reviewForm.elements.reviewTitle;
const reviewTextInput = reviewForm.elements.reviewText;

// Функция сбора данных из формы и отправки их в нужные поля для БД
async function getDataFromReviewForm() {
    // Получаем заголовок отзыва из input
    const reviewTitle = reviewTitleInput.value.trim();
    // Получаем текст отзыва из input
    const reviewText = reviewTextInput.value.trim();

    if (reviewText !== "" && client) {
        const date = Date.now();
        const title = reviewTitle;
        const text = reviewText;

        // Получаем id фильма
        // const selectedFilmId = localStorage.getItem("selectedFilmId");
        let selectedFilmId = new URLSearchParams(window.location.search).get('id');

        // Получаем из локального хранилища id и имя пользователя
        const userId = client.id;
        const userName = client.name;

        const id = await addReview(
            userId,
            userName,
            selectedFilmId,
            title,
            text,
            date
        );
        console.log(
            "Данные из формы:",
            userId,
            userName,
            selectedFilmId,
            title,
            text,
            date
        );
        console.log("Comment added with id:", id);
        // submitBtn.disabled = false;
    } else if (client === null) {
        window.redirectionModal.showModal();
    }
}

// const reviewForm = document.forms.reviewForm;
reviewForm.addEventListener("submit", (e) => {
    e.preventDefault(); //отмена отправки

    getDataFromReviewForm();

    // TODO написать валидацию полей
    // checkAll();
});

getPosts();
getComments();
