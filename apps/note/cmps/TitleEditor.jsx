export function TitleEditor({ info, onChangeTitle }) {
    console.log('info',info)
    return <input
        type="text"
        placeholder="Enter title..."
        className="note-title"
        value={info.title}
        onChange={ev => onChangeTitle({ ...info, title: ev.target.value })} />
}