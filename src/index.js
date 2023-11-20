// Используем такую схему:

// Создаем новую страницу в папке проекта
// example.html

// Чтобы писать код, создаем в папке src файл
// example.js

// В файле example.html прописываем строчку
// <script type="module" src="./src/example.js"></script>

// В файл example.js импортируем те js-файлы,
// которые относятся к функционалу именно этой страницы
// import "./another";
// import'./catalog';


// Модальное окно на главной странице

const btnOpen = document.querySelector('#btnOpen');//кнопка Войти в хэдэр

const windModal = document.querySelector('#windModal');
const btnClose = document.querySelector('#btnClose');

function openModal() {
    window.windModal.showModal();
}

function closeModal() {
    window.windModal.close();
}


btnOpen.addEventListener('click', openModal);
btnClose.addEventListener('click', closeModal);





// Работа над формой входа

import * as db from './db';
import MD5 from "crypto-js/md5";


const loginForm = document.forms.loginForm;//доступ к форме модального окна

const loginEmail = document.querySelector('#loginEmail');//доступ к input email
const loginPassword = document.querySelector('#loginPassword');//доступ к input пароль
const btnLogin = document.querySelector('#btnLogin');//доступ к кнопке войти

const hiUser = document.querySelector('#hiUser')//приветствие юзера в хэдэр


function lsName() {
    let equallyLs = localStorage.hasOwnProperty("client");// содержит ли локальное хранилище данные о "client"

    if (equallyLs === true) {
        btnOpen.style.display = 'none;';//кнопка войти в хэдэр


        const objLS = window.localStorage.getItem('client');
        const accessObj = JSON.parse(objLS);

        hiUser.innerHTML = `<p class="cont__text-name"> Привет, ${accessObj.name}</p>`;//вместо кнопки войти в хэдэре
    } else {
        btnOpen.style.display = 'flex';
    }

    let login = new URLSearchParams(window.location.search).get('login');//если login=true, то открывается модальное окно
    if (login) openModal();
}

//при загрузке страницы 
window.addEventListener('load', lsName);


// отмена отправки
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
})

const dialogEmailError = document.querySelector('#dialogEmailError'); //доступ к полю ошибки email

const dialogPasswError = document.querySelector('#dialogPasswError'); //доступ к полю ошибки пароля



//проверка есть ли пользователь с таким email и правильно ли введен пароль, если такой пользователь есть
async function examLogin() {
    btnLogin.disabled = true;
    //зашифрованный введенный пароль в форму входа
    let pas = MD5(loginPassword.value).toString();

    const users = await db.get_query("users", "email", loginEmail.value);

    if (users == 0) {
        dialogEmailError.textContent = `Пользователь с таким email не зарегестрирован. Создайте свой аккаунт в форме регистрации`;
    } else {
        if (users[0].password != pas) {
            dialogPasswError.textContent = 'пароль неверный';

        } else {
            console.log('Добро пожаловать');

            let date = new Date().getTime(); // дата в миллисек
            const obj = { id: users[0].id, name: users[0].name, time: date };

            const objJSON = JSON.stringify(obj);
            window.localStorage.setItem('client', objJSON); //добавление в локальное хранилище id клиента и время когда зашел

            window.windModal.close();//закрыть модальное окно

            btnOpen.style.display = 'none;';//кнопка войти в хэдэр

            const objLS = window.localStorage.getItem('client');
            const accessObj = JSON.parse(objLS);

            hiUser.innerHTML = `<p class="cont__text-name"> Привет, ${accessObj.name}</p>`;
        }
    }
    btnLogin.disabled = false;
}

btnLogin.addEventListener("click", examLogin); //клик на Войти в модальном окне





//ДОДЕЛАТЬ Забыли пароль!!!!

// ====================================================================
async function testtt() {
    // setLike(user.id, "film_id", false);
    // setRating(user.id, "film_id", 5);
    // addComment(user.id, user.name, "film_id", "film sucks");
    // const data = {};
    // data[`likes.somefilem`] = true;
    // await db.update("users", "WAdKgR1PYL9r3fzKk03d", data);

};

// функция для добавления и убирания из избранного
// state = true - добавить в избранное
// state = false - убрать из избранного
async function setLike(user_id, film_id, state) {
    let subfield = `likes.${film_id}`;
    if (state) {
        const data = {};
        data[subfield] = true;
        await db.update("users", user_id, data);
    } else {
        await db.removeSubfield("users", user_id, subfield);
    }
}

// функция для установки и изменения рейтинга, value - значение рейтинга
async function setRating(user_id, film_id, value) {
    const film = await db.get("ratings", film_id);
    if (!film) {
        let rating = {};
        rating[user_id] = value;
        await db.set("ratings", film_id, { ratings: rating });  // создал оценку
    } else {
        let data = {};
        data[`ratings.${user_id}`] = value;
        await db.update("ratings", film_id, data);  // изменил оценку
    }
}

// функция для добавления комментария, text - текст комментария
async function addComment(user_id, user_name, film_id, text,title) {
    const data = {};
    data.text = text;
    data.name = user_name;
    data.user_id = user_id;
    data.film_id = film_id;
    data.date = new Date().getTime();
    data.title= title;
    const id = await db.add("comments", data);
    return id;
}

//ПРИМЕР получить рейтинги к фильму
// db.get("ratings", "film").then(r => console.log(r));

//ПРИМЕР получить комментарии к фильму
// db.get_query("comments", "film_id", "film id 123").then(r => console.log(r));


