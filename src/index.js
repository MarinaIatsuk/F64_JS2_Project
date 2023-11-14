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
