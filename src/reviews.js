import "./reviews-tabs";

// Функция создания разметки поста с рецензией
// (получает на вход объект поста и возвращает строку HTML-разметки)
function createPostMarkup(post) {
    let typeOfReview;
    if (post.type == "POSITIVE") {
        typeOfReview = "review-post_type_positive";
    } else if (post.type == "NEGATIVE") {
        typeOfReview = "review-post_type_negative";
    } else {
        typeOfReview = "review-post_type_neutral";
    }
    const template = `
    <article class="review-post ${typeOfReview}">
        <h3 class="review-post__title">${post.title}</h3>
        <p class="review-post__body">${post.description}</p>
        <div class="review-post__usefulness usefulness">
            <div class="usefulness__positive">Полезно ${post.positiveRating}</div>
            <div class="usefulness__negative">Нет ${post.negativeRating}</div>
        </div>
    </article>
    `;
    return template;
}

// Функция добавления разметки в контейнер
function addMarkupToContainer(markup, container) {
    container.innerHTML += markup;
}

// Функция добавления кол-ва отзывов в контейнер
function addTotalToContainer(posts, container) {
    const totalContainer = document.createElement("div");
    totalContainer.classList.add("block-reviews__total-wrapper", "total");
    const totalReviwesTemplate = `
    <div class="reviews-container__total-wrapper total">
        <div class="total__count count-text">Всего<span class="count-number count-number_type_all">${posts.total}</span></div>
        <div class="total__positive count-text">Положительные<span class="count-number count-number_type_positive">${posts.totalPositiveReviews}</span></div>
        <div class="total__neutral count-text">Нейтральные<span class="count-number count-number_type_neutral">${posts.totalNeutralReviews}</span></div>
        <div class="total__negative count-text">Отрицательные<span class="count-number count-number_type_negative">${posts.totalNegativeReviews}</span></div>
    </div>
    `;
    container.before(totalContainer);
    totalContainer.innerHTML = totalReviwesTemplate;
}

// Функция, которая делает GET-запрос и добавляет посты на страницу
async function getPosts() {
    try {
        const selectedFilmId = window.localStorage.getItem("selectedFilmId");
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

// Функции открытия и закрытия модального окна для отзыва

// const btnOpenReviewModal = document.querySelector("#btnOpenReviewModal");
const btnOpenReviewModal = document.querySelector(".tabs__title-wrapper_btn");
// const reviewModal = document.querySelector("#reviewModal");
const btnCloseReviewModal = document.querySelector("#btnCloseReviewModal");

function openReviewModal() {
    window.reviewModal.showModal();
}

function closeReviewModal() {
    window.reviewModal.close();
}

btnOpenReviewModal.addEventListener("click", openReviewModal);
btnCloseReviewModal.addEventListener("click", closeReviewModal);

getPosts();