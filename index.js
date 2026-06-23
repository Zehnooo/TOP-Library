const bookGrid = document.querySelector('#grid');
const newBookBtn = document.querySelector('#new-book');
const custDialog = document.querySelector("dialog");
const custForm = custDialog.querySelector("#book-form");
const formInputs = custForm.querySelectorAll('input');
/*
const titleInput =
const authorInput =
const pageInput =
const readInput =

 */
const myLibrary = [];

custForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!custForm.checkValidity()) {
        custForm.reportValidity();
        return;
    }
    const data = new FormData(e.target);
    const title = data.get('title');
    const author = data.get('author');
    const pages = data.get('pages');
    const isRead = data.get('isRead');
    console.log({title, author, pages, isRead});
    addBookToLibrary(title, author, pages, isRead);
    setGridDisplay();
    updateGrid();
    custForm.reset();
    custDialog.close();

});

for (const input of formInputs) {
    console.log(input);
    input.addEventListener('input', (e) => {
        if (input.validity.valueMissing) {
            input.setCustomValidity('This field is required.');
        } else if (input.validity.rangeUnderflow) {
            input.setCustomValidity('Page count must be at least 1.');
        } else {
            input.setCustomValidity('');
        }
    });
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

/*
const submitBtn = custForm.querySelector("#submit");
submitBtn.addEventListener("click", (e) => {
    e.preventDefault();
    // saveBook();
    setGridDisplay();
    updateGrid();
    custForm.reset();
    custDialog.close();
});
*/

const submitAndNew = document.querySelector("#submit-more");
submitAndNew.addEventListener("click", (e) => {
    e.preventDefault();
    setGridDisplay();
    updateGrid();
    custForm.reset();
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


