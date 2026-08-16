export function NoteTxt({ txtValue, onInputChange,id,placeholder}) {

    
    return <div className="add-txt">
        <input
            className="add-input txt"
            type='text'
            value={txtValue}
            placeholder={placeholder}
            onChange={onInputChange}
            name={id}
            id={id}>

        </input>
    </div>
}