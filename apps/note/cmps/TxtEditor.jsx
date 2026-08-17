export function TxtEditor({ info, onChangeVal, isEditMode }) {
    if (!isEditMode) return <div className="note-edit-content">
        <textarea
            type="text"
            contentEditable={false}
            className="note-txt"
            value={info.txt} 
            readOnly={true}/>
    </div>

    return <div className="note-edit-content">
        <textarea
            type="text"
            placeholder="Enter text..."
            className="note-txt"
            value={info.txt}
            onChange={isEditMode ? ev => onChangeVal({ ...info, txt: ev.target.value }) : ''} />
    </div>

}