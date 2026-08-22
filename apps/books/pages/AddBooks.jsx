const { useState, useEffect } = React
import { utilService } from "../../../services/util.service.js"
import { bookService } from "../services/book.service.js"
import { eventBus } from "../../../services/event-bus.service.js"
import { googleBooksService } from "../services/google-book.service.js"
// import { googleBooks } from "../assets/data/google-books.js"

export function AddBooks() {
    const [googleBooksList, setGoogleBookList] = useState()
    const [search, setSearch] = useState()

    useEffect(() => {
        googleBooksService.query(search)
            .then((books) => {
                console.log('books', books)
                setGoogleBookList(books)
            })
    }, [search])

    function onAddBook(addedBook, title) {
        const { id: addedBookId } = addedBook

        bookService.get(addedBookId)
            .then(book => {
                eventBus.emit('user-msg', { text: `Book ${addedBookId} is already in database`, type: 'error' })
            })
            .catch(err => {
                console.log('hi')
                return bookService.addGoogleBook(addedBook)
                    .then(() => {
                        eventBus.emit('user-msg', { text: `Book ${addedBookId} was added`, type: 'success' })
                    })
            })
    }

    function handleChange({ target }) {
        const searchValues = target.value

        const debounceSearch = utilService.debounce(() => setSearch(searchValues), 250)
        debounceSearch(searchValues)
    }

    if (!googleBooksList) return

    return <section className="add-books">
        <h2>Add books</h2>

        <form>
            <input
                onChange={handleChange}
                name="search-book"
                type="text"
                placeholder="search a book" />
        </form>

        <ul className="add-books-list">

            {googleBooksList.map(book => {
                const { volumeInfo: bookInfo, id } = book
                const { title, subtitle } = bookInfo
                return <li key={id}>

                    <div>

                        <hgroup>
                            <h3>{title}</h3>
                            <p>{subtitle}</p>
                        </hgroup>

                        <button onClick={() => onAddBook(book, title)} className="add-book">+</button>
                    </div>
                </li>
            })}

        </ul>
    </section>

}