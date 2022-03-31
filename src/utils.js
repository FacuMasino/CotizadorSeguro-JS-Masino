// Convertir el nombre por si el usuario lo iNgResA aSí
const cleanClientName = (name)=>name[0].toUpperCase()+name.slice(1).toLowerCase();
// Manejo de local y session storage
const getFromSession = (item) => JSON.parse(sessionStorage.getItem(item));
const setToSession = (key, item) => sessionStorage.setItem(key, JSON.stringify(item));
const getFromLocal = (item) => JSON.parse(localStorage.getItem(item));
const setToLocal = (key,item) => localStorage.setItem(key, JSON.stringify(item));
