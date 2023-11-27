import * as db from "./db";
import "./reviews-tabs";
import { showAlertNeedRegistration } from './functions'

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

// Функция открытия третьей вкладки при переходе со второй вкладки
function openTabThree() {
    const tabThreeTitle = document.querySelector('[data-tab="tab_3"]');
    const tabTwoTitle = document.querySelector('[data-tab="tab_2"]');
    const tabThreeItem = document.querySelector("#tab_3");
    const tabTwoItem = document.querySelector("#tab_2");
    tabThreeTitle.classList.add("_active");
    tabTwoTitle.classList.remove("_active");
    tabThreeItem.classList.add("_active");
    tabTwoItem.classList.remove("_active");
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
    if (post.title === undefined || post.title === "") {
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

// Функция добавления кол-ва рецензий в контейнер
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
                    'X-API-KEY': '94ca834b-5c22-427c-af84-610eb7685d60', //tech
                    // "X-API-KEY": "ea3a683d-e344-4f44-98e9-1e6b0bb1d8b1", //tech Nat's
                    "Content-Type": "application/json",
                },
            }
        );

        const posts = await response.json();

        const postsContainer = document.querySelector(".posts-wrapper");
        if (posts.items.length === 0) {
            // Если нет рецензий
            const template = `
            <article class="review-post review-post_no-reviews">
                <h3 class="review-post__title">Пока нет рецензий от зрителей Кинопоиска</h3>
            </article>
            `;
            postsContainer.innerHTML = template;
        } else {
            posts.items.forEach((item) => {
                const postMarkup = createPostMarkup(item);
                addMarkupToContainer(postMarkup, postsContainer);
            });
            addTotalToContainer(posts, postsContainer);
        }

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
        const comments = await db.get_query("comments", key, selectedFilmId);

        if (comments.length === 0) {
            // Если нет отзывов, выводится предложение добавить отзыв
            const commentsContainer = document.querySelector(".comments-container");
            const template = `
            <article class="comments-container__comment-post comment-post сomment-post_no-comments">
                <h3 class="comment-post__title">Будьте первым, кто оставит отзыв!</h3>
                <button class="comment-post__add-btn" id="goToTabThreeBtn">Добавить&nbsp;&#10010;</button>
            </article>
            `;
            commentsContainer.innerHTML = template;
            const goToTabThreeBtn = document.querySelector("#goToTabThreeBtn");
            goToTabThreeBtn.addEventListener("click", openTabThree);
        } else {
            const commentsContainer = document.querySelector(".comments-container");
            comments.forEach((comment) => {
                const commentMarkup = createCommentMarkup(comment);
                addMarkupToContainer(commentMarkup, commentsContainer);
            });
        }

    } catch (error) {
        console.error("Ошибка при получении данных из БД:", error);
    }
}

// Функции открытия и закрытия модальных окнон

// Кнопка закрытия модального окна для неавторизованного пользователя
const btnCloseRedirectionModal = document.querySelector(
    "#btnCloseRedirectionModal"
);
const redirectionModal = document.querySelector("#redirectionModal");

// Получаем данные пользователя из Local Storage
let client = localStorage.getItem("client");
client = client ? JSON.parse(client) : null;

// Функция открытия модального окна для неавторизованного пользователя
function openModalAndLockScroll() {
    window.redirectionModal.showModal();
    document.body.classList.add("scroll-lock")
}

// Возвращаем возможность прокрутки
function returnScroll() {
    document.body.classList.remove("scroll-lock")
}

// Функция открытия окна успешной отправки отзыва на 4 секунды
function openSuccessModal() {
    window.successModal.showModal();
    setTimeout(() => window.successModal.close(), 4000);
}

// Функция закрытия модалки для неавторизованного пользователя
function closeRedirectionModal() {
    redirectionModal.close();
    returnScroll()
}

btnCloseRedirectionModal.addEventListener("click", closeRedirectionModal);

// Закрытие модального окна по клику на подложку
redirectionModal.addEventListener("click", closeOnBackDropClick)

function closeOnBackDropClick({ currentTarget, target }) {
    const redirectionModal = currentTarget
    const isClickedOnBackDrop = target === redirectionModal
    if (isClickedOnBackDrop) {
        closeRedirectionModal();
    }
}


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

    // Очищаем поля
    reviewTitleInput.value = "";
    reviewTextInput.value = "";

    // Обновляем отзывы на странице
    getComments()
    return id;
}

// Функция сбора данных из формы и отправки их в нужные поля для БД
async function getDataFromReviewForm() {
    
    // Получаем элементы формы
    const reviewForm = document.forms.reviewForm;
    const reviewTitleInput = reviewForm.elements.reviewTitle;
    const reviewTextInput = reviewForm.elements.reviewText;
    
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
        console.log("Comment added with id:", id);
        // submitBtn.disabled = false;
    } else if (client === null) {
        openModalAndLockScroll();
    }
}

// Функция отрисовки вкладки с формой отзыва

function renderReviewForm() {
    const reviewFormContainer = document.querySelector(".review-form");
    let formTemplate;
    
    if (client) {
        // Если пользователь авторизован, отрисовываем форму отправки отзыва
        formTemplate = `
        <div class="review-form__container" id="reviewContainer">
            <h2 class="review-form__title">Оставьте отзыв</h2>
            <p class="review-form__text">Поделитесь своим мнением о фильме</p>
            <form class="comment-form" name="reviewForm" novalidate>
                <div class="comment-form__content-title">
                    <input type="text" name="reviewTitle" class="comment-form__title-input" id="reviewTitle"
                    placeholder="Заголовок">
                </div>
                <div class="comment-form__content-text">
                    <textarea name="reviewText" id="reviewText" rows="15" class="comment-form__text-input"
                    placeholder="Текст отзыва" minlength="8" spellcheck="true" required></textarea>
                    <!-- <p class="error-message"></p> -->
                </div>
                <div class="review-form__btn">
                    <input class="review-form__btn-text" type="submit" name="sendReview" id="btnSendReview"
                    value="Отправить">
                </div>
            </form>
        </div>
        `;

    } else {
        // Если пользователь не авторизован, отрисовываем кнопку открытия модалки авторизации
        formTemplate = `
        <div class="review-form__container" id="reviewContainer">
            <h2 class="review-form__title">Вы не вошли на сайт</h2>
            <p class="review-form__text">Авторизуйтесь, чтобы оставить отзыв</p>
            <button class="review-form__auth-redirect-btn btn" id="goToAuthModal">Перейти к форме авторизации</button>
        </div>
        `;
    }

    reviewFormContainer.innerHTML = formTemplate;

    if (client) {
        // Добавляем слушатель события на форму отправки отзыва
        reviewForm.addEventListener("submit", (e) => {
            e.preventDefault(); //отмена отправки
            getDataFromReviewForm();

        // TODO написать валидацию полей
        });
    } else {
        // Добавляем слушатель события на кнопку открытия модалки авторизации
        const goToAuthModalBtn = document.querySelector("#goToAuthModal");
        goToAuthModalBtn.addEventListener("click", showAlertNeedRegistration);
    }
}

getPosts();
getComments();
renderReviewForm();