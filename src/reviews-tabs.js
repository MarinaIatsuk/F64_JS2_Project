// Получаем родительский элемент навигации
const tabsNav = document.querySelector(".tabs__nav");

// Вешаем на родительский элемент обработчик события "клик"
tabsNav.addEventListener("click", (event) => {
    // Проверяем, было ли нажатие именно на название вкладки
    if (event.target.classList.contains("tabs__title")) {
        // if (event.target.closest('.tabs__div')) {
        // Получаем предыдущую активную вкладку
        const prevActiveItem = document.querySelector(".tabs__item._active");
        // Получаем предыдущее активное название вкладки
        const prevActiveTitle = document.querySelector(".tabs__title._active");

        // Проверяем есть или нет предыдущее активное название вкладки
        if (prevActiveTitle) {
            // Удаляем класс _active у предыдущей название вкладки, если оно есть
            prevActiveTitle.classList.remove("_active");
        }

        // Проверяем есть или нет предыдущая активная вкладка
        if (prevActiveItem) {
            // Удаляем класс _active у предыдущей вкладки, если она есть
            prevActiveItem.classList.remove("_active");
        }
        // Получаем id новой активной вкладки, который мы берем из атрибута data-tab у названия вкладки
        const nextActiveItemId = `#${event.target.getAttribute("data-tab")}`;
        // Получаем новую активную вкладку по id
        const nextActiveItem = document.querySelector(nextActiveItemId);

        // Добавляем класс _active названию вкладки на которое нажали
        event.target.classList.add("_active");
        // Добавляем класс _active новой выбранной вкладке
        nextActiveItem.classList.add("_active");

        // Получаем родительский контейнер и первую вкладку
        const tabsContent = document.querySelector(".tabs__content");
        const tabItemOne = document.querySelector("#tab_1");
        // Проверяем, если выбрана первая вкладка, меняем левое верхнее скругление у контейнера
        if (tabItemOne.classList.contains("_active")) {
            // Если есть, добавляем класс _tab-1-active к родительскому элементу
            tabsContent.classList.add("_tab-1-active");
        } else {
            // Если нет, удаляем класс _tab-1-active
            tabsContent.classList.remove("_tab-1-active");
        }
    }
});
