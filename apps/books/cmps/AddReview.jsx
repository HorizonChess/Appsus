const { useEffect, useRef, useState } = React
export function AddReview({ isOpen, onSaveReview, onCloseModal }) {
    console.log('isOpen', isOpen)

    const [rating, setRating] = useState(1)
    const [ratingType, setRatingType] = useState('rateByStars')
    const elDialog = useRef()

    useEffect(() => {
        setRatingType('rateByStars')

        if (isOpen) elDialog.current.showModal()
        else elDialog.current.close()
    }, [isOpen])

    useEffect(() => {
        setRating(1)
    }, [ratingType, isOpen])

    useEffect(() => {
        setRatingType('rateByStars')
    }, [isOpen])


    function onRatingChange(val) {
        setRating(val)
    }

    return <dialog onClose={onCloseModal} className="add-review" closedby="any" ref={elDialog}>
        <h3>Add a Review</h3>
        <form onSubmit={onSaveReview}>
            <label htmlFor="fullName">Full Name</label>
            <input
                name="fullName"
                type="text" />

            <label htmlFor="rating">{'Rating (1-5)'}</label>
            <div >
                <label htmlFor="rateBySelect">By select</label>
                <input
                    type="radio"
                    name="rating-type"
                    value="rateBySelect"
                    onChange={ev => setRatingType(ev.target.value)}
                    checked={ratingType === "rateBySelect"} />

                <label htmlFor="rateByText">By text</label>
                <input
                    type="radio"
                    name="rating-type"
                    value="rateByText"
                    onChange={ev => setRatingType(ev.target.value)}
                    checked={ratingType === "rateByText"} />

                <label htmlFor="rateByStars">By stars</label>
                <input
                    type="radio"
                    name="rating-type"
                    value="rateByStars"
                    onChange={ev => setRatingType(ev.target.value)}
                    checked={ratingType === "rateByStars"} />
            </div>


            <DynamicRating
                // key = {}
                cmpType={ratingType}
                val={rating}
                onRatingChange={onRatingChange} />

            <label htmlFor="rating">Read At:</label>
            <input name="readAt" type="date" />

            <label htmlFor="reviewContent">Review:</label>
            <textarea name="reviewContent"
            ></textarea>

            <input type="submit" value="Submit Review" />
        </form>
    </dialog>
}


function RateBySelect({ val, onRatingChange }) {

    return <div className="">
        <select value={val} name="rating" onChange={(ev) => onRatingChange(ev.target.value)}>
            <option name="rating" value="1" >1</option>
            <option name="rating" value="2" >2</option>
            <option name="rating" value="3" >3</option>
            <option name="rating" value="4" >4</option>
            <option name="rating" value="5" >5</option>
        </select>

    </div>
}

function RateByText({ val, onRatingChange }) {
    return <div className="">
        <input value={val}
            type="number"
            name="rating"
            min="1"
            max="5"
            onChange={(ev) => onRatingChange(ev.target.value)} />
    </div>
}

function RateByStars({ val, onRatingChange }) {
    console.log(val)

    return <div className="rate-by-stars" >
        <label htmlFor="1">★</label>
        <input type="radio" name="rating" id="1" value={1} checked={`${val}` === "1"} onChange={(ev) => onRatingChange(ev.target.value)} />

        <label htmlFor="2">★</label>
        <input type="radio" name="rating" id="2" value={2} checked={`${val}` === "2"} onChange={(ev) => onRatingChange(ev.target.value)} />

        <label htmlFor="3">★</label>
        <input type="radio" name="rating" id="3" value={3} checked={`${val}` === "3"} onChange={(ev) => onRatingChange(ev.target.value)} />

        <label htmlFor="4">★</label>
        <input type="radio" name="rating" id="4" value={4} checked={`${val}` === "4"} onChange={(ev) => onRatingChange(ev.target.value)} />

        <label htmlFor="5">★</label>
        <input type="radio" name="rating" id="5" value={5} checked={`${val}` === "5"} onChange={(ev) => onRatingChange(ev.target.value)} />
    </div>

}


function DynamicRating(props) {
    const cmpMap = {
        rateBySelect: <RateBySelect {...props} />,
        rateByText: <RateByText {...props} />,
        rateByStars: <RateByStars {...props} />,
    }

    return cmpMap[props.cmpType]
}