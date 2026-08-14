export function NoteTxt({ txtValue, onInputChange,id }) {

    
    return <div className="add-txt">
        <input
            className="add-input txt"
            type='text'
            value={txtValue}
            placeholder="Enter Text"
            onChange={onInputChange}
            name={id}
            id={id}>

        </input>
    </div>
}