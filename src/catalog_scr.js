// Обработчик события клика на кнопку поиска
document.querySelector(".btn").addEventListener("click", getData);

// Функция для выполнения запроса к API и обновления контейнера
async function getData() {
    try {
        // Получаем значения выбранных опций фильтра
        const genre = document.getElementById("genre").value;
        const year = document.getElementById("year").value;
        const raiting = document.getElementById("raiting").value;
        const country = document.getElementById("country").value;
        const movieSerial = document.getElementById("movie-serial").value;

        // Формируем URL запроса с учетом выбранных параметров фильтра
        const apiUrl = `https://kinopoiskapiunofficial.tech/api/v2.2/films?order=RATING&type=ALL&ratingFrom=0&ratingTo=10&yearFrom=1000&yearTo=3000&page=1&genre=${genre}&year=${year}&raiting=${raiting}&country=${country}&movieSerial=${movieSerial}`;

        // Отправляем запрос к API
        const response = await fetch(apiUrl, {
            method: "GET",
            headers: {
                'content-type': "application/json",
                "X-API-KEY": "4cb59c01-681c-4c05-bed7-5b173e7511c3",
            },
        });

        // Парсим ответ в формате JSON
        const data = await response.json();
        console.log(data);

        // Здесь вы можете обработать полученные данные и обновить интерфейс
        // Например, вы можете отобразить список фильмов в соответствии с выбранными параметрами фильтра

    } catch (error) {
        console.error("Error fetching data:", error);
    }
}



// // Получаем значения выбранных опций фильтра
// const genre = document.getElementById("genre").value;
// const year = document.getElementById("year").value;
// const raiting = document.getElementById("raiting").value;
// const country = document.getElementById("country").value;
// const movieSerial = document.getElementById("movie-serial").value;

// // Обработчик события клика на кнопку поиска
// document.querySelector(".btn").addEventListener("click", getData);

// // Функция для выполнения запроса к API и обновления контейнера
// async function getData() {

//     try {
//         // Отправляем запрос к API
//         const response = await fetch(`https://kinopoiskapiunofficial.tech/api/v2.2/films?order=RATING&type=ALL&ratingFrom=0&ratingTo=10&yearFrom=1000&yearTo=3000&page=1`, {
//             method: "GET",
//             headers: {
//                 'content-type': "application/json",
//                 "X-API-KEY": "4cb59c01-681c-4c05-bed7-5b173e7511c3",
//             },
//         });

//         // Парсим ответ в формате JSON
//         const data = await response.json();
//         console.log(data);
//         // // Обновляем контейнер с данными
//         // updateContainer(data.data);
//     } catch (error) {
//         console.error("Error fetching data:", error);
//     }
// }
// function getGenre() {
//     if (genre==='comedy') {
        
//     } else {
        
//     }
// }

// // Функция для обновления контейнера с данными
// function updateContainer(data) {
//     // Очищаем предыдущие данные
//     const container = document.querySelector(".container__content");
//     container.innerHTML = "";

//     // Проходимся по массиву фильмов и добавляем информацию в контейнер
//     data.films.forEach((film) => {
//         const item = document.createElement("div");
//         item.classList.add("content__item");

//         // Создаем элементы для постера, информации и т.д.
//         const poster = document.createElement("div");
//         poster.classList.add("content__poster");
//         // Добавьте код для установки изображения постера

//         const info = document.createElement("div");
//         info.classList.add("content__info");

//         const title = document.createElement("div");
//         title.classList.add("content__title");
//         title.textContent = film.name;

//         const year = document.createElement("div");
//         year.classList.add("content__year");
//         year.textContent = `Год: ${film.year}`;

//         const description = document.createElement("div");
//         description.classList.add("content__descriptione");
//         description.textContent = film.description;

//         // Добавляем созданные элементы в контейнер
//         info.appendChild(title);
//         info.appendChild(year);
//         info.appendChild(description);

//         item.appendChild(poster);
//         item.appendChild(info);

//         container.appendChild(item);
//     });
// };