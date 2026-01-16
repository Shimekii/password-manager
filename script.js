// генератор пароля
function generatePassword(){
    // задаем доступные варианты символов
    let nums = "0123456789";
    let lowerChar = "abcdefghijklmnopqrstuvwxyz";
    let upperChar = "ABCDEFGHIJKMNPQRSTUVWXYZ";
    let symbols = "+-_!@";

    // собираем информацию с чекбоксов
    const includedNums = document.getElementById("nums").checked;
    const includedLower = document.getElementById("lowercase").checked;
    const includedUpper = document.getElementById("uppercase").checked;
    const includedSymbols = document.getElementById("symbols").checked;

    // проверяем, какие символы должны входить в пароль
    let charset = "";
    if (includedNums) charset += nums;
    if (includedLower) charset += lowerChar;
    if (includedUpper) charset += upperChar;
    if (includedSymbols) charset += symbols;
    if (charset == "") return "";
    
    const length = document.getElementById("len-pass").value;   // считываем длину пароля

    // генератор случайных чисел с использованием crypto
    const randomValues = new Uint32Array(length);      // создаем массив
    crypto.getRandomValues(randomValues);              // используя crypto заполняем массив случайными числами
    let password = "";
    for(let i = 0; i < length; i++){
        password += charset[randomValues[i] % charset.length];  // поэлементно добавляем случайные символы в пароль на основе сгенерированных чисел
    }

    return password;
}

// Логика кнопки на открытие окна с генератором паролей
document.getElementById("btn-show-window").addEventListener('click', () => {
    let window = document.querySelector(".window-gen-pass");    // получаем элемент по классу
    window.style.display = 'flex';      // делаем его видимым
})

// Логика кнопки на генерацию пароля
document.getElementById("gen-pass").addEventListener('click', () => {
    const pwd = generatePassword();     // сгенерированный пароль

    let window = document.querySelector(".window-gen-pass");    // получаем элемент по классу
    window.style.display = 'none';      // скрываем окно генерации пароля

    document.getElementById("password").value = pwd;    // в поле для пароля подставляем пароль

    const input = document.getElementById("password");  // получаем поле с паролем по id
    input.type = 'text';        // меняем его тип на text (чтобы было видно сгенерированный пароль)
    setTimeout(() => input.type = 'password', 1500);    // через 1.5 сек возвращаем тип password
})

let login;
let password;
let url;
// Логика кнопки для сохранения введенных данных
document.getElementById("btn-save").addEventListener('click', () => {
    login = document.getElementById("login").value;                 // получаем логин
    password = document.getElementById("password").value.trim();    // получаем пароль
    url = document.getElementById("url").value;                     // получаем url

    // Проверка на заполненные поля с логином и паролем
    if(!login || !password){
        alert("Логин и пароль обязательны");
        return;
    }

    // создаем запись
    const record = {
        login,
        password,
        url
    };

    // из localStorage получаем элементы по ключу passwords и парсим через JSON
    const records = JSON.parse(localStorage.getItem('passwords') || '[]')
    records.push(record)    // добавляем запись в список

    // добавляем записи в localStorage
    localStorage.setItem('passwords', JSON.stringify(records));
    renderPasswordList();   // обновляем список сохраненных паролей
})

// Логика кнопки для очищения localStorage
document.getElementById('btn-clear').addEventListener('click', () => {
    localStorage.clear();
    renderPasswordList();
})

// Логика кнопки для загрузки сохраненных паролей из localStorage
document.getElementById('btn-load').addEventListener('click', () => {
    renderPasswordList();
})

// Логика кнопки для скрытия записей
document.getElementById('btn-hide').addEventListener('click', () =>{
    document.getElementById('view').innerHTML = "";     // очищаем
})

// функция для отображения сохраненных паролей
function renderPasswordList(){
    const container = document.getElementById('view');      // получаем контейнер для паролей по id
    const records = JSON.parse(localStorage.getItem('passwords') || '[]');      // получаем записи

    // Если паролей нет, то выводим, чтоб записей нет
    if(records.length === 0){
         container.innerHTML = "<p>Нет сохраненных паролей</p>"
         return;
    }

    // подготавливаем заготовку для отображения данных
    const html = records.map(record => `
        <p>Login: ${record.login}</p>
        <p>Password: ${record.password}</p>
        <p>Url:<a href="https://${record.url}">${record.url}</a></p>
        <hr>
        `).join('');
    // Вставляем в контейнер сохраненные записи
    container.innerHTML = html;
}

// Отображаем список сразу после загрузки страницы
document.addEventListener("DOMContentLoaded", () => {
    renderPasswordList();
})