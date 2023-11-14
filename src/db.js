const base_url = 'https://moviebase-cd1d.restdb.io/rest/';
const api_key = '654fe26577932e1a701f1e74';


// collection пишем в зависимости от какая база нужна 'clients'/ 'info'

//получение/проверка данных
export async function db_get(collection, q = null) {
  return new Promise((res, rej) => {
    fetch(base_url + collection + (q ? ('?q=' + JSON.stringify(q)) : ''), {
      headers: {
        "x-apikey": api_key,
        'Content-Type': 'application/json'
      },
    })
      .then(resp => resp.json())
      .then(json => res(json))
      .catch(e => rej(e));
  });
}


//обновление юзера,клиента
export function db_put(collection, id, data) {
  return new Promise((res, rej) => {
    fetch(base_url + collection + '/' + id, {
      method: 'PUT',
      headers: {
        "x-apikey": api_key,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(resp => resp.json())
      .then(json => res(json))
      .catch(e => rej(e));
  });
}


//добавление нового клиента
export function db_post(collection, data) {
  return new Promise((res, rej) => {
    fetch(base_url + collection, {
      method: 'POST',
      headers: {
        "x-apikey": api_key,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(resp => resp.json())
      .then(json => res(json))
      .catch(e => rej(e));
  });
}
