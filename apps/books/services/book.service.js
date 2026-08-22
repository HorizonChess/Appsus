import { storageService } from './async-storage.service.js'
import { utilService } from '../../../services/util.service.js'

const BOOKS_KEY = 'books'
_createBooks()

export const bookService = {
    query,
    get,
    save,
    remove,
    getEmptyBook,
    getDefaultFilter,
    addReview,
    removeReview,
    _getAdjacentBooks,
    addGoogleBook,
    filterByFromSearchParams
}


window.bs = bookService

function query(filterBy = {}) {
    return storageService.query(BOOKS_KEY)
        .then(books => {
            if (filterBy.title) {
                const regExp = new RegExp(filterBy.title, 'i')
                books = books.filter(books => regExp.test(books.title))
            }

            if (filterBy.price) {
                books = books.filter(book => book.listPrice.amount >= filterBy.price)
            }

            return books
        })
}

function get(bookId) {
    return storageService.get(BOOKS_KEY, bookId)
        .then(book => {
            book = _getAdjacentBooks(bookId)
            return book
        })
}

function save(book) {
    if (book.id) {
        return storageService.put(BOOKS_KEY, book)
    } else {
        return storageService.post(BOOKS_KEY, book)
    }
}

function remove(bookId) {
    return storageService.remove(BOOKS_KEY, bookId)
}

function _createBooks() {
    let books = utilService.loadFromStorage(BOOKS_KEY)
    if (!books || !books.length) {
        const books = []

        for (let i = 0; i < 20; i++) {
            books.push(_createBook(i))
        }

        utilService.saveToStorage(BOOKS_KEY, books)
    }
}

function _createBook(thumbnailIdx) {
    const book = getEmptyBook(thumbnailIdx)
    book.title = utilService.makeLorem(2)
    book.listPrice.amount = utilService.getRandomIntInclusive(80, 500)
    book.id = utilService.makeId()
    return book
}

function getDefaultFilter(filterBy = { title: '', price: 0 }) {
    return { title: filterBy.title, price: filterBy.price }
}

function getEmptyBook(thumbnailNum,) {
    const ctgs = ['Love', 'Fiction', 'Poetry', 'Computers', 'Religion']

    return {
        subtitle: utilService.makeLorem(4),
        authors: [
            utilService.makeLorem(1)
        ],
        listPrice: {
            currencyCode: "EUR",
            isOnSale: Math.random() > 0.7
        },
        publishedDate: utilService.getRandomIntInclusive(1950, 2024),
        description: utilService.makeLorem(20),
        pageCount: utilService.getRandomIntInclusive(20, 600),
        categories: [ctgs[utilService.getRandomIntInclusive(0, ctgs.length - 1)]],
        thumbnail: `http://coding-academy.org/books-photos/${thumbnailNum ? thumbnailNum + 1 : utilService.getRandomIntInclusive(1, 20)}.jpg`,
        language: "en"
    }
}

function _getAdjacentBooks(bookId) {
    return query()
        .then((books) => {
            const bookIdx = books.findIndex(book => book.id === bookId)
            const nextBook = bookIdx + 1 === books.length ? books[0] : books[bookIdx + 1]
            const prevBook = bookIdx - 1 < 0 ? books[books.length - 1] : books[bookIdx - 1]

            return { ...books[bookIdx], prevBookId: prevBook.id, nextBookId: nextBook.id }
        })
}

function addReview(bookId, review) {
    return get(bookId)
        .then(book => {
            review.id = utilService.makeId()
            if (book.reviews) {
                book.reviews.push(review)
            } else {
                book.reviews = [review]
            }

            storageService.put(BOOKS_KEY, book)
            return review
        })
}
function removeReview(bookId, reviewId) {
    return get(bookId)
        .then(book => {
            const reviewIdx = book.reviews.findIndex(review => review.id === reviewId)
            book.reviews.splice(reviewIdx, 1)
            storageService.put(BOOKS_KEY, book)
            return book.reviews
        })
}

function addGoogleBook(item) {
    // const book = { ...item }

    const { volumeInfo: bookInfo, id } = item
    const { title, subtitle, authors, publishedDate, description, pageCount, imageLinks, categories } = bookInfo
    const { thumbnail } = imageLinks

    const book = {
        id,
        title,
        subtitle,
        authors,
        listPrice: {
            amount: utilService.getRandomIntInclusive(80, 500),
            currencyCode: "EUR",
            isOnSale: Math.random() > 0.7
        },
        publishedDate,
        description,
        pageCount,
        categories,
        thumbnail,
        language: "en"
    }

    return storageService.post(BOOKS_KEY, book)
}

function filterByFromSearchParams(searchParams) {
    const defaultFilter = getDefaultFilter()
    const filterBy = {}

    for (const filterField in defaultFilter) {
        filterBy[filterField] = searchParams.get(filterField)? searchParams.get(filterField) : ''
    }
    console.log('filterBy',filterBy)
    return filterBy
}