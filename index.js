const bookGrid = document.querySelector('#grid');
const newBookBtn = document.querySelector('#new-book');
const form = document.querySelector("dialog");
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

addBookToLibrary("Test","Jeffery","24",true);
addBookToLibrary("Test2","Jefferson","36",false);
addBookToLibrary("Dune", "Frank Herbert", 412, true);
addBookToLibrary("The Hobbit", "J.R.R. Tolkien", 310, false);
addBookToLibrary("1984", "George Orwell", 328, true);
addBookToLibrary("The Catcher in the Rye", "J.D. Salinger", 277, false);

for (const book of myLibrary){
    const card = document.createElement("div");
    card.classList.add("book-card");
    const title = document.createElement("p");
    title.textContent = book.title;
    const author = document.createElement("p");
    author.textContent = book.author;
    const pages = document.createElement("p");
    pages.textContent = book.pages;
    const isRead = document.createElement("p");

    if (book.isRead){
        isRead.textContent = "has been read";
    } else {
        isRead.textContent = "has not been read";
    }
    card.append(title, author, pages, isRead);
    bookGrid.append(card);
}

newBookBtn.addEventListener("click", () => {
    form.showModal();
    const closeBtn = form.querySelector("#close-form");
    closeBtn.addEventListener("click", () => {form.close();})
});