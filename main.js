const MY_LOCATION_INFO = document.querySelector('[my-location]');
const MAIN_CONTAINER = document.querySelector('[main-container]');
const MAP_CONTAINER = document.querySelector('[map-container]');
const PUZZLE_AREA = document.querySelector('[puzzle-area]');
const MY_LOCALIZATION_BUTTON = document.querySelector('[localization-button]');
const RASTER_BUTTON = document.querySelector('[raster-button]');
const PUZZLE_WRAPPER = document.querySelector('[puzzle-wrapper]');

RASTER_BUTTON.disabled = true;

const CANVAS_ID = null;
let map = null;
let used = false;

const createPuzzle = canvas => {
  const canvasWidth = canvas.width / 4;
  const canvasHeight = canvas.height / 4;
  const puzzles = [];
  let cnt = 0;

  for (let i=0; i < 4; i++) {
    for(let j=0; j < 4; j++) {
      const puzzleImage = new Image();
      const puzzleCanvas = document.createElement('canvas');

      puzzleImage.id = cnt++;
      puzzleCanvas.width = canvasWidth;
      puzzleCanvas.height = canvasHeight;

      puzzleImage.addEventListener("dragstart", event => {
        puzzleImage.style.border = "2px solid blue";
        event.dataTransfer.setData("id", puzzleImage.id);
      });

      puzzleImage.addEventListener("dragend", () => {
        puzzleImage.style.borderWidth = "0";
      });

      let rasterContext = puzzleCanvas.getContext("2d");
      rasterContext.drawImage(canvas,
          canvasWidth * j, canvasHeight * i,
          canvasWidth, canvasHeight,
          0, 0, canvasWidth, canvasHeight);

      puzzleImage.src = puzzleCanvas.toDataURL();

      puzzles.push(puzzleImage);
    }
  }
  shufflePuzzles(puzzles);
}

const notify = msg => {

  const createNotification = () => {
    const notification = new Notification("API Puzzle", {
      body: `${msg}`,
    });

    notification.addEventListener('click', () => {
      location.reload();
    })

    console.log(msg);
  }

  if (!("Notification" in window)) alert("This browser does not support desktop notification... :c");
  else if (Notification.permission === "granted") createNotification();
  else if (Notification.permission !== "denied") {
    Notification.requestPermission().then(permission => {
      if (permission === "granted") createNotification();
    });
  }
}

const validateAligns = () => {
  if(!used) {
    const imageList = document.querySelectorAll('img');
    const idList = Array.from(imageList).map(image => parseInt(image.id));

    for(let i =0; i < idList.length; i++) {
      if (i !== idList[i]) {
        notify('Unfortunately, you didn\'t make it'); break;
      } else if (i === idList.length-1) notify('You did it! :)');
    }
    used = true;
  }
}

const shufflePuzzles = puzzles => {
  let tempId = puzzles.length,  randomId;

  while (tempId !== 0) {
    // Pick a remaining element.
    randomId = Math.floor(Math.random() * tempId);
    tempId--;

    // Puzzles swaping:
    [puzzles[tempId], puzzles[randomId]] = [puzzles[randomId], puzzles[tempId]];
  }

  // Display every puzzle:
  puzzles.forEach(puzzle => {
    PUZZLE_WRAPPER.appendChild(puzzle);
  })
}

MY_LOCALIZATION_BUTTON.addEventListener('click', () => {
  if (!navigator.geolocation) alert("Sorry, there is no geolocation available...");

  navigator.geolocation.getCurrentPosition(position => {
    // Setting location data:
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;

    // Print my location info:
    MY_LOCATION_INFO.innerHTML = `My location: X: ${latitude}, Y: ${longitude}`;

    // Set a location on map:
    map.setView([latitude, longitude]);
    L.marker([latitude, longitude]).addTo(map);

    MY_LOCALIZATION_BUTTON.disabled = true;
    RASTER_BUTTON.disabled = false;
  })
});

RASTER_BUTTON.addEventListener('click', () => {
  alert("Click OK and wait 5 seconds, cutting into puzzles...");
  RASTER_BUTTON.disabled = true;

  // Saving map to image:
  leafletImage(map, (err, canvas) => {
    let width = MAP_CONTAINER.offsetWidth;
    let height = MAP_CONTAINER.offsetHeight;

    // Canvas taken:
    const raster = document.createElement('canvas');

    raster.width = width;
    raster.height = height;

    let rasterContext = raster.getContext("2d");
    rasterContext.drawImage(canvas, 0, 0, width, height);

    // Display a raster:
    MAP_CONTAINER.remove();

    raster.classList = "puzzle-location";
    raster.id = CANVAS_ID;
    MAIN_CONTAINER.prepend(raster);

    // Creating puzzle at last:
    createPuzzle(raster);
  });
});

window.addEventListener('load', () => {
  // Map loading at start:
  map = L.map(MAP_CONTAINER).setView([53.430127, 14.564802], 16);
  L.tileLayer.provider('Esri.WorldImagery').addTo(map);
  let marker = L.marker([53.430127, 14.564802]).addTo(map);
  marker.bindPopup("<strong>This is my Location!</strong><br>");

  // Draggable elements handling:
  for(let i = 0; i < 16; i++) {
    const frag = document.createElement('div');
    frag.style.display = "flex";

    frag.addEventListener("dragenter", event => frag.style.border = "1px solid blue");

    frag.addEventListener("dragleave", event => frag.style.border = "none");

    frag.addEventListener("dragover", event => event.preventDefault());

    frag.addEventListener("drop", event => {
      if(frag.innerHTML.trim() === '') {
        const puzzleTempId = event.dataTransfer.getData('id');
        let tempElement = document.getElementById(puzzleTempId);

        frag.appendChild(tempElement);

        if (PUZZLE_WRAPPER.innerHTML.trim() === '') validateAligns();
      }
    }, false);

    PUZZLE_AREA.appendChild(frag);
  }
});