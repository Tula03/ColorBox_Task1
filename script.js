let clickCount = 0;
let undoStack = [];
let redoStack = [];
const colorBox = document.getElementById('color-box');
const clickCountSpan = document.getElementById('click-count');
const undoList = document.getElementById('undo-list');
const redoList = document.getElementById('redo-list');

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
    touchItem.classList.add('dragging');
}

function handleTouchMove(event) {
    event.preventDefault(); 

    const touch = event.touches[0];
    const target = document.elementFromPoint(touch.clientX, touch.clientY);

    if (target && target.tagName === 'LI' && target !== touchItem) {
        target.classList.add('drag-over');
    }
}

function handleTouchEnd(event, targetListType) {
    event.preventDefault();

    const target = document.elementFromPoint(event.changedTouches[0].clientX, event.changedTouches[0].clientY);

    // Check if the target is a list item
    if (target && target.tagName === 'LI' && target !== touchItem) {
        const targetIndex = Array.from(target.closest('ul').children).indexOf(target); // Get the target index

        const sourceIndex = sourceListType === 'undo'
            ? Array.from(undoList.children).indexOf(touchItem)
            : Array.from(redoList.children).indexOf(touchItem);

        let color = null;

        if (sourceListType === 'undo' && target.closest('ul').id === 'redo-list') {
            color = undoStack.splice(sourceIndex, 1)[0]; // Remove from undo stack
            
            // If target list is empty, just add at index 0
            if (redoStack.length === 0) {
                redoStack.push(color);
            } else {
                redoStack.splice(targetIndex, 0, color); 
            }
        } else if (sourceListType === 'redo' && target.closest('ul').id === 'undo-list') {
            color = redoStack.splice(sourceIndex, 1)[0]; // Remove from redo stack
            
            // If target list is empty, just add at index 0
            if (undoStack.length === 0) {
                undoStack.push(color);
            } else {
                undoStack.splice(targetIndex, 0, color); 
            }
        } else if (sourceListType === 'undo') {
            color = undoStack.splice(sourceIndex, 1)[0]; // Remove from undo stack
            undoStack.splice(targetIndex, 0, color); 
        } else if (sourceListType === 'redo') {
            color = redoStack.splice(sourceIndex, 1)[0]; // Remove from redo stack
            redoStack.splice(targetIndex, 0, color); 
        }

        updateUndoRedoLists();
    } else if (target && target.closest('ul').id === 'redo-list' && redoStack.length === 0) {
        // Handle dropping onto an empty redo list
        color = undoStack.splice(sourceIndex, 1)[0]; 
        redoStack.push(color); 
        updateUndoRedoLists();
    } else if (target && target.closest('ul').id === 'undo-list' && undoStack.length === 0) {
        // Handle dropping onto an empty undo list
        color = redoStack.splice(sourceIndex, 1)[0]; 
        undoStack.push(color);
        updateUndoRedoLists();
    }

    touchItem.classList.remove('dragging');
    touchItem = null;
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
        updateUndoRedoLists();
        colorBox.style.backgroundColor = color;
        clickCountSpan.style.color = getContrastingColor(color); 
        clickCountSpan.textContent = clickCount;
    }
});


const mobileToggleBtn = document.getElementById('mobile-toggle-btn');
mobileToggleBtn.addEventListener('click', function() {
    const lists = document.querySelector('.lists');
    lists.classList.toggle('show-lists');
});

document.getElementById('reset-btn').addEventListener('click', function() {
    // Reset color box and click counter
    colorBox.style.backgroundColor = "#f0f8ff"; 
    clickCount = 0;
    clickCountSpan.textContent = clickCount;
    clickCountSpan.style.color = 'black';
    
    undoStack = [];
    redoStack = [];
    updateUndoRedoLists(); 
});
