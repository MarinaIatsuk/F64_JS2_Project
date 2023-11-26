// функции. Перед каждой функцией пишем export. Пример: export function one (){}
// так же не забываем в этот файл импортировать переменные, которые используем в функциях. Пример: import{btn, container} from './vars.js'

//для работы с БД
import * as db from './db';

//Функция установки лайков
export async function setLike(user_id, film_id, state) {
    let subfield = `likes.${film_id}`;
    if (state) {
        const data = {};
        data[subfield] = true;
        await db.update("users", user_id, data);
    } else {
        await db.removeSubfield("users", user_id, subfield);
    }
}
//Функция проверки регистрации пользователя
export function showAlertNeedRegistration() {
    const isUserAuthenticated = window.localStorage.getItem('client');

    if (!isUserAuthenticated) {
        const confirmation = confirm('Чтобы использовать опцию "Избранное", необходимо авторизироваться. Хотите перейти на страницу регистрации?');

        if (confirmation) {
            window.location.href = 'registr.html';
        }
    }
}