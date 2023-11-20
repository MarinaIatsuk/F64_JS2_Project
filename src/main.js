//Основная логика сайта. Если используем функции, переменные или другие элементы с других файлов, импорт элемента прописываем так: import {название элемента(функции/переменной)} from 'путь'. 
//Пример: import{btn} from './vars.js'. 

//П.с.: если несколько переменных или несколько функций хотим импортировать, то название можно указать через запятую в {}. 
//Пример импорта переменных: import{btn, container} from './vars.js' 
//Пример импорта функций import{one, two} from './function.js'
// Важно! Не смешиваем переменные и функции. Функции с функциями, переменные с переменными




//главная страница

const upperPosters = document.getElementById('upper-posters');
const downPosters = document.getElementById('down-posters');

const div = document.createElement('div');
const divTwo = document.createElement('div');

fetch('https://kinopoiskapiunofficial.tech/api/v2.2/films/collections?type=TOP_POPULAR_ALL&page=1', {
  method: 'GET',
  headers: {
    'X-API-KEY': '24b15cb0-02d2-47d4-83c9-c601d49f2256',
    'Content-Type': 'application/json',
  },
})
  .then(response => response.json())
  .then((data) => {
    //переменные в которых храним данные к конкретным фильмам
    const movieOne = data.items[1];
    const movieTwo = data.items[2];
    const movieThree = data.items[5];
    const movieFour = data.items[6];

    //console.log(movieOne,movieTwo,movieThree,movieFour);

    const html = `

  <div class="poster-info post-one">
  <a href=""><img class="film-img" src="${movieOne.posterUrl}" alt="film"></a>
     <div class="film-title-wrapper"><p class="film-title">${movieOne.nameRu}</p></div>
  </div>

  <div class="poster-info">
  <a href=""><img class="film-img" src="${movieTwo.posterUrl}" alt="film"></a>
    <div class="film-title-wrapper"><p class="film-title">${movieTwo.nameRu}</p></div>
  </div>`;


    const htmlTwo = `

  <div class="poster-info post-one">
  <a href=""><img class="film-img" src="${movieThree.posterUrl}" alt="film"></a>
    <div class="film-title-wrapper"><p class="film-title">${movieThree.nameRu}</p></div>
  </div>

  <div class="poster-info">
  <a href=""><img class="film-img" src="${movieFour.posterUrl}" alt="film"></a>
    <div class="film-title-wrapper"><p class="film-title">${movieFour.nameRu}</p></div>
  </div>`
      ;

    div.innerHTML = html;
    upperPosters.appendChild(div);

    divTwo.innerHTML = htmlTwo;
    downPosters.appendChild(divTwo);
  })
  .catch((err) => {
    console.log(err);
  })

//curl -X 'GET' \
//'https://kinopoiskapiunofficial.tech/api/v2.2/films/collections?type=TOP_POPULAR_ALL&page=1' \
//-H 'accept: application/json'

