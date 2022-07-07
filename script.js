const bindElements = document.querySelectorAll('*[data-bind]');
const bindMap = {}; //карта соответствий. Ключу будет соответствовать data атрибут, значению - массив тегов, где имеется данный data атрибут
const scope = {}; //переменная хранит текущие введенные данные
const bindingEnabled = document.querySelector('#bindingEnabled');

for (const el of bindElements) {
    const bindTo = el.dataset.bind;

    if (!bindMap[bindTo]) {
        bindMap[bindTo] = []; //если ключа еще не существует, создаем его и присваеваем пустой массив в качестве значения
    }

    bindMap[bindTo].push(el); //добавляем тег в массив с соответствующим ключом data атрибута
}

function bindValue(bindName, value) {
    scope[bindName] = value;
}

function syncBinding(target) {
    for (const bindTo in scope) {
        const value = scope[bindTo];
        for (const el of bindMap[bindTo]) {
            if (el !== target) {
                if (el === 'INPUT') {
                    el.value = value; // если в документе есть еще поля input c такими же data атрибутами, во всех таких полях будет выводится одинаковая информация
                } else {
                    el.textContent = value; // если элемент не input, в него запишется значение. Таких приемников может быть несколько на странице
                }
            }
        }
        delete scope[bindTo]; // очищаем переменную для хранения введенных данных
    }
}

document.addEventListener('input', e => {
    const target = e.target;
    const bindTo = target.dataset.bind;

    if (bindTo && bindMap[bindTo]) {  // проверка существования data атрибута и соответствующего ключа в карте соответствий
        bindValue(bindTo, target.value); // вызываем функцию, которая сохраняет введенные значения в переменной scope

        if (bindingEnabled.checked) { // если выбрана опция "Динамическое связывание", вызываем функцию синхронизации
            syncBinding();
        }
    }
});

bindingEnabled.addEventListener('change', () => { //слушатель события выбора синхронизации
    if (bindingEnabled.checked) { // если синхронизация включена, вызываем соответствующую функцию
        syncBinding();
    }
});

