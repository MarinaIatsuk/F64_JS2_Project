// import "./index"; // не подходит, надо импортировать только нужное

// Для теста подключить к нужной html-странице, добавив вниз
// <script type="module" src="./src/auth-modal.js"></script>

let container = document.querySelector(".container");
console.log("Контейнер, в который вниз добавляем модалку авторизации: ", container);
// тестовую кнопку тоже туда добавим

// Функция отрисовки модального окна авторизации
// Надо сделать отрисовку каждого отдельно или прописать скрытие js-кодом (или вынести из index.js)

function renderAuthModal() {
    let testDiv2 = document.createElement("div");
    container.appendChild(testDiv2);

    const template = `
  <dialog class="dialog" id="windModal">
    <div class="dialog__close">
      <button class="dialog__close-btn" id="btnClose">&#10799;</button>
    </div>
    <div class="dialog__container" id="formContainer">
      <div class="dialog__one-block main-form">
        <h2 class="dialog__title">КиноКосмос</h2>
        <p class="dialog__text dialog-form">Войти в личный кабинет</p>
        <form class="dialog-form__form" name="loginForm" novalidate>
          <div class="dialog-form__email">
            <label for="loginEmail" class="dialog-form__email-text">Email</label>
            <input type="email" name="secondEmail" class="dialog-form__email-input" id="loginEmail"
              placeholder="Введите email..." required>

            <p class="dialog-form__email-error error-text" id="dialogEmailError"></p>
          </div>
          <div class="dialog-form__password">
            <label for="loginPassword" class="dialog-form__password-text">Пароль <button
                class="dialog-form__password-btn" id="passwordBtn">Забыли пароль?</button></label>
            <input name="newPassword" class="dialog-form__password-input" type="password" id="loginPassword"
              placeholder="Введите пароль..." minlength="8" required>

            <p class="dialog-form__password-error error-text" id="dialogPasswError"></p>
          </div>
          <div class="dialog-form__btn">
            <button class="dialog-form__btn-text" id="btnLogin">Войти</button>
          </div>
        </form>

        <div class="dialog__block">
          <p class="dialog__block-text">Новенький?</p>
          <a class="dialog__block-link" href="./registr.html">создай аккаунт</a>
        </div>
      </div>

      <!-- пользователь вводит свой email и кодовое слово -->
      <div class="dialog__two-block check-input" id="examDate">
        <h5 class="dialog__text-title dialog-form">Введите почту и кодовое слово, которые Вы вводили при регистрации
        </h5>
        <form class="dialog-form__form" name="secondForm" novalidate>
          <div class="dialog-form__email">
            <label for="secondEmail" class="dialog-form__email-text">Email</label>
            <input type="email" name="secondEmailInput" class="dialog-form__email-input" id="secondEmail"
              pattern="^[A-Z0-9\._%\+-]+@[A-Z0-9-]+\.[A-Z]{2,4}$" placeholder="Введите email..." required>

            <p class="dialog-form__err-email error-text" id="secondEmailErr"></p>
          </div>
          <div class="dialog-form__secret">
            <label for="secondSecret" class="dialog-form__secret-text">Кодовое слово</label>
            <input type="text" placeholder="Введите кодовое слово..." name="secondSecretInput"
              class="dialog-form__secret-input" id="secondSecret" minlength="2" required>

            <p class="dialog-form__err-secret error-text" id="secondSecretErr"></p>
          </div>
          <div class="dialog-form__btn">
            <button class="dialog-form__btn-text" id="secondBtn">Проверить</button>
          </div>
        </form>
      </div>

      <!-- пользователь вводит новый пароль и повторяет введенный выше пароль. Пароль перезаписывается в БД -->


      <div class="dialog__three-block new-pass" id="replacePass">
        <h5 class="dialog__text-title dialog-form">Введите новый пароль</h5>
        <form class="dialog-form__form" name="thirdForm" novalidate>
          <div class="dialog-form__password">
            <label for="thirdPassword" class="dialog-form__password-text">Пароль</label>
            <input name="thirdCheckOk" type="password" class="dialog-form__password-input" id="thirdPassword"
              placeholder="Введите новый пароль..." minlength="8" required>

            <p class="dialog-form__err-password error-text" id="thirdPasswordErr"></p>
          </div>
          <div class="dialog-form__reappassword">
            <label for="thirdReappassword" class="dialog-form__reappassword-text">Повторите пароль</label>
            <input type="password" name="thirdCheckOk" class="dialog-form__reappassword-input" id="thirdReappassword"
              placeholder="Повторите пароль..." minlength="8" required>

            <p class="dialog-form__err-reappassword error-text" id="thirdReappasswordErr"></p>
          </div>
          <div class="dialog-form__btn">
            <button class="dialog-form__btn-text" id="thirdBtn">Изменить пароль</button>
          </div>
        </form>
      </div>

      <!-- Новый пароль успешно зарегестрирован -->


      <div class="dialog__four-block ok-block">
        <div class="ok-block__location">
          <p class="ok-block__text">Вы успешно изменилии пароль</p>
          <button class="ok-block__btn" id="newComwIn">перейти в форму входа</button>
        </div>
      </div>

    </div>
  </dialog>
`;

    testDiv2.innerHTML = template;

    const btnClose = document.querySelector('#btnClose');

    btnClose.addEventListener('click', closeModal);

    openModal();
    console.log("Модалка авторизации должна быть открыта сейчас");
}


// Тестовая кнопка временно вместо кнопки "Перейти к авторизации" в модалке для неавторизованного пользователя

// Для теста -- шаблон для отрисовки тестовой кнопки

let testBtnTemplate = `
    <button class="dialog__btn-text" name="redirectToAuthForm" data-id="btnRedirectToAuth">Авторизоваться ЖМИ СЮДА!!!</button>
`;


// Для теста -- ф-ия отрисовки тестовой кнопки

function renderTestBtn() {
    let testDiv = document.createElement("div");
    container.appendChild(testDiv);
    testDiv.innerHTML = testBtnTemplate;
    
    console.log("Кнопка для теста добавлена: ", testDiv);
    addListenerToTestBtn();
}

function addListenerToTestBtn() {
    // Ищем по data-id
    const testBtn = document.querySelector('[data-id="btnRedirectToAuth"]');
    testBtn.addEventListener("click", renderAuthModal);

    console.log("Слушатель на кнопку для теста добавлен: ", testBtn);
}



// Взято из index.js для теста --НАЧАЛО--
// Модальное окно на главной странице

// const btnOpen = document.querySelector('#btnOpen');//кнопка Войти в хэдэр

// const windModal = document.querySelector('#windModal');
// const btnClose = document.querySelector('#btnClose');

function openModal() {
    window.windModal.showModal();
    document.body.classList.add('scroll-lock');//блокирует скрол

    // mainForm.style.display = 'flex';//при нажатии на кнопку Войти в хэдэр видна первая форма модального окна
    // checkInputSecond.style.display = 'none';//закрыта вторая форма модального окна
    // newPass.style.display = 'none';//закрыта третья форма модального окна
    // okBlock.style.display = 'none';//закрыта четвертая форма модального окна

    // //поля ввода пустые
    // loginEmail.value='';
    // loginPassword.value='';
}

function closeModal() {
    window.windModal.close();
    document.body.classList.remove('scroll-lock');
}

// Взято из index.js для теста --КОНЕЦ--


// Здесь будет слушатель события на кнопку из модалки редиректа для неавторизованного пользователя
// или для другого нужного элемента
document.addEventListener("DOMContentLoaded", renderTestBtn);