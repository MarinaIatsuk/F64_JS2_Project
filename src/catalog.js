// async function getInfo() {
//     try {
//         const infoResponse = await fetch(
//             `https://kinopoiskapiunofficial.tech/api/v2.2/films?order=RATING&type=ALL&ratingFrom=0&ratingTo=10&yearFrom=1000&yearTo=3000&page=1`,
//             {
//                 headers: {
//                     'X-API-KEY': '4cb59c01-681c-4c05-bed7-5b173e7511c3',
//                     'accept': 'application/json'
//                 }
//             }
//         );
//         const infoJson = await infoResponse.json();
//         console.log(JSON.stringify(infoJson)); // проверка полей
//     } catch (error) {
//         errorBlock.textContent = `Ошибка: ${error.message}`;
//     }
// }

// getInfo()

