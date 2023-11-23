import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { deleteField, collection, addDoc, setDoc, getDocs, doc, getDoc, updateDoc, query, where } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDeePC5rr7GNBjXgIZO4vkebjrpsfjRF1A",
  authDomain: "moviebase-a1154.firebaseapp.com",
  projectId: "moviebase-a1154",
  storageBucket: "moviebase-a1154.appspot.com",
  messagingSenderId: "437248829000",
  appId: "1:437248829000:web:40772e66f7a234f4a2da7d"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/*
users: {
  id: {   // id юзера
    name: "",
    password: "",
    email: "",
    secret: "",
    likes: {}
  }
}
comments: {
  id: {   // id комментария
    name: "",
    user_id: "",
    film_id: "",
    text: ""
  }
}
ratings: {
  id: {   // id фильма из API фильмов
    ratings: {
      user_id: value
    }
  }
}
*/

// base - имя коллекции (users | comments | ratings)

/**
 * @returns id [String]
 */
// добавить в БД
export async function add(base, data) {
  const ret = await addDoc(collection(db, base), data);
  return ret.id;
}

// установить в БД
export async function set(base, id, data) {
  await setDoc(doc(db, base, id), data);
}

// удалить из БД
export async function remove(base, id) {
  await deleteDoc(doc(db, base, id));
}

// удалить подполе
export async function removeSubfield(base, id, field) {
  let data = {};
  data[field] = deleteField();
  await updateDoc(doc(db, base, id), data);
}

/**
 * @returns {id, data} or null
 */
// получить из БД
export async function get(base, id) {
  const ret = await getDoc(doc(db, base, id));
  if (ret.exists()) {
    let data = ret.data();
    data.id = ret.id;
    return data;
  }
  else return null;
}

// обновить в БД
export async function update(base, id, data) {
  await updateDoc(doc(db, base, id), data);
}

/**
 * @brief возвращает массив записей из базы base, у которых совпадает key:value
 */
export async function get_query(base, key, value) {
  const q = query(collection(db, base), where(key, "==", value));
  const docs = await getDocs(q);
  let arr = [];
  docs.forEach(doc => {
    let data = doc.data();
    data.id = doc.id;
    arr.push(data);
  });
  return arr;
}