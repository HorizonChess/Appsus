const { useEffect, useState } = React

const {  Link } = ReactRouterDOM
const { useParams,useNavigate } = ReactRouter

import { bookService } from "../services/book.service.js"
import { eventBus } from "../../../services/event-bus.service.js"

export function BookEdit() {
    const [bookToEdit, setBookToEdit] = useState(bookService.getEmptyBook())
    const params = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        if (params.bookId) {
            bookService.get(params.bookId)
                .then(setBookToEdit)
        }
    }, [])

    function onChangeInput({ target }) {
        const { type, value, name: key } = target
        if (key === 'amount') {
            setBookToEdit(prev => ({ ...prev, listPrice: { ...prev.listPrice, [key]: +value } }))
        } else {
            setBookToEdit(prev => ({ ...prev, [key]: type === 'number' ? +value : value }))
        }
    }

    function onSaveEdit(ev) {
        ev.preventDefault()
        bookService.save(bookToEdit)
            .then(book => {
                eventBus.emit('user-msg', { text: `Book ${book.id} was edited`, type: 'success' })
                navigate('/book')
            })

    }

    return <section className="edit-book">
        <form >
            <label htmlFor="title">Enter the book title</label>
            <input
                name="title"
                type="text"
                onChange={onChangeInput}
                value={bookToEdit.title ? bookToEdit.title : ''}
                placeholder="Enter a book title" />

            <label htmlFor="amount">Enter the book amount</label>
            <input
                name="amount"
                type="number"
                onChange={onChangeInput}
                value={bookToEdit.listPrice.amount ? bookToEdit.listPrice.amount : ''} />

            <input type="submit" onClick={onSaveEdit} value="Save" />

        </form>

        <Link to='/book'><button>back</button></Link>
    </section>

}