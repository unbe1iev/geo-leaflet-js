// List of consts:a
// -----------------
const MY_LOCATION_BUTTON = document.querySelector('#my-location-button');
const RASTER_BUTTON = document.querySelector('#raster-button');
const PUZZLE_BUTTON = document.querySelector('#puzzle-button');
const MY_LOCATION_COORDS = document.querySelector('#my-location-coords');
// -----------------

// Global variables:
// -----------------
let puzzleToDrag = document.getElementById("puzzle-to-drag");
let puzzleToDragCtx = puzzleToDrag.getContext("2d");

let puzzleToDrop = document.getElementById("puzzle-to-drop");
let puzzleToDropCtx = puzzleToDrag.getContext("2d");

let x, y, zoom, mapImage, map;

let fields = [
    { src: null }
];
// -----------------

// Initial values:
// -----------------
MY_LOCATION_COORDS.innerHTML = "{ Click 'My localization' button below }";

MY_LOCATION_BUTTON.disabled = false;
RASTER_BUTTON.disabled = true;
PUZZLE_BUTTON.disabled = true;

x = 51.9189;
y = 19.1344;
zoom = 5;
// -----------------

// Functions:
// -----------------
const disableButton = (button) => {
    button.disabled = true;
}

const mapOnLoad = () => {
    map = L.map(map).setView([53.430127, 14.564802], 18);
    L.tileLayer.provider('Esri.WorldImagery').addTo(map);
    let marker = L.marker([53.430127, 14.564802]).addTo(map);
    marker.bindPopup("<strong>This is Your Location</strong><br>")
}

const setLocationOnMap = (coords) => {
    const { x, y } = coords;

    map.setView([x, y]);
    L.marker([x, y]).addTo(map);

    disableButton(MY_LOCATION_BUTTON);
}

export const saveMapImage = () => {
    disableButton(RASTER_BUTTON);
    disableButton(MY_LOCATION_BUTTON);

    const loader = document.createElement('div');
    loader.className = "";

    SIDE_WRAPPER.appendChild(loader)

    handleAddLoader()

    leafletImage(map, (err, canvas) => {

        const { height, width } = canvasContainerSize()

        // here we have the canvas
        const raster = document.createElement('canvas');

        raster.width = width;
        raster.height = height;

        let rasterContext = raster.getContext("2d");
        rasterContext.drawImage(canvas, 0, 0, width, height);
        handleRemoveLoader()

        handleDisplayRaster(raster)
        createPuzzle(raster)
    });
}
// -----------------

// let map = L.map('map').setView([x, y], zoom);
// L.tileLayer.provider('Esri.WorldImagery').addTo(map);
//
// function allowDrop(ev) {
//     ev.preventDefault();
// }
//
// function drag(ev) {
//     ev.dataTransfer.setData("text", ev.target.id);
// }
//
// function drop(ev) {
//     ev.preventDefault();
//     let data = ev.dataTransfer.getData("text");
//     ev.target.appendChild(document.getElementById(data));
// }
//
// L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
//     attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
// }).addTo(map);
//
// MY_LOCATION_BUTTON.addEventListener('click', e => {
//     navigator.geolocation.getCurrentPosition(function (position) {
//         x = position.coords.latitude;
//         y = position.coords.longitude;
//         MY_LOCATION_COORDS.innerHTML = "X: " + x + ", Y: " + y;
//         zoom = 16;
//
//         let marker = L.marker([x, y]).addTo(map);
//         marker.bindPopup("<strong>This is Your Location</strong><br>")
//         map.setView([x, y], zoom);
//     })
//
//     MY_LOCATION_BUTTON.disabled = true;
//     RASTER_BUTTON.disabled = false;
//
// })
//
// RASTER_BUTTON.addEventListener('click', e => {
//     leafletImage(map, function(err, canvas) {
//         mapImage = document.createElement('canvas');
//         let dims = map.getSize();
//         mapImage.width = dims.x;
//         mapImage.height = dims.y;
//         mapImage.src = canvas.toDataURL();
//     });
//
//
//
//     //puzzleToDragCtx.drawImage(image, 0, 0, image.width, image.height);
//
//     RASTER_BUTTON.disabled = true;
//     PUZZLE_BUTTON.disabled = false;
// })
//
// PUZZLE_BUTTON.addEventListener('click', e => {
//
//     PUZZLE_BUTTON.disabled = true;
// })