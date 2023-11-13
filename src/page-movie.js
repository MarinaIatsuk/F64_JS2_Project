//import "../page-film.html";
let movie = {
    // id: 1129900
    // nameRu: "Тихое место 2"
    // naameEn: "A quiet place Part 2"
    // year: "2021"
    // posterURL:""
    // description: "Тут будет краткое описание фильма"
    // countries: [
    //     {
    //       country: "США"
    //     }
    //   ],
    //   genres: [
    //     {
    //       genre: "Триллер"
    //     }
    //   ],
kinopoiskId: 301,
  nameRu: "Матрица",
  nameEn: "The Matrix",
  nameOriginal: "The Matrix",
  posterUrl: "https://kinopoiskapiunofficial.tech/images/posters/kp/301.jpg",
  posterUrlPreview: "https://kinopoiskapiunofficial.tech/images/posters/kp_small/301.jpg",
  coverUrl: "https://avatars.mds.yandex.net/get-ott/1672343/2a0000016cc7177239d4025185c488b1bf43/orig",
  logoUrl: "https://avatars.mds.yandex.net/get-ott/1648503/2a00000170a5418408119bc802b53a03007b/orig",
  reviewsCount: 293,
  ratingGoodReview: 88.9,
  ratingGoodReviewVoteCount: 257,
  ratingKinopoisk: 8.5,
  ratingKinopoiskVoteCount: 524108,
  ratingImdb: 8.7,
  ratingImdbVoteCount: 1729087,
  ratingFilmCritics: 7.8,
  ratingFilmCriticsVoteCount: 155,
  ratingAwait: 7.8,
  ratingAwaitCount: 2,
  ratingRfCritics: 7.8,
  ratingRfCriticsVoteCount: 31,
  webUrl: "https://www.kinopoisk.ru/film/301/",
  year: 1999,
  filmLength: 136,
  slogan: "Добро пожаловать в реальный мир",
  description: "Жизнь Томаса Андерсона разделена на две части:",
  shortDescription: "Хакер Нео узнает, что его мир — виртуальный. Выдающийся экшен, доказавший, что зрелищное кино может быть умным",
  editorAnnotation: "Фильм доступен только на языке оригинала с русскими субтитрами",
  isTicketsAvailable: false,
  productionStatus: "POST_PRODUCTION",
  type: "FILM",
  ratingMpaa: "r",
  ratingAgeLimits: "age16",
  hasImax: false,
  has3D: false,
  lastSync: "2021-07-29T20:07:49.109817",
  countries: [
    {
      "country": "США"
    }
  ],
  genres: [
    {
      "genre": "фантастика"
    }
  ],
  startYear: 1996,
  endYear: 1996,
  serial: false,
  shortFilm: false,
  completed: false
}


// получает данные о фильме по ID
fetch(`https://kinopoiskapiunofficial.tech/api/v2.2/films/id${movie.kinopoiskId}`, {
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
        let massageFindResult = document.getElementById('massageFindResult');
        let nameRu = document.querySelector('.nameRu');
        nameRu.textContent = json.items[0].nameRu
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
            // }

        // }
    })
    .catch(err => console.log(err))

// получает похожие фильмы по ID
// fetch(`https://kinopoiskapiunofficial.tech/api/v2.2/films/id${movie.id}/similars`, {
//     method: 'GET',
//     headers: {
//         'X-API-KEY': '94ca834b-5c22-427c-af84-610eb7685d60', //tech
//         // 'X-API-KEY': 'JWBSX1Y-7D8MD39-HFKN9R9-W9BF62Z',     //DEV
//         'Content-Type': 'application/json',
//     },
// })
//     .then(res => res.json())
//     .then(json => {})
//     .catch(err => console.log(err))