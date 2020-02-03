let allBooks = []
let allUsers = []

document.addEventListener("DOMContentLoaded", function () {
    getBooks()
    getUsers()
});

function getBooks() {
    fetch('http://localhost:3000/books')
        .then(resp => resp.json())
        .then(json => {
            allBooks = json
            renderBooks()
        })
}

function getUsers() {
    fetch('http://localhost:3000/users')
        .then(resp => resp.json())
        .then(json => {
            allUsers = json
            console.log(json)
        })
}

function renderBooks() {
    console.log(allBooks)
    const list = document.getElementById('list')
    allBooks.forEach(book => {
        const li = document.createElement('li')
        li.innerText = book.title
        li.addEventListener('click', clickTitle)
        list.appendChild(li)
    })
}

function clickTitle(event) {
    const title = event.target.innerText
    const book = allBooks.find(x => x.title === title)
    const div = document.createElement('div')
    div.innerHTML = `
        <h2>${book.title}</h2>
        <img src=${book.img_url} />
        <h4>Description</h4>
        <p>${book.description}</p>
        <h4>Liked By Users:</h4>
    `
    addLikedByUsers(div, book)
    addLikeButton(div, book)
    const showPanel = document.getElementById('show-panel')
    showPanel.innerHTML = ''
    showPanel.appendChild(div)
}

function addLikedByUsers(div, book) {
    let ul = document.createElement('ul')
    ul.id = 'liked-by'
    book.users.forEach(user => {
        const li = document.createElement('li')
        li.innerText = user.username
        ul.appendChild(li)
    })
    div.appendChild(ul)
}

function addLikeButton(div, book) {
    let button = document.createElement('button')
    let user = book.users.find(x => x.username === allUsers[0].username)
    button.innerText = user ? 'Unlike Book' : 'Like Book'
    button.addEventListener('click', handleLikeClick)
    div.appendChild(button)
}

function handleLikeClick(event) {
    const book = findBook(event)
    let user = book.users.find(x => x.username === allUsers[0].username)
    if(user) {
        unlikeBook(book)
        event.target.innerText = 'Like Button'
    }
    else {
        likeBook(book)
        event.target.innerText = 'Unlike Button'
    }
}

function findBook(event) {
    const title = event.target.parentNode.firstElementChild.innerText
    return allBooks.find(x => x.title === title)
}

function likeBook(book) {
    book.users.push(allUsers[0])
    const ul = document.getElementById('liked-by')
    const li = document.createElement('li')
    li.innerText = allUsers[0].username
    ul.appendChild(li)
    updateBook(book)
}

function unlikeBook(book) {
    const index = book.users.findIndex(x => x.username === allUsers[0].username)
    if(index > -1)
        book.users.splice(index, 1)
    updateBook(book)
    const ul = document.getElementById('liked-by')
    Array.from(ul.children).find(li => li.innerText == allUsers[0].username).remove()
}

function updateBook(book) {
    fetch(`http://localhost:3000/books/${book.id}`, {
        method: 'PATCH',
        headers:
        {
            "Content-Type": "application/json",
            Accept: "application/json"
        },
        body: JSON.stringify(book)
    })
}