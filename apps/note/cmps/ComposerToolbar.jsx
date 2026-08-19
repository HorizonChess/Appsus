export function ComposerToolbar({ onChangeNoteType }) {
    return <div className="composer-toolbar">
        <button className="toolbar-btn" onClick={ev => onChangeNoteType('NoteTodos')}><i className="fa-regular fa-square-check"></i></button>
        <input type="file"
            accept="image/*,.pdf"
            id="note-img-input"
            name="note-img-input"
            className="toolbar-btn" onChange={ev => {
                ev.preventDefault()
                onChangeNoteType('NoteImg',ev)
            }}
        />
        <label htmlFor="note-img-input"><i class="fa-regular fa-image"></i></label>


    </div>
}