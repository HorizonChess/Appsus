export function ReviewList({ book, onRemoveReview, onOpenAddReview }) {
    const reviews = book.reviews

    if (!reviews || reviews.length===0) return <section className="reviews">
        <h2>Reviews</h2>
        <ul className="review-list">
            <div className="no-reviews-msg">No reviews yet... </div>
        </ul>
        <button className="review-add-btn" onClick={onOpenAddReview}>Add Review</button>

    </section>


    return <section className="reviews">
        <h2>Reviews</h2>
        <ul className="review-list">
            {reviews.map(review => {
                return <li key={review.id}>
                    <article className="review-card">
                        <hgroup>
                            <p className="review-rating">{'★'.repeat(review.rating)}</p>
                            <h3 className="review-author">{review.fullName}</h3>
                            <p className="review-date">{review.readAt}</p>
                        </hgroup>
                        <p className="review-content">{review.reviewContent}</p>
                        <button onClick={() => onRemoveReview(review.id)}>X</button>
                    </article>
                </li>
            })}
        </ul>
        <button className="review-add-btn" onClick={onOpenAddReview}>Add Review</button>

    </section>



}