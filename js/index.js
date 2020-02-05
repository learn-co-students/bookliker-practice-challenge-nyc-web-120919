document.addEventListener("DOMContentLoaded", function() {

const BASEURL = 'http://localhost:3000'
const bookUl = document.getElementById('list')


function loadBooks () {
    fetch(`${BASEURL}/books`)
        .then(resp => resp.json())
        .then(books => books.forEach(function(book){
            renderBook(book)
        }))
}

loadBooks();

function renderBook(book){
    let bookLi = document.createElement('li')
    bookLi.innerHTML = `<span data-id=${book.id}>${book.title}</span>`
    bookUl.append(bookLi)
    bookLi.addEventListener('click', function(e){
        if (e.target.tagName === "SPAN"){
            displayThumbnailAndDescription(book)
        }
    })
}


function displayThumbnailAndDescription(book) {
    const targetDiv = document.getElementById('show-panel')
    targetDiv.innerHTML = ""
    let newSpan = document.createElement('span')
    newSpan.innerHTML = `<img src="${book.img_url}"> <p>Description: ${book.description}<p> <button id="like-button">Like <3</button>`
    targetDiv.append(newSpan)
    targetDiv.append(displayUsers(book))
    targetDiv.addEventListener('click', function(e){
        if (e.target.id === "like-button") {
            targetUl = document.getElementById('user-ul')
            let postObj = createLikeObject(book)
            let myObj = {id: 1, username: "pouros"}
            let bigObj = {"users": postObj.users.concat(myObj)}
            userLi = document.createElement('li')
            userLi.innerHTML = "pouros"
            targetUl.append(userLi)
            fetch(`${BASEURL}/books/${book.id}`, {
                method: 'PATCH', 
                headers: {
                    'Content-Type': 'application/json'
                  },
                body: JSON.stringify(bigObj)  
            })
            // .then(resp => resp.json())
            // .then(data => function(){
            //     let li = document.createElement('li')
            //     li.innerHTML = `${data.users[(data.users.length - 1)]}`
            //     targetUl.append(li)
            
        }
    })
}
// .then(data => targetUl.append(data.users[(data.users.length - 1)].username))

function displayUsers(book) {
    let userUl = document.createElement('ul')
    userUl.id = "user-ul"
    book.users.forEach(function(user){
        let userLi = document.createElement('li')
        userLi.innerHTML = `<span data-id="${user.id}">${user.username}</span>`
        userUl.append(userLi)
    })
    return userUl
}

function createLikeObject(book) {
    like_obj =  {'users': book.users}
    return like_obj
}

});