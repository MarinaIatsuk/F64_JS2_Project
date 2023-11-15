import { db_post, db_get, db_put } from './db';
import MD5 from "crypto-js/md5";

const myForm = document.forms.oneForm;


// Валидация прописанная
function checkValidity(input) {
    function setError(text) {
        input.nextSibling.textContent = text;
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

    if (validity.patternMismatch) {
        setError('Неверный формат заполнения');
        return false;
    }

    return true;
}


//проверка каждого input на валидность

const inputs = document.querySelectorAll('input');
const allInputs = Array.from(inputs);

function checkAll() {
    let ok = true;

    for (let input of allInputs) {
        if (!checkValidity(input)) ok = false;
    }

    //Проверка совпадения паролей

    const newPassword = myForm.elements.newPassword;
    const passwordTwo = myForm.elements.repPassword;

    if (passwordTwo.value !== newPassword.value) {
        passwordTwo.nextSibling.textContent = 'Пароли не совпадают';
        ok = false;
    }

    return ok;
}



//отмена отправки если не отметить чекбокс
const choceCheck = myForm.elements.secondCheckbox; //доступ чекбокс


const submButton = document.querySelector('#btnText'); // доступ к кнопке
submButton.disabled = 1;

choceCheck.addEventListener('change', () => {
    if (choceCheck.checked) {
        submButton.disabled = 0;
    } else {
        submButton.disabled = 1;
    }
})


myForm.addEventListener('submit', (e) => {
    e.preventDefault(); //отмена отправки

    checkAll();
    // if (ok) allInputs.forEach(x => {
    //     console.log(x.value);
    // })
});


const userName = document.querySelector('#textName');//доступ к input Имя пользователя
const userEmail = document.querySelector('#textEmail');//доступ к input Email
const userPassword = document.querySelector('#repeatPassword');//доступ к input Повторите пароль
const textSecret = document.querySelector('#textSecret'); //доступ к input Кодовое слово

//при клике на кнопку в базу данных внесутя данные с input Имя, Email, повторите пароль

submButton.addEventListener('click', () => {
    //
    //
    if(!checkAll()) return;
    // checkAll();
    //
    const newClient = {
        'name': userName.value,
        'password': MD5(userPassword.value).toString(),
        'email': userEmail.value,
        'secret': MD5(textSecret.value).toString()
    }
    submButton.disabled = true;

    db_get('clients', { email: newClient.email })
        .then(res => {
            if (res.length > 0) console.log("Email exists");
            else db_post('clients', newClient)
                .then(res => {
                    const info = {
                        id: res._id,
                        likes: {},
                        comments: {},
                        rating: {},
                        wish: {}
                    }
                    db_post('info', info)
                        .catch(e => alert("Database error!"));
                    console.log("регистрация завершена");
                })
                .catch(e => alert("Database error!"))
        })
        .catch(e => alert("Database error!"))
        .finally(() => submButton.disabled = false);
});