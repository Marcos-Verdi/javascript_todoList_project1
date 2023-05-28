const itemsContainer = document.getElementById("items-container")
const form = document.querySelector(".input-container")
const submitButton = document.getElementById("submit-btn")
const inputBox = document.getElementById("input-box")
const clearList = document.getElementById("clear-btn-list")
const alertMessage = document.getElementById("alert")

let editElement;
let editFlag = false;
let editId = '';

form.addEventListener('submit', addItem)
clearList.addEventListener('click', clearContainer)
window.addEventListener('DOMContentLoaded',setupItems)


function addItem(e) {
    e.preventDefault();
    const value = inputBox.value
    const id = new Date().getTime().toString()
    if(value && !editFlag) {
        createListElement(id, value)
        inputBox.value = '';
        const addingMsg = 'Item was added';
        const addedClass = 'success';
        displayAlert(addingMsg,addedClass);
        addToLocalStorage(id, value);
    } else if (value && editFlag) {
        editElement.innerHTML = value;
        displayAlert("Value has been changed!", "success");
        editFlag = false;
        inputBox.value = "";
        submitButton.textContent = "Submit";
        editElement.parentElement.classList.remove('editing');
        editLocalStorage(editId, value)
    } else {
        displayAlert('Please enter an item','danger')
    }
}


function displayAlert(text, action) {
    alertMessage.textContent = text;
    alertMessage.classList.add(`alert-${action}`);

    setTimeout(function() {
        alertMessage.textContent = "";
        alertMessage.classList.remove(`alert-${action}`);
    }, 2000)
}


function deleteLine(e) {
    const element = e.currentTarget.parentElement.parentElement;
    const id = element.dataset.id;
    itemsContainer.removeChild(element);
    displayAlert("Item was removed","danger");
    removeFromLocalStorage(id);
}


function editLine(e) {
    submitButton.textContent = "Edit";
    const element = e.currentTarget.parentElement.parentElement;
    element.classList.add('editing');
    editElement = e.currentTarget.parentElement.previousElementSibling;
    inputBox.value = editElement.innerHTML;
    editFlag = true;
    editId = element.dataset.id;
}


function clearContainer() {
    const itemsToDelete = document.querySelectorAll('.item');

    if (itemsToDelete.length > 0) {
        itemsToDelete.forEach((i) => {
            itemsContainer.removeChild(i);
        })
        displayAlert('Whole list was deleted', 'danger');
    } else {
        displayAlert('No items to delete', 'danger')
    }    

    localStorage.removeItem("list");
}


function setBackToDefault() {
    inputBox.value = "";
    editFlag = false;
    editId = "";
    submitButton.textContent = "Submit";
}


function addToLocalStorage(id, value) {
    const items = { id:id, value:value };
    let storedItems = getLocalStorage();
    storedItems.push(items);
    localStorage.setItem("list", JSON.stringify(storedItems));
}


function removeFromLocalStorage(id) {
    let storedItems = getLocalStorage();

    storedItems = storedItems.filter(function(item) {
        if(item.id !== id) {
            return item;
        }
    })

    localStorage.setItem("list", JSON.stringify(storedItems));
}


function editLocalStorage(id, value) {
    let storedItems = getLocalStorage();

    storedItems = storedItems.map(item => {
        if (item.id === id) {
            item.value = value;
        }

        return item;
    })

    localStorage.setItem("list", JSON.stringify(storedItems));
}


function getLocalStorage() {
    return localStorage.getItem("list")? JSON.parse(localStorage.getItem("list")): [];
}


function setupItems() {
    let storedItems = getLocalStorage();

    if (storedItems.length > 0) {
        storedItems.forEach(item => {
            createListElement(item.id, item.value)
        })
    }
}

function createListElement(id, value) {
        const element = document.createElement('div')
        let attr = document.createAttribute('data-id')
        attr.value = id
        element.setAttributeNode(attr)
        element.classList.add('item')
        element.innerHTML = `<p class="item-text">${value}</p>
                            <div class="buttons-container">
                                <button class="button-completed" id="edit-btn">
                                    <i class="fa-regular fa-square-check"></i>
                                </button>
                                <button class="button-trash" id="trash-btn">
                                    <i class="fa-solid fa-trash-can"></i>
                                </button>
                            </div>`;
        const editItem = element.querySelector(".button-completed");
        const deleteItem = element.querySelector(".button-trash");
        editItem.addEventListener('click',editLine);
        deleteItem.addEventListener('click',deleteLine);
        
        itemsContainer.appendChild(element);
}