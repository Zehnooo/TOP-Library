const bookGrid = document.querySelector('#grid');
const newBookBtn = document.querySelector('#new-book');
const custDialog = document.querySelector("dialog");
const custForm = custDialog.querySelector("form");
const myLibrary = [];

function Book(title, author, pages, isRead){
    this.id = crypto.randomUUID();
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.isRead = isRead;
}

function addBookToLibrary(title, author, pages, isRead){
    const book = new Book(title, author, pages, isRead);
    myLibrary.push(book);
}

// test books
addBookToLibrary("Test","Jeffery","24",true);
addBookToLibrary("Test2","Jefferson","36",false);
addBookToLibrary("Dune", "Frank Herbert", 412, true);
addBookToLibrary("The Hobbit", "J.R.R. Tolkien", 310, false);
addBookToLibrary("1984", "George Orwell", 328, true);
addBookToLibrary("The Catcher in the Rye", "J.D. Salinger", 277, false);

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
        if (book.isRead === true) {
            isRead.textContent = "has been read";
            readBtn.textContent = "Mark Unread";
            isRead.classList.add("read");
            isRead.classList.remove("unread");
        } else if (book.isRead === false) {
            isRead.textContent = "has not been read";
            readBtn.textContent = "Mark Read";
            isRead.classList.add("unread");
            isRead.classList.remove("read");
        }
    });
    card.append(title, author, pages, isRead, deleteBtn, readBtn);
    return card;
}

// initialize the grid for testing
updateGrid();

newBookBtn.addEventListener("click", () => {custDialog.showModal();})
const closeBtn = custDialog.querySelector("#close-form");
closeBtn.addEventListener("click", () => {custDialog.close();});
const submitBtn = custForm.querySelector("#submit");
submitBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const inputs = custForm.querySelectorAll("input");
    const bookData = [];

    for (const input of inputs) {
        if (input.type === "checkbox") {
            bookData.push(input.checked);
        } else if (input.type === "text") {
            if (input.value === "") {
                alert("Missing book info. Please try again.");
                return;
            } else {
                bookData.push(input.value);
            }
        } else if (input.type === "number") {
            if (input.value <= 0 || input.value === "") {
                alert("Page count cannot be empty or less than zero");
                return;
            } else {
                bookData.push(input.value);
            }
        }
    }
    if (bookData){
        const title = bookData[0];
        const author = bookData[1];
        const pages = bookData[2];
        const isRead = bookData[3];
        addBookToLibrary(title, author, pages, isRead);
        updateGrid();

    }
    custForm.reset();
    custDialog.close();
});


function deleteBook(card){
    const confirmed = confirm("Are you sure?");
    if (confirmed){
        const cardId = card.dataset.bookId;


        const bookToDelete = myLibrary.findIndex(book => book.id === cardId);

        if (bookToDelete !== -1){
            myLibrary.splice(bookToDelete, 1);
        }
        console.log(myLibrary);
        updateGrid();
    }
}