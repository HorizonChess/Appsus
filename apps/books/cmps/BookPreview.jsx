export function BookPreview({ book,selectBook }) {
    const { title, listPrice, thumbnail, id } = book
    const { amount, currencyCode } = listPrice

    return <article className="book-preview" key={id}>
        <h3>{title}</h3>
        <img src={thumbnail} alt="" />
        <p>Price: {amount + ' ' + currencyCode}</p>
    </article>
}