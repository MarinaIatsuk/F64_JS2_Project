//const API_KEY = "6e01b98a-32ba-41c9-b64f-a2a9582aafa5";
//const url = 
//"https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword=movie&page=1";


const door = document.querySelector(".exit__img"); //дверь
const exitText = document.querySelector(".exit__text"); //текст возле двери
const enter = document.querySelector('.account__btn'); //кнопка входа
const clientId = window.localStorage.getItem('client');

const blockEnter = document.querySelector('.account__enter');//доступ к контейнеру кнопки Войти
const btnOpenBurger = document.querySelector('#btnOpenBurger');
const personalAccount = document.querySelector('#personalAccount');
// const hiUser = document.querySelector(".account__greeting"); //текст приветствия


const hiUserTextBlock = document.querySelector('.account__personal')// доступ к блоку Имя юзера + аватар

const exitLsText = document.querySelector('.account__exit');//доступ к тексту Выйти и его аватар( картинка двери)
const avatar = document.querySelector(".account__avatar"); //аватар
const filter = document.querySelector(".search__input"); //инпут
const list = document.querySelector(".search__list");//список фильмов 
const burgerExit = document.querySelector(".burger-menu__exit");

burgerMenu('.burger-menu');
if (clientId === null) {
    btnOpenBurger.style.display = "flex";
    personalAccount.style.display = 'none';
    burgerExit.style.display = 'none';
}
else {
    personalAccount.style.display = "flex";
    btnOpenBurger.style.display = 'none';
    burgerExit.style.display = "flex";
}

let FILMS = [];

filter.addEventListener("input", (event) => {
    const keyword = event.target.value.toLowerCase(); //var уже не используется в JS
    fetch(`https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword=${encodeURIComponent(keyword)}&page=1`, {
        method: "GET",
        headers: {
            "X-API-KEY": "6e01b98a-32ba-41c9-b64f-a2a9582aafa5",
            "Content-Type": "application/json",
        },
    })
        .then((res) => res.json())
        .then((data) => {

            list.innerHTML = "";

            data.films.forEach((film) => {
                if (film.filmId !== undefined && film.filmId !== null) {
                    let filmName;
                    filmName = film.nameRu;
                    // Если у фильма нет русского названия
                    if (film.nameRu === undefined && film.nameEn !== undefined) {
                        filmName = film.nameEn;
                    }
                    const li = document.createElement("li");
                    const template = `<a href="page-movie.html?id=${film.filmId}" class="list__link">${filmName}</a>`;
                    li.classList.add('list__item');
                    li.innerHTML = template;
                    list.appendChild(li);
                }
            

                // Показать или скрыть список в зависимости от наличия результатов
                // const searchList = document.querySelector(".header__search-list");
                list.style.display = data.films.length > 0 ? "block" : "none";
                // скрыть список при клике на поле
                document.addEventListener("click", (event) => {

                    if (!event.target.closest(".search__input") && !event.target.closest(".search__list")) {
                        list.style.display = "none";
                    }
                });
            });
        })
        .catch((err) => console.log(err));
});

//Работа с элементами ЛК:
const objLS = window.localStorage.getItem('client'); // Получение id клиента
const accessObj = JSON.parse(objLS); // Парсим, чтобы получить id




//Выхлд из ЛК
door.addEventListener('click', exit) //можно функцию отдельно указывать, думаю, так удобней
burgerExit.addEventListener('click', exit);

function exit() {

    window.localStorage.removeItem('client') //удалили в хранилище локальном инфу о клиенте
    blockEnter.style.display = "flex"; //делаем его  видимым.
    btnOpenBurger.style.display = "flex";
    burgerExit.style.display = 'none';
    personalAccount.style.display = 'none';
    hiUserTextBlock.style.display = "none";
    exitLsText.style.display = 'none';


    // если user вышел, находясь в личном кабинете, то его выбросит на главную страницу
    if (window.location.href.includes('personalaccount.html')) {
        window.open(window.location.protocol + '//' + window.location.host + '/', '_self');
    }
}




//выход в ЛК при клике на аватар
avatar.addEventListener('click', enterAccount)

function enterAccount() {
    const targetPageURL = 'personalaccount.html';
    window.location.href = targetPageURL
}



function burgerMenu(selector) {
    let menu = document.querySelector(selector);
    let button = menu.querySelector('.burger-menu__button', '.burger-menu__lines');
    let links = menu.querySelectorAll('.burger-menu__link');
    let overlay = menu.querySelector('.burger-menu__overlay');

    button.addEventListener('click', (e) => {
        e.preventDefault();
        toggleMenu();
    });

    links.forEach(link => {
        link.addEventListener('click', () => toggleMenu());
    });
    overlay.addEventListener('click', () => toggleMenu());

    function toggleMenu() {
        menu.classList.toggle('burger-menu__active');

        if (menu.classList.contains('burger-menu__active')) {
            // document.body.style.overflow = 'hidden';
            document.body.classList.add("toggle-hidden")
            document.body.classList.remove("toggle-visible")
        } else {
            // document.body.style.overflow = 'visible';
            // // document.body.style.overflow = 'hidden-x';
            document.body.classList.add("toggle-visible")
            document.body.classList.remove("toggle-hidden")
        }
    }
}