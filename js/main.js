const btn = document.querySelectorAll('.btn');
const resetbtn = document.querySelectorAll('.reset-btn');
const dropZones = document.querySelectorAll('.drop-zone');
const musicalTools = document.querySelectorAll('.m-tools img');
let selectedInstruments = []; 
let volSlider = document.querySelector('#volumeControl');
const rangeSlider = document.getElementById('volumeControl');
const glassIcon = document.querySelector('.fa-wine-glass');
const resetButton = document.getElementById('resetButton');
resetButton.addEventListener('click', resetPositions);
const originalPositions = Array.from(musicalTools).map(tool => ({
    tool: tool,
    parent: tool.parentNode,
    nextSibling: tool.nextSibling
}));
const zimaImages = [
    'images/zimaLime.png',
    'images/zimaGrape.png',
    'images/zimaOrange.png',
    'images/zimaOriginal.png',
    'images/zimaStrawberry.png'
];


for (let i = 0; i < btn.length; i++) {
    btn[i].addEventListener('click', function(e) {
        btn[i].classList.toggle('button-clicked');
        btn[i].querySelector('i').classList.toggle('icon-clicked');
    });
}

for (let i = 0; i < resetbtn.length; i++) {
    resetbtn[i].addEventListener('click', function(e) {
        resetbtn[i].classList.toggle('button-clicked');
        resetbtn[i].querySelector('span').classList.toggle('icon-clicked');
    });
}





function resetPositions() {
    console.log('this page has been refreshed')
    location.reload();
}




function dragStart() {
    console.log('started dragging this piece:', this);
    draggedTool = this;
    setTimeout(() => {
        this.classList.add('hide');
    }, 0);
}

function dragOver(e) {
    e.preventDefault();
    console.log('dragged over me');
}

function displayRandomZima() {
    const randomIndex = Math.floor(Math.random() * zimaImages.length);
    const randomImageUrl = zimaImages[randomIndex];
    const img = document.createElement('img');
    img.src = randomImageUrl;
    const bottleBackground = document.querySelector('.bottle-background');
    bottleBackground.innerHTML = '';
    bottleBackground.appendChild(img);
    setTimeout(function() {
        alert("Congratulation! This Zima drink is best for you!");
    }, 100);
}

function drop(e) {
    e.preventDefault();
    console.log('dropped something on me');
    const initialParent = draggedTool.parentNode;

    if (this.childElementCount === 0) {
        this.appendChild(draggedTool);
        playAudio(draggedTool.id, this);
        const allDropped = Array.from(dropZones).every(zone => zone.childElementCount > 0);
        if (allDropped) {
            displayRandomZima(); 
        }
    } else {
        console.log('Oops! There is already one musical tool!');
        initialParent.appendChild(draggedTool);
    }
    draggedTool.classList.remove('hide');
}




function playAudio(selectedInstrument, selectedDropzone) {
    if (selectedDropzone.childElementCount === 1) {
        const instrument = new Audio(`audio/${selectedInstrument}.wav`);
        instrument.loop = true;
        instrument.play();
        selectedDropzone.appendChild(instrument);
        selectedInstruments.push(instrument); 
        synchronizeAudio();
    }
}

function synchronizeAudio() {
    let maxDuration = 0;
    dropZones.forEach(zone => {
        zone.querySelectorAll('audio').forEach(audio => {
            if (audio.duration > maxDuration) {
                maxDuration = audio.duration;
            }
        });
    });

    dropZones.forEach(zone => {
        zone.querySelectorAll('audio').forEach(audio => {
            audio.currentTime = maxDuration;
        });
    });
}



function pauseAudio() {
    selectedInstruments.forEach(instrument => {
        instrument.pause();
    });
}

function stopAllAudio() {
    selectedInstruments.forEach(instrument => {
        instrument.pause();
    });
    selectedInstruments = []; 
}


playButton.addEventListener('click', function() {
    selectedInstruments.forEach(instrument => {
        instrument.play();
    });
});

pauseButton.addEventListener('click', function() {
    pauseAudio();
});

replayButton.addEventListener('click', function() {
    stopAllAudio();
    musicalTools.forEach(tool => {
        const audio = tool.nextElementSibling; 
        if (audio) {
            audio.currentTime = 0;
            audio.play();
            selectedInstruments.push(audio);
        }
    });
});


volSlider.addEventListener('input', function() {
    console.log(this.value);

    selectedInstruments.forEach(instrument => {
        instrument.volume = this.value / 100;
    });
});



rangeSlider.addEventListener('input', function() {
    const value = rangeSlider.value;
    const blueFill = `linear-gradient(to top, #98E7FF ${value}%, transparent ${value}%)`;
    glassIcon.style.webkitBackgroundClip = 'text';
    glassIcon.style.webkitTextFillColor = 'transparent';
    glassIcon.style.backgroundImage = blueFill;
});


window.addEventListener('load', synchronizeAudio);

musicalTools.forEach(tool => tool.addEventListener("dragstart", dragStart));

dropZones.forEach(zone => {
    zone.addEventListener("dragover", dragOver);
    zone.addEventListener("drop", drop);
});