//главная страница
//Получаем переменные из файла vars.js
import{upperPosters, downPosters, div, divTwo} from "./vars";

//Создаем функцию fetch с api адресом

fetch('https://kinopoiskapiunofficial.tech/api/v2.2/films/collections?type=TOP_POPULAR_ALL&page=1', {
    method: 'GET',
    headers: {
        'X-API-KEY': '24b15cb0-02d2-47d4-83c9-c601d49f2256',
        'Content-Type': 'application/json',
    },
})
    .then(response => response.json())
    .then((data) => {

        //Выводим рандомно первый фильм
        const massiveOne = data.items;
        const randomIndexOne = Math.floor(Math.random() * massiveOne.length);
        const randomElementOne = massiveOne[randomIndexOne];
        console.log(randomElementOne);

        //Выводим рандомно второй фильм

        const massiveTwo = data.items;
        const randomIndexTwo = Math.floor(Math.random() * massiveTwo.length);
        const randomElementTwo = massiveTwo[randomIndexTwo];
        console.log(randomElementTwo);

        //Выводим рандомно третий фильм

        const massiveThree = data.items;
        const randomIndexThree = Math.floor(Math.random() * massiveThree.length);
        const randomElementThree = massiveTwo[randomIndexThree];
        console.log(randomElementThree);

        //Выводим рандомно четвертый фильм

        const massiveFour = data.items;
        const randomIndexFour = Math.floor(Math.random() * massiveFour.length);
        const randomElementFour = massiveTwo[randomIndexFour];
        console.log(randomElementFour);
        console.log(randomElementThree.kinopoiskId);
        console.log(randomElementFour.kinopoiskId);

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
        console.log(err);
    })

