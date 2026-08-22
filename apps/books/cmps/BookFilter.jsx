const { useState, useEffect } = React
export function BookFilter({ filterBy, onSetFilterBy,  onSetSearchParams}) {
    const [editFilterBy, setEditFilterBy] = useState(filterBy)
    // איך היה נכון פה לשנות את הprice? זה הרי שדה מקונן אז איך היה אפשר לגשת אליו כשאננחנו שמים אותו בname של האינפוט?

    useEffect(() => {
        onSetFilterBy(editFilterBy)
    }, [editFilterBy])

    // Why use useState and useEffect here?
    function onChangeFilter({ target }) {
        var inputValue = target.value
        if (target.type === 'number') inputValue = +inputValue

        const newFilter = { ...editFilterBy, [target.name]: inputValue }
        setEditFilterBy(newFilter)
    }

    return <fieldset className="book-filter">
        <label htmlFor="title">Search a Book</label>
        <input name='title'
            onChange={onChangeFilter}
            type="text"
            placeholder="search"
            value={filterBy && filterBy.title ? filterBy.title : ''} />

        <label htmlFor="price">Filter By Price</label>
        <input name='price'
            onChange={onChangeFilter}
            type="number"
            value={filterBy && filterBy.price ? filterBy.price : ''} />
    </fieldset>
}