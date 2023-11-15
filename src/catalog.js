document.addEventListener('DOMContentLoaded', function () {
    // Обработчик события клика на кнопку поиска
    document.querySelector(".btn").addEventListener("click", getData); 

// Функция для выполнения запроса к API
async function getData() {
    const genre = document.getElementById("genre").value;
    const country = document.getElementById("country").value;
    const movieSerial = document.getElementById("movie-serial").value;

    try {
        const response = await fetch(`https://kinopoiskapiunofficial.tech/api/v2.2/films?countries=${country}&genres=${genre}&order=RATING&type=${movieSerial}&ratingFrom=0&ratingTo=10&yearFrom=1000&yearTo=3000&page=1`, {
            method: "GET",
            headers: {
                'content-type': "application/json",
                "X-API-KEY": "4cb59c01-681c-4c05-bed7-5b173e7511c3",
            },
        });
        const data = await response.json();
        console.log(data);
        updateContainer(data)
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

function updateContainer(data) {
    // Очищаем предыдущие данные
    const container = document.querySelector(".container__content");
    container.textContent = "";   /* container.innerHTML = ""; для новых данных, а не для полного очищения контейнера. Более безопасно  container.textContent */

    // Проходимся по массиву фильмов и добавляем информацию в контейнер
    data.items.forEach((film) => {
        const item = document.createElement("div");
        item.classList.add("content__item");
             const template = 
        `
        <div class="content__poster">
                    <img src=" ${film.posterUrlPreview}" alt="poster" class="poster__img">
                    </div>
                    <div class="content__info">
                        <div class="content__title">Название: ${film.nameRu}</div>
                        <div class="content__year">Год выхода фильма: ${film.year}</div>
                        <div class="content__rating">Рейтинг по кинопоиску: ${film.ratingKinopoisk}</div>
                
         <div class="filmFavContainer">
          <button  class="likeBtn">
            <span  class="likeIcon"></span>
          </button>
        </div>
                    </div>
        `
        item.innerHTML = template;
        container.appendChild(item);
    });


// выбираем все лайки
    let selectedLike;
    const likeBtns = document.querySelectorAll('.likeBtn');
    likeBtns.forEach((btn) => {
      btn.addEventListener('click', function (event) {
        let target = event.target; //это «целевой» элемент, на котором произошло событие
               if (target.tagName === 'SPAN') { 
          putLike(target);
        }
      });
    });
//лайкаем и добавляем в избранное
    function putLike(span) {
      span.classList.toggle('liked');




    }
  }
});

