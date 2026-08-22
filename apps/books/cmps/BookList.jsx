import { BookPreview } from "./BookPreview.jsx"
const { Link } = ReactRouterDOM

export function BookList({ books, onRemoveBook }) {
    console.log(books)
    return <ul className="book-list">
        {books.map((book) => {
            return <li className="book-card" key={book.id}>

                <BookPreview book={book} />

                <Link to={`/book/${book.id}`}>
                    <button className="card-action-btn" >Details</button>
                </Link>

                <Link to={`/book/edit/${book.id}`}>
                    <button className="card-action-btn" >Edit</button>
                </Link>

                <button onClick={() => onRemoveBook(book.id)}>X</button>
            </li>
        })}
    </ul>
}