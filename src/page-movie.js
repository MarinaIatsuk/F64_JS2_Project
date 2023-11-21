//import "../page-film.html";
import "./db";
import * as db from './db';
import MD5 from "crypto-js/md5";

document.addEventListener("DOMContentLoaded", async function () {

  let selectedFilmId = new URLSearchParams(window.location.search).get('id');

  // получает данные о фильме по ID
  try {
    const response = await fetch(`https://kinopoiskapiunofficial.tech/api/v2.2/films/${selectedFilmId}`, {
      method: 'GET',
      headers: {
         'X-API-KEY': '94ca834b-5c22-427c-af84-610eb7685d60', //tech
        // 'X-API-KEY': '71366ccb-2bd6-4045-b47f-fb75863ae604', //tech2
        //  'X-API-KEY': '8f24ccbd-b43e-481c-914d-439866b4c2a9',//tech3
        //  'X-API-KEY': '93a0d256-5519-4fe4-baf9-8f7b6109ae42',//tech4
        'Content-Type': 'application/json',
      },
    });
    const dataMovie = await response.json();
    console.log(dataMovie);
    ShowPageMovie(dataMovie);
  }
  catch (error) {
    console.error("Error fetching data:", error);
  }
  try {
    const response2 = await fetch(`https://kinopoiskapiunofficial.tech/api/v1/staff?filmId=${selectedFilmId}`, {
      method: 'GET',
      headers: {
        // 'X-API-KEY': '94ca834b-5c22-427c-af84-610eb7685d60', //tech
         'X-API-KEY': '71366ccb-2bd6-4045-b47f-fb75863ae604', //tech2
        //  'X-API-KEY': '8f24ccbd-b43e-481c-914d-439866b4c2a9',//tech3
        //  'X-API-KEY': '93a0d256-5519-4fe4-baf9-8f7b6109ae42',//tech4
        'Content-Type': 'application/json',
      },
    });
    const dataStaff = await response2.json();
    console.log(dataStaff);
    ShowStaffMovie(dataStaff);
  }
  catch (error) {
    console.error("Error fetching data:", error);
  }

  try {
    const response3 = await fetch(`https://kinopoiskapiunofficial.tech/api/v2.2/films/${selectedFilmId}/similars`, {
      method: 'GET',
      headers: {
        // 'X-API-KEY': '94ca834b-5c22-427c-af84-610eb7685d60', //tech
        // 'X-API-KEY': '71366ccb-2bd6-4045-b47f-fb75863ae604', //tech2
          'X-API-KEY': '8f24ccbd-b43e-481c-914d-439866b4c2a9',//tech3
        // 'X-API-KEY': '93a0d256-5519-4fe4-baf9-8f7b6109ae42',//tech4
        'Content-Type': 'application/json',
      },
    });
    const dataSimilarMovies = await response3.json();
    console.log(dataSimilarMovies);
    ShowSimilarMovies(dataSimilarMovies);
  }
  catch (error) {
    console.error("Error fetching data:", error);
  }

  try {
    const response4 = await fetch(`https://kinopoiskapiunofficial.tech/api/v2.2/films/${selectedFilmId}/external_sources?page=1`, {
      method: 'GET',
      headers: {
        // 'X-API-KEY': '94ca834b-5c22-427c-af84-610eb7685d60', //tech
        // 'X-API-KEY': '71366ccb-2bd6-4045-b47f-fb75863ae604', //tech2
        //  'X-API-KEY': '8f24ccbd-b43e-481c-914d-439866b4c2a9',//tech3
        'X-API-KEY': '93a0d256-5519-4fe4-baf9-8f7b6109ae42',//tech4
        'Content-Type': 'application/json',
      },
    });
    const dataSources = await response4.json();
    console.log(dataSources);
    ShowSources(dataSources);
  }
  catch (error) {
    console.error("Error fetching data:", error);
  }
})

function ShowPageMovie(data) {

  let allCountry = "";
  let firstCounrty = true;
  let comma = "";
  let nameRu = document.querySelector('.name-ru');
  let nameEn = document.querySelector('.name-en');
  let nameOriginal = document.querySelector('.name-original');
  let poster = document.querySelector('.block-movie__poster');
  let ratingAgeLimit = document.querySelector('.block-movie__rating-age-limit');
  let ratingKinopoisk = document.querySelector('.block-movie__rating-kinopoisk');
  let startYear = document.querySelector('.start-year');
  let filmLength = document.querySelector('.film-length');
  let about = document.querySelector('.about');
  let countries = document.querySelector('.countries');
  let genres = document.querySelector('.genres');
  let description = document.querySelector('.description');
  let slogan = document.querySelector('.slogan');

  nameRu.textContent = data.nameRu;
  nameEn.textContent = data.nameEn;
  nameOriginal.textContent = data.nameOriginal;
  if (data.ratingAgeLimits != null)
    ratingAgeLimit.setAttribute(
      "src",
      `../assets/images/${data.ratingAgeLimits}.svg`
    );
  else ratingAgeLimit.setAttribute("class", "no-visible");
  poster.setAttribute("src", data.posterUrl);
  ratingKinopoisk.textContent = data.ratingKinopoisk;
  startYear.textContent = data.year;
  if (data.filmLength != null)
    filmLength.textContent = String(data.filmLength) + " мин.";
  else filmLength.setAttribute("class", "no-visible");

  slogan.textContent = data.slogan;

  for (let i = 0; i < data.countries.length; i++) {
    if (!firstCounrty) {
      comma = ", ";
    }
    allCountry += comma + data.countries[i].country;
    firstCounrty = false;
  }
  countries.textContent = allCountry;
  let allGenres = "";
  let firstGenres = true;
  comma = "";
  for (let i = 0; i < data.genres.length; i++) {
    if (!firstGenres) {
      comma = ", ";
    }
    allGenres += comma + data.genres[i].genre;
    firstGenres = false;
  }
  genres.textContent = allGenres;
  let fullDiscription;
  if (data.serial == false) about.textContent = "О фильме";
  else about.textContent = "О сериале";
  if (data.description !== 0) {
    description.textContent = data.description;
  }
  else description.textContent = data.shotDescription;
}

function ShowStaffMovie(data) {
  let director = document.querySelector('.director');
  let actor = document.querySelector('.actor');
  let allDirectors = "";
  let firstDirector = true;
  let allActors = "";
  let firstActor = true;
  let commaD = ""
  let commaA = "";
  let ActorsPhotos = [];
  const Dir = data.filter(el => el.professionKey == "DIRECTOR")
  const Act = data.filter(el => el.professionKey == "ACTOR")
  const parentElement = document.getElementById('actors-photos');
  let photoActor;
  let newImg;
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

  for (let index = 0; index < ActorsPhotos.length; index++) {
    photoActor = ActorsPhotos[index];
    newImg = document.createElement('img');
    newImg.src = photoActor;
    parentElement.append(newImg);
    newImg.classList.add("tiny-pict");
    console.log(newImg.src);
  }
}


function ShowSimilarMovies(data) {
  if (data.items.length !== 0) {
    const parentElement = document.getElementById('posters-contanier');
    let foundSimilarMovies;
    let newDiv, newLink, newBtn, newBtn2;
    for (let index = 0; index < data.items.length; index++) {
      foundSimilarMovies = data.items[index];
      newLink = document.createElement('a');
      newDiv = document.createElement('img');
      newDiv.src = foundSimilarMovies.posterUrl;
      newLink.setAttribute("href", "/page-movie.html?id=" + foundSimilarMovies.filmId);
      parentElement.append(newLink);
      newLink.append(newDiv);
      newDiv.classList.add("small-pict");
      if (index == 3) { break }
    }
    if (data.items.length >= 4) {
      let showFirst = true;
      const MoreSimilarMovies = document.getElementById('more-posters-contanier');
      const similarMovieBlock = document.querySelector('.similar-movies__container');
      const MoreSimilarMoviesContainer = document.querySelector('.similar-movies__container-wrapper');
      newBtn = document.createElement('button');
      newBtn.textContent = "Показать еще похожие фильмы";
      newBtn.classList.add('btn-more-similar');
      newBtn.classList.add('btn');
      similarMovieBlock.append(newBtn);
      const buttonMore = document.querySelector('.btn-more-similar')
      buttonMore.addEventListener('click', function () {

        if (showFirst) {
          for (let index = 4; index < data.items.length; index++) {
            foundSimilarMovies = data.items[index];
            newLink = document.createElement('a');
            newDiv = document.createElement('img');
            newDiv.src = foundSimilarMovies.posterUrl;
            newLink.setAttribute("href", "/page-movie.html?id=" + foundSimilarMovies.filmId);
            MoreSimilarMovies.append(newLink);
            newLink.append(newDiv);
            newDiv.classList.add("small-pict");
          }
          newBtn.textContent = "Скрыть";
          showFirst = false;
        }
        else {
          MoreSimilarMovies.classList.toggle("no-visible");
          if (MoreSimilarMovies.classList.contains("no-visible"))
            newBtn.textContent = "Показать еще похожие фильмы";
          else
            newBtn.textContent = "Скрыть";
        }
      });

    }
  }
  else {
    let similarMovies = document.querySelector('.similar-movies');
    similarMovies.classList.toggle("no-visible");
  }
}

function ShowSources(data) {
  if (data.items.length !== 0) {
    const externalSources = document.getElementById('external-sources');
    let sourcesMovies;
    let newImg, newLink;
    for (let index = 0; index < data.items.length; index++) {
      sourcesMovies = data.items[index];
      newLink = document.createElement('a');
      newImg = document.createElement('img');
      newImg.classList.add("small-icon")
      newImg.src = sourcesMovies.logoUrl;
      newLink.setAttribute("href", sourcesMovies.url);
      externalSources.append(newLink);
      newLink.append(newImg);
      if (index == 4) { break }
    }
  }
  else{
    let movieSources = document.querySelector('.movie-sources');
    movieSources.classList.toggle("no-visible");
  }
}