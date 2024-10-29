let clickCount = 0;
let undoStack = [];
let redoStack = [];
const colorBox = document.getElementById('color-box');
const clickCountSpan = document.getElementById('click-count');
const undoList = document.getElementById('undo-list');
const redoList = document.getElementById('redo-list');
const listsContainer = document.querySelector('.lists');
const mobileToggleBtn = document.getElementById('mobile-toggle-btn'); 
const mobileListBtn = document.getElementById('mobile-list-btn'); 

let startX; 
let touchItem; 
let sourceListType; 
const SWIPE_THRESHOLD = 30; 

// Function to generate random color
function getRandomColor() {
    let r, g, b;
    do {
        r = Math.floor(Math.random() * 256);
        g = Math.floor(Math.random() * 256);
        b = Math.floor(Math.random() * 256);
    } while (
        (r === g && g === b) || (r < 50 && g < 50 && b < 50) || (r > 200 && g > 200 && b > 200) || (Math.abs(r - g) < 30 && Math.abs(g - b) < 30 && Math.abs(r - b) < 30)
    );
    return `rgb(${r},${g},${b})`;
}

// Function to get contrasting color
function getContrastingColor(rgbColor) {
    const rgb = rgbColor.match(/\d+/g);
    const r = parseInt(rgb[0]);
    const g = parseInt(rgb[1]);
    const b = parseInt(rgb[2]);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128 ? 'black' : 'white';
}

// Update undo/redo lists
function updateUndoRedoLists() {
    undoList.innerHTML = undoStack.map((color, index) => 
        `<li style="background-color: ${color};" draggable="true" data-index="${index}"></li>`
    ).join('');

    redoList.innerHTML = redoStack.map((color, index) => 
        `<li style="background-color: ${color};" draggable="true" data-index="${index}"></li>`
    ).join('');

    addDragAndDropHandlers();  
}

function addDragAndDropHandlers() {
    const undoItems = undoList.querySelectorAll('li');
    const redoItems = redoList.querySelectorAll('li');

    undoItems.forEach(item => {
        addDragEvents(item, 'undo');
    });

    redoItems.forEach(item => {
        addDragEvents(item, 'redo');
    });
}

function addColorBoxDragEvents() {
    colorBox.addEventListener('dragover', handleDragOver);
    colorBox.addEventListener('drop', handleColorBoxDrop);
}

function addDragEvents(item, listType) {
    if (screen.width > 768) {
        // Desktop drag events
        item.addEventListener('dragstart', handleDragStart);
        item.addEventListener('dragover', handleDragOver);
        item.addEventListener('dragenter', handleDragEnter);
        item.addEventListener('dragleave', handleDragLeave);
        item.addEventListener('drop', (event) => handleDrop(event, listType));
        item.addEventListener('dragend', handleDragEnd);
    } else {
        // Mobile touch events
        item.addEventListener('touchstart', handleTouchStart);
        item.addEventListener('touchmove', handleTouchMove);
        item.addEventListener('touchend', (event) => handleTouchEnd(event, listType));
    }
}

function handleTouchStart(event) {
    touchItem = event.target;
    sourceListType = touchItem.closest('ul').id.includes('undo') ? 'undo' : 'redo';
    startX = event.touches[0].clientX; // Get the starting X position
    touchItem.classList.add('dragging');
}

function handleTouchMove(event) {
    event.preventDefault();
}

function handleTouchEnd(event) {
    event.preventDefault();
    const endX = event.changedTouches[0].clientX; // Get the ending X position
    const distanceX = endX - startX; // Calculate the distance of the swipe

    // Determine swipe direction
    if (Math.abs(distanceX) > SWIPE_THRESHOLD) {
        if (distanceX > 0) {
            // Swiped right
            handleSwipeRight();
        } else {
            // Swiped left
            handleSwipeLeft();
        }
    }

    touchItem.classList.remove('dragging');
    touchItem = null;
}

function handleSwipeRight() {
    const targetIndex = Array.from(redoList.children).length; // Set to the end of the redo list
    const sourceIndex = Array.from(undoList.children).indexOf(touchItem);

    // Move color from undo to redo list
    if (sourceListType === 'undo' && undoStack.length > 0) {
        const color = undoStack.splice(sourceIndex, 1)[0];
        redoStack.push(color);
        updateUndoRedoLists();
    }
}

function handleSwipeLeft() {
    const targetIndex = Array.from(undoList.children).length; // Set to the end of the undo list
    const sourceIndex = Array.from(redoList.children).indexOf(touchItem);

    // Move color from redo to undo list
    if (sourceListType === 'redo' && redoStack.length > 0) {
        const color = redoStack.splice(sourceIndex, 1)[0];
        undoStack.push(color);
        updateUndoRedoLists();
    }
}

function handleDragStart(event) {
    draggedItem = event.target;
    sourceListType = event.target.closest('ul').id.includes('undo') ? 'undo' : 'redo';
    setTimeout(() => {
        event.target.classList.add('dragging');
    }, 0);
}

function handleDragOver(event) {
    event.preventDefault(); 
}

function handleDragEnter(event) {
    event.target.classList.add('drag-over');
}

function handleDragLeave(event) {
    event.target.classList.remove('drag-over');
}

function handleDrop(event, targetListType) {
    event.preventDefault();
    event.target.classList.remove('drag-over');

    const sourceIndex = parseInt(draggedItem.getAttribute('data-index'));
    let color = null;

    // Get the color from the source stack
    if (sourceListType === 'undo') {
        color = undoStack.splice(sourceIndex, 1)[0];
    } else if (sourceListType === 'redo') {
        color = redoStack.splice(sourceIndex, 1)[0];
    }

    let targetIndex;
    const targetList = event.target.closest('ul');

    // Check if dropped on a list item or the list itself
    if (event.target.tagName === 'LI') {
        targetIndex = parseInt(event.target.getAttribute('data-index'));
    } else if (targetList) {
        if (targetList.id === 'redo-list' && redoStack.length === 0) {
            targetIndex = 0; 
        } else if (targetList.id === 'undo-list' && undoStack.length === 0) {
            targetIndex = 0; 
        } else {
            targetIndex = targetListType === 'undo' ? undoStack.length : redoStack.length;
        }
    }

    // Add color to the appropriate stack
    if (targetListType === 'undo') {
        undoStack.splice(targetIndex, 0, color);
    } else if (targetListType === 'redo') {
        redoStack.splice(targetIndex, 0, color);
    }

    // Update the lists after reordering
    updateUndoRedoLists();
    draggedItem = null;
}

function handleColorBoxDrop(event) {
    event.preventDefault();
    const color = draggedItem.style.backgroundColor;
    colorBox.style.backgroundColor = color;
    clickCountSpan.style.color = getContrastingColor(color);
}

function handleDragEnd() {
    draggedItem.classList.remove('dragging');
    draggedItem = null;
}

updateUndoRedoLists();
addColorBoxDragEvents();

document.getElementById('color-btn').addEventListener('click', function () {
    const currentColor = colorBox.style.backgroundColor || "rgb(255,255,255)"; 
    undoStack.push(currentColor);

    const newColor = getRandomColor();
    clickCount++;
    clickCountSpan.textContent = clickCount;
    colorBox.style.backgroundColor = newColor;
    clickCountSpan.style.color = getContrastingColor(newColor);
    redoStack = [];
    updateUndoRedoLists();
});

document.getElementById('undo-btn').addEventListener('click', function () {
    const currentColor = colorBox.style.backgroundColor || "rgb(255,255,255)"; 
    if (undoStack.length > 0) {
        redoStack.push(currentColor); 
        const color = undoStack.pop();
        colorBox.style.backgroundColor = color;
        clickCountSpan.style.color = getContrastingColor(color);
        updateUndoRedoLists(); 
        clickCountSpan.textContent = clickCount;
    }
});

document.getElementById('redo-btn').addEventListener('click', function () {
    if (redoStack.length > 0) {
        const color = redoStack.pop();
        undoStack.push(color);
        colorBox.style.backgroundColor = color;
        clickCountSpan.style.color = getContrastingColor(color);
        updateUndoRedoLists(); 
        clickCountSpan.textContent = clickCount;
    }
});

// Toggle button functionality for mobile view
mobileListBtn.addEventListener('click', () => {
    listsContainer.classList.toggle('show-lists');
    if (listsContainer.classList.contains('show-lists')) {
        listsContainer.classList.add('undo-visible');
        listsContainer.classList.remove('redo-visible');
    } else {
        listsContainer.classList.remove('undo-visible', 'redo-visible');
    }
});

mobileToggleBtn.addEventListener('click', () => {
    if (listsContainer.classList.contains('undo-visible')) {
        listsContainer.classList.remove('undo-visible');
        listsContainer.classList.add('redo-visible');
    } else {
        listsContainer.classList.remove('redo-visible');
        listsContainer.classList.add('undo-visible');
    }
});
document.getElementById('reset-btn').addEventListener('click', function() {
    colorBox.style.backgroundColor = "#f0f8ff"; 
    clickCount = 0;
    clickCountSpan.textContent = clickCount;
    clickCountSpan.style.color = 'black';
    
    undoStack = [];
    redoStack = [];
    updateUndoRedoLists(); 
});
