import * as db from './db';
import MD5 from "crypto-js/md5";

const myForm = document.forms.oneForm;
const newPassword = document.getElementById('secondPassword');//поле ввода пароль
const passwordTwo = document.getElementById('repeatPassword');//поле ввода Повторите пароль
const onePass = document.querySelector('.form__password-error');//class ошибка под input пароль
const valueEmail = document.querySelector('.form__email-error');//class ошибка под input email

// Валидация прописанная
function checkValidity(input) {
    function setError(text) {
        input.nextElementSibling.textContent = text;
        input.classList.add('error');
    }

    setError('');
    input.classList.remove('error');

    let validity = input.validity;

    if (validity.rangeUnderflow) {
        setError('Значение меньше минимально допустимого');
        return false;
    }

    if (validity.rangeOverflow) {
        setError('Значение больше максимального допустимого');
        return false;
    }

    if (validity.tooShort) {
        setError('Значение слишком короткое');
        return false;
    }

    if (validity.tooLong) {
        setError('Значение слишком длинное');
        return false;
    }

    if (validity.valueMissing) {
        setError('Необходимо заполнить поле');
        return false;
    }


    return true;
}


//проверка каждого input на валидность

const inputs = document.querySelectorAll('input[name="secondName"]');
const allInputs = Array.from(inputs);

function checkAll() {
    let ok = true;

    for (let input of allInputs) {
        if (!checkValidity(input)) ok = false;
    }


    const regexp = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;//регулярное выражение для пароля

    const regexpEmail = /[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+/i; //регулярное выражение для почты


    //проверка на валидность для пароля
    if (!regexp.test(newPassword.value)) {
        ok = false;
        onePass.innerHTML = ` Пароль должен: содержать хотя бы одну большую букву, хотя бы одну маленькую букву, хотя бы одну цифру, хотя бы один спецсимвол(!@#$%^&*);`;
        newPassword.classList.add('error');
    }

    // проверка на валидность для почты
    if (!regexpEmail.test(userEmail.value)) {
        ok = false;
        valueEmail.innerHTML = `Неверный формат заполнения`;
    }

    //Проверка совпадения паролей


    if (passwordTwo.value !== newPassword.value) {
        passwordTwo.nextElementSibling.textContent = 'Пароли не совпадают';
        passwordTwo.classList.add('error');
        ok = false;
    } else

        return ok;
}



//отмена отправки если не отметить чекбокс
const choceCheck = myForm.elements.secondCheckbox; //доступ чекбокс

const submButton = document.querySelector('#btnText'); // доступ к кнопке
submButton.disabled = true;

choceCheck.addEventListener('change', () => {
    if (choceCheck.checked) {
        submButton.disabled = false;
    } else {
        submButton.disabled = true;
    }
})


myForm.addEventListener('submit', (e) => {
    e.preventDefault(); //отмена отправки

    checkAll();
});


const userName = document.querySelector('#textName');//доступ к input Имя пользователя
const userEmail = document.querySelector('#textEmail');//доступ к input Email
const userPassword = document.querySelector('#repeatPassword');//доступ к input Повторите пароль
const textSecret = document.querySelector('#textSecret'); //доступ к input Кодовое слово

const invisibleOne = document.querySelector('#invisibleOne'); //доступ ко всему блоку формы регистрации
const invisibleTwo = document.querySelector('#invisibleTwo');// доступ к блоку войти в существующий аккаунт
const seeBlock = document.querySelector(".see");//доступ к div где убдет выводится Вы успешно зарегестрированы- прописаны стили к этому классу
const resultOk = document.querySelector("#resultOk");//доступ к div где убдет выводится Вы успешно зарегестрированы- прописана функциональность
const errErrorEmail = document.querySelector('.form__email-error');

//при клике на кнопку в базу данных внесутя данные с input Имя, Email, повторите пароль

submButton.addEventListener('click', async () => {
    if (!checkAll()) return;
    submButton.disabled = true;

    //данные которые ввел клиент в форме регистрации
    const newClient = {
        name: userName.value,
        password: MD5(userPassword.value).toString(),
        email: userEmail.value,
        secret: MD5(textSecret.value).toString(),
        likes: {}
    }

    const users = await db.get_query("users", "email", newClient.email);
    if (users.length > 0) {
        errErrorEmail.textContent = "пользователь с таким email существует";
    } else {
        let uid = await db.add("users", newClient);

        invisibleOne.style.display = 'none';
        invisibleTwo.style.display = 'none';

        seeBlock.style.display = 'flex';

        resultOk.innerHTML = `
        <div class="main-reg__ok">
        <p class="main-reg__ok-text">Вы успешно зарегестрировались</p>
        <a class="main-reg__ok-link" href="./index.html">главная страница</a>
    </div>
        `;


        //запись в локальное хранилище(чтобы на главной странице не нужно было заново вводить данные в форме входа)
        let date = new Date().getTime(); // дата в миллисек
        const obj = { id: uid, name: userName.value, time: date };

        const objJSON = JSON.stringify(obj);
        window.localStorage.setItem('client', objJSON); //добавление в локальное хранилище id клиента и время когда зашел

        const objLS = window.localStorage.getItem('client');
        JSON.parse(objLS);
    }

    submButton.disabled = false;
});


const btnComeIn = document.querySelector('#btnComeIn');

//при нажатии направляет на главную страницу+/?login=true  - адрес с параметрами (чтобы было открытое модальное окно)
function showComeIn() {
    window.open(window.location.origin + '?login=true', '_self');
}

btnComeIn.addEventListener('click', showComeIn);