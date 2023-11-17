
document.querySelector('#avatar').onclick = function(){
    //alert('вход в личный кабинет');
 
 //const API_KEY = "6e01b98a-32ba-41c9-b64f-a2a9582aafa5";
 //const url = 
 //"https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword=movie&page=1";
 
 
 
 const list = document.querySelector('#list')
 const filter = document.querySelector('#filter') 
 let FILMS = []
  filter.addEventListener('input', (event) => {
    const value  = event.target.value.toLowerCase()
     const filteredFilms = FILMS.filter ((film) => {
      return film.name.toLowerCase().includes(value)
    })
   render(filteredFilms)
    })
  async function start(){
     try{
       const responce = await fetch('https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword=${input.value}&page=1',
       { 
          method: "GET",
          headers:{
          'content-type':     'application/json',
          "X-API-KEY":"6e01b98a-32ba-41c9-b64f-a2a9582aafa5"},
       })
      //       // const data = await  responce.json() вот здесь я это убрала так как это не нужно?         //       render(data)
          }
           catch(err){
        list.style.color ='red'
         list.innerHTML = err.message
     }
 }
  function render(films = []){
     if(films.length === 0){
       list.innerHTML = 'Этого фильма нет!'
     } else{
     const html = films.map(toHTML).join('')
        list.innerHTML = html
     }
  }
   function toHTML(film) {
    return`
    <li class="list-group-item">${film.name}</li>
     `  }
 start()
 
 