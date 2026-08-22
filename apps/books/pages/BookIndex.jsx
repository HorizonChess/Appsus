const { useState, useEffect } = React
import { utilService } from "../../../services/util.service.js"
import { bookService } from "../services/book.service.js"
import { BookList } from "../cmps/BookList.jsx"
import { BookFilter } from "../cmps/BookFilter.jsx"
import { eventBus } from "../../../services/event-bus.service.js"
const { Link,useSearchParams } = ReactRouterDOM
const {useParams} = ReactRouter

export function BookIndex() {
    const [searchParams,setSearchParams] = useSearchParams()

    const [books, setBooks] = useState([])
    const [filterBy, setFilterBy] = useState(bookService.filterByFromSearchParams(searchParams))

    useEffect(() => {
        bookService.query(filterBy)
            .then((books)=>{
                setBooks(books)
                setSearchParams(filterBy)
    })
        
    }, [filterBy])


    function onSetFilterBy(filterBy) {
        setFilterBy(utilService.trimObj(filterBy))
    }

    function onRemoveBook(bookId) {
        bookService.remove(bookId).then(() => {
            setBooks(books.filter(book => book.id !== bookId))
            eventBus.emit('user-msg',{text:`Book ${bookId} was removed`,type:'success'})
            onClearFilter()
        })
    }

    function onClearFilter() {
        setFilterBy(bookService.getDefaultFilter())
    }


    return <section>
        <BookFilter
            filterBy={filterBy}
            onSetFilterBy={onSetFilterBy}
            onSetSearchParams={setSearchParams
            } />

        <BookList
            books={books}
            onRemoveBook={onRemoveBook} />

        <Link to='/book/add'><button>+</button></Link>
    </section>
}