//import "../page-film.html";

document.addEventListener('DOMContentLoaded', function () {

  // Получаем id фильма из localStorage
  const selectedFilmId = localStorage.getItem('selectedFilmId');

  // получает данные о фильме по ID
fetch(`https://kinopoiskapiunofficial.tech/api/v2.2/films/${selectedFilmId}`, {
  method: 'GET',
  headers: {
    'X-API-KEY': '94ca834b-5c22-427c-af84-610eb7685d60', //tech
    // 'X-API-KEY': 'JWBSX1Y-7D8MD39-HFKN9R9-W9BF62Z',     //DEV
    'Content-Type': 'application/json',
  },
})
  .then(res => res.json())
  .then(json => {
    console.log(json)
    let allCountry = "";
    let firstCounrty = true;
    let comma = "";
    let nameRu = document.querySelector('.nameRu');
    let nameEn = document.querySelector('.nameEn');
    let nameOriginal = document.querySelector('.nameOriginal');
    let poster = document.querySelector('.block-movie__poster');
    let ratingAgeLimit = document.querySelector('.block-movie__ratingAgeLimit');
    let ratingKinopoisk = document.querySelector('.block-movie__ratingKinopoisk');
    let startYear = document.querySelector('.startYear');
    let filmLength = document.querySelector('.filmLength');
    let about = document.querySelector('.about');
    let countries = document.querySelector('.countries');
    let genres = document.querySelector('.genres');
    let description = document.querySelector('.description');
    let slogan = document.querySelector('.slogan');
    // let shortDescription = document.querySelector('.shortDescription');

    nameRu.textContent = json.nameRu;
    nameEn.textContent = json.nameEn;
    nameOriginal.textContent = json.nameOriginal;
    ratingAgeLimit.setAttribute('src', `../assets/images/${json.ratingAgeLimits}.png`);
    poster.setAttribute('src', json.posterUrl);
    ratingKinopoisk.textContent = json.ratingKinopoisk;
    startYear.textContent = json.year;
    filmLength.textContent = String(json.filmLength) + " мин.";
    slogan.textContent = json.slogan;
    // shortDescription.textContent = json.shortDescription;

    for (let i = 0; i < json.countries.length; i++) {
      if (!firstCounrty) { comma = ", " }
      allCountry += comma + json.countries[i].country;
      firstCounrty = false;
    }
    countries.textContent = allCountry;
    let allGenres = "";
    let firstGenres = true;
    comma = "";
    for (let i = 0; i < json.genres.length; i++) {
      if (!firstGenres) { comma = ", " }
      allGenres += comma + json.genres[i].genre;
      firstGenres = false;
    }
    genres.textContent = allGenres;

    if (json.serial == false)
      about.textContent = "О фильме";
    else
      about.textContent = "О сериале";
    description.textContent = json.description;
  })
  .catch(err => console.log(err))


fetch(`https://kinopoiskapiunofficial.tech/api/v1/staff?filmId=${selectedFilmId}`, {
  method: 'GET',
  headers: {
    'X-API-KEY': '94ca834b-5c22-427c-af84-610eb7685d60', //tech
    // 'X-API-KEY': 'JWBSX1Y-7D8MD39-HFKN9R9-W9BF62Z',     //DEV
    'Content-Type': 'application/json',
  },
})
  .then(res => res.json())
  .then(json => {
    console.log(json)
    let director = document.querySelector('.director');
    let actor = document.querySelector('.actor');
    let allDirectors = "";
    let firstDirector = true;
    let allActors = "";
    let firstActor = true;
    let commaD = ""
    let commaA = "";
    let ActorsPhotos = [];
    const Dir = json.filter(el => el.professionKey == "DIRECTOR")
    const Act = json.filter(el => el.professionKey == "ACTOR")
    for (let i = 0; i < Dir.length; i++) {
      if (!firstDirector) { commaD = ", " }
      allDirectors += commaD + Dir[i].nameRu;
      firstDirector = false;
      if (i == 3) { break }
    }
    director.textContent = allDirectors;
    for (let i = 0; i < Act.length; i++) {
      if (!firstActor) { commaA = ", " }
      allActors += commaA + Act[i].nameRu;
      ActorsPhotos[i] = Act[i].posterUrl;
      firstActor = false;
      if (i == 4) { break }
    }
    actor.textContent = allActors;
    const parentElement = document.getElementById('actorsPhotos');
    let photoActor;
    let newImg;
    for (let index = 0; index < ActorsPhotos.length; index++) {
      photoActor = ActorsPhotos[index];
      newImg = document.createElement('img');
      newImg.src = photoActor;
      parentElement.append(newImg);
      newImg.setAttribute("class","smallPict");
    }
  })


// получает похожие фильмы по ID
// fetch(`https://kinopoiskapiunofficial.tech/api/v2.2/films/${movie.kinopoiskId}/similars`, {
//     method: 'GET',
//     headers: {
//         'X-API-KEY': '94ca834b-5c22-427c-af84-610eb7685d60', //tech
//         // 'X-API-KEY': 'JWBSX1Y-7D8MD39-HFKN9R9-W9BF62Z',     //DEV
//         'Content-Type': 'application/json',
//     },
// })
//     .then(res => res.json())
//     .then(json => {
// if (json.items.length == 0)
//     massageFindResult.textContent = "В выбранном периоде не было премьер"
// else {
//     massageFindResult.textContent = `В выбранном периоде найдено ${json.items.length} премьер`
// const parentElement = document.getElementById('result');
// let foundPremiere;
// let newDiv,newDiv2,newDiv3,newDiv4;
// for (let index = 0; index < 5; index++) {
//     foundPremiere = json.items[index];
//     newDiv = document.createElement('div');
//     newDiv.textContent = foundPremiere.kinopoiskId;
//     newDiv2 = document.createElement('div');
//     newDiv2.textContent = foundPremiere.nameRu;
//     newDiv3 = document.createElement('div');
//     newDiv3.textContent = foundPremiere.nameEn;
//     newDiv4 = document.createElement('img');
//     newDiv4.src = foundPremiere.posterUrl;
//     parentElement.append(newDiv, newDiv2,newDiv3,newDiv4);
// }})
//     .catch(err => console.log(err))

  // Думаю, стоит чистить localStorage после использования, чтобы он там один был
  localStorage.removeItem('selectedFilmId');
});
