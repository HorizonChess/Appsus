const { useEffect, useState } = React
const { useParams } = ReactRouter
const { Link } = ReactRouterDOM

import { bookService } from "../services/book.service.js"
import { AddReview } from "../cmps/AddReview.jsx"
import { ReviewList } from "../cmps/ReviewList.jsx"

export function BookDetails() {
    const [selectedBook, setSelectedBook] = useState()
    const [addReviewOpen, setAddReviewOpen] = useState(false)

    const {bookId} = useParams()

    useEffect(() => {
        bookService.get(bookId)
            .then(setSelectedBook)
    }, [bookId])



    function getCategoryLabels(selectedBook) {
        return selectedBook.categories.map(category => {
            return <span key={category}
                className={`category-label category-${category.toLowerCase()}`}>{category}</span>
        })
    }

    function getCurrencySymbols({ listPrice }) {
        const { currencyCode } = listPrice
        const codesToSymbols = {
            'EUR': '€',
            'USD': '$',
            'ILS': '₪'
        }
        const symbol = <span>{codesToSymbols[currencyCode]}</span>
        console.log(symbol)

        return <span className="currency-symbol">{codesToSymbols[currencyCode]}</span>
    }

    function onSaveReview(ev, bookId) {
        ev.preventDefault()

        const formData = new FormData(ev.target)
        const review = {
            fullName: formData.get('fullName'),
            rating: +formData.get('rating'),
            readAt: formData.get('readAt'),
            reviewContent: formData.get('reviewContent'),
        }
        ev.target.reset()
        onCloseModal()
        bookService.addReview(bookId, review)
            .then((review) => {
                if (!selectedBook.reviews) {
                    console.log('selectedBook.reviews', selectedBook.reviews)
                    setSelectedBook({ ...selectedBook, reviews: [review] })

                } else {
                    selectedBook.reviews.push(review)
                    setSelectedBook({ ...selectedBook })
                }
                console.log('selectedBook', selectedBook)
                // const book = JSON.parse(JSON.stringify(selectedBook))
            }
            )
    }

    function onRemoveReview(reviewId) {
        bookService.removeReview(selectedBook.id, reviewId)
            .then((reviews) => {
                console.log(reviews)
                selectedBook.reviews = reviews
                setSelectedBook({ ...selectedBook })
            })

    }

    function getIsOnSaleLabel({ listPrice }) {
        const { isOnSale } = listPrice
        if (isOnSale) return <span className="sale-label">On Sale!</span>
    }

    function onOpenAddReview() {
        setAddReviewOpen(true)
    }

    function onCloseModal() {
        setAddReviewOpen(false)

    }

    // למה צריך בuse effect את הselected book בתור state שמשפיע על על ההרצה של האפקט?

    if (!selectedBook) return

    return <section className="book-details" >
        <hgroup>
            <h1>{selectedBook.title} </h1>
            <p className="book-subtitle">{selectedBook.subtitle}</p>
            <p className="book-information">{selectedBook.authors.join()}, {selectedBook && selectedBook.publishedDate}</p>
            <div className="book-categories">{getCategoryLabels(selectedBook)}</div>
        </hgroup>

        <img src={selectedBook.thumbnail} alt="" />

        <p>{selectedBook.description}</p>

        <div className="book-price">Price: {selectedBook.listPrice.amount}{getCurrencySymbols(selectedBook)} {getIsOnSaleLabel(selectedBook)}</div>

        <AddReview
            isOpen={addReviewOpen}
            onCloseModal={onCloseModal}
            onSaveReview={(ev) => onSaveReview(ev, selectedBook.id)} />

        <ReviewList
            book={selectedBook}
            onRemoveReview={onRemoveReview}
            onOpenAddReview={onOpenAddReview} />

        <Link to='/book'><button className="back-btn">Back</button></Link>
        <Link to={`/book/${selectedBook.nextBookId}`}><button className="pagination-btn next-book-btn">Next Book</button></Link>
        <Link to={`/book/${selectedBook.prevBookId}`}><button className="pagination-btn prev-book-btn">Previous Book</button></Link>
    </section>




}