//import "../page-film.html";
import "./db";
import * as db from './db';
import { setLike, showAlertNeedRegistration } from './functions'

let TYPE_FILM;
let SELECTEDFILMID = new URLSearchParams(window.location.search).get('id');
import "./reviews";

document.addEventListener("DOMContentLoaded", async function () {



  // получает данные о фильме по ID
  try {
    const response = await fetch(`https://kinopoiskapiunofficial.tech/api/v2.2/films/${SELECTEDFILMID}`, {
      method: 'GET',
      headers: {
        'X-API-KEY': '94ca834b-5c22-427c-af84-610eb7685d60', //tech
        'Content-Type': 'application/json',
      },
    });
    const dataMovie = await response.json();
    TYPE_FILM = dataMovie.serial;
    ShowPageMovie(dataMovie);
  }
  catch (error) {
    console.error("Error fetching data:", error);
  }
  try {
    const response2 = await fetch(`https://kinopoiskapiunofficial.tech/api/v1/staff?filmId=${SELECTEDFILMID}`, {
      method: 'GET',
      headers: {
         'X-API-KEY': '71366ccb-2bd6-4045-b47f-fb75863ae604', //tech2
        'Content-Type': 'application/json',
      },
    });
    const dataStaff = await response2.json();
   ShowStaffMovie(dataStaff);
  }
  catch (error) {
    console.error("Error fetching data:", error);
  }
  if (TYPE_FILM == false) {
    try {
      const response3 = await fetch(`https://kinopoiskapiunofficial.tech/api/v2.2/films/${SELECTEDFILMID}/similars`, {
        method: 'GET',
        headers: {
           'X-API-KEY': '8f24ccbd-b43e-481c-914d-439866b4c2a9',//tech3
          'Content-Type': 'application/json',
        },
      });
      const dataSimilarMovies = await response3.json();
      ShowSimilarMovies(dataSimilarMovies);
    }
    catch (error) {
      console.error("Error fetching data:", error);
    }
  }
  else {
    try {
      const response3 = await fetch(`https://kinopoiskapiunofficial.tech/api/v2.2/films/${SELECTEDFILMID}/similars`, {
        method: 'GET',
        headers: {
           'X-API-KEY': '8f24ccbd-b43e-481c-914d-439866b4c2a9',//tech3
          'Content-Type': 'application/json',
        },
      });
      const dataSimilarMovies = await response3.json();
      ShowSimilarMovies(dataSimilarMovies);
    }
    catch (error) {
      console.error("Error fetching data:", error);
    }

    try {
      const response4 = await fetch(`https://kinopoiskapiunofficial.tech/api/v2.2/films/${SELECTEDFILMID}/seasons`, {
        method: 'GET',
        headers: {
           'X-API-KEY': '93a0d256-5519-4fe4-baf9-8f7b6109ae42',//tech4
          'Content-Type': 'application/json',
        },
      });
      const dataSeasons = await response4.json();
       ShowSeason(dataSeasons);
    }
    catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  try {
    const response5 = await fetch(`https://kinopoiskapiunofficial.tech/api/v2.2/films/${SELECTEDFILMID}/external_sources?page=1`, {
      method: 'GET',
      headers: {
         'X-API-KEY': 'efb74c12-361f-4478-a2aa-d7214dd21813', //tech5
        'Content-Type': 'application/json',
      },
    });
    const dataSources = await response5.json();
    ShowSources(dataSources);
  }
  catch (error) {
    console.error("Error fetching data:", error);
  }
})

async function getLikesFromDB() {
  let beLike = false;
  const clientId = window.localStorage.getItem('client');
  if(clientId!=null)
  {
  const userId = JSON.parse(clientId).id;
  let user = await db.get("users", userId);
  let likes = user.likes;
  let likesInBD = likes[SELECTEDFILMID];
  beLike = likesInBD ? likesInBD : false;
  }
  return beLike;
}

async function ShowPageMovie(data) {

  let setLike = await getLikesFromDB();
  let allCountry = "";
  let firstCounrty = true;
  let comma = "";
  const nameRu = document.querySelector('.name-ru');
  const nameEn = document.querySelector('.name-en');
  const nameOriginal = document.querySelector('.name-original');
  const poster = document.querySelector('.block-movie__poster');
  const ratingAgeLimit = document.querySelector('.block-movie__rating-age-limit');
  const ratingKinopoisk = document.querySelector('.block-movie__rating-kinopoisk');
  const startYear = document.querySelector('.start-year');
  const filmLength = document.querySelector('.film-length');
  const about = document.querySelector('.about');
  const countries = document.querySelector('.countries');
  const genres = document.querySelector('.genres');
  const description = document.querySelector('.description');
  const slogan = document.querySelector('.slogan');

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
  const btnLike = document.querySelector('.likeIcon');
  SetLikeAndChackReg();
  if (setLike)
    btnLike.classList.add('liked');

  startYear.textContent = data.year;
  if (data.filmLength !== null)
    filmLength.textContent = String(data.filmLength) + " мин.";
  else filmLength.setAttribute("class", "no-visible");

  if (data.slogan !== null)
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
  const director = document.querySelector('.director');
  const actor = document.querySelector('.actor');
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
  }
}


function ShowSimilarMovies(data) {
  const titleSimilarMovies = document.querySelector('.similar-movies__title');
  if (data.items.length !== 0) {

    if (TYPE_FILM == false)
      titleSimilarMovies.textContent = "Похожие фильмы";
    else
      titleSimilarMovies.textContent = "Похожие сериалы";

    let similarMovies = document.querySelector('.similar-movies');
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
      newBtn.textContent = "Еще похожие";
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
            newBtn.textContent = "Еще похожие";
          else
            newBtn.textContent = "Скрыть";
        }
      });

    }
  }
  else {
    titleSimilarMovies.textContent = "";
    const similarMovies = document.querySelector('.similar-movies');
    similarMovies.classList.toggle("no-visible");
  }
}

function ShowSeason(data) {
  if (data.items.length !== 0) {
    const seasonsWrapper = document.querySelector('.block-movie__seasons-wrapper');
    seasonsWrapper.classList.toggle("no-visible");
    const seasonsParent = document.getElementById('seasons');
    let foundSeasons, newDivSeason, newDivEpisod, newDivTitleEpisod, episode, detailsSeason, divWrapper, divWrapper2;
    for (let index = 0; index < data.items.length; index++) {
      foundSeasons = data.items[index];
      detailsSeason = document.createElement('details');
      newDivSeason = document.createElement('summary');
      newDivSeason.classList.add("titleSeason")
      newDivSeason.textContent = "СЕЗОН " + Number(index + 1);
      detailsSeason.append(newDivSeason);
      divWrapper = document.createElement('div');
      divWrapper.classList.add('episod-container');
      detailsSeason.append(divWrapper);

      for (let i = 0; i < foundSeasons.episodes.length; i++) {
        episode = foundSeasons.episodes[i];
        divWrapper2 = document.createElement('div');
        divWrapper2.classList.add('episod-wrapper');
        newDivEpisod = document.createElement('div');
        newDivEpisod.classList.add('title-episod');
        newDivEpisod.textContent = `СЕРИЯ ${Number(i + 1)}. ${episode.nameRu ? episode.nameRu : episode.nameEn ? episode.nameEn : ""}`;
        divWrapper2.append(newDivEpisod);
        newDivTitleEpisod = document.createElement('p');
        newDivTitleEpisod.classList.add('episod');
        newDivTitleEpisod.textContent = `${episode.synopsis ? episode.synopsis : ""}`;
        divWrapper2.append(newDivTitleEpisod);
        divWrapper.append(divWrapper2);
      }
      seasonsParent.append(detailsSeason);
    }
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
      newLink.setAttribute("target", "_blank");
      externalSources.append(newLink);
      newLink.append(newImg);
      if (index == 4) { break }
    }
  }
  else {
    const movieSources = document.querySelector('.movie-sources');
    movieSources.classList.toggle("no-visible");
  }
}

function SetLikeAndChackReg()
{
document.querySelector(".likeBtn").addEventListener("click", function (event) {

  event.preventDefault();
  showAlertNeedRegistration();  // Проверка авторизации
  const likeIcon = document.querySelector(".likeIcon");

  const objLS = window.localStorage.getItem('client');
  const accessObj = JSON.parse(objLS).id;


    likeIcon.classList.toggle('liked'); // Меняем класс на "Лайк"
    setLike(accessObj, SELECTEDFILMID, likeIcon.classList.contains('liked')); //добавляем в БД в зависимости от наличия класса 'liked'

});
}


