export function TitleEditor({ info, onChangeTitle, isEditMode }) {

    if (!isEditMode) return <input
        type="text"
        contentEditable={false}
        className="note-title"
        value={info.title}
        readOnly={true} />

    return <input
        type="text"
        contentEditable={isEditMode}
        placeholder={"Enter title..."}
        className="note-title"
        value={info.title}
        onChange={isEditMode ? ev => onChangeTitle({ ...info, title: ev.target.value }) : ''} />
}