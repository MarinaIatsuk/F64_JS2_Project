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

const btnOpen = document.querySelector('#btnOpen');

const windModal = document.querySelector('#windModal');
const btnClose = document.querySelector('#btnClose');
// const formContainer= document.querySelector('#formContainer');

function openModal(){
    window.windModal.showModal();
}

function closeModal(){
    window.windModal.close();
}


btnOpen.addEventListener('click', openModal);
btnClose.addEventListener('click', closeModal);
// formContainer.addEventListener('click', (e)=>{
//     e.stopPropagation();
// })





// Работа над формой входа

import { db_post, db_get, db_put } from './db';
import MD5 from "crypto-js/md5";


const loginForm= document.forms.loginForm;//доступ к форме модального окна

const loginEmail = document.querySelector('#loginEmail');//доступ к input email
const loginPassword = document.querySelector('#loginPassword');//доступ к input пароль
const btnLogin = document.querySelector('#btnLogin');//доступ к кнопке войти

const hiUser = document.querySelector('#hiUser')





// function lsName(){
//     //ДОДЕЛАТЬ если в локальном хранилище есть информация, то кнопка Войти = дисплей ноне, будет Привет юзер
// }
// window.addEventListener('load', lsName);





// отмена отправки
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
})


//проверка есть ли пользователь с таким email и правильно ли введен пароль, если такой пользователь есть
function examLogin(){
    //зашифрованный введенный пароль в форму входа
    let pas = MD5(loginPassword.value).toString();


    db_get('clients', { email: loginEmail.value})
        .then(res => {
            if(res.length == 0) {
                console.log('нет пользователя с таким email');
            }else {
                if( res[0].password != pas) {
                    console.log("пароль неверный");
                }
                else{
                    console.log('Добро пожаловать');
                    let date = new Date().getTime(); // дата в миллисек
                    const obj = {id: res[0]._id,name: res[0].name, time: date };

                    const objJSON = JSON.stringify(obj);
                    window.localStorage.setItem('client', objJSON); //добавление в локальное хранилище id клиента и время когда зашел

                    window.windModal.close();//закрыть модальное окно

                    btnOpen.style.display = 'none;';


                    const objLS = window.localStorage.getItem('client');
                    const accessObj = JSON.parse(objLS);

                    hiUser.innerHTML = `<p class="cont__text-name"> Привет, ${accessObj.name}</p>`;
                }
            }

        })
        .catch(e => alert("Database error!"));
}

btnLogin.addEventListener("click", examLogin); //клик на Войти в модальном окне


