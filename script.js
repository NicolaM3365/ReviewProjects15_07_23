// let data = [];
let filters = {};
let isHighlightSearchActive = false;
let fieldOrder = [];

fetch('library.json')
    .then(response => response.json())
    .then(json => {
        data = json;
        let allKeys = new Set();
        data.forEach(item => {
            Object.keys(item).forEach(key => allKeys.add(key));
        });
        fieldOrder = Array.from(allKeys);
        populateFieldOptions(fieldOrder);
        displayResults(data, fieldOrder);
    });

document.getElementById('search').addEventListener('input', function (e) {
    let searchValue = e.target.value.toLowerCase();
    applyFilters(searchValue);
});

document.getElementById('addRow').addEventListener('click', function (e) {
    addRow();
    
});


document.getElementById('searchHighlight').addEventListener('click', function (e) {
    isHighlightSearchActive = !isHighlightSearchActive;
    displayResults(data, fieldOrder);
});

document.getElementById('resetOrder').addEventListener('click', function (e) {
    resetColumnOrder();
});

function resetColumnOrder() {
    fieldOrder = Array.from(new Set(data.flatMap(Object.keys)));
    displayResults(data, fieldOrder);
    populateFieldOptions(fieldOrder);
}
document.getElementById('scrollLeft').addEventListener('click', function() {
  document.getElementById('tableContainer').scrollBy(-100, 0);
});

document.getElementById('scrollRight').addEventListener('click', function() {
  document.getElementById('tableContainer').scrollBy(100, 0);
});



document.getElementById("sort").style.color = "green";
document.getElementById("sort").style.fontFamily = "Arial";
document.getElementById("sort").style.fontSize = "larger";

function colorElementRed(id) {
    var el = document.getElementById(id);
    el.style.color = "red";
}


function populateFieldOptions(fields) {
    let tableHead = document.getElementById('tableHead');
    tableHead.innerHTML = ''; // Clear the table head
    fields.forEach(field => {
        let th = document.createElement('th');
        th.style.width = '175px';
        let label = document.createElement('div');
        label.textContent = field;
        th.appendChild(label);
        th.style.cursor = 'pointer'; // Change cursor to pointer
        th.setAttribute('data-field', field);
        tableHead.appendChild(th);

        let filterInput = document.createElement('input');
        filterInput.type = 'text';
        filterInput.placeholder = 'Search...';
        filterInput.addEventListener('input', function(e) {
            let searchValue = e.target.value.toLowerCase();
            let field = this.parentNode.getAttribute('data-field');
            filters[field] = searchValue;
            applyFilters();
        });
        th.appendChild(filterInput);
    });


    
    // Add remove button column header
    let removeColumnHeader = document.createElement('th');
    removeColumnHeader.textContent = 'Remove';
    tableHead.appendChild(removeColumnHeader);

    // Make the table header sortable
    Sortable.create(tableHead, {
        animation: 150,
        onEnd: function (/**Event*/evt) {
            let item = fieldOrder[evt.oldIndex];
            fieldOrder.splice(evt.oldIndex, 1);
            fieldOrder.splice(evt.newIndex, 0, item);
            displayResults(data, fieldOrder);
        },
    });
}

function applyFilters() {
    let filteredData = data.filter(item => {
        for (let field in filters) {
            let searchValue = filters[field];
            if (searchValue && !String(item[field]).toLowerCase().includes(searchValue)) {
                return false;
            }
        }
        return true;
    });
    displayResults(filteredData, fieldOrder);
}

function addRow() {
    let tableBody = document.getElementById('tableBody');
    let row = document.createElement('tr');
    for (let i = 0; i < fieldOrder.length; i++) {
        let cell = document.createElement('td');
        td.style.width = '175px';
        cell.textContent = '';
        cell.contentEditable = 'true';
        cell.addEventListener('input', function() {
            cell.classList.add('highlight');
        });
        cell.addEventListener('click', function() {
            cell.classList.remove('highlight');
        });
        row.appendChild(cell);
    }

    // Add remove button cell
    let removeCell = document.createElement('td');
    let removeButton = document.createElement('button');
    removeButton.textContent = 'Remove';
    removeButton.addEventListener('click', function() {
        if (row.classList.contains('strikethrough')) {
            row.classList.remove('strikethrough');
            removeButton.textContent = 'Remove';
        } else {
            row.classList.add('strikethrough');
            removeButton.textContent = 'Undo';
        }
    });
    removeCell.appendChild(removeButton);
    row.appendChild(removeCell);
    tableBody.appendChild(row);
}

// function displayResults(data, fields) {
//     let tableBody = document.getElementById('tableBody');
//     tableBody.innerHTML = '';
//     data.forEach(item => {
//         let row = document.createElement('tr');
//         fields.forEach(field => {
//             let cell = document.createElement('td');
//             cell.textContent = item[field] || '';
//             cell.contentEditable = 'true';
//             cell.addEventListener('input', function() {
//                 cell.classList.add('highlight');
//             });
//             cell.addEventListener('click', function() {
//                 cell.classList.remove('highlight');
//             });
//             row.appendChild(cell);
//         });

//         // Add remove button cell
//         let removeCell = document.createElement('td');
//         let removeButton = document.createElement('button');
//         removeButton.textContent = 'Remove';
//         removeButton.addEventListener('click', function() {
//             if (row.classList.contains('strikethrough')) {
//                 row.classList.remove('strikethrough');
//                 removeButton.textContent = 'Remove';
//             } else {
//                 row.classList.add('strikethrough');
//                 removeButton.textContent = 'Undo';
//             }
//         });
//         removeCell.appendChild(removeButton);
//         row.appendChild(removeCell);
//         tableBody.appendChild(row);
//     });
// }

function displayResults(data, fields) {
    let tableBody = document.getElementById('tableBody');
    tableBody.innerHTML = '';
    data.forEach(item => {
        let row = document.createElement('tr');
        fields.forEach(field => {
            let cellText = item[field] || '';
            let cell = document.createElement('td');
            cell.textContent = cellText;
            cell.title = String(cellText); // Ensure it's a string
            cell.contentEditable = 'true';
            cell.addEventListener('input', function () {
                cell.classList.add('highlight');
            });
            cell.addEventListener('click', function () {
                cell.classList.remove('highlight');
            });
            row.appendChild(cell);
        });

        // Add remove button cell
        let removeCell = document.createElement('td');
        let removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.addEventListener('click', function () {
            if (row.classList.contains('strikethrough')) {
                row.classList.remove('strikethrough');
                removeButton.textContent = 'Remove';
            } else {
                row.classList.add('strikethrough');
                removeButton.textContent = 'Undo';
            }
        });
        removeCell.appendChild(removeButton);
        row.appendChild(removeCell);
        tableBody.appendChild(row);
    });
}


// Get the button
var mybutton = document.getElementById("scrollToTop");

// When the user scrolls down 20px from the top of the document, show the button
window.addEventListener('scroll', function () {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        mybutton.style.display = "block";
    } else {
        mybutton.style.display = "none";
    }
});

// When the user clicks on the button, scroll to the top of the document
mybutton.addEventListener('click', function () {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
});

// Position the button at the bottom right of the screen
mybutton.style.position = "fixed";
mybutton.style.bottom = "0";
mybutton.style.right = "0";
