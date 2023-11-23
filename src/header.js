
document.querySelector('#avatar').onclick = function(){
    //alert('вход в личный кабинет');
}

 //const API_KEY = "6e01b98a-32ba-41c9-b64f-a2a9582aafa5";
 //const url = 
 //"https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword=movie&page=1";
 
 
 const filter = document.querySelector("#filter");
 const list = document.querySelector("#list");
 let FILMS = [];
 
 filter.addEventListener("input", (event) => {
         var keyword = event.target.value.toLowerCase();
         fetch(
                 `https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword=${encodeURIComponent(
                         keyword
                 )}&page=1`,
                 {
                         method: "GET",
                         headers: {
                                 "X-API-KEY": "6e01b98a-32ba-41c9-b64f-a2a9582aafa5",
                                 "Content-Type": "application/json",
                         },
                 }
         )
                 .then((res) => res.json())
                 .then((data) => {
                         list.innerHTML = "";
                         data.films.forEach((film) => {
                                 const li = document.createElement("li");
                                 li.textContent = film.nameRu;
                                 list.appendChild(li);
                         });
                 })
                 .catch((err) => console.log(err));
 });
 
 const btnOpen =  function() {
   document.querySelector('#btnOpen').style.display="none";
}
const avatar = document.getElementById("avatarId");
avatar.style.display = "none";

// $(documnet).ready(function() {
//         $('.header__burger').click(function(event){
//                 $('.header__burger,. header__nav').toggleClass('active');
//                 $('body').toggleClass('lock');
//         });
// });