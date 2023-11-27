//главная страница
//Получаем переменные из файла vars.js
import { upperPosters, downPosters, div, divTwo, } from "./vars";

// получаем переменные для кнопки и блока выводы Цитат из vars.js
import { blockTextQuote, button } from "./vars";

import { quotes } from "./quotes";

//Создаем функцию fetch с api адресом

window.addEventListener('load', function () {
  const randomPage = Math.floor(Math.random() * 30);
  fetch(`https://kinopoiskapiunofficial.tech/api/v2.2/films/collections?type=TOP_POPULAR_ALL&page=${randomPage}`, {
    method: 'GET',
    headers: {
      'X-API-KEY': 'efb74c12-361f-4478-a2aa-d7214dd21813',
      'Content-Type': 'application/json',
    },
  })
    .then(response => response.json())
    .then((data) => {
      //Выводим рандомно первый фильм
      const massiveOne = data.items;
      const randomIndexOne = Math.floor(Math.random() * (4 - 0) + 0);
      const randomElementOne = massiveOne[randomIndexOne];

      //Выводим рандомно второй фильм

      const massiveTwo = data.items;
      const randomIndexTwo = Math.floor(Math.random() * (9 - 5) + 5);
      const randomElementTwo = massiveTwo[randomIndexTwo];

      //Выводим рандомно третий фильм

      const massiveThree = data.items;
      const randomIndexThree = Math.floor(Math.random() * (14 - 10) + 10);
      const randomElementThree = massiveTwo[randomIndexThree];

      //Выводим рандомно четвертый фильм

      const massiveFour = data.items;
      const randomIndexFour = Math.floor(Math.random() * (massiveOne.length - 15) + 15);
      const randomElementFour = massiveTwo[randomIndexFour];

      //html код для рандомных постеров при загрузке страницы    

      const html = `

  <div class="poster-info post-one">
  <img class="film__img" src="${randomElementOne.posterUrl}" alt="film">
     <div class="film__title-wrapper"><a href="/page-movie.html?id=${randomElementOne.kinopoiskId}" class="film__title">${randomElementOne.nameRu}</a></div>
    
     </div>

  <div class="poster-info">
  <img class="film__img" src="${randomElementTwo.posterUrl}" alt="film">
    <div class="film__title-wrapper"><a href="/page-movie.html?id=${randomElementTwo.kinopoiskId}"  class="film__title">${randomElementTwo.nameRu}</a></div>
   
    </div>`;

      const htmlTwo = `

  <div class="poster-info post-one">
  <img class="film__img" src="${randomElementThree.posterUrl}" alt="film">
    <div class="film__title-wrapper"><a href="/page-movie.html?id=${randomElementThree.kinopoiskId}"  class="film__title">${randomElementThree.nameRu}</a></div>
    
    </div>

  <div class="poster-info">
  <img class="film__img" src="${randomElementFour.posterUrl}" alt="film">
    <div class="film__title-wrapper"><a href="/page-movie.html?id=${randomElementFour.kinopoiskId}" class="film__title">${randomElementFour.nameRu}</a></div>
    
  </div>`
        ;
      //помещаем html код в div

      div.innerHTML = html;
      upperPosters.appendChild(div);

      divTwo.innerHTML = htmlTwo;
      downPosters.appendChild(divTwo);
    })
    .catch((err) => {
      console.log("Ошибка загрузки:", err);
    });

});




//<-------- Для цитат ---->

// получить случайное целое число
function randomInt(max) {
  return Math.floor(Math.random() * max);
}

// задержка в мс
async function delay(x) {
  return new Promise(res => setTimeout(res, x));
}

// вывести цитату
async function printq(q) {
  for (let i = 0; i < q.length; i++) {
    blockTextQuote.textContent += q[i];
    await delay(50);
  }
}

// менять цитаты случайно
async function type() {
  while (true) {
    blockTextQuote.textContent = "";
    let quote = quotes[randomInt(quotes.length)];
    await printq('« ' + quote.quote + '» ' + quote.film);
    await delay(1000 + randomInt(2000));// случайная задержка между цитатами
  }
}

type();