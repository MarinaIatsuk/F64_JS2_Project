const listInput = document.querySelector("#listInput");
const listItem = document.querySelector(".list__title");
let createListBtn = document.querySelector(".lk__btn");
let modal = document.querySelector('.lk__modalList');
const modalBox = document.getElementById('modal-box');
const modalListBtn = document.querySelector('.modalList__btn');


//открытие модалки
let isModalOpen = false
createListBtn .addEventListener('click', (e) => {
  modal.showModal()
  isModalOpen = true
  e.stopPropagation()
})

modalListBtn .addEventListener('click', () => {
  modal.close()
  isModalOpen = false
})

document.addEventListener('click', (e) => {
  if (isModalOpen && !modalBox.contains(e.target)) {
    modal.close()
  }
})


function createListItem(){
  let inputValue = listInput.value.trim();
  if ( inputValue !==''){
  let liItem = document.createElement('li');
  let linkItem = document.createElement('a');
  linkItem.href = '#'; 
 linkItem.innerHTML = inputValue;
  liItem.appendChild(linkItem);
   listItem.appendChild(liItem);
   listInput.value = '';
}
}
modalListBtn.addEventListener('click',createListItem);

listInput.addEventListener('keyup', (event) => {
//если нажать enter, то создастся список и закроется модалка 
  if (event.key === 'Enter' ) {
    createListItem();
    modal.close()
  }
});
