let createListBtn = document.querySelector(".createListBtn");

/*  function makeList(){

}

addEventListener.createListBtn('click', makeList) */

const modal = document.querySelector('dialog')
const modalBox = document.getElementById('modal-box')
/* const showModalBtn = document.getElementById('show-modal-btn') */
const closeModalBtn = document.getElementById('close-modal-btn')

let isModalOpen = false

createListBtn .addEventListener('click', (e) => {
  modal.showModal()
  isModalOpen = true
  e.stopPropagation()
})

closeModalBtn.addEventListener('click', () => {
  modal.close()
  isModalOpen = false
})

document.addEventListener('click', (e) => {
  if (isModalOpen && !modalBox.contains(e.target)) {
    modal.close()
  }
})
