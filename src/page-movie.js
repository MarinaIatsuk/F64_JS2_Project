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
      // let shortDescription = document.querySelector('.shortDescription');

      nameRu.textContent = json.nameRu;
      nameEn.textContent = json.nameEn;
      nameOriginal.textContent = json.nameOriginal;
      if (json.ratingAgeLimits != null)
        ratingAgeLimit.setAttribute('src', `../assets/images/${json.ratingAgeLimits}.png`);
      else
        ratingAgeLimit.setAttribute('class', 'no-visible');
      poster.setAttribute('src', json.posterUrl);
      ratingKinopoisk.textContent = json.ratingKinopoisk;
      startYear.textContent = json.year;
      if (json.filmLength != null)
        filmLength.textContent = String(json.filmLength) + " мин.";
      else
        filmLength.setAttribute('class', 'no-visible');

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
        newImg.setAttribute("class", "small-pict");
        console.log(newImg.src);
      }
    })



  fetch(`https://kinopoiskapiunofficial.tech/api/v2.2/films/${selectedFilmId}/similars`, {
    method: 'GET',
    headers: {
      'X-API-KEY': '94ca834b-5c22-427c-af84-610eb7685d60', //tech
      // 'X-API-KEY': 'JWBSX1Y-7D8MD39-HFKN9R9-W9BF62Z',     //DEV
      'Content-Type': 'application/json',
    },
  })
    .then(res => res.json())
    .then(json => {
      if (json.items.length !== 0) {
        const parentElement = document.getElementById('posters-contanier');
        let foundSimilarMovies;
        let newDiv, newDiv2, newDiv3, newDiv4;
        for (let index = 0; index < json.items.length; index++) {
          foundSimilarMovies = json.items[index];
          newDiv = document.createElement('img');
          newDiv.src = foundSimilarMovies.posterUrl;
          parentElement.append(newDiv);
          newDiv.setAttribute("class", "small-pict");
          if (index == 5) { break }
        }
      }
      else{
        let similarMovies = document.querySelector('.similar-movies');
        similarMovies.setAttribute("class", "no-visible");

      }
    })
    .catch(err => console.log(err))

});
