let myLocButton = document.querySelector('#myLocButton');
let rasterButton = document.querySelector('#rasterButton');
let puzzleButton = document.querySelector('#puzzleButton');
let cords = document.querySelector('#cords');

myLocButton.disabled = false;
rasterButton.disabled = true;
puzzleButton.disabled = true;

let x, y, zoom;

x = 51.9189;
y = 19.1344;
zoom = 5;

let map = L.map('map').setView([x, y], zoom);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

myLocButton.addEventListener('click', e => {
    navigator.geolocation.getCurrentPosition(function (position) {
        x = position.coords.latitude;
        y = position.coords.longitude;
        zoom = 16;

        L.marker([x, y]).addTo(map);
        map.setView([x, y], zoom);
    })

    myLocButton.disabled = true;
    rasterButton.disabled = false;
})

rasterButton.addEventListener('click', e => {


    rasterButton.disabled = true;
    puzzleButton.disabled = false;
})

puzzleButton.addEventListener('click', e => {

    puzzleButton.disabled = true;
})

//let divElement = "<div class='field'></div>";