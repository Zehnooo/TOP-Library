const bookGrid = document.querySelector('#grid');
const newBookBtn = document.querySelector('#new-book');
const custDialog = document.querySelector("dialog");
const custForm = custDialog.querySelector("#book-form");
const formInputs = custForm.querySelectorAll('input');

const inputElements = {
    'title': document.querySelector('#title'),
    'author': document.querySelector('#author'),
    'pages': document.querySelector('#pages'),
}

const errorElements = {
    'title': document.querySelector('#title-err'),
    'author': document.querySelector('#author-err'),
    'pages': document.querySelector('#pages-err'),
}

const myLibrary = [];

custDialog.addEventListener('close', (e) => {
    custForm.reset();
    for (const input of formInputs){
        if (input.id === 'read') { continue; }
        const errEl = errorElements[input.id];
        errEl.className = 'error';
    }
})

custForm.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        custForm.requestSubmit();
    }
});

custForm.addEventListener('submit', (e) => {
    e.preventDefault();

    for (const input of formInputs){
        if (input.id === 'read') { continue; }
        if (!input.validity.valid) {
            const errEl = errorElements[input.id];
            showError(input, errEl);
        }
    }

    const data = new FormData(e.target);
    const title = data.get('title').trim();
    const author = data.get('author').trim();
    const pages = data.get('pages');
    const isRead = data.get('isRead');

    let missingData = false;

    if (title === '' || !title) {
        showError(inputElements.title, errorElements.title, 'You must enter a title.');
        missingData = true;
    }

    if (author === '' || !author) {
        showError(inputElements.author, errorElements.author, 'You must enter the author.');
        missingData = true;
    }
    if (missingData === true) { return; }
    console.log({title, author, pages, isRead});
    addBookToLibrary(title, author, pages, isRead);
    setGridDisplay();
    updateGrid();
    custForm.reset();
    inputElements.title.focus();
});

for (const input of formInputs){
    setInputValidation(input);
}

function setInputValidation(input){
    let errEl = errorElements[input.id];
    if (!errEl) { return; }

    input.addEventListener('input', (e) => {
        if (input.validity.valid){
            errEl.textContent = '';
            errEl.className = 'error'
        } else {
            showError(input, errEl);
        }
    });
}

function showError(inputEl, errorEl, error = null){
    if (inputEl.validity.valueMissing){
        errorEl.textContent = 'Field cannot be empty';
    } else if (inputEl.validity.rangeUnderflow){
        errorEl.textContent = `You must enter a number bigger than or equal to the minimum (${inputEl.min})`;
    } else if (error) {
        errorEl.textContent = error;
    }
    errorEl.className = 'error active';
}

function setGridDisplay() {
    myLibrary.length === 0
        ? (bookGrid.style.display = "none")
        : (bookGrid.style.display = "grid");
}

class Book {
    constructor(title, author, pages, isRead){
        this.id = crypto.randomUUID();
        this.title = title;
        this.author = author;
        this.pages = pages;
        this.isRead = isRead;
    }
}

function addBookToLibrary(title, author, pages, isRead){
    const book = new Book(title, author, pages, isRead);
    myLibrary.push(book);
}

setGridDisplay();

function updateGrid(){
    bookGrid.textContent = "";
    for (const book of myLibrary){
        bookGrid.append(createBookCard(book));
    }
}

function createBookCard(book){
    const card = document.createElement("div");
    card.classList.add("book-card");
    card.setAttribute("data-book-id", book.id);

    const title = document.createElement("h2");
    title.classList.add("title");
    title.textContent = book.title;

    const author = document.createElement("h3");
    author.classList.add("author");
    author.textContent = `By: ${book.author}`;

    const pages = document.createElement("p");
    pages.classList.add("pages");
    pages.textContent = `Page Count: ${book.pages}`;

    const isRead = document.createElement("p");
    isRead.classList.add("status");

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", () => deleteBook(card));
    deleteBtn.classList.add("delete", "card-button");

    const readBtn = document.createElement("button");
    readBtn.classList.add("mark", "card-button");

    if (book.isRead){
        isRead.textContent = "has been read";
        readBtn.textContent = "Mark Unread";
        isRead.classList.add("read");
    } else {
        isRead.textContent = "has not been read";
        readBtn.textContent = "Mark Read";
        isRead.classList.add("unread");
    }

    readBtn.addEventListener("click", () => {
        book.isRead = !book.isRead;
        if (book.isRead) {
            isRead.textContent = "has been read";
            readBtn.textContent = "Mark Unread";
            isRead.classList.add("read");
            isRead.classList.remove("unread");
        } else {
            isRead.textContent = "has not been read";
            readBtn.textContent = "Mark Read";
            isRead.classList.add("unread");
            isRead.classList.remove("read");
        }
    });

    card.append(title, author, pages, isRead, deleteBtn, readBtn);
    return card;
}

// initialize the grid
updateGrid();

newBookBtn.addEventListener("click", () => { custDialog.showModal(); });

const closeBtn = custDialog.querySelector("#close-form");
closeBtn.addEventListener("click", (e) => {
    e.preventDefault();
    custDialog.close();
});

function deleteBook(card){
    const confirmed = confirm("Are you sure?");
    if (confirmed){
        const cardId = card.dataset.bookId;
        const idx = myLibrary.findIndex(book => book.id === cardId);
        if (idx !== -1){
            myLibrary.splice(idx, 1);
        }
        setGridDisplay();
        updateGrid();
    }
}


