
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
const btnOpenBurger = document.querySelector('#btnOpenBurger');
const personalAccount = document.querySelector('#personalAccount');
const burgerExit = document.querySelector(".burger-menu__exit");

const windModal = document.querySelector('#windModal');
const btnClose = document.querySelector('#btnClose');

function openModal() {
    window.windModal.showModal();
    document.body.classList.add('scroll-lock');//блокирует скрол

    mainForm.style.display = 'flex';//при нажатии на кнопку Войти в хэдэр видна первая форма модального окна
    checkInputSecond.style.display = 'none';//закрыта вторая форма модального окна
    newPass.style.display = 'none';//закрыта третья форма модального окна
    okBlock.style.display = 'none';//закрыта четвертая форма модального окна

    //поля ввода пустые
    loginEmail.value='';
    loginPassword.value='';
}

function closeModal() {
    window.windModal.close();
    document.body.classList.remove('scroll-lock');
}



btnOpen.addEventListener('click', openModal);
btnOpenBurger.addEventListener('click', openModal);
btnClose.addEventListener('click', closeModal);




// Работа над формой входа

import * as db from './db';
import MD5 from "crypto-js/md5";


const loginForm = document.forms.loginForm;//доступ к форме модального окна

const loginEmail = document.querySelector('#loginEmail');//доступ к input email
const loginPassword = document.querySelector('#loginPassword');//доступ к input пароль
const btnLogin = document.querySelector('#btnLogin');//доступ к кнопке войти






const hiUserTextBlock = document.querySelector('.account__personal')// доступ к блоку Имя юзера + аватар

const exitLsText = document.querySelector('.account__exit');//доступ к тексту Выйти и его аватар( картинка двери)

    hiUserTextBlock.style.display = 'none';
    exitLsText.style.display = 'none';

const hiNameUser = document.querySelector('#hiNameUser');//приветствие юзера в хэдэр

const hiUser = document.querySelector('.account__enter');//блок кнопки Войти в хэдэр

btnLogin.disabled = true;//кнопка отправки не активна


function lsName() {
    let equallyLs = localStorage.hasOwnProperty("client");// содержит ли локальное хранилище данные о "client"

    if (equallyLs === true) {

        hiUser.style.display = 'none';//Блок кнопки Войти в хэдэр




        hiUserTextBlock.style.display = 'flex';
        exitLsText.style.display = 'flex';

        // получаем данные client из локального хранилища
        const objLS = window.localStorage.getItem('client');
        const accessObj = JSON.parse(objLS);


        // тут доделать
        hiNameUser.textContent = ` Привет, ${accessObj.name}`;


        let nowDateMs = new Date().getTime();//текущая дата

        //выход из ЛК через месяц
        if (nowDateMs - accessObj.time > 30*24*60*60*1000) {
            window.localStorage.removeItem('client');//удаление локального хранилища если юзера не было больше месяца на сайте
            // btnOpen.style.display = 'flex';
            hiUser.style.display = 'flex';//Блок кнопки Войти в хэдэр
        } else {
            accessObj.time = new Date().getTime();//обновляется время в локальном хранилище если он зашел на сайт раньше, чем автоматический выход из сайта его разлогинил
            window.localStorage.setItem('client', JSON.stringify(accessObj));
        }
    } else {
        hiUser.style.display = 'flex';//Блок кнопки Войти в хэдэр
    }

    let login = new URLSearchParams(window.location.search).get('login');//если login=true, то открывается модальное окно
    if (login && !localStorage.hasOwnProperty("client")) openModal();
}

//при загрузке страницы убрать кнопку Войти
window.addEventListener('load', lsName);


// отмена отправки
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

})


loginEmail.addEventListener('input', checkInput);// слушатель события-активировать кнопку если input почты и пароля не пустые
loginPassword.addEventListener('input', checkInput);//слушатель события-активировать кнопку если input почты и пароля не пустые

//функция- активировать кнопку если input почты и пароля не пустые
function checkInput() {
    btnLogin.disabled = (loginEmail.value == '' || loginPassword.value == '');
}

const dialogEmailError = document.querySelector('#dialogEmailError'); //доступ к полю ошибки email

const dialogPasswError = document.querySelector('#dialogPasswError'); //доступ к полю ошибки пароля



//проверка есть ли пользователь с таким email и правильно ли введен пароль, если такой пользователь есть
async function examLogin() {
    btnLogin.disabled = true;
    //зашифрованный введенный пароль в форму входа
    let pas = MD5(loginPassword.value).toString();

    const users = await db.get_query("users", "email", loginEmail.value);

    if (users.length == 0) {
        dialogEmailError.textContent = `Пользователь с таким email не зарегестрирован. Создайте свой аккаунт в форме регистрации`;
    } else {
        if (users[0].password != pas) {
            dialogPasswError.textContent = 'пароль неверный';

        } else {

            let date = new Date().getTime(); // дата в миллисек
            const obj = { id: users[0].id, name: users[0].name, time: date };

            const objJSON = JSON.stringify(obj);
            window.localStorage.setItem('client', objJSON); //добавление в локальное хранилище id клиента и время когда зашел

            window.windModal.close();//закрыть модальное окно


            hiUser.style.display = 'none';//Блок кнопки Войти в хэдэр
            btnOpenBurger.style.display = 'none';

            burgerExit.style.display = 'flex';
            personalAccount.style.display = 'flex';
            hiUserTextBlock.style.display = 'flex';
            exitLsText.style.display = 'flex';

            const objLS = window.localStorage.getItem('client');
            const accessObj = JSON.parse(objLS);

            hiNameUser.textContent = ` Привет, ${accessObj.name}`;
        }
    }
    btnLogin.disabled = false;
}

btnLogin.addEventListener("click", examLogin); //клик на Войти в модальном окне




const thirdPassword = document.getElementById('thirdPassword');//доступ к input введи новый пароль

const thirdReappassword = document.getElementById('thirdReappassword');//доступ к input повтори пароль


const thirdForm = document.forms.thirdForm;//доступ к форме с новым паролем

const secondEmail = document.querySelector('#secondEmail');//доступ к input email в форме подтверждения кодового слова для замены пароля

const secondSecret = document.querySelector('#secondSecret');//доступ к input Кодовое слово в форме подтверждения кодового слова для замены пароля


const secondBtn = document.querySelector('#secondBtn');//доступ к кнопке с проверкой юзера с кодовым словом
secondBtn.disabled = true;//кнопка отправки не активна в форме с проверкой юзера с кодовым словом


const thirdBtn = document.querySelector('#thirdBtn');//доступ к кнопке в форме с новым паролем
thirdBtn.disabled = true;//кнопка отправки не активна в форме с новым паролем




//проверка всех input в форме с новым паролем
function checkAllPass() {
    let ok = true;


    let re = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

    if(!re.test(thirdPassword.value)) {
        ok = false;
        document.getElementById('thirdPasswordErr').innerHTML = ` Пароль должен: содержать хотя бы одну большую букву, хотя бы одну маленькую букву, хотя бы одну цифру, хотя бы один спецсимвол(!@#$%^&*);`
    }

    //Проверка совпадения паролей

    if (thirdReappassword.value !== thirdPassword.value) {
        thirdReappassword.nextElementSibling.textContent = 'Пароли не совпадают';
        ok = false;
    }

    return ok;
}

thirdForm.addEventListener('submit', (e) => {
    e.preventDefault();//отмена отправки

    checkAllPass();
});


//функция - активировать кнопку если input email и кодовое слово не пустые
function checkInputSecondForm() {
    secondBtn.disabled = (secondEmail.value == '' || secondSecret.value == '');
}

secondEmail.addEventListener('input', checkInputSecondForm);//слушатель события- активировать кнопку если input email и кодовое слово не пустые
secondSecret.addEventListener('input', checkInputSecondForm);//слушатель события- активировать кнопку если input email и кодовое слово не пустые


//функция - активировать кнопку если input Введите новый пароль, повторите пароль не пустые
function checkInputThirdForm() {
    thirdBtn.disabled = (thirdReappassword.value == '' || thirdPassword.value == '');
}


thirdPassword.addEventListener('input', checkInputThirdForm);

thirdReappassword.addEventListener('input', checkInputThirdForm);

const secondEmailErr = document.querySelector('#secondEmailErr');//доступ к ошибка в поле email во второй форме

const secondSecretErr = document.querySelector('#secondSecretErr');//доступ к ошибка в поле Кодовое слово во второй форме


const checkInputSecond = document.querySelector('.check-input');// доступ ко второму блоку class

const newPass = document.querySelector('.new-pass');//доступ к третьему блоку class

const okBlock = document.querySelector('.ok-block');//доступ к четвертому блоку class

const mainForm = document.querySelector('.main-form');//доступ к первому блоку id

const newComeIn = document.querySelector('#newComwIn');

let userPassId = '';


const passwordBtn = document.querySelector('#passwordBtn');//доступ к кнопке Забыли пароль

function closeOneBlock() {
    mainForm.style.display = 'none';//закрытие первого блока
    checkInputSecond.style.display = 'flex';//открывается второй блок

    secondEmail.value= '';
    secondSecret.value='';
}


passwordBtn.addEventListener('click', closeOneBlock);

// проверка email и кодового слова во второй форме
async function checkInfoSecondForm() {


    secondBtn.disabled = true;

    let secretText = MD5(secondSecret.value).toString();

    const users = await db.get_query("users", "email", secondEmail.value);

    if (users.length == 0) {
        secondEmailErr.textContent = `Пользователь с таким email не зарегестрирован. Создайте свой аккаунт в форме регистрации`;
    } else {
        if (users[0].secret != secretText) {
            secondSecretErr.textContent = 'кодовое слово неверное';

        } else {

            checkInputSecond.style.display = 'none';//закрывается второй блок

            newPass.style.display = 'flex';//открывается третий блок
            userPassId = users[0].id;
        }
    }
    secondBtn.disabled = false;//разблокирована
}



secondBtn.addEventListener('click', checkInfoSecondForm) //слушатель события- во второй форме


thirdBtn.addEventListener('click', async () => {
    if (!checkAllPass()) return;
    thirdBtn.disabled = true;

    const newPassUser = {
        password: MD5(thirdReappassword.value).toString()
    }

    await db.update("users", userPassId, newPassUser);
    userPassId = '';//очищение информации id юзера, в чью базу мы заливаем новый пароль

    newPass.style.display = 'none';//закрывается третий
    okBlock.style.display = 'flex';//открывается четвертый

})



newComeIn.addEventListener('click', () => {
    okBlock.style.display = 'none';//закрывается четвертый блок
    mainForm.style.display = 'flex';//открывается первый
})














// ====================================================================
// async function testtt() {
    // setLike(user.id, "film_id", false);
    // setRating(user.id, "film_id", 5);
    // addComment(user.id, user.name, "film_id", "film sucks");
    // const data = {};
    // data[`likes.somefilem`] = true;
    // await db.update("users", "WAdKgR1PYL9r3fzKk03d", data);

// };

// функция для добавления и убирания из избранного
// state = true - добавить в избранное
// state = false - убрать из избранного

// export async function setLike(user_id, film_id, state) {
//     let subfield = `likes.${film_id}`;
//     if (state) {
//         const data = {};
//         data[subfield] = true;
//         await db.update("users", user_id, data);
//     } else {
//         await db.removeSubfield("users", user_id, subfield);
//     }
// }

// функция для установки и изменения рейтинга, value - значение рейтинга
// async function setRating(user_id, film_id, value) {
//     const film = await db.get("ratings", film_id);
//     if (!film) {
//         let rating = {};
//         rating[user_id] = value;
//         await db.set("ratings", film_id, { ratings: rating });  // создал оценку
//     } else {
//         let data = {};
//         data[`ratings.${user_id}`] = value;
//         await db.update("ratings", film_id, data);  // изменил оценку
//     }
// }

// функция для добавления комментария, text - текст комментария
// async function addComment(user_id, user_name, film_id, text, title) {
//     const data = {};
//     data.text = text;
//     data.name = user_name;
//     data.user_id = user_id;
//     data.film_id = film_id;
//     data.date = new Date().getTime();
//     data.title = title;
//     const id = await db.add("comments", data);
//     return id;
// }

//ПРИМЕР получить рейтинги к фильму
// db.get("ratings", "film").then(r => console.log(r));

//ПРИМЕР получить комментарии к фильму
// db.get_query("comments", "film_id", "film id 123").then(r => console.log(r));
